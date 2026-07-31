#### Description

The `create` command creates a new Google Form. At creation time the Forms API accepts only the form title, so `create` sends a request body of `{"info": {"title": "<title>"}}`. The response is the full form resource, including the generated `formId` and `responderUri` you share with respondents.

To add questions, sections, or other structure after the form exists, use `aux4 google forms batch-update` with the returned `formId`.

This command requires a writable scope (`https://www.googleapis.com/auth/forms.body`). A read-only login cannot create forms.

#### Usage

```bash
aux4 google forms create --title <title> [--tokenFile <path>]
```

--title      Title of the new form (required)
--tokenFile  Where the shared Google OAuth token is stored (default: `~/.aux4.config/.oauth/google.json`, env `AUX4_GOOGLE_TOKEN_FILE`)

#### Example

```bash
aux4 google forms create --title "Customer Survey"
```

```text
{
  "formId": "1FAIpQLScUn...",
  "info": {
    "title": "Customer Survey",
    "documentTitle": "Customer Survey"
  },
  "revisionId": "00000001",
  "responderUri": "https://docs.google.com/forms/d/e/.../viewform"
}
```

Capture the new form ID for follow-up commands:

```bash
FORM_ID=$(aux4 google forms create --title "Customer Survey" | aux4 json get --path '$.formId')
```
