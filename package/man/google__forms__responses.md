#### Description

The `google forms responses` command group reads the answers respondents have submitted to a form. It uses the read-only scope `https://www.googleapis.com/auth/forms.responses.readonly`, so it works with either a full or a read-only login.

Available subcommands:

- **list** — List all responses submitted to a form
- **get** — Retrieve a single response by its ID

#### Usage

```bash
aux4 google forms responses <subcommand>
```

#### Example

```bash
aux4 google forms responses list 1FAIpQLScUn...
aux4 google forms responses get 1FAIpQLScUn... --responseId ACYDBNi...
```
