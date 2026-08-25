<template>
  <div class="control-room">
    <a class="skip-link" href="#control-room-main">Skip to admin content</a>
    <div class="ambient ambient--pink" aria-hidden="true"></div>
    <div class="ambient ambient--cyan" aria-hidden="true"></div>

    <header class="command-bar">
      <div class="brand-lockup">
        <img class="brand-mark" src="/favicon.ico" alt="" width="38" height="38" aria-hidden="true" />
        <div>
          <strong>MXN.au</strong>
          <span>Control room</span>
        </div>
      </div>

      <nav class="command-nav" aria-label="Admin centre sections">
        <button
          v-for="item in navigation"
          :key="item.id"
          type="button"
          class="nav-button"
          :class="{ 'nav-button--active': activeSection === item.id }"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          @click="activeSection = item.id"
        >
          <component :is="item.icon" :size="17" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="command-actions">
        <button class="icon-button" type="button" :disabled="loading" aria-label="Refresh admin data" @click="loadOverview">
          <RefreshCw :size="19" :class="{ 'is-spinning': loading }" aria-hidden="true" />
        </button>
      </div>
    </header>

    <main id="control-room-main" class="control-main" tabindex="-1">
      <header class="section-hero">
        <div>
          <div class="hero-kicker">
            <span class="live-dot" :class="{ 'live-dot--offline': !dataOnline }" aria-hidden="true"></span>
            {{ currentSection.kicker }}
            <span v-if="overview?.generatedAt" class="snapshot-age">Updated {{ formatRelative(overview.generatedAt) }}</span>
          </div>
          <h1>{{ currentSection.title }}</h1>
          <p>{{ currentSection.description }}</p>
        </div>
      </header>

      <div v-if="loading && !overview" class="loading-deck" aria-live="polite" aria-busy="true">
        <p class="sr-only">Connecting to the admin data service.</p>
        <div class="loading-feature"></div>
        <div class="loading-tiles">
          <div v-for="index in 4" :key="index"></div>
        </div>
      </div>

      <template v-else>
        <section v-if="activeSection === 'overview'" class="section-stack" aria-labelledby="overview-heading">
          <h2 id="overview-heading" class="sr-only">Site overview</h2>

          <section v-if="fatalError && !overview" class="offline-card" aria-labelledby="offline-title">
            <div class="offline-visual" aria-hidden="true">
              <span class="orbit orbit--one"></span>
              <span class="orbit orbit--two"></span>
              <WifiOff :size="46" />
            </div>
            <div class="offline-copy">
              <p class="mini-label">Data link / offline</p>
              <h2 id="offline-title">The control room is here.<br>The data isn’t.</h2>
              <p>
                This page is running, but it can’t reach the admin data service. Nothing was changed and your
                site is still running normally.
              </p>
              <div class="offline-actions">
                <button type="button" class="primary-button" :disabled="loading" @click="loadOverview">
                  <RefreshCw :size="17" aria-hidden="true" />
                  Reconnect data
                </button>
                <code>{{ fatalError }}</code>
              </div>
            </div>
            <ul class="connection-checks" aria-label="Connection status">
              <li><span class="check-dot check-dot--good"></span><div><strong>Admin page</strong><small>Running locally</small></div></li>
              <li><span class="check-dot check-dot--bad"></span><div><strong>Data function</strong><small>Not reachable</small></div></li>
              <li><span class="check-dot check-dot--neutral"></span><div><strong>Writes</strong><small>None attempted</small></div></li>
            </ul>
          </section>

          <div v-if="hasSourceErrors" class="partial-banner" role="status">
            <AlertTriangle :size="18" aria-hidden="true" />
            Some data taps missed this refresh. Everything that did connect is still shown below.
          </div>

          <div class="pulse-grid" aria-label="Site totals">
            <button class="pulse-card pulse-card--pink" type="button" @click="activeSection = 'people'">
              <span class="pulse-icon"><Users :size="21" aria-hidden="true" /></span>
              <span class="pulse-label">People</span>
              <span class="pulse-value">{{ usersSource?.data?.total ?? '—' }}</span>
              <small>{{ usersSource?.status === 'available' ? `${usersSource.data.disabled} disabled` : 'Waiting for data' }}</small>
              <ArrowUpRight :size="18" class="pulse-arrow" aria-hidden="true" />
            </button>
            <button class="pulse-card pulse-card--orange" type="button" @click="activeSection = 'activity'">
              <span class="pulse-icon"><Activity :size="21" aria-hidden="true" /></span>
              <span class="pulse-label">Recent events</span>
              <span class="pulse-value">{{ activitySource?.data?.loaded ?? '—' }}</span>
              <small>{{ activitySource?.status === 'available' ? `Latest ${activitySource.data.limit} max` : 'Waiting for data' }}</small>
              <ArrowUpRight :size="18" class="pulse-arrow" aria-hidden="true" />
            </button>
            <button class="pulse-card pulse-card--cyan" type="button" @click="activeSection = 'firestore'">
              <span class="pulse-icon"><Database :size="21" aria-hidden="true" /></span>
              <span class="pulse-label">Documents</span>
              <span class="pulse-value">{{ formatInteger(firestoreSource?.data?.topLevelDocuments) }}</span>
              <small>{{ firestoreSource?.status === 'available' ? `${firestoreSource.data.topLevelCollections} top-level collections` : 'Waiting for data' }}</small>
              <ArrowUpRight :size="18" class="pulse-arrow" aria-hidden="true" />
            </button>
            <button class="pulse-card pulse-card--lime" type="button" @click="activeSection = 'firestore'">
              <span class="pulse-icon"><HardDrive :size="21" aria-hidden="true" /></span>
              <span class="pulse-label">Storage</span>
              <span class="pulse-value">{{ formatBytes(storageSource?.data?.bytes) }}</span>
              <small>{{ storageSource?.status === 'available' ? `${formatInteger(storageSource.data.objects)} objects` : 'Waiting for data' }}</small>
              <ArrowUpRight :size="18" class="pulse-arrow" aria-hidden="true" />
            </button>
          </div>

          <div class="overview-layout">
            <section class="room-card room-card--activity" aria-labelledby="latest-activity-title">
              <div class="card-heading">
                <div>
                  <p class="mini-label">What’s happening</p>
                  <h2 id="latest-activity-title">Latest activity</h2>
                </div>
                <button type="button" class="text-button" @click="activeSection = 'activity'">
                  See the full trail <ArrowUpRight :size="15" aria-hidden="true" />
                </button>
              </div>

              <ol v-if="recentActivity.length" class="activity-feed">
                <li v-for="(event, index) in recentActivity" :key="event.id">
                  <span class="activity-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                  <span class="activity-glyph"><Activity :size="15" aria-hidden="true" /></span>
                  <div>
                    <strong>{{ event.user?.name || 'Unnamed user' }}</strong>
                    <span>{{ humaniseEvent(event) }}</span>
                  </div>
                  <time :datetime="event.at || undefined">{{ formatRelative(event.at) }}</time>
                </li>
              </ol>
              <div v-else class="friendly-empty">
                <CircleDashed :size="25" aria-hidden="true" />
                <div><strong>No activity to show yet</strong><span>Reconnect the data service to pull the latest signed-in events.</span></div>
              </div>
            </section>

            <section class="room-card" aria-labelledby="connections-title">
              <div class="card-heading">
                <div>
                  <p class="mini-label">The wiring</p>
                  <h2 id="connections-title">Connections</h2>
                </div>
                <button type="button" class="text-button" @click="activeSection = 'services'">
                  All services <ArrowUpRight :size="15" aria-hidden="true" />
                </button>
              </div>

              <ul class="connection-list">
                <li v-for="source in sourceStatusRows" :key="source.label">
                  <span class="connection-icon"><component :is="source.icon" :size="18" aria-hidden="true" /></span>
                  <div><strong>{{ source.label }}</strong><small>{{ source.detail }}</small></div>
                  <span class="status-chip" :class="`status-chip--${source.tone}`">{{ source.status }}</span>
                </li>
              </ul>
            </section>
          </div>

          <section class="privacy-ribbon" aria-labelledby="records-title">
            <Info :size="20" aria-hidden="true" />
            <div>
              <strong id="records-title">Two different kinds of analytics</strong>
              <span>Signed-in activity is a required operational record. Google Analytics is optional and follows each visitor’s choice.</span>
            </div>
          </section>
        </section>

        <section v-else-if="activeSection === 'people'" class="section-stack" aria-labelledby="people-heading">
          <h2 id="people-heading" class="sr-only">People</h2>
          <div class="tool-row">
            <div class="count-copy"><strong>{{ filteredPeople.length }}</strong><span>{{ filteredPeople.length === 1 ? 'person shown' : 'people shown' }}</span></div>
            <label class="search-box">
              <span class="sr-only">Search people</span>
              <Search :size="18" aria-hidden="true" />
              <input v-model.trim="peopleSearch" type="search" placeholder="Find a name, email or role" />
            </label>
          </div>

          <section v-if="usersSource?.status !== 'available'" class="inline-offline" role="status">
            <WifiOff :size="21" aria-hidden="true" />
            <div><strong>People data is offline</strong><span>Reconnect the admin data service to view accounts and roles.</span></div>
            <button type="button" @click="loadOverview">Try again</button>
          </section>

          <ul v-else-if="filteredPeople.length" class="people-list">
            <li v-for="user in filteredPeople" :key="user.uid">
              <span class="person-avatar" aria-hidden="true">{{ initials(user.name) }}</span>
              <div class="person-identity"><strong>{{ user.name }}</strong><span>{{ user.email || 'No email recorded' }}</span></div>
              <span class="account-state" :class="{ 'account-state--disabled': user.status !== 'active' }"><i></i>{{ user.status }}</span>
              <div class="role-stack"><code v-for="role in user.roles" :key="role">{{ role }}</code><span v-if="!user.roles.length">No roles</span></div>
              <div class="last-seen"><span>Last seen</span><strong>{{ formatDateTime(user.lastSignInAt) }}</strong></div>
            </li>
          </ul>

          <div v-else class="friendly-empty friendly-empty--large">
            <Search :size="28" aria-hidden="true" />
            <div><strong>No one matches “{{ peopleSearch }}”</strong><span>Try a different name, email or role.</span></div>
            <button type="button" @click="peopleSearch = ''">Clear search</button>
          </div>
        </section>

        <section v-else-if="activeSection === 'activity'" class="section-stack" aria-labelledby="activity-heading">
          <h2 id="activity-heading" class="sr-only">Activity</h2>
          <div class="filter-chips" aria-label="Filter activity by event type">
            <button type="button" :class="{ active: activityFilter === 'all' }" @click="activityFilter = 'all'">Everything</button>
            <button v-for="type in activityTypes" :key="type" type="button" :class="{ active: activityFilter === type }" @click="activityFilter = type">{{ humanise(type) }}</button>
          </div>

          <section v-if="activitySource?.status !== 'available'" class="inline-offline" role="status">
            <WifiOff :size="21" aria-hidden="true" />
            <div><strong>The activity trail is offline</strong><span>Reconnect the data service to see signed-in page views, actions and error types.</span></div>
            <button type="button" @click="loadOverview">Try again</button>
          </section>

          <ol v-else-if="filteredActivity.length" class="full-activity-feed">
            <li v-for="event in filteredActivity" :key="event.id">
              <span class="event-orb" aria-hidden="true"><Activity :size="17" /></span>
              <div class="event-person"><strong>{{ event.user?.name || 'Unnamed user' }}</strong><span>{{ event.user?.email || shortUid(event.uid) }}</span></div>
              <div class="event-action"><strong>{{ humanise(event.type) }}</strong><span>{{ event.summary }}</span></div>
              <code>{{ event.path || 'No path recorded' }}</code>
              <time :datetime="event.at || undefined">{{ formatDateTime(event.at) }}</time>
            </li>
          </ol>
          <div v-else class="friendly-empty friendly-empty--large"><Activity :size="28" aria-hidden="true" /><div><strong>No events match this filter</strong><span>Choose another event type to widen the trail.</span></div></div>
        </section>

        <section v-else-if="activeSection === 'firestore'" class="section-stack" aria-labelledby="firestore-heading">
          <h2 id="firestore-heading" class="sr-only">Firestore and Storage</h2>

          <section v-if="firestoreSource?.status !== 'available' && storageSource?.status !== 'available'" class="inline-offline" role="status">
            <WifiOff :size="21" aria-hidden="true" />
            <div><strong>Firebase inventory is offline</strong><span>Reconnect the admin data service to count documents and stored objects.</span></div>
            <button type="button" @click="loadOverview">Try again</button>
          </section>

          <div class="data-layout">
            <section class="room-card data-card" aria-labelledby="collections-title">
              <div class="card-heading"><div><p class="mini-label">Firestore</p><h2 id="collections-title">Collections</h2></div><Database :size="22" aria-hidden="true" /></div>
              <p class="scope-copy">Top-level collections. Payload estimates exclude indexes, metadata and subcollections.</p>
              <ol v-if="firestoreSource?.data?.items?.length" class="collection-list">
                <li v-for="collection in firestoreSource.data.items" :key="collection.name">
                  <span class="collection-mark" aria-hidden="true"></span>
                  <code>{{ collection.name }}</code>
                  <span><strong>{{ formatInteger(collection.documents) }}</strong> docs</span>
                  <span><strong>{{ formatBytes(collection.estimatedDocumentBytes) }}</strong> approx.</span>
                </li>
              </ol>
              <div v-else class="friendly-empty"><CircleDashed :size="24" aria-hidden="true" /><div><strong>No collection inventory</strong><span>Waiting for the data service.</span></div></div>
            </section>

            <section class="room-card data-card" aria-labelledby="storage-title">
              <div class="card-heading"><div><p class="mini-label">Cloud Storage</p><h2 id="storage-title">Bucket</h2></div><HardDrive :size="22" aria-hidden="true" /></div>
              <div v-if="storageSource?.status === 'available'" class="bucket-details">
                <div class="bucket-total"><strong>{{ formatBytes(storageSource.data.bytes) }}</strong><span>across {{ formatInteger(storageSource.data.objects) }} objects</span></div>
                <dl><div><dt>Bucket</dt><dd>{{ storageSource.data.bucket }}</dd></div><div><dt>Location</dt><dd>{{ storageSource.data.location || 'Not reported' }}</dd></div><div><dt>Class</dt><dd>{{ storageSource.data.storageClass || 'Not reported' }}</dd></div></dl>
                <ol class="storage-groups"><li v-for="group in storageSource.data.groups.slice(0, 6)" :key="group.name"><code>{{ group.name }}</code><span>{{ formatInteger(group.objects) }} objects</span><strong>{{ formatBytes(group.bytes) }}</strong></li></ol>
              </div>
              <div v-else class="friendly-empty"><CircleDashed :size="24" aria-hidden="true" /><div><strong>No bucket inventory</strong><span>Waiting for the data service.</span></div></div>
            </section>
          </div>
        </section>

        <section v-else class="section-stack" aria-labelledby="services-heading">
          <h2 id="services-heading" class="sr-only">Services and costs</h2>
          <div class="service-grid">
            <article class="service-card service-card--pink">
              <span class="service-icon"><BarChart3 :size="24" aria-hidden="true" /></span>
              <div>
                <p class="mini-label">Optional analytics</p>
                <h2>Google Analytics 4</h2>
                <template v-if="ga4Source?.status === 'available'">
                  <p>{{ ga4Source.data.scope }}</p>
                  <dl class="service-metrics">
                    <div><dt>Active users</dt><dd>{{ formatInteger(ga4Source.data.totals.activeUsers) }}</dd></div>
                    <div><dt>New users</dt><dd>{{ formatInteger(ga4Source.data.totals.newUsers) }}</dd></div>
                    <div><dt>Sessions</dt><dd>{{ formatInteger(ga4Source.data.totals.sessions) }}</dd></div>
                    <div><dt>Views</dt><dd>{{ formatInteger(ga4Source.data.totals.views) }}</dd></div>
                  </dl>
                </template>
                <p v-else>{{ sourceMessage(ga4Source, 'GA4 data is not available yet.') }}</p>
              </div>
              <span class="status-chip" :class="sourceStatusClass(ga4Source)">{{ sourceStatusLabel(ga4Source) }}</span>
            </article>
            <article class="service-card service-card--orange">
              <span class="service-icon"><Receipt :size="24" aria-hidden="true" /></span>
              <div>
                <p class="mini-label">Project spend</p>
                <h2>Cloud billing</h2>
                <template v-if="billingSource?.status === 'available'">
                  <p>
                    Exported costs{{ billingSource.data.reportedThrough ? ` through ${formatDate(billingSource.data.reportedThrough)}` : ' for the current month' }}.
                    Credits are included before the total is calculated.
                  </p>
                  <dl class="service-metrics">
                    <div><dt>Month to date</dt><dd>{{ formatCost(billingSource.data.netCost, billingSource.data.currency) }}</dd></div>
                    <div><dt>Month-end run rate</dt><dd>{{ billingSource.data.projectedMonthEnd == null ? '—' : formatCost(billingSource.data.projectedMonthEnd, billingSource.data.currency) }}</dd></div>
                  </dl>
                  <ol v-if="billingSource.data.services.length" class="cost-services" aria-label="Costs by Google Cloud service">
                    <li v-for="service in billingSource.data.services.slice(0, 4)" :key="service.name">
                      <span>{{ service.name }}</span>
                      <strong>{{ formatCost(service.netCost, billingSource.data.currency) }}</strong>
                    </li>
                  </ol>
                </template>
                <p v-else>{{ sourceMessage(billingSource, 'Billing data is not available yet.') }}</p>
              </div>
              <span class="status-chip" :class="sourceStatusClass(billingSource)">{{ sourceStatusLabel(billingSource) }}</span>
            </article>
            <article class="service-card service-card--cyan">
              <span class="service-icon"><Database :size="24" aria-hidden="true" /></span>
              <div><p class="mini-label">Live inventory</p><h2>Firestore</h2><p>Collection counts with sampled payload estimates. Index and subcollection storage are excluded.</p></div>
              <span class="status-chip" :class="firestoreSource?.status === 'available' ? 'status-chip--good' : 'status-chip--error'">{{ firestoreSource?.status === 'available' ? 'Live' : 'Offline' }}</span>
            </article>
            <article class="service-card service-card--lime">
              <span class="service-icon"><Cloud :size="24" aria-hidden="true" /></span>
              <div><p class="mini-label">Object storage</p><h2>Cloud Storage</h2><p v-if="storageSource?.data?.estimate">About {{ formatCurrency(storageSource.data.estimate.monthlyStorageUsd, storageSource.data.estimate.currency) }} per month for stored bytes only.</p><p v-else>Stored bytes can be counted, but this bucket has no supported price estimate yet.</p></div>
              <span class="status-chip" :class="storageSource?.status === 'available' ? 'status-chip--good' : 'status-chip--error'">{{ storageSource?.status === 'available' ? 'Live' : 'Offline' }}</span>
            </article>
          </div>

          <section class="cost-boundary" aria-labelledby="cost-title">
            <Receipt :size="21" aria-hidden="true" />
            <div v-if="billingSource?.status === 'available'">
              <strong id="cost-title">Actual exports, cautious estimate</strong>
              <span>Month-to-date spend comes from Cloud Billing. The month-end figure is a simple run rate based on {{ billingSource.data.projectionBasis.toLowerCase() }} Billing data can arrive after the usage it describes.</span>
            </div>
            <div v-else>
              <strong id="cost-title">Waiting for the billing export</strong>
              <span>The first cost table can take several hours to appear. Document volume alone is not being used to invent a project total.</span>
            </div>
          </section>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CircleDashed,
  Cloud,
  Database,
  HardDrive,
  Info,
  LayoutDashboard,
  Receipt,
  RefreshCw,
  Search,
  Users,
  WifiOff,
} from '@lucide/vue'
import { auth } from '@/firebase'

