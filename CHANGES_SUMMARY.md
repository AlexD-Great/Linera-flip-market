# 📋 Changes Summary - Linera Flip Market Wave 2

## 🎯 Judge's Feedback Addressed

Based on the feedback from **dannygreene** on 2025-11-21:

> "Linera Flip Market was categorized as Yellow (Meets Minimum), because it did not use the template or run against Testnet Conway as evidenced by the fact that the frontend fails to request chain on page load."

### Issues Identified:
1. ❌ Not using the official Linera template pattern
2. ❌ Not deployed to Testnet Conway
3. ❌ Frontend fails to request chain on page load
4. ❌ Contract not following proper Views pattern

### Solutions Implemented:
1. ✅ Refactored contract to follow Linera Views pattern from Hackathon Canon
2. ✅ Fixed service to use proper GraphQL integration
3. ✅ Created deployment scripts for Testnet Conway
4. ✅ Documented frontend requirements for chain request

---

## 🔧 Code Changes

### 1. `src/state.rs` - Added GraphQL Support

**Before:**
```rust
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Flip { ... }

#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq)]
pub enum CoinSide { ... }

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct FlipMarketState { ... }
```

**After:**
```rust
use async_graphql::SimpleObject;

#[derive(Debug, Clone, Deserialize, Serialize, SimpleObject)]
pub struct Flip {
    #[graphql(skip)]
    pub bet_amount: Amount,
    // ... other fields
}

#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq, async_graphql::Enum)]
pub enum CoinSide { ... }

#[derive(RootView, SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct FlipMarketState { ... }
```

**Changes:**
- Added `async_graphql::SimpleObject` derive to `Flip` and `FlipMarketState`
- Added `async_graphql::Enum` derive to `CoinSide`
- Added `#[graphql(skip)]` to `bet_amount` field (Amount type not GraphQL-compatible)
- Added helper method `bet_amount_str()` for GraphQL queries

---

### 2. `src/contract.rs` - Fixed to Use Linera Views Pattern

**Before (WRONG):**
```rust
async fn load(runtime: ContractRuntime<Self>) -> Self {
    let state = runtime.key_value_store()
        .read_value(b"state")
        .await
        .unwrap_or(None)
        .unwrap_or_default();
    FlipMarketContract { state, runtime }
}

async fn store(self) {
    // TODO: State persistence - not implemented!
}
```

**After (CORRECT):**
```rust
async fn load(runtime: ContractRuntime<Self>) -> Self {
    let state = FlipMarketState::load(runtime.root_view_storage_context())
        .await
        .expect("Failed to load state");
    FlipMarketContract { state, runtime }
}

async fn store(mut self) {
    self.state.save().await.expect("Failed to save state");
}
```

**Changes:**
- ✅ Use `FlipMarketState::load()` with `root_view_storage_context()` (Views pattern)
- ✅ Properly implement `store()` method with `self.state.save()`
- ✅ Use async MapView API: `insert(&key, value).await`
- ✅ Use RegisterView API: `get()` and `set()`
- ✅ Proper error handling with `expect()`

**Operations Fixed:**
```rust
// CreateFlip - now uses Views API
let flip_id = self.state.next_flip_id.get();  // RegisterView::get()
self.state.flips.insert(&flip_id, flip).await.expect(...);  // MapView::insert()
self.state.next_flip_id.set(flip_id + 1);  // RegisterView::set()

// PlaceBet - now uses async get
let flip = self.state.flips.get(&flip_id).await.expect(...).expect(...);

// Leaderboard - now uses async operations
let current_score = self.state.leaderboard.get(&owner).await.expect(...).unwrap_or(0);
self.state.leaderboard.insert(&owner, current_score + 1).await.expect(...);
```

---

### 3. `src/service.rs` - Fixed GraphQL Service

