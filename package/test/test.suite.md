# google-forms test suite

Run the CI-safe group with `aux4 test run --group core` from this directory. The
`integration` group needs a real Google login and is skipped unless requested.

## core

- google__forms__create.test.md
- google__forms__get.test.md
- google__forms__batch-update.test.md
- google_forms_responses__list.test.md
- google_forms_responses__get.test.md
- google__forms__injection.test.md

## integration (optional)

- google__forms.test.md