const props = defineProps({
  initialOverview: { type: Object, default: null },
})

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL
  || 'https://australia-southeast1-mxn-au.cloudfunctions.net'

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'people', label: 'People', icon: Users },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'firestore', label: 'Data', icon: Database },
  { id: 'services', label: 'Services', icon: Cloud },
]

const sectionMeta = {
  overview: { kicker: 'System pulse', title: 'Your site, at a glance.', description: 'The people, activity and infrastructure behind MXN.au—without the console-hopping.' },
  people: { kicker: 'Who’s here', title: 'People & access', description: 'Accounts, roles and the last time each person signed in.' },
  activity: { kicker: 'What happened', title: 'Activity trail', description: 'Recent signed-in page views, actions and captured error types.' },
  firestore: { kicker: 'What it weighs', title: 'Firebase data', description: 'A practical inventory of Firestore documents and stored files.' },
  services: { kicker: 'What’s connected', title: 'Services & costs', description: 'Live sources, missing connections and honest estimate boundaries.' },
}

const activeSection = ref('overview')
const overview = ref(props.initialOverview)
const loading = ref(false)
const fatalError = ref('')
const peopleSearch = ref('')
const activityFilter = ref('all')

const currentSection = computed(() => sectionMeta[activeSection.value])
const usersSource = computed(() => overview.value?.sources?.users)
const activitySource = computed(() => overview.value?.sources?.activity)
const firestoreSource = computed(() => overview.value?.sources?.firestore)
const storageSource = computed(() => overview.value?.sources?.storage)
const ga4Source = computed(() => overview.value?.sources?.ga4)
const billingSource = computed(() => overview.value?.sources?.billing)
const recentActivity = computed(() => activitySource.value?.data?.items?.slice(0, 6) ?? [])
const dataOnline = computed(() => Boolean(overview.value) && !fatalError.value)
const hasSourceErrors = computed(() => Object.values(overview.value?.sources ?? {}).some((source) => source.status === 'error'))