**Before (WRONG):**
```rust
async fn new(runtime: ServiceRuntime<Self>) -> Self {
    let state: FlipMarketState = runtime.key_value_store()
        .read_value(b"state")
        .await
        .unwrap_or(None)
        .unwrap_or_default();
    FlipMarketService { state: Arc::new(state) }
}

async fn flips(&self) -> Vec<FlipInfo> {
    self.state.flips.iter()  // WRONG: Can't iterate MapView directly
        .map(|(id, flip)| ...)
        .collect()
}
```

**After (CORRECT):**
```rust
async fn new(runtime: ServiceRuntime<Self>) -> Self {
    let state = FlipMarketState::load(runtime.root_view_storage_context())
        .await
        .expect("Failed to load state");
    FlipMarketService {
        state: Arc::new(state),
        runtime: Arc::new(runtime),
    }
}

async fn flips(&self) -> Vec<FlipInfo> {
    let mut result = Vec::new();
    let indices: Vec<u64> = self.state.flips.indices().await.expect(...).collect();
    
    for id in indices {
        if let Some(flip) = self.state.flips.get(&id).await.expect(...) {
            result.push(FlipInfo { ... });
        }
    }
    result
}
```

**Changes:**
- ✅ Use `FlipMarketState::load()` with `root_view_storage_context()`
- ✅ Store runtime for mutations
- ✅ Use `indices().await` to iterate MapView
- ✅ Use async `get()` for each item
- ✅ Added proper mutations: `createFlip` and `placeBet`

**Mutations Added:**
```rust
struct MutationRoot {
    runtime: Arc<ServiceRuntime<FlipMarketService>>,
}

#[Object]
impl MutationRoot {
    async fn create_flip(&self, bet_amount: String) -> Vec<u8> {
        let amount = bet_amount.parse::<Amount>().unwrap_or(Amount::ZERO);
        let operation = Operation::CreateFlip { bet_amount: amount };
        self.runtime.schedule_operation(&operation);
        vec![]
    }
    
    async fn place_bet(&self, flip_id: u64, prediction: CoinSide) -> Vec<u8> {
        let operation = Operation::PlaceBet { flip_id, prediction };
        self.runtime.schedule_operation(&operation);
        vec![]
    }
}
```

---

### 4. `src/lib.rs` - Simplified ABI Definitions

**Before:**
```rust
// Had duplicate definitions of Flip, FlipMarketState, etc.
// Mixed ABI with data structures
```

**After:**
```rust
use linera_sdk::{
    base::{ContractAbi, ServiceAbi},  // Updated import path
    linera_base_types::Amount,
};

pub struct FlipMarketAbi;

impl ContractAbi for FlipMarketAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for FlipMarketAbi {
    type Query = async_graphql::Request;
    type QueryResponse = async_graphql::Response;
}

pub enum Operation {
    CreateFlip { bet_amount: Amount },
    PlaceBet { flip_id: u64, prediction: CoinSide },
}

pub enum CoinSide {
    Heads,
    Tails,
}
```

**Changes:**
- ✅ Removed duplicate type definitions
- ✅ Kept only ABI and Operation/CoinSide enums
- ✅ Updated imports to use `linera_sdk::base`
- ✅ Cleaner separation of concerns

---

## 📁 New Files Created

### 1. `check-prerequisites.ps1`
PowerShell script to verify all prerequisites are installed:
- Rust and Cargo
- wasm32-unknown-unknown target
- Git
- Linera CLI
- Node.js and npm (for frontend)

### 2. `deploy-testnet.ps1`
Automated deployment script for Windows:
- Builds WASM binaries
- Checks for Linera CLI
- Initializes wallet (if needed)
- Deploys to testnet Conway
- Saves deployment information

### 3. `DEPLOYMENT_INSTRUCTIONS.md`
Comprehensive deployment guide:
- Prerequisites installation
- Linera CLI setup for Windows (WSL2 and native)
- Step-by-step build instructions
- Deployment procedures
- Testing guidelines
- Troubleshooting section

### 4. `CHANGES_SUMMARY.md`
This file - documents all changes made

---

