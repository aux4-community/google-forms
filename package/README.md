# community/google-forms

Commands to interact with Google Forms using the Google Forms API v1

This package provides aux4 command wrappers for the [Google Forms API v1](https://developers.google.com/forms/api). It covers creating forms, reading a form's definition, applying batch updates (adding questions, renaming, restructuring), and reading the responses respondents submit.

Authentication is handled by [community/google-auth](https://hub.aux4.io/package/community/google-auth), which stores a single OAuth2 token shared by every aux4 Google package.

## Installation

```bash
aux4 aux4 pkger install community/google-forms
```

## System Dependencies

This package requires:

- **jq** — for building the form info object from `--title`
  - [brew](https://brew.sh): `brew install jq`
  - linux: `apt install jq`

## Prerequisites

Authenticate once with `community/google-auth`. The scopes are resolved from the installed Google service packages, so no `--scopes` flag is needed:

```bash
aux4 google auth login
```

This package requests two scopes:

- `https://www.googleapis.com/auth/forms.body` — create and update forms
- `https://www.googleapis.com/auth/forms.responses.readonly` — read responses

A read-only login (`aux4 google auth login --readonly true`) requests `forms.body.readonly` instead of `forms.body`, which allows `get` and `responses` but not `create` or `batch-update`.

Check the current state at any time:

```bash
aux4 google auth status
```

## Quick Start

Create a form:

```bash
aux4 google forms create --title "Customer Survey"
```

Read a form's definition:

```bash
aux4 google forms get 1FAIpQLScUn...
```

List the responses to a form:

```bash
aux4 google forms responses list 1FAIpQLScUn...
```

## create — make a new form

At creation time the Forms API accepts only the title. Create the form, then use `batch-update` to add questions and structure:

```bash
aux4 google forms create --title "Customer Survey"
```

The response includes the generated `formId` and the `responderUri` you share with respondents. Capture the ID for follow-up commands:

```bash
FORM_ID=$(aux4 google forms create --title "Customer Survey" | aux4 json get --path '$.formId')
```

## get — read a form definition

Retrieve the full form: its `info`, ordered `items` (questions, page breaks, media), `revisionId`, and `responderUri`:

```bash
aux4 google forms get 1FAIpQLScUn...
```

Use this to discover the `itemId` and `questionId` values you need for `batch-update` requests and for interpreting responses.

## batch-update — add questions and edit a form

Apply a batch of write requests to a form. The `--requests` flag takes a raw JSON array of request objects, exactly as documented in the [batchUpdate reference](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate). All requests are applied atomically.

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

Common request types: `updateFormInfo`, `createItem`, `updateItem`, `deleteItem`, `moveItem`, `updateSettings`.

## responses — read submissions

List every response submitted to a form:

```bash
aux4 google forms responses list 1FAIpQLScUn...
```

Retrieve a single response by its ID:

```bash
aux4 google forms responses get 1FAIpQLScUn... --responseId ACYDBNi...
```

Each response has a `responseId`, submission timestamps, and an `answers` map keyed by `questionId`. Match those `questionId` values against the form definition from `get` to know which question each answer belongs to.

## Finding your Form ID

The form ID is the long identifier in the form's edit URL:

```text
https://docs.google.com/forms/d/<FORM_ID>/edit
```

You can also get it from the output of `aux4 google forms create` or from any `aux4 google forms get` response (`formId` field).

## Environment Variables

- `AUX4_GOOGLE_TOKEN_FILE` — where the shared Google OAuth token lives. Defaults to `~/.aux4.config/.oauth/google.json`, the same location `aux4 google auth login` writes to, so it normally needs no setting.

For the optional `integration` test group, set `FORM_ID` to a Google Form the authenticated account can read.

## License

MIT — See [LICENSE](./LICENSE) for details.
