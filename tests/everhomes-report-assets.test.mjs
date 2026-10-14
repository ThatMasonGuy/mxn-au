import assert from 'node:assert/strict'
import test from 'node:test'

import { downloadMarketingPhotos } from '../functions/everhomes/reportAssetDownloads.mjs'
import { safeArchiveKey } from '../functions/everhomes/reportArtifacts.mjs'

test('marketing photos download in bounded batches and preserve archive metadata order', async () => {
  const entries = Array.from({ length: 9 }, (_, i) => ({
    slotKey: i % 2 ? 'exterior' : 'living',
    i,
    mp: { storagePath: `handovers/report/marketing/${i}.jpg`, url: `https://example.invalid/${i}` },
  }))
  const pending = new Map()
  const started = []
  let downloadedBytes = 0
  const work = downloadMarketingPhotos(entries, {
    concurrency: 3,
    loadAsset: (asset) => new Promise((resolve) => {
      started.push(asset.storagePath)
      pending.set(asset.storagePath, resolve)
    }),
    trackImageBytes: (buffer) => { downloadedBytes += buffer.length },
    originalImageExtension: () => 'jpg',
  })

  assert.deepEqual(started, entries.slice(0, 3).map(({ mp }) => mp.storagePath))
  for (let batch = 0; batch < 3; batch += 1) {
    // Finish each batch in reverse order to exercise result ordering.
    const active = [...pending.entries()].reverse()
    pending.clear()
    for (const [, resolve] of active) resolve(Buffer.from('photo'))
    // Advance promises without timers or network access.
    await new Promise(setImmediate)
    assert.equal(started.length, Math.min((batch + 2) * 3, entries.length))
    assert.equal(pending.size, batch === 2 ? 0 : 3)
  }

  assert.deepEqual(await work, entries.map(({ slotKey, mp, i }) => ({
    status: 'fulfilled',
    value: {
      filename: `${safeArchiveKey(slotKey, 'marketing')}_${i + 1}.jpg`,
      slotKey,
      storagePath: mp.storagePath,
      url: mp.url,
    },
  })))
  assert.equal(downloadedBytes, 9 * Buffer.byteLength('photo'))
})

test('marketing download failures remain associated with their photo while other downloads finish', async () => {
  const error = new Error('Storage object not found')
  const requested = []
  let downloadedBytes = 0
  const results = await downloadMarketingPhotos([
    { slotKey: 'exterior', i: 0, mp: { storagePath: 'missing.jpg' } },
    { slotKey: 'living', i: 0, mp: { storagePath: 'saved.jpg' } },
    { slotKey: 'empty', i: 0, mp: {} },
  ], {
    loadAsset: async (asset) => {
      requested.push(asset.storagePath)
      if (asset.storagePath === 'missing.jpg') throw error
      return Buffer.from('saved')
    },
    trackImageBytes: (buffer) => { downloadedBytes += buffer.length },
    originalImageExtension: () => 'jpg',
  })

  assert.deepEqual(requested, ['missing.jpg', 'saved.jpg'])
  assert.deepEqual(results[0], { status: 'rejected', reason: error })
  assert.equal(results[1].status, 'fulfilled')
  assert.equal(results[1].value.storagePath, 'saved.jpg')
  assert.deepEqual(results[2], { status: 'fulfilled', value: null })
  assert.equal(downloadedBytes, Buffer.byteLength('saved'))
})

test('reports without marketing photos require no marketing downloads', async () => {
  const unexpected = () => { throw new Error('No download expected') }
  assert.deepEqual(await downloadMarketingPhotos([], {
    loadAsset: unexpected,
    trackImageBytes: unexpected,
    originalImageExtension: unexpected,
  }), [])
})