const filteredPeople = computed(() => {
  const users = usersSource.value?.data?.items ?? []
  const search = peopleSearch.value.toLowerCase()
  if (!search) return users
  return users.filter((user) => [user.name, user.email, ...(user.roles ?? [])].some((value) => String(value ?? '').toLowerCase().includes(search)))
})

const activityTypes = computed(() => [...new Set((activitySource.value?.data?.items ?? []).map((event) => event.type))].sort())
const filteredActivity = computed(() => {
  const events = activitySource.value?.data?.items ?? []
  return activityFilter.value === 'all' ? events : events.filter((event) => event.type === activityFilter.value)
})

const sourceStatusRows = computed(() => [
  sourceRow('People & roles', usersSource.value, 'Authentication and profile records', Users),
  sourceRow('Activity trail', activitySource.value, 'Required signed-in operational events', Activity),
  sourceRow('Firestore', firestoreSource.value, 'Counts with sampled payload estimates', Database),
  sourceRow('Cloud Storage', storageSource.value, 'Stored objects and bytes', HardDrive),
  sourceRow(
    'Google Analytics 4',
    ga4Source.value,
    `${formatInteger(ga4Source.value?.data?.totals?.activeUsers)} active users · last 30 days`,
    BarChart3,
  ),
  sourceRow(
    'Cloud billing',
    billingSource.value,
    billingSource.value?.data?.reportedThrough
      ? `${formatCost(billingSource.value.data.netCost, billingSource.value.data.currency)} this month · through ${formatDate(billingSource.value.data.reportedThrough)}`
      : 'Connected · no exported costs this month',
    Receipt,
  ),
])

