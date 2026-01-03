# URGENT: Need Help with @linera/client Package

## Problem
I'm trying to integrate the Linera web-client into my Next.js app to connect to Testnet Conway, but the `@linera/client` npm package has an empty `dist/` folder after installation.

## What I Did

1. **Tried npm install:**
   ```bash
   npm install @linera/client
   ```
   Result: Failed with `'true' is not recognized as command` (Windows)

2. **Tried with --ignore-scripts:**
   ```bash
   npm install @linera/client --ignore-scripts
   ```
   Result: Package installed BUT `dist/` folder is empty

3. **Checked package.json:**
   - Build script requires: `bash build.bash --release`
   - Needs Rust/WASM compilation
   - Can't run on Windows

## Current Situation
- Package version: 0.15.8
- `dist/` folder: EMPTY (no built files)
- Import fails: `import * as linera from '@linera/client'` → nothing to import
- Browser: Blank screen

## Questions

**1. How do I get the built @linera/client files?**
   - Is there a pre-built version available?
   - Should I download from a CDN?
   - Do I need to build it myself (how on Windows)?

**2. What's the correct setup for Next.js + Windows + Vercel?**
   - The counter example doesn't show Next.js setup
   - How do other developers use this package?

**3. Alternative approaches?**
   - Can I use the library without npm?
   - Is there a different package I should use?
   - Should I use a different framework?

## My Setup
- Framework: Next.js 16.0.0
- OS: Windows (development)
- Deployment: Vercel
- Goal: Connect frontend to Testnet Conway
- Application ID: `1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a`

## What I Need
**Clear step-by-step instructions** on how to:
1. Get the @linera/client library working in Next.js on Windows
2. Connect to Testnet Conway from the browser
3. Make it work on Vercel deployment

This is blocking my entire integration. Any help would be greatly appreciated!

## Reference
- Counter example: https://github.com/linera-io/linera-web/tree/main/examples/counter
- My repo: (can share if needed)
