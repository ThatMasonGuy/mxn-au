const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])

export function renderIdSightingEmail(record) {
  const dateLabel = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${record.sightedDate}T00:00:00Z`))
  const documents = record.documents.map((item) => item.type === 'Other' ? `Other: ${item.description}` : item.type)
  const support = 'This supporting record can accompany RTA Form 22b or Form R22b and does not replace either application form.'
  const text = [
    'EVERHOMES TOOLS', 'Your ID sighting record', '',
    `Hi ${record.staffName},`, '',
    'An ID sighting record has been saved with your email address. Your completed PDF is attached.', '',
    `Person whose ID was sighted: ${record.applicantName}`,
    `Date sighted: ${dateLabel}`,
    `Sighted by: ${record.staffName}`,
    ...documents.map((label, index) => `ID ${index + 1}: ${label} - Sighted`), '',
    'Keep the attached PDF with the relevant rental application.', support, '',
    'Questions about this record? Reply to this email to contact Everhomes.',
    'Open the ID sighting tool: https://mxn.au/everhomes/id-sighting', '',
    'Everhomes Pty Ltd', 'admin@everhomes.com.au', `Record reference: ${record.id}`,
  ].join('\n')
  const safe = Object.fromEntries(Object.entries({ staff: record.staffName, applicant: record.applicantName, date: dateLabel, reference: record.id }).map(([key, value]) => [key, escapeHtml(value)]))
  const documentRows = documents.map((label, index) => `<tr><td style="padding:14px 0;border-top:1px solid #d9e3e8;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word;">
    <p style="margin:0 0 4px;font-size:13px;line-height:18px;color:#526575;">ID ${index + 1} <span style="color:#16685f;">&middot; Sighted</span></p>
    <p style="margin:0;font-size:16px;line-height:24px;font-weight:bold;color:#1b2d3d;">${escapeHtml(label)}</p>
  </td></tr>`).join('')
  const html = `<!DOCTYPE html>
<html lang="en-AU" dir="ltr">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
  <title>Your Everhomes ID sighting record</title>
</head>
<body style="margin:0;padding:0;background-color:#edf2f5;color:#1b2d3d;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div lang="en-AU" dir="ltr" style="display:none;font-size:1px;line-height:1px;color:#edf2f5;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">Your completed ID sighting PDF is attached. Keep it with the rental application.</div>
  <table lang="en-AU" dir="ltr" role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#edf2f5">
    <tr><td align="center" style="padding:0;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;table-layout:fixed;">
        <tr><td bgcolor="#1b2d3d" style="padding:24px 18px;border-top:4px solid #087f78;">
          <p style="margin:0 0 5px;font-size:25px;line-height:30px;font-weight:bold;letter-spacing:-0.5px;color:#ffffff;">Everhomes</p>
          <p style="margin:0;font-size:12px;line-height:18px;font-weight:bold;letter-spacing:1.5px;color:#9de1d2;">TOOLS</p>
        </td></tr>
        <tr><td style="padding:24px 18px;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word;">
          <p style="margin:0 0 10px;font-size:13px;line-height:20px;font-weight:bold;color:#087f78;">RTA Forms 22b &amp; R22b</p>
          <h1 style="margin:0 0 20px;font-size:28px;line-height:34px;font-weight:bold;letter-spacing:-0.5px;color:#1b2d3d;">Your ID sighting record</h1>
          <p style="margin:0 0 12px;font-size:16px;line-height:25px;color:#1b2d3d;">Hi ${safe.staff},</p>
          <p style="margin:0 0 24px;font-size:16px;line-height:25px;color:#526575;">An ID sighting record has been saved with your email address. Your completed PDF is attached.</p>
          <h2 style="margin:0 0 18px;padding-top:20px;border-top:1px solid #d9e3e8;font-size:17px;line-height:24px;color:#1b2d3d;">Record summary</h2>
          <p style="margin:0 0 4px;font-size:13px;line-height:18px;color:#526575;">Person whose ID was sighted</p>
          <p style="margin:0 0 18px;font-size:18px;line-height:26px;font-weight:bold;color:#1b2d3d;">${safe.applicant}</p>
          <p style="margin:0 0 4px;font-size:13px;line-height:18px;color:#526575;">Date sighted</p>
          <p style="margin:0 0 18px;font-size:16px;line-height:24px;color:#1b2d3d;">${safe.date}</p>
          <p style="margin:0 0 4px;font-size:13px;line-height:18px;color:#526575;">Sighted by</p>
          <p style="margin:0 0 18px;font-size:16px;line-height:24px;color:#1b2d3d;">${safe.staff}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;">${documentRows}</table>
          <h2 style="margin:10px 0 6px;padding-top:20px;border-top:1px solid #d9e3e8;font-size:17px;line-height:24px;color:#087f78;">PDF attached</h2>
          <p style="margin:0;font-size:15px;line-height:23px;color:#526575;">Keep the attached PDF with the relevant rental application.</p>
          <p style="margin:22px 0 0;font-size:14px;line-height:22px;color:#526575;">${support}</p>
          <p style="margin:22px 0 6px;font-size:15px;line-height:23px;color:#1b2d3d;">Questions about this record? Reply to this email to contact Everhomes.</p>
          <p style="margin:0;font-size:15px;line-height:23px;"><a href="https://mxn.au/everhomes/id-sighting" style="display:inline-block;padding:10px 0;color:#087f78;text-decoration:underline;">Open the ID sighting tool</a></p>
        </td></tr>
        <tr><td style="padding:20px 18px;border-top:1px solid #d9e3e8;word-wrap:break-word;overflow-wrap:anywhere;word-break:break-word;">
          <p style="margin:0 0 6px;font-size:14px;line-height:21px;font-weight:bold;color:#1b2d3d;">Everhomes Pty Ltd</p>
          <p style="margin:0 0 12px;font-size:14px;line-height:21px;"><a href="mailto:admin@everhomes.com.au" style="color:#087f78;text-decoration:underline;">admin@everhomes.com.au</a></p>
          <p style="margin:0;font-size:12px;line-height:19px;color:#526575;">Record reference<br><span style="font-family:Consolas,'Courier New',monospace;word-break:break-all;">${safe.reference}</span></p>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body></html>`
  return { html, text, dateLabel }
}
