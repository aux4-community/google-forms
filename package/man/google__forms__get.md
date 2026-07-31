#### Description

The `get` command retrieves the full definition of a Google Form by its ID. The response includes the form `info` (title and document title), the ordered list of `items` (questions, page breaks, images, videos), the current `revisionId`, and the `responderUri`.

Use this to inspect a form's structure — for example to find the `itemId` and `questionId` values needed when reading responses or building `batch-update` requests.

The form ID is the long identifier in the form's edit URL: `https://docs.google.com/forms/d/<FORM_ID>/edit`.

#### Usage

```bash
aux4 google forms get <formId> [--tokenFile <path>]
```

formId       Google Form ID (required, positional)
--tokenFile  Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google forms get 1FAIpQLScUn...
```

```text
{
  "formId": "1FAIpQLScUn...",
  "info": {
    "title": "Customer Survey",
    "documentTitle": "Customer Survey"
  },
  "revisionId": "00000005",
  "responderUri": "https://docs.google.com/forms/d/e/.../viewform",
  "items": [
    {
      "itemId": "1a2b3c4d",
      "title": "How satisfied are you?",
      "questionItem": {
        "question": {
          "questionId": "5e6f7g8h",
          "required": true,
          "choiceQuestion": {
            "type": "RADIO",
            "options": [{ "value": "Very" }, { "value": "Somewhat" }, { "value": "Not at all" }]
          }
        }
      }
    }
  ]
}
```
