# Vercel Deployment Setup

## Environment Variables

Add this environment variable in your Vercel project settings:

### For Mock Data (Current Setup)
Since the testnet GraphQL endpoint requires a local node service, the Vercel deployment currently uses mock data for demonstration purposes.

**No environment variable needed** - the app will work with mock data by default.

### For Live Testnet (Future)
When you have a publicly accessible GraphQL endpoint, add:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-public-endpoint.com/chains/9a58e5e2d5cc82891cd0bfebcc311b309716d357d979a8cb9892b3bfb8f18fc0/applications/1b5f7fcab424e855281b44b1b16a6c2fc608cd5a52e8cbb7d4383d021d754055
```

## Local Development

For local development with testnet:

1. Start the Linera node service:
```bash
linera service --port 8080 &
```

2. Run the frontend:
```bash
cd web
npm install
npm run dev
```

The app will automatically connect to `localhost:8080`.

## Deployment Steps

1. Push changes to GitHub
2. Vercel will automatically deploy
3. Frontend will use mock data until a public endpoint is configured
