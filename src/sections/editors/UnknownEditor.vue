<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <p class="hint">
    This build has no editor for type <code>{{ section.type }}</code
    >. Its data is left untouched and exported as-is.
  </p>
</template>

<style scoped>
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

code {
  font-family: ui-monospace, monospace;
}
</style>
