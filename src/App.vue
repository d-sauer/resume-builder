<script setup>
import { onMounted, ref } from 'vue'
import EditorPanel from './components/EditorPanel.vue'
import ResumePreview from './components/ResumePreview.vue'
import { useResume } from './useResume.js'

const {
  resume,
  dirty,
  storageBroken,
  boot,
  exportToFile,
  importFromFile,
  resetToSample,
} = useResume()

const showEditor = ref(true)
const importInput = ref(null)
const notice = ref('')

onMounted(() => {
  const { error } = boot()
  if (error) flash(error)

  // The exported file is the only durable copy, so warn before leaving with
  // changes that have never been downloaded.
  window.addEventListener('beforeunload', (event) => {
    if (!dirty.value) return
    event.preventDefault()
    event.returnValue = ''
  })
})

function flash(message) {
  notice.value = message
  setTimeout(() => (notice.value = ''), 4000)
}

async function onImport(event) {
  const [file] = event.target.files ?? []
  if (!file) return
  try {
    await importFromFile(file)
    flash(`Imported ${file.name}`)
  } catch (e) {
    // importFromFile validates against a detached copy, so the current resume is
    // still intact here — nothing to roll back.
    flash(`Import failed: ${e.message}`)
  }
  event.target.value = ''
}

function onReset() {
  if (dirty.value && !confirm('Discard the current resume and load the sample?')) return
  resetToSample()
  flash('Loaded the sample resume')
}

function print() {
  window.print()
}
</script>

<template>
  <div class="app">
    <header class="toolbar">
      <strong class="brand">Resume Builder</strong>
      <span v-if="dirty" class="pill" title="These changes only exist in this browser">
        not exported
      </span>
      <span v-if="storageBroken" class="pill warn" title="Changes will be lost on reload">
        autosave unavailable
      </span>
      <span v-if="notice" class="notice">{{ notice }}</span>

      <div class="spacer" />

      <button type="button" @click="showEditor = !showEditor">
        {{ showEditor ? 'Hide' : 'Show' }} editor
      </button>
      <button type="button" @click="importInput.click()">Open JSON…</button>
      <button type="button" @click="onReset">Reset to sample</button>
      <button type="button" @click="exportToFile()">Download JSON</button>
      <button type="button" class="primary" @click="print">Print / PDF</button>
      <input
        ref="importInput"
        type="file"
        accept="application/json,.json"
        hidden
        @change="onImport"
      />
    </header>

    <main v-if="resume" class="workspace">
      <aside v-if="showEditor" class="pane editor-pane">
        <EditorPanel :resume="resume" />
      </aside>

      <div class="pane preview-pane">
        <ResumePreview :resume="resume" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 16px;
  border-bottom: 1px solid var(--rule);
  background: #fff;
}

.brand {
  font-size: 14px;
}

.spacer {
  flex: 1;
}

.pill {
  padding: 2px 8px;
  border-radius: 999px;
  background: #fff3cd;
  color: #7a5b00;
  font-size: 11px;
}

.pill.warn {
  background: #fde8e6;
  color: #b3261e;
}

.notice {
  color: var(--muted);
  font-size: 12px;
}

.workspace {
  display: flex;
  flex: 1;
  min-height: 0;
}

.pane {
  overflow: auto;
}

.editor-pane {
  width: 460px;
  flex: none;
  padding: 16px;
  border-right: 1px solid var(--rule);
  background: #f4f5f6;
}

.preview-pane {
  flex: 1;
  display: flex;
  justify-content: center;
  /* Without this the sheet is stretched to the pane height and its content
     overflows past the paper instead of making the paper taller. */
  align-items: flex-start;
  padding: 24px;
  background: #e9ebed;
}

.preview-pane :deep(.sheet) {
  box-shadow: 0 2px 16px rgb(0 0 0 / 12%);
}

@media print {
  .toolbar,
  .editor-pane {
    display: none;
  }

  .app,
  .workspace {
    display: block;
    height: auto;
  }

  .preview-pane {
    display: block;
    padding: 0;
    background: #fff;
    overflow: visible;
  }

  .preview-pane :deep(.sheet) {
    box-shadow: none;
  }
}
</style>
