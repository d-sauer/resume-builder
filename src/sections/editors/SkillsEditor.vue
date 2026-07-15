<script setup>
defineProps({
  section: { type: Object, required: true },
  path: { type: String, required: true },
})
</script>

<template>
  <div v-for="(group, gi) in section.groups" :key="gi" class="sub">
    <label>
      <span>Group name</span>
      <input v-model="group.name" :data-field="`${path}.groups.${gi}.name`" type="text" />
    </label>
    <div v-for="(skill, ki) in group.items" :key="ki" class="grid-skill">
      <input
        v-model="skill.name"
        :data-field="`${path}.groups.${gi}.items.${ki}.name`"
        type="text"
        placeholder="Skill"
      />
      <input
        v-model="skill.level"
        :data-field="`${path}.groups.${gi}.items.${ki}.level`"
        type="text"
        placeholder="Level"
      />
      <button type="button" class="danger" @click="group.items.splice(ki, 1)">✕</button>
    </div>
    <div class="sub-actions">
      <button
        type="button"
        class="add"
        @click="group.items.push({ name: '', level: 'Professional' })"
      >
        + Add skill
      </button>
      <button type="button" class="danger" @click="section.groups.splice(gi, 1)">Remove group</button>
    </div>
  </div>
  <button type="button" class="add" @click="section.groups.push({ name: '', items: [] })">
    + Add group
  </button>
</template>
