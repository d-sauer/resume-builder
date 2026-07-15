const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/**
 * Renders the one piece of markup the resume text needs — **bold** — after
 * escaping everything else, so bullet copy can carry a bold lead-in safely.
 */
export function inlineHtml(text) {
  return String(text ?? '')
    .replace(/[&<>"']/g, (ch) => ESCAPES[ch])
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
