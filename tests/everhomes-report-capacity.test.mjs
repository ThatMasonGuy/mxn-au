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
    openAssetStream: async (asset) => Readable.from(asset.contents),
    destination,
  })
  const archive = Buffer.concat(chunks)
  const expectedSourceBytes = [...zipAssets, ...marketingAssets]
    .reduce((sum, asset) => sum + asset.contents.length, 0)

  assert.equal(result.sourceBytes, expectedSourceBytes)
  assert.equal(result.zipBytes, archive.length)
  assert.equal(archive.subarray(0, 2).toString('ascii'), 'PK')
  assert.match(archive.toString('latin1'), /1_Example_Street_2026-08-25_Photos\/room_150\.jpg/)
  assert.match(archive.toString('latin1'), /1_Example_Street_2026-08-25_Photos\/marketing\/hero_1\.jpg/)
})
