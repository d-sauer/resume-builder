# Resume Builder

A Vue 3 + Vite app that renders a resume as the CV in `design/template.pdf`. You edit in
the page; JSON is how a resume gets in and out, not where it lives while you work on it.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## How the data flows

The working copy lives in the page and is autosaved to `localStorage`, so a refresh does
not lose it. `localStorage` is a cache, not storage — it disappears with the site data —
so **the exported file is the only durable copy**, and the "not exported" pill means you
have changes you have not downloaded yet. Leaving the page with those changes prompts.

- **Open JSON…** loads an exported file. It is validated against a detached copy first, so
  a bad file reports an error and leaves the resume you are working on untouched.
- **Download JSON** writes the current state out and clears the pill.
- **Reset to sample** goes back to the bundled starter (`src/seed/resume.json`).
- **Print / PDF** prints the preview alone (A4, editor and toolbar hidden).

**Double-click anything in the preview** to jump to the field that produces it: the
section opens in the editor, the input scrolls into view, focuses and flashes.

## Versioning

Exported files carry a `schemaVersion` (the format contract) and a `meta` block
(provenance — never branched on):

```jsonc
{
  "schemaVersion": 1,
  "meta": { "app": "resume-builder", "appVersion": "1.0.0", "exportedAt": "2026-07-14T…" },
  "basics": { … },
  "sections": [ … ]
}
```

Older files are migrated on open (a file with no `schemaVersion` is treated as version 0).
A file from a *newer* build is refused with a clear message rather than half-understood.
**Bump `SCHEMA_VERSION` only when the shape of existing data changes** — adding a section
type is backward-compatible and needs no bump. Migrations live in `src/lib/schema.js`.

A section type this build does not know renders as a visible placeholder and is
**re-exported byte-for-byte**, so hand-writing a type ahead of its renderer never loses data.

## Section types

Every section has an `id`, a `type`, and (unless the type opts out of chrome) a `title` and
`icon`. The `type` decides both how it renders and which fields it carries:

| `type`       | Fields                                           | Used by                           |
| ------------ | ------------------------------------------------ | --------------------------------- |
| `text`       | `paragraphs: string[]`                           | Profile                           |
| `tags`       | `items: string[]`                                | Highlights                        |
| `bullets`    | `items: string[]`                                | Strengths                         |
| `timeline`   | `entries: [{ meta, title, subtitle, bullets? }]` | Work, education, portfolio, talks |
| `skills`     | `groups: [{ name, items: [{ name, level }] }]`   | Skills                            |
| `languages`  | `items: [{ name, level }]`                       | Languages                         |
| `hobbies`    | `items: [{ name, icon }]`                        | Hobbies                           |
| `page-break` | *(none)*                                         | Forcing a new page in the PDF     |

`meta` is the left-hand column — a date range for jobs, a place for education, empty for
talks. Bullet and paragraph text supports `**bold**` for lead-ins; all other markup is
escaped. Icon names come from `src/lib/icons.js`.

`page-break` is a section like any other, so it moves with the same arrows: on screen it is
a dashed line showing where the paper splits, and in print it is an invisible forced break.

### Adding a type

Write a view and an editor (both take `{ section, path }`), then add one entry to
`SECTION_TYPES` in `src/sections/registry.js`. The preview, the editor panel and the
"add section" menu all pick it up from there — nothing else enumerates the types.

A **visual template** is the same registry with different `view` components and a different
stylesheet; that is what the split between `registry.js` and `styles/resume.css` is for.

## Layout

```
src/seed/resume.json          bundled starter document
src/useResume.js              working copy, localStorage autosave, import/export
src/lib/schema.js             schemaVersion, migrations, validation
src/useFieldFocus.js          preview double-click -> editor field, via data paths
src/sections/
  registry.js                 every section type, declared once
  views/                      how each type renders on the sheet
  editors/                    how each type is edited
src/components/
  ResumePreview.vue           the A4 sheet: header + section chrome, bodies from the registry
  EditorPanel.vue             the form: basics + section cards, bodies from the registry
  StringList.vue              add/remove/reorder editor for string arrays
src/styles/resume.css         the "classic" resume look (global: the views share classes)
src/lib/icons.js              inline SVG icon set
src/lib/inline.js             escape + **bold** renderer
```

Theme colours (`--accent: #24e0a2`, ink, rules) live in `src/style.css`.
