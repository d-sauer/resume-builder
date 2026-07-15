<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <ul class="languages">
    <li v-for="(item, i) in section.items" :key="i">
      <span class="language-name" :data-field="`${path}.items.${i}.name`">{{ item.name }}</span>
      <span class="level" :data-field="`${path}.items.${i}.level`">{{ item.level }}</span>
    </li>
  </ul>
</template>
