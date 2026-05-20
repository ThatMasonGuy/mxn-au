/**
 * useCardExporter — Canvas compositor + MediaRecorder export for X2Vertical.
 *
 * Produces a 1080×1920 frame that is pixel-for-pixel identical to the
 * TweetPreviewModal card by:
 *   • Anchoring the bottom bar + metrics to the canvas bottom first
 *   • Letting the media block fill ALL remaining space (mirrors flex-grow)
 *   • Drawing every icon with Path2D using the exact same SVG paths as the HTML
 */

import { ref } from 'vue'

// ── Canvas constants ──────────────────────────────────────────────────────────

const W   = 1080
const H   = 1920
const PAD = 56           // modal p-4 (16px) × (1080/320) ≈ 54 → 56
const CW  = W - PAD * 2  // 968px

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

// Scaled from modal text sizes × (1080/320)
const FS_NAME    = 46
const FS_HANDLE  = 38
const FS_TEXT    = 44
const FS_METRICS = 32
const FS_STAMP   = 30
const FS_ATTRIB  = 32
const LH_TEXT    = 66   // line-height for tweet text

// Avatar
const AVTR_R   = 64
const AVTR_TOP = 80

// Bottom section heights (we work UP from the canvas bottom)
const BOT_H    = 110   // attribution row (MXN.AU + X logo + timestamp)
const MET_H    = 76    // metrics row height
const SEP_LW   = 1.5  // separator line thickness

// ── SVG icon paths (24×24 viewBox — identical to the component SVGs) ──────────

const ICON = {
    verified: 'M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1.01-2.52-1.27-3.91-.81-.66-1.31-1.9-2.19-3.34-2.19-1.43 0-2.67.88-3.33 2.19-1.4-.46-2.91-.2-3.92.81-1.01 1.01-1.27 2.52-.8 3.91C2.88 9.33 2 10.57 2 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1.01 2.52 1.27 3.91.81.66 1.31 1.9 2.19 3.34 2.19 1.43 0 2.67-.88 3.33-2.19 1.4.46 2.91.2 3.92-.81 1.01-1.01 1.27-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.44-3.53L10.66 14l-2.41-2.38a.75.75 0 10-1.06 1.06l3 2.95a.75.75 0 001.08-.02l5.65-6.05a.75.75 0 10-1.1-1.02z',
    heart:    'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z',
    retweet:  'M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3',
    x_logo:   'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z',
}

// Draw a filled icon centered at (cx, cy) using an SVG path in a 24×24 viewBox
function fillIcon(ctx, pathStr, cx, cy, size, color) {
    ctx.save()
    ctx.translate(cx - size / 2, cy - size / 2)
    ctx.scale(size / 24, size / 24)
    ctx.fillStyle = color
    ctx.fill(new Path2D(pathStr))
    ctx.restore()
}

// Draw a stroked icon (lineWidth is in the original 24-unit space)
function strokeIcon(ctx, pathStr, cx, cy, size, color, lw = 2) {
    ctx.save()
    ctx.translate(cx - size / 2, cy - size / 2)
    ctx.scale(size / 24, size / 24)
    ctx.strokeStyle = color
    ctx.lineWidth   = lw
    ctx.lineJoin    = 'round'
    ctx.lineCap     = 'round'
    ctx.stroke(new Path2D(pathStr))
    ctx.restore()
}

// Eye icon = outline path + inner circle (two separate draw calls)
function strokeEyeIcon(ctx, cx, cy, size, color) {
    ctx.save()
    ctx.translate(cx - size / 2, cy - size / 2)
    ctx.scale(size / 24, size / 24)
    ctx.strokeStyle = color
    ctx.lineWidth   = 2
    ctx.lineJoin    = 'round'
    ctx.lineCap     = 'round'
    ctx.stroke(new Path2D('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'))
    ctx.beginPath()
    ctx.arc(12, 12, 3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
}

// ── Small utilities ───────────────────────────────────────────────────────────

function loadImg(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload  = () => resolve(img)
        img.onerror = () => reject(new Error(`Image load failed: ${src}`))
        img.src = src
    })
}

function fmtN(n) {
    if (!n && n !== 0) return '0'
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
    return String(n)
}

