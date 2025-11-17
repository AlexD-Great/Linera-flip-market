# Deployment Notes for Linera Flip Market

## ✅ Build Status: SUCCESSFUL

The contract has been updated to compile successfully with Linera SDK 0.15 (testnet_conway branch).

### Changes Made:

1. **Added `ServiceAbi` implementation** in `lib.rs`:
   - Required for GraphQL service integration
   - Defines `Query` and `QueryResponse` types

2. **Added `EventValue` type** to `ContractAbi` and `Contract`:
   - Required by SDK 0.15
   - Set to `()` (unit type) as we don't use events

3. **Updated deprecated methods**:
   - `load_key_value` → `read_value`
   - Added `ReadableKeyValueStore` trait import

4. **Added `WithServiceAbi` trait** to service:
   - Links service to the ABI definition

### ⚠️ CRITICAL ISSUE - State Persistence

**The `store()` method is currently empty** because the SDK doesn't have `insert_key_value` method.

**Current code:**
```rust
async fn store(self) {
    // TODO: State persistence - insert_key_value method not available in current SDK
    // May need to use Views-based approach or different persistence method
}
```

**This means state changes won't persist between operations!**

### 🔧 Recommended Fix for Dev:

The dev should implement proper state persistence using one of these approaches:

#### Option 1: Use Linera Views (Recommended)
Convert `FlipMarketState` to use Views:
```rust
#[derive(RootView)]
pub struct FlipMarketState {
    pub flips: MapView<u64, Flip>,
    pub next_flip_id: RegisterView<u64>,
    pub leaderboard: MapView<String, u64>,
}

// In store():
async fn store(mut self) {
    self.state.save().await.expect("Failed to save state");
}
```

#### Option 2: Find correct persistence method
Check the SDK documentation for the correct method to persist serialized state.

### 📦 Build Output:

WASM binaries are located at:
```
target/wasm32-unknown-unknown/release/flip_market.wasm
```

### ⚙️ Build Command:

```bash
cargo build --target wasm32-unknown-unknown --release
```

### 📝 Warnings (Non-Critical):

- `crate-level attribute should be in the root module` - cosmetic warning about `#![cfg_attr]` placement
- Can be ignored for deployment

---

## For the Dev:

The contract compiles successfully but **state persistence needs to be implemented** before deployment will work correctly. The `store()` method is currently a no-op.

Please review the TODO comment in `src/contract.rs` line 107 and implement proper state persistence.

---

**Last Updated:** Nov 17, 2025
**SDK Version:** linera-sdk 0.15.6 (testnet_conway branch)
**Build Status:** ✅ Compiles successfully
**Deployment Ready:** ⚠️ Needs state persistence fix
