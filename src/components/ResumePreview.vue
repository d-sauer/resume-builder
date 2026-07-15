<script setup>
import { sectionIcon } from '../lib/icons.js'
import { hasChrome, sectionType } from '../sections/registry.js'
import { requestField } from '../useFieldFocus.js'

defineProps({
  resume: { type: Object, required: true },
})

/**
 * One listener for the whole sheet: walk up from whatever was double-clicked to
 * the nearest node that declares a data path. Sections carry their title as a
 * path, so a click on a gap inside a section still lands somewhere sensible
 * instead of doing nothing.
 */
function onDblClick(event) {
  const node = event.target.closest('[data-field]')
  if (node) requestField(node.dataset.field)
}
</script>

<template>
  <article class="sheet" @dblclick="onDblClick">
    <header class="head">
      <h1 class="name" data-field="basics.name">{{ resume.basics.name }}</h1>
      <ul class="contacts">
        <li v-for="(contact, i) in resume.basics.contacts" :key="i">
          <b>{{ contact.label }}:</b>&nbsp;<a
            v-if="contact.url"
            :href="contact.url"
            :data-field="`basics.contacts.${i}.value`"
            >{{ contact.value }}</a
          ><span v-else :data-field="`basics.contacts.${i}.value`">{{ contact.value }}</span>
        </li>
      </ul>
    </header>

    <template v-for="(section, si) in resume.sections" :key="section.id">
      <!-- Types that opt out of chrome (page-break) render bare, with no heading. -->
      <component
        :is="sectionType(section.type).view"
        v-if="!hasChrome(section.type)"
        :section="section"
        :path="`sections.${si}`"
      />

      <section v-else class="section" :data-field="`sections.${si}.title`">
        <h2 class="section-title">
          <span v-if="section.icon" class="badge" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path :d="sectionIcon(section.icon)" /></svg>
          </span>
          <span>{{ section.title }}</span>
          <span class="rule" />
        </h2>

        <component
          :is="sectionType(section.type).view"
          :section="section"
          :path="`sections.${si}`"
        />
      </section>
    </template>
  </article>
</template>
