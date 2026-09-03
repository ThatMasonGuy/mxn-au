# Connections generation

The generator and independent editor both use `gpt-5.6-terra` with medium reasoning through the OpenAI Responses API with strict JSON schemas. The generator receives the complete recent/future word exclusion list and the last rejected draft with actionable editor feedback. A puzzle is published only after structural validation and independent editorial approval. Red herrings can form misleading partial groups; ambiguity means more than one complete four-group solution, not an individual word fitting two categories.

## Recovery and limits

- `connectionsGenerateCron` runs at five minutes past every UTC hour. It considers today and the next seven days, filling the earliest missing or invalid future board first.
- Each invocation generates at most one date, with at most four draft attempts and a 450-second generation deadline inside a 540-second function timeout.
- Scheduled and manual generation share a Firestore lease and a limit of ten generation jobs per UTC day. Existing valid boards do not consume generation jobs or model calls.
- Today's existing board is preserved, including a fallback, because anonymous players may already have progress. Missing boards can be generated today; a transaction prevents publication from replacing a fallback served during generation.
- Future fallback or invalid boards are eligible for repair. Publication replaces fallback metadata rather than merging it into an AI board.
- Loading and seeding a board is transactional, so players receive the same canonical board when generation and the first load happen together.

## Manual recovery

Call `connectionsGenerateNow` in `australia-southeast2` with the existing `x-admin-key` secret and a `date=YYYY-MM-DD` query parameter. Dates must be today through fourteen days ahead. Optional `overwrite=true` permits replacement of a future valid puzzle; it never replaces today's board. Keep credentials in memory and out of URLs, logs and source control.

The endpoint returns HTTP 200 for a saved or intentionally skipped board, 409 when another generator owns the lease, and a non-success response when generation fails. Verify the stored document's `source`, `model`, `reviewModel`, `qualityReviewed`, and date; a successful deployment alone does not prove the buffer is filled.

Model reference: [GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra).
