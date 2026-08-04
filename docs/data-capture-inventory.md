# MXN data-capture inventory

Snapshot: 2026-08-04
Scope: `C:\mason\mxn-au` repository, the current `codex/analytics-foundation` working tree, and provider state already verified during the GA4 review.
Registry companion: `docs/data-policy-registry-draft.json`
Risks companion: `docs/data-governance-gap-risk-report.md`

## What this document means

This is the repository-wide inventory of systems that capture, derive, transmit, or retain data. It covers analytics, operational logging, telemetry, security/audit events, and adjacent product data stores whose capture rules must be understood before central governance can be built.

The approved model is central policy, not one physical pipeline. A browser analytics adapter, a trusted backend logger, a security audit sink, and provider-native controls may remain separate. Their classification, required/optional status, consent behaviour, permitted fields, sanitisation, destination, identity level, and retention class must eventually come from the shared registry and approved interfaces.

Retention is recorded honestly. The proposed registry assigns a class; this inventory separately states the mechanism that actually enforces retention. `None found` and `unknown` mean exactly that. They do not mean the future engine can delete data from that destination.

MXN's stated principles for this work are:

- MXN does not sell user data.
- MXN does not run advertising or use captured data for advertising.
- Optional Google Analytics uses one explicit Accept/Decline choice before it starts. This conservative change supersedes the earlier default-on draft because the public site receives international traffic.
- Cloudflare infrastructure analytics is required and is not controlled by the application preference.
- Everhomes tool analytics is required and is not controlled by the application preference.
- Required operational and security capture may be necessary for a feature to function or remain safe.
- The user experience should use one clear approval/decline interaction, not repeated disclosure prompts.

## Status vocabulary

- **Required**: necessary for the requested service, operations, fraud/security, or an explicitly approved required system.
- **Optional, prior choice**: collected only after one explicit choice; currently intended for GA4 only.
- **Needs decision**: current code captures data, but no approved necessity decision exists.
- **Not user-controlled**: provider or infrastructure capture outside the application preference.
- **Central control: yes**: an MXN-controlled adapter can obey a registry decision at runtime.
- **Central control: partial**: some decisions are application-controlled, but provider, infrastructure, or separate-runtime settings also apply.
- **Central control: no**: the repository application cannot control it; governance is documentation/configuration/contract based.

## System inventory

Every row distinguishes the requested six dimensions. More precise field lists and evidence paths are in the JSON registry.

