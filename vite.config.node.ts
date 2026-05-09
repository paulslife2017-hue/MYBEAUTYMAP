import build from '@hono/vite-build/node'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [build({ port: 3000 })],
})
