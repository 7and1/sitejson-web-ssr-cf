# SiteJSON SSR Web (Cloudflare)

Next.js App Router project for Cloudflare Pages/Workers SSR deployment.

## Scripts

- `npm run dev`
- `npm run typecheck`
- `npm run build`

## Environment Variables

- `SITEJSON_API_BASE_URL` (backend base URL, example `http://127.0.0.1:8787`)
- `SITEJSON_API_KEY` (optional backend API key header)
- `SITEJSON_PROXY_TIMEOUT_MS` (optional, default `15000`)
- `PUBLIC_SITE_BASE_URL` (canonical site origin for metadata)

## Architecture

- UI is migrated from `sitejson-web-cf` as the primary design reference.
- Browser calls `services/mockApi.ts` (legacy filename) which now uses real APIs.
- Next route handlers under `app/api/sitejson/*` proxy requests to backend and keep auth headers server-side.
- Route metadata and canonical tags are generated per page.
