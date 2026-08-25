import assert from 'node:assert/strict'
import { Readable, Writable } from 'node:stream'
import test from 'node:test'

import { writeReportZip } from '../functions/everhomes/reportZip.mjs'
import {
  MAX_REPORT_PHOTO_BYTES,
  evaluateReportPhotoSize,
} from '../src/features/everhomes/utils/reportPhotoPolicy.js'

test('report uploads allow aggregate photo sets larger than 300 MB', () => {
  const threeMegabytes = 3 * 1024 * 1024
  const existingPhotos = Array.from({ length: 149 }, () => threeMegabytes)

  const result = evaluateReportPhotoSize(threeMegabytes, existingPhotos)

  assert.equal(result.allowed, true)
  assert.equal(result.aggregateBytes, 450 * 1024 * 1024)
  assert.equal(evaluateReportPhotoSize(MAX_REPORT_PHOTO_BYTES).allowed, false)
})

test('streamed report ZIP includes 150 originals without a complete archive buffer input', async () => {
  let activeSourceStreams = 0
  let maxActiveSourceStreams = 0
  const zipAssets = Array.from({ length: 150 }, (_, index) => ({
    filename: `room_${index + 1}.jpg`,
    contents: Buffer.from(`photo-${index + 1}`),
  }))
  const marketingAssets = [{
    filename: 'hero_1.jpg',
    contents: Buffer.from('marketing-photo'),
  }]
  const chunks = []
  const destination = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(Buffer.from(chunk))
      callback()
    },
  })

  const result = await writeReportZip({
    zipAssets,
    marketingAssets,
    propertyAddress: '1 Example Street',
    inspectionDate: '2026-08-25',
    openAssetStream: async (asset) => {
      activeSourceStreams += 1
      maxActiveSourceStreams = Math.max(maxActiveSourceStreams, activeSourceStreams)
      let started = false
      const source = new Readable({
        read() {
          if (started) return
          started = true
          setImmediate(() => {
            this.push(asset.contents)
            this.push(null)
          })
        },
      })
      source.once('end', () => {
        activeSourceStreams -= 1
      })
      return source
    },
    destination,
  })
  const archive = Buffer.concat(chunks)
  const expectedSourceBytes = [...zipAssets, ...marketingAssets]
    .reduce((sum, asset) => sum + asset.contents.length, 0)

  assert.equal(result.sourceBytes, expectedSourceBytes)
  assert.equal(result.zipBytes, archive.length)
  assert.equal(maxActiveSourceStreams, 1)
  assert.equal(archive.subarray(0, 2).toString('ascii'), 'PK')
  assert.match(archive.toString('latin1'), /1_Example_Street_2026-08-25_Photos\/room_150\.jpg/)
  assert.match(archive.toString('latin1'), /1_Example_Street_2026-08-25_Photos\/marketing\/hero_1\.jpg/)
})

test('streamed report ZIP aborts its active source when sibling artifact work fails', async () => {
  const controller = new AbortController()
  let openedStreams = 0
  let activeSourceClosed = false
  const destination = new Writable({
    write(_chunk, _encoding, callback) {
      callback()
    },
  })

  const archiveWork = writeReportZip({
    zipAssets: [
      { filename: 'room_1.jpg' },
      { filename: 'room_2.jpg' },
    ],
    propertyAddress: '1 Example Street',
    inspectionDate: '2026-08-25',
    openAssetStream: async () => {
      openedStreams += 1
      const source = new Readable({ read() {} })
      source.once('close', () => {
        activeSourceClosed = true
      })
      return source
    },
    destination,
    signal: controller.signal,
  })

  setImmediate(() => controller.abort(new Error('PDF generation failed')))

  await assert.rejects(archiveWork, /PDF generation failed/)
  assert.equal(openedStreams, 1)
  assert.equal(activeSourceClosed, true)
})