| ID | Class | Capture point | Policy ownership now -> target | Runtime implementation | Storage destination | Retention enforcement observed | Central control |
|---|---|---|---|---|---|---|---|
| `AN-001` | Analytics | Page load, SPA navigation, login, signup | Branch-local GA policy -> shared registry | Firebase Analytics browser SDK; current hardening is local and not deployed | GA4 property `443572528`, stream `8206191337` | GA4 property setting: event/user data 14 months | Partial: browser collection is controllable; property/enhanced-measurement settings are external |
| `AN-002` | Analytics / infrastructure | Requests served through Cloudflare | Cloudflare account -> registry documentation plus infrastructure owner | Cloudflare beacon/edge systems, observed live but not defined in repository | Cloudflare | Provider/account setting; value not verified | No application runtime control; required by decision |
| `AN-003` | Analytics | Everhomes tool open/use/completion actions | Everhomes feature code -> shared registry | Browser helper plus `recordEverhomesToolUsage` callable | Firestore `everhomesToolUsage`, `everhomesToolUsageDaily`, `everhomesToolUsageSessions` | None found | Yes across separate frontend/backend adapters; required by decision |
| `AN-004` | Analytics | Daily-game completion and generation | Individual game functions -> shared registry | Firebase callable/scheduled functions | Firestore `dailyChallenges` and user game records | None found | Yes |
| `AN-005` | Analytics / product history | Unlimited Wordle play | Wordle Unlimited function -> shared registry | Firebase callable | Per-user game history and global per-word/aggregate Firestore documents | None found | Yes |
| `AN-006` | Analytics | 8 Ball, coin, and dice use | Individual feature code -> shared registry | Direct Firestore writes/increments | Firestore `funCounters`; 8 Ball also writes `eightBallQuestions` | None found | Yes |
| `AN-007` | Analytics | TopHeroes page views, votes, shares, comments/replies | TopHeroes stores and Firestore rules -> shared registry | Direct public Firestore updates | Queue/published-ranking counters and content documents | None found | Yes, but current public counters are not trustworthy |
| `AN-008` | Analytics | X2Vertical fetches and cache hits/misses | X2Vertical function code -> shared registry | Firebase HTTPS functions plus X API | Firestore `x2vertical`; Cloud Logging; X receives requested tweet IDs | None found for Firestore; provider retention unknown | Partial |
| `AN-009` | Analytics / placeholder | TopHeroes admin analytics screen | Component-local mock data -> shared registry if made real | Static/mock frontend data | Browser memory and persisted admin store values | Browser lifecycle/local storage | Yes; it is not a real analytics source today |
| `LG-001` | Operational logging | Auth login/logout/signup | Auth utilities -> shared registry | Browser Firestore SDK | `users/{uid}`, `users/{uid}/logins`, `users/{uid}/userEvents` | None found | Yes |
| `LG-002` | Operational telemetry | Authenticated browsing session start and user events | Shared utilities -> shared registry | Browser Firestore SDK | `users/{uid}/tracking`, `users/{uid}/userEvents` | None found | Yes |
| `LG-003` | Operational logging | Every active Cloud Function's stdout/stderr and structured logger calls | Each function -> shared registry plus logging adapter | Firebase Functions / Google Cloud Logging | Google Cloud Logging | Provider/project setting; not verified | Partial |
| `LG-004` | Developer diagnostics | Frontend errors, payloads, timings, and status messages | 182 source files independently -> shared logging policy | Browser console | Browser/devtools and any attached collection tooling | Browser/tool dependent | Yes for emitted fields; downstream tooling unknown |
| `LG-005` | Operational logging | Translation request completion | Translation endpoints/processors -> shared registry | HTTPS function -> Pub/Sub -> processors | Firestore global/user/guild/channel histories and aggregates; Cloud Logging | None found | Yes across separate backend runtimes |
| `LG-006` | Operational logging | Translation failures | Error topic/processor -> shared registry | Pub/Sub processor and Cloud Logging | Firestore `translations/errors/{day}` and Cloud Logging | None found / provider setting unknown | Partial |
| `LG-007` | Operational logging | Everhomes report stages and function outcomes | Each Everhomes function -> shared registry | Structured Cloud Function logger calls | Google Cloud Logging | Provider/project setting; not verified | Partial |
| `LG-008` | Operational logging | Everhomes photo upload failure | Report client/function -> shared registry | `recordEverhomesUploadFailure` callable | Report subcollection `uploadFailures` and parent summary | Bounded to newest 50 events per report; parent summary persists | Yes |
| `LG-009` | Operational logging | Everhomes PDF/ZIP generation | Report-generation functions -> shared registry | Cloud Functions | Report `artifactGenerations` subcollection and parent report fields | Failed/incomplete generation cleanup exists; no completed-record retention found | Yes |
| `LG-010` | Operational logging | Contact form submission | Contact helper -> shared registry | Browser POST to Cloudflare Worker | Worker/provider and email recipients; exact backend storage unknown | Unknown | Partial; Worker implementation is outside this repository |
| `LG-011` | Operational logging | Minecraft panel mutations | Separate Minecraft backend -> shared registry contract | Express backend source copy under `src/shared/not-in-project` | `panel-activity.jsonl` on Minecraft host | No rotation/deletion found | Partial; separate runtime and checked-in copy may not be authoritative |
| `LG-012` | Operational logging | Minecraft server execution/player activity | Minecraft server process | Server `.log`/`.log.gz` files; streamed to browser | Minecraft/server infrastructure settings; not found here | No application control; interface can restrict access/fields |
| `LG-013` | Operational telemetry | SSH/admin connections and latency | Separate backend -> shared registry contract | In-memory Express admin route source copy | Process memory plus console | Last 100 connections and 25 latency values per session; lost at restart | Partial; separate runtime |
| `LG-014` | Operational logging | Discord bot dashboard operations | Firebase trust-boundary functions -> shared registry contract | Browser calls a Firebase proxy; the proxy verifies an opaque session and guild-management permission before calling `bot-api.mxn.au` | External bot backend/audit endpoint; exact store unknown | Unknown | Partial; browser/API-key boundary is locally remediated but the external store remains outside this repository |
| `LG-015` | Operational logging | TopHeroes public reports/comments | TopHeroes public store -> shared registry | Direct Firestore writes; former Discord notifications are intentionally retired | Firestore comments/report arrays only | None found | Yes for current Firestore capture; no Discord delivery remains |
| `LG-016` | Operational logging | Rankings report run | Report function -> shared registry | Firebase callable/HTTP function | `topheroes/velaris/audit` and Cloud Logging | None found / provider setting unknown | Partial |
| `TM-001` | Local telemetry | FPS, frame time, memory, paint/measure counts | PerformanceMonitor component -> shared registry if transmitted later | Browser Performance APIs | Component memory only | Page/component lifetime | Yes; currently not transmitted |
| `TM-002` | Infrastructure telemetry | Function request metrics, Hosting requests, Firestore/Storage usage | Firebase/GCP services -> registry documentation and infrastructure owner | Provider-native systems | Firebase/Google Cloud | Provider/project settings; not verified | No/partial depending on provider setting |
| `SC-001` | Security/audit | Firebase sign-in, token issuance, auth failures | Firebase Auth/provider -> shared registry documentation | Firebase Auth | Firebase/Google identity systems | Provider setting; not verified | Partial |
| `SC-002` | Security/audit | Firestore, Storage, and Function access/denials | Firebase/GCP IAM and services -> shared registry documentation | Provider-native request/audit systems | Google Cloud/Firebase | Provider/project settings; not verified | Partial/no |
| `SC-003` | Security/audit | Discord OAuth exchange and refresh | Discord dashboard functions -> shared registry | Firebase Functions calling Discord | Firestore `discord_users/{discordId}` stores identity and OAuth tokens; Discord also processes requests | Token expiry exists; record/token deletion policy not found | Partial |
| `SC-004` | Security/audit gap | Everhomes admin resend, regenerate, deletion/recovery | Feature functions; no dedicated audit policy -> shared security-audit registry | Firebase callable functions | Parent report mutation and Cloud Logging only | Same as report/log retention; no immutable audit sink | Partial |
| `PD-001` | Product data | Translation input/output and correction | Translation feature/functions -> product-data policy registry | Browser, OpenAI, DeepL, Pub/Sub processors | Firestore translation cache/history; OpenAI/DeepL; local storage | Cache validity exists in parts; durable histories have no cleanup found; providers unknown | Partial |
| `PD-002` | Product data | Everhomes report/draft/photos/signatures | Everhomes UI/functions -> product-data policy registry | Browser, Firebase Functions | Browser local storage/IndexedDB; Firestore reports; Firebase Storage; Resend/email | Explicit draft deletion and stale-deletion recovery; source photos cleaned after generation; signed URLs expire; no overall completed-report schedule | Partial across multiple mechanisms |
| `PD-003` | Product data | TopHeroes content, guild/member/event/ranking records | TopHeroes stores/rules -> product-data policy registry | Browser Firestore SDK and functions | Firestore `topheroes/**`, local/session caches | None found | Yes |
| `PD-004` | Product data | Personal notes, journal, kanban, goals and account settings | Personal feature stores -> product-data policy registry | Browser Firestore SDK/local storage | User-scoped Firestore and browser storage | Account/data deletion mechanism not found | Yes |
| `PD-005` | Product data | Destiny profile/challenge data and Bungie OAuth | Feature UI; backend exports currently commented out | Browser Firestore SDK; source-only Functions code | Firestore `destiny/**`, Bungie; browser state | OAuth-state cleanup code exists; durable profile/token retention not found | Partial; backend deployment state is uncertain/inactive in this codebase |
| `PD-006` | Product data / local | QR text and Wi-Fi credentials | QR components -> product-data policy registry | Browser `localStorage` | Keys include `qr-text-input`, `qr-wifi-ssid`, `qr-wifi-password`, settings and filename | User/browser clearing only | Yes |
| `PD-007` | Product data / local | Minecraft logs, command history, activity, snapshots and metadata | Minecraft frontend store/components -> product-data policy registry | Browser `localStorage` | `mxn:minecraft:*` keys | User/browser clearing; local snapshots have count limits | Yes for browser cache |
| `PD-008` | Product data / local | Daily-game state | Per-game Pinia stores -> product-data policy registry | Browser `localStorage` | `mxn:daily:*`, `mxn:wordle-unlimited`, `core_defense_meta` | User/browser clearing and selected resets | Yes |
| `PD-009` | Product data / local | D&D dashboard, Goblin calculator, TopHeroes drafts/events/votes, Discord mock UI, themes/preferences | Individual components/stores -> product-data policy registry | Browser local/session storage | Named feature keys and persisted Pinia stores | User/browser clearing; some session caches expire at session end | Yes |
| `PD-010` | Sensitive local recovery data | Everhomes drafts, photos and access state | Everhomes report store/upload cache -> product-data policy registry | Browser localStorage and IndexedDB | `everhomes_report_*`, legacy keys, `everhomes-report-upload-recovery`, tool session key | Feature reset/migration and user/browser clearing; no complete bounded schedule | Yes |
| `PD-011` | Security-sensitive local state | MXN account profile and remember-me preference | Main Pinia store -> security policy registry | Persisted browser Pinia store | `localStorage`; remember-me flag in `sessionStorage` | Logout/user/browser clearing | Yes; local implementation excludes and scrubs the Firebase ID token |
| `PD-012` | Security-sensitive local state | Translation preferences and recent translation history | Translation Pinia store -> security/product policy registry | Persisted browser Pinia store | `localStorage` | User/browser clearing | Yes; local implementation excludes and scrubs the OpenAI API key; content-history policy remains deferred |
| `PD-013` | Security-sensitive local state | Discord identity and opaque dashboard session | Discord/translation-bot stores -> security/product policy registry | Persisted Pinia in browser `sessionStorage`; hashed session record in Firestore | Tab/session end or 24-hour server expiry; legacy local keys scrubbed | Yes; locally remediated, deployment pending |
| `PD-014` | Domain/product data | Food, castle, user settings/command history and other rule-declared collections | Individual features -> product-data registry | Browser Firestore SDK | `foodDatabase`, `castleData`, `users/**`, and other rule-declared collections | None found | Yes |
| `PD-015` | Disabled store | Realtime Database | Firebase rules | Firebase RTDB SDK/provider | Realtime Database | No active capture found; global reads/writes denied | Yes |
| `EX-001` | External request metadata | Google Fonts, jsDelivr, GitHub API, Discord widget/CDN, image CDNs, YouTube/Vimeo embeds | Individual components -> external-destination registry | Browser HTTP requests | External providers receive IP/request headers and requested resource | Provider-managed/unknown | Partial; resource use is controllable, provider retention is not |

