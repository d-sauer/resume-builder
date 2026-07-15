<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <!-- On screen: a dashed line showing where the paper will split.
       In print: an invisible forced page break. -->
  <div class="page-break" :data-field="path" role="separator" aria-label="Page break">
    <span class="page-break-label">page break</span>
  </div>
</template>
