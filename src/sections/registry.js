import TextView from './views/TextView.vue'
import TagsView from './views/TagsView.vue'
import BulletsView from './views/BulletsView.vue'
import TimelineView from './views/TimelineView.vue'
import SkillsView from './views/SkillsView.vue'
import LanguagesView from './views/LanguagesView.vue'
import HobbiesView from './views/HobbiesView.vue'
import PageBreakView from './views/PageBreakView.vue'
import UnknownView from './views/UnknownView.vue'

import TextEditor from './editors/TextEditor.vue'
import TagsEditor from './editors/TagsEditor.vue'
import BulletsEditor from './editors/BulletsEditor.vue'
import TimelineEditor from './editors/TimelineEditor.vue'
import SkillsEditor from './editors/SkillsEditor.vue'
import LanguagesEditor from './editors/LanguagesEditor.vue'
import HobbiesEditor from './editors/HobbiesEditor.vue'
import PageBreakEditor from './editors/PageBreakEditor.vue'
import UnknownEditor from './editors/UnknownEditor.vue'

/**
 * Every section type lives here, and only here. Adding one means writing a view,
 * an editor, and a single entry below — the preview, the editor panel and the
 * "add section" menu all pick it up from this map.
 *
 *   label       what the type is called in the UI
 *   defaultIcon icon for a freshly added section
 *   chrome      false for sections that render no title/badge/rule (page-break)
 *   keys        payload keys the type owns; dropped when the type is switched
 *   blank()     the payload of a brand new section of this type
 *   normalise() fill in optional arrays so the editor never binds to undefined
 *   view/editor components taking { section, path }
 *
 * A future template is the same map with different `view` components.
 */
export const SECTION_TYPES = {
  text: {
    label: 'Text',
    defaultIcon: 'user',
    keys: ['paragraphs'],
    blank: () => ({ paragraphs: [''] }),
    view: TextView,
    editor: TextEditor,
  },
  tags: {
    label: 'Tags',
    defaultIcon: 'sparkle',
    keys: ['items'],
    blank: () => ({ items: [''] }),
    view: TagsView,
    editor: TagsEditor,
  },
  bullets: {
    label: 'Bullets',
    defaultIcon: 'star',
    keys: ['items'],
    blank: () => ({ items: [''] }),
    view: BulletsView,
    editor: BulletsEditor,
  },
  timeline: {
    label: 'Timeline',
    defaultIcon: 'briefcase',
    keys: ['entries'],
    blank: () => ({ entries: [{ meta: '', title: '', subtitle: '', bullets: [] }] }),
    normalise: (section) => {
      for (const entry of section.entries ?? []) entry.bullets ??= []
    },
    view: TimelineView,
    editor: TimelineEditor,
  },
  skills: {
    label: 'Skills',
    defaultIcon: 'flask',
    keys: ['groups'],
    blank: () => ({ groups: [{ name: 'Group', items: [{ name: '', level: 'Professional' }] }] }),
    normalise: (section) => {
      for (const group of section.groups ?? []) group.items ??= []
    },
    view: SkillsView,
    editor: SkillsEditor,
  },
  languages: {
    label: 'Languages',
    defaultIcon: 'flask',
    keys: ['items'],
    blank: () => ({ items: [{ name: '', level: '' }] }),
    view: LanguagesView,
    editor: LanguagesEditor,
  },
  hobbies: {
    label: 'Hobbies',
    defaultIcon: 'leaf',
    keys: ['items'],
    blank: () => ({ items: [{ name: '', icon: 'ball' }] }),
    view: HobbiesView,
    editor: HobbiesEditor,
  },
  'page-break': {
    label: 'Page break',
    defaultIcon: null,
    chrome: false,
    keys: [],
    blank: () => ({}),
    view: PageBreakView,
    editor: PageBreakEditor,
  },
}

/** Stand-in for a type this build does not know: shows the gap, keeps the data. */
const UNKNOWN = {
  label: 'Unknown',
  defaultIcon: 'star',
  chrome: true,
  keys: [],
  blank: () => ({}),
  view: UnknownView,
  editor: UnknownEditor,
}

export const SECTION_TYPE_NAMES = Object.keys(SECTION_TYPES)

/** Never returns undefined — an unrecognised type falls back to the placeholder. */
export function sectionType(type) {
  return SECTION_TYPES[type] ?? UNKNOWN
}

export function isKnownType(type) {
  return Object.hasOwn(SECTION_TYPES, type)
}

/** Chrome (title, badge, rule) is on unless the type opts out. */
export function hasChrome(type) {
  return sectionType(type).chrome !== false
}
