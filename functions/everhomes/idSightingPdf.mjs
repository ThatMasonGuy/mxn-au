import { fileURLToPath } from 'node:url'

let logoPromise
export async function generateIdSightingPdf(record) {
  // Functions share an entrypoint; load PDF dependencies only for PDF requests.
  const [{ default: PDFDocument }, { default: sharp }] = await Promise.all([import('pdfkit'), import('sharp')])
  logoPromise ??= (async () => {
    const source = fileURLToPath(new URL('../assets/everhomes-logo.png', import.meta.url))
    const { width, height } = await sharp(source).metadata()
    // Remove the supplied image's outer frame before trimming its white margin.
    const inset = Math.round(Math.min(width, height) * 0.04)
    const interior = await sharp(source).extract({ left: inset, top: inset, width: width - inset * 2, height: height - inset * 2 }).png().toBuffer()
    return sharp(interior).trim({ background: '#ffffff', threshold: 20 })
      .resize({ width: 600, withoutEnlargement: true }).png().toBuffer()
  })()
  const logo = await logoPromise
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true, info: { Title: 'Everhomes ID sighting record', Author: 'Everhomes Pty Ltd' } })
    const chunks = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    const left = 48, width = doc.page.width - left * 2, right = left + width
    const ink = '#1B2D3D', teal = '#087F78', muted = '#526575', line = '#D9E3E8', pale = '#F2F6F8'
    const text = (value, x, y, size = 11, color = ink, bold = false, options = {}) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor(color)
        .text(value, x, y, { width, lineGap: 3, characterSpacing: 0, ...options })
    }
    const measure = (value, size, fieldWidth, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size)
      return doc.heightOfString(value, { width: fieldWidth, lineGap: 3 })
    }
    const rule = (y) => doc.moveTo(left, y).lineTo(right, y).lineWidth(0.7).strokeColor(line).stroke()
    const panel = (y, height) => doc.roundedRect(left, y, width, height, 6).fill(pale)
    const heading = (number, title, y) => {
      text(number, left, y + 1, 9, teal, true, { width: 22 })
      text(title, left + 25, y, 11, ink, true, { width: width - 25 })
    }
    const header = (continued = false) => {
      doc.rect(left, 0, 48, 5).fill(teal)
      doc.image(logo, right - 108, 39, { fit: [108, 77], align: 'right', valign: 'center' })
      text('RTA FORMS 22b & R22b', left, 45, 9, teal, true, { width: 330, characterSpacing: 0.8 })
      text('ID sighting record', left, 67, 27, ink, true, { width: 370 })
      text(continued ? 'Record continued' : 'Identity documents sighted by an Everhomes staff member.', left, 109, 10, muted, false, { width: 325 })
      rule(137)
    }
    header()
    let y = 157
    const reserve = (height) => {
      if (y + height <= 745) return
      doc.addPage()
      header(true)
      y = 157
    }
    const date = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${record.sightedDate}T00:00:00Z`))
    const nameWidth = width - 180
    const nameSize = record.applicantName.length > 90 ? 11.5 : 14
    const personHeight = Math.max(74, measure(record.applicantName, nameSize, nameWidth, true) + 44)
    heading('01', 'Person & date', y)
    y += 25
    panel(y, personHeight)
    text('Person whose ID was sighted', left + 16, y + 14, 9, muted, false, { width: nameWidth })
    text(record.applicantName, left + 16, y + 33, nameSize, ink, true, { width: nameWidth })
    doc.moveTo(right - 146, y + 16).lineTo(right - 146, y + personHeight - 16).strokeColor(line).stroke()
    text('Date sighted', right - 130, y + 14, 9, muted, false, { width: 114 })
    text(date, right - 130, y + 34, 11, ink, true, { width: 114 })
    y += personHeight + 16
    const documentWidth = width - 164
    const rows = record.documents.map((item, index) => {
      const label = item.type === 'Other' ? `Other: ${item.description}` : item.type
      return { label, index, height: Math.max(52, measure(label, 11, documentWidth, true) + 28) }
    })
    reserve(50 + rows.reduce((total, row) => total + row.height, 0))
    heading('02', 'Identity documents', y)
    y += 25
    doc.roundedRect(left, y, width, 25, 4).fill(pale)
    text('FORM OF ID', left + 16, y + 8, 8, muted, true, { width: documentWidth, characterSpacing: 0.5 })
    text('CONFIRMATION', right - 112, y + 8, 8, muted, true, { width: 100, characterSpacing: 0.5 })
    y += 25
    for (const row of rows) {
      text(String(row.index + 1).padStart(2, '0'), left + 16, y + 18, 9, muted, false, { width: 22 })
      text(row.label, left + 46, y + 16, 11, ink, true, { width: documentWidth })
      doc.roundedRect(right - 112, y + 13, 96, 25, 4).fill('#E5F3EF')
      doc.moveTo(right - 101, y + 25).lineTo(right - 98, y + 28).lineTo(right - 92, y + 21).lineWidth(1.3).strokeColor(teal).stroke()
      text('Sighted', right - 84, y + 20, 10, '#16685F', true, { width: 63 })
      y += row.height
      rule(y)
    }
    y += 16
    const staffSize = record.staffName.length > 90 ? 11 : 12
    const staffNameHeight = measure(record.staffName, staffSize, width - 32, true)
    const emailHeight = measure(record.staffEmail, 10.5, width - 32)
    const staffHeight = 60 + staffNameHeight + emailHeight
    const confirmation = 'Each document listed above was confirmed as sighted by the staff member named in this record. No copies of identity documents are included.'
    const support = 'Supporting record for RTA Form 22b or Form R22b. This document does not replace either application form.'
    const confirmationHeight = measure(confirmation, 9, width) + measure(support, 8.5, width) + 14
    // Keep the staff details and their confirmation together on long records.
    reserve(25 + staffHeight + 14 + confirmationHeight)
    heading('03', 'Sighted by', y)
    y += 25
    panel(y, staffHeight)
    text('Everhomes staff member', left + 16, y + 14, 9, muted)
    text(record.staffName, left + 16, y + 32, staffSize, ink, true, { width: width - 32 })
    const emailY = y + 32 + staffNameHeight + 8
    text('Everhomes staff member email', left + 16, emailY, 9, muted)
    text(record.staffEmail, left + 16, emailY + 15, 10.5, ink, false, { width: width - 32 })
    y += staffHeight + 14
    reserve(confirmationHeight)
    text(confirmation, left, y, 9, muted)
    text(support, left, y + measure(confirmation, 9, width) + 10, 8.5, muted)
    const pages = doc.bufferedPageRange()
    for (let index = pages.start; index < pages.start + pages.count; index++) {
      doc.switchToPage(index)
      const footerY = doc.page.height - 76
      rule(footerY - 13)
      text('EVERHOMES PTY LTD', left, footerY, 7.5, ink, true, { width: 200, characterSpacing: 0.5 })
      text(`Record reference: ${record.id}`, left, footerY + 14, 7.5, muted, false, { width: width - 55 })
      text(`${index + 1} / ${pages.count}`, right - 40, footerY + 14, 8, muted, false, { width: 40, align: 'right' })
    }
    doc.end()
  })
}
