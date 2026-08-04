# Google Analytics audit checkpoint — 2026-07-31

Status: implementation in progress as of 2026-08-04. The original read-only findings remain below for history; the current state is recorded under Implementation progress.

Working branch: `codex/analytics-foundation`, created from clean `main` at `ed1919a9f42eb94be5548e0a2406aec30ae78b8e`.

## Verified property and stream

- Analytics account: Mason Bartholomai (`295311782`)
- GA4 property: mxn-au (`443572528`)
- Web stream: mxn-au (`8206191337`)
- Measurement ID: `G-B5HH3LHF33`
- The stream ID matches `VITE_FIREBASE_MEASUREMENT_ID` in the local production environment.
- Property time zone: Australia / Brisbane (GMT+10)
- Currency: Australian Dollar
- Industry: Computers & Electronics
- Business size and business objectives are unset.
- Search Console is linked to the `mxn.au` domain property and the correct web stream (linked 2025-12-19).
- Firebase project `mxn-au` is linked (linked 2024-05-30).
- BigQuery is not linked.

## End-to-end collection proof

Production collection works. A fresh visit to `https://mxn.au/8ball` appeared in GA4 Realtime as `/8ball`, increasing the active-user and view counts.

Last 28 days at the time of audit:

- 62 active users
- 47 new users
- 165 sessions visible across the listed source/medium rows
- 475 page views
- 1,041 events
- 4m 56s average engagement time per active user
- 0 key events

The collected event taxonomy contains only automatic events:

- `page_view` — 475
- `scroll` — 195
- `session_start` — 165
- `user_engagement` — 144
- `first_visit` — 47
- `form_start` — 8
- `click` — 4
- `file_download` — 3

There are no useful product or workflow events yet. `purchase` is the only pre-created key event and has no stream data.

Top page paths include `/`, `/everhomes`, `/minecraft/mc`, `/minecraft`, `/everhomes/report/handover`, `/everhomes/report/inspection`, `/8ball`, `/dice`, `/minecraft/hc`, and `/coin`. Some operational pages are heavily skewed by a single user (for example, `/minecraft/mc` had 62 views from one active user), so internal/development activity needs better separation before those metrics are used for decisions.

## Configuration that is already correct

- The web stream is receiving traffic.
- Enhanced Measurement is enabled.
- Page loads and browser-history page changes are both enabled, so Vue SPA navigations currently generate page views.
- Scroll, outbound click, site-search, form-interaction, video-engagement, and file-download collection are enabled.
- Email redaction is enabled.
- Reporting identity is Blended.
- Search Console and Firebase links point at the intended property/project.
- The default channel group is in use.

## Findings requiring remediation

### P0 — privacy and sensitive URL exposure

1. Consent Mode signals are inactive. The application has no site-wide analytics consent prompt or preference control.
2. Google Signals is enabled in all 307 regions, while `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` consent signals are not implemented. Traffic already includes European countries.
3. URL query-parameter redaction is disabled. The application uses sensitive callback parameters including `code`, `error_description`, and `redirect`.
4. Everhomes resume links put a draft access key in the URL fragment: `#everhomes-draft=<type>.<id>.<accessKey>`. Automatic initial page views can race the component that removes this fragment. Page locations must be sanitized before any analytics event is sent.
5. The current automatic setup can send the full browser location. Query strings and fragments should never be included in GA page locations for this application.

### P0 — data quality and environment isolation

1. `src/firebase.js` initializes Firebase Analytics automatically on every supported browser and silently catches initialization failures.
2. There is no production-host allowlist or development guard. Local builds use the same Measurement ID and can pollute production GA4.
3. The exported `analytics` binding is otherwise unused. There is no central event API, status reporting, consent handling, parameter policy, or test coverage.
4. Automatic history page views provide route counts, but no meaningful business outcomes are measured.

### P1 — GA4 property configuration

