# google forms get

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local `aux4/mock` server: the test stubs a realistic form resource and verifies the
GET request aux4 built without touching a real form.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 19011 2>/dev/null
pkill -f "19011" 2>/dev/null
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

### should GET the form resource and return it

```execute
aux4 mock start --port 19011 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 19011 --method GET --path '/forms/{id}' --status 200 --body '{"formId":"1FAIpQLScUn","info":{"title":"Customer Survey"},"revisionId":"00000001","responderUri":"https://docs.google.com/forms/d/e/1FAIpQLScUn/viewform","items":[{"itemId":"7a1b","title":"How satisfied are you?","questionItem":{"question":{"questionId":"11aa","scaleQuestion":{"low":1,"high":5}}}}]}' >/dev/null
aux4 google forms get 1FAIpQLScUn --tokenFile google-token.json --apiUrl http://127.0.0.1:19011/api
```

```expect:partial
"title":"How satisfied are you?"
```

### should GET the form path with a bearer token

```execute
aux4 mock verify --port 19011 --method GET --path /forms/1FAIpQLScUn --header "authorization=Bearer test-access-token"
```

```expect:partial
verify ok
```

### should send no request body

```execute
aux4 mock requests --port 19011 --method GET --path /forms/1FAIpQLScUn | aux4 json get --path '$.0.body'
```

```expect
""
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms get 1FAIpQLScUn --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19011/api
```

```error:partial
no token found for provider "google"
```
