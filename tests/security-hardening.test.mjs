import assert from 'node:assert/strict'
import test from 'node:test'

import {
  isTwitterDisplayMediaUrl,
  isTwitterInternalUrl,
} from '../functions/x2vertical/fetchTweet.mjs'
import { validateTwitterVideoUrl } from '../functions/x2vertical/proxyTweetVideo.mjs'

test('Twitter internal URL detection requires an exact trusted host', () => {
  assert.equal(isTwitterInternalUrl('https://twitter.com/i/status/123'), true)
  assert.equal(isTwitterInternalUrl('https://x.com/i/status/123'), true)
  assert.equal(isTwitterInternalUrl('https://twitter.com.evil.example/i/status/123'), false)
  assert.equal(isTwitterInternalUrl('https://evil.example/?next=https://x.com/i/status/123'), false)
  assert.equal(isTwitterInternalUrl('javascript:https://x.com/i/status/123'), false)
})

test('Twitter display media detection rejects lookalike hosts', () => {
  assert.equal(isTwitterDisplayMediaUrl('pic.twitter.com/abc123'), true)
  assert.equal(isTwitterDisplayMediaUrl('pic.twitter.com.evil.example/abc123'), false)
  assert.equal(isTwitterDisplayMediaUrl('evil.example/pic.twitter.com/abc123'), false)
})

test('tweet video proxy accepts only the exact Twitter CDN over HTTPS', () => {
  assert.equal(
    validateTwitterVideoUrl('https://video.twimg.com/ext_tw_video/123/pu/vid/720x720/video.mp4?tag=12'),
    'https://video.twimg.com/ext_tw_video/123/pu/vid/720x720/video.mp4?tag=12',
  )
  assert.equal(validateTwitterVideoUrl('https://video.twimg.com.evil.example/video.mp4'), null)
  assert.equal(validateTwitterVideoUrl('http://video.twimg.com/video.mp4'), null)
  assert.equal(validateTwitterVideoUrl('https://user:pass@video.twimg.com/video.mp4'), null)
  assert.equal(validateTwitterVideoUrl('https://video.twimg.com:444/video.mp4'), null)
})
