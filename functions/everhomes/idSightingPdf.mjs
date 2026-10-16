import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

let logoPromise
export async function generateIdSightingPdf(record) {
  logoPromise ??= sharp(fileURLToPath(new URL('../assets/everhomes-logo.png', import.meta.url))).trim().png().toBuffer()
  const logo = await logoPromise
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true, info: { Title: 'Everhomes ID sighting record', Author: 'Everhomes Pty Ltd' } })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    const width = doc.page.width - 96
    const ink = '#18333A', teal = '#087F82', muted = '#52656B'
    doc.rect(0, 0, doc.page.width, 9).fill(teal)
    doc.image(logo, 48, 34, { fit: [155, 65] })
    doc.font('Helvetica-Bold').fontSize(9).fillColor(teal).text('RENTAL APPLICATION SUPPORT', 300, 53, { width: 247, align: 'right' })
    doc.font('Helvetica').fontSize(9).fillColor(muted).text('RTA Forms 22b & R22b', 300, 70, { width: 247, align: 'right' })
    doc.font('Helvetica-Bold').fontSize(27).fillColor(ink).text('ID sighting record', 48, 127)
    doc.font('Helvetica').fontSize(10).fillColor(muted).text('A record of identity documents sighted by an Everhomes staff member.', 48, 167, { width, lineGap: 4 })
    let y = 200
    const section = (label) => {
      doc.rect(48, y, width, 26).fill('#EAF5F3')
      doc.font('Helvetica-Bold').fontSize(10).fillColor(teal).text(label, 60, y + 8)
      y += 38
    }
    const field = (label, value) => {
      doc.font('Helvetica').fontSize(9).fillColor(muted).text(label, 48, y, { width })
      y += 16
      doc.font('Helvetica-Bold').fontSize(12).fillColor(ink)
      const height = doc.heightOfString(value, { width, lineGap: 3 })
      doc.text(value, 48, y, { width, lineGap: 3 })
      y += height + 14
    }
    section('01  PERSON & DATE')
    field('Person whose ID was sighted', record.applicantName)
    const date = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${record.sightedDate}T00:00:00Z`))
    field('Date sighted', date)
    section('02  ID DOCUMENTS')
    record.documents.forEach((item, index) => {
      const label = item.type === 'Other' ? `Other: ${item.description}` : item.type
      doc.font('Helvetica-Bold').fontSize(11).fillColor(ink)
      const height = Math.max(28, doc.heightOfString(`${index + 1}. ${label}`, { width: width - 112 }) + 12)
      doc.text(`${index + 1}. ${label}`, 48, y + 3, { width: width - 112 })
      doc.rect(448, y + 1, 11, 11).lineWidth(1).strokeColor(teal).stroke()
      doc.moveTo(450, y + 6).lineTo(453, y + 9).lineTo(458, y + 3).stroke()
      doc.font('Helvetica-Bold').fontSize(10).fillColor(teal).text('Sighted', 467, y + 2, { width: 80 })
      y += height + 10
    })
    y += 6
    section('03  SIGHTED BY')
    field('Everhomes staff member', record.staffName)
    field('Everhomes staff member email', record.staffEmail)
    // Long names and email addresses retain full content on a continuation page.
    if (y > 680) {
      doc.addPage()
      doc.rect(0, 0, doc.page.width, 9).fill(teal)
      doc.font('Helvetica-Bold').fontSize(16).fillColor(ink).text('ID sighting record', 48, 48)
      doc.font('Helvetica').fontSize(9).fillColor(muted).text('Everhomes | Confirmation continued', 48, 74)
      y = 105
    }
    doc.moveTo(48, y + 3).lineTo(547, y + 3).strokeColor('#D8E4E2').stroke()
    doc.font('Helvetica').fontSize(9).fillColor(muted).text('Each document listed above was confirmed as sighted by the staff member named in this record. No copies of identity documents are included.', 48, y + 18, { width, lineGap: 4 })
    doc.fontSize(8).text('Supporting record for RTA Form 22b or Form R22b. This document does not replace either application form.', 48, y + 62, { width, lineGap: 3 })
    const pages = doc.bufferedPageRange()
    for (let index = pages.start; index < pages.start + pages.count; index++) {
      doc.switchToPage(index)
      doc.font('Helvetica').fontSize(7).fillColor(muted).text(`Everhomes | Record reference: ${record.id}`, 48, doc.page.height - 61, { width: width - 50 })
      doc.text(`${index + 1} / ${pages.count}`, 497, doc.page.height - 61, { width: 50, align: 'right' })
    }
    doc.end()
  })
}