// Parse a CSS linear-gradient into a CanvasGradient
function cssToGradient(ctx, css) {
    const m = css.match(/linear-gradient\((\d+)deg,\s*(.+)\)$/)
    if (!m) return null
    const rad  = (parseFloat(m[1]) * Math.PI) / 180
    const dx   = Math.sin(rad), dy = -Math.cos(rad)
    const half = (Math.abs(W * Math.sin(rad)) + Math.abs(H * Math.cos(rad))) / 2
    const grad = ctx.createLinearGradient(
        W / 2 - half * dx, H / 2 - half * dy,
        W / 2 + half * dx, H / 2 + half * dy,
    )
    for (const [, c, p] of [...m[2].matchAll(/(#[0-9a-fA-F]{6})\s+(\d+)%/g)])
        grad.addColorStop(parseInt(p) / 100, c)
    return grad
}

// ── Quoted-tweet box constants ────────────────────────────────────────────────
// All values scaled from the modal (factor 1080/320 = 3.375):
//   avatar: w-4/h-4 = 16px CSS → radius 27
//   padding: px-2.5/pt-2/pb-2 = 10px/8px/8px → 34/27/27
//   gap after author row: mb-1 = 4px → 14
//   body text: text-[10px] leading-[1.4] → 34px / 47px LH
const QT_PAD_X   = 34   // horizontal padding  (px-2.5)
const QT_PAD_TOP = 27   // top padding         (pt-2)
const QT_PAD_BOT = 27   // bottom padding      (pb-2)
const QT_AVTR    = 27   // avatar radius       (w-4 = 16px CSS)
const QT_GAP     = 14   // author → body gap   (mb-1 = 4px)
const QT_FSN     = 34   // name font size      (text-[10px] bold)
const QT_FSH     = 30   // handle font size    (text-[9px])
const QT_FST     = 34   // body font size      (text-[10px])
const QT_LH      = 47   // body line height    (leading-[1.4] × 10px)
const QT_R       = 20   // corner radius       (rounded-xl)

// Build a rounded-rect path (used for both fill and stroke)
function rRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath()
    if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r)
    } else {
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y);      ctx.quadraticCurveTo(x + w, y,     x + w, y + r)
        ctx.lineTo(x + w, y + h - r);  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h);      ctx.quadraticCurveTo(x, y + h,     x, y + h - r)
        ctx.lineTo(x, y + r);          ctx.quadraticCurveTo(x, y,         x + r, y)
        ctx.closePath()
    }
}

// Measure how many canvas-units tall the quoted tweet box will be
function qtBoxH(ctx, qt) {
    const innerW = CW - QT_PAD_X * 2
    ctx.font = `400 ${QT_FST}px ${FONT}`
    const lines = Math.min(4, countTextLines(ctx, qt.text, innerW))
    return QT_PAD_TOP + QT_AVTR * 2 + QT_GAP + lines * QT_LH + QT_PAD_BOT
}

