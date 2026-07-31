# google forms batch-update

Part of the `core` group in `test.suite.md`. The Google Forms API is replaced by a
local echo server (`mock-echo.js`), so the test asserts the request aux4 builds —
method, path, `Authorization` header and JSON body — without touching a real form.

## against a local mock API

```beforeAll
nohup node mock-echo.js 19012 >/dev/null 2>&1 &
for i in $(seq 1 40); do curl -s -o /dev/null http://127.0.0.1:19012/ 2>/dev/null && break; sleep 0.25; done
```

```afterAll
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

### should POST to the batchUpdate endpoint with a bearer token

```execute
aux4 google forms batch-update 1FAIpQLScUn --requests '[{"updateFormInfo":{"info":{"title":"Renamed"},"updateMask":"title"}}]' --tokenFile google-token.json --apiUrl http://127.0.0.1:19012
```

```expect:partial
"authorization": "Bearer test-access-token"
```

```expect:partial
"contentType": "application/json"
```

```expect:partial
"method": "POST"
```

```expect:partial
"path": "/forms/1FAIpQLScUn:batchUpdate"
```

### should wrap the requests array in a requests key

```execute
aux4 google forms batch-update 1FAIpQLScUn --requests '[{"updateFormInfo":{"info":{"title":"Renamed"},"updateMask":"title"}}]' --tokenFile google-token.json --apiUrl http://127.0.0.1:19012 | aux4 json get --path '$.body'
```

```expect:json
{
  "requests": [
    {
      "updateFormInfo": {
        "info": {
          "title": "Renamed"
        },
        "updateMask": "title"
      }
    }
  ]
}
```

## without a stored token

### should report that the google provider has no token

```execute
aux4 google forms batch-update 1FAIpQLScUn --requests '[]' --tokenFile ./no-such-directory/google.json --apiUrl http://127.0.0.1:19012
```

```error:partial
no token found for provider "google"
```
