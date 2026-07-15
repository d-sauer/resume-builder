<script setup>
import { inlineHtml } from '../../lib/inline.js'

defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div class="timeline">
    <div v-for="(entry, i) in section.entries" :key="i" class="entry">
      <div class="entry-meta" :data-field="`${path}.entries.${i}.meta`">{{ entry.meta }}</div>
      <div class="entry-body">
        <h3 class="entry-title" :data-field="`${path}.entries.${i}.title`">{{ entry.title }}</h3>
        <p
          v-if="entry.subtitle"
          class="entry-subtitle"
          :data-field="`${path}.entries.${i}.subtitle`"
        >
          {{ entry.subtitle }}
        </p>
        <ul v-if="entry.bullets?.length" class="bullets">
          <li
            v-for="(bullet, j) in entry.bullets"
            :key="j"
            :data-field="`${path}.entries.${i}.bullets.${j}`"
            v-html="inlineHtml(bullet)"
          />
        </ul>
      </div>
    </div>
  </div>
</template>
