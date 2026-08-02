# google forms responses get

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local `aux4/mock` server: the test stubs a realistic single-response resource and
verifies the GET request aux4 built without touching a real form.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 19014 2>/dev/null
pkill -f "19014" 2>/dev/null
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

### should GET the single response resource and return it

```execute
aux4 mock start --port 19014 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 19014 --method GET --path '/forms/{id}/responses/{responseId}' --status 200 --body '{"responseId":"ACYDBNi123","createTime":"2026-01-15T10:00:00Z","lastSubmittedTime":"2026-01-15T10:05:00Z","answers":{"11aa":{"questionId":"11aa","textAnswers":{"answers":[{"value":"5"}]}}}}' >/dev/null
aux4 google forms responses get 1FAIpQLScUn --responseId ACYDBNi123 --tokenFile google-token.json --apiUrl http://127.0.0.1:19014/api
```

```expect:partial
"responseId":"ACYDBNi123"
```

### should GET the single response path with a bearer token

```execute
aux4 mock verify --port 19014 --method GET --path /forms/1FAIpQLScUn/responses/ACYDBNi123 --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should send no request body

```execute
aux4 mock requests --port 19014 --method GET --path /forms/1FAIpQLScUn/responses/ACYDBNi123 | aux4 json get --path '$.0.body'
```

```expect
""
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms responses get 1FAIpQLScUn --responseId ACYDBNi123 --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19014/api
```

```error:partial
no token found for provider "google"
```
