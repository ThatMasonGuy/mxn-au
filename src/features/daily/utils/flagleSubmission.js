export function prepareFlagleSubmission({ input, canSubmit, submitting }) {
  if (!canSubmit || submitting) return null;

  const guess = String(input ?? "").trim();
  if (!guess) return null;

  return {
    guess,
    nextInput: "",
    nextSubmitting: true,
  };
}
