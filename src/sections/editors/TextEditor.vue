<script setup>
import StringList from '../../components/StringList.vue'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <StringList
    :items="section.paragraphs"
    :path="`${path}.paragraphs`"
    label="Paragraph"
    multiline
  />
</template>
