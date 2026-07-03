<template>
  <div class="min-h-screen bg-[#090d12] text-slate-100">
    <header class="sticky top-0 z-20 border-b border-white/10 bg-[#0c1118]/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="min-w-0">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/25 bg-emerald-400/10">
                <Server class="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h1 class="text-xl font-semibold tracking-tight text-white">Minecraft Ops</h1>
                <p class="truncate font-mono text-xs text-slate-400">{{ minecraft.apiEndpoint }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium"
              :class="minecraft.fallbackMode ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'"
            >
              <span class="h-2 w-2 rounded-full" :class="minecraft.fallbackMode ? 'bg-amber-300' : 'bg-emerald-300'" />
              {{ minecraft.fallbackMode ? 'Snapshot' : statusStreamCount ? `Live (${statusStreamCount})` : 'Live' }}
            </span>

            <button
              class="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
              title="Refresh servers"
              @click="refresh"
            >
              <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': minecraft.loading }" />
              Refresh
            </button>
          </div>
        </div>

        <div v-if="minecraft.fallbackMode" class="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          API bridge unavailable: {{ minecraft.fallbackReason || 'using local registry snapshot' }}
        </div>

        <div v-if="minecraft.error" class="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
          {{ minecraft.error }}
        </div>
      </div>
    </header>

    <main class="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section class="space-y-6">
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div class="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Players</span>
              <Users class="h-4 w-4 text-sky-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ minecraft.totals.players }}/{{ minecraft.totals.capacity }}</div>
          </div>

          <div class="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Active</span>
              <Activity class="h-4 w-4 text-emerald-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ minecraft.totals.active }}</div>
          </div>

          <div class="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Sleeping</span>
              <Moon class="h-4 w-4 text-indigo-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ minecraft.totals.sleeping }}</div>
          </div>

          <div class="rounded-md border border-white/10 bg-white/[0.04] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Updates</span>
              <PackageCheck class="h-4 w-4 text-violet-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ minecraft.totals.updates }}</div>
          </div>
        </div>

        <div class="space-y-3">
          <div v-if="pendingRestartServers.length" class="rounded-md border border-amber-400/25 bg-amber-400/10 p-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex min-w-0 gap-3">
                <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div class="min-w-0">
                  <h2 class="font-semibold text-amber-50">Pending restart</h2>
                  <p class="mt-1 text-sm text-amber-100/80">
                    {{ pendingRestartServers.map((server) => server.label).join(', ') }} need a restart or wake before recent changes are fully applied.
                  </p>
                </div>
              </div>
              <button
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-amber-300/25 bg-amber-300/10 px-3 text-sm text-amber-50 hover:bg-amber-300/15"
                @click="openServer(pendingRestartServers[0].id)"
              >
                Open
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </div>

          <article
            v-for="server in minecraft.servers"
            :key="server.id"
            class="rounded-md border bg-[#0f151d] p-4 transition hover:border-white/20"
            :class="server.id === minecraft.selectedServerId ? 'border-emerald-400/35 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]' : 'border-white/10'"
          >
            <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <button class="flex min-w-0 flex-1 items-start gap-3 text-left" @click="selectServer(server.id)">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/25">
                  <img
                    v-if="serverIcon(server)"
                    :src="serverIcon(server)"
                    :alt="`${server.label} icon`"
                    class="h-full w-full object-cover [image-rendering:pixelated]"
                  />
                  <span v-else class="font-mono text-sm font-semibold text-emerald-100">{{ serverInitials(server) }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-lg font-semibold text-white">{{ server.label }}</span>
                    <span class="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-slate-300">{{ server.id }}</span>
                    <span class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium" :class="stateMeta(server.state).pill">
                      <span class="h-1.5 w-1.5 rounded-full" :class="stateMeta(server.state).dot" />
                      {{ stateMeta(server.state).label }}
                    </span>
                    <span v-if="restartReasonCount(server.id)" class="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-200">
                      <AlertTriangle class="h-3.5 w-3.5" />
                      Restart
                    </span>
                  </div>
                  <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span class="inline-flex items-center gap-1.5"><Globe2 class="h-3.5 w-3.5" />{{ server.host }}</span>
                    <span class="inline-flex items-center gap-1.5"><Cable class="h-3.5 w-3.5" />{{ server.publicPort }} -> {{ server.backendPort }}</span>
                    <span class="inline-flex items-center gap-1.5"><ShieldCheck class="h-3.5 w-3.5" />RCON {{ server.rconPort }}</span>
                  </div>
                </div>
              </button>

              <div class="grid min-w-[280px] grid-cols-3 gap-2 text-sm">
                <div class="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                  <div class="text-xs text-slate-500">Players</div>
                  <div class="mt-1 font-semibold text-slate-100">{{ server.playersOnline }}/{{ server.maxPlayers }}</div>
                </div>
                <div class="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                  <div class="text-xs text-slate-500">Mods</div>
                  <div class="mt-1 font-semibold text-slate-100">{{ server.modCount }}</div>
                </div>
                <div class="rounded-md border border-white/10 bg-black/20 px-3 py-2">
                  <div class="text-xs text-slate-500">Backup</div>
                  <div class="mt-1 truncate font-semibold text-slate-100">{{ backupLabel(server) }}</div>
                </div>
              </div>
            </div>

            <div class="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
              <div class="min-w-0 truncate font-mono text-xs text-slate-400">{{ server.service }} - {{ server.activeWorld }}</div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-if="canWake(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 transition hover:bg-emerald-400/15"
                  @click="runLifecycle(server, 'wake')"
                >
                  <Play class="h-4 w-4" />
                  Wake
                </button>

                <button
                  v-if="canRestart(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-sky-400/25 bg-sky-400/10 px-3 text-sm text-sky-100 transition hover:bg-sky-400/15"
                  @click="runLifecycle(server, 'restart')"
                >
                  <RotateCw class="h-4 w-4" />
                  Restart
                </button>

                <button
                  v-if="canSleep(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-rose-400/25 bg-rose-400/10 px-3 text-sm text-rose-100 transition hover:bg-rose-400/15"
                  @click="runLifecycle(server, 'sleep')"
                >
                  <Square class="h-4 w-4" />
                  Sleep
                </button>

                <button
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
                  @click="openServer(server.id)"
                >
                  Open
                  <ArrowRight class="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <aside class="space-y-4">
        <section class="rounded-md border border-white/10 bg-[#0f151d] p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-start gap-3">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/25">
                <img
                  v-if="selected && serverIcon(selected)"
                  :src="serverIcon(selected)"
                  :alt="`${selected.label} icon`"
                  class="h-full w-full object-cover [image-rendering:pixelated]"
                />
                <Server v-else class="h-5 w-5 text-emerald-300" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate font-semibold text-white">{{ selected?.label || 'Server' }}</h2>
                <p class="mt-1 truncate font-mono text-xs text-slate-400">{{ selected?.root }}</p>
              </div>
            </div>
            <span v-if="selected" class="rounded-md px-2 py-1 text-xs font-medium" :class="stateMeta(selected.state).pill">{{ stateMeta(selected.state).label }}</span>
          </div>

          <div v-if="selected" class="mt-4 space-y-3">
            <MetricBar label="CPU" :value="selected.cpu || 0" tone="emerald" />
            <MetricBar label="Memory" :value="selected.memory || 0" tone="sky" />
            <MetricBar label="Disk" :value="selected.disk || 0" tone="violet" />
          </div>
        </section>

        <section class="rounded-md border border-white/10 bg-[#0f151d] p-4">
          <h2 class="font-semibold text-white">Maintenance</h2>
          <div class="mt-4 space-y-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Daily restart</span>
              <span class="font-mono text-slate-100">{{ selected?.maintenance?.dailyRestart || '06:00' }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Snapshots kept</span>
              <span class="font-mono text-slate-100">{{ selected?.maintenance?.localSnapshotRetention || 2 }}</span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Cron</span>
              <span
                class="rounded-md px-2 py-1 text-xs"
                :class="selected?.maintenance?.cronMatched ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'"
              >
                {{ selected?.maintenance?.cronMatched ? 'Matched' : selected?.maintenance?.cronPresent === false ? 'Missing' : 'Pending' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Today snapshot</span>
              <span
                class="rounded-md px-2 py-1 text-xs"
                :class="selected?.maintenance?.latestBackupToday ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'"
              >
                {{ selected?.maintenance?.latestBackupToday ? 'Done' : 'Waiting' }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <span class="text-slate-400">Last backup</span>
              <span class="text-right text-slate-100">{{ backupLabel(selected) }}</span>
            </div>
          </div>
        </section>

        <section class="rounded-md border border-white/10 bg-[#0f151d] p-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-semibold text-white">Recent Activity</h2>
            <History class="h-4 w-4 text-slate-400" />
          </div>
          <div class="mt-4 space-y-2">
            <div v-if="!recentActivity.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
              No panel activity yet.
            </div>
            <div v-for="entry in recentActivity" :key="entry.id" class="rounded-md border border-white/10 bg-black/20 p-3">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="truncate text-sm font-medium text-slate-100">{{ entry.summary }}</div>
                  <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{{ activityServerLabel(entry) }}</span>
                    <span>{{ formatDate(entry.timestamp) }}</span>
                  </div>
                </div>
                <span v-if="entry.restartRequired" class="rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-200">Restart</span>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-md border border-white/10 bg-[#0f151d] p-4">
          <h2 class="font-semibold text-white">Ports</h2>
          <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div class="rounded-md border border-white/10 bg-black/20 p-3">
              <div class="text-xs text-slate-500">Public</div>
              <div class="mt-1 font-mono text-slate-100">{{ selected?.publicPort }}</div>
            </div>
            <div class="rounded-md border border-white/10 bg-black/20 p-3">
              <div class="text-xs text-slate-500">Backend</div>
              <div class="mt-1 font-mono text-slate-100">{{ selected?.backendPort }}</div>
            </div>
            <div class="rounded-md border border-white/10 bg-black/20 p-3">
              <div class="text-xs text-slate-500">RCON</div>
              <div class="mt-1 font-mono text-slate-100">{{ selected?.rconPort }}</div>
            </div>
          </div>
        </section>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cable,
  Globe2,
  History,
  Moon,
  PackageCheck,
  Play,
  RefreshCcw,
  RotateCw,
  Server,
  ShieldCheck,
  Square,
  Users,
} from 'lucide-vue-next'
import { useMinecraftStore } from '@/features/minecraft/stores/useMinecraftStore'
import { useToast } from '@/shared/components/ui/toast'
import MetricBar from '@/features/minecraft/components/MetricBar.vue'

const router = useRouter()
const minecraft = useMinecraftStore()
const { toast } = useToast()
const selected = computed(() => minecraft.selectedServer)
const pendingRestartServers = computed(() => minecraft.servers.filter((server) => restartReasonCount(server.id)))
const recentActivity = computed(() => minecraft.activityFeed.slice(0, 6))
const statusStreamCount = computed(() => minecraft.statusStreamingIds?.size || 0)

const errorMessage = (error) => error?.message || String(error || 'Unexpected Minecraft error')

const runWithToast = async (action, options = {}) => {
  try {
    const result = await action()
    if (options.success) {
      toast({
        title: options.success,
        description: options.description,
        variant: options.variant || 'success',
      })
    }
    return result
  } catch (error) {
    toast({
      title: options.error || 'Minecraft action failed',
      description: errorMessage(error),
      variant: 'destructive',
    })
    return null
  }
}

const refresh = async () => {
  await runWithToast(
    () => minecraft.refreshAll(),
    { error: 'Refresh failed' },
  )
}

const selectServer = async (serverId) => {
  minecraft.setSelectedServer(serverId)
  await runWithToast(
    () => minecraft.fetchServer(serverId),
    { error: 'Server refresh failed' },
  )
}

const openServer = (serverId) => {
  router.push(`/minecraft/${serverId}`)
}

const serverIcon = (server) => minecraft.serverIconUrl(server)

const serverInitials = (server) => {
  return String(server?.label || server?.id || 'MC')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const restartReasonCount = (serverId) => minecraft.restartReasonsForServer(serverId).length

const activityServerLabel = (entry) => {
  return minecraft.servers.find((server) => server.id === entry.serverId)?.label || entry.serverId
}

const runLifecycle = async (server, action) => {
  let confirmed = false
  if (['sleep', 'stop', 'restart'].includes(action)) {
    const ok = window.confirm(`${action.toUpperCase()} ${server.label}?`)
    if (!ok) return
    confirmed = true
  }

  await runWithToast(
    () => minecraft.lifecycleAction(server.id, action, confirmed),
    {
      success: `${actionLabel(action)} requested`,
      description: server.label,
      error: `${actionLabel(action)} failed`,
    },
  )
}

const actionLabel = (action) => `${action.slice(0, 1).toUpperCase()}${action.slice(1)}`

const canWake = (server) => ['offline', 'hibernating', 'degraded'].includes(server?.state)
const canRestart = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)
const canSleep = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)

const startStatusStreams = () => {
  if (minecraft.fallbackMode) return
  minecraft.servers.forEach((server) => minecraft.startStatusStream(server.id, { interval: 5000 }))
}

const stateMeta = (state) => {
  const states = {
    alive: {
      label: 'Active',
      pill: 'bg-emerald-400/10 text-emerald-200',
      dot: 'bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.7)]',
    },
    hibernating: {
      label: 'Sleeping',
      pill: 'bg-indigo-400/10 text-indigo-200',
      dot: 'bg-indigo-300',
    },
    warming: {
      label: 'Warming',
      pill: 'bg-amber-400/10 text-amber-200',
      dot: 'bg-amber-300 animate-pulse',
    },
    stopping: {
      label: 'Stopping',
      pill: 'bg-orange-400/10 text-orange-200',
      dot: 'bg-orange-300 animate-pulse',
    },
    degraded: {
      label: 'Degraded',
      pill: 'bg-rose-400/10 text-rose-200',
      dot: 'bg-rose-300',
    },
    offline: {
      label: 'Offline',
      pill: 'bg-slate-400/10 text-slate-300',
      dot: 'bg-slate-400',
    },
  }
  return states[state] || states.offline
}

const backupLabel = (server) => {
  if (!server) return 'Unknown'
  if (!server.lastBackupAt) return server.lastBackupStatus || 'Unknown'
  const date = new Date(server.lastBackupAt)
  if (Number.isNaN(date.getTime())) return server.lastBackupStatus || 'Unknown'
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatDate = (value) => {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await refresh()
  startStatusStreams()
  minecraft.startPolling(20000)
})

onUnmounted(() => {
  minecraft.stopAllStatusStreams()
  minecraft.stopPolling()
})
</script>
