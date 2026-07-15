/**
 * Inline SVG paths, drawn on a 24x24 grid. `section` icons sit in the accent
 * circle next to a section heading; `hobby` icons render standalone.
 */
export const SECTION_ICONS = {
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2.2-7 5v1h14v-1c0-2.8-3.1-5-7-5Z',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z',
  briefcase:
    'M9 4h6a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h3V6a2 2 0 0 1 2-2Zm0 3h6V6H9v1Z',
  star: 'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z',
  flask: 'M10 3h4v2h-1v4.2l4.8 8.3A1.5 1.5 0 0 1 16.5 20h-9a1.5 1.5 0 0 1-1.3-2.5L11 9.2V5h-1V3Z',
  graduation: 'M12 4l10 5-10 5L2 9l10-5Zm-6 8.2 6 3 6-3V17c0 1.7-2.7 3-6 3s-6-1.3-6-3v-4.8Z',
  code: 'M8.5 7.5 4 12l4.5 4.5 1.4-1.4L6.8 12l3.1-3.1L8.5 7.5Zm7 0-1.4 1.4L17.2 12l-3.1 3.1 1.4 1.4L20 12l-4.5-4.5Z',
  mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-6 8h2a4 4 0 0 0 8 0h2a6 6 0 0 1-5 5.9V20h-2v-3.1A6 6 0 0 1 6 11Z',
  leaf: 'M20 4c0 8-4.5 12-10 12a5 5 0 0 1-1.6-.3C10 12 13 10 16 9c-3.4.3-6.6 2-8.7 5.3A6 6 0 0 1 14 4h6ZM5 20c0-2.2.6-4.2 1.6-5.9l1.7 1A9.6 9.6 0 0 0 7 20H5Z',
}

export const HOBBY_ICONS = {
  hiking:
    'M14 4.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM11 9l-2.6 1.6-1.6 4 1.9.7 1.2-3L12 11.4V15l-3 6h2.2l2.6-5 2.7 5H19l-3.3-6.6V9.8l2.6 1.5 1-1.7L15 7h-2l-2 2Zm9-4h1v16h-1V5Z',
  book: 'M4 4h16v14H4V4Zm2 2v10h3V6H6Zm5 0v10h3V6h-3Zm5 0v10h2V6h-2ZM4 19h16v1H4v-1Z',
  laptop: 'M5 5h14v10H5V5Zm2 2v6h10V7H7ZM3 17h18v2H3v-2Z',
  ball: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.2 3.6 2.6-1.4 4.3H9.8L8.4 7.8 12 5.2Zm-7.6 5.4 2.6 1.9 1.4 4.3-2 1.4A8 8 0 0 1 4.4 10.6Zm15.2 0a8 8 0 0 1-2 7.6l-2-1.4 1.4-4.3 2.6-1.9Z',
  music: 'M9 18a3 3 0 1 1-2-2.8V5l12-2v11.2a3 3 0 1 1-2-2.8V7.4L9 8.8V18Z',
  camera:
    'M9 4h6l1.5 2H20a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3.5L9 4Zm3 5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z',
  travel: 'M2 16l9-3.5V6a1.5 1.5 0 0 1 3 0v6.5L23 16v2l-9-2v3.5l2 1.5v1.5l-3.5-1-3.5 1V21l2-1.5V16l-9 2v-2Z',
  bike: 'M6 20a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm12 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM9 6h4l3 6h-6L8 8l-2 4H4l3-6h2Z',
}

export const HOBBY_ICON_NAMES = Object.keys(HOBBY_ICONS)
export const SECTION_ICON_NAMES = Object.keys(SECTION_ICONS)

export function sectionIcon(name) {
  return SECTION_ICONS[name] ?? SECTION_ICONS.star
}

export function hobbyIcon(name) {
  return HOBBY_ICONS[name] ?? HOBBY_ICONS.ball
}
