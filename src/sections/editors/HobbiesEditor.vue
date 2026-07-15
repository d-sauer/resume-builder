<script setup>
import { HOBBY_ICON_NAMES } from '../../lib/icons.js'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div v-for="(item, i) in section.items" :key="i" class="grid-skill">
    <input
      v-model="item.name"
      :data-field="`${path}.items.${i}.name`"
      type="text"
      placeholder="Hobby"
    />
    <select v-model="item.icon">
      <option v-for="name in HOBBY_ICON_NAMES" :key="name" :value="name">{{ name }}</option>
    </select>
    <button type="button" class="danger" @click="section.items.splice(i, 1)">✕</button>
  </div>
  <button type="button" class="add" @click="section.items.push({ name: '', icon: 'ball' })">
    + Add hobby
  </button>
</template>
