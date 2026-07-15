<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div class="skills">
    <div v-for="(group, i) in section.groups" :key="i" class="skill-group">
      <h3 class="skill-group-name" :data-field="`${path}.groups.${i}.name`">
        &ndash; {{ group.name }}
      </h3>
      <ul class="skill-grid">
        <li v-for="(skill, j) in group.items" :key="j" class="skill">
          <span class="skill-name" :data-field="`${path}.groups.${i}.items.${j}.name`">
            {{ skill.name }}
          </span>
          <span class="level" :data-field="`${path}.groups.${i}.items.${j}.level`">
            {{ skill.level }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
