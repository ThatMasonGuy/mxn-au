import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE_NAME,
  SITE_URL,
  getSeoForPath,
  isNoIndexPath,
  publicSeoRoutes,
} from '../src/shared/utils/seoConfig.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const distDir = path.join(rootDir, 'dist')
const args = new Set(process.argv.slice(2))

const shouldRunSitemap = args.size === 0 || args.has('--sitemap')
const shouldRunRoutes = args.size === 0 || args.has('--routes')

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttr(value = '') {
  return escapeHtml(value).replaceAll('"', '&quot;')
}

function escapeXml(value = '') {
  return escapeAttr(value).replaceAll("'", '&apos;')
}

function jsonForHtml(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c')
}

function sitemapRoutes() {
  return publicSeoRoutes.filter((route) => route.sitemap !== false && !isNoIndexPath(route.path))
}

function buildSitemapXml() {
  const urls = sitemapRoutes()
    .map((route) => {
      const seo = getSeoForPath(route.path)
      const changefreq = route.changefreq ? `\n    <changefreq>${escapeXml(route.changefreq)}</changefreq>` : ''
      const priority = route.priority ? `\n    <priority>${escapeXml(route.priority)}</priority>` : ''

      return `  <url>\n    <loc>${escapeXml(seo.canonicalUrl)}</loc>${changefreq}${priority}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function writeSitemap(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, buildSitemapXml(), 'utf8')
  console.log(`Wrote sitemap: ${path.relative(rootDir, filePath)}`)
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`Could not find SEO tag matching ${pattern}`)
  }

  return html.replace(pattern, replacement)
}

function renderRouteHtml(baseHtml, routePath) {
  const seo = getSeoForPath(routePath)
  const robots = isNoIndexPath(routePath) ? 'noindex, nofollow' : 'index, follow'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': routePath === '/' ? 'WebSite' : 'WebPage',
    name: seo.title,
    url: seo.canonicalUrl,
    description: seo.description,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Mason',
      url: `${SITE_URL}/`,
    },
  }

  let html = baseHtml

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.pageTitle)}</title>`)
  html = replaceTag(html, /<meta\s+name="title"[^>]*>/i, `<meta name="title" content="${escapeAttr(seo.pageTitle)}">`)
  html = replaceTag(
    html,
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(seo.description)}">`,
  )
  html = replaceTag(html, /<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${robots}">`)
  html = replaceTag(
    html,
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(seo.canonicalUrl)}">`,
  )

  html = replaceTag(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeAttr(seo.canonicalUrl)}">`)
  html = replaceTag(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeAttr(seo.pageTitle)}">`)
  html = replaceTag(
    html,
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeAttr(seo.description)}">`,
  )
  html = replaceTag(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeAttr(seo.image)}">`)

  html = replaceTag(html, /<meta\s+name="twitter:url"[^>]*>/i, `<meta name="twitter:url" content="${escapeAttr(seo.canonicalUrl)}">`)
  html = replaceTag(html, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeAttr(seo.pageTitle)}">`)
  html = replaceTag(
    html,
    /<meta\s+name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}">`,
  )
  html = replaceTag(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeAttr(seo.image)}">`)

  html = replaceTag(
    html,
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${jsonForHtml(structuredData)}\n  </script>`,
  )

  return html
}

function routeHtmlPath(routePath) {
  if (routePath === '/') return path.join(distDir, 'index.html')
  return path.join(distDir, `${routePath.slice(1)}.html`)
}

function writeRouteHtmlFiles() {
  const indexPath = path.join(distDir, 'index.html')

  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html does not exist. Run vite build before --routes.')
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf8')

  for (const route of sitemapRoutes()) {
    const targetPath = routeHtmlPath(route.path)
    fs.mkdirSync(path.dirname(targetPath), { recursive: true })
    fs.writeFileSync(targetPath, renderRouteHtml(baseHtml, route.path), 'utf8')
  }

  console.log(`Wrote ${sitemapRoutes().length} route HTML files`)
}

if (shouldRunSitemap) {
  writeSitemap(path.join(publicDir, 'sitemap.xml'))
}

if (shouldRunRoutes) {
  writeSitemap(path.join(distDir, 'sitemap.xml'))
  writeRouteHtmlFiles()
}
