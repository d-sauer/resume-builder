<script setup>
import { nextTick, ref, watch } from 'vue'
import {
  SECTION_TYPES,
  SECTION_TYPE_NAMES,
  hasChrome,
  isVisible,
  sectionType,
} from '../sections/registry.js'
import { HOBBY_ICON_NAMES, SECTION_ICON_NAMES } from '../lib/icons.js'
import { move } from '../lib/array.js'
import { useResume } from '../useResume.js'
import { useFieldFocus } from '../useFieldFocus.js'

const props = defineProps({
  resume: { type: Object, required: true },
})

const { addSection, changeSectionType } = useResume()
const { request } = useFieldFocus()

const root = ref(null)
const open = ref(new Set())
const newType = ref('text')

function toggle(id) {
  const next = new Set(open.value)
  next.has(id) ? next.delete(id) : next.add(id)
  open.value = next
}

function onAddSection() {
  const id = addSection(newType.value)
  toggle(id)
}

/**
 * Hiding keeps the section in the document (and export) but drops it from the
 * printed resume. Showing again removes the flag so a visible section carries no
 * extra key.
 */
function toggleVisible(section) {
  if (section.visible === false) delete section.visible
  else section.visible = false
}

/**
 * A double-click in the preview sends a data path. The card holding it is almost
 * always collapsed, so open it first, then let Vue render before going looking
 * for the input.
 */
watch(request, async (req) => {
  if (!req) return

  const index = Number(req.path.match(/^sections\.(\d+)/)?.[1])
  if (Number.isInteger(index)) {
    const section = props.resume.sections[index]
    if (section && !open.value.has(section.id)) toggle(section.id)
  }

  await nextTick()

  const field = root.value?.querySelector(`[data-field="${CSS.escape(req.path)}"]`)
  if (!field) return

  // Deliberately not `behavior: 'smooth'`: under prefers-reduced-motion Chrome
  // drops the smooth scroll entirely rather than making it instant, which left
  // the field focused but off-screen. The flash below is the visual cue instead.
  field.scrollIntoView({ block: 'center' })
  field.focus({ preventScroll: true })
  field.select?.()

  field.classList.remove('field-jumped')
  void field.offsetWidth // restart the animation if the same field is clicked twice
  field.classList.add('field-jumped')
})
</script>

<template>
  <div ref="root" class="editor">
    <section class="card">
      <h2>Basics</h2>
      <label>
        <span>Name</span>
        <input v-model="resume.basics.name" data-field="basics.name" type="text" />
      </label>

      <h3>Contacts</h3>
      <div v-for="(contact, i) in resume.basics.contacts" :key="i" class="sub">
        <div class="grid-2">
          <label>
            <span>Label</span>
            <input v-model="contact.label" :data-field="`basics.contacts.${i}.label`" type="text" />
          </label>
          <label>
            <span>Value</span>
            <input v-model="contact.value" :data-field="`basics.contacts.${i}.value`" type="text" />
          </label>
        </div>
        <label>
          <span>Link (optional)</span>
          <input v-model="contact.url" type="text" placeholder="https://…" />
        </label>
        <div class="sub-actions">
          <button type="button" @click="move(resume.basics.contacts, i, -1)">↑</button>
          <button type="button" @click="move(resume.basics.contacts, i, 1)">↓</button>
          <button type="button" class="danger" @click="resume.basics.contacts.splice(i, 1)">
            Remove
          </button>
        </div>
      </div>
      <button
        type="button"
        class="add"
        @click="resume.basics.contacts.push({ label: '', value: '' })"
      >
        + Add contact
      </button>
    </section>

    <section
      v-for="(section, si) in resume.sections"
      :key="section.id"
      class="card"
      :class="{ 'is-hidden': !isVisible(section) }"
    >
      <header class="card-head">
        <button type="button" class="disclose" @click="toggle(section.id)">
          {{ open.has(section.id) ? '▾' : '▸' }}
          {{ hasChrome(section.type) ? section.title || 'Untitled' : sectionType(section.type).label }}
          <em>{{ section.type }}</em>
        </button>
        <div class="sub-actions">
          <button
            type="button"
            class="eye"
            :title="isVisible(section) ? 'Hide from printed resume' : 'Show in printed resume'"
            :aria-label="isVisible(section) ? 'Hide section' : 'Show section'"
            :aria-pressed="!isVisible(section)"
            @click="toggleVisible(section)"
          >
            <svg v-if="isVisible(section)" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <path
                fill="currentColor"
                d="M2 4.3 3.3 3 21 20.7 19.7 22l-3-3c-1.5.6-3 1-4.7 1-5 0-9-4.5-10-7 .5-1.2 1.7-3 3.5-4.4L2 4.3ZM12 16a4 4 0 0 1-3.8-5.2l1.6 1.6a2 2 0 0 0 2.4 2.4l1.6 1.6A4 4 0 0 1 12 16Zm0-11c5 0 9 4.5 10 7-.4 1-1.3 2.3-2.6 3.5l-3-3A4 4 0 0 0 9.5 6.6l-2-2C8.7 4.2 10.3 4 12 4Z"
              />
            </svg>
          </button>
          <button type="button" @click="move(resume.sections, si, -1)">↑</button>
          <button type="button" @click="move(resume.sections, si, 1)">↓</button>
          <button type="button" class="danger" @click="resume.sections.splice(si, 1)">✕</button>
        </div>
      </header>

      <div v-if="open.has(section.id)" class="card-body">
        <!-- Chromeless types (page-break) have no title, icon or type to switch. -->
        <div v-if="hasChrome(section.type)" class="grid-3">
          <label>
            <span>Title</span>
            <input v-model="section.title" :data-field="`sections.${si}.title`" type="text" />
          </label>
          <label>
            <span>Icon</span>
            <select v-model="section.icon">
              <option v-for="name in SECTION_ICON_NAMES" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </label>
          <label>
            <span>Type</span>
            <select :value="section.type" @change="changeSectionType(section, $event.target.value)">
              <option v-for="type in SECTION_TYPE_NAMES" :key="type" :value="type">
                {{ SECTION_TYPES[type].label }}
              </option>
            </select>
          </label>
        </div>

        <component
          :is="sectionType(section.type).editor"
          :section="section"
          :path="`sections.${si}`"
        />
      </div>
    </section>

    <div class="add-row">
      <select v-model="newType" aria-label="New section type">
        <option v-for="type in SECTION_TYPE_NAMES" :key="type" :value="type">
          {{ SECTION_TYPES[type].label }}
        </option>
      </select>
      <button type="button" class="add" @click="onAddSection">+ Add section</button>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  padding: 12px;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: #fff;
}

/* A hidden section still lives in the document, so it stays in the list but is
   dimmed. The header (disclosure + eye) is lifted back to full strength so it
   stays legible and the section can be un-hidden. */
.card.is-hidden {
  background: #f4f5f6;
  border-style: dashed;
}

.card.is-hidden .card-body,
.card.is-hidden .disclose {
  opacity: 0.5;
}

.eye {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  color: var(--muted);
}

.card.is-hidden .eye {
  color: var(--text, inherit);
}

.card h2 {
  margin: 0 0 10px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.card h3 {
  margin: 14px 0 8px;
  font-size: 12px;
  color: var(--muted);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.disclose {
  flex: 1;
  padding: 2px 0;
  border: 0;
  background: none;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.disclose em {
  margin-left: 6px;
  color: var(--muted);
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--rule);
}

.add-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
}
</style>
