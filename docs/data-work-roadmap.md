# MXN analytics, security, and data roadmap

Last updated: 2026-08-04

This file is the continuation checkpoint for the work discovered during the analytics review. Detailed evidence remains in:

- `docs/data-capture-inventory.md`
- `docs/data-policy-registry-draft.json`
- `docs/data-governance-gap-risk-report.md`
- `docs/analytics-audit-checkpoint-2026-07-31.md`

## Fixed principles

- MXN does not sell user data and does not run advertising.
- Central governance means shared policy decisions and approved interfaces. It does not require one physical runtime pipeline.
- Retention is assigned by policy but enforced by the real destination-specific mechanism.
- Cloudflare analytics is required and is not controlled by the site's Google Analytics preference.
- Everhomes tool analytics is required and is not controlled by the site's Google Analytics preference.
- Required operational logging and security records remain separate from optional Google Analytics.
- The user experience uses one short, one-time analytics choice and a persistent settings page, not repeated prompts.

## Stage 1 — Analytics MVP

Goal: make GA4 useful across the whole site so MXN and future Codex analysis can combine GA4 usage data with Google Search Console and Bing Webmaster data.

Implemented locally:

- Every completed Vue navigation emits one sanitized `page_view` using its stable route pattern.
- Query strings, fragments, access keys, document IDs, report IDs, server IDs, and other dynamic route values are excluded.
- The event vocabulary is limited to `page_view`, `login`, and `sign_up`.
- Names, email, free text, precise location, raw errors, access keys, and stable application user IDs are denied.
- GA4 loads only on approved production hosts after one explicit Accept choice.
- Accept and Decline are equally available once, and the choice remains changeable at `/analytics`.
- Cloudflare, Everhomes, operational logging, and security capture are not affected by the GA preference.
- The disclosure records no ads, no data sales, no Google Signals, no user-provided advertising data, and GA4's verified 14-month retention setting.

Local verification complete: 28 tests, production build, first-visit choice, persistence for both choices, withdrawal, and no GA script load on localhost. Production deployment and GA4 Realtime verification have not happened.

Legal posture: this is a conservative technical baseline, not a guarantee or legal advice. Because the public site receives international traffic, GA4 uses prior choice rather than the earlier default-on draft. Any later regional/default-on behaviour requires a separately recorded policy and legal decision.

## Stage 2 — Immediate security containment

Goal: contain only the concrete high-impact exposures demonstrated by the inventory.

Implemented locally:

- Firebase ID tokens and the OpenAI API key are excluded from persisted Pinia state; hydration also scrubs legacy copies.
- Discord dashboard state uses session storage and an opaque random 24-hour token whose hash is stored server-side.
- Privileged bot API requests pass through a Firebase Function that verifies the session and current Discord guild-management permission before adding the server-held API key.
- Discord audit actor identity is overwritten from the trusted server session rather than accepted from the browser.
- The long-inactive TopHeroes Discord notification path is intentionally retired. The abused webhooks were already revoked by the owner, their URLs are removed from source, and no replacement trigger or secret will be created.
- The obsolete browser bot API key variable has been removed from `.env.example`.

Deployment verification:

1. Deploy the Functions and Hosting changes together.
2. Verify OAuth, server listing, configuration reads/writes, audit attribution, and expected re-login of old Discord sessions.
3. Confirm TopHeroes comments/reports still write to Firestore while sending no Discord notification.

The revoked TopHeroes webhook system is not a deployment gate. Its disabled state is intentional.

## Stage 3 — Governance foundation (deferred)

- Approve the shared registry schema and owners.
- Define versioned analytics, logging, telemetry, security-audit, and product-data interfaces.
- Add checks for undeclared events, fields, destinations, external hosts, and browser-storage keys.

## Stage 4 — Retention and deletion (deferred)

- Assign final retention classes.
- Verify/configure GA4, Firebase/GCP, Firestore TTL/jobs, Storage deletion, provider settings, infrastructure rotation, and browser cleanup separately.
- Build account/data deletion orchestration across actual destinations.

## Stage 5 — Sensitive-data architecture and integrations (deferred)

- Define threat models before choosing encryption.
- Add client-side encryption only where it protects against an identified threat without making the service unusable or unrecoverable.
- Establish provider/integration ownership, secret rotation, contracts, and configuration reviews.

## Scope-control rule

A newly discovered issue is recorded in the inventory and risk report. It does not automatically expand the active stage unless it directly blocks lawful analytics collection or is an immediately exploitable credential/trust-boundary problem already included in Stage 2.

## Current status

- Inventory and risk documentation: complete for the repository snapshot.
- Stage 1: locally implemented and verified; deployment/GA4 verification pending.
- Stage 2: locally implemented and verified; deployment and live verification pending. TopHeroes Discord notifications are intentionally retired, not pending replacement.
- Stages 3–5: explicitly deferred.
