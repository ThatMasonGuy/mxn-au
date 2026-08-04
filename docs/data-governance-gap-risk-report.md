# MXN data-governance gap and risk report

Snapshot: 2026-08-04
Scope: findings from `docs/data-capture-inventory.md` and `docs/data-policy-registry-draft.json`.
Status: documentation only. No application code, Firebase/GA4/Cloudflare configuration, retention setting, or external service was changed by this inventory.

## Executive result

The repository does not currently have central governance for analytics, logging, telemetry, security/audit events, or adjacent product-data capture. It has many useful local controls, but each subsystem decides its own fields, identity, destination, and lifetime. The same data can pass through multiple runtimes and providers without a single record of which copies are required or how each copy is deleted.

The approved architecture remains viable: use one policy registry and approved interfaces, with separate runtime adapters where reliability and trust boundaries require them. Retention must be enforced by the destination-specific mechanism named in policy—not by pretending one engine can delete everything.

The highest risks are not “too much analytics.” They are secrets and sensitive content in browser storage/client source, client-trusted security events, raw content duplicated through translation systems, and undefined retention across Firebase and external providers.

## Critical findings

### G-01 — Client-exposed Discord webhook credentials

Affected systems: `LG-015`, `PD-003`.

`src/features/topheroes/stores/useTopHeroesPublicStore.js` contains complete Discord webhook URLs, including tokens, in browser-delivered source. Anyone who can load the bundle can recover and use them. This is a credential exposure and message-injection risk, not a consent issue.

Resolution status (2026-08-04): the owner confirmed the long-inactive notification system's abused webhooks were already revoked. Their URLs were removed from source, notification delivery is intentionally disabled, and the proposed replacement triggers were removed. Restoring notifications now requires a new product/security decision rather than silently adding another webhook.

### G-02 — Security credentials and tokens persisted in local storage

Affected systems: `PD-011`, `PD-012`, `PD-013`, `SC-003`.

The main persisted store includes a Firebase ID token; the translation store includes an OpenAI API key; Discord stores retain identity/session values and a legacy token key; the Firestore Discord user record contains access and refresh tokens. Browser local storage is readable by same-origin script and persists beyond a tab. Token expiry does not remove the stored value.

Local remediation status (2026-08-04): Firebase ID tokens and the translation API key are excluded from persisted Pinia state and legacy copies are scrubbed after hydration. Discord dashboard credentials moved to session storage. The Firestore-held Discord provider tokens and the broader secret/lifecycle policy remain deferred work.

### G-03 — Discord bot session and audit trust boundary is weak or unverifiable

Affected systems: `LG-014`, `PD-013`, `SC-003`.

The browser uses a Discord user ID as a session identifier in several bot-dashboard calls, some calls rely on a frontend environment API key, and audit payloads include client-supplied actor identity and details. The implementation of `bot-api.mxn.au` is not in this repository, so backend authentication, canonical actor derivation, validation, tamper protection, and retention cannot be verified.

Local remediation status (2026-08-04): OAuth now issues an opaque random session token backed by a server-stored hash and 24-hour expiry. A Firebase proxy verifies the session and current Discord guild-management permission, adds the bot API key only server-side, and overwrites audit actor fields from trusted session data. Deployment and live authorization testing remain required; the external audit store and retention remain unverified.

## High findings

### G-04 — No shared registry or approved event interfaces are enforced

Affected systems: all active systems.

The JSON artifact is an inventory draft, not a runtime control. Current features still define their own classification, necessity, consent behaviour, fields, sanitisation, destination, identity, and retention. Separate implementations are acceptable; separate policy decisions are the gap.

Required future decision: approve the registry schema, appoint policy owners, and define versioned interfaces/adapters for browser analytics, browser product events, backend operational logging, and trusted security audit events.

### G-05 — Translation content is duplicated across systems with no coherent lifetime

Affected systems: `LG-005`, `LG-006`, `PD-001`, `PD-012`.

