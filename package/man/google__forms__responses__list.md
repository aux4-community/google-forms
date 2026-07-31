#### Description

The `responses list` command retrieves every response submitted to a form. Each response includes a `responseId`, submission timestamps (`createTime`, `lastSubmittedTime`), and an `answers` map keyed by `questionId`. Match those `questionId` values against the form definition from `aux4 google forms get` to know which question each answer belongs to.

The response may be paginated for forms with many submissions; the API returns a `nextPageToken` when more responses are available.

This command uses the read-only scope `https://www.googleapis.com/auth/forms.responses.readonly`.

#### Usage

```bash
aux4 google forms responses list <formId> [--tokenFile <path>]
```

formId       Google Form ID (required, positional)
--tokenFile  Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google forms responses list 1FAIpQLScUn...
```

```text
{
  "responses": [
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
  ]
}
```

Count the submissions:

```bash
aux4 google forms responses list 1FAIpQLScUn... | aux4 json get --path '$.responses' | jq 'length'
```