## Detailed data flows

### Google Analytics and Cloudflare

The branch-local GA adapter allows only `page_view`, `login`, and `sign_up`; strips query strings, fragments, and dynamic route values; restricts collection to four production hosts; waits for an explicit one-time Accept choice; and remembers either choice. That implementation is not deployed. The last production audit showed automatic GA events including page views, scrolling, engagement, first visits, form starts, clicks, and downloads. GA4 property settings already verified include Google Signals off, user-provided-data collection off, URL redaction for 14 sensitive keys, and 14-month event retention.

Cloudflare analytics was observed in the live site but is not initialized by repository code. It must be represented in policy as a required, externally controlled infrastructure system. The application must not claim that its analytics switch controls Cloudflare.

### Firebase identity, user events, and platform records

Firebase Auth handles identity and tokens. Application code additionally writes login/logout/signup history, account-created events, page/action/error events, and session/device context beneath each user. Observed context includes user agent, viewport/screen, locale, time zone, platform/vendor, referrer, entry path, source, and timestamps. These paths currently define their own fields and have no repository-level retention enforcement.

Firebase Hosting, Functions, Firestore, Storage, and Auth may also create provider-native request, diagnostic, and security records. Their exact enabled datasets and retention settings cannot be proved from this repository and require a provider-console/configuration inventory later. They remain listed now rather than treated as absent.

