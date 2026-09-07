# Secret inventory and translation recovery

Verified 2026-09-07 against current tracked source, local `.env`, and the existing local build. No secret values are recorded here. Live deployment status is recorded below separately.

## Frontend configuration

Only browser-visible configuration belongs in the root `.env`. Firebase project identifiers/API configuration, API/WebSocket URLs, Discord client ID and redirect URI are public configuration. The Firebase API key still needs appropriate API restrictions; Firebase authorization depends on rules and identity.

`VITE_GITHUB_TOKEN` remains by the owner's request. It is used by `src/shared/utils/githubFetch.js` for public repository/commit feeds. A read-only GitHub `/user` request returned HTTP 200 with an empty `X-OAuth-Scopes` header. Its value occurs in the homepage bundle, so it must never gain additional privileges. The screenshot's token has no expiration date.

## Active secret moves

| Previous local variable | Secret Manager entry in `mxn-au` | Consumer |
| --- | --- | --- |
| `VITE_ENCRYPTION_KEY` | `SERVER_CREDENTIAL_ENCRYPTION_KEY` | `encryptServerCredential` Firebase callable |
| `VITE_OPENAI_API_KEY_TRANSLATION_GENERIC` | New independent `TRANSLATION_OPENAI_API_KEY` | `aiTranslate` backend; old key was revoked |

The encryption key was transferred unchanged and read back to verify exact equality before removing the frontend variable. Existing credential records were not touched. New writes preserve the existing v2 PBKDF2-SHA256/AES-GCM envelope. The callable requires authenticated non-anonymous Firebase identity and accepts at most 32,768 characters. It only encrypts; no general-purpose decryption API exists. Previously published copies of this unchanged key cannot be recalled.

The browser's unused decryption helper was removed. The actual terminal sends Firebase identity and server ID to the SSH backend. The tracked standalone example in `src/shared/not-in-project/backend-server.js` reads its own `ENCRYPTION_KEY` and only demonstrates legacy CryptoJS decryption; its deployed implementation was not verified or changed. Root Vite environment variables do not configure that separate server. Existing legacy encrypted records and that separate server's configuration remain unchanged.

## Preserved unused local values

The following values had no exact variable-name consumer in tracked application source beyond `.env.example`. Each was copied to Secret Manager and read back before removal from the root `.env`. Archive entries preserve recoverability and are not bound to any deployed function. They do not replace similarly named live backend secrets.

| Removed variable | Archive secret | Related backend use / status |
| --- | --- | --- |
| `VITE_RESEND_API_KEY` | `ARCHIVED_FRONTEND_RESEND_API_KEY` | Everhomes report/email functions already bind `RESEND_API_KEY` |
| `VITE_OPENAI_API_KEY` | `ARCHIVED_FRONTEND_OPENAI_API_KEY` | Exact value matches active `OPENAI_API_KEY` used by daily games; journal/AI-suggestion exports are disabled |
| `VITE_OPENAI_API_KEY_TRANSLATION_MASON` | `ARCHIVED_FRONTEND_OPENAI_API_KEY_TRANSLATION_MASON` | No current frontend consumer |
| `VITE_DEEPL_API_KEY` | `ARCHIVED_FRONTEND_DEEPL_API_KEY` | Translation functions already bind separate `DEEPL_API_KEY` |
| `VITE_BUNGIE_API_KEY` | `ARCHIVED_FRONTEND_BUNGIE_API_KEY` | Destiny function modules bind `BUNGIE_API_KEY`, but their index exports are commented out |
| `VITE_GITHUB_FINEGRAINED_ACCESS_TOKEN` | `ARCHIVED_FRONTEND_GITHUB_FINEGRAINED_ACCESS_TOKEN` | No current tracked consumer |
| `VITE_MANUAL_GENERATE_URL` | `ARCHIVED_FRONTEND_MANUAL_GENERATE_URL` | No current tracked consumer; preserve possible embedded authorization |
| `VITE_FUNCTIONS_REBUILD_ACCESS_TOKEN` | `ARCHIVED_FRONTEND_FUNCTIONS_REBUILD_ACCESS_TOKEN` | No current tracked consumer; stats-rebuild export disabled |
| `VITE_DISCORD_CLIENT_SECRET` | `ARCHIVED_FRONTEND_DISCORD_CLIENT_SECRET` | Discord OAuth backend binds separate `DISCORD_CLIENT_SECRET` |
| `VITE_BOT_API_KEY` | `ARCHIVED_FRONTEND_BOT_API_KEY` | Discord configuration/proxy backend binds separate `BOT_API_KEY` |

The revoked generic translation key was additionally retained as `ARCHIVED_FRONTEND_OPENAI_API_KEY_TRANSLATION_GENERIC` for incident evidence and removed from `.env`. It must not be restored for use.

## Translation authorization and limits

Shared OpenAI and DeepL translation require verified, non-anonymous Firebase identity. Platform labels and arbitrary `x-openai-key` headers cannot authorize server-funded calls. User-supplied OpenAI keys remain optional for people using their own provider account. Firebase `Authorization` is kept distinct from `x-openai-key`.

