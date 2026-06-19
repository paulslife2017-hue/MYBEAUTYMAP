import { handle } from '@hono/node-server/vercel'
import app from '../src/index'

export const config = { maxDuration: 60 }
export default handle(app)