### Translation

Raw input and output can pass through the browser, Firebase Functions, OpenAI, DeepL, Pub/Sub, Firestore caches, per-user history, Discord guild/channel/user aggregates, error documents, local storage, and Cloud Logging. Usage documents include language pairs, word/character counts, cache status, response time, model/token usage, platform information, timestamps, and identities where available. Error paths can contain provider response text and raw error detail. No coherent deletion schedule was found.

### Everhomes

Required tool analytics records a bounded vocabulary of opens, starts, calculations, QR generation/download/copy, and report submission events. The backend derives the tool meaning and stores event, daily, and session records.

Inspection/handover operation also captures property address, dates, inspector identity, checklist state, photos, signatures, draft capability keys, recipient email addresses, storage paths, generated files, provider message IDs, generation stages, upload failure detail, and timestamps. Data spans local storage, IndexedDB, Firestore, Storage, Cloud Logging, and Resend/email. Some cleanup mechanisms exist, but they address stale deletion states, source-photo cleanup, failed generations, bounded upload-failure history, or expiring links—not a complete retention schedule for completed reports.

### Daily games and fun tools

Daily-game functions retain outcomes, attempts, scores, histograms, and authenticated user history. Unlimited Wordle additionally retains guesses/masks and per-word history. Fun counters aggregate question/coin/dice usage, while 8 Ball also stores the user's complete free-text question and generated answer. The free-text record is substantially more sensitive than the aggregate counter and must not inherit the counter's field policy.

