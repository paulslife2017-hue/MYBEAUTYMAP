import { handle } from '@hono/node-server/vercel'
import app from '../dist/vercel/index.js'

export const config = { maxDuration: 60 }
export default handle(app)
