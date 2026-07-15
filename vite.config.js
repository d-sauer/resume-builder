import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * No public dir: resume.json is an export format now, not a file the app reads.
 * The starting document is bundled from src/seed/, and the working copy lives in
 * the page (autosaved to localStorage), so there is nothing on disk to watch.
 */
export default defineConfig({
  plugins: [vue()],
  publicDir: false,
})
