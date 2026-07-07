import { getSeoForPath, isNoIndexRoute } from './seoConfig'

/**
 * Updates page meta tags dynamically based on route metadata.
 * Call this in router.afterEach() to update meta tags on route change.
 */
export function updateMetaTags(route) {
  const seo = getSeoForPath(route.path, route.meta)

  document.title = seo.pageTitle

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

  setMetaTag('meta[name="title"]', 'name', seo.pageTitle)
  setMetaTag('meta[name="description"]', 'name', seo.description)
  setMetaTag(
    'meta[name="robots"]',
    'name',
    isNoIndexRoute(route) ? 'noindex, nofollow' : 'index, follow',
  )

  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = seo.canonicalUrl

  setMetaTag('meta[property="og:title"]', 'property', seo.pageTitle)
  setMetaTag('meta[property="og:description"]', 'property', seo.description)
  setMetaTag('meta[property="og:url"]', 'property', seo.canonicalUrl)
  setMetaTag('meta[property="og:image"]', 'property', seo.image)

  setMetaTag('meta[name="twitter:title"]', 'name', seo.pageTitle)
  setMetaTag('meta[name="twitter:description"]', 'name', seo.description)
  setMetaTag('meta[name="twitter:url"]', 'name', seo.canonicalUrl)
  setMetaTag('meta[name="twitter:image"]', 'name', seo.image)
}

export function updateMetaTagsEnhanced(route) {
  updateMetaTags(route)
}