Raw or derived translation content can exist in browser storage, HTTPS payloads, OpenAI, DeepL, Pub/Sub, global cache documents, per-user histories, Discord user/guild/channel histories, error records, and Cloud Logging. Operational metrics, reusable cache content, user history, and diagnostic errors are not separated by a central field/destination policy. No complete deletion schedule was found.

Required future decision: split service payload, user history, reusable cache, aggregate metrics, and diagnostic errors into distinct registry records; minimize raw text in events/logs; document provider handling; assign and implement a retention mechanism per destination.

### G-06 — Everhomes sensitive records span six destinations without an end-to-end retention schedule

Affected systems: `AN-003`, `LG-007`, `LG-008`, `LG-009`, `PD-002`, `PD-010`, `SC-004`.

Property addresses, inspector/recipient identities, checklists, photos, signatures, report files, access keys, filenames/paths, delivery IDs, and failure details can exist in local storage, IndexedDB, Firestore, Storage, Cloud Logging, and email/Resend. Existing cleanup is real but narrow: it bounds upload failures, handles stale deletion/processing, removes selected source/failed-generation files, and expires links. It is not a retention schedule for completed reports and every copy.

Required future decision: define report lifecycle states and a retention class for drafts, source media, completed artifacts, delivery records, operational failures, and security audits; map each to its actual enforcement mechanism; define account/admin deletion and provider-copy handling. Everhomes required analytics remains required and is not an opt-out candidate.

### G-07 — Free text and Wi-Fi credentials are retained without a dedicated policy

Affected systems: `AN-006`, `PD-006`.

8 Ball writes the full user question and answer to Firestore even though aggregate usage could be counted without the text. Both QR implementations persist arbitrary text, Wi-Fi SSIDs, and Wi-Fi passwords in local storage automatically. These fields are materially more sensitive than the surrounding anonymous counters or UI preferences.

Required future decision: determine whether 8 Ball text needs durable storage at all; prohibit secret fields from generic preference persistence; decide whether QR credentials should be memory-only or explicitly saved; assign deletion mechanisms.

### G-08 — Operational logs can contain raw errors, paths, identities, and provider responses

Affected systems: `LG-003`, `LG-004`, `LG-006`, `LG-007`, `LG-016`, `AN-008`.

Backend and frontend code logs are independently authored. Observed classes include stack traces, raw error messages, provider response bodies, tweet IDs/handles, report and storage paths, user identity, recipient/provider detail, and translation errors. Cloud Logging retention is unverified, and browser console output may be retained by attached tools.

Required future decision: create an allowed structured envelope, field sensitivity levels, redaction helpers, severity rules, production console policy, and a verified Cloud Logging retention mechanism. Security records and short-lived diagnostics should not share an undefined lifetime merely because both currently use logs.

### G-09 — Account/data deletion does not cover downstream copies

Affected systems: `LG-001`, `LG-002`, `AN-004`, `AN-005`, `SC-003`, `PD-001`, `PD-002`, `PD-004`, `PD-005`.

No repository-wide process was found that enumerates and deletes a person's data across user subcollections, game histories, translation histories, Discord tokens, Everhomes records/files, local recovery stores, GA4 identity associations where applicable, and external processors. Per-item deletion in individual features is not an account-lifecycle mechanism.

Required future decision: define deletion scope and exceptions, create a destination manifest from the registry, and implement/verify a deletion handler per destination. External providers require account/API/configuration mechanisms, not a promise from the central runtime.

### G-10 — Security audits are incomplete and sometimes mutable/client-authored

Affected systems: `SC-004`, `LG-014`, `LG-016`, `LG-011`.

Rankings report generation and Minecraft mutations have audit-like records. Everhomes privileged resend/regenerate/delete/recovery actions do not have a consistent dedicated actor audit. Discord admin audits are client-authored and externally stored. No common canonical actor, action vocabulary, outcome, reason, correlation ID, tamper/access control, or retention rule exists.

