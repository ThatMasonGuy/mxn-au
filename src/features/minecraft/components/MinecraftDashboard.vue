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
              :class="minecraft.fallbackMode || statusStreamRecoveringCount ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'"
            >
              <span
                class="h-2 w-2 rounded-full"
                :class="minecraft.fallbackMode || statusStreamRecoveringCount ? 'bg-amber-300 animate-pulse' : 'bg-emerald-300'"
              />
              {{ minecraft.fallbackMode ? 'Snapshot' : statusStreamRecoveringCount ? `Recovering (${statusStreamRecoveringCount})` : statusStreamCount ? `Live (${statusStreamCount})` : 'Live' }}
            </span>

            <button
              class="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!minecraft.servers.length || checkingFleetMods"
              :title="checkingFleetMods ? `Checking ${fleetModCheckProgress.current || 'servers'}` : 'Check all servers for Modrinth updates'"
              @click="checkFleetModUpdates"
            >
              <PackageCheck class="h-4 w-4" :class="{ 'animate-pulse': checkingFleetMods }" />
              {{ fleetModCheckLabel }}
            </button>

            <button
              class="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!minecraft.servers.length || backingUpFleet"
              :title="backingUpFleet ? `Snapshotting ${fleetBackupProgress.current || 'servers'}` : 'Queue snapshots for all active worlds'"
              @click="backupFleetWorlds"
            >
              <Download class="h-4 w-4" :class="{ 'animate-pulse': backingUpFleet }" />
              {{ fleetBackupLabel }}
            </button>

            <button
              class="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!minecraft.servers.length || exportingSnapshot"
              title="Export fleet snapshot"
              @click="exportFleetSnapshot"
            >
              <Download class="h-4 w-4" :class="{ 'animate-pulse': exportingSnapshot }" />
              Snapshot
            </button>

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
                    {{ pendingRestartServers.map((server) => server.label).join(', ') }} need a restart or start before recent changes are fully applied.
                  </p>
                </div>
              </div>
              <button
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-amber-300/25 bg-amber-300/10 px-3 text-sm text-amber-50 hover:bg-amber-300/15"
                @click="openServer(pendingRestartServers[0].id, 'activity')"
              >
                Open
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div class="relative min-w-0 flex-1">
                <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  v-model="serverSearch"
                  class="h-10 w-full rounded-md border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
                  placeholder="Search servers"
                >
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in serverFilters"
                  :key="filter.id"
                  class="rounded-md px-3 py-2 text-xs transition"
                  :class="serverFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                  @click="serverFilter = filter.id"
                >
                  {{ filter.label }} {{ filter.count }}
                </button>
              </div>
            </div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 class="font-semibold text-white">Fleet Audit</h2>
                <p class="mt-1 text-sm text-slate-400">
                  {{ fleetAuditSummary.attention }} attention, {{ fleetAuditSummary.updates }} with updates, {{ fleetAuditSummary.restart }} pending restart
                </p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!minecraft.servers.length || checkingFleetDiagnostics"
                  :title="checkingFleetDiagnostics ? `Checking ${fleetDiagnosticsProgress.current || 'servers'}` : 'Run diagnostics for every server'"
                  @click="checkFleetDiagnostics"
                >
                  <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': checkingFleetDiagnostics }" />
                  {{ fleetDiagnosticsLabel }}
                </button>
                <button
                  class="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
                  @click="refresh"
                >
                  <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': minecraft.loading }" />
                  Audit
                </button>
              </div>
            </div>

            <div class="mt-4 overflow-hidden rounded-md border border-white/10">
              <div class="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] gap-3 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-wide text-slate-500 xl:grid">
                <span>Server</span>
                <span>Access</span>
                <span>Gameplay</span>
                <span>Mods</span>
                <span>Backup</span>
                <span class="text-right">Open</span>
              </div>
              <div v-for="row in fleetAuditRows" :key="row.id" class="grid gap-3 border-b border-white/10 p-3 last:border-b-0 xl:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] xl:items-center">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-semibold text-white">{{ row.label }}</span>
                    <span class="rounded-md px-2 py-1 text-xs" :class="row.toneClass">{{ row.status }}</span>
                  </div>
                  <div class="mt-1 truncate font-mono text-xs text-slate-500">{{ row.activeWorld }}</div>
                </div>

                <div class="text-sm">
                  <div class="text-slate-100">{{ row.accessMode }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ row.whitelistLabel }}</div>
                </div>

                <div class="text-sm">
                  <div class="text-slate-100">{{ row.difficulty }} · {{ row.maxPlayers }} slots</div>
                  <div class="mt-1 text-xs text-slate-500">{{ row.pvpLabel }}</div>
                </div>

                <div class="text-sm">
                  <div class="text-slate-100">{{ row.modsLabel }}</div>
                  <div class="mt-1 text-xs" :class="row.updateCount ? 'text-amber-200' : 'text-slate-500'">{{ row.updatesLabel }}</div>
                </div>

                <div class="text-sm">
                  <div class="text-slate-100">{{ row.backupLabel }}</div>
                  <div class="mt-1 text-xs" :class="row.backupOk ? 'text-slate-500' : 'text-amber-200'">{{ row.snapshotLabel }}</div>
                </div>

                <div class="flex flex-wrap justify-start gap-2 xl:justify-end">
                  <button class="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/[0.08]" @click="openServer(row.id, 'settings')">
                    Settings
                  </button>
                  <button class="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/[0.08]" @click="openServer(row.id, row.updateCount ? 'mods' : 'overview')">
                    {{ row.updateCount ? 'Mods' : 'Open' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <article
            v-for="server in visibleServers"
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
                  v-if="canStart(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="actionBusy(lifecycleActionKey(server, 'start'))"
                  @click="runLifecycle(server, 'start')"
                >
                  <Play class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(lifecycleActionKey(server, 'start')) }" />
                  Start
                </button>

                <button
                  v-if="canRestart(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-sky-400/25 bg-sky-400/10 px-3 text-sm text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="actionBusy(lifecycleActionKey(server, 'restart'))"
                  @click="runLifecycle(server, 'restart')"
                >
                  <RotateCw class="h-4 w-4" :class="{ 'animate-spin': actionBusy(lifecycleActionKey(server, 'restart')) }" />
                  Restart
                </button>

                <button
                  v-if="canStop(server)"
                  class="inline-flex h-9 items-center gap-2 rounded-md border border-rose-400/25 bg-rose-400/10 px-3 text-sm text-rose-100 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="actionBusy(lifecycleActionKey(server, 'stop'))"
                  @click="runLifecycle(server, 'stop')"
                >
                  <Square class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(lifecycleActionKey(server, 'stop')) }" />
                  Stop
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

          <div v-if="!visibleServers.length" class="rounded-md border border-white/10 bg-[#0f151d] p-6 text-center text-sm text-slate-500">
            No servers match.
          </div>
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
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500">{{ filteredActivity.length }}/{{ activityItems.length }}</span>
              <button
                class="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-rose-400/25 bg-rose-400/10 px-2.5 text-xs text-rose-100 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="!activityItems.length"
                @click="clearFleetActivity"
              >
                <Trash2 class="h-3.5 w-3.5" />
                Clear
              </button>
              <History class="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="filter in activityFilters"
              :key="filter.id"
              class="rounded-md px-2.5 py-1.5 text-xs transition"
              :class="activityFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
              @click="activityFilter = filter.id"
            >
              {{ filter.label }} {{ filter.count }}
            </button>
          </div>
          <div class="relative mt-3">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              v-model="activitySearch"
              class="h-9 w-full rounded-md border border-white/10 bg-black/30 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
              placeholder="Search activity"
            >
          </div>
          <div class="mt-4 space-y-2">
            <div v-if="!activityItems.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
              No panel activity yet.
            </div>
            <div v-else-if="!recentActivity.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
              No matching activity.
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cable,
  Download,
  Globe2,
  History,
  Moon,
  PackageCheck,
  Play,
  RefreshCcw,
  RotateCw,
  Search,
  Server,
  ShieldCheck,
  Square,
  Trash2,
  Users,
} from 'lucide-vue-next'
import { useMinecraftStore } from '@/features/minecraft/stores/useMinecraftStore'
import { useToast } from '@/shared/components/ui/toast'
import MetricBar from '@/features/minecraft/components/MetricBar.vue'

