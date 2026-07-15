import { computed, ref, watch } from 'vue'
import seed from './seed/resume.json'
import { APP_VERSION, SCHEMA_VERSION, migrate, newId, validate } from './lib/schema.js'
import { sectionType } from './sections/registry.js'

const STORAGE_KEY = 'resume-builder:document'
/** Snapshot as of the last export, kept next to the draft so "not exported" survives a reload. */
const EXPORT_KEY = 'resume-builder:exported'
const AUTOSAVE_MS = 300

/**
 * The page is the edit surface; JSON is an export format, not a live file. The
 * working copy therefore lives here, autosaved to localStorage so a refresh does
 * not destroy it. localStorage is a cache, not storage — it goes away with the
 * site data — so the exported file remains the real artifact, and `dirty` means
 * "changed since the last export", which is the only way work can now be lost.
 */
const resume = ref(null)
/** Serialised snapshot as of the last export (or of the seed, on a fresh start). */
const exported = ref('')
const storageBroken = ref(false)

const dirty = computed(() => resume.value !== null && serialise(resume.value) !== exported.value)

/** Empty `bullets` arrays are an artefact of normalise(), so keep them out of the file. */
function serialise(data) {
  const replacer = (key, value) =>
    key === 'bullets' && Array.isArray(value) && value.length === 0 ? undefined : value
  return JSON.stringify(data, replacer, 2) + '\n'
}

/** Fill in the optional arrays the editors bind to, so they never see undefined. */
function normalise(data) {
  for (const section of data.sections) sectionType(section.type).normalise?.(section)
  return data
}

/** Parse → migrate → validate → normalise. Throws before touching any state. */
function parse(input) {
  return normalise(validate(migrate(input)))
}

function remember(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    storageBroken.value = true
  }
}

/**
 * Take `data` as the working copy and treat it as matching the file on disk —
 * true for the seed, for a freshly imported file, and after an export.
 */
function adopt(data) {
  resume.value = data
  exported.value = serialise(data)
  remember(EXPORT_KEY, exported.value)
}

/**
 * Boot order: the autosaved working copy, else the bundled sample. A corrupt or
 * stale-format autosave must not brick the app, so it is reported and dropped
 * rather than thrown.
 */
export function boot() {
  let stored = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    storageBroken.value = true // private mode, or storage disabled
  }

  if (stored) {
    try {
      resume.value = parse(JSON.parse(stored))
      // Restore what was last exported too, so the "not exported" pill stays
      // accurate across a reload instead of crying wolf on an untouched draft.
      exported.value = localStorage.getItem(EXPORT_KEY) ?? ''
      return { restored: true }
    } catch (e) {
      adopt(parse(structuredClone(seed)))
      return {
        restored: false,
        error: `Saved draft could not be read (${e.message}); loaded the sample.`,
      }
    }
  }

  adopt(parse(structuredClone(seed)))
  return { restored: false }
}

let timer
watch(
  resume,
  () => {
    if (!resume.value || storageBroken.value) return
    clearTimeout(timer)
    timer = setTimeout(() => remember(STORAGE_KEY, serialise(resume.value)), AUTOSAVE_MS)
  },
  { deep: true },
)

function exportToFile(filename = 'resume.json') {
  const data = resume.value
  data.schemaVersion = SCHEMA_VERSION
  data.meta = { app: 'resume-builder', appVersion: APP_VERSION, exportedAt: new Date().toISOString() }

  const text = serialise(data)
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)

  exported.value = text
  remember(EXPORT_KEY, text)
}

/**
 * Import replaces the whole document, so it must not half-apply: everything that
 * can throw runs against a detached copy, and the live state is swapped only once
 * the file has fully parsed, migrated and validated.
 */
async function importFromFile(file) {
  const next = parse(JSON.parse(await file.text()))
  adopt(next)
}

function resetToSample() {
  adopt(parse(structuredClone(seed)))
}

function addSection(type = 'text') {
  const def = sectionType(type)
  // Chromeless types (page-break) render no heading, so a title and icon would
  // only be dead weight in the exported file.
  const chrome = def.chrome === false ? {} : { title: 'New section', icon: def.defaultIcon }
  resume.value.sections.push({ id: newId(), type, ...chrome, ...def.blank() })
  return resume.value.sections.at(-1).id
}

/** Swap in the fields the new type needs, dropping the ones the old type owned. */
function changeSectionType(section, type) {
  for (const key of sectionType(section.type).keys) delete section[key]
  const def = sectionType(type)
  Object.assign(section, { type }, def.blank())
  def.normalise?.(section)
}

export function useResume() {
  return {
    resume,
    dirty,
    storageBroken,
    boot,
    exportToFile,
    importFromFile,
    resetToSample,
    addSection,
    changeSectionType,
  }
}
