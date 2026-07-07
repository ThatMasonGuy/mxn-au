export const SITE_URL = 'https://mxn.au'
export const SITE_NAME = 'MXN.au'

export const defaultSeo = {
  title: 'MXN.au - Tools, Games & Experiments',
  description:
    'MXN is a personal collection of tools, games, and experiments built by Mason. Featuring TopHeroes utilities, translation tools, small web apps, and ongoing side projects.',
  image: `${SITE_URL}/og.png`,
}

export const publicSeoRoutes = [
  {
    path: '/',
    title: 'MXN.au - Tools, Games & Experiments',
    description: defaultSeo.description,
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/casino',
    title: 'Casino Mini-Games',
    description:
      'A browser sandbox of casino-inspired mini-games on MXN.au, including blackjack, roulette, and small interactive experiments.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/casino/blackjack',
    title: 'Blackjack',
    description:
      'Play a lightweight browser blackjack game on MXN.au with quick rounds, clean controls, and a polished casino-table feel.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/casino/roulette',
    title: 'Roulette',
    description:
      'Try a fast browser roulette mini-game on MXN.au with simple betting controls and a compact casino interface.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/daily',
    title: 'MXN Daily Games',
    description:
      'Daily puzzle games and quick challenges on MXN.au, including word, flag, trivia, memory, and sequence games.',
    changefreq: 'daily',
    priority: '0.6',
  },
  {
    path: '/qr',
    title: 'QR Generator',
    description:
      'Generate customizable QR codes for links, text, Wi-Fi credentials, and everyday sharing tasks.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/professional',
    title: 'Professional Suite',
    description:
      'A small-business toolkit by Mason for contacts, invoices, projects, expenses, payment links, and practical workflow experiments.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/devtools',
    title: 'Developer Tools',
    description:
      'Personal developer utilities and project tools from MXN.au, collected for fast debugging and experimentation.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/dnd',
    title: 'Dungeons & Dragons Tools',
    description:
      'A lightweight Dungeons & Dragons player app and campaign helper built for quick reference during play.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/dnd2',
    title: 'Dungeons & Dragons Tools 2',
    description:
      'An alternate Dungeons & Dragons player workspace and campaign utility for tabletop sessions.',
    changefreq: 'weekly',
    priority: '0.5',
  },
  {
    path: '/everhomes',
    title: 'Everhomes Tools',
    description:
      'Practical Everhomes calculators and property workflow tools for water bills, placement fees, SDA returns, reports, and QR codes.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/everhomes/import',
    title: 'Everhomes Import Wizard',
    description:
      'Upload spreadsheets and prepare structured Everhomes data for property workflow tools and reports.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/everhomes/water-bill',
    title: 'Everhomes Water Bill Calculator',
    description:
      'Calculate water bill costs for Everhomes workflows with a focused browser tool.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/everhomes/placement-fee',
    title: 'Everhomes Placement Fee Calculator',
    description:
      'Calculate placement fees for Everhomes workflows with a simple, purpose-built browser tool.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/everhomes/sda-returns',
    title: 'Participant SDA Funding Details',
    description:
      'Calculate participant SDA funding details and related Everhomes return scenarios.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/everhomes/qr-code',
    title: 'Everhomes QR Code Generator',
    description:
      'Generate customizable QR codes for Everhomes links, property resources, text, and Wi-Fi credentials.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/destiny/usage',
    title: 'Destiny 2 Usage Stats',
    description:
      'View usage statistics for the MXN Destiny 2 web app and its challenge-progress tooling.',
    changefreq: 'monthly',
    priority: '0.4',
  },
  {
    path: '/translate',
    title: 'MXN Translate',
    description:
      'A realtime translation app powered by AI for cleaner multilingual messages and everyday translation workflows.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/translate/legal',
    title: 'MXN Translate Legal',
    description:
      'Terms of Service and Privacy Policy for MXN Translate, including service terms, privacy practices, and contact details.',
    changefreq: 'yearly',
    priority: '0.5',
  },
  {
    path: '/translate/bot',
    title: 'MXN Translate Discord Bot',
    description:
      'A Discord translation bot workflow for multilingual servers, automated translation, and bot configuration.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/translate/usage',
    title: 'MXN Translate Usage',
    description:
      'View personal and global usage stats for the AI-powered MXN Translate app and Discord translation workflows.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/topheroes',
    title: 'TopHeroes Tools & Guides',
    description:
      'TopHeroes tools, calculators, event guides, planning utilities, and guild-focused dashboards for real play.',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/topheroes/tools',
    title: 'TopHeroes Tools',
    description:
      'Browse TopHeroes utilities for speed-ups, resources, stars, traits, rankings, and other planning tasks.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/topheroes/events',
    title: 'TopHeroes Event Guides',
    description:
      'TopHeroes event guides and walkthroughs for planning guild activity, rewards, and event strategy.',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/topheroes/queues',
    title: 'TopHeroes Queues',
    description:
      'Browse public TopHeroes hero queue ideas and planning resources for teams, events, and guild play.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/topheroes/tools/speedups',
    title: 'TopHeroes Speed-up Calculator',
    description:
      'Calculate TopHeroes speed-up totals, compare timer costs, and plan upgrades without spreadsheet friction.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/topheroes/tools/resources',
    title: 'TopHeroes Resource Calculator',
    description:
      'Calculate resource needs in TopHeroes and plan upgrades, events, and guild requirements more easily.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/topheroes/tools/stars',
    title: 'TopHeroes Star Calculator',
    description:
      'Plan TopHeroes hero star upgrades and estimate the resources needed for progression.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/topheroes/tools/traits',
    title: 'TopHeroes Trait Trader',
    description:
      'Find similar TopHeroes traits and plan trades with a focused comparison tool.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/topheroes/tools/rankings/view',
    title: 'TopHeroes Published Rankings',
    description:
      'View published TopHeroes guild ranking reports and shared server ranking data.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/topheroes/tools/rankings/public',
    title: 'TopHeroes Ranking Reports',
    description:
      'Browse public TopHeroes ranking reports shared through the MXN.au rankings tools.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/topheroes/tools/rankings/insights',
    title: 'TopHeroes Ranking Insights',
    description:
      'Explore TopHeroes ranking insights and published guild data visualizations.',
    changefreq: 'weekly',
    priority: '0.6',
  },
  {
    path: '/topheroes/velaris',
    title: 'TopHeroes Velaris',
    description:
      'Velaris TopHeroes resources, event pages, and guild-focused tools on MXN.au.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/topheroes/velaris/events',
    title: 'Velaris Events',
    description:
      'Velaris TopHeroes event pages and guild event resources for ongoing play.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/topheroes/events/dark-empire-invasion',
    title: 'Dark Empire Invasion Guide',
    description:
      'TopHeroes guide for the Dark Empire Invasion event, including planning notes and strategy help.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/topheroes/events/kingdom-vs-kingdom',
    title: 'Kingdom vs. Kingdom Guide',
    description:
      'TopHeroes Kingdom vs. Kingdom event guide with planning notes for server competition and guild strategy.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/topheroes/events/guild-race',
    title: 'Guild Race Guide',
    description:
      'TopHeroes Guild Race guide for event planning, guild coordination, and strategy notes.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/prints',
    title: 'Photography Prints',
    description:
      'Fine art landscape and nature photography prints by Mason Bartholomai.',
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    path: '/discord',
    title: 'Discord Bots',
    description:
      'Discord bots and related experiments created by Mason for practical server workflows and playful automation.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/ai-journal',
    title: 'AI Journal',
    description:
      'AI Journal is a reflective writing space and personal journaling experiment by Mason.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/ai-journal/terms-of-service',
    title: 'AI Journal Terms of Service',
    description:
      'Terms of Service for the AI Journal app and related journaling workflows.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/ai-journal/privacy-policy',
    title: 'AI Journal Privacy Policy',
    description:
      'Privacy Policy for the AI Journal app and related journaling workflows.',
    changefreq: 'yearly',
    priority: '0.3',
  },
]

