<script setup>
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
      placeholder="Language"
    />
    <input
      v-model="item.level"
      :data-field="`${path}.items.${i}.level`"
      type="text"
      placeholder="Level"
    />
    <button type="button" class="danger" @click="section.items.splice(i, 1)">✕</button>
  </div>
  <button type="button" class="add" @click="section.items.push({ name: '', level: '' })">
    + Add language
  </button>
</template>
