# Question for Linera Team

## Context
I'm trying to integrate the Linera web-client into my Next.js frontend following the counter example pattern. The goal is to connect my Vercel-deployed frontend to Testnet Conway.

## Issue
I'm unable to load the `@linera/client` library. I've tried:

1. **Import map approach:**
```html
<script type="importmap">
{
  "imports": {
    "@linera/client": "https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js"
  }
}
</script>
```
Result: Import map doesn't work in Next.js Server Components

2. **Direct script loading:**
```javascript
<Script src="https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js" />
```
Result: Script fails to load (404 or CORS error)

3. **Dynamic script injection:**
```javascript
const script = document.createElement('script');
script.src = 'https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js';
document.head.appendChild(script);
```
Result: Script fails to load

4. **npm install:**
```bash
npm install @linera/client
```
Result: Fails on Windows with error: `'true' is not recognized as an internal or external command`

## Questions

1. **What's the correct way to load @linera/client in a Next.js application?**
   - Should I use CDN or npm install?
   - If CDN, what's the correct URL?
   - If npm, how do I work around the Windows install issue?

2. **Is @linera/client published to npm?**
   - I can't find it on npmjs.com
   - Is it only available via GitHub?

3. **What's the recommended setup for production deployment on Vercel?**
   - The counter example uses a different setup
   - How should I adapt it for Next.js + Vercel?

4. **Alternative approach:**
   - Should I build the library from source?
   - Is there a pre-built UMD bundle I can use?

## My Setup
- Framework: Next.js 16.0.0
- Deployment: Vercel
- OS: Windows (development)
- Goal: Connect to Testnet Conway
- Application ID: `1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a`

## What I Need
Clear instructions on how to:
1. Load the @linera/client library in a Next.js app
2. Initialize the client and connect to Testnet Conway
3. Make it work on Vercel (no localhost dependencies)

Thank you!
