#### Description

The `responses get` command retrieves a single form response by its ID. The `responseId` comes from the output of `aux4 google forms responses list`. The returned resource has the same shape as an entry in the list — a `responseId`, submission timestamps, and an `answers` map keyed by `questionId`.

Use this when you already have a specific `responseId` (for example from a webhook or an earlier listing) and want just that one submission.

This command uses the read-only scope `https://www.googleapis.com/auth/forms.responses.readonly`.

#### Usage

```bash
aux4 google forms responses get <formId> --responseId <responseId> [--tokenFile <path>]
```

formId        Google Form ID (required, positional)
--responseId  The response ID to retrieve (required)
--tokenFile   Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google forms responses get 1FAIpQLScUn... --responseId ACYDBNi...
```

```text
{
  "responseId": "ACYDBNi...",
  "createTime": "2026-07-28T14:03:11.000Z",
  "lastSubmittedTime": "2026-07-28T14:05:42.000Z",
  "answers": {
    "5e6f7g8h": {
      "questionId": "5e6f7g8h",
      "textAnswers": { "answers": [{ "value": "Very" }] }
    }
  }
}
```
