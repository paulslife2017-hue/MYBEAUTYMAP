import app from '../src/index'
import { createHash } from 'crypto'

export const config = { maxDuration: 60 }

export default async function handler(req: any, res: any) {
  const url = `http://${req.headers.host || 'localhost'}${req.url}`
  const method = req.method || 'GET'

  const chunks: Buffer[] = []
  await new Promise<void>((resolve) => {
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', resolve)
  })
  const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined

  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers as Record<string, any>)) {
    if (typeof v === 'string') headers.set(k, v)
    else if (Array.isArray(v)) v.forEach((val: string) => headers.append(k, val))
  }

  const fetchReq = new Request(url, {
    method,
    headers,
    body: body && body.length > 0 ? body : undefined,
  })

  const fetchRes = await app.fetch(fetchReq)

  res.statusCode = fetchRes.status
  fetchRes.headers.forEach((v: string, k: string) => res.setHeader(k, v))
  const resBody = await fetchRes.arrayBuffer()
  res.end(Buffer.from(resBody))
}