function sourceRow(label, source, detail, icon) {
  const available = source?.status === 'available'
  const waiting = source?.status === 'waiting'
  return {
    label,
    status: available ? 'Live' : (waiting ? 'Waiting' : 'Offline'),
    detail: available ? detail : sourceMessage(source, 'Waiting for the data service'),
    tone: available ? 'good' : (waiting ? 'muted' : 'error'),
    icon,
  }
}

function sourceMessage(source, fallback) {
  return source?.detail || source?.error || fallback
}

function sourceStatusLabel(source) {
  if (source?.status === 'available') return 'Live'
  if (source?.status === 'waiting') return 'Waiting'
  return 'Offline'
}

function sourceStatusClass(source) {
  if (source?.status === 'available') return 'status-chip--good'
  if (source?.status === 'waiting') return 'status-chip--muted'
  return 'status-chip--error'
}

async function loadOverview() {
  loading.value = true
  fatalError.value = ''
  try {
    const currentUser = auth.currentUser
    if (!currentUser) throw new Error('Administrator session unavailable')
    const token = await currentUser.getIdToken()
    const response = await fetch(`${FUNCTIONS_URL}/getSiteAdminOverview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.error || 'Admin data request failed')
    overview.value = payload
  } catch (error) {
    fatalError.value = error instanceof Error ? error.message : 'Admin data service unavailable'
  } finally {
    loading.value = false
  }
}

function formatInteger(value) {
  return Number.isFinite(Number(value)) ? new Intl.NumberFormat('en-AU').format(Number(value)) : '—'
}

function formatBytes(value) {
  const bytes = Number(value)
  if (!Number.isFinite(bytes)) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${new Intl.NumberFormat('en-AU', { maximumFractionDigits: index === 0 ? 0 : 1 }).format(bytes / (1024 ** index))} ${units[index]}`
}

function parseDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateTime(value) {
  const date = parseDate(value)
  return date ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'Never'
}

function formatDate(value) {
  const date = parseDate(value)
  return date ? new Intl.DateTimeFormat('en-AU', { dateStyle: 'medium' }).format(date) : 'an unknown date'
}

function formatRelative(value) {
  const date = parseDate(value)
  if (!date) return 'at an unknown time'
  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en-AU', { numeric: 'auto' })
  if (Math.abs(seconds) < 60) return formatter.format(seconds, 'second')
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return formatter.format(minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return formatter.format(hours, 'hour')
  return formatter.format(Math.round(hours / 24), 'day')
}

function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value) || 0)
}

