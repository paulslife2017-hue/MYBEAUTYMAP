import { handle } from '@hono/node-server/vercel'
import app from '../src/index'

export default handle(app)
export const config = { maxDuration: 60 }
