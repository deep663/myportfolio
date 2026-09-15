/**
 * Renders the popup page Decap's documented external-OAuth-provider
 * contract expects: it `postMessage`s a result string of the form
 * `authorization:github:success:<json>` (or `:error:<message>`) back to
 * `window.opener`, then closes itself. Never embeds `clientSecret` — only
 * ever receives a bearer `token` already exchanged server-side by
 * `lib/github-oauth.ts`. Split into its own component from
 * `lib/github-oauth.ts` to keep both under the 100-line ceiling once the
 * SEC-001/SEC-005 fixes below were added.
 *
 * SEC-001 fix (audit-20260915-feature-04-cms.md, CWE-79): `payload.message`
 * on the error path is attacker-controlled (the `error` query param is
 * reflected here via `app/api/callback/route.ts`). `JSON.stringify` alone
 * does not escape the `</` sequence, so an HTML parser would still treat
 * a value like `</script><script>...` as closing this element early —
 * `escapeScriptBreakout` neutralizes that sequence before interpolation.
 *
 * SEC-005 fix: the popup only ever posts to `targetOrigin` (the app's own
 * configured origin — see `lib/site-origin.ts`), never a wildcard `"*"`.
 */
type PostMessagePayload =
  | { status: "success"; token: string }
  | { status: "error"; message: string };

function escapeScriptBreakout(json: string): string {
  return json.replace(/</g, "\\u003c");
}

export function buildPostMessageHtml(
  payload: PostMessagePayload,
  targetOrigin: string,
): string {
  const message =
    payload.status === "success"
      ? `authorization:github:success:${JSON.stringify({ token: payload.token, provider: "github" })}`
      : `authorization:github:error:${JSON.stringify({ message: payload.message })}`;
  const safeMessage = escapeScriptBreakout(JSON.stringify(message));
  const safeTargetOrigin = escapeScriptBreakout(JSON.stringify(targetOrigin));
  return `<!doctype html><html><body><script>
    (function() {
      function receive() {
        window.opener.postMessage(${safeMessage}, ${safeTargetOrigin});
      }
      if (window.opener) { receive(); }
      window.close();
    })();
  </script></body></html>`;
}
