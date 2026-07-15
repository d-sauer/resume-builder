# Resume Builder — Requirements

Source of the design: `design/template.pdf` (6-page A4 CV, green Europass-style layout).

## Goal

A locally-run web app that renders a CV from a structured JSON file, matching the visual
design of `template.pdf`. The JSON is the single source of truth for content; the app is
the renderer and the editor.

## Functional requirements

### R1 — Structured content model

- The CV content is held in one JSON file (`data/resume.json`), derived from the template.
- The model is section-typed, not section-named: the schema describes *kinds* of sections
  (`text`, `tags`, `bullets`, `timeline`, `skills`, `languages`, `hobbies`), so sections can
  be added, removed, and reordered as data without code changes.
- Section order in the file is the order on the page.

### R2 — Render the template

- The page reproduces the layout of `template.pdf`: centred name and contact line, accent
  circle icons per section heading with a rule to the right, tag chips, two-column
  date/content timeline entries, a four-column skills grid with level labels, languages,
  and hobby icons.
- Palette taken from the template: accent `#24e0a2`, ink `#3d3d3d`, rules `#e6e6e6`.
- Rendered at A4 width so the on-screen preview matches the printed result.

### R3 — Read JSON from the local filesystem, live

- The app reads the JSON from the local filesystem at startup.
- Any change to that file on disk is reflected in the page automatically, without a manual
  reload.

### R4 — Edit in the page

- Every field in the model is editable from within the page: basics, contacts, section
  titles/icons/types, and each section's own items or entries.
- List items (paragraphs, tags, bullets, entries, skills, languages, hobbies, contacts,
  sections) can be added, removed, and reordered.
- The preview updates as you type.

### R5 — Import and export

- Export the current state to a JSON file (download).
- Import a JSON file to replace the current state.
- Imported files are validated enough to fail loudly rather than render a broken page.

## Non-functional requirements

- **Local-first.** No backend, no network calls, no accounts. `npm run dev` is the whole
  runtime; `npm run build` produces a static site.
- **Honest sync.** Page edits live in memory and cannot silently overwrite the file. When
  the file changes on disk while the page holds unsaved edits, the user is asked which copy
  wins.
- **Print.** Printing the page produces the CV alone on A4 — no toolbar, no editor —
  so "Print → Save as PDF" reproduces a document like `template.pdf`.
- **Safe text.** Content is escaped on render; the only markup honoured in copy is `**bold**`,
  used for the bold lead-ins on the Strengths bullets.

## Out of scope

- Multiple CVs / profiles, or per-application variants.
- Multiple visual themes or template switching.
- Server-side PDF generation (browser print is the PDF path).
- Hosting, sharing, or publishing the rendered CV.

## Notes on the source template

- The job title in the PDF reads "Technology Architecture **Directory**"; carried over
  verbatim into the JSON. Likely a typo for "Director" — a one-word change in the data.
