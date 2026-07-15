<script setup>
import { hobbyIcon } from '../../lib/icons.js'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <ul class="hobbies">
    <li v-for="(item, i) in section.items" :key="i" :data-field="`${path}.items.${i}.name`">
      <svg class="hobby-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path :d="hobbyIcon(item.icon)" />
      </svg>
      <span>{{ item.name }}</span>
    </li>
  </ul>
</template>
