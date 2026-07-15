/**
 * The document format. `schemaVersion` is the contract: bump it only when the
 * shape of existing data changes, never when a new section type is added — a
 * new type is backward-compatible, and old files stay valid.
 *
 * Version history:
 *   0 — unversioned; the original shape (no schemaVersion, no meta).
 *   1 — adds schemaVersion + meta.
 *   2 — adds top-level `notes` (markdown) plus `contentModifiedAt` and
 *       `notesModifiedAt` timestamps tracking when each last changed.
 */
export const SCHEMA_VERSION = 2
export const APP_VERSION = '1.0.0'

/** Applied in order to lift a document from version n to n + 1. */
const MIGRATIONS = {
  0: (data) => ({
    schemaVersion: 1,
    meta: { app: 'resume-builder', appVersion: APP_VERSION, exportedAt: null },
    ...data,
  }),
  1: (data) => ({
    ...data,
    schemaVersion: 2,
    notes: '',
    contentModifiedAt: null,
    notesModifiedAt: null,
  }),
}

export class SchemaError extends Error {}

/**
 * Bring a parsed document up to SCHEMA_VERSION. Returns a new object; never
 * mutates the input, so a failure part-way through cannot corrupt the caller's
 * copy. A document from a *newer* build is refused rather than best-effort
 * parsed — guessing at a format we do not know is how data gets silently lost.
 */
export function migrate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new SchemaError('The file must contain a JSON object')
  }

  let version = input.schemaVersion ?? 0
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 0) {
    throw new SchemaError(`Invalid schemaVersion: ${JSON.stringify(input.schemaVersion)}`)
  }
  if (version > SCHEMA_VERSION) {
    throw new SchemaError(
      `This file was written by a newer version of the app (schema ${version}, ` +
        `this build understands ${SCHEMA_VERSION}). Update the app to open it.`,
    )
  }

  let data = structuredClone(input)
  while (version < SCHEMA_VERSION) {
    const step = MIGRATIONS[version]
    if (!step) throw new SchemaError(`No migration from schema ${version}`)
    data = step(data)
    version += 1
  }
  data.schemaVersion = SCHEMA_VERSION
  return data
}

/**
 * Structural check only. Section *payloads* are deliberately not validated:
 * an unknown section type must survive a round-trip untouched, so we cannot
 * reject what this build does not happen to recognise.
 */
export function validate(data) {
  if (!data.basics || typeof data.basics !== 'object') throw new SchemaError('Missing "basics"')
  if (typeof data.basics.name !== 'string') throw new SchemaError('Missing "basics.name"')
  data.basics.contacts ??= []
  if (!Array.isArray(data.basics.contacts)) throw new SchemaError('"basics.contacts" must be a list')
  if (!Array.isArray(data.sections)) throw new SchemaError('Missing "sections" list')

  // Notes are free-form and optional; coerce rather than reject so a slightly
  // malformed hand-edit still opens.
  if (typeof data.notes !== 'string') data.notes = ''
  if (typeof data.contentModifiedAt !== 'string') data.contentModifiedAt = null
  if (typeof data.notesModifiedAt !== 'string') data.notesModifiedAt = null

  const seen = new Set()
  for (const [i, section] of data.sections.entries()) {
    if (!section || typeof section !== 'object') {
      throw new SchemaError(`Section ${i} is not an object`)
    }
    if (typeof section.type !== 'string' || !section.type) {
      throw new SchemaError(`Section ${i} has no "type"`)
    }
    // ids are the render key and the disclosure key, so they have to be unique.
    if (typeof section.id !== 'string' || !section.id || seen.has(section.id)) {
      section.id = crypto.randomUUID()
    }
    seen.add(section.id)
  }
  return data
}

export function newId() {
  return crypto.randomUUID()
}