// Draw the quoted tweet box; returns the Y coordinate of its bottom edge
function drawQuotedBox(ctx, qt, x, y, w, textClr, mutClr, borderClr) {
    const h      = qtBoxH(ctx, qt)
    const innerW = w - QT_PAD * 2

    // Tinted fill
    ctx.save()
    rRectPath(ctx, x, y, w, h, QT_R)
    ctx.fillStyle = 'rgba(128,128,128,0.08)'
    ctx.fill()
    ctx.strokeStyle = borderClr
    ctx.lineWidth   = SEP_LW
    ctx.stroke()
    ctx.restore()

    // Mini avatar (initial letter — no async load needed for quoted author)
    const avX = x + QT_PAD + QT_AVTR
    const avY = y + QT_PAD + QT_AVTR
    ctx.fillStyle = '#64748b'
    ctx.beginPath(); ctx.arc(avX, avY, QT_AVTR, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = `700 ${Math.round(QT_AVTR * 0.9)}px ${FONT}`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText((qt.author?.displayName || '?').charAt(0).toUpperCase(), avX, avY)

    // Author name + handle — single row matching the modal's flex items-center layout
    const nameX = avX + QT_AVTR + 16
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
    ctx.fillStyle = textClr
    ctx.font = `700 ${QT_FSN}px ${FONT}`
    const displayName = qt.author?.displayName || ''
    ctx.fillText(displayName, nameX, avY)
    const nameW = ctx.measureText(displayName).width
    ctx.fillStyle = mutClr
    ctx.font = `400 ${QT_FSH}px ${FONT}`
    ctx.fillText('@' + (qt.author?.handle || ''), nameX + nameW + 12, avY)

    // Body text — max 4 lines with ellipsis truncation
    ctx.font = `400 ${QT_FST}px ${FONT}`
    ctx.fillStyle = textClr
    const spaceW = ctx.measureText(' ').width
    const words  = (qt.text || '').split(/\s+/).filter(Boolean)
    let line = [], lw = 0, cy = avY + QT_AVTR + 22, linesDone = 0

    for (let i = 0; i < words.length; i++) {
        const word = words[i]
        const ww   = ctx.measureText(word).width
        const gap  = line.length ? spaceW : 0
        if (lw + gap + ww > innerW && line.length) {
            if (linesDone === 3) {
                // Fourth line — truncate with ellipsis
                while (line.length && ctx.measureText(line.join(' ') + '...').width > innerW) line.pop()
                ctx.fillText(line.join(' ') + '...', x + QT_PAD, cy)
                break
            }
            ctx.fillText(line.join(' '), x + QT_PAD, cy)
            cy += QT_LH; linesDone++
            line = [word]; lw = ww
        } else {
            line.push(word); lw += gap + ww
        }
    }
    if (line.length && linesDone < 4) ctx.fillText(line.join(' '), x + QT_PAD, cy)

    return y + h
}

// Clip to a rounded rectangle
function clipRRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    if (ctx.roundRect) {
        ctx.roundRect(x, y, w, h, r)
    } else {
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y);      ctx.quadraticCurveTo(x + w, y,     x + w, y + r)
        ctx.lineTo(x + w, y + h - r);  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h);      ctx.quadraticCurveTo(x, y + h,     x, y + h - r)
        ctx.lineTo(x, y + r);          ctx.quadraticCurveTo(x, y,         x + r, y)
        ctx.closePath()
    }
    ctx.clip()
}

// Word-wrapped, @mention-coloured text. Returns Y position after the last line.
function drawTextWrapped(ctx, text, x, startY, maxW, textClr, linkClr) {
    const spaceW = ctx.measureText(' ').width
    const words  = (text || '').split(/\s+/).filter(Boolean)
    let line = [], lw = 0, cy = startY

    function flush() {
        if (!line.length) return
        let cx = x
        for (let i = 0; i < line.length; i++) {
            ctx.fillStyle = line[i].link ? linkClr : textClr
            ctx.fillText(line[i].w, cx, cy)
            cx += ctx.measureText(line[i].w).width + (i < line.length - 1 ? spaceW : 0)
        }
        cy += LH_TEXT
        line = []; lw = 0
    }

    for (const w of words) {
        const ww  = ctx.measureText(w).width
        const gap = line.length ? spaceW : 0
        if (lw + gap + ww > maxW && line.length) flush()
        line.push({ w, link: w.startsWith('@') || w.startsWith('http') || w.startsWith('#') })
        lw += (line.length > 1 ? spaceW : 0) + ww
    }
    flush()
    return cy
}

// Measure how many lines text will wrap to (ctx.font must be set before calling)
function countTextLines(ctx, text, maxW) {
    const spaceW = ctx.measureText(' ').width
    const words  = (text || '').split(/\s+/).filter(Boolean)
    let lw = 0, lines = 1
    for (const w of words) {
        const ww = ctx.measureText(w).width
        if (lw + (lw ? spaceW : 0) + ww > maxW && lw > 0) { lines++; lw = ww }
        else lw += (lw ? spaceW : 0) + ww
    }
    return lines
}

// ── Core frame renderer ───────────────────────────────────────────────────────
// This mirrors the modal's visual layout exactly:
//   Header → text → [media fills ALL remaining space] → metrics → bottom bar
// All bottom sections are anchored to the canvas bottom first, then media fills.

