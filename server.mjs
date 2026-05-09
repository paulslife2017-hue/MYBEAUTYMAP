import { serve } from '@hono/node-server'
import app from './src/index.tsx'

serve({ fetch: app.fetch, port: 3000, hostname: '0.0.0.0' }, () => {
  console.log('✅ MyBeautyMap running on http://0.0.0.0:3000')
})
