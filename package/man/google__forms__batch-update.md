#### Description

The `batch-update` command applies a batch of write requests to an existing form using the Forms API `forms.batchUpdate` method. This is how you add questions, insert page breaks, update the title and description, move items, or delete items after a form has been created.

The `--requests` flag takes a raw JSON array of request objects, exactly as documented in the [Google Forms batchUpdate reference](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate). The command wraps that array in `{"requests": [...]}` and POSTs it to `/forms/<formId>:batchUpdate`. All requests in the array are applied atomically — if any request fails, none are applied.

This command requires a writable scope (`https://www.googleapis.com/auth/forms.body`). A read-only login cannot update forms.

#### Usage

```bash
aux4 google forms batch-update <formId> --requests <json> [--tokenFile <path>]
```

formId       Google Form ID (required, positional)
--requests   Update requests as a JSON array (required)
--tokenFile  Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

Rename a form:

```bash
aux4 google forms batch-update 1FAIpQLScUn... --requests '[{"updateFormInfo":{"info":{"title":"Q3 Customer Survey"},"updateMask":"title"}}]'
```

Add a multiple-choice question at the top of the form:

```bash
aux4 google forms batch-update 1FAIpQLScUn... --requests '[
  {
    "createItem": {
      "item": {
        "title": "How did you hear about us?",
        "questionItem": {
          "question": {
            "choiceQuestion": {
              "type": "RADIO",
              "options": [{ "value": "Search" }, { "value": "Friend" }, { "value": "Ad" }]
            }
          }
        }
      },
      "location": { "index": 0 }
    }
  }
]'
```

```text
{
  "form": {
    "formId": "1FAIpQLScUn...",
    "revisionId": "00000006"
  }
}
```