### TopHeroes

TopHeroes stores large product datasets for guilds, members, events, rankings, guides, queues, comments, and replies. Analytics-like fields include public view, vote, share, comment, and report counts. The Firestore rules allow several public direct updates, so these values are engagement counters rather than trusted analytics. The owner reports that this community surface has had effectively no interaction for roughly a year and that its historically abused Discord webhooks were already revoked. Browser webhook URLs were removed, notification delivery is intentionally disabled, and no replacement trigger or secret is planned. The admin analytics screen contains mock/static data and must not be represented as a production measurement system.

Rankings report execution creates identifiable audit records in Firestore and detailed Cloud logs. Other admin actions send client-authored audit payloads to an external bot service whose storage and retention are not present in this repository.

### Discord bot dashboard

OAuth functions exchange Discord codes, retrieve identity and guild data, refresh tokens, and store Discord access/refresh tokens in Firestore. The local remediation returns an opaque 24-hour session token, stores only its hash server-side, keeps the browser copy in session storage, and places the server-held bot API key behind a Firebase proxy that rechecks guild-management permission. Audit actor identity is derived from that trusted session. The implementation and retention of `bot-api.mxn.au` remain outside this repository, and the local boundary has not yet been deployed.

### Minecraft and SSH administration

The browser caches activity, snapshots, logs, command history, RCON custom commands, metadata, and log-view preferences. The separate backend source copy writes an append-only JSONL activity record containing actor identity, server, action, target, status, duration, and restart effects. Minecraft's own logs can contain player names, chat, commands, connection addresses, and operational detail. No activity-log rotation was found. Because the backend file is explicitly under `not-in-project`, deployment parity must be verified before treating it as authoritative.

### Browser-only stores and external requests

Browser storage is itself a destination. The local security pass removes Firebase ID tokens and OpenAI API keys from persisted stores and moves the Discord dashboard token to session storage. Remaining examples include translation history, Everhomes drafts/files, Wi-Fi passwords entered into the QR tools, Minecraft logs, TopHeroes datasets, D&D notes, game progress, and preference/identity state. Most remaining retention is simply “until browser/user clearing.”

Loading third-party fonts, images, embeds, GitHub data, Discord widgets, and CDN assets also discloses request metadata to those providers. These are not behavioural analytics events created by MXN, but they are data interactions and therefore appear in the inventory.

## Retention mechanisms actually found

| System | Mechanism | What it does not prove |
|---|---|---|
| GA4 | Property retention set to 14 months | Does not govern Cloudflare, Firestore, logs, local storage, or other providers |
| Everhomes upload failures | Keeps newest 50 subcollection events | Does not expire the parent summary or report |
| Everhomes stale-report sweep | Deletes/retries records stuck in deletion or active processing states | Is not a completed-report retention policy |
| Everhomes generation cleanup | Removes source photos after generation and failed generation output | Does not schedule deletion of completed reports/artifacts |
| Everhomes signed URLs | Expire after defined link periods | URL expiry is not file deletion |
| X2Vertical browser recents | Capped at four | Does not delete the global Firestore cache |
| SSH admin in-memory records | Capped at 100 connections and 25 latency samples/session | Does not govern console/provider logs and vanishes only with process lifetime |
| OAuth state cache (source-only Destiny code) | 15-minute state validation and cleanup | Does not delete long-lived profile/token records |
| Browser/session storage | User clearing, logout for selected keys, or session close | Is not centrally assured retention enforcement |
| Other Firestore collections | No TTL or cleanup found | Retention remains undefined |
| Cloud Logging and external providers | Settings not verified | No retention claim can be made yet |

## Coverage and limitations

This inventory is exhaustive for capture points discoverable in the repository snapshot and the previously verified GA4/Cloudflare state. It does not claim visibility into:

- provider-console settings not represented in source;
- the deployed implementation of `bot-api.mxn.au`, `ssh.mxn.au`, the contact Worker, or the Minecraft host;
- Cloudflare, Resend, OpenAI, DeepL, Discord, X, Bungie, GitHub, CDN, font, and embed-provider internal logs or retention;
- Firebase/GCP datasets enabled only through console or organization policy;
- differences between checked-in `not-in-project` backend copies and deployed services;
- application changes on this branch that have not been deployed.

These unknowns are inventory results. They must be resolved through later provider/configuration review; they are not reasons to omit the systems from central policy.
