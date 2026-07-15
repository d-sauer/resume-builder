<script setup>
import { nextTick, ref, watch } from 'vue'
import { SECTION_TYPES, SECTION_TYPE_NAMES, hasChrome, sectionType } from '../sections/registry.js'
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

    <section v-for="(section, si) in resume.sections" :key="section.id" class="card">
      <header class="card-head">
        <button type="button" class="disclose" @click="toggle(section.id)">
          {{ open.has(section.id) ? '▾' : '▸' }}
          {{ hasChrome(section.type) ? section.title || 'Untitled' : sectionType(section.type).label }}
          <em>{{ section.type }}</em>
        </button>
        <div class="sub-actions">
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