const routeMap = new Map(publicSeoRoutes.map((route) => [route.path, route]))

export const noIndexPathPrefixes = [
  '/personal',
  '/minecraft',
  '/server',
  '/cod/admin',
  '/devtools/upload',
  '/devtools/firestore',
  '/topheroes/admin',
  '/topheroes/velaris/admin',
  '/topheroes/queues/user',
  '/topheroes/tools/rankings/builder',
  '/topheroes/tools/rankings/weights',
  '/topheroes/tools/rankings/migrate',
  '/translate/rebuild',
  '/translate/bot/login',
  '/translate/bot/dashboard',
  '/translate/bot/config',
  '/professional/home',
  '/professional/company',
  '/professional/contacts',
  '/professional/jobs',
  '/professional/expenses',
  '/professional/catalogue',
  '/professional/invoices',
  '/professional/payments',
  '/professional/settings',
  '/professional/test',
  '/everhomes/admin',
  '/everhomes/import/sheets',
  '/everhomes/import/review',
  '/login',
  '/ext/login',
  '/unauth',
  '/404',
  '/bg',
]

export function normalizeSeoPath(path = '/') {
  const pathOnly = String(path).split('#')[0].split('?')[0]
  const withLeadingSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '')
  return withoutTrailingSlash || '/'
}

export function formatSeoTitle(title, path = '/') {
  if (!title || title === defaultSeo.title) return defaultSeo.title
  if (normalizeSeoPath(path) === '/') return title
  return `${title} | ${SITE_NAME}`
}

export function getSeoForPath(path = '/', routeMeta = {}) {
  const normalizedPath = normalizeSeoPath(path)
  const configured = routeMap.get(normalizedPath) || {}
  const title = configured.title || routeMeta.title || defaultSeo.title
  const description = configured.description || routeMeta.description || defaultSeo.description
  const image = configured.image || defaultSeo.image

  return {
    ...configured,
    path: normalizedPath,
    title,
    pageTitle: formatSeoTitle(title, normalizedPath),
    description,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    canonicalUrl: `${SITE_URL}${normalizedPath === '/' ? '/' : normalizedPath}`,
  }
}

export function isNoIndexPath(path = '/') {
  const normalizedPath = normalizeSeoPath(path)

  return noIndexPathPrefixes.some((prefix) => {
    const normalizedPrefix = normalizeSeoPath(prefix)
    return normalizedPath === normalizedPrefix || normalizedPath.startsWith(`${normalizedPrefix}/`)
  })
}

export function isNoIndexRoute(route) {
  return Boolean(
    route?.meta?.noindex ||
      route?.meta?.requiresAuth ||
      route?.meta?.role ||
      isNoIndexPath(route?.path || route?.fullPath || '/'),
  )
}
