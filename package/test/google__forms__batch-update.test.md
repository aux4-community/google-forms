# google forms batch-update

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local `aux4/mock` server: the test stubs a realistic batchUpdate reply and verifies
the request aux4 built — method, the `:batchUpdate` path, `Authorization` header and
the `requests`-wrapped JSON body — without touching a real form.

## against a local mock API

```beforeAll
aux4 aux4 pkger install aux4/mock
```

```afterAll
aux4 mock stop --port 19012 2>/dev/null
pkill -f "19012" 2>/dev/null
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

### should POST to the batchUpdate endpoint and return the reply

```execute
aux4 mock start --port 19012 >/dev/null 2>&1
sleep 1
aux4 mock stub --port 19012 --method POST --path '/forms/{id}:batchUpdate' --status 200 --body '{"form":{"formId":"1FAIpQLScUn","info":{"title":"Renamed"},"revisionId":"00000002"},"replies":[{}]}' >/dev/null
aux4 google forms batch-update 1FAIpQLScUn --requests '[{"updateFormInfo":{"info":{"title":"Renamed"},"updateMask":"title"}}]' --tokenFile google-token.json --apiUrl http://127.0.0.1:19012/api
```

```expect:partial
"revisionId":"00000002"
```

### should target the colon batchUpdate path with a bearer token

```execute
aux4 mock verify --port 19012 --method POST --path /forms/1FAIpQLScUn:batchUpdate --header "authorization=Bearer test-access-token" --header "content-type=application/json"
```

```expect:partial
verify ok
```

### should wrap the requests array in a requests key

```execute
aux4 mock verify --port 19012 --method POST --path /forms/1FAIpQLScUn:batchUpdate --body-contains '"requests":[{"updateFormInfo":{"info":{"title":"Renamed"},"updateMask":"title"}}]'
```

```expect:partial
verify ok
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms batch-update 1FAIpQLScUn --requests '[]' --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19012/api
```

```error:partial
no token found for provider "google"
```