1. Event-data retention is only 2 months. User-data retention is 14 months. Event retention should be raised to 14 months.
2. The Internal Traffic filter exists but is only in Testing. No trusted internal-traffic definition was verified, so it must not be activated blindly.
3. Google tag diagnostics reports **Needs Attention** because no explicit monitored domains are configured. It auto-detected `mxn.au` and `mxn-au.web.app`; both should be added as monitored production domains.
4. Business size and business objectives are unset.
5. There are no custom dimensions or metrics.
6. The only audiences are All Users and the unused default Purchasers audience.
7. There are no meaningful key events.

### P2 — optional maturity improvements

1. BigQuery daily export is not configured. This is valuable for durable raw-event analysis but should be enabled only after confirming billing/data-location preferences.
2. No custom insights or anomaly alerts are configured.
3. No explicit release annotations are being added for major deployments.

## Planned implementation

1. Replace automatic Firebase Analytics initialization with a central analytics module.
2. Present one short, one-time Accept/Decline choice before optional Google Analytics starts, and remember the choice. This supersedes the earlier default-on draft after reviewing international cookie requirements.
3. Keep all advertising consent states denied and disable Google Signals unless there is a future, justified advertising use case.
4. Add one compact global notice and a concise `/analytics` preference page.
5. Permit collection only on exact production hosts (`mxn.au`, `www.mxn.au`, `mxn-au.web.app`, and `mxn-au.firebaseapp.com`) in production builds.
6. Disable automatic page views and send manual Vue Router page views with query strings and fragments stripped.
7. Add a strict event/parameter allowlist so PII, addresses, report IDs, access keys, emails, free text, and raw errors cannot be sent accidentally.
8. Add allowlisted authentication events. Keep Everhomes analytics and required operational logging outside the optional preference.
9. Add unit tests for production-host gating, URL sanitization, consent behavior, and event-parameter filtering.
10. In GA4, enable query redaction for at least `code`, `error`, `error_description`, and `redirect`; raise event retention to 14 months; disable Google Signals; add both production domains to diagnostics; and complete property business details.
11. After deployment, verify both consent choices, prove sanitized SPA page views and custom events in Realtime/DebugView, create required custom dimensions, and mark `sign_up` and successful report completion events as key events.
12. Leave Internal Traffic in Testing until a real office/VPN IP rule is supplied and validated. Treat BigQuery as a separate opt-in decision.

## Implementation progress — 2026-08-04

- Merged current `main` into `codex/analytics-foundation` before continuing.
- Optional GA4 now waits for a one-time Accept/Decline choice and can be changed at `/analytics`; the versioned choice and decision time are remembered locally. This conservative posture supersedes the earlier default-on implementation draft.
- GA4 loads only in production builds on the four exact production hosts.
- Advertising storage, ad user data, and ad personalisation remain denied. Google Signals and user-provided-data collection are disabled in GA4.
- Manual page views use stable route patterns and strip query strings, fragments, and dynamic values. Unknown catch-all routes are recorded as `/404`.
- GA4 event parameters and required Firestore operational-event fields are allowlisted. Raw URLs, free text, access keys, report IDs, and raw errors are not accepted by these logging paths.
- Required Cloudflare, Everhomes, and operational logging were not made optional and their product behaviour was not changed.
- GA4 event retention is now 14 months.
- GA4 URL redaction is enabled for 14 keys: `code`, `error`, `error_description`, `redirect`, `state`, `token`, `accesskey`, `key`, `jobid`, `dataset`, `version`, `serverid`, `role`, and `guild_id`.
- Enhanced Measurement browser-history page views, site search, and form interactions are disabled. Page loads remain enabled at the stream level; the app uses `send_page_view: false` and emits sanitized manual page views.
- Local unit tests, production build, and browser UI/persistence checks passed. These application changes are not deployed yet.

## Resume point

Finish final verification on `codex/analytics-foundation`, then commit/push/deploy only when requested. After deployment, confirm production Accept/Decline behaviour and sanitized events in GA4 Realtime/DebugView before creating key events or custom definitions.