Both translation endpoints validate text (1–6,000 characters) and languages before work. Shared usage reserves a Firestore transaction against per-user and global UTC-day budgets before provider/cache work. Failed requests retain reservations. Defaults are 100 requests/20,000 characters per user per day and 1,000 requests/200,000 characters globally. Retranslation counts separately. Character defaults can be configured with Firebase integer params `TRANSLATION_USER_DAILY_CHARACTERS` and `TRANSLATION_GLOBAL_DAILY_CHARACTERS`. These application limits bound use; provider account limits remain separate.

The browser no longer retries failed authenticated translations anonymously. Provider error bodies and credentials are not returned to callers. Cache updates from retranslation require matching stored text, languages and model.

Discord clients using their own key via `x-openai-key` or the legacy `Authorization: Bearer sk-…` convention can still translate through OpenAI. A legacy provider key never establishes Firebase identity. Server-funded calls must supply Firebase identity; a self-asserted Discord header is not authentication.

## Deployment and validation

Secret transfers and dedicated OpenAI key provisioning are complete. The owner approved the temporary `.codex/translation-key.env` transfer file; the new key was copied to `TRANSLATION_OPENAI_API_KEY`, verified by exact read-back, and that file was deleted. The three backend functions are deployed in `australia-southeast1`. An initial encryption deployment used the default US region; it was replaced with the explicit Sydney deployment, and the US function was deleted before frontend release.

The build now rejects unapproved `VITE_` variables through `scripts/frontend-env-policy.mjs`. Known browser-public identifiers and the owner-approved GitHub token are explicitly allowed. The final local build passed 127 tests plus schema validation. All 458 generated files were compared against 13 active/archive secret values with zero matches.

The regression tests in `tests/translation-secrets.test.mjs` exercise authorization, provider secret use, quota denial, global budget enforcement, encrypt-only authentication/input bounds, and cross-implementation v2 encryption compatibility using test-only secrets.

### Live acceptance and intentional limitation

- Anonymous shared translation, retranslation and credential encryption each return HTTP 401.
- Signed-in credential encryption returns HTTP 200. Its ciphertext was decrypted in a verification process using the unchanged Secret Manager value, proving compatibility without modifying stored credentials.
- Temporary verification users and their per-user budget documents were removed. Global request reservations were retained honestly.
- The new OpenAI key's provider diagnostic returns HTTP 429, `insufficient_quota` / `credit_balance_exhausted`, in Tempest Studios / Default project. The owner explicitly chose to leave OpenAI translation blocked for now. No further provider calls should be made until that decision changes. The backend is configured with the new key but successful OpenAI translation is not claimed.
- The Functions install was restored with `npm ci --prefix functions` without changing its lockfile. Discovery/deployment used Node 22 and `FUNCTIONS_DISCOVERY_TIMEOUT=60`. Non-secret character-limit params are in the ignored `functions/.env.mxn-au` for Firebase deployment.
- Existing anonymous cache-feedback and client-fed usage logging remain separate known integrity/efficiency issues. They cannot bypass the new provider authorization or server-only daily budget counters, but website usage statistics are not authoritative provider billing evidence.

Hosting was published successfully after the backend deployments. `https://mxn.au/translate` returns HTTP 200. The live `useTranslateStore-CpHCGhde.js`, `ServerDashboard-BHtS9fjv.js`, and `MXNHome-XbP1W7zi.js` each match the verified local build byte-for-byte. OpenAI translation remains intentionally blocked by the credit balance, per the owner.

### Project separation, 2026-09-07

A replacement `translation-key` was created in Tempest Studios / Translation (`proj_CoNV7myVjtklQg84NCVhFbBM`) and transferred to `TRANSLATION_OPENAI_API_KEY` version 2 with exact read-back verification. The approved temporary transfer file and private transfer key were deleted. The owner is handling revocation of the preceding Default-project key. The preceding quota diagnostic applies to that old key; no provider request has been made with this replacement.

The translation redeployment completed successfully; live Functions metadata confirms `aiTranslate` is ACTIVE and binds `TRANSLATION_OPENAI_API_KEY` version 2. The owner selected a separate Daily Games key for the five game consumers; provisioning and their cutover are next.

The `daily-games-key` was created in the picker-selected Tempest Studios / MXN.au project (`proj_6fXEcJk0bkkSpwlm1SqkUp9q`). It is stored as `DAILY_GAMES_OPENAI_API_KEY` version 1, with exact read-back verified and the approved temporary file/private transfer key deleted. All three game implementation modules now bind this dedicated secret. The build passed all 127 tests and schema validation. No paid provider test was requested or performed.

All five game functions subsequently deployed successfully. Live metadata confirms each is ACTIVE with `DAILY_GAMES_OPENAI_API_KEY` version 1, while translation retains its own version 2. No listed deployed function still binds the old `OPENAI_API_KEY`. Journal provisioning remains pending; journal and Destiny AI suggestion source still refer to the old secret but neither is exported for deployment.

An in-memory comparison confirmed that `ARCHIVED_FRONTEND_OPENAI_API_KEY` and active `OPENAI_API_KEY` contain the same value. Live Functions inventory shows five active consumers: `wordleGenerateCron`, `connectionsGenerateCron`, `getWordleUnlimitedWords`, `connectionsGenerateNow`, and `wordleGenerateNow`. No journal function is deployed. Source schedules run Wordle daily and check Connections hourly, so key traffic alone does not establish compromise. The Platform label `mxn-au-journal` has not yet been independently matched to this shared value. The owner selected a dedicated key for daily games, followed by a separate journal credential.