function drawFrame(ctx, item, bg, avatarImg, mediaImg, videoEl) {

    // ── Background ────────────────────────────────────────────────────────────
    ctx.fillStyle = bg.css.includes('gradient')
        ? (cssToGradient(ctx, bg.css) ?? bg.css)
        : bg.css
    ctx.fillRect(0, 0, W, H)

    const dark     = bg.textTone !== 'dark'
    const textClr  = dark ? '#ffffff'                  : '#0f172a'
    const mutClr   = dark ? 'rgba(226,232,240,0.70)'   : 'rgba(15,23,42,0.62)'
    const linkClr  = dark ? '#38bdf8'                  : '#0369a1'
    const sepClr   = dark ? 'rgba(255,255,255,0.12)'   : 'rgba(0,0,0,0.12)'

    const hasMetrics = !!item.metrics
    const hasMedia   = item.mediaType && item.mediaType !== 'none'
    const hasQuote   = !!item.quotedTweet

    // Pre-measure quote box height (quote sits BELOW media, so we need it before layout math)
    const quoteH = (hasQuote && hasMedia)
        ? (() => { ctx.font = `400 ${QT_FST}px ${FONT}`; return qtBoxH(ctx, item.quotedTweet) })()
        : 0

    // ── Pre-calculate bottom-anchored positions (work upward from H) ──────────
    const botCenterY    = H - BOT_H / 2
    const sepY          = H - BOT_H - 20
    const metCenterY    = hasMetrics ? sepY - 16 - MET_H / 2 : sepY
    // Bottom of the content zone (just above metrics row / separator)
    const contentBottom = hasMetrics ? metCenterY - MET_H / 2 - 20 : sepY - 20
    // Quote box anchored to the bottom of the content zone
    const quoteStartY   = (hasQuote && hasMedia) ? contentBottom - quoteH : contentBottom
    // Media fills everything between text and the quote box (or content bottom)
    const mediaEndY     = (hasQuote && hasMedia) ? quoteStartY - 20 : contentBottom

    // ── Avatar ────────────────────────────────────────────────────────────────
    const ax = PAD + AVTR_R
    const ay = AVTR_TOP + AVTR_R

    if (avatarImg) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(ax, ay, AVTR_R, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(avatarImg, ax - AVTR_R, ay - AVTR_R, AVTR_R * 2, AVTR_R * 2)
        ctx.restore()
    } else {
        ctx.fillStyle = item.avatarColor || '#1d4ed8'
        ctx.beginPath()
        ctx.arc(ax, ay, AVTR_R, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.font = `700 ${Math.round(AVTR_R * 0.85)}px ${FONT}`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText((item.displayName || '?').charAt(0).toUpperCase(), ax, ay)
    }

    // ── Name, verified badge, handle ──────────────────────────────────────────
    const nameX = PAD + AVTR_R * 2 + 24
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

    ctx.fillStyle = textClr
    ctx.font = `700 ${FS_NAME}px ${FONT}`
    const nameStr = item.displayName || ''
    ctx.fillText(nameStr, nameX, ay - 8)

    if (item.verified) {
        const nw = ctx.measureText(nameStr).width
        fillIcon(ctx, ICON.verified, nameX + nw + 28, ay - 8 - FS_NAME / 2 + 2, 36, '#1d9bf0')
    }

    ctx.fillStyle = mutClr
    ctx.font = `400 ${FS_HANDLE}px ${FONT}`
    ctx.fillText('@' + (item.handle || ''), nameX, ay + 40)

    // ── Tweet text ────────────────────────────────────────────────────────────
    const contentStartY = ay + AVTR_R + 44   // just below the avatar circle
    ctx.font = `400 ${FS_TEXT}px ${FONT}`

    if (hasMedia) {
        // Main tweet text (fixed height above media)
        const textEndY    = drawTextWrapped(ctx, item.text, PAD, contentStartY, CW, textClr, linkClr)
        const mediaStartY = textEndY + 36
        const mediaH      = Math.max(0, mediaEndY - mediaStartY)

        // ── Media fills space between text and quote box (or content bottom) ──
        if (mediaH > 60) {
            ctx.save()
            clipRRect(ctx, PAD, mediaStartY, CW, mediaH, 24)

            if (videoEl && item.mediaType === 'video' && videoEl.readyState >= 2) {
                const vw = videoEl.videoWidth  || CW
                const vh = videoEl.videoHeight || mediaH
                const ir = vw / vh
                const br = CW / mediaH
                let sw, sh, sx, sy
                if (ir > br) { sh = vh; sw = sh * br; sx = (vw - sw) / 2; sy = 0 }
                else         { sw = vw; sh = sw / br; sx = 0; sy = (vh - sh) / 2 }
                ctx.drawImage(videoEl, sx, sy, sw, sh, PAD, mediaStartY, CW, mediaH)
            } else if (mediaImg) {
                const ir = mediaImg.width / mediaImg.height
                const br = CW / mediaH
                let sw, sh, sx, sy
                if (ir > br) { sh = mediaImg.height; sw = sh * br; sx = (mediaImg.width - sw) / 2; sy = 0 }
                else         { sw = mediaImg.width;  sh = sw / br; sx = 0; sy = (mediaImg.height - sh) / 2 }
                ctx.drawImage(mediaImg, sx, sy, sw, sh, PAD, mediaStartY, CW, mediaH)
            } else {
                ctx.fillStyle = item.mediaBg || '#0f172a'
                ctx.fillRect(PAD, mediaStartY, CW, mediaH)
            }
            ctx.restore()
        }

        // ── Quoted tweet box — sits BELOW media, above metrics ────────────────
        if (hasQuote) {
            drawQuotedBox(ctx, item.quotedTweet, PAD, quoteStartY, CW, textClr, mutClr, sepClr)
        }
    } else if (hasQuote) {
        // Text + quoted tweet: anchor to top of available space
        const textEndY = drawTextWrapped(ctx, item.text, PAD, contentStartY, CW, textClr, linkClr)
        drawQuotedBox(ctx, item.quotedTweet, PAD, textEndY + 20, CW, textClr, mutClr, sepClr)
    } else {
        // Text-only: vertically centre the text in available space
        const lines  = countTextLines(ctx, item.text, CW)
        const textH  = lines * LH_TEXT
        const centY  = contentStartY + (mediaEndY - contentStartY - textH) / 2
        drawTextWrapped(ctx, item.text, PAD, centY, CW, textClr, linkClr)
    }

    // ── Metrics row ───────────────────────────────────────────────────────────
    if (hasMetrics) {
        const ICN = 32
        let mx = PAD
        const my = metCenterY

        ctx.font = `600 ${FS_METRICS}px ${FONT}`
        ctx.textBaseline = 'middle'

        // ♥ Likes
        fillIcon(ctx, ICON.heart, mx + ICN / 2, my, ICN, mutClr)
        mx += ICN + 10
        ctx.fillStyle = mutClr
        ctx.fillText(fmtN(item.metrics.likes), mx, my)
        mx += ctx.measureText(fmtN(item.metrics.likes)).width + 44

        // ↺ Retweets
        strokeIcon(ctx, ICON.retweet, mx + ICN / 2, my, ICN, mutClr)
        mx += ICN + 10
        ctx.fillStyle = mutClr
        ctx.fillText(fmtN(item.metrics.retweets), mx, my)
        mx += ctx.measureText(fmtN(item.metrics.retweets)).width + 44

        // 👁 Views
        if (item.metrics.views) {
            strokeEyeIcon(ctx, mx + ICN / 2, my, ICN, mutClr)
            mx += ICN + 10
            ctx.fillStyle = mutClr
            ctx.fillText(fmtN(item.metrics.views), mx, my)
        }
        ctx.textBaseline = 'alphabetic'
    }

    // ── Separator line ────────────────────────────────────────────────────────
    ctx.strokeStyle = sepClr
    ctx.lineWidth   = SEP_LW
    ctx.beginPath()
    ctx.moveTo(PAD, sepY)
    ctx.lineTo(W - PAD, sepY)
    ctx.stroke()

    // ── Bottom attribution row ────────────────────────────────────────────────
    ctx.textBaseline = 'middle'

    // Timestamp (left)
    ctx.fillStyle = mutClr
    ctx.font = `400 ${FS_STAMP}px ${FONT}`
    ctx.textAlign = 'left'
    ctx.fillText(item.timestamp || '', PAD, botCenterY)

    // X logo (right edge)
    const X_SZ = 32
    fillIcon(ctx, ICON.x_logo, W - PAD - X_SZ / 2, botCenterY, X_SZ, mutClr)

    // MXN.AU (left of X logo)
    ctx.font = `700 ${FS_ATTRIB}px 'Sora', sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText('MXN.AU', W - PAD - X_SZ - 36, botCenterY)
}

// ── Static snapshot (image / text-only posts) ─────────────────────────────────

export async function snapshotCard(item, bg) {
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    const [avatarImg, mediaImg] = await Promise.all([
        item.avatarUrl ? loadImg(item.avatarUrl).catch(() => null) : Promise.resolve(null),
        item.mediaType === 'image' && item.mediaUrl
            ? loadImg(item.mediaUrl).catch(() => null)
            : Promise.resolve(null),
    ])

    drawFrame(ctx, item, bg, avatarImg, mediaImg, null)

    return new Promise((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error('canvas.toBlob failed')), 'image/png'),
    )
}

// ── Video recorder ────────────────────────────────────────────────────────────

export function recordCard(item, bg, videoEl, onProgress) {
    return new Promise(async (resolve, reject) => {
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')

        // Pre-load avatar so the rAF loop stays synchronous
        const avatarImg = item.avatarUrl
            ? await loadImg(item.avatarUrl).catch(() => null)
            : null

        const mimeType = ['video/webm;codecs=vp9', 'video/webm'].find(t =>
            MediaRecorder.isTypeSupported(t),
        )
        if (!mimeType) return reject(new Error('MediaRecorder not supported in this browser'))

        // Unmute the video so the browser decodes audio during recording.
        // We'll restore the original muted state when recording stops.
        const wasMuted = videoEl.muted
        videoEl.muted = false

        const stream = canvas.captureStream(30)

        // Capture audio directly from the video element and add to the stream
        try {
            const srcStream = videoEl.captureStream?.() ?? videoEl.mozCaptureStream?.()
            if (srcStream) {
                for (const track of srcStream.getAudioTracks()) stream.addTrack(track)
            }
        } catch (e) {
            console.warn('X2Vertical: audio capture not available —', e.message)
        }

        const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5_000_000 })
        const chunks   = []
        let rafId      = null

        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        recorder.onstop = () => {
            cancelAnimationFrame(rafId)
            videoEl.muted = wasMuted   // restore original mute state
            resolve(new Blob(chunks, { type: 'video/webm' }))
        }
        recorder.onerror = e => reject(new Error(e.error?.message || 'Recorder error'))

        const duration = isFinite(videoEl.duration) && videoEl.duration > 0
            ? videoEl.duration
            : 30

        function loop() {
            drawFrame(ctx, item, bg, avatarImg, null, videoEl)
            onProgress?.(Math.min(videoEl.currentTime / duration, 0.99))
            rafId = requestAnimationFrame(loop)
        }

        // Seek to beginning, wait for seek to settle
        videoEl.currentTime = 0
        await new Promise(r => videoEl.addEventListener('seeked', r, { once: true }))

        recorder.start(200)
        loop()
        videoEl.loop = false
        videoEl.play().catch(console.error)

        videoEl.addEventListener('ended', function onEnd() {
            // Wait for the rAF loop to draw the final frame and for the
            // MediaRecorder's 200ms timeslice buffer to flush before stopping.
            setTimeout(() => {
                if (recorder.state === 'recording') recorder.stop()
            }, 500)
            videoEl.removeEventListener('ended', onEnd)
        })

        // Hard timeout: video duration + 5s
        setTimeout(() => {
            if (recorder.state === 'recording') recorder.stop()
        }, (duration + 5) * 1000)
    })
}

// ── Download helper ───────────────────────────────────────────────────────────

export function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    a.href = url; a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useCardExporter() {
    const isExporting    = ref(false)
    const exportProgress = ref(0)
    const exportStatus   = ref('idle')   // idle | working | done | error
    const exportError    = ref(null)

    async function doExport(mode, item, bg, videoEl = null) {
        if (isExporting.value) return
        isExporting.value  = true
        exportProgress.value = 0
        exportStatus.value = 'working'
        exportError.value  = null

        try {
            const isVideo = item.mediaType === 'video' && !!videoEl
            let blob

            if (isVideo) {
                blob = await recordCard(item, bg, videoEl, p => {
                    exportProgress.value = Math.round(p * 100)
                })
            } else {
                blob = await snapshotCard(item, bg)
                exportProgress.value = 100
            }

            exportStatus.value = 'done'
            const filename = `x2vertical-${item.id}.${isVideo ? 'webm' : 'png'}`

            if (mode === 'copy' && !isVideo) {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                } catch {
                    downloadBlob(blob, filename)
                    exportError.value = 'Clipboard write failed — saved as download instead'
                }
            } else {
                if (mode === 'copy') exportError.value = "Clipboard doesn't support video — downloading"
                downloadBlob(blob, filename)
            }
        } catch (err) {
            console.error('Export failed:', err)
            exportStatus.value = 'error'
            exportError.value  = err.message || 'Export failed'
        } finally {
            isExporting.value = false
        }
    }

    function resetExport() {
        exportStatus.value   = 'idle'
        exportProgress.value = 0
        exportError.value    = null
    }

    return { isExporting, exportProgress, exportStatus, exportError, doExport, resetExport }
}
