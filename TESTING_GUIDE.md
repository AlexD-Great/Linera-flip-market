# 🧪 Linera Web-Client Integration Testing Guide

## Current Status

✅ **Build Successful** - TypeScript compilation passed
✅ **Web-client integration implemented** - Following official Linera pattern
✅ **Dev server running** - http://localhost:3000

## What to Test

### 1. Browser Console Checks

Open http://localhost:3000 in your browser and check the console for:

**Expected Success Output:**
```
🔄 Initializing Linera client...
✅ Linera client initialized successfully
Chain ID: [64-character hex string]
```

**Possible Errors to Watch For:**

#### Error: "Timeout waiting for Linera library to load"
**Cause:** CDN failed to load `@linera/client`
**Check:**
- Network tab shows request to `https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js`
- No CORS errors
- Import map is properly loaded

**Fix:** Verify unpkg.com is accessible, check import map syntax

#### Error: "Failed to initialize Linera client"
**Cause:** Faucet connection failed or wallet creation failed
**Check:**
- Network tab shows request to `https://faucet.testnet-conway.linera.net`
- Faucet is operational
- No network/firewall blocking

**Fix:** Retry connection, check faucet status with Linera team

#### Error: "Application not found" or GraphQL errors
**Cause:** Application ID might be incorrect
**Check:**
- Verify `FLIP_MARKET_APP_ID` in `lineraClient.ts` matches deployed contract
- Current ID: `1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a`

**Fix:** Update Application ID if contract was redeployed

### 2. UI Status Checks

**Expected UI Elements:**

1. **Connection Status Banner** (top of page)
   - 🟡 Yellow: "Connecting to Linera Testnet Conway..."
   - 🟢 Green: "Connected to Testnet Conway" with chain ID
   - 🔴 Red: "Connection Failed" with retry button

2. **Toast Notifications**
   - Success: "Connected to Linera Testnet Conway!"
   - Error: "Failed to connect: [error message]"

### 3. Functionality Tests

Once connected (green status), test these features:

#### Test 1: View Flips
- Click "Active Flips" tab
- Should show loading spinner initially
- Should display flips or "No active flips yet" message
- Check console for GraphQL query logs

#### Test 2: Create Flip
- Click "Create Flip" tab
- Enter bet amount (e.g., "100")
- Click "Create Flip" button
- Should show loading state
- Should create flip and show success message
- Should see new flip in "Active Flips" tab

#### Test 3: Place Bet
- Go to "Active Flips" tab
- Find an open flip
- Click "Join Flip" button
- Select Heads or Tails
- Should show loading state
- Should place bet and update flip status

#### Test 4: Leaderboard
- Click "Leaderboard" tab
- Should display player rankings
- Should show wins/losses data

### 4. Real-time Updates Test

- Open two browser windows side-by-side
- Create a flip in window 1
- Window 2 should receive notification and update automatically
- Check console for: `📬 Blockchain notification: [notification object]`

## Common Issues and Solutions

### Issue: Import map not loading
**Symptoms:** `window.linera` is undefined
**Solution:** Check if Next.js Script component is rendering the import map correctly. May need to use a different approach for Next.js.

### Issue: CORS errors
**Symptoms:** Network requests blocked by CORS policy
**Solution:** This shouldn't happen with unpkg.com or Linera faucet, but if it does, report to Linera team.

### Issue: Faucet timeout
**Symptoms:** "Timeout expired" when claiming chain
**Solution:** Faucet might be busy or down. Wait and retry, or ask Linera team about faucet status.

### Issue: WebAssembly loading fails
**Symptoms:** Error loading WASM module
**Solution:** Check browser compatibility (need modern browser with WASM support), clear cache and retry.

## Browser Compatibility

**Supported:**
- Chrome/Edge 90+
- Firefox 89+
- Safari 15+

**Required Features:**
- ES Modules (import maps)
- WebAssembly
- Fetch API
- Async/await

## Network Requirements

**Outbound Connections Needed:**
- `https://unpkg.com` - CDN for @linera/client library
- `https://faucet.testnet-conway.linera.net` - Testnet faucet
- Testnet Conway validators (various URLs)

**Ports:**
- 443 (HTTPS) for all connections

## Debugging Tips

### Enable Verbose Logging
Add to browser console:
```javascript
localStorage.setItem('debug', 'linera:*');
```

### Check Linera Client State
In browser console:
```javascript
// Check if library loaded
console.log(window.linera);

// Check initialization status (after page load)
// Note: lineraClient is not exposed globally, check via React DevTools
```

### Monitor Network Traffic
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Look for requests to:
   - unpkg.com (library loading)
   - faucet.testnet-conway.linera.net (wallet/chain)
   - Validator endpoints (blockchain communication)

### Check React Component State
1. Install React DevTools extension
2. Find `LineraProvider` component
3. Check state: `isInitialized`, `chainId`, `error`

## Next Steps After Successful Testing

1. ✅ Verify all features work locally
2. ✅ Check console for any warnings
3. ✅ Test real-time notifications
4. ✅ Commit changes to git
5. ✅ Deploy to Vercel
6. ✅ Test on Vercel deployment
7. ✅ Verify no localhost dependencies
8. ✅ Confirm testnet connection from public URL

## Questions for Linera Team (if needed)

If you encounter issues, ask in Telegram:

1. **Faucet Issues:**
   > "Hi, I'm testing the web-client integration and getting timeouts when claiming a chain from the faucet. Is Testnet Conway faucet operational? Using @linera/client@0.15.7"

2. **Application ID Issues:**
   > "I deployed my contract to Testnet Conway and got Application ID: 1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a. When I try to query it via web-client, I get [error]. Is this the correct way to reference the application?"

3. **Library Loading Issues:**
   > "I'm loading @linera/client@0.15.7 from unpkg.com via import map, but getting [error]. Is there a recommended CDN or should I install the package differently?"

## Success Criteria

✅ Browser console shows successful initialization
✅ Green "Connected" status displayed
✅ Chain ID visible in UI
✅ Can view flips (even if empty)
✅ Can create new flip
✅ Can place bet on flip
✅ Real-time notifications work
✅ No console errors
✅ Works on Vercel deployment

---

## Current Implementation Details

**Files:**
- `web/lib/lineraClient.ts` - Core client logic
- `web/lib/lineraApi.ts` - API wrapper
- `web/components/LineraProvider.tsx` - React context
- `web/components/LineraStatus.tsx` - Status UI
- `web/app/layout.tsx` - Import map and provider setup

**Configuration:**
- Application ID: `1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a`
- Chain ID: Claimed dynamically from faucet
- Faucet URL: `https://faucet.testnet-conway.linera.net`
- CDN: `https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js`

**Dev Server:**
- URL: http://localhost:3000
- Status: Running
- Build: Successful
