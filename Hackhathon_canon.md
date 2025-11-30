# HACKATHON_CANON.md

> **Comprehensive Reference Guide for Building Linera Applications**
> 
> This document summarizes patterns, hooks, components, configuration, deployment steps, and best practices from the Linera Protocol repository.

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Application Structure Patterns](#application-structure-patterns)
3. [SDK Traits & Macros](#sdk-traits--macros)
4. [Views & State Management](#views--state-management)
5. [Contract Patterns](#contract-patterns)
6. [Service Patterns](#service-patterns)
7. [Cross-Chain Messaging](#cross-chain-messaging)
8. [Runtime Hooks & Methods](#runtime-hooks--methods)
9. [Configuration](#configuration)
10. [Deployment Steps (IMPORTANT)](#deployment-steps-important)
11. [Best Practices](#best-practices)
12. [Testing](#testing)
13. [Common Patterns by Example](#common-patterns-by-example)

---

## Core Architecture

### Linera Application Anatomy

A Linera application consists of **two WebAssembly binaries**:

1. **Contract** - Executes operations and messages, modifies state (gas-metered)
2. **Service** - Handles GraphQL queries, read-only access (not gas-metered)

Both share access to the same application state stored in a key-value database.

### Repository Structure

```
linera-protocol/
├── linera-sdk/           # Application SDK
├── linera-views/         # State management framework
├── linera-execution/     # Runtime execution
├── linera-chain/         # Block & message handling
├── linera-core/          # Core protocol
├── linera-service/       # CLI & node service
├── examples/             # Example applications
│   ├── counter/          # Simple counter
│   ├── fungible/         # Fungible token
│   ├── social/           # Social media with streams
│   ├── crowd-funding/    # Composable apps
│   └── ...
```

---

## Application Structure Patterns

### Standard File Layout

```
my-app/
├── Cargo.toml
├── src/
│   ├── lib.rs         # ABI definitions
│   ├── contract.rs    # Contract implementation
│   ├── service.rs     # Service implementation
│   └── state.rs       # State structures
├── tests/
│   └── cross_chain.rs # Integration tests
└── web-frontend/      # Optional frontend
```

### Cargo.toml Template

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[dependencies]
async-graphql.workspace = true
futures.workspace = true
linera-sdk.workspace = true
serde.workspace = true
serde_json.workspace = true

[target.'cfg(not(target_arch = "wasm32"))'.dev-dependencies]
linera-sdk = { workspace = true, features = ["test", "wasmer"] }
tokio = { workspace = true, features = ["rt", "sync"] }

[dev-dependencies]
assert_matches.workspace = true
linera-sdk = { workspace = true, features = ["test"] }

[[bin]]
name = "my_app_contract"
path = "src/contract.rs"

[[bin]]
name = "my_app_service"
path = "src/service.rs"
```

---

## SDK Traits & Macros

### Contract Trait

```rust
#[allow(async_fn_in_trait)]
pub trait Contract: WithContractAbi + ContractAbi + Sized {
    /// Message type for cross-chain communication
    type Message: Serialize + DeserializeOwned + Debug;
    
    /// Immutable parameters (e.g., token name)
    type Parameters: Serialize + DeserializeOwned + Clone + Debug;
    
    /// Instantiation argument (e.g., initial token supply)
    type InstantiationArgument: Serialize + DeserializeOwned + Debug;
    
    /// Event values for streams
    type EventValue: Serialize + DeserializeOwned + Debug;

    /// Load contract from storage
    async fn load(runtime: ContractRuntime<Self>) -> Self;
    
    /// Initialize application (called once on creation)
    async fn instantiate(&mut self, argument: Self::InstantiationArgument);
    
    /// Execute user operation
    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response;
    
    /// Process incoming cross-chain message
    async fn execute_message(&mut self, message: Self::Message);
    
    /// React to stream events (optional)
    async fn process_streams(&mut self, _updates: Vec<StreamUpdate>) {}
    
    /// Persist state changes
    async fn store(self);
}
```

### Service Trait

```rust
#[allow(async_fn_in_trait)]
pub trait Service: WithServiceAbi + ServiceAbi + Sized {
    /// Immutable parameters
    type Parameters: Serialize + DeserializeOwned + Send + Sync + Clone + Debug + 'static;

    /// Create service instance
    async fn new(runtime: ServiceRuntime<Self>) -> Self;
    
    /// Handle GraphQL query
    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse;
}
```

### Essential Macros

```rust
// Export contract implementation
linera_sdk::contract!(MyContract);

// Export service implementation
linera_sdk::service!(MyService);

// Derive RootView for state
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct MyState { ... }
```

---

## Views & State Management

### Available View Types

| View Type | Purpose | Analog |
|-----------|---------|--------|
| `RegisterView<T>` | Single value | Single variable |
| `LogView<T>` | Append-only list | `VecDeque` |
| `QueueView<T>` | FIFO queue | `VecDeque` |
| `MapView<K, V>` | Key-value map | `BTreeMap` |
| `SetView<K>` | Set of keys | `BTreeSet` |
| `CollectionView<K, V>` | Map of views | Nested maps |
| `ReentrantCollectionView<K, V>` | Independent key access | Concurrent map |
| `CustomMapView<K, V>` | Custom serialization | Specialized map |

### State Definition Pattern

```rust
use linera_sdk::views::{linera_views, RegisterView, MapView, LogView, RootView, ViewStorageContext};

#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct MyAppState {
    // Single value
    pub counter: RegisterView<u64>,
    
    // Map: account -> balance
    pub accounts: MapView<AccountOwner, Amount>,
    
    // Log of events
    pub history: LogView<Event>,
}
```

### State Operations

```rust
// Reading
let value = self.state.counter.get();
let balance = self.state.accounts.get(&owner).await?;

// Writing
self.state.counter.set(42);
self.state.accounts.insert(&owner, amount).await?;
self.state.history.push(event);

// Removing
self.state.accounts.remove(&owner)?;

// Iteration
for (key, value) in self.state.accounts.iter().await? {
    // Process each entry
}
```

---

## Contract Patterns

### Basic Contract Template

```rust
#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::WithContractAbi,
    views::{RootView, View},
    Contract, ContractRuntime,
};

pub struct MyContract {
    state: MyState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(MyContract);

impl WithContractAbi for MyContract {
    type Abi = MyAbi;
}

impl Contract for MyContract {
    type Message = MyMessage;
    type Parameters = MyParameters;
    type InstantiationArgument = MyInstantiationArg;
    type EventValue = MyEvent;

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = MyState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        MyContract { state, runtime }
    }

    async fn instantiate(&mut self, arg: MyInstantiationArg) {
        // Validate parameters
        let _ = self.runtime.application_parameters();
        
        // Initialize state
        self.state.initialize(arg).await;
    }

    async fn execute_operation(&mut self, operation: MyOperation) -> MyResponse {
        match operation {
            MyOperation::DoSomething { param } => {
                // Check permissions if needed
                self.runtime.check_account_permission(owner)?;
                
                // Execute logic
                self.state.do_something(param).await;
                
                MyResponse::Success
            }
        }
    }

    async fn execute_message(&mut self, message: MyMessage) {
        match message {
            MyMessage::Credit { amount, target } => {
                self.state.credit(target, amount).await;
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}
```

### Operation vs Message Pattern

**Operations:**
- User-initiated actions
- Start on the current chain
- Require authentication
- Can trigger cross-chain messages

**Messages:**
- Cross-chain communication
- Sent between application instances
- Atomic delivery not guaranteed
- Can bounce if rejected

---

## Service Patterns

### GraphQL Service Template

```rust
#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;
use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use linera_sdk::{linera_base_types::WithServiceAbi, views::View, Service, ServiceRuntime};

pub struct MyService {
    state: Arc<MyState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(MyService);

impl WithServiceAbi for MyService {
    type Abi = MyAbi;
}

impl Service for MyService {
    type Parameters = MyParameters;

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = MyState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        MyService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            self.state.clone(),
            MutationRoot { runtime: self.runtime.clone() },
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}

struct MutationRoot {
    runtime: Arc<ServiceRuntime<MyService>>,
}

#[Object]
impl MutationRoot {
    async fn do_something(&self, param: String) -> Vec<u8> {
        let operation = MyOperation::DoSomething { param };
        self.runtime.schedule_operation(&operation);
        vec![] // Return block hash placeholder
    }
}
```

### Query vs Mutation

**Queries:**
- Read-only
- Direct state access
- No blockchain interaction
- Fast execution

**Mutations:**
- Schedule operations for contract
- Trigger block creation
- Return operation hash
- Async execution

---

## Cross-Chain Messaging

### Sending Messages

```rust
// Simple message (single receiver)
self.runtime.send_message(target_chain_id, Message::Transfer { ... });

// Message with options
self.runtime
    .prepare_message(Message::Credit { amount, target })
    .with_authentication()      // Verify sender identity
    .with_tracking()            // Track delivery
    .send_to(target_chain_id);

// Broadcast to stream subscribers
self.runtime.emit(STREAM_NAME.into(), &Event::NewPost { ... });
```

### Message Authentication

```rust
// In execute_message:
let is_bouncing = self.runtime.message_is_bouncing()?;
if is_bouncing {
    // Refund sender
    self.state.credit(source, amount).await;
} else {
    // Process normally
    self.state.credit(target, amount).await;
}
```

### Stream Subscriptions

```rust
// Subscribe to events
let app_id = self.runtime.application_id().forget_abi();
self.runtime.subscribe_to_events(
    source_chain_id,
    app_id,
    STREAM_NAME.into()
);

// Unsubscribe
self.runtime.unsubscribe_from_events(
    source_chain_id,
    app_id,
    STREAM_NAME.into()
);

// Process stream updates
async fn process_streams(&mut self, updates: Vec<StreamUpdate>) {
    for update in updates {
        for index in update.new_indices() {
            let event = self.runtime.read_event(
                update.chain_id,
                STREAM_NAME.into(),
                index
            );
            // Process event
        }
    }
}
```

---

## Runtime Hooks & Methods

### ContractRuntime Methods

#### Identity & Context

```rust
// Current chain
let chain_id = self.runtime.chain_id();

// Application identity
let app_id = self.runtime.application_id();
let creator_chain = self.runtime.application_creator_chain_id();

// Parameters
let params = self.runtime.application_parameters();

// Time
let timestamp = self.runtime.system_time();
```

#### Permissions

```rust
// Check account permission
self.runtime.check_account_permission(owner)?;

// Check if caller is owner
self.runtime.authenticated_caller_id();
```

#### Cross-App Calls

```rust
// Call another application
let result: Response = self.runtime.call_application(
    true,  // authenticated
    fungible_app_id,
    &FungibleOperation::Transfer { ... }
);
```

#### Chain Management

```rust
// Open new chain
let chain_id = self.runtime.open_chain(
    ownership,
    permissions,
    initial_balance
);

// Close chain
self.runtime.close_chain();
```

#### HTTP Requests (from contract)

```rust
// Make HTTP request (must be deterministic!)
let response = self.runtime.http_request(
    "https://api.example.com/data"
)?;
```

#### Service as Oracle

```rust
// Call service as oracle
let result = self.runtime.call_service_as_oracle::<_, Response>(
    &query
)?;
```

### ServiceRuntime Methods

```rust
// Schedule operation
self.runtime.schedule_operation(&operation);

// Read state (same as contract)
let value = self.state.counter.get();

// HTTP requests (non-deterministic OK)
let response = self.runtime.http_request(url)?;

// Try call application
let result = self.runtime.try_call_application(
    authenticated,
    app_id,
    &operation
);
```

---

## Configuration

### Application Parameters

```rust
// Define parameters
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Parameters {
    pub ticker_symbol: String,
}

// Access in contract
let params = self.runtime.application_parameters();
println!("Token: {}", params.ticker_symbol);
```

### Instantiation Arguments

```rust
// Define instantiation argument
#[derive(Debug, Deserialize, Serialize)]
pub struct InitialState {
    pub accounts: BTreeMap<AccountOwner, Amount>,
}

// Use in instantiate
async fn instantiate(&mut self, state: InitialState) {
    for (owner, amount) in state.accounts {
        self.state.accounts.insert(&owner, amount).await?;
    }
}
```

### Application Permissions

```rust
pub struct ApplicationPermissions {
    pub execute_operations: Option<Vec<ApplicationId>>,
    pub mandatory_applications: Vec<ApplicationId>,
    pub close_chain: Vec<ApplicationId>,
    // ... more permission fields
}
```

---

## Deployment Steps (IMPORTANT)

### 1. Environment Setup

```bash
# Add Linera binaries to PATH
export PATH="$PWD/target/debug:$PATH"

# Import helper functions
source /dev/stdin <<<"$(linera net helper 2>/dev/null)"
```

### 2. Start Local Network

```bash
# Start network with faucet
LINERA_FAUCET_PORT=8079
LINERA_FAUCET_URL=http://localhost:$LINERA_FAUCET_PORT
linera_spawn linera net up --with-faucet --faucet-port $LINERA_FAUCET_PORT
```

### 3. Create Wallet

```bash
# Set wallet paths
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"

# Initialize wallet
linera wallet init --faucet $LINERA_FAUCET_URL

# Request chains
INFO=($(linera wallet request-chain --faucet $LINERA_FAUCET_URL))
CHAIN="${INFO[0]}"
OWNER="${INFO[1]}"
```

### 4. Build Application

```bash
cd examples/my-app
cargo build --release --target wasm32-unknown-unknown
```

### 5. Publish & Create Application

**Option A: Publish and Create in One Step**

```bash
APP_ID=$(linera publish-and-create \
  path/to/my_app_{contract,service}.wasm \
  --json-argument '{"initial": "data"}' \
  --json-parameters '{"param": "value"}')
```

**Option B: Publish Then Create**

```bash
# Publish module
MODULE_ID=$(linera publish-module \
  path/to/my_app_{contract,service}.wasm)

# Create application instance
APP_ID=$(linera create-application $MODULE_ID \
  --json-argument '{"initial": "data"}' \
  --json-parameters '{"param": "value"}' \
  --required-application-ids $OTHER_APP_ID)
```

**Using linera project command (recommended):**

```bash
# From app directory
APP_ID=$(linera project publish-and-create . \
  --json-argument '{"initial": "data"}' \
  --json-parameters '{"param": "value"}')
```

### 6. Start Node Service

```bash
PORT=8080
linera service --port $PORT &
```

### 7. Access Application

```bash
# Print GraphQL endpoint
echo "http://localhost:$PORT/chains/$CHAIN/applications/$APP_ID"

# Open in browser or use GraphiQL
```

### Multiple Wallets Pattern

```bash
# Wallet 1
export LINERA_WALLET_1="$LINERA_TMP_DIR/wallet_1.json"
export LINERA_KEYSTORE_1="$LINERA_TMP_DIR/keystore_1.json"
export LINERA_STORAGE_1="rocksdb:$LINERA_TMP_DIR/client_1.db"

linera --with-wallet 1 wallet init --faucet $LINERA_FAUCET_URL
linera --with-wallet 1 service --port 8080 &

# Wallet 2
export LINERA_WALLET_2="$LINERA_TMP_DIR/wallet_2.json"
export LINERA_KEYSTORE_2="$LINERA_TMP_DIR/keystore_2.json"
export LINERA_STORAGE_2="rocksdb:$LINERA_TMP_DIR/client_2.db"

linera --with-wallet 2 wallet init --faucet $LINERA_FAUCET_URL
linera --with-wallet 2 service --port 8081 &
```

### Key CLI Commands

```bash
# Show wallet
linera wallet show

# Query balance
linera query-balance $CHAIN

# Transfer tokens
linera transfer 10 --from $CHAIN_1 --to $CHAIN_2

# Sync with validators
linera sync $CHAIN

# Process inbox
linera process-inbox $CHAIN

# Open new chain
linera open-chain --from $CHAIN --initial-balance 100

# Show block
linera chain show-block 42 $CHAIN
```

---

## Best Practices

### Code Style

1. **Naming Conventions**
   - Types: `CamelCase` (e.g., `TokenAccount`)
   - Variables: `snake_case` (e.g., `account_balance`)
   - Constants: `SCREAMING_SNAKE_CASE` (e.g., `MAX_SUPPLY`)
   - Avoid single-letter variables except in short loops (`i`, `x`, `n`)
   - Use plural names for collections: `accounts`, `transactions`

2. **Type Annotations**
   - Only use when required by compiler
   - Avoid redundant annotations

3. **Re-exports**
   - Limit to definitions that would be private otherwise

### Security

1. **Permission Checks**
   ```rust
   // Always check permissions before modifying state
   self.runtime.check_account_permission(owner)
       .expect("Permission denied");
   ```

2. **Amount Validation**
   ```rust
   // Check for zero amounts
   if amount == Amount::ZERO {
       return;
   }
   
   // Use saturating arithmetic
   balance.saturating_add_assign(amount);
   
   // Or try arithmetic with error handling
   balance.try_sub_assign(amount)
       .expect("Insufficient balance");
   ```

3. **Message Bouncing**
   ```rust
   // Always handle bouncing messages
   let is_bouncing = self.runtime.message_is_bouncing()?;
   if is_bouncing {
       // Refund or handle failure
   }
   ```

### State Management

1. **Lazy Loading**
   - Views load data on-demand
   - Only load what you need
   - Use MapView for large datasets

2. **Persistence**
   ```rust
   // Always save state in store()
   async fn store(mut self) {
       self.state.save().await
           .expect("Failed to save state");
   }
   ```

3. **Initialization**
   ```rust
   // Validate in instantiate
   async fn instantiate(&mut self, arg: InitArg) {
       let params = self.runtime.application_parameters();
       assert!(arg.is_valid(), "Invalid initialization");
       
       self.state.initialize(arg).await;
   }
   ```

### Cross-Chain Patterns

1. **Claim Pattern** (for tokens)
   ```rust
   // User initiates claim on their chain
   Operation::Claim { source_account, amount, target_account }
   
   // Contract sends message to source chain
   Message::Withdraw { owner, amount, target_account }
   
   // Source chain sends to target
   Message::Credit { target, amount, source }
   ```

2. **Two-Phase Transfer**
   ```rust
   // Phase 1: Move tokens to destination chain
   self.transfer_tokens(target_chain, amount);
   
   // Phase 2: Execute operation on destination
   self.runtime
       .prepare_message(message)
       .with_authentication()
       .send_to(target_chain);
   ```

3. **Application Composition**
   ```rust
   // Call dependency with authentication
   let fungible_id = self.runtime.application_parameters().token_id;
   self.runtime.call_application(
       true,  // authenticated by current caller
       fungible_id,
       &FungibleOperation::Transfer { ... }
   );
   ```

### GraphQL Design

1. **State as Query Root**
   ```rust
   #[derive(RootView, async_graphql::SimpleObject)]
   #[view(context = ViewStorageContext)]
   pub struct MyState {
       pub counter: RegisterView<u64>,
       pub accounts: MapView<AccountOwner, Amount>,
   }
   ```

2. **Mutations in Separate Root**
   ```rust
   struct MutationRoot {
       runtime: Arc<ServiceRuntime<MyService>>,
   }
   
   #[Object]
   impl MutationRoot {
       async fn increment(&self, value: u64) -> Vec<u8> {
           self.runtime.schedule_operation(&Operation::Increment { value });
           vec![]  // Returns operation hash
       }
   }
   ```

### HTTP Requests

1. **From Service (Recommended)**
   ```rust
   // In service: non-deterministic OK
   let response = self.runtime.http_request(url)?;
   // Use response to build operation
   self.runtime.schedule_operation(&operation);
   ```

2. **From Contract (Careful!)**
   ```rust
   // Must be deterministic across all validators!
   let response = self.runtime.http_request(url)?;
   // All validators must get identical response
   ```

3. **Service as Oracle (Most Flexible)**
   ```rust
   // Contract calls service
   let data = self.runtime.call_service_as_oracle::<_, Data>(&query)?;
   // Service performs HTTP, returns only deterministic data
   ```

### Error Handling

```rust
// Use expect with descriptive messages
let state = MyState::load(runtime.root_view_storage_context())
    .await
    .expect("Failed to load state");

// Or use ? with proper error types
self.state.accounts.get(&owner).await?;

// Panic for invariants
assert!(amount > Amount::ZERO, "Amount must be positive");
panic!("This should never happen");
```

### Testing

1. **Unit Tests**
   ```rust
   #[cfg(test)]
   mod tests {
       use super::*;
       use linera_sdk::{util::BlockingWait, ContractRuntime};
       
       #[test]
       fn test_operation() {
           let runtime = ContractRuntime::new();
           let mut contract = MyContract::load(runtime)
               .blocking_wait()
               .unwrap();
           // Test logic
       }
   }
   ```

2. **Integration Tests**
   ```rust
   use linera_sdk::test::{TestValidator, ActiveChain};
   
   #[tokio::test]
   async fn test_cross_chain() {
       let (validator, module_id) = 
           TestValidator::with_current_module::<MyAbi, Params, Init>().await;
       
       let mut chain1 = validator.new_chain().await;
       let app_id = chain1.create_application(
           module_id,
           params,
           init_arg,
           vec![]
       ).await;
       
       // Test operations
   }
   ```

---

## Testing

### Unit Tests (in contract/service)

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use futures::FutureExt as _;
    use linera_sdk::{util::BlockingWait, views::View, ContractRuntime};

    #[test]
    fn test_increment() {
        let runtime = ContractRuntime::new()
            .with_application_parameters(());
        
        let mut contract = MyContract {
            state: MyState::load(runtime.root_view_storage_context())
                .blocking_wait()
                .expect("Failed to load state"),
            runtime,
        };

        contract.instantiate(0).now_or_never().unwrap();
        
        let result = contract
            .execute_operation(Operation::Increment { value: 5 })
            .now_or_never()
            .unwrap();
        
        assert_eq!(result, 5);
    }
}
```

### Integration Tests

```rust
#![cfg(not(target_arch = "wasm32"))]

use linera_sdk::test::{TestValidator, QueryOutcome};

#[tokio::test]
async fn test_cross_chain_transfer() {
    let (validator, module_id) = TestValidator::with_current_module::<
        MyAbi,
        Parameters,
        InitialState
    >().await;
    
    let mut sender_chain = validator.new_chain().await;
    let sender_account = AccountOwner::from(sender_chain.public_key());
    
    let app_id = sender_chain
        .create_application(module_id, params, init_state, vec![])
        .await;
    
    let receiver_chain = validator.new_chain().await;
    
    // Execute operation
    let cert = sender_chain
        .add_block(|block| {
            block.with_operation(app_id, Operation::Transfer { ... });
        })
        .await;
    
    // Process message on receiver
    receiver_chain
        .add_block(|block| {
            block.with_messages_from(&cert);
        })
        .await;
    
    // Query and verify
    let query = "query { balance }";
    let QueryOutcome { response, .. } = 
        receiver_chain.graphql_query(app_id, query).await;
    
    assert_eq!(response["balance"], "15");
}
```

### Test Commands

```bash
# Run tests
cd examples/my-app
cargo test

# Run tests with linera project
linera project test

# Run specific test
cargo test test_cross_chain -- --nocapture

# Build for testing
cargo build --release --target wasm32-unknown-unknown
```

---

## Common Patterns by Example

### Counter (Simple State)

**Use Case:** Single value storage and operations

```rust
// State
pub struct CounterState {
    pub value: RegisterView<u64>,
}

// Operation
enum Operation {
    Increment { value: u64 },
}

// Execute
async fn execute_operation(&mut self, op: Operation) -> u64 {
    let Operation::Increment { value } = op;
    let new_value = self.state.value.get() + value;
    self.state.value.set(new_value);
    new_value
}
```

### Fungible Token (Cross-Chain)

**Use Case:** Token transfers across chains

```rust
// State
pub struct FungibleState {
    pub accounts: MapView<AccountOwner, Amount>,
}

// Operations
enum Operation {
    Transfer { owner, amount, target_account },
    Claim { source_account, amount, target_account },
}

// Messages
enum Message {
    Credit { target, amount, source },
    Withdraw { owner, amount, target_account },
}

// Transfer pattern
async fn finish_transfer(&mut self, amount: Amount, target: Account, source: AccountOwner) {
    if target.chain_id == self.runtime.chain_id() {
        self.state.credit(target.owner, amount).await;
    } else {
        self.runtime
            .prepare_message(Message::Credit { target: target.owner, amount, source })
            .with_authentication()
            .with_tracking()
            .send_to(target.chain_id);
    }
}
```

### Social Media (Streams)

**Use Case:** Pub/sub with event streams

```rust
const STREAM_NAME: &[u8] = b"posts";

// State
pub struct SocialState {
    pub own_posts: LogView<OwnPost>,
    pub received_posts: CustomMapView<Key, Post>,
}

// Subscribe
Operation::Subscribe { chain_id } => {
    self.runtime.subscribe_to_events(
        chain_id,
        self.runtime.application_id().forget_abi(),
        STREAM_NAME.into()
    );
}

// Post
Operation::Post { text, image_url } => {
    let post = OwnPost { timestamp, text, image_url };
    self.state.own_posts.push(post.clone());
    self.runtime.emit(STREAM_NAME.into(), &Event::Post { post, index });
}

// Process streams
async fn process_streams(&mut self, updates: Vec<StreamUpdate>) {
    for update in updates {
        for index in update.new_indices() {
            let event = self.runtime.read_event(
                update.chain_id,
                STREAM_NAME.into(),
                index
            );
            // Process event
        }
    }
}
```

### Crowd-Funding (Composition)

**Use Case:** Using another application as dependency

```rust
// Parameters reference another app
pub type Parameters = ApplicationId<FungibleTokenAbi>;

// Call fungible app
fn execute_pledge(&mut self, owner: AccountOwner, amount: Amount) {
    let chain_id = self.runtime.application_creator_chain_id();
    let target_account = Account { chain_id, owner };
    
    // Call fungible token to transfer
    let fungible_id = self.runtime.application_parameters();
    self.runtime.call_application(
        true,  // authenticated
        fungible_id,
        &FungibleOperation::Transfer { owner, amount, target_account }
    );
    
    // Send message to campaign chain
    self.runtime
        .prepare_message(Message::PledgeWithAccount { owner, amount })
        .with_authentication()
        .send_to(chain_id);
}

// Publish with dependency
linera project publish-and-create examples/crowd-funding \
    --required-application-ids $FUNGIBLE_APP_ID \
    --json-parameters "\"$FUNGIBLE_APP_ID\""
```

### HTTP Requests (Oracle Pattern)

**Use Case:** Fetching external data

```rust
// Service performs request
async fn handle_query(&self, request: Request) -> Response {
    let http_response = self.runtime.http_request(url)?;
    let data = parse_response(http_response);
    
    // Schedule operation with data
    self.runtime.schedule_operation(&Operation::UpdateData { data });
    
    // Or return data directly
    Response::new(data)
}

// Contract uses service as oracle
async fn execute_operation(&mut self, op: Operation) -> Response {
    let data = self.runtime
        .call_service_as_oracle::<_, ExternalData>(&query)?;
    
    // Use deterministic data
    self.state.update(data).await;
    Response::Ok
}
```

---

## Common Issues & Solutions

### Issue: "Failed to load state"
**Solution:** Ensure state is properly derived with `#[derive(RootView)]` and `#[view(context = ViewStorageContext)]`

### Issue: "Permission denied"
**Solution:** Add `self.runtime.check_account_permission(owner)?` before operations that modify accounts

### Issue: Cross-chain message not received
**Solution:** 
1. Check message is sent with proper configuration
2. Ensure receiver chain processes inbox: `linera process-inbox $CHAIN`
3. Use `.with_tracking()` for important messages

### Issue: HTTP request causes consensus failure
**Solution:** 
1. Use service to perform request, not contract
2. Or use service as oracle pattern
3. Ensure response is deterministic if calling from contract

### Issue: State not persisted
**Solution:** Ensure `store()` method calls `self.state.save().await`

---

## Quick Reference

### Environment Variables

```bash
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

### Build Commands

```bash
# Build WASM
cargo build --release --target wasm32-unknown-unknown

# Test
cargo test
linera project test

# Format
cargo +nightly fmt

# Lint
cargo clippy --all-targets --all-features
```

### Deployment Commands

```bash
# Publish and create
linera project publish-and-create path/to/app

# With arguments
linera project publish-and-create path/to/app \
    --json-argument '{"key": "value"}' \
    --json-parameters '{"param": "value"}' \
    --required-application-ids $DEP_APP_ID

# Start service
linera service --port 8080

# Query application
curl http://localhost:8080/chains/$CHAIN/applications/$APP_ID
```

---

## Resources

- **Main Documentation:** https://linera.dev
- **Whitepaper:** https://linera.io/whitepaper
- **Examples:** `examples/` directory in repository
- **API Docs:** https://linera-io.github.io/linera-protocol
- **Discord:** https://discord.com/invite/linera
- **GitHub:** https://github.com/linera-io/linera-protocol

---

## License

This document summarizes the Linera Protocol repository which is licensed under Apache 2.0.

Copyright (c) Zefchain Labs, Inc.

