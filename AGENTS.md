## Goal
- Migrate from VAPID/web-push to OneSignal for push notifications and get push delivery working end-to-end.

## Constraints & Preferences
- Use OneSignal SDK via CDN (`OneSignalDeferred` pattern), not npm package
- Use existing `sw.js` as single service worker via `importScripts` + `serviceWorkerPath`
- Remove `web-push` dependency and `push_subscriptions` Supabase table entirely

## Progress
### Done
- Set up OneSignal credentials (App ID `b609b1d0-3efc-4bad-9757-798f50554f51`, API Key `os_v2_app_wye3d...imetzwzq`)
- Removed `web-push` from `package.json`; OneSignal loaded via CDN
- Updated `public/sw.js` with OneSignal `importScripts`; removed push/notificationclick listeners
- Updated `index.html` with OneSignal SDK script tag
- Rewrote `src/lib/pushNotifications.js` with OneSignal subscription flow
- Added OneSignal init via `OneSignalDeferred` in `src/main.tsx`
- Added OneSignal type declarations to `src/vite-env.d.ts`
- Rewrote `api/send-push.mjs` and `server/index.js` push endpoint to POST to OneSignal API
- Added `sendPushToOneSignal()` to `supabase/functions/verify-payment/index.ts`
- Deleted `supabase/migrations/push_subscriptions.sql`
- Created `tests/onesignal.spec.js` — 9 tests passing
- Added `VITE_ONESIGNAL_APP_ID` to GitHub Actions secrets and passed it in both `deploy.yml` and `deploy-netlify.yml`
- Added wishlist push notification: `handleToggleLike` now calls `sendPushNotification` when item is added
- Added **"Enable Push Notifications"** button on Profile page with card UI
- Added `ONESIGNAL_APP_ID` and `ONESIGNAL_API_KEY` to Vercel environment variables
- `/api/send-push` now returns **200** `{"success":true}` when wishlist is toggled (was 500 before env vars)
- `OneSignal.User.PushSubscription.id` = `60f1b865-57ed-4045-a810-bc1edff3b3da`, permission = `granted`, optedIn = `true`
- Broadcast push to `included_segments: ["All"]` delivered successfully
- **Found working targeting method**: `include_subscription_ids` with subscription ID `60f1b865-...` returns success with no errors
- Client now reads `OneSignal.User.PushSubscription.id` and sends it as `subscription_id` to the server
- Server uses `include_subscription_ids` when `subscription_id` is provided, falling back to `include_external_user_ids`
- Removed broken `login()`/`logout()` calls from client (silently skipped by SDK consent guard) — targeting by subscription ID instead

### Blocked
- OneSignal SDK v16 `login()` is silently skipped — internal `ge()` guard checks consent (`re()` returns true). Calling `setConsentGiven(true)` makes `O=true` but `login()` still doesn't set external_id
- `User.addAlias('external_id', ...)` fails with `"external_id" is reserved` (can only be set via `login()`)
- `include_external_user_ids` returns warning about unsubscribed subscriptions for user `a6ad3b80-...`
- `include_aliases` with any label returns "invalid_aliases" errors
- User `a6ad3b80-6a24-4d0c-b822-e1fa37b99a33` has 5 subscriptions, some orphaned with `notification_types: -10`

## Key Decisions
- Used CDN-based OneSignal SDK (`OneSignalDeferred` pattern) rather than npm package since `@onesignal/onesignal-ng` does not exist
- Used `login()` / `logout()` initially, then removed them because SDK's internal consent guard silently blocks login() — targeting by subscription ID is simpler and reliably works
- Added env vars directly in Vercel dashboard for API runtime; kept `.env.production` for Vite build-time only
- Used `dispatchEvent('click')` in Playwright to bypass PWA install prompt overlay interfering with clicks
- **Targeting by `include_subscription_ids`** rather than user-level targeting — sidesteps the broken `login()`/consent/external_id pipeline entirely

## Next Steps
1. ✅ Deploy to Vercel — pushed commit to trigger deployment
2. ✅ `sendPushToOneSignal` updated: accepts `subscription_id` and uses `include_subscription_ids` when provided
3. ✅ **New flow**: Checkout page reads OneSignal subscription ID and passes it as `subscription_id` in the `verify-payment` request body. Edge function stores it in the DB record and uses it for push targeting.
4. Verify push delivery on a real device (mobile push requires FCM/APNs setup in OneSignal dashboard)
5. Verify end-to-end on production: place a real test order and confirm push delivery

## Critical Context
- Local Playwright tests pass: OneSignal subscription created (`optedIn: true`), push sent to `/api/send-push` returns 200
- `OneSignal.config.appId` = `b609b1d0-3efc-4bad-9757-798f50554f51`, site origin = `https://knotbyfimihan.vercel.app` ✅
- `include_subscription_ids` works with subscription `60f1b865-57ed-4045-a810-bc1edff3b3da` — push accepted with no warnings
- `OneSignal.O` defaults to `false` (blocks `login()` via `ge()` guard); calling `setConsentGiven(true)` sets `O=true` but `login()` still doesn't persist alias
- `PushSubscription.optedIn` = `true` in browser SDK but API-side subscription may be `notification_types: -10` (unsubscribed) — SDK and API state are out of sync
- Old bundle `index-7t__39En.js` still cached in some browsers; hard refresh needed to get `index-C5wMWGN_.js` with correct v16 API calls

## Relevant Files
- `src/pages/Profile.jsx`: contains "Enable Push Notifications" card with button calling `requestPermissionAndSubscribe()`
- `src/lib/pushNotifications.js`: reads `OneSignal.User.PushSubscription.id` via `getOnesignalSubId()`, sends it as `subscription_id` to server; no longer uses `login()`/`logout()`
- `src/vite-env.d.ts`: type declarations for OneSignal v16
- `api/send-push.mjs`: uses `include_subscription_ids` when `subscription_id` is in request body, falls back to `include_external_user_ids`
- `server/index.js`: same logic as `api/send-push.mjs`
- `tests/onesignal.spec.js`: 9 tests covering all files
- `supabase/functions/verify-payment/index.ts`: `sendPushToOneSignal()` accepts `subscription_id` and uses `include_subscription_ids` when provided; falls back to `include_external_user_ids`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