const router = useRouter()
const minecraft = useMinecraftStore()
const { toast } = useToast()
const actionLocks = ref(new Set())
const serverSearch = ref('')
const serverFilter = ref('all')
const activitySearch = ref('')
const activityFilter = ref('all')
const exportingSnapshot = ref(false)
const checkingFleetMods = ref(false)
const fleetModCheckProgress = ref({ done: 0, total: 0, current: '' })
const backingUpFleet = ref(false)
const fleetBackupProgress = ref({ done: 0, total: 0, current: '' })
const checkingFleetDiagnostics = ref(false)
const fleetDiagnosticsProgress = ref({ done: 0, total: 0, current: '' })
const activeServerStates = new Set(['alive', 'warming', 'stopping'])
const selected = computed(() => minecraft.selectedServer)
const pendingRestartServers = computed(() => minecraft.servers.filter((server) => restartReasonCount(server.id)))
const statusStreamCount = computed(() => minecraft.statusStreamingIds?.size || 0)
const statusStreamRecoveringCount = computed(() => minecraft.statusStreamRetryingIds?.size || 0)
const fleetModCheckLabel = computed(() => {
  if (!checkingFleetMods.value) return 'Check Mods'
  const { done, total } = fleetModCheckProgress.value
  return `Mods ${done}/${total}`
})
const fleetBackupLabel = computed(() => {
  if (!backingUpFleet.value) return 'Backup All'
  const { done, total } = fleetBackupProgress.value
  return `Backups ${done}/${total}`
})
const fleetDiagnosticsLabel = computed(() => {
  if (!checkingFleetDiagnostics.value) return 'Diagnostics'
  const { done, total } = fleetDiagnosticsProgress.value
  return `Diagnostics ${done}/${total}`
})
const serverFilters = computed(() => {
  const servers = minecraft.servers
  return [
    { id: 'all', label: 'All', count: servers.length },
    { id: 'active', label: 'Active', count: servers.filter((server) => activeServerStates.has(server.state)).length },
    { id: 'sleeping', label: 'Sleeping', count: servers.filter((server) => server.state === 'hibernating').length },
    { id: 'attention', label: 'Attention', count: servers.filter((server) => server.state === 'degraded' || restartReasonCount(server.id)).length },
    { id: 'updates', label: 'Updates', count: servers.filter((server) => Number(server.updateCount || 0) > 0).length },
  ]
})
const visibleServers = computed(() => {
  const query = serverSearch.value.trim().toLowerCase()
  return minecraft.servers.filter((server) => serverMatchesFilter(server) && serverMatchesSearch(server, query))
})
const activityItems = computed(() => minecraft.activityFeed)
const activityFilters = computed(() => {
  const items = activityItems.value
  return [
    { id: 'all', label: 'All', count: items.length },
    { id: 'attention', label: 'Attention', count: items.filter((entry) => ['error', 'warning', 'failed'].includes(entry.status)).length },
    { id: 'restart', label: 'Restart', count: items.filter((entry) => entry.restartRequired).length },
    { id: 'lifecycle', label: 'Lifecycle', count: items.filter((entry) => entry.type === 'lifecycle').length },
    { id: 'mods', label: 'Mods', count: items.filter((entry) => entry.type === 'mods').length },
    { id: 'players', label: 'Players', count: items.filter((entry) => entry.type === 'players').length },
  ]
})
const filteredActivity = computed(() => {
  const query = activitySearch.value.trim().toLowerCase()
  return activityItems.value.filter((entry) => activityMatchesFilter(entry) && activityMatchesSearch(entry, query))
})
const recentActivity = computed(() => filteredActivity.value.slice(0, 8))
const fleetAuditRows = computed(() => minecraft.servers.map((server) => {
  const detail = minecraft.serverDetails?.[server.id] || server
  const settings = detail.settings || server.settings || {}
  const maintenance = detail.maintenance || server.maintenance || {}
  const mods = detail.mods || []
  const backups = detail.backups || []
  const updateCount = Number(detail.updateCount ?? server.updateCount ?? mods.filter((mod) => mod.updateAvailable).length)
  const restartCount = restartReasonCount(server.id)
  const backupStatus = detail.lastBackupStatus || detail.backup?.status || backups[0]?.status || server.lastBackupStatus || 'unknown'
  const backupOk = backupStatus === 'success' && maintenance.latestBackupToday !== false
  const whitelistEnabled = asBoolean(settings['white-list'], detail.accessMode === 'whitelist' || server.accessMode === 'whitelist')
  const enforceWhitelist = asBoolean(settings['enforce-whitelist'], false)
  const disabledMods = Number(detail.disabledModCount ?? mods.filter((mod) => mod.enabled === false).length ?? 0)

  const status = auditStatus(server, {
    backupOk,
    restartCount,
    updateCount,
  })

  return {
    id: server.id,
    label: server.label,
    activeWorld: detail.activeWorld || server.activeWorld || '',
    status: status.label,
    toneClass: status.toneClass,
    attention: status.attention,
    accessMode: whitelistEnabled ? 'Whitelist' : 'Open access',
    whitelistLabel: `${enforceWhitelist ? 'Enforced' : 'Not enforced'} · ${(detail.whitelist || []).length} allowed · ${(detail.ops || []).length} OPs`,
    difficulty: String(settings.difficulty || 'normal'),
    maxPlayers: Number(settings['max-players'] || detail.maxPlayers || server.maxPlayers || 0),
    pvpLabel: asBoolean(settings.pvp, true) ? 'PvP enabled' : 'PvP disabled',
    modsLabel: `${detail.modCount ?? server.modCount ?? mods.length} mods${disabledMods ? ` · ${disabledMods} disabled` : ''}`,
    updateCount,
    updatesLabel: updateCount ? `${updateCount} updates available` : 'No known updates',
    backupLabel: backupLabel(detail),
    backupOk,
    snapshotLabel: maintenance.latestBackupToday ? 'Snapshot done today' : maintenance.latestBackupToday === false ? 'Snapshot waiting' : backupStatus,
  }
}))
const fleetAuditSummary = computed(() => fleetAuditRows.value.reduce((summary, row) => {
  if (row.attention) summary.attention += 1
  if (row.updateCount) summary.updates += 1
  if (restartReasonCount(row.id)) summary.restart += 1
  return summary
}, {
  attention: 0,
  updates: 0,
  restart: 0,
}))

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

