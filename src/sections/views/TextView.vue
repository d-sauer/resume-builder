<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div class="prose">
    <p
      v-for="(paragraph, i) in section.paragraphs"
      :key="i"
      :data-field="`${path}.paragraphs.${i}`"
    >
      {{ paragraph }}
    </p>
  </div>
</template>
