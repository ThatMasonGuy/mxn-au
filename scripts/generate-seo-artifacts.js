import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SITE_NAME,
  SITE_URL,
  getSeoContextForPath,
  getSeoNavigationSections,
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

function routeHref(routePath) {
  return routePath === '/' ? '/' : routePath
}

function renderLinkSection(section) {
  const links = section.links
    .map(
      (link) =>
        `<li style="margin:0.35rem 0"><a href="${escapeAttr(routeHref(link.path))}">${escapeHtml(link.title)}</a></li>`,
    )
    .join('')

  return `
    <section aria-labelledby="seo-links-${escapeAttr(section.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'))}">
      <h2 id="seo-links-${escapeAttr(section.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'))}" style="font-size:1.15rem;margin:0 0 0.65rem">${escapeHtml(section.title)}</h2>
      <ul style="columns:clamp(1, 30vw, 3);margin:0;padding-left:1.2rem">${links}</ul>
    </section>`
}

function renderSeoFallback(routePath) {
  const context = getSeoContextForPath(routePath)
  const sections = getSeoNavigationSections(routePath)
  const isHome = context.path === '/'
  const heading = isHome ? 'Browse MXN.au tools, games, and practical utilities' : `About ${context.title}`
  const purpose = isHome
    ? 'MXN.au is a collection of browser-based tools, calculators, games, guides, and practical utilities built by Mason.'
    : context.purpose

  return `<div id="app">
  <main data-seo-fallback="true" style="box-sizing:border-box;max-width:76rem;margin:0 auto;padding:3rem 1.5rem;font-family:system-ui,sans-serif;line-height:1.6">
    <header style="max-width:48rem">
      <p style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">MXN.au</p>
      <h1 style="line-height:1.15;margin:0.25rem 0 1rem">${escapeHtml(context.title)}</h1>
      <p style="font-size:1.1rem">${escapeHtml(context.description)}</p>
    </header>
    <section style="max-width:48rem;margin-top:2rem" aria-labelledby="seo-purpose">
      <h2 id="seo-purpose" style="font-size:1.15rem;margin:0 0 0.65rem">${escapeHtml(heading)}</h2>
      <p>${escapeHtml(purpose)}</p>
    </section>
    <nav style="margin-top:2.5rem" aria-label="${isHome ? 'Browse MXN.au' : `Related ${context.title} pages`}">
      ${sections.map(renderLinkSection).join('\n')}
    </nav>
  </main>
</div>`
}

function structuredDataFor(routePath, seo) {
  const context = getSeoContextForPath(routePath)

  if (routePath === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: seo.title,
      url: seo.canonicalUrl,
      description: seo.description,
      publisher: {
        '@type': 'Person',
        name: 'Mason',
        url: `${SITE_URL}/`,
      },
    }
  }

  const pageData = {
    '@context': 'https://schema.org',
    '@type': context.schemaType,
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

  if (context.schemaType === 'WebApplication') {
    pageData.applicationCategory = context.applicationCategory
    pageData.operatingSystem = 'Web'
    pageData.isAccessibleForFree = true
    pageData.featureList = context.featureList
  }

  return pageData
}

function renderRouteHtml(baseHtml, routePath) {
  const seo = getSeoForPath(routePath)
  const robots = isNoIndexPath(routePath) ? 'noindex, nofollow' : 'index, follow'
  const structuredData = structuredDataFor(routePath, seo)

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
  html = replaceTag(html, /<div\s+id="app"\s*><\/div>/i, renderSeoFallback(routePath))

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
