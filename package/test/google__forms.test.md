# google forms

Part of the optional `integration` group in `test.suite.md`. These tests talk to the
real Google Forms API, so they need a completed `aux4 google auth login` — a Google
Cloud OAuth Desktop client plus a human approving the consent screen in a browser.
They only run when asked for explicitly:

```bash
aux4 test run --group integration
```

Set `FORM_ID` to a Google Form the authenticated account can read.

```timeout
15000
```

## get

### should return the form definition

```execute
aux4 google forms get ${FORM_ID}
```

```expect:partial
"formId"
```

```expect:partial
"info"
```

## responses list

### should return the responses collection

```execute
aux4 google forms responses list ${FORM_ID}
```

```expect:partial
"responses"
```

## create

### should create a form and return its id

```execute
aux4 google forms create --title "aux4 integration test form"
```

```expect:partial
"formId"
```
