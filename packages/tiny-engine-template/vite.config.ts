import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  define: {
    process: {
      env: {
        TINY_MODE: 'pc',
      },
    },
  },
  plugins: [vue()],
})
