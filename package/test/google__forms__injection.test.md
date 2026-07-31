# google forms command injection

Part of the `core` group in `test.suite.md`. This is a security regression test.
The `--title` argument flows into a `jq` shell step that builds the form info
object. Before remediation the title was interpolated raw into a shell
env-assignment (`TITLE='${title}' jq ...`), so a quote in the title could break
out and run arbitrary commands. After remediation the title is passed through
`value(title)`, which shell-escapes it, so the payload is inert.

## with a quote-bearing title

```beforeAll
rm -f /tmp/AUX4_INJ_forms
```

```afterAll
rm -f /tmp/AUX4_INJ_forms
```

```file:google-token.json
{
  "clientId": "test-client",
  "clientSecret": "test-secret",
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth",
  "tokenUrl": "https://oauth2.googleapis.com/token",
  "scopes": "https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.responses.readonly",
  "accessToken": "test-access-token",
  "refreshToken": "test-refresh-token",
  "expiresAt": "2099-12-31T23:59:59Z"
}
```

### should not execute an injected command from the title

```execute
aux4 google forms create --title "x'; touch /tmp/AUX4_INJ_forms; echo '" --apiUrl http://127.0.0.1:1 --tokenFile google-token.json </dev/null || true
```

### should leave no marker file behind

```execute
test -f /tmp/AUX4_INJ_forms && echo VULNERABLE || echo SAFE
```

```expect
SAFE
```
