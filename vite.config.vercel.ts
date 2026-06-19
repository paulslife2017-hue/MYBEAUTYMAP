import { defineConfig } from 'vite'

// Vercel용 빌드: app만 export (서버 시작 코드 없음)
export default defineConfig({
  build: {
    ssr: true,
    outDir: 'dist/vercel',
    rollupOptions: {
      input: 'src/index.tsx',
      output: {
        format: 'esm',
        entryFileNames: 'index.js',
      },
      external: [
        'node:fs', 'node:path', 'node:http', 'node:https',
        'node:stream', 'node:crypto', 'node:os', 'node:util',
        'fs', 'path', 'http', 'https', 'stream', 'crypto', 'os', 'util',
        'pg', 'pg-native',
      ]
    }
  }
})
