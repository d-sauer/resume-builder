<script setup>
import StringList from '../../components/StringList.vue'
import { move } from '../../lib/array.js'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div v-for="(entry, i) in section.entries" :key="i" class="sub">
    <div class="grid-2">
      <label>
        <span>Meta (date or place)</span>
        <input v-model="entry.meta" :data-field="`${path}.entries.${i}.meta`" type="text" />
      </label>
      <label>
        <span>Title</span>
        <input v-model="entry.title" :data-field="`${path}.entries.${i}.title`" type="text" />
      </label>
    </div>
    <label>
      <span>Subtitle</span>
      <input v-model="entry.subtitle" :data-field="`${path}.entries.${i}.subtitle`" type="text" />
    </label>
    <span class="field-label">Bullets</span>
    <StringList
      :items="entry.bullets"
      :path="`${path}.entries.${i}.bullets`"
      label="Bullet"
      multiline
    />
    <div class="sub-actions">
      <button type="button" @click="move(section.entries, i, -1)">↑</button>
      <button type="button" @click="move(section.entries, i, 1)">↓</button>
      <button type="button" class="danger" @click="section.entries.splice(i, 1)">Remove entry</button>
    </div>
  </div>
  <button
    type="button"
    class="add"
    @click="section.entries.push({ meta: '', title: '', subtitle: '', bullets: [] })"
  >
    + Add entry
  </button>
</template>