Required future decision: define a trusted security-audit interface whose actor and request context are derived server-side, then implement adapters in each trusted backend. Do not route security audits through an optional browser analytics switch.

## Medium findings

### G-11 — Current necessity and consent behaviour is inconsistent

Affected systems: `AN-001`, `AN-004` through `AN-008`, `LG-002`, `LG-004`, `LG-005`.

Only the branch-local GA work has a clear optional, prior-choice preference. Many analytics-like counters and authenticated tracking records are always on because the feature wrote them that way, not because a central decision classified them as required. Required Cloudflare and Everhomes systems are correctly intended to remain outside that optional preference, but this distinction is not yet expressed in an enforceable shared registry.

Required future decision: approve necessity per event, not per vendor or feature; keep one simple user-facing choice for optional analytics; ensure required events have a specific operational/security/product rationale.

### G-12 — Provider and infrastructure retention is mostly unknown

Affected systems: `AN-002`, `LG-003`, `LG-009`, `LG-010`, `LG-012`, `LG-014`, `LG-015`, `TM-002`, `SC-001`, `SC-002`, `EX-001`.

GA4 is the exception: its 14-month setting was verified. Cloudflare, Firebase/GCP logs and audit datasets, Resend/email, Discord, X, OpenAI, DeepL, Bungie, bot API, contact Worker, Minecraft host, fonts/CDNs/embeds, and other providers are not fully described by repository source.

Required future decision: perform a provider/configuration inventory and record the exact account/project setting, deletion API/job, contractual retention, or “provider-managed with no MXN enforcement” result for each destination.

### G-13 — Publicly mutable counters are not reliable analytics

Affected systems: `AN-006`, `AN-007`.

Firestore rules permit public writes/increments for several counters and engagement fields. Local vote/share keys provide UX friction, not trustworthy identity or fraud control. These metrics can describe product activity but cannot be treated as authoritative user or conversion analytics.

Required future decision: label them as untrusted engagement counters, or move authoritative counting to a rate-limited trusted service with abuse controls. Do not silently merge them into GA4 or business reporting as equivalent-quality events.

### G-14 — Minecraft log/activity retention and deployment ownership are unclear

Affected systems: `LG-011`, `LG-012`, `PD-007`.

The separate backend appends activity to JSONL without rotation, exposes Minecraft log reads/streams/exports, and the browser caches logs/activity/snapshots. The backend source is explicitly stored under `not-in-project`, so this repository cannot prove deployed parity or host-level rotation.

Required future decision: identify the authoritative repository/runtime, register the contract version, define host log rotation and activity retention, minimize browser caching, and separately govern IP/player/chat/command fields.

### G-15 — External browser requests are not centrally inventoried at build time

Affected system: `EX-001`.

Pages load Google Fonts, jsDelivr assets, Discord widgets/CDN content, GitHub API data, image CDNs, and video embeds. Those requests disclose network/request metadata to third parties when a component renders. The list can drift as components add URLs.

Required future decision: maintain an approved external-destination allowlist and add a build-time scan/check. Decide when resources should be self-hosted or proxied. Provider retention remains separately documented.

### G-16 — GA4 application hardening and production state differ

Affected system: `AN-001`.

The branch contains production-host gating, URL sanitisation, a strict event allowlist, manual SPA page views, denied advertising consent states, and a one-time prior-choice preference. Those application changes are not deployed. Production therefore must not be described as having those runtime protections until deployment and live verification. The verified GA4 property changes are separate from the local code state.

Required future decision: after the inventory and policy are approved, reconcile the local adapter with the final registry before any deployment. Then verify both consent states and sanitized events live.

### G-17 — Destiny capture exists in a split/uncertain deployment state

Affected system: `PD-005`.

The frontend routes and Firestore access exist, but the related Functions exports are commented out. OAuth and cleanup source remains in the repository. This makes current capture, provider calls, token storage, and retention impossible to determine from this repository alone.