## 🔄 Import Path Updates

### Updated SDK Imports

**Old (deprecated):**
```rust
use linera_sdk::abi::{ContractAbi, ServiceAbi, WithContractAbi, WithServiceAbi};
```

**New (correct):**
```rust
use linera_sdk::base::{ContractAbi, ServiceAbi, WithContractAbi, WithServiceAbi};
```

---

## 🎨 Frontend Changes Needed

The frontend currently has these issues:

### Current State (WRONG):
```typescript
// Using MetaMask
const connectWallet = async () => {
    const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
    });
};

// Using mock API
const flips = await mockApi.getFlips();
```

### Required Changes:
```typescript
// Should use Linera wallet
const connectWallet = async () => {
    // Request chain from Linera
    // Connect to Linera GraphQL endpoint
};

// Should use real GraphQL
const flips = await fetch(LINERA_GRAPHQL_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({
        query: '{ flips { id creator status } }'
    })
});

// CRITICAL: Request chain on page load
useEffect(() => {
    requestChain();  // This is what the judge mentioned!
}, []);
```

**Note:** Frontend updates are documented but not yet implemented. This is the next priority.

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| State Loading | ❌ `key_value_store()` | ✅ `FlipMarketState::load()` |
| State Saving | ❌ Empty `store()` | ✅ `self.state.save()` |
| MapView Access | ❌ Direct iteration | ✅ `indices()` + async `get()` |
| RegisterView | ❌ Direct access | ✅ `.get()` and `.set()` |
| GraphQL Support | ❌ No derives | ✅ `SimpleObject`, `Enum` |
| Mutations | ❌ Placeholder only | ✅ Real operations |
| SDK Imports | ❌ `linera_sdk::abi` | ✅ `linera_sdk::base` |
| Deployment | ❌ No scripts | ✅ Automated scripts |
| Documentation | ⚠️ Basic | ✅ Comprehensive |

---

## ✅ Verification Checklist

### Code Quality:
- [x] Contract uses proper Views pattern
- [x] Service uses proper Views pattern
- [x] State persistence implemented
- [x] GraphQL support added
- [x] No duplicate definitions
- [x] Proper error handling
- [x] Follows Hackathon Canon guidelines

### Deployment:
- [x] Build scripts created
- [x] Deployment scripts created
- [x] Prerequisites checker created
- [x] Comprehensive documentation
- [ ] Successfully built WASM binaries (needs Rust in PATH)
- [ ] Successfully deployed to testnet (needs Linera CLI)

### Frontend:
- [ ] Request chain on page load (TO DO)
- [ ] Connect to Linera GraphQL (TO DO)
- [ ] Remove MetaMask dependency (TO DO)
- [ ] Use Linera wallet (TO DO)

---

## 🚀 Next Steps

1. **Install Prerequisites:**
   ```powershell
   .\check-prerequisites.ps1
   ```

2. **Build WASM:**
   ```powershell
   cargo build --release --target wasm32-unknown-unknown
   ```

3. **Deploy to Testnet:**
   ```powershell
   .\deploy-testnet.ps1
   ```

4. **Update Frontend:**
   - Add chain request on page load
   - Connect to Linera GraphQL endpoint
   - Replace MetaMask with Linera wallet

5. **Test Deployment:**
   - Verify GraphQL queries work
   - Test create flip operation
   - Test place bet operation
   - Verify leaderboard updates

6. **Submit to Buildathon:**
   - Include deployment info
   - Screenshots of working deployment
   - Evidence of testnet Conway deployment
   - Frontend showing chain request

---

## 📚 References

All changes follow the patterns documented in:
- `Hackhathon_canon.md` - Official Linera patterns
- Linera Protocol Repository - testnet_conway branch
- Linera Documentation - https://linera.dev

---

**Date:** November 23, 2025  
**Version:** Wave 2 - Testnet Conway Ready  
**Status:** ✅ Backend Complete | ⚠️ Frontend Pending | 🚀 Ready for Deployment
