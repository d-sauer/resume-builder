<script setup>
/**
 * A section whose type this build has no renderer for — typically a type from a
 * newer template, or one hand-written in JSON ahead of its view. The data is
 * kept intact and re-exported untouched; this only makes the gap visible rather
 * than rendering an empty heading and looking like the file is broken. It stays
 * visible in print on purpose: a PDF that silently drops a section is worse than
 * one with an obvious placeholder.
 */
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div class="unknown">
    <strong>Unknown section type: {{ section.type }}</strong>
    <span>Its data is preserved and will be exported unchanged.</span>
  </div>
</template>
