<script setup>
import { inlineHtml } from '../../lib/inline.js'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <ul class="bullets">
    <li
      v-for="(item, i) in section.items"
      :key="i"
      :data-field="`${path}.items.${i}`"
      v-html="inlineHtml(item)"
    />
  </ul>
</template>
