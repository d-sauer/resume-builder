<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <ul class="tags">
    <li v-for="(item, i) in section.items" :key="i" class="tag" :data-field="`${path}.items.${i}`">
      {{ item }}
    </li>
  </ul>
</template>
