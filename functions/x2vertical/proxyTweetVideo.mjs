import { onRequest } from 'firebase-functions/v2/https'
import { Readable } from 'stream'
import { db } from '../config/firebase.mjs'

// ── Cloud Function ────────────────────────────────────────────────────────────

export const proxyTweetVideo = onRequest(
    {
        region: 'australia-southeast1',
        timeoutSeconds: 120,
        memory: '256MiB',
        maxInstances: 5,
        // cors: false — we handle it manually so Range/expose headers work correctly
    },
    async (req, res) => {

        // ── CORS ──────────────────────────────────────────────────────────────
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Range')
        res.set('Access-Control-Expose-Headers', 'Accept-Ranges, Content-Length, Content-Range, Content-Type')

        if (req.method === 'OPTIONS') return res.status(204).send('')
        if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

        // ── Validate input ────────────────────────────────────────────────────
        const { tweetId } = req.query
        if (!tweetId || typeof tweetId !== 'string') {
            return res.status(400).json({ error: 'Missing required query param: tweetId' })
        }

        // ── Look up video URL from Firestore cache ────────────────────────────
        const doc = await db.collection('x2vertical').doc(tweetId).get()
        if (!doc.exists) {
            return res.status(404).json({ error: 'Tweet not cached — call fetchTweet first' })
        }

        const tweet = doc.data()?.tweet
        const videoUrl = tweet?.media?.[0]?.url

        if (!videoUrl || !videoUrl.startsWith('https://video.twimg.com')) {
            return res.status(404).json({ error: 'No proxiable video URL found for this tweet' })
        }

        // ── Forward request to Twitter CDN ────────────────────────────────────
        const upstreamHeaders = {
            // Mimic a browser enough that Twitter's CDN doesn't reject us
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://twitter.com/',
            'Origin': 'https://twitter.com',
        }

        // Forward Range header so video seeking works in the browser
        const range = req.headers['range']
        if (range) upstreamHeaders['Range'] = range

        let upstream
        try {
            upstream = await fetch(videoUrl, { headers: upstreamHeaders })
        } catch (err) {
            console.error('Upstream fetch failed:', err.message)
            return res.status(502).json({ error: 'Could not reach Twitter CDN' })
        }

        // 206 Partial Content is expected when a Range header was sent
        if (!upstream.ok && upstream.status !== 206) {
            console.error(`CDN ${upstream.status} for ${videoUrl}`)
            return res.status(502).json({ error: `CDN returned ${upstream.status}` })
        }

        // ── Forward response headers ──────────────────────────────────────────
        res.status(upstream.status)

        for (const header of ['content-type', 'content-length', 'content-range', 'cache-control']) {
            const val = upstream.headers.get(header)
            if (val) res.set(header, val)
        }
        // Always declare range support so the browser's video element can seek
        res.set('Accept-Ranges', 'bytes')

        // ── Stream body ───────────────────────────────────────────────────────
        try {
            const readable = Readable.fromWeb(upstream.body)
            readable.pipe(res)
            await new Promise((resolve, reject) => {
                readable.on('end', resolve)
                readable.on('error', reject)
            })
        } catch (err) {
            console.error('Stream interrupted:', err.message)
            // Client probably closed the connection — not a real error
            res.end()
        }
    }
)
