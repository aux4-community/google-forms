# google forms responses get

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local echo server (`mock-echo.js`) so the GET request can be asserted without a real form.

## against a local mock API

```beforeAll
nohup node mock-echo.js 19014 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:19014/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should GET the single response resource with a bearer token

```execute
aux4 google forms responses get 1FAIpQLScUn --responseId ACYDBNi123 --tokenFile google-token.json --apiUrl http://127.0.0.1:19014
```

```expect:partial
"method": "GET"
```

```expect:partial
"path": "/forms/1FAIpQLScUn/responses/ACYDBNi123"
```

```expect:partial
"authorization": "Bearer test-access-token"
```

### should send no request body

```execute
aux4 google forms responses get 1FAIpQLScUn --responseId ACYDBNi123 --tokenFile google-token.json --apiUrl http://127.0.0.1:19014 | aux4 json get --path '$.body'
```

```expect
null
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms responses get 1FAIpQLScUn --responseId ACYDBNi123 --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19014
```

```error:partial
no token found for provider "google"
```
