<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  label: { type: String, default: 'Item' },
  multiline: { type: Boolean, default: false },
  /** Data path of the array itself, e.g. "sections.2.paragraphs". */
  path: { type: String, default: '' },
})

function update(index, value) {
  props.items[index] = value
}

function add() {
  props.items.push('')
}

function remove(index) {
  props.items.splice(index, 1)
}

function move(index, by) {
  const target = index + by
  if (target < 0 || target >= props.items.length) return
  const [item] = props.items.splice(index, 1)
  props.items.splice(target, 0, item)
}
</script>

<template>
  <div class="list">
    <div v-for="(item, i) in items" :key="i" class="row">
      <textarea
        v-if="multiline"
        :value="item"
        :data-field="path ? `${path}.${i}` : null"
        rows="3"
        @input="update(i, $event.target.value)"
      />
      <input
        v-else
        :value="item"
        :data-field="path ? `${path}.${i}` : null"
        type="text"
        @input="update(i, $event.target.value)"
      />
      <div class="row-actions">
        <button type="button" title="Move up" @click="move(i, -1)">↑</button>
        <button type="button" title="Move down" @click="move(i, 1)">↓</button>
        <button type="button" title="Remove" class="danger" @click="remove(i)">✕</button>
      </div>
    </div>
    <button type="button" class="add" @click="add">+ Add {{ label.toLowerCase() }}</button>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.row > :first-child {
  flex: 1;
}

.row-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
