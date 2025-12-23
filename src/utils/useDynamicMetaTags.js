// @/utils/useDynamicMetaTags.js
// Import this and use in your router.js afterEach hook

/**
 * Updates page meta tags dynamically based on route metadata
 * Call this in router.afterEach() to update meta tags on route change
 */
export function updateMetaTags(route) {
  const baseUrl = 'https://mxn.au'
  const defaultTitle = 'MXN — Tools, Games & Experiments'
  const defaultDescription =
    'MXN is a personal collection of tools, games, and experiments built by Mason. Featuring TopHeroes utilities, translation tools, and other side projects.'
  const defaultImage = `${baseUrl}/og.png`

  // Build page title
  const pageTitle = route.meta.title
    ? `${route.meta.title} | MXN`
    : defaultTitle

  // Build description from route meta or use default
  const pageDescription = route.meta.description || defaultDescription

  // Build canonical URL
  const canonicalUrl = `${baseUrl}${route.path}`

  // Update document title
  document.title = pageTitle

  // Helper to update or create meta tag
  const setMetaTag = (selector, attribute, value) => {
    let element = document.querySelector(selector)
    if (!element) {
      element = document.createElement('meta')
      if (attribute === 'name') {
        element.name = selector.replace('meta[name="', '').replace('"]', '')
      } else if (attribute === 'property') {
        element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''))
      }
      document.head.appendChild(element)
    }
    element.setAttribute('content', value)
  }

  // Update standard meta tags
  setMetaTag('meta[name="title"]', 'name', pageTitle)
  setMetaTag('meta[name="description"]', 'name', pageDescription)

  // Update robots meta for auth/admin pages
  const robotsContent = (route.meta.requiresAuth || route.meta.role || route.meta.layout === 'admin')
    ? 'noindex, nofollow'
    : 'index, follow'
  setMetaTag('meta[name="robots"]', 'name', robotsContent)

  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl

  // Update Open Graph tags
  setMetaTag('meta[property="og:title"]', 'property', pageTitle)
  setMetaTag('meta[property="og:description"]', 'property', pageDescription)
  setMetaTag('meta[property="og:url"]', 'property', canonicalUrl)
  setMetaTag('meta[property="og:image"]', 'property', defaultImage)

  // Update Twitter Card tags
  setMetaTag('meta[name="twitter:title"]', 'name', pageTitle)
  setMetaTag('meta[name="twitter:description"]', 'name', pageDescription)
  setMetaTag('meta[name="twitter:url"]', 'name', canonicalUrl)
  setMetaTag('meta[name="twitter:image"]', 'name', defaultImage)
}

/**
 * Route-specific metadata configurations
 * Add custom descriptions and images for specific routes here
 */
export const routeMetadata = {
  '/topheroes': {
    title: 'TopHeroes Tools & Guides',
    description:
      'TopHeroes utilities built for real play: calculators, event guides, planning tools, and guild-focused dashboards (when public).',
    image: '/images/topheroes-og.png'
  },
  '/topheroes/tools/speedups': {
    title: 'TopHeroes Speed-up Calculator',
    description:
      'A simple speed-up helper for TopHeroes — sanity-check timers and plan upgrades without spreadsheet pain.',
    image: '/images/topheroes-speedup-og.png'
  },
  '/professional': {
    title: 'Professional Tools',
    description:
      'A small set of practical work utilities and experiments — built for my own workflow first, shared when useful.',
    image: '/images/professional-og.png'
  },
  '/translate': {
    title: 'MXNTranslate',
    description:
      'Translation tools and Discord-bot workflows for clean, fast multilingual messages — built around practical daily use.',
    image: '/images/translate-og.png'
  },
  '/casino': {
    title: 'Casino Mini-Games',
    description:
      'A little sandbox of browser casino games (for fun, not money): blackjack, roulette, and experiments.',
    image: '/images/casino-og.png'
  },
  '/dnd': {
    title: 'D&D Tools',
    description:
      'Small D&D helpers and experiments for campaigns — lightweight tools for players and DMs.',
    image: '/images/dnd-og.png'
  },
  '/everhomes': {
    title: 'Everhomes Calculators',
    description:
      'Practical calculators I built for real workflows — water bills, placement fees, SDA returns, and related tools.',
    image: '/images/everhomes-og.png'
  }
}

/**
 * Enhanced meta tag updater with route-specific metadata
 */
export function updateMetaTagsEnhanced(route) {
  // Check if we have custom metadata for this route
  const customMeta = routeMetadata[route.path]

  if (customMeta) {
    // Temporarily override route.meta with custom metadata
    const originalMeta = { ...route.meta }
    route.meta = {
      ...route.meta,
      title: customMeta.title,
      description: customMeta.description
    }
    updateMetaTags(route)
    route.meta = originalMeta
  } else {
    updateMetaTags(route)
  }
}