function formatCost(value, currency = 'AUD') {
  const amount = Number(value) || 0
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: amount !== 0 && Math.abs(amount) < 1 ? 4 : 2,
  }).format(amount)
}

function humanise(value) {
  return String(value ?? '').replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function humaniseEvent(event) {
  return event.path ? `${humanise(event.type)} · ${event.path}` : `${humanise(event.type)} · ${event.summary}`
}

function initials(name) {
  return String(name || '?').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function shortUid(uid) {
  return uid ? `UID ${uid.slice(0, 8)}…` : 'Unknown user'
}

onMounted(() => {
  if (!overview.value) loadOverview()
})
</script>

<style scoped>
.control-room {
  --bg: #0d0710;
  --panel: #18101d;
  --panel-2: #201527;
  --line: #3a2942;
  --line-soft: #2b1d31;
  --text: #fff9f1;
  --muted: #bcaec2;
  --dim: #817386;
  --pink: #ff4faf;
  --orange: #ff9a52;
  --cyan: #55ded7;
  --lime: #b9ef6c;
  --violet: #a88cff;
  position: relative;
  isolation: isolate;
  min-height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(circle at 8% 10%, rgba(255, 79, 175, .13), transparent 26rem),
    radial-gradient(circle at 92% 35%, rgba(85, 222, 215, .09), transparent 30rem),
    var(--bg);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.control-room, .control-room * { box-sizing: border-box; }

.ambient { position: fixed; z-index: -1; width: 12rem; height: 12rem; border-radius: 50%; filter: blur(90px); opacity: .22; pointer-events: none; }
.ambient--pink { top: 20%; left: -7rem; background: var(--pink); }
.ambient--cyan { right: -6rem; bottom: 10%; background: var(--cyan); }
.skip-link { position: fixed; z-index: 200; top: .75rem; left: .75rem; transform: translateY(-180%); border-radius: .6rem; background: white; color: #180d1c; padding: .7rem 1rem; font-weight: 800; }
.skip-link:focus { transform: translateY(0); }
.command-bar { position: sticky; z-index: 50; top: 0; min-height: 78px; border-bottom: 1px solid var(--line); background: rgba(13, 7, 16, .94); backdrop-filter: blur(16px); display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 1.5rem; padding: .8rem clamp(1rem, 3vw, 2.75rem); }
.brand-lockup { display: flex; align-items: center; gap: .7rem; min-width: max-content; }
.brand-mark { width: 38px; height: 38px; display: block; object-fit: cover; border-radius: 11px; box-shadow: 0 8px 24px rgba(255, 79, 175, .18); }
.brand-lockup strong, .brand-lockup span { display: block; }
.brand-lockup strong { font-size: .88rem; letter-spacing: -.01em; }
.brand-lockup span { color: var(--muted); font-size: .66rem; margin-top: .05rem; }
.command-nav { justify-self: center; display: flex; align-items: center; gap: .3rem; padding: .28rem; border: 1px solid var(--line-soft); border-radius: 15px; background: #120b16; }
.nav-button { min-height: 40px; border: 0; border-radius: 11px; background: transparent; color: var(--muted); padding: .55rem .75rem; display: flex; align-items: center; gap: .45rem; font-size: .76rem; font-weight: 720; cursor: pointer; }
.nav-button:hover { color: var(--text); background: var(--panel-2); }
.nav-button--active, .nav-button--active:hover { color: #1d0c17; background: linear-gradient(135deg, #ff79c3, #ffa765); box-shadow: 0 7px 20px rgba(255, 79, 175, .18); }
.command-actions { display: flex; align-items: center; gap: .55rem; }
.icon-button { width: 40px; height: 40px; border: 1px solid var(--line); border-radius: 12px; background: var(--panel); color: var(--text); display: grid; place-items: center; cursor: pointer; }
.icon-button:hover:not(:disabled) { border-color: var(--pink); color: var(--pink); }
button:disabled { opacity: .58; cursor: wait; }
.control-main { width: min(1480px, 100%); margin-inline: auto; padding: clamp(1.3rem, 3vw, 2.6rem) clamp(1rem, 3vw, 2.75rem) 5rem; }
.section-hero { margin-bottom: 1.8rem; }
.hero-kicker, .mini-label { margin: 0 0 .5rem; color: #ff95cb; text-transform: uppercase; letter-spacing: .13em; font-size: .65rem; font-weight: 850; }
.hero-kicker { display: flex; align-items: center; gap: .5rem; }
.snapshot-age { color: var(--dim); text-transform: none; letter-spacing: 0; font-weight: 650; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lime); box-shadow: 0 0 0 5px rgba(185, 239, 108, .09), 0 0 16px rgba(185, 239, 108, .7); }
.live-dot--offline { background: var(--orange); box-shadow: 0 0 0 5px rgba(255, 154, 82, .09); }
h1, h2, p { margin-top: 0; }
h1 { margin-bottom: .55rem; font-size: clamp(2rem, 4vw, 3.45rem); line-height: .98; letter-spacing: -.055em; font-weight: 820; }
.section-hero > div:first-child > p { max-width: 720px; margin: 0; color: var(--muted); font-size: .92rem; line-height: 1.55; }
.primary-button { min-height: 42px; border: 0; border-radius: 12px; background: var(--text); color: #1b0d1f; display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .65rem .85rem; font-weight: 820; font-size: .73rem; cursor: pointer; }
.primary-button:hover:not(:disabled) { background: #ffd8eb; transform: translateY(-1px); }
.section-stack { display: grid; gap: 1.15rem; }
.offline-card { position: relative; overflow: hidden; display: grid; grid-template-columns: 155px minmax(0, 1fr) minmax(180px, .35fr); align-items: center; gap: 1.5rem; border: 1px solid #6a3d60; border-radius: 24px; background: linear-gradient(125deg, #281229, #17101c 62%); padding: clamp(1.2rem, 3vw, 2rem); box-shadow: 0 22px 70px rgba(0, 0, 0, .25); }
.offline-card::after { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px); background-size: 28px 28px; mask-image: linear-gradient(90deg, black, transparent 75%); pointer-events: none; }
.offline-visual { position: relative; width: 132px; height: 132px; display: grid; place-items: center; color: #ff8bbf; }
.orbit { position: absolute; inset: 10px; border: 1px solid #77415f; border-radius: 50%; }
.orbit--two { inset: 27px; border-style: dashed; transform: rotate(22deg); }
.offline-copy { position: relative; z-index: 1; }
.offline-copy h2 { margin-bottom: .55rem; font-size: clamp(1.45rem, 2.5vw, 2.25rem); letter-spacing: -.04em; line-height: 1.02; }
.offline-copy > p:not(.mini-label) { max-width: 610px; color: var(--muted); line-height: 1.55; font-size: .82rem; margin-bottom: 1rem; }
.offline-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .7rem; }
.offline-actions code { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #bfa6bb; font-size: .65rem; }
.connection-checks { position: relative; z-index: 1; list-style: none; margin: 0; padding: .35rem 0 .35rem 1.2rem; border-left: 1px solid #56364f; display: grid; gap: .8rem; }
.connection-checks li { display: flex; align-items: center; gap: .6rem; }
.connection-checks strong, .connection-checks small { display: block; }
.connection-checks strong { font-size: .72rem; }
.connection-checks small { color: var(--dim); font-size: .62rem; margin-top: .08rem; }
.check-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--dim); }
.check-dot--good { background: var(--lime); box-shadow: 0 0 10px rgba(185,239,108,.5); }
.check-dot--bad { background: #ff6d7d; }
.check-dot--neutral { background: var(--violet); }
.partial-banner { border: 1px solid #6c4a37; border-radius: 14px; background: #2c1d18; color: #ffc19b; padding: .8rem 1rem; display: flex; align-items: center; gap: .6rem; font-size: .75rem; }
.pulse-grid { margin: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .8rem; }
.pulse-card { --card-accent: var(--pink); position: relative; overflow: hidden; min-height: 154px; border: 1px solid var(--line); border-radius: 19px; background: var(--panel); color: var(--text); padding: 1rem; text-align: left; cursor: pointer; transition: transform .18s ease, border-color .18s ease; }
.pulse-card::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: var(--card-accent); }
.pulse-card::after { content: ''; position: absolute; width: 95px; height: 95px; right: -42px; bottom: -45px; border-radius: 50%; background: var(--card-accent); opacity: .11; }
.pulse-card:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--card-accent) 55%, var(--line)); }
.pulse-card--orange { --card-accent: var(--orange); }
.pulse-card--cyan { --card-accent: var(--cyan); }
.pulse-card--lime { --card-accent: var(--lime); }
.pulse-icon { width: 35px; height: 35px; border-radius: 11px; display: grid; place-items: center; background: color-mix(in srgb, var(--card-accent) 15%, transparent); color: var(--card-accent); }
.pulse-label { display: block; color: var(--muted); font-size: .69rem; margin-top: .8rem; }
.pulse-value { display: block; margin: .18rem 0 0; font-size: clamp(1.6rem, 2.7vw, 2.35rem); line-height: 1; letter-spacing: -.05em; font-weight: 780; font-variant-numeric: tabular-nums; }
.pulse-card small { display: block; color: var(--dim); font-size: .62rem; margin-top: .42rem; }
.pulse-arrow { position: absolute; top: 1rem; right: 1rem; color: var(--dim); }
.overview-layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(340px, .8fr); gap: 1rem; align-items: start; }
.room-card { border: 1px solid var(--line); border-radius: 20px; background: var(--panel); padding: 1rem; }
.card-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: .8rem; }
.card-heading h2 { margin-bottom: 0; font-size: 1.05rem; letter-spacing: -.02em; }
.text-button { border: 0; background: transparent; color: #ff9dcb; padding: .3rem; display: inline-flex; align-items: center; gap: .25rem; font-size: .67rem; cursor: pointer; }
.activity-feed { list-style: none; margin: 0; padding: 0; }
.activity-feed li { display: grid; grid-template-columns: 26px 32px minmax(0, 1fr) auto; align-items: center; gap: .55rem; padding: .66rem 0; border-top: 1px solid var(--line-soft); }
.activity-number { color: #6d5d72; font: 650 .58rem/1 ui-monospace, SFMono-Regular, Consolas, monospace; }
.activity-glyph, .event-orb { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 10px; background: #2b1730; color: var(--pink); }
.activity-feed strong, .activity-feed span { display: block; }
.activity-feed strong { font-size: .72rem; }
.activity-feed div span { color: var(--muted); font-size: .63rem; margin-top: .12rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-feed time { color: var(--dim); font-size: .6rem; white-space: nowrap; }
.connection-list { list-style: none; margin: 0; padding: 0; }
.connection-list li { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; align-items: center; gap: .6rem; padding: .58rem 0; border-top: 1px solid var(--line-soft); }
.connection-icon { width: 32px; height: 32px; border-radius: 10px; background: #25182b; color: var(--violet); display: grid; place-items: center; }
.connection-list strong, .connection-list small { display: block; }
.connection-list strong { font-size: .7rem; }
.connection-list small { color: var(--dim); font-size: .59rem; margin-top: .1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status-chip { width: max-content; border: 1px solid; border-radius: 999px; padding: .25rem .48rem; font-size: .58rem; font-weight: 800; white-space: nowrap; }
.status-chip--good { color: #c9f89a; border-color: #4b6a36; background: #1c2a13; }
.status-chip--error { color: #ffadba; border-color: #70404a; background: #30171f; }
.status-chip--muted { color: #c7b9cc; border-color: #524359; background: #231927; }
.privacy-ribbon, .cost-boundary { border: 1px solid #4b3656; border-radius: 16px; background: #17101c; padding: .85rem 1rem; display: flex; align-items: flex-start; gap: .7rem; color: var(--violet); }
.privacy-ribbon strong, .privacy-ribbon span, .cost-boundary strong, .cost-boundary span { display: block; }
.privacy-ribbon strong, .cost-boundary strong { color: var(--text); font-size: .72rem; }
.privacy-ribbon span, .cost-boundary span { color: var(--muted); font-size: .65rem; line-height: 1.45; margin-top: .12rem; }
.tool-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; border: 1px solid var(--line); border-radius: 18px; background: var(--panel); padding: .8rem 1rem; }
.count-copy { display: flex; align-items: baseline; gap: .4rem; }
.count-copy strong { font-size: 1.35rem; }
.count-copy span { color: var(--muted); font-size: .68rem; }
.search-box { width: min(100%, 380px); min-height: 42px; border: 1px solid var(--line); border-radius: 13px; background: #100a14; color: var(--dim); display: flex; align-items: center; gap: .55rem; padding: 0 .75rem; }
.search-box input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--text); font-size: .73rem; }
.people-list { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: 20px; overflow: hidden; background: var(--panel); }
.people-list li { display: grid; grid-template-columns: 44px minmax(190px, 1.4fr) auto minmax(150px, .8fr) minmax(165px, .7fr); align-items: center; gap: .8rem; padding: .85rem 1rem; }
.people-list li + li { border-top: 1px solid var(--line-soft); }
.people-list li:hover { background: #1d1322; }
.person-avatar { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 14px; background: linear-gradient(145deg, #fa5bb1, #a88cff); color: #1a0b19; font-size: .7rem; font-weight: 900; }
.person-identity strong, .person-identity span, .last-seen span, .last-seen strong { display: block; }
.person-identity strong { font-size: .76rem; }
.person-identity span { color: var(--muted); font-size: .64rem; margin-top: .1rem; }
.account-state { display: inline-flex; align-items: center; gap: .35rem; color: #c9f89a; text-transform: capitalize; font-size: .65rem; }
.account-state i { width: 7px; height: 7px; border-radius: 50%; background: var(--lime); }
.account-state--disabled { color: #c7b9cc; }
.account-state--disabled i { background: var(--dim); }
.role-stack { display: flex; flex-wrap: wrap; gap: .28rem; }
.role-stack code { border: 1px solid #5b3f65; border-radius: 7px; background: #28172f; color: #e8c8ef; padding: .2rem .35rem; font-size: .58rem; }
.role-stack span { color: var(--dim); font-size: .62rem; }
.last-seen { text-align: right; }
.last-seen span { color: var(--dim); font-size: .58rem; }
.last-seen strong { margin-top: .12rem; font-size: .65rem; }
.inline-offline { border: 1px solid #674256; border-radius: 17px; background: #24131f; color: #ff9fc9; padding: .9rem 1rem; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .75rem; }
.inline-offline strong, .inline-offline span { display: block; }
.inline-offline strong { color: var(--text); font-size: .75rem; }
.inline-offline span { color: var(--muted); font-size: .64rem; margin-top: .1rem; }
.inline-offline button, .friendly-empty button { min-height: 34px; border: 1px solid #8e5873; border-radius: 10px; background: transparent; color: #ffc1dc; padding: .4rem .65rem; font-size: .65rem; font-weight: 800; cursor: pointer; }
.filter-chips { display: flex; flex-wrap: wrap; gap: .45rem; }
.filter-chips button { min-height: 36px; border: 1px solid var(--line); border-radius: 999px; background: var(--panel); color: var(--muted); padding: .45rem .75rem; font-size: .66rem; cursor: pointer; }
.filter-chips button.active { border-color: var(--pink); background: #32162a; color: #ffc2df; }
.full-activity-feed { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: 20px; overflow: hidden; background: var(--panel); }
.full-activity-feed li { display: grid; grid-template-columns: 36px minmax(150px, .9fr) minmax(140px, .7fr) minmax(130px, 1fr) auto; align-items: center; gap: .8rem; padding: .8rem 1rem; }
.full-activity-feed li + li { border-top: 1px solid var(--line-soft); }
.event-person strong, .event-person span, .event-action strong, .event-action span { display: block; }
.event-person strong, .event-action strong { font-size: .7rem; }
.event-person span, .event-action span { color: var(--dim); font-size: .6rem; margin-top: .1rem; }
.full-activity-feed code { color: #d9bedc; font-size: .62rem; overflow-wrap: anywhere; }
.full-activity-feed time { color: var(--muted); font-size: .62rem; }
.data-layout { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.scope-copy { margin: -.2rem 0 .8rem; color: var(--dim); font-size: .62rem; line-height: 1.45; }
.collection-list, .storage-groups { list-style: none; margin: 0; padding: 0; }
.collection-list li { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto auto; align-items: center; gap: .7rem; padding: .68rem 0; border-top: 1px solid var(--line-soft); font-size: .65rem; }
.collection-mark { width: 7px; height: 7px; border-radius: 2px; background: var(--cyan); box-shadow: 0 0 10px rgba(85,222,215,.4); }
.collection-list code, .storage-groups code { color: #c8f5f2; overflow: hidden; text-overflow: ellipsis; }
.collection-list span { color: var(--muted); }
.collection-list span strong { color: var(--text); }
.bucket-total { border: 1px solid #395a56; border-radius: 15px; background: #12201f; padding: 1rem; }
.bucket-total strong, .bucket-total span { display: block; }
.bucket-total strong { color: #a9f4ed; font-size: 1.85rem; letter-spacing: -.04em; }
.bucket-total span { color: #83aaa6; font-size: .63rem; margin-top: .2rem; }
.bucket-details dl { margin: .8rem 0; }
.bucket-details dl div { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem 0; border-bottom: 1px solid var(--line-soft); font-size: .63rem; }
.bucket-details dt { color: var(--dim); }
.bucket-details dd { margin: 0; text-align: right; overflow-wrap: anywhere; }
.storage-groups li { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: .7rem; padding: .55rem 0; border-bottom: 1px solid var(--line-soft); font-size: .62rem; }
.storage-groups span { color: var(--dim); }
.service-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.service-card { --service-accent: var(--pink); position: relative; min-height: 190px; border: 1px solid var(--line); border-radius: 21px; background: var(--panel); padding: 1.15rem 1.15rem 3.2rem; display: grid; grid-template-columns: 46px minmax(0, 1fr); gap: .9rem; }
.service-card::after { content: ''; position: absolute; inset: auto 0 0; height: 4px; background: var(--service-accent); border-radius: 0 0 21px 21px; }
.service-card--orange { --service-accent: var(--orange); }
.service-card--cyan { --service-accent: var(--cyan); }
.service-card--lime { --service-accent: var(--lime); }
.service-icon { width: 44px; height: 44px; border-radius: 14px; background: color-mix(in srgb, var(--service-accent) 14%, transparent); color: var(--service-accent); display: grid; place-items: center; }
.service-card h2 { margin-bottom: .35rem; font-size: 1rem; }
.service-card p:not(.mini-label) { color: var(--muted); font-size: .68rem; line-height: 1.5; margin-bottom: 0; }
.service-card > .status-chip { position: absolute; right: 1rem; bottom: 1rem; }
.service-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; margin: .85rem 0 0; }
.service-metrics div { min-width: 0; border-top: 1px solid var(--line-soft); padding-top: .5rem; }
.service-metrics dt { color: var(--dim); font-size: .58rem; }
.service-metrics dd { margin: .15rem 0 0; color: var(--text); font-size: 1rem; font-weight: 780; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.cost-services { list-style: none; margin: .65rem 0 0; padding: 0; }
.cost-services li { display: flex; justify-content: space-between; gap: .75rem; border-top: 1px solid var(--line-soft); padding: .4rem 0; font-size: .6rem; }
.cost-services span { color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cost-services strong { color: var(--text); font-variant-numeric: tabular-nums; white-space: nowrap; }
.friendly-empty { min-height: 115px; color: var(--dim); display: flex; align-items: center; justify-content: center; gap: .7rem; text-align: left; }
.friendly-empty strong, .friendly-empty span { display: block; }
.friendly-empty strong { color: var(--muted); font-size: .72rem; }
.friendly-empty span { font-size: .62rem; margin-top: .12rem; }
.friendly-empty--large { min-height: 260px; border: 1px dashed #55405c; border-radius: 20px; background: rgba(24,16,29,.7); flex-direction: column; text-align: center; }
.loading-deck { display: grid; gap: 1rem; }
.loading-feature, .loading-tiles > div { border: 1px solid var(--line-soft); border-radius: 20px; background: linear-gradient(90deg, #17101b 25%, #25182b 50%, #17101b 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite linear; }
.loading-feature { height: 220px; }
.loading-tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: .8rem; }
.loading-tiles > div { height: 150px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.is-spinning { animation: spin .8s linear infinite; }
button:focus-visible, input:focus-visible, .skip-link:focus-visible { outline: 3px solid #fff2a7; outline-offset: 3px; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { to { background-position: -200% 0; } }

@media (max-width: 1050px) {
  .command-bar { grid-template-columns: auto 1fr auto; }
  .command-nav { justify-self: stretch; overflow-x: auto; overscroll-behavior-inline: contain; scrollbar-width: none; }
  .command-nav::-webkit-scrollbar { display: none; }
  .nav-button { flex: 1 0 auto; justify-content: center; }
  .offline-card { grid-template-columns: 120px minmax(0, 1fr); }
  .connection-checks { grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); border-left: 0; border-top: 1px solid #56364f; padding: 1rem 0 0; }
  .pulse-grid { grid-template-columns: repeat(2, 1fr); }
  .overview-layout { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .command-bar { position: static; grid-template-columns: 1fr auto; gap: .8rem; }
  .command-nav { grid-column: 1 / -1; grid-row: 2; order: 3; justify-self: stretch; }
  .offline-card { grid-template-columns: 1fr; }
  .offline-visual { width: 90px; height: 90px; }
  .connection-checks { grid-template-columns: 1fr; }
  .data-layout, .service-grid { grid-template-columns: 1fr; }
  .people-list li { grid-template-columns: 44px minmax(0, 1fr) auto; }
  .role-stack, .last-seen { grid-column: 2 / -1; text-align: left; }
  .full-activity-feed li { grid-template-columns: 36px minmax(0, 1fr) auto; }
  .event-action, .full-activity-feed code { grid-column: 2 / -1; }
  .tool-row { align-items: stretch; flex-direction: column; }
  .search-box { width: 100%; }
}

@media (max-width: 470px) {
  .control-main { padding-inline: .75rem; }
  .pulse-grid { grid-template-columns: 1fr 1fr; gap: .55rem; }
  .pulse-card { min-height: 145px; padding: .8rem; }
  .pulse-value { font-size: 1.45rem; }
  .pulse-card small { max-width: 115px; }
  .activity-feed li { grid-template-columns: 30px minmax(0, 1fr); }
  .activity-number { display: none; }
  .activity-feed time { grid-column: 2; }
  .connection-list li { grid-template-columns: 34px minmax(0, 1fr); }
  .connection-list .status-chip { grid-column: 2; }
  .offline-actions { align-items: stretch; flex-direction: column; }
  .offline-actions .primary-button { width: 100%; }
  .offline-actions code { max-width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .pulse-card, .primary-button { transition: none; }
  .pulse-card:hover, .primary-button:hover { transform: none; }
  .loading-feature, .loading-tiles > div, .is-spinning { animation: none; }
}
</style>
