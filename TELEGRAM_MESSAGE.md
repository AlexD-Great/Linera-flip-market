# Message to Post in Linera Telegram

Hi team, I'm integrating the web-client into my Next.js app to connect my Vercel frontend to Testnet Conway, but I'm stuck on loading the @linera/client library.

**What I've tried:**

1. **CDN approach:**
   ```javascript
   <script src="https://unpkg.com/@linera/client@0.15.7/dist/linera_web.js"></script>
   ```
   Result: Script fails to load (404 or network error)

2. **npm install:**
   ```bash
   npm install @linera/client
   ```
   Result: Fails on Windows with `'true' is not recognized as an internal or external command`

3. **Import maps:**
   Doesn't work in Next.js Server Components

**My setup:**
- Framework: Next.js 16.0.0
- Deployment target: Vercel
- OS: Windows (development)
- Goal: Connect to Testnet Conway
- Application ID: `1e586836ff21783e1336de9838a754e598e33d421b7237a20e04208f9634e68a`

**Questions:**
1. What's the correct way to load @linera/client in a Next.js application?
2. Is there a working CDN URL I should use?
3. If npm install is the way, how do I work around the Windows compatibility issue?
4. How should I set this up for Vercel deployment?

I'm following the counter example pattern but need guidance on the library loading part for Next.js specifically.

Thanks!
