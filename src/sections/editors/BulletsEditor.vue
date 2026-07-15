<script setup>
import StringList from '../../components/StringList.vue'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <StringList :items="section.items" :path="`${path}.items`" label="Bullet" multiline />
</template>
