# Environment and Deployment

## Overview

Environment variables are **injected at runtime** (not baked into the build). The app waits in `src/runtime-env.ts` until `window.env` is available before rendering.

The source of `window.env` is `public/environment.js`, a plain JS file included by `index.html`:

```js
// public/environment.js
window.env = {
  PUBLIC_NODE_ENV: 'development',
}
```

This file is overwritten at deploy time with real values — either by `generate_environment.sh` (Docker) or `scripts/generate-env.mjs` (Vercel/CI).

## Adding a New Environment Variable

### Step 1: Declare the type

In `src/runtime-env.ts`, add the variable to the `Window.env` interface:

```typescript
declare global {
  interface Window {
    env: {
      [name: string]: string | undefined;
      PUBLIC_NODE_ENV: string;
      PUBLIC_MY_API_URL?: string;    // add here
    };
  }
}
```

### Step 2: Use in the app

```typescript
const apiUrl = window.env.PUBLIC_MY_API_URL;
```

### Step 3: Set the value

- **Local dev**: Add it to `public/environment.js`
- **Vercel**: Add it as an environment variable in Vercel's project settings (under Settings → Environment Variables). All variables starting with `PUBLIC_` are automatically included by `scripts/generate-env.mjs`.
- **Docker**: Pass it as a shell environment variable when running the container — `generate_environment.sh` picks up anything matching `PUBLIC_*`.

> Only variables prefixed with `PUBLIC_` are included. Never put secrets in `PUBLIC_` variables — they are shipped to the browser.

---

## Deploying to Vercel

### Initial Setup (one time)

1. Push the repository to GitHub (or fork it at [github.com/ingridl-santos/flag-football-analyzer](https://github.com/ingridl-santos/flag-football-analyzer))
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → import the repository
4. Vercel will auto-detect the framework. It will also read `vercel.json` — no manual configuration is needed:
   - Build command: `npm run vercel-build`
   - Output directory: `dist/app`
5. Add any required environment variables under **Settings → Environment Variables** (prefix all with `PUBLIC_`)
6. Click **Deploy**

### Subsequent Deploys

Every push to `main` triggers an automatic deployment. Pull requests get preview deployments automatically.

### How the Build Works on Vercel

The `vercel-build` npm script:

```
node scripts/generate-env.mjs && npm run build
```

1. `scripts/generate-env.mjs` reads all `PUBLIC_*` variables from `process.env` (set in Vercel's dashboard) and writes them to `public/environment.js`
2. `npm run build` runs `tsc && vite build`, which includes the generated `environment.js` in `dist/app/`

### Routing

`vercel.json` includes a rewrite rule that sends all requests without a matching file to `/index.html`, enabling client-side React Router navigation:

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

### Cache Headers

`vercel.json` configures cache headers to match the nginx config used in Docker:

| File | Cache |
|---|---|
| `index.html` | `no-cache, no-store` |
| `environment.js` | `no-cache, no-store` |
| `/locales/*.json` | 5 minutes |
| `/vendor/*.wasm` | 24 hours |

Vite hashes all JS/CSS/font filenames at build time, so they are effectively immutable and Vercel CDN caches them aggressively by default.

---

## Docker Deployment

The `Dockerfile` builds the app and serves it via nginx. The `generate_environment.sh` script runs at container startup as the `ENTRYPOINT`, writing `window.env` from shell environment variables before nginx launches:

```bash
docker build -t flag-football-analyzer .
docker run -p 80:80 \
  -e PUBLIC_NODE_ENV=production \
  flag-football-analyzer
```

The nginx config (`nginx.conf`) handles:
- SPA routing (`try_files $uri $uri/ /index.html`)
- Cache-control headers per file type
- Storybook served at `/storybook` (from `dist/storybook/`)

---

## Local Development

The `public/environment.js` file is the source of truth for local dev. Edit it directly to change env var values:

```js
window.env = {
  PUBLIC_NODE_ENV: 'development',
}
```

This file is **committed to the repository** with safe development defaults. Do not commit secrets here.