const checkFleetModUpdates = async () => {
  const targets = [...minecraft.servers]
  if (!targets.length || checkingFleetMods.value) return

  checkingFleetMods.value = true
  fleetModCheckProgress.value = { done: 0, total: targets.length, current: targets[0]?.label || '' }
  const failures = []

  try {
    for (const [index, server] of targets.entries()) {
      fleetModCheckProgress.value = {
        done: index,
        total: targets.length,
        current: server.label || server.id,
      }

      try {
        await minecraft.checkModUpdates(server.id)
      } catch (error) {
        failures.push(`${server.label || server.id}: ${errorMessage(error)}`)
      }

      fleetModCheckProgress.value = {
        done: index + 1,
        total: targets.length,
        current: server.label || server.id,
      }
    }

    if (failures.length) {
      toast({
        title: 'Fleet mod check finished with issues',
        description: failures.slice(0, 2).join(' | '),
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Fleet mod check complete',
        description: `${targets.length} servers checked`,
        variant: 'success',
      })
    }
  } finally {
    checkingFleetMods.value = false
  }
}

const backupFleetWorlds = async () => {
  const targets = [...minecraft.servers]
  if (!targets.length || backingUpFleet.value) return

  const ok = window.confirm(`Queue active-world snapshots for ${targets.length} Minecraft servers?`)
  if (!ok) return

  backingUpFleet.value = true
  fleetBackupProgress.value = { done: 0, total: targets.length, current: targets[0]?.label || '' }
  const failures = []

  try {
    for (const [index, server] of targets.entries()) {
      fleetBackupProgress.value = {
        done: index,
        total: targets.length,
        current: server.label || server.id,
      }

      try {
        await minecraft.backupWorld(server.id)
      } catch (error) {
        failures.push(`${server.label || server.id}: ${errorMessage(error)}`)
      }

      fleetBackupProgress.value = {
        done: index + 1,
        total: targets.length,
        current: server.label || server.id,
      }
    }

    if (failures.length) {
      toast({
        title: 'Fleet backup finished with issues',
        description: failures.slice(0, 2).join(' | '),
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Fleet backup queued',
        description: `${targets.length} active-world snapshots requested`,
        variant: 'success',
      })
    }
  } finally {
    backingUpFleet.value = false
  }
}

