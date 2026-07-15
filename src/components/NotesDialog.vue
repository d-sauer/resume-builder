<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

/**
 * A scratchpad for notes that travel with the document but never appear on the
 * printed resume. The markdown editor carries its own edit/preview toggle in its
 * toolbar, so the dialog only has to host it and get out of the way.
 */
const notes = defineModel({ type: String, default: '' })
const props = defineProps({
  modifiedAt: { type: String, default: null },
})
const emit = defineEmits(['close'])

function onKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

function formatted(iso) {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString()
}
</script>

<template>
  <div class="backdrop" @click.self="emit('close')">
    <div class="dialog" role="dialog" aria-modal="true" aria-label="Notes">
      <header class="head">
        <strong>Notes</strong>
        <span class="stamp">Notes last edited: {{ formatted(props.modifiedAt) }}</span>
        <div class="spacer" />
        <button type="button" class="close" aria-label="Close" @click="emit('close')">✕</button>
      </header>
      <div class="body">
        <MdEditor
          v-model="notes"
          language="en-US"
          :toolbars="[
            'bold', 'underline', 'italic', 'strikeThrough', '-',
            'title', 'quote', 'unorderedList', 'orderedList', 'task', '-',
            'codeRow', 'code', 'link', 'table', '-',
            'revoke', 'next', '=', 'preview', 'previewOnly',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 40%);
}

.dialog {
  display: flex;
  flex-direction: column;
  width: min(900px, 100%);
  height: min(80vh, 100%);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 12px 48px rgb(0 0 0 / 30%);
  overflow: hidden;
}

.head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--rule);
}

.stamp {
  color: var(--muted);
  font-size: 12px;
}

.spacer {
  flex: 1;
}

.close {
  border: 0;
  background: none;
  font-size: 15px;
  cursor: pointer;
  color: var(--muted);
}

.body {
  flex: 1;
  min-height: 0;
}

.body :deep(.md-editor) {
  height: 100%;
}
</style>
