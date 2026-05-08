import build from '@hono/vite-build/vercel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [build()],
})
