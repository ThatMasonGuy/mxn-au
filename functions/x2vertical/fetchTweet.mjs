import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { db } from '../config/firebase.mjs'
import { FieldValue } from 'firebase-admin/firestore'

const X_BEARER_TOKEN = defineSecret('X_BEARER_TOKEN')

// ── Constants ─────────────────────────────────────────────────────────────────

const CACHE_COLLECTION = 'x2vertical'

const X_API_BASE = 'https://api.twitter.com/2/tweets'

const TWEET_FIELDS = [
    'attachments',
    'author_id',
    'created_at',
    'public_metrics',
    'referenced_tweets',
    'entities',
].join(',')

const EXPANSIONS = [
    'author_id',
    'attachments.media_keys',
    'referenced_tweets.id',
    'referenced_tweets.id.author_id',
].join(',')

const USER_FIELDS = [
    'id',
    'name',
    'username',
    'profile_image_url',
    'verified',
].join(',')

const MEDIA_FIELDS = [
    'type',
    'url',
    'preview_image_url',
    'variants',
    'duration_ms',
    'alt_text',
].join(',')

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Extract the numeric tweet ID from any x.com / twitter.com status URL.
 * Returns null if the URL doesn't match.
 */
function extractTweetId(input) {
    const match = input.match(/\/status\/(\d+)/)
    return match ? match[1] : null
}

/**
 * Pull the best-quality video/GIF URL from a variants array.
 * Picks the highest bit_rate mp4 variant.
 */
function bestVideoUrl(variants = []) {
    const mp4s = variants.filter(v => v.content_type === 'video/mp4')
    if (!mp4s.length) return variants[0]?.url ?? null
    return mp4s.sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0))[0].url
}

/**
 * Normalise a raw X API media object into a clean shape.
 */
function normaliseMedia(raw) {
    if (!raw) return null
    const base = {
        type: raw.type,           // 'photo' | 'video' | 'animated_gif'
        previewUrl: raw.preview_image_url ?? raw.url ?? null,
        altText: raw.alt_text ?? null,
        durationMs: raw.duration_ms ?? null,
    }
    if (raw.type === 'photo') {
        return { ...base, url: raw.url }
    }
    // video / animated_gif — pick best variant
    return {
        ...base,
        url: bestVideoUrl(raw.variants),
        variants: (raw.variants ?? []).map(v => ({
            url: v.url,
            contentType: v.content_type,
            bitRate: v.bit_rate ?? null,
        })),
    }
}

/**
 * Normalise a raw X API user object into a clean shape.
 * Upgrades the profile image from _normal (48px) to _400x400.
 */
function normaliseUser(raw) {
    if (!raw) return null
    return {
        id: raw.id,
        displayName: raw.name,
        handle: raw.username,
        avatarUrl: (raw.profile_image_url ?? '').replace('_normal', '_400x400'),
        verified: raw.verified ?? false,
    }
}

/**
 * Normalise a tweet data object + the shared includes bag into a clean shape.
 * Handles the quoted tweet recursively (one level deep).
 */
function normaliseTweet(tweetData, includes, isQuote = false) {
    if (!tweetData) return null

    // Resolve author
    const author = normaliseUser(
        (includes.users ?? []).find(u => u.id === tweetData.author_id)
    )

    // Resolve media
    const mediaKeys = tweetData.attachments?.media_keys ?? []
    const media = mediaKeys
        .map(key => (includes.media ?? []).find(m => m.media_key === key))
        .filter(Boolean)
        .map(normaliseMedia)

    // Resolve quoted tweet (one level deep only — no infinite recursion)
    let quotedTweet = null
    if (!isQuote) {
        const quotedRef = (tweetData.referenced_tweets ?? []).find(r => r.type === 'quoted')
        if (quotedRef) {
            const quotedRaw = (includes.tweets ?? []).find(t => t.id === quotedRef.id)
            quotedTweet = normaliseTweet(quotedRaw, includes, true)
        }
    }

    return {
        id: tweetData.id,
        text: tweetData.text,
        createdAt: tweetData.created_at ?? null,
        author,
        media,
        metrics: {
            likes: tweetData.public_metrics?.like_count ?? 0,
            retweets: tweetData.public_metrics?.retweet_count ?? 0,
            replies: tweetData.public_metrics?.reply_count ?? 0,
            quotes: tweetData.public_metrics?.quote_count ?? 0,
            views: tweetData.public_metrics?.impression_count ?? 0,
        },
        quotedTweet,
    }
}

/**
 * Fetch a tweet from the X API and return the raw JSON response.
 */
async function fetchFromXApi(tweetId, bearerToken) {
    const params = new URLSearchParams({
        'tweet.fields': TWEET_FIELDS,
        'expansions': EXPANSIONS,
        'user.fields': USER_FIELDS,
        'media.fields': MEDIA_FIELDS,
    })

    const res = await fetch(`${X_API_BASE}/${tweetId}?${params}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
    })

    if (!res.ok) {
        const body = await res.text()
        throw Object.assign(new Error(`X API error ${res.status}`), {
            status: res.status,
            body,
        })
    }

    return res.json()
}

// ── Cloud Function ────────────────────────────────────────────────────────────

export const fetchTweet = onRequest(
    {
        region: 'australia-southeast1',
        timeoutSeconds: 30,
        memory: '256MiB',
        maxInstances: 10,
        cors: true,
        secrets: [X_BEARER_TOKEN],
    },
    async (req, res) => {
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') return res.status(204).send('')
        if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

        // ── Parse & validate input ────────────────────────────────────────────
        const { url } = req.body ?? {}
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'Missing required field: url' })
        }

        const tweetId = extractTweetId(url)
        if (!tweetId) {
            return res.status(400).json({ error: 'Could not extract a tweet ID from the provided URL' })
        }

        // ── Cache check ───────────────────────────────────────────────────────
        const cacheRef = db.collection(CACHE_COLLECTION).doc(tweetId)
        const cached = await cacheRef.get()

        if (cached.exists) {
            console.log(`Cache hit: ${tweetId}`)
            return res.status(200).json({ source: 'cache', tweet: cached.data().tweet })
        }

        // ── X API fetch ───────────────────────────────────────────────────────
        console.log(`Cache miss — fetching from X API: ${tweetId}`)
        let raw
        try {
            raw = await fetchFromXApi(tweetId, X_BEARER_TOKEN.value())
        } catch (err) {
            console.error('X API fetch failed:', err.message, err.body ?? '')

            // Surface X API 404s as clean 404s to the caller
            if (err.status === 404) {
                return res.status(404).json({ error: 'Tweet not found or has been deleted' })
            }
            // X API auth error
            if (err.status === 401 || err.status === 403) {
                return res.status(502).json({ error: 'X API authentication failed' })
            }
            // Rate limit
            if (err.status === 429) {
                return res.status(429).json({ error: 'X API rate limit reached — try again shortly' })
            }

            return res.status(502).json({ error: 'Failed to fetch tweet from X API' })
        }

        if (!raw.data) {
            return res.status(404).json({ error: 'Tweet not found' })
        }

        // ── Normalise ─────────────────────────────────────────────────────────
        const tweet = normaliseTweet(raw.data, raw.includes ?? {})

        // ── Write to cache ────────────────────────────────────────────────────
        await cacheRef.set({
            tweet,
            tweetId,
            cachedAt: FieldValue.serverTimestamp(),
            // Keep the raw response too — useful for debugging / future fields
            raw,
        })

        console.log(`Cached tweet ${tweetId} by @${tweet.author?.handle}`)

        return res.status(200).json({ source: 'api', tweet })
    }
)
