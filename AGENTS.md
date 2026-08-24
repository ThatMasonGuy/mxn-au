# Repository instructions

## Tests

- Tests must exercise observable behavior through an exported or public boundary.
- Do not add source-text or regular-expression assertions for function names, comments, exact source layout, implementation literals, or the absence of previously removed code.
- A regression test for removed behavior is justified only when the removal is itself a security, compliance, or explicit product boundary; exercise that boundary behavior instead of scanning source text.
- Prefer focused pure-function tests, then component or integration tests, and use Firebase emulators for rules or service-boundary behavior when that coverage is needed.
- Do not duplicate invariants already enforced by an existing build-time validator.
- Every new test must protect a plausible failure: the author should be able to describe a realistic implementation mutation that makes the test fail.
- Keep tests deterministic and avoid network calls, production services, wall-clock sleeps, and oversized snapshots.

Run `npm run build` before handing off application changes; the build runs the unit tests and schema validation before bundling.
