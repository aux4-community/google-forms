#### Description

The `google forms` command group provides access to the [Google Forms API v1](https://developers.google.com/forms/api). Every request is signed with the shared Google OAuth2 token that `community/google-auth` maintains, so there is nothing to configure beyond a single login.

Available subcommands:

- **create** — Create a new Google Form with a title
- **get** — Retrieve a form definition by its ID
- **batch-update** — Apply a batch of update requests to a form (add questions, rename, etc.)
- **responses** — List and read the responses submitted to a form

#### Prerequisites

Authenticate once before first use. Scopes are resolved from the installed Google service packages, so no `--scopes` flag is required:

```bash
aux4 google auth login
```

This package requests `https://www.googleapis.com/auth/forms.body` and `https://www.googleapis.com/auth/forms.responses.readonly`, which is enough for every command it exposes. Use `aux4 google auth login --readonly true` to request the read-only variant (`forms.body.readonly`), which allows `get` and `responses` but not `create` or `batch-update`.

The token is read from `~/.aux4.config/.oauth/google.json`. Override it per command with `--tokenFile`, or for the whole shell with the `AUX4_GOOGLE_TOKEN_FILE` environment variable.

#### Usage

```bash
aux4 google forms <subcommand>
```

#### Example

```bash
aux4 google forms create --title "Customer Survey"
aux4 google forms get 1FAIpQLScUn...
aux4 google forms responses list 1FAIpQLScUn...
```
