# google forms create

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local `aux4/mock` server: the test stubs a realistic created-form response and then
verifies the request aux4 built — method, path, `Authorization` header and JSON body —
without creating a real form.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 19010 2>/dev/null
pkill -f "19010" 2>/dev/null
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

### should POST to the forms endpoint and return the created form

```execute
aux4 mock start --port 19010 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 19010 --method POST --path /forms --status 200 --body '{"formId":"1FAIpQLScUn","info":{"title":"Customer Survey","documentTitle":"Customer Survey"},"revisionId":"00000001","responderUri":"https://docs.google.com/forms/d/e/1FAIpQLScUn/viewform","items":[]}' >/dev/null
aux4 google forms create --title "Customer Survey" --tokenFile google-token.json --apiUrl http://127.0.0.1:19010/api
```

```expect:partial
"responderUri":"https://docs.google.com/forms/d/e/1FAIpQLScUn/viewform"
```

### should send a bearer token and JSON content type

```execute
aux4 mock verify --port 19010 --method POST --path /forms --header "authorization=Bearer test-access-token" --header "content-type=application/json"
```

```expect:partial
verify ok
```

### should build the nested info object from the title

```execute
aux4 mock verify --port 19010 --method POST --path /forms --body-contains '"info":{"title":"Customer Survey"}'
```

```expect:partial
verify ok
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms create --title "Customer Survey" --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19010/api
```

```error:partial
no token found for provider "google"
```