const checkFleetDiagnostics = async () => {
  const targets = [...minecraft.servers]
  if (!targets.length || checkingFleetDiagnostics.value) return

  checkingFleetDiagnostics.value = true
  fleetDiagnosticsProgress.value = { done: 0, total: targets.length, current: targets[0]?.label || '' }
  const failures = []

  try {
    for (const [index, server] of targets.entries()) {
      fleetDiagnosticsProgress.value = {
        done: index,
        total: targets.length,
        current: server.label || server.id,
      }

      try {
        await minecraft.fetchDiagnostics(server.id)
      } catch (error) {
        failures.push(`${server.label || server.id}: ${errorMessage(error)}`)
      }

      fleetDiagnosticsProgress.value = {
        done: index + 1,
        total: targets.length,
        current: server.label || server.id,
      }
    }

    if (failures.length) {
      toast({
        title: 'Fleet diagnostics finished with issues',
        description: failures.slice(0, 2).join(' | '),
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Fleet diagnostics complete',
        description: `${targets.length} servers checked`,
        variant: 'success',
      })
    }
  } finally {
    checkingFleetDiagnostics.value = false
  }
}

const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const exportFleetSnapshot = () => {
  exportingSnapshot.value = true
  try {
    const exportedAt = new Date().toISOString()
    const servers = minecraft.servers.map((server) => ({
      id: server.id,
      label: server.label,
      state: server.state,
      host: server.host,
      service: server.service,
      activeWorld: server.activeWorld,
      playersOnline: server.playersOnline,
      maxPlayers: server.maxPlayers,
      modCount: server.modCount,
      updateCount: server.updateCount,
      restartRequired: restartReasonCount(server.id) > 0,
      restartReasons: minecraft.restartReasonsForServer(server.id),
      lastBackupAt: server.lastBackupAt,
      lastBackupStatus: server.lastBackupStatus,
      maintenance: server.maintenance,
      ports: {
        public: server.publicPort,
        backend: server.backendPort,
        rcon: server.rconPort,
      },
      vitals: {
        cpu: server.cpu,
        memory: server.memory,
        disk: server.disk,
        uptimeSeconds: server.uptimeSeconds,
      },
    }))
    const payload = {
      exportedAt,
      endpoint: minecraft.apiEndpoint,
      fallbackMode: minecraft.fallbackMode,
      fallbackReason: minecraft.fallbackReason,
      totals: minecraft.totals,
      filters: {
        server: serverFilter.value,
        search: serverSearch.value.trim(),
        activity: activityFilter.value,
        activitySearch: activitySearch.value.trim(),
      },
      selectedServerId: selected.value?.id || '',
      visibleServerIds: visibleServers.value.map((server) => server.id),
      statusStreamCount: statusStreamCount.value,
      statusStreamRecoveringCount: statusStreamRecoveringCount.value,
      servers,
      audit: fleetAuditRows.value,
      recentActivity: filteredActivity.value.slice(0, 40),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' })
    const stamp = exportedAt.replace(/[:.]/g, '-')
    triggerDownload(blob, `minecraft-fleet-snapshot-${stamp}.json`)
    toast({
      title: 'Fleet snapshot ready',
      description: `${servers.length} servers exported`,
      variant: 'success',
    })
  } finally {
    exportingSnapshot.value = false
  }
}

const clearFleetActivity = () => {
  if (!activityItems.value.length) return
  const ok = window.confirm(`Clear ${activityItems.value.length} Minecraft activity entries? This only clears panel history in this browser.`)
  if (!ok) return
  const cleared = minecraft.clearActivity()
  toast({
    title: 'Activity cleared',
    description: `${cleared} entries removed`,
    variant: 'success',
  })
}

const selectServer = async (serverId) => {
  minecraft.setSelectedServer(serverId)
  await runWithToast(
    () => minecraft.fetchServer(serverId),
    { error: 'Server refresh failed' },
  )
}

const openServer = (serverId, tab = '') => {
  router.push({
    path: `/minecraft/${serverId}`,
    query: tab ? { tab } : {},
  })
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
const asBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

const auditStatus = (server, facts = {}) => {
  if (server.state === 'degraded') {
    return {
      label: 'Degraded',
      toneClass: 'bg-rose-400/10 text-rose-200',
      attention: true,
    }
  }
  if (facts.restartCount) {
    return {
      label: 'Restart',
      toneClass: 'bg-amber-400/10 text-amber-200',
      attention: true,
    }
  }
  if (!facts.backupOk) {
    return {
      label: 'Backup',
      toneClass: 'bg-amber-400/10 text-amber-200',
      attention: true,
    }
  }
  if (facts.updateCount) {
    return {
      label: 'Updates',
      toneClass: 'bg-violet-400/10 text-violet-200',
      attention: true,
    }
  }
  return {
    label: 'Ready',
    toneClass: 'bg-emerald-400/10 text-emerald-200',
    attention: false,
  }
}

const actionKey = (...parts) => parts.map((part) => String(part ?? '').trim()).filter(Boolean).join(':')
const lifecycleActionKey = (server, action) => actionKey(server?.id, 'lifecycle', action)
const actionBusy = (key) => actionLocks.value.has(key)
const withActionLock = async (key, action) => {
  if (!key) return action()
  if (actionBusy(key)) return null

  actionLocks.value = new Set([...actionLocks.value, key])
  try {
    return await action()
  } finally {
    const next = new Set(actionLocks.value)
    next.delete(key)
    actionLocks.value = next
  }
}

const activityServerLabel = (entry) => {
  return minecraft.servers.find((server) => server.id === entry.serverId)?.label || entry.serverId
}

const activityMatchesFilter = (entry) => {
  if (activityFilter.value === 'attention') return ['error', 'warning', 'failed'].includes(entry.status)
  if (activityFilter.value === 'restart') return entry.restartRequired
  if (activityFilter.value === 'all') return true
  return entry.type === activityFilter.value
}

const activityMatchesSearch = (entry, query) => {
  if (!query) return true
  return [
    entry?.label,
    entry?.summary,
    entry?.status,
    entry?.type,
    entry?.target,
    entry?.actor,
    activityServerLabel(entry),
  ].some((value) => String(value || '').toLowerCase().includes(query))
}

const serverMatchesFilter = (server) => {
  if (serverFilter.value === 'active') return activeServerStates.has(server.state)
  if (serverFilter.value === 'sleeping') return server.state === 'hibernating'
  if (serverFilter.value === 'attention') return server.state === 'degraded' || restartReasonCount(server.id)
  if (serverFilter.value === 'updates') return Number(server.updateCount || 0) > 0
  return true
}

const serverMatchesSearch = (server, query) => {
  if (!query) return true
  return [
    server?.label,
    server?.id,
    server?.host,
    server?.service,
    server?.activeWorld,
    server?.publicPort,
    server?.backendPort,
    server?.rconPort,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}

const runLifecycle = async (server, action) => {
  await withActionLock(lifecycleActionKey(server, action), async () => {
    let confirmed = false
    if (['sleep', 'stop', 'restart'].includes(action)) {
      const ok = window.confirm(`${action.toUpperCase()} ${server.label}?`)
      if (!ok) return null
      confirmed = true
    }

    return runWithToast(
      () => minecraft.lifecycleAction(server.id, action, confirmed),
      {
        success: `${actionLabel(action)} requested`,
        description: server.label,
        error: `${actionLabel(action)} failed`,
      },
    )
  })
}

const actionLabel = (action) => `${action.slice(0, 1).toUpperCase()}${action.slice(1)}`

const canStart = (server) => ['offline', 'hibernating', 'degraded'].includes(server?.state)
const canRestart = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)
const canStop = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)

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
