<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <p class="hint">
    Everything after this point starts on a new page when printed or exported to PDF. Move it with
    the arrows to change where the paper splits.
  </p>
</template>

<style scoped>
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
</style>
