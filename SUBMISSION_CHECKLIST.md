# 🎯 Linera Buildathon Submission Checklist

## ✅ Required Items

### 1. Project Information
- [x] **Project Name**: Linera Flip Market
- [x] **Short Description**: Real-time coin flip betting powered by Linera microchains
- [x] **Team Members**: 
  - Adam (@Adam_shelbie on Discord)
  - Wallet Address: [TO BE ADDED]

### 2. GitHub Repository
- [x] **Public Repo**: https://github.com/AlexD-Great/Linera-flip-market
- [x] **README with setup instructions**
- [ ] **CHANGELOG.md** for wave submissions

### 3. Code Requirements
- [x] **Compiles successfully**: ✅ WASM builds complete
- [x] **Functional Linera contract**: ✅ Contract implements all traits
- [ ] **Runs successfully**: ⏳ BLOCKED by SDK atomics bug

### 4. Live Demo (CHOOSE ONE)
- [ ] **Option A: Live on Testnet Conway** (PREFERRED)
  - [ ] Frontend deployed (Vercel/Netlify)
  - [ ] Connected to Testnet Conway
  - [ ] Using Linera Web client library / CheCko / Croissant
  
- [ ] **Option B: Local Network**
  - [ ] Use dockerized application template
  - [ ] Provide Docker setup instructions

### 5. Documentation
- [x] **Linera SDK features used**:
  - Contract trait implementation
  - Service trait with GraphQL
  - Views (RegisterView, MapView)
  - State management with RootView
  
- [ ] **CHANGELOG.md** documenting progress

---

## 🔴 BLOCKERS

### SDK Atomics Bug
**Status**: Waiting for Linera team response

**Issue**: testnet_conway SDK compiles with atomics enabled
- Error: `Unknown opcode 252 during Operation(0)`
- Reported to Linera team
- Code is deployment-ready once SDK is fixed

---

## 📋 TODO Before Submission

### High Priority
1. [ ] **Build/Deploy Frontend**
   - [ ] Create Next.js frontend
   - [ ] Integrate Linera Web client
   - [ ] Deploy to Vercel/Netlify
   - [ ] Connect to Testnet Conway

2. [ ] **Create CHANGELOG.md**
   - [ ] Document Wave 1 progress
   - [ ] List features implemented
   - [ ] Note SDK blocker

3. [ ] **Add Wallet Address**
   - [ ] Get Linera wallet address
   - [ ] Add to README and submission

### Medium Priority
4. [ ] **Screenshots**
   - [ ] Create screenshots/ folder
   - [ ] Add UI screenshots
   - [ ] Update README image links

5. [ ] **Testing**
   - [ ] Test on local network (once SDK fixed)
   - [ ] Test on Testnet Conway
   - [ ] Verify all operations work

### Low Priority
6. [ ] **Polish**
   - [ ] Fix unused import warnings
   - [ ] Add code comments
   - [ ] Update documentation

---

## 🚀 Deployment Steps (Once SDK Fixed)

### Local Testing
```bash
# Start local network
linera net up --testing-prng-seed 37

# Deploy application
export LINERA_WALLET="/tmp/.tmp.../wallet_0.json"
export LINERA_KEYSTORE="/tmp/.tmp.../keystore_0.json"
export LINERA_STORAGE="rocksdb:/tmp/.tmp.../client_0.db"
linera project publish-and-create .
```

### Testnet Deployment
```bash
# Initialize wallet
linera wallet init --faucet https://faucet.testnet-conway.linera.net

# Deploy to testnet
linera project publish-and-create .

# Note Application ID for frontend
```

### Frontend Deployment
```bash
cd web
npm run build
# Deploy to Vercel
vercel --prod
```

---

## 📝 Submission Form Fields

**When submitting, provide:**

1. **Project Name**: Linera Flip Market
2. **Description**: Real-time coin flip betting platform leveraging Linera's microchain architecture for instant, transparent betting
3. **GitHub URL**: https://github.com/AlexD-Great/Linera-flip-market
4. **Live Demo URL**: [TO BE ADDED after deployment]
5. **Team Members**: 
   - Adam
   - Discord: @Adam_shelbie
   - Wallet: [TO BE ADDED]
6. **Linera Features Used**:
   - Contract & Service traits
   - GraphQL API with async-graphql
   - Views (RegisterView, MapView)
   - State persistence with RootView
   - Cross-chain ready architecture
7. **Changelog**: See CHANGELOG.md

---

## ⏰ Timeline

- **Now**: Code complete, waiting for SDK fix
- **After SDK fix**: Deploy locally, test thoroughly
- **Deploy to testnet**: Get Application ID
- **Build frontend**: Integrate with deployed contract
- **Submit**: Before deadline

---

**Status**: 🟡 Ready for deployment pending SDK fix
