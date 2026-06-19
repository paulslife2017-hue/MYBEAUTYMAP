// Vercel 서버리스 함수 — Cloudinary 업로드 서명 발급
// ESM (package.json "type": "module")
import { createHash } from 'crypto'

export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.status(200).end(); return }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey    = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: 'Cloudinary env not set',
        cloud: !!cloudName, key: !!apiKey, secret: !!apiSecret
      })
    }

    // body 파싱
    let body = {}
    if (req.body) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    } else {
      await new Promise((resolve) => {
        let raw = ''
        req.on('data', chunk => raw += chunk)
        req.on('end', () => { try { body = JSON.parse(raw) } catch(_) {}; resolve() })
      })
    }

    const folder    = body.folder || 'mybeautymap/shorts'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = createHash('sha1').update(paramsToSign).digest('hex')

    res.status(200).json({ ok: true, cloudName, apiKey, timestamp, signature, folder })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