Required future decision: identify whether another backend deployment serves the feature, or mark it inactive and remove stale data paths after a separate approved review.

### G-18 — Mock TopHeroes analytics can be mistaken for real measurement

Affected system: `AN-009`.

The admin analytics interface uses mock/static values. This is a provenance/data-quality risk: a visible analytics UI can be interpreted as reporting real captured data.

Required future decision: label it unmistakably as mock/demo or connect it only after its event definitions and source-quality rules are approved.

## Lower but material gaps

### G-19 — Browser storage has no inventory-backed lifecycle

Affected systems: `PD-006` through `PD-013`.

Most local/session/IndexedDB stores are retained until user clearing, selective logout, or an ad hoc feature reset. The site has no central inventory-backed “clear my local data” behaviour, per-key lifetime, migration/deletion contract, or separation of preference, product content, operational cache, and secret classes.

### G-20 — Performance telemetry is local today but unregistered for future transmission

Affected system: `TM-001`.

The PerformanceMonitor observes FPS, heap, paints, and measures only in component memory. This is low risk now. The gap is that a later “send metrics” change could bypass policy unless the local observer is already represented and transmission requires a registered adapter.

### G-21 — Realtime Database is denied but not formally retired

Affected system: `PD-015`.

Rules deny all reads and writes, and no active capture was found. Keeping it in the registry prevents accidental future use without a policy decision. A separate infrastructure decision can later disable/remove it if genuinely unused.

## Proposed governance sequence for later approval

This is sequencing, not authorization to implement.

1. Freeze the vocabulary: approve classifications, necessity values, identity levels, retention classes, and destination identifiers.
2. Resolve the critical secrets/trust-boundary findings before building broad analytics plumbing.
3. Review each `needs_decision` entry and split mixed records where service data, optional analytics, diagnostics, and security audits are currently combined.
4. Define four approved interfaces: browser analytics, backend operational log, runtime telemetry, and trusted security audit. Allow separate adapters/runtimes.
5. Define product-data capture interfaces separately where full content storage is the service itself.
6. Verify provider and infrastructure settings; attach an actual enforcement owner/mechanism to every retention class.
7. Add automated registry checks for event names, fields, identity level, destinations, external hosts, and unregistered browser storage keys.
8. Migrate one bounded system at a time, beginning with GA4 only after reconciling the existing branch work with the approved registry.
9. Verify collection, consent behaviour, security audit integrity, and deletion/retention independently. A successful event write does not prove deletion, and a configured retention class does not prove provider enforcement.

## Minimum acceptance criteria for the future engine

- A feature cannot emit an undeclared analytics, log, telemetry, or security event.
- The registry—not the feature—determines necessity, consent behaviour, fields, sanitisation, destination, identity level, and retention class.
- Required systems never silently depend on the optional GA4 preference.
- Optional analytics has one clear, remembered Accept/Decline choice and no advertising use.
- Security/audit events originate from a trusted backend and derive actor identity server-side.
- Sensitive free text, credentials, tokens, access keys, addresses, filenames/paths, and raw errors are denied by default in event/log interfaces.
- Every destination names its actual retention mechanism and owner; `unknown` blocks a claim of enforcement.
- Provider-native records and external runtimes remain represented even when the application cannot control them.
- Local storage and IndexedDB keys are registered data destinations, not invisible implementation details.
- Production/deployment state is recorded separately from source-code intent.

## Explicitly not done

- The local remediation has not been deployed.
- No Firebase, Google Cloud, GA4, Cloudflare, Discord, Resend, OpenAI, DeepL, X, Bungie, Worker, bot API, or Minecraft console setting was changed.
- No new TopHeroes webhook credentials or replacement notification system were created. The owner confirmed the historically exposed webhooks were already revoked.
- No records were read from or deleted in production data stores.
- No retention duration was invented where a real configured mechanism could not be verified.
- Deferred governance, deletion, encryption, retention, and integration work was not pulled into these two stages.
