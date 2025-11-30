# Changelog

All notable changes to Linera Flip Market will be documented in this file.

## [Wave 1] - 2025-11-30

### ✅ Implemented

#### Smart Contract
- **Core Contract Logic**
  - Implemented `Contract` trait with all required methods
  - `CreateFlip` operation for initiating new coin flips
  - `PlaceBet` operation for joining flips and placing predictions
  - Automatic flip resolution when second player joins
  - Cryptographic randomness using system time

- **State Management**
  - `FlipMarketState` with RootView pattern
  - `RegisterView` for flip ID tracking
  - `MapView` for storing flips and leaderboard
  - Proper async state persistence

- **Service & GraphQL API**
  - Implemented `Service` trait
  - GraphQL queries for flips and leaderboard
  - GraphQL mutations for creating flips and placing bets
  - Async operation scheduling

#### Code Quality
- Aligned with Linera Hackathon Canon patterns
- Fixed import paths (`linera_sdk::abi`)
- Proper error handling with `expect()`
- Clean separation of concerns (lib.rs, contract.rs, service.rs, state.rs)

#### Documentation
- Comprehensive README with setup instructions
- Project structure documentation
- Feature descriptions
- Buildathon submission details

### 🔧 Technical Details

**Linera SDK Features Used:**
- `Contract` trait implementation
- `Service` trait with GraphQL integration
- `WithContractAbi` and `WithServiceAbi`
- Views: `RegisterView`, `MapView`, `RootView`
- `async-graphql` for API layer
- State persistence with `save()` and `load()`

**Dependencies:**
- `linera-sdk` (testnet_conway branch)
- `linera-views` (testnet_conway branch)
- `async-graphql` v7.0
- `serde` with derive features
- `bcs` for serialization

### 🔴 Known Issues

#### SDK Atomics Bug (BLOCKER)
- **Issue**: testnet_conway SDK compiles with atomics/SIMD enabled
- **Error**: `Invalid Wasm module: Unknown opcode 252 during Operation(0)`
- **Impact**: Cannot deploy to local or testnet
- **Status**: Reported to Linera team, awaiting fix
- **Evidence**: 
  - Warning persists: `unstable feature specified for '-Ctarget-feature': 'atomics'`
  - Occurs despite `.cargo/config.toml` and `RUSTFLAGS` overrides
  - WASM compiles successfully but fails at runtime

**Workarounds Attempted:**
- ✅ Configured `.cargo/config.toml` to disable atomics
- ✅ Set `RUSTFLAGS` environment variable
- ✅ Split target features into separate flags
- ❌ None successful - SDK dependency is pre-compiled with atomics

### 📋 Pending (Blocked by SDK)

- [ ] Deploy to local network
- [ ] Deploy to Testnet Conway
- [ ] Build and deploy frontend
- [ ] Integration testing
- [ ] Live demo

### 🎯 Next Steps

**Immediate (After SDK Fix):**
1. Deploy to local network for testing
2. Deploy to Testnet Conway
3. Build Next.js frontend
4. Integrate Linera Web client library
5. Deploy frontend to Vercel
6. Submit to buildathon

**Wave 2 Plans:**
- Multi-player tournaments
- NFT rewards system
- Advanced analytics
- Cross-chain betting
- AI opponent mode

---

## Development Timeline

### Week 1 (Nov 23-29)
- ✅ Project setup and architecture design
- ✅ Core contract implementation
- ✅ State management with Views
- ✅ GraphQL service layer
- ✅ Code alignment with Hackathon Canon

### Week 2 (Nov 30 - Dec 6)
- ⏳ Waiting for SDK fix
- 🔜 Local deployment testing
- 🔜 Testnet deployment
- 🔜 Frontend development
- 🔜 Final submission

---

## Technical Achievements

### ✅ Completed
- Successfully built Linera CLI v0.15.6 from testnet_conway source
- WASM binaries compile successfully (218KB contract, 2.0MB service)
- All code compiles without errors
- Proper async/await patterns throughout
- Clean GraphQL API design
- Efficient state management with Views

### 📊 Code Statistics
- **Contract**: 131 lines
- **Service**: ~100 lines
- **State**: ~40 lines
- **ABI**: 33 lines
- **Total**: ~300 lines of production Rust code

---

## Credits

**Developer**: Adam (@Adam_shelbie)
**Built for**: Linera Buildathon Wave 1
**Framework**: Linera Protocol v0.15.6 (testnet_conway)

---

**Last Updated**: November 30, 2025
