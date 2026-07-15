import { ref } from 'vue'

/**
 * Double-clicking the preview asks the editor to reveal the same field. The two
 * panes agree on one thing only: a data path like "sections.3.entries.2.title",
 * written as `data-field` on the rendered node and on the matching input.
 *
 * Paths are index-based, so they are valid only for the click that produced them
 * — they are a transient address, never an identity. Do not persist one.
 */
const request = ref(null)

export function requestField(path) {
  // A fresh object every time, so double-clicking the same field twice re-fires.
  request.value = { path }
}

export function useFieldFocus() {
  return { request, requestField }
}
