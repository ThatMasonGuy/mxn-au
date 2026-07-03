<template>
  <div class="min-h-screen bg-[#090d12] text-slate-100">
    <header class="sticky top-0 z-20 border-b border-white/10 bg-[#0c1118]/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <button
              class="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08]"
              title="Back to servers"
              @click="router.push('/minecraft')"
            >
              <ArrowLeft class="h-4 w-4" />
            </button>

            <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/25">
              <img
                v-if="detailIcon"
                :src="detailIcon"
                :alt="`${detail?.label || serverId} icon`"
                class="h-full w-full object-cover [image-rendering:pixelated]"
              />
              <span v-else class="font-mono text-sm font-semibold text-emerald-100">{{ serverInitials(detail) }}</span>
            </div>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="truncate text-xl font-semibold tracking-tight text-white">{{ detail?.label || serverId }}</h1>
                <span v-if="detail" class="rounded-md px-2 py-1 text-xs font-medium" :class="stateMeta(detail.state).pill">
                  {{ stateMeta(detail.state).label }}
                </span>
                <span v-if="restartRequired" class="inline-flex items-center gap-1.5 rounded-md bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-200">
                  <AlertTriangle class="h-3.5 w-3.5" />
                  Restart pending
                </span>
                <span class="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-slate-300">{{ serverId }}</span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span class="inline-flex items-center gap-1.5"><Globe2 class="h-3.5 w-3.5" />{{ detail?.host }}</span>
                <span class="inline-flex items-center gap-1.5"><Boxes class="h-3.5 w-3.5" />{{ detail?.loader }} {{ detail?.version }}</span>
                <span class="inline-flex items-center gap-1.5"><FolderRoot class="h-3.5 w-3.5" />{{ detail?.activeWorld }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-if="detail"
              class="inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm"
              :class="statusStreaming ? 'border-sky-400/25 bg-sky-400/10 text-sky-100' : 'border-white/10 bg-white/[0.04] text-slate-300'"
            >
              <span class="h-2 w-2 rounded-full" :class="statusStreaming ? 'bg-sky-300 animate-pulse' : 'bg-slate-500'" />
              {{ statusStreaming ? 'Status live' : 'Status polling' }}
            </span>

            <span
              v-if="detail"
              class="inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm"
              :class="logStreaming ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100' : 'border-white/10 bg-white/[0.04] text-slate-300'"
            >
              <span class="h-2 w-2 rounded-full" :class="logStreaming ? 'bg-emerald-300 animate-pulse' : 'bg-slate-500'" />
              {{ logStreaming ? 'Logs live' : 'Logs polling' }}
            </span>

            <button
              class="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 transition hover:border-white/20 hover:bg-white/[0.08]"
              title="Refresh server"
              @click="refresh"
            >
              <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': refreshing }" />
              Refresh
            </button>

            <button
              v-if="detail && canWake(detail)"
              class="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="actionBusy(lifecycleActionKey('wake'))"
              @click="runLifecycle('wake')"
            >
              <Play class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(lifecycleActionKey('wake')) }" />
              Wake
            </button>

            <button
              v-if="detail && canRestart(detail)"
              class="inline-flex h-10 items-center gap-2 rounded-md border border-sky-400/25 bg-sky-400/10 px-3 text-sm text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="actionBusy(lifecycleActionKey('restart'))"
              @click="runLifecycle('restart')"
            >
              <RotateCw class="h-4 w-4" :class="{ 'animate-spin': actionBusy(lifecycleActionKey('restart')) }" />
              Restart
            </button>

            <button
              v-if="detail && canSleep(detail)"
              class="inline-flex h-10 items-center gap-2 rounded-md border border-rose-400/25 bg-rose-400/10 px-3 text-sm text-rose-100 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="actionBusy(lifecycleActionKey('sleep'))"
              @click="runLifecycle('sleep')"
            >
              <Square class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(lifecycleActionKey('sleep')) }" />
              Sleep
            </button>
          </div>
        </div>

        <div v-if="minecraft.fallbackMode" class="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
          API bridge unavailable: {{ minecraft.fallbackReason || 'using local registry snapshot' }}
        </div>

        <div v-if="minecraft.error" class="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-100">
          {{ minecraft.error }}
        </div>

        <div v-if="restartRequired" class="rounded-md border border-amber-400/25 bg-amber-400/10 p-3">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex min-w-0 gap-3">
              <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
              <div class="min-w-0">
                <div class="font-semibold text-amber-50">Restart required</div>
                <p class="mt-1 text-sm text-amber-100/80">
                  {{ pendingRestartReasons.length }} pending {{ pendingRestartReasons.length === 1 ? 'change' : 'changes' }} will apply after this server restarts or wakes.
                </p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="settings-btn" @click="activeTab = 'activity'">
                <Activity class="h-4 w-4" />
                Activity
              </button>
              <button
                class="settings-btn primary"
                :disabled="!detail || (!canRestart(detail) && !canWake(detail)) || actionBusy(lifecycleActionKey(canWake(detail) ? 'wake' : 'restart'))"
                @click="applyPendingRestart"
              >
                <RotateCw class="h-4 w-4" :class="{ 'animate-spin': actionBusy(lifecycleActionKey(canWake(detail) ? 'wake' : 'restart')) }" />
                {{ canWake(detail) ? 'Wake' : 'Restart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="!detail" class="rounded-md border border-white/10 bg-white/[0.04] p-8 text-center text-slate-300">
        Loading server...
      </div>

      <template v-else>
        <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Lifecycle</span>
              <Activity class="h-4 w-4 text-emerald-300" />
            </div>
            <div class="mt-3 flex items-end justify-between gap-3">
              <div class="text-2xl font-semibold text-white">{{ stateMeta(detail.state).label }}</div>
              <div class="text-right text-xs text-slate-500">{{ formatDate(detail.stateSince) }}</div>
            </div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Players</span>
              <Users class="h-4 w-4 text-sky-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ detail.playersOnline }}/{{ detail.maxPlayers }}</div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Uptime</span>
              <Clock3 class="h-4 w-4 text-violet-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ formatDuration(detail.uptimeSeconds) }}</div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm text-slate-400">Mod Updates</span>
              <PackageCheck class="h-4 w-4 text-amber-300" />
            </div>
            <div class="mt-3 text-2xl font-semibold text-white">{{ updateCount }}</div>
          </div>
        </section>

        <nav class="mt-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition"
            :class="activeTab === tab.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </nav>

        <section v-if="activeTab === 'overview'" class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div class="space-y-6">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Vitals</h2>
              <div class="mt-4 grid gap-5 md:grid-cols-3">
                <MetricBar label="CPU" :value="detail.cpu || 0" tone="emerald" />
                <MetricBar label="Memory" :value="detail.memory || 0" tone="sky" />
                <MetricBar label="Disk" :value="detail.disk || 0" tone="violet" />
              </div>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-semibold text-white">Recent Logs</h2>
                <button class="text-sm text-sky-200 hover:text-sky-100" @click="activeTab = 'logs'">Open explorer</button>
              </div>
              <div ref="overviewLogsRef" class="mt-4 max-h-64 overflow-auto rounded-md border border-white/10 bg-black/30 p-3 font-mono text-xs leading-6 text-slate-300">
                <div v-for="(line, index) in latestLogs" :key="index" class="whitespace-pre-wrap">{{ line }}</div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Server</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Service</dt>
                  <dd class="text-right font-mono text-slate-100">{{ detail.service }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Public</dt>
                  <dd class="font-mono text-slate-100">{{ detail.publicPort }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Backend</dt>
                  <dd class="font-mono text-slate-100">{{ detail.backendPort }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">RCON</dt>
                  <dd class="font-mono text-slate-100">{{ detail.rconPort }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Maintenance</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Daily restart</dt>
                  <dd class="font-mono text-slate-100">{{ detail.maintenance?.dailyRestart || 'Unknown' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Snapshots kept</dt>
                  <dd class="font-mono text-slate-100">{{ detail.maintenance?.localSnapshotRetention || 'Unknown' }}</dd>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <dt class="text-slate-400">Cron</dt>
                  <dd class="rounded-md px-2 py-1 text-xs" :class="maintenanceCronTone(detail.maintenance)">
                    {{ maintenanceCronLabel(detail.maintenance) }}
                  </dd>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <dt class="text-slate-400">Today snapshot</dt>
                  <dd class="rounded-md px-2 py-1 text-xs" :class="maintenanceSnapshotTone(detail.maintenance)">
                    {{ maintenanceSnapshotLabel(detail.maintenance) }}
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Last backup</dt>
                  <dd class="text-right text-slate-100">{{ formatDate(detail.maintenance?.latestBackup?.createdAt || detail.lastBackupAt) }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-semibold text-white">Backups</h2>
                <button
                  class="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-100 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="actionBusy(namedActionKey('world', 'active', 'backup'))"
                  @click="backupWorld"
                >
                  Snapshot
                </button>
              </div>
              <div class="mt-4 space-y-2">
                <div v-for="backup in detail.backups" :key="backup.id" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm">
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-medium text-white">{{ backup.label }}</span>
                    <span class="rounded-md px-2 py-1 text-xs" :class="backup.status === 'success' ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'">
                      {{ backup.status }}
                    </span>
                  </div>
                  <div class="mt-2 flex justify-between gap-3 text-xs text-slate-400">
                    <span>{{ formatDate(backup.createdAt) }}</span>
                    <span>{{ backup.size }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section v-if="activeTab === 'console'" class="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <h2 class="font-semibold text-white">RCON</h2>
              <span class="rounded-md px-2 py-1 text-xs" :class="rconReady ? 'bg-emerald-400/10 text-emerald-200' : 'bg-slate-400/10 text-slate-300'">
                {{ rconReady ? 'Ready' : 'Unavailable' }}
              </span>
            </div>

            <div ref="consoleRef" class="mt-4 h-[440px] overflow-auto rounded-md border border-white/10 bg-black/40 p-3 font-mono text-xs leading-6 text-slate-300">
              <div v-for="(line, index) in latestLogs" :key="index" class="whitespace-pre-wrap">{{ line }}</div>
            </div>

            <form class="mt-4 flex gap-2" @submit.prevent="submitCommand">
              <input
                v-model="command"
                class="h-11 min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50"
                placeholder="list"
                :disabled="!rconReady"
              >
              <button
                class="inline-flex h-11 items-center gap-2 rounded-md border border-sky-400/25 bg-sky-400/10 px-4 text-sm text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="!command.trim() || !rconReady || actionBusy(namedActionKey('rcon', 'command', 'send'))"
              >
                <Send class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(namedActionKey('rcon', 'command', 'send')) }" />
                Send
              </button>
            </form>
          </div>

          <aside class="space-y-4">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Commands</h2>
              <div class="mt-3 grid gap-2">
                <button
                  v-for="item in detail.allowedCommands"
                  :key="item.name"
                  class="rounded-md border px-3 py-2 text-left hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  :class="commandTone(item.risk)"
                  :title="item.description"
                  :disabled="!rconReady"
                  @click="applyCommandTemplate(item)"
                >
                  <div class="flex items-center justify-between gap-3">
                    <span class="font-mono text-xs text-slate-100">{{ item.name }}</span>
                    <span class="rounded-md bg-black/20 px-2 py-0.5 text-[11px] uppercase">{{ item.risk || 'safe' }}</span>
                  </div>
                  <div v-if="item.description" class="mt-1 text-xs text-slate-400">{{ item.description }}</div>
                </button>
              </div>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex items-center justify-between gap-3">
                <h2 class="font-semibold text-white">History</h2>
                <span class="text-xs text-slate-500">{{ visibleCommandHistory.length }}/{{ commandHistoryItems.length }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="filter in commandHistoryFilters"
                  :key="filter.id"
                  class="rounded-md px-2.5 py-1.5 text-xs transition"
                  :class="commandHistoryFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                  @click="commandHistoryFilter = filter.id"
                >
                  {{ filter.label }} {{ filter.count }}
                </button>
              </div>
              <input
                v-model="commandHistorySearch"
                class="mt-3 h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
                placeholder="Search history"
              >
              <div class="mt-3 space-y-2">
                <button
                  v-for="entry in visibleCommandHistory"
                  :key="`${entry.timestamp}-${entry.command}`"
                  class="w-full rounded-md border border-white/10 bg-black/20 p-3 text-left hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black/20"
                  :disabled="!rconReady"
                  @click="applyHistoryCommand(entry)"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0 truncate font-mono text-xs text-slate-100">{{ entry.command }}</div>
                    <span class="shrink-0 rounded-md px-2 py-0.5 text-[11px] uppercase" :class="commandRiskPillTone(commandRisk(entry.command))">
                      {{ commandRisk(entry.command) }}
                    </span>
                  </div>
                  <div class="mt-1 truncate text-xs text-slate-500">{{ entry.output }}</div>
                </button>
                <div v-if="!commandHistoryItems.length" class="text-sm text-slate-500">No commands yet.</div>
                <div v-else-if="!visibleCommandHistory.length" class="text-sm text-slate-500">No matching commands.</div>
              </div>
            </div>
          </aside>
        </section>

        <section v-if="activeTab === 'players'" class="mt-6 space-y-4">
          <div class="flex flex-col gap-3 rounded-md border border-white/10 bg-[#0f151d] p-4 md:flex-row md:items-center md:justify-between">
            <div class="flex min-w-0 flex-1 gap-2">
              <input
                v-model="playerSearch"
                class="h-10 min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
                placeholder="Search players"
              >
              <input
                v-model="newPlayerName"
                class="h-10 w-44 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
                placeholder="Player name"
              >
            </div>
            <button
              class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!newPlayerName.trim() || actionBusy(namedActionKey('whitelist', newPlayerName, 'add'))"
              @click="addWhitelist"
            >
              <UserPlus class="h-4 w-4" />
              Whitelist
            </button>
          </div>

          <div class="flex flex-wrap gap-2 rounded-md border border-white/10 bg-[#0f151d] p-3">
            <button
              v-for="filter in playerFilters"
              :key="filter.id"
              class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
              :class="playerFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
              @click="playerFilter = filter.id"
            >
              <span>{{ filter.label }}</span>
              <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
            </button>
          </div>

          <div class="overflow-hidden rounded-md border border-white/10 bg-[#0f151d]">
            <div v-if="!filteredPlayers.length" class="border-b border-white/10 p-4 text-sm text-slate-500">
              No players match this filter.
            </div>
            <div v-for="player in filteredPlayers" :key="player.uuid || player.name" class="grid gap-3 border-b border-white/10 p-4 last:border-b-0 lg:grid-cols-[1fr_auto] lg:items-center">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold text-white">{{ player.name }}</span>
                  <span v-if="player.online" class="rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">Online</span>
                  <span v-if="player.op" class="rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-200">OP</span>
                  <span v-if="player.whitelisted" class="rounded-md bg-sky-400/10 px-2 py-1 text-xs text-sky-200">Whitelist</span>
                  <span v-if="player.banned" class="rounded-md bg-rose-400/10 px-2 py-1 text-xs text-rose-200">Banned</span>
                </div>
                <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>{{ player.permission }}</span>
                  <span v-if="player.op">Level {{ player.opLevel || 4 }}</span>
                  <span v-if="player.bypassesPlayerLimit">Bypasses cap</span>
                  <span>{{ player.lastSeen }}</span>
                  <span class="font-mono">{{ player.uuid }}</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <select
                  v-if="player.op"
                  class="h-9 rounded-md border border-white/10 bg-black/30 px-2 text-sm text-slate-100 outline-none focus:border-amber-400/50"
                  :value="player.opLevel || 4"
                  title="OP level"
                  :disabled="actionBusy(playerActionKey(player, 'op-level'))"
                  @change="changeOpLevel(player, $event)"
                >
                  <option :value="1">OP 1</option>
                  <option :value="2">OP 2</option>
                  <option :value="3">OP 3</option>
                  <option :value="4">OP 4</option>
                </select>
                <button v-if="player.op" class="player-btn" :disabled="actionBusy(playerActionKey(player, 'op-bypass'))" @click="toggleOpBypass(player)">
                  <ShieldCheck class="h-3.5 w-3.5" />
                  {{ player.bypassesPlayerLimit ? 'Cap On' : 'Bypass Cap' }}
                </button>
                <button class="player-btn" :disabled="actionBusy(playerActionKey(player, player.op ? 'deop' : 'op'))" @click="runPlayerAction(player, player.op ? 'deop' : 'op')">
                  <Crown class="h-3.5 w-3.5" />
                  {{ player.op ? 'Deop' : 'Op' }}
                </button>
                <button class="player-btn" :disabled="actionBusy(playerActionKey(player, 'whitelist'))" @click="toggleWhitelist(player)">
                  <ShieldCheck class="h-3.5 w-3.5" />
                  {{ player.whitelisted ? 'Remove' : 'Allow' }}
                </button>
                <button class="player-btn" :disabled="!player.online || actionBusy(playerActionKey(player, 'kick'))" @click="runPlayerAction(player, 'kick')">
                  <LogOut class="h-3.5 w-3.5" />
                  Kick
                </button>
                <button class="player-btn danger" :disabled="actionBusy(playerActionKey(player, player.banned ? 'pardon' : 'ban'))" @click="runPlayerAction(player, player.banned ? 'pardon' : 'ban')">
                  <Ban class="h-3.5 w-3.5" />
                  {{ player.banned ? 'Pardon' : 'Ban' }}
                </button>
              </div>
            </div>
          </div>

          <div class="grid gap-4 xl:grid-cols-2">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 class="font-semibold text-white">Player Blacklist</h2>
                  <p class="mt-1 text-sm text-slate-400">{{ bannedPlayersList.length }} banned players</p>
                </div>
                <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="addPlayerBlacklist">
                  <input
                    v-model="newBlacklistName"
                    class="h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/50"
                    placeholder="Player name"
                  >
                  <input
                    v-model="blacklistReason"
                    class="h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/50"
                    placeholder="Reason"
                  >
                  <button class="player-btn danger" :disabled="!newBlacklistName.trim() || actionBusy(namedActionKey('blacklist-player', newBlacklistName, 'add'))">
                    <Ban class="h-3.5 w-3.5" />
                    Ban
                  </button>
                </form>
              </div>

              <div class="mt-4 space-y-2">
                <div v-if="!bannedPlayersList.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  No banned players.
                </div>
                <div v-for="entry in bannedPlayersList" :key="displayBanName(entry)" class="flex flex-col gap-3 rounded-md border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0">
                    <div class="font-medium text-white">{{ displayBanName(entry) }}</div>
                    <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{{ entry.reason || 'No reason' }}</span>
                      <span>{{ formatDate(entry.created) }}</span>
                    </div>
                  </div>
                  <button class="player-btn" :disabled="actionBusy(namedActionKey('blacklist-player', displayBanName(entry), 'remove'))" @click="removePlayerBlacklist(entry)">
                    <ShieldCheck class="h-3.5 w-3.5" />
                    Pardon
                  </button>
                </div>
              </div>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 class="font-semibold text-white">IP Blacklist</h2>
                  <p class="mt-1 text-sm text-slate-400">{{ bannedIpsList.length }} banned addresses</p>
                </div>
                <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="addIpBlacklist">
                  <input
                    v-model="newBlacklistIp"
                    class="h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/50"
                    placeholder="IP address"
                  >
                  <input
                    v-model="blacklistReason"
                    class="h-10 rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-rose-400/50"
                    placeholder="Reason"
                  >
                  <button class="player-btn danger" :disabled="!newBlacklistIp.trim() || actionBusy(namedActionKey('blacklist-ip', newBlacklistIp, 'add'))">
                    <Ban class="h-3.5 w-3.5" />
                    Ban
                  </button>
                </form>
              </div>

              <div class="mt-4 space-y-2">
                <div v-if="!bannedIpsList.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  No banned IPs.
                </div>
                <div v-for="entry in bannedIpsList" :key="displayBanIp(entry)" class="flex flex-col gap-3 rounded-md border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="min-w-0">
                    <div class="font-mono font-medium text-white">{{ displayBanIp(entry) }}</div>
                    <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{{ entry.reason || 'No reason' }}</span>
                      <span>{{ formatDate(entry.created) }}</span>
                    </div>
                  </div>
                  <button class="player-btn" :disabled="actionBusy(namedActionKey('blacklist-ip', displayBanIp(entry), 'remove'))" @click="removeIpBlacklist(entry)">
                    <ShieldCheck class="h-3.5 w-3.5" />
                    Pardon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'mods'" class="mt-6 space-y-4">
          <div class="flex flex-col gap-3 rounded-md border border-white/10 bg-[#0f151d] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="font-semibold text-white">Mods</h2>
              <p class="mt-1 text-sm text-slate-400">{{ enabledMods }} enabled, {{ disabledMods }} disabled</p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row">
              <input
                ref="modUploadInput"
                class="hidden"
                type="file"
                accept=".jar,application/java-archive"
                @change="uploadSelectedMod"
              >
              <form class="flex min-w-0 gap-2" @submit.prevent="searchMods">
                <input
                  v-model="modSearch"
                  class="h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50 sm:w-64"
                  placeholder="Search Modrinth"
                >
                <button class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-violet-400/25 bg-violet-400/10 px-3 text-sm text-violet-100 hover:bg-violet-400/15 disabled:cursor-not-allowed disabled:opacity-40" :disabled="!modSearch.trim() || minecraft.modSearchLoading">
                  <SearchCheck class="h-4 w-4" :class="{ 'animate-pulse': minecraft.modSearchLoading }" />
                  Search
                </button>
              </form>
              <button
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="uploadingMod"
                @click="selectModUpload"
              >
                <UploadCloud class="h-4 w-4" :class="{ 'animate-pulse': uploadingMod }" />
                Upload
              </button>
              <button
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="actionBusy(namedActionKey('mods', 'updates', 'check'))"
                @click="checkModUpdates"
              >
                <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': actionBusy(namedActionKey('mods', 'updates', 'check')) }" />
                Updates
              </button>
              <button
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-amber-400/25 bg-amber-400/10 px-3 text-sm text-amber-100 hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="!updateCount || updatingAllMods || actionBusy(namedActionKey('mods', 'updates', 'all'))"
                @click="updateAllMods"
              >
                <Download class="h-4 w-4" :class="{ 'animate-pulse': updatingAllMods || actionBusy(namedActionKey('mods', 'updates', 'all')) }" />
                Update All
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-3 rounded-md border border-white/10 bg-[#0f151d] p-3 md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in installedModFilters"
                :key="filter.id"
                class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
                :class="installedModFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                @click="installedModFilter = filter.id"
              >
                <span>{{ filter.label }}</span>
                <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
              </button>
            </div>
            <input
              v-model="installedModSearch"
              class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50 md:w-64"
              placeholder="Filter installed mods"
            >
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 class="font-semibold text-white">Modrinth Check</h3>
                <p class="mt-1 text-sm text-slate-400">
                  {{ modCheckSummary.checked ? `Last checked ${formatDate(modCheckSummary.checkedAt)}` : 'Run Updates to compare installed jars with Modrinth.' }}
                </p>
              </div>
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded-md bg-amber-400/10 px-2 py-1 text-amber-200">{{ modCheckSummary.available }} available</span>
                <span class="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-200">{{ modCheckSummary.current }} current</span>
                <span class="rounded-md bg-slate-400/10 px-2 py-1 text-slate-300">{{ modCheckSummary.notFound }} unknown</span>
                <span v-if="modCheckSummary.errors" class="rounded-md bg-rose-400/10 px-2 py-1 text-rose-200">{{ modCheckSummary.errors }} errors</span>
              </div>
            </div>
          </div>

          <div v-if="modUpdateSummary" class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 class="font-semibold text-white">Last Bulk Update</h3>
                <p class="mt-1 text-sm text-slate-400">{{ formatDate(modUpdateSummary.timestamp) }}</p>
              </div>
              <div class="flex flex-wrap gap-2 text-xs">
                <span class="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-200">{{ modUpdateSummary.updated.length }} updated</span>
                <span class="rounded-md bg-rose-400/10 px-2 py-1 text-rose-200">{{ modUpdateSummary.failed.length }} failed</span>
                <span class="rounded-md bg-slate-400/10 px-2 py-1 text-slate-300">{{ modUpdateSummary.skipped.length }} current/skipped</span>
              </div>
            </div>
            <div v-if="modUpdateSummary.failed.length" class="mt-3 space-y-2">
              <div v-for="failure in modUpdateSummary.failed" :key="failure.file" class="rounded-md border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-100">
                <span class="font-mono">{{ failure.file }}</span>
                <span class="text-rose-200"> - {{ failure.message }}</span>
              </div>
            </div>
          </div>

          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 class="font-semibold text-white">Mod Backups</h3>
                <p class="mt-1 text-sm text-slate-400">{{ visibleModBackups.length }} of {{ modBackups.length }} rollback files</p>
              </div>
            </div>

            <div class="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in modBackupFilters"
                  :key="filter.id"
                  class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
                  :class="modBackupFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                  @click="modBackupFilter = filter.id"
                >
                  <span>{{ filter.label }}</span>
                  <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
                </button>
              </div>
              <input
                v-model="modBackupSearch"
                class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50 md:w-64"
                placeholder="Filter backups"
              >
            </div>

            <div class="mt-3 grid gap-2 lg:grid-cols-2">
              <div v-if="!modBackups.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500 lg:col-span-2">
                No mod rollback files found.
              </div>
              <div v-else-if="!visibleModBackups.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500 lg:col-span-2">
                No mod backups match this filter.
              </div>
              <div v-for="backup in visibleModBackups" :key="backup.id || backup.file" class="rounded-md border border-white/10 bg-black/20 p-3">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div class="min-w-0">
                    <div class="truncate font-mono text-xs text-slate-100">{{ backup.originalFile || backup.file || backup.id }}</div>
                    <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>{{ backup.size }}</span>
                      <span>{{ formatDate(backup.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="mod-btn" :disabled="actionBusy(modBackupActionKey(backup, 'restore'))" @click="restoreModBackup(backup)">
                      <RotateCw class="h-3.5 w-3.5" />
                      Restore
                    </button>
                    <button class="mod-btn danger" :disabled="actionBusy(modBackupActionKey(backup, 'delete'))" @click="deleteModBackup(backup)">
                      <Trash2 class="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="modSearchResults.length" class="grid gap-3 lg:grid-cols-2">
            <article v-for="project in modSearchResults" :key="project.projectId || project.slug" class="rounded-md border border-violet-400/15 bg-violet-400/[0.06] p-4">
              <div class="flex gap-3">
                <img v-if="project.iconUrl" :src="project.iconUrl" :alt="project.title" class="h-12 w-12 rounded-md object-cover">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="truncate font-semibold text-white">{{ project.title }}</h3>
                    <span class="rounded-md bg-white/[0.06] px-2 py-1 text-xs text-slate-300">{{ project.serverSide }}</span>
                  </div>
                  <p class="mt-1 line-clamp-2 text-sm text-slate-400">{{ project.description }}</p>
                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{{ formatNumber(project.downloads) }} downloads</span>
                    <span>{{ project.latestVersion }}</span>
                    <a class="text-violet-200 hover:text-violet-100" :href="project.href" target="_blank" rel="noreferrer">Modrinth</a>
                  </div>
                </div>
              </div>

              <div class="mt-3 flex justify-end">
                <button class="mod-btn" :disabled="installingProjectId === (project.projectId || project.slug) || actionBusy(namedActionKey('mod-project', project.projectId || project.slug, 'install'))" @click="installModProject(project)">
                  <Download class="h-3.5 w-3.5" />
                  Install
                </button>
              </div>
            </article>
          </div>

          <div class="grid gap-3">
            <div v-if="!visibleMods.length" class="rounded-md border border-white/10 bg-[#0f151d] p-4 text-sm text-slate-500">
              No installed mods match this filter.
            </div>
            <article v-for="mod in visibleMods" :key="mod.file" class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-white">{{ mod.name || mod.id }}</h3>
                    <span class="rounded-md px-2 py-1 text-xs" :class="mod.enabled ? 'bg-emerald-400/10 text-emerald-200' : 'bg-slate-400/10 text-slate-300'">
                      {{ mod.enabled ? 'Enabled' : 'Disabled' }}
                    </span>
                    <span v-if="mod.updateAvailable" class="rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-200">Update</span>
                    <span v-if="mod.required" class="rounded-md bg-sky-400/10 px-2 py-1 text-xs text-sky-200">Required</span>
                    <span v-if="modRequiredDependencyCount(mod)" class="rounded-md bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
                      {{ modRequiredDependencyCount(mod) }} required deps
                    </span>
                    <span v-else-if="modDependencyCount(mod)" class="rounded-md bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">
                      {{ modDependencyCount(mod) }} deps
                    </span>
                  </div>
                  <div class="mt-1 truncate font-mono text-xs text-slate-500">{{ mod.file }}</div>
                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span>{{ mod.version }}</span>
                    <span v-if="mod.latestVersion">Latest {{ mod.latestVersion }}</span>
                    <a v-if="mod.modrinthSlug" class="text-violet-200 hover:text-violet-100" :href="modrinthHref(mod)" target="_blank" rel="noreferrer">Modrinth</a>
                  </div>
                  <div v-if="modDependencies(mod).length" class="mt-3 flex flex-wrap gap-2 text-xs">
                    <span
                      v-for="dependency in modDependencies(mod).slice(0, 4)"
                      :key="`${mod.file}-${dependency.projectId || dependency.versionId || dependency.fileName || dependency.type}`"
                      class="rounded-md px-2 py-1"
                      :class="dependencyTone(dependency.type)"
                    >
                      {{ dependencyLabel(dependency) }} - {{ dependency.type }}
                    </span>
                    <span v-if="modDependencies(mod).length > 4" class="rounded-md bg-white/[0.06] px-2 py-1 text-slate-300">
                      +{{ modDependencies(mod).length - 4 }} more
                    </span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="mod.updateAvailable"
                    class="mod-btn"
                    :disabled="actionBusy(modActionKey(mod, 'update'))"
                    @click="updateMod(mod)"
                  >
                    <Download class="h-3.5 w-3.5" />
                    Update
                  </button>
                  <button class="mod-btn" :disabled="(mod.required && mod.enabled) || actionBusy(modActionKey(mod, 'toggle'))" @click="toggleMod(mod)">
                    <Power class="h-3.5 w-3.5" />
                    {{ mod.enabled ? 'Disable' : 'Enable' }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-if="activeTab === 'worlds'" class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div class="space-y-3">
            <div class="flex flex-col gap-3 rounded-md border border-white/10 bg-[#0f151d] p-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in worldFilters"
                  :key="filter.id"
                  class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
                  :class="worldFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                  @click="worldFilter = filter.id"
                >
                  <span>{{ filter.label }}</span>
                  <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
                </button>
              </div>
              <input
                v-model="worldSearch"
                class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50 md:w-64"
                placeholder="Filter worlds"
              >
            </div>

            <div v-if="!visibleWorlds.length" class="rounded-md border border-white/10 bg-[#0f151d] p-4 text-sm text-slate-500">
              No worlds match this filter.
            </div>

            <article v-for="world in visibleWorlds" :key="world.id" class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-white">{{ world.name }}</h3>
                    <span v-if="world.active" class="rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">Active</span>
                    <span v-if="world.hasDatapacks" class="rounded-md bg-sky-400/10 px-2 py-1 text-xs text-sky-200">Datapacks</span>
                  </div>
                  <div class="mt-1 font-mono text-xs text-slate-500">{{ world.path }}</div>
                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                    <span>{{ world.size }}</span>
                    <span>{{ formatDate(world.updatedAt) }}</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2">
                  <button
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="downloadingArchiveId === `world:${world.id}`"
                    @click="downloadWorld(world)"
                  >
                    <Download class="h-4 w-4" :class="{ 'animate-pulse': downloadingArchiveId === `world:${world.id}` }" />
                    Download
                  </button>
                  <button
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="world.active || actionBusy(worldActionKey(world, 'switch'))"
                    @click="switchWorld(world)"
                  >
                    <Shuffle class="h-4 w-4" />
                    Switch
                  </button>
                  <button
                    class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-rose-400/25 bg-rose-400/10 px-3 text-sm text-rose-100 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="world.active || actionBusy(worldActionKey(world, 'delete'))"
                    @click="deleteWorld(world)"
                  >
                    <Trash2 class="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          </div>

          <aside class="space-y-4">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">New World</h2>
              <div class="mt-4 space-y-3">
                <input
                  v-model="newWorldName"
                  class="h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400/50"
                  placeholder="World name"
                >
                <button class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 text-sm text-emerald-100 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40" :disabled="!newWorldName.trim() || actionBusy(namedActionKey('world', newWorldName, 'create'))" @click="createWorld">
                  <Plus class="h-4 w-4" />
                  Create
                </button>
                <button class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40" :disabled="actionBusy(namedActionKey('world', 'active', 'backup'))" @click="backupWorld">
                  <DatabaseBackup class="h-4 w-4" />
                  Snapshot Active
                </button>
              </div>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Backups</h2>
              <div class="mt-4 space-y-3">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="filter in backupFilters"
                    :key="filter.id"
                    class="inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-xs transition"
                    :class="backupFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                    @click="backupFilter = filter.id"
                  >
                    <span>{{ filter.label }}</span>
                    <span class="rounded bg-black/10 px-1.5 py-0.5 text-[11px]">{{ filter.count }}</span>
                  </button>
                </div>
                <input
                  v-model="backupSearch"
                  class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
                  placeholder="Filter backups"
                >

                <div v-if="!detail.backups.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  No backups found.
                </div>
                <div v-else-if="!visibleBackups.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  No backups match this filter.
                </div>
                <div v-for="backup in visibleBackups" :key="backup.id" class="rounded-md border border-white/10 bg-black/20 p-3">
                  <div class="flex items-center justify-between gap-3">
                    <span class="truncate text-sm font-medium text-white">{{ backup.label || backup.id }}</span>
                    <span class="rounded-md px-2 py-1 text-xs" :class="backup.status === 'success' ? 'bg-emerald-400/10 text-emerald-200' : 'bg-amber-400/10 text-amber-200'">
                      {{ backup.status }}
                    </span>
                  </div>
                  <div class="mt-2 flex justify-between gap-3 text-xs text-slate-500">
                    <span>{{ formatDate(backup.createdAt) }}</span>
                    <span>{{ backup.size }}</span>
                  </div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button class="player-btn" :disabled="downloadingArchiveId === `backup:${backup.id}`" @click="downloadBackup(backup)">
                      <Download class="h-3.5 w-3.5" :class="{ 'animate-pulse': downloadingArchiveId === `backup:${backup.id}` }" />
                      Download
                    </button>
                    <button class="player-btn" :disabled="actionBusy(backupActionKey(backup, 'restore'))" @click="restoreBackup(backup)">
                      <RotateCw class="h-3.5 w-3.5" />
                      Restore
                    </button>
                    <button class="player-btn danger" :disabled="actionBusy(backupActionKey(backup, 'delete'))" @click="deleteBackup(backup)">
                      <Trash2 class="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section v-if="activeTab === 'logs'" class="mt-6 rounded-md border border-white/10 bg-[#0f151d] p-4">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 class="font-semibold text-white">Log Explorer</h2>
                <p class="mt-1 text-sm text-slate-400">{{ selectedLogFile }} &middot; {{ filteredLogs.length }} lines</p>
              </div>

              <div class="grid gap-2 md:grid-cols-[220px_120px_1fr_auto_auto]">
                <select v-model="selectedLogFile" class="setting-input">
                  <option v-for="file in logFiles" :key="file.id || file.name" :value="file.name">
                    {{ file.name }}
                  </option>
                </select>
                <input
                  v-model.number="logTail"
                  class="setting-input"
                  type="number"
                  min="1"
                  max="2000"
                  title="Tail lines"
                >
                <input
                  v-model="logSearch"
                  class="setting-input"
                  placeholder="Search logs"
                >
                <button class="settings-btn" :disabled="loadingExplorerLogs" @click="loadLogExplorer">
                  <SearchCheck class="h-4 w-4" :class="{ 'animate-pulse': loadingExplorerLogs }" />
                  Load
                </button>
                <button class="settings-btn" :disabled="exportingLogs" @click="exportLogFile">
                  <Download class="h-4 w-4" :class="{ 'animate-pulse': exportingLogs }" />
                  Export
                </button>
              </div>
            </div>

            <div class="flex gap-2 overflow-x-auto">
              <button
                v-for="file in logFiles"
                :key="file.id || file.name"
                class="shrink-0 rounded-md border px-3 py-2 text-left text-xs transition"
                :class="selectedLogFile === file.name ? 'border-sky-400/30 bg-sky-400/10 text-sky-100' : 'border-white/10 bg-black/20 text-slate-400 hover:bg-white/[0.04]'"
                @click="selectLogFile(file)"
              >
                <span class="block font-mono text-slate-100">{{ file.name }}</span>
                <span class="mt-1 block">{{ file.size }} &middot; {{ formatDate(file.updatedAt) }}</span>
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in logFilters"
                :key="filter.id"
                class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
                :class="logFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                @click="logFilter = filter.id"
              >
                <span>{{ filter.label }}</span>
                <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
              </button>
            </div>
          </div>

          <div ref="explorerLogsRef" class="mt-4 h-[620px] overflow-auto rounded-md border border-white/10 bg-black/40 p-3 font-mono text-xs leading-6 text-slate-300">
            <div v-if="!filteredLogs.length" class="text-slate-500">No log lines matched.</div>
            <div v-for="(line, index) in filteredLogs" :key="index" class="whitespace-pre-wrap" :class="logClass(line)">{{ line }}</div>
          </div>
        </section>

        <section v-if="activeTab === 'activity'" class="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="font-semibold text-white">Activity</h2>
                <p class="mt-1 text-sm text-slate-400">{{ visibleActivityItems.length }} of {{ activityItems.length }} panel actions</p>
              </div>
              <History class="h-4 w-4 text-slate-400" />
            </div>

            <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="filter in activityFilters"
                  :key="filter.id"
                  class="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition"
                  :class="activityFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                  @click="activityFilter = filter.id"
                >
                  <span>{{ filter.label }}</span>
                  <span class="rounded bg-black/10 px-1.5 py-0.5 text-xs">{{ filter.count }}</span>
                </button>
              </div>
              <input
                v-model="activitySearch"
                class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50 md:w-64"
                placeholder="Search activity"
              >
            </div>

            <div class="mt-4 space-y-2">
              <div v-if="!activityItems.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                No panel activity recorded yet.
              </div>
              <div v-else-if="!visibleActivityItems.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                No activity matches this filter.
              </div>
              <div v-for="entry in visibleActivityItems" :key="entry.id" class="rounded-md border border-white/10 bg-black/20 p-3">
                <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-medium text-white">{{ entry.label }}</span>
                      <span class="rounded-md px-2 py-1 text-xs" :class="activityPill(entry)">
                        {{ entry.status }}
                      </span>
                      <span v-if="entry.restartRequired" class="rounded-md bg-amber-400/10 px-2 py-1 text-xs text-amber-200">Restart</span>
                      <span v-if="entry.clearsRestart" class="rounded-md bg-emerald-400/10 px-2 py-1 text-xs text-emerald-200">Applied</span>
                    </div>
                    <div class="mt-1 text-sm text-slate-300">{{ entry.summary }}</div>
                    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{{ formatDate(entry.timestamp) }}</span>
                      <span>{{ entry.actor }}</span>
                      <span v-if="entry.target" class="font-mono">{{ entry.target }}</span>
                    </div>
                  </div>
                  <div class="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-slate-400">
                    {{ entry.type }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="space-y-4">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Pending Restart</h2>
              <div class="mt-4 space-y-2">
                <div v-if="!pendingRestartReasons.length" class="rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  No unapplied server changes.
                </div>
                <div v-for="entry in pendingRestartReasons" :key="entry.id" class="rounded-md border border-amber-400/20 bg-amber-400/10 p-3">
                  <div class="text-sm font-medium text-amber-50">{{ entry.summary }}</div>
                  <div class="mt-1 text-xs text-amber-100/70">{{ formatDate(entry.timestamp) }}</div>
                </div>
              </div>
              <button
                class="settings-btn primary mt-4 w-full"
                :disabled="!pendingRestartReasons.length || (!canRestart(detail) && !canWake(detail)) || actionBusy(lifecycleActionKey(canWake(detail) ? 'wake' : 'restart'))"
                @click="applyPendingRestart"
              >
                <RotateCw class="h-4 w-4" :class="{ 'animate-spin': actionBusy(lifecycleActionKey(canWake(detail) ? 'wake' : 'restart')) }" />
                {{ canWake(detail) ? 'Wake to apply' : 'Restart to apply' }}
              </button>
            </div>
          </aside>
        </section>

        <section v-if="activeTab === 'settings'" class="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <form class="rounded-md border border-white/10 bg-[#0f151d] p-4" @submit.prevent="saveSettings">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 class="font-semibold text-white">Access & Gameplay</h2>
              <div class="flex gap-2">
                <button type="button" class="settings-btn" :disabled="!settingsChanged || savingSettings" @click="resetSettingsDraft">
                  <RefreshCcw class="h-4 w-4" />
                  Reset
                </button>
                <button type="submit" class="settings-btn primary" :disabled="!settingsChanged || savingSettings">
                  <Save class="h-4 w-4" :class="{ 'animate-pulse': savingSettings }" />
                  Save
                </button>
              </div>
            </div>

            <div v-if="settingsChanges.length" class="mt-4 border-y border-amber-400/20 bg-amber-400/[0.06] py-3">
              <div class="flex items-center justify-between gap-3 px-1">
                <h3 class="text-sm font-semibold text-amber-50">Pending settings</h3>
                <span class="text-xs text-amber-100/70">{{ settingsChanges.length }} changed</span>
              </div>
              <div class="mt-3 space-y-2 px-1">
                <div
                  v-for="change in settingsChanges"
                  :key="change.key"
                  class="grid gap-1 text-xs md:grid-cols-[150px_minmax(0,1fr)_24px_minmax(0,1fr)] md:items-center"
                >
                  <span class="font-medium text-amber-50">{{ change.label }}</span>
                  <span class="min-w-0 truncate font-mono text-slate-400">{{ change.current }}</span>
                  <ArrowRight class="hidden h-3.5 w-3.5 text-amber-200/60 md:block" />
                  <span class="min-w-0 truncate font-mono text-amber-100">{{ change.draft }}</span>
                </div>
              </div>
            </div>

            <div class="mt-5 grid gap-4 md:grid-cols-2">
              <label class="settings-toggle">
                <input v-model="settingsDraft['white-list']" type="checkbox">
                <span>
                  <span class="block font-medium text-white">Whitelist</span>
                  <span class="text-xs text-slate-500">white-list</span>
                </span>
              </label>

              <label class="settings-toggle">
                <input v-model="settingsDraft['enforce-whitelist']" type="checkbox">
                <span>
                  <span class="block font-medium text-white">Enforce whitelist</span>
                  <span class="text-xs text-slate-500">enforce-whitelist</span>
                </span>
              </label>

              <label class="settings-toggle">
                <input v-model="settingsDraft.pvp" type="checkbox">
                <span>
                  <span class="block font-medium text-white">PvP</span>
                  <span class="text-xs text-slate-500">pvp</span>
                </span>
              </label>

              <label class="grid gap-2">
                <span class="text-sm text-slate-400">Difficulty</span>
                <select v-model="settingsDraft.difficulty" class="setting-input">
                  <option value="peaceful">Peaceful</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </label>

              <label class="grid gap-2">
                <span class="text-sm text-slate-400">Max players</span>
                <input v-model.number="settingsDraft['max-players']" class="setting-input" type="number" min="1" max="100">
              </label>

              <label class="grid gap-2">
                <span class="text-sm text-slate-400">View distance</span>
                <input v-model.number="settingsDraft['view-distance']" class="setting-input" type="number" min="2" max="32">
              </label>

              <label class="grid gap-2">
                <span class="text-sm text-slate-400">Simulation distance</span>
                <input v-model.number="settingsDraft['simulation-distance']" class="setting-input" type="number" min="2" max="32">
              </label>

              <label class="grid gap-2 md:col-span-2">
                <span class="text-sm text-slate-400">MOTD</span>
                <input v-model="settingsDraft.motd" class="setting-input" maxlength="120">
              </label>
            </div>
          </form>

          <aside class="space-y-6">
            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Paths</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Root</dt>
                  <dd class="text-right font-mono text-slate-100">{{ detail.root }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Logs</dt>
                  <dd class="text-right font-mono text-slate-100">{{ detail.root }}/logs/latest.log</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Mods</dt>
                  <dd class="text-right font-mono text-slate-100">{{ detail.root }}/mods</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Backups</dt>
                  <dd class="text-right font-mono text-slate-100">/mnt/storage-1/minecraft/backups/snapshots/{{ serverId }}</dd>
                </div>
              </dl>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="font-semibold text-white">Integration Checks</h2>
                  <p class="mt-1 text-sm text-slate-400">{{ diagnosticsStatusLabel }} &middot; {{ visibleDiagnosticChecks.length }} of {{ diagnosticChecks.length }}</p>
                </div>
                <button class="settings-btn" :disabled="refreshingDiagnostics" @click="refreshDiagnostics">
                  <RefreshCcw class="h-4 w-4" :class="{ 'animate-spin': refreshingDiagnostics }" />
                  Check
                </button>
              </div>

              <div class="mt-4 flex flex-wrap gap-2 text-xs">
                <span class="rounded-md bg-emerald-400/10 px-2 py-1 text-emerald-200">{{ diagnosticsSummary.pass || 0 }} pass</span>
                <span class="rounded-md bg-amber-400/10 px-2 py-1 text-amber-200">{{ diagnosticsSummary.warning || 0 }} warn</span>
                <span class="rounded-md bg-rose-400/10 px-2 py-1 text-rose-200">{{ diagnosticsSummary.error || 0 }} error</span>
                <span class="rounded-md bg-slate-400/10 px-2 py-1 text-slate-300">{{ diagnosticsSummary.info || 0 }} info</span>
              </div>

              <div class="mt-4 flex flex-col gap-3">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="filter in diagnosticsFilters"
                    :key="filter.id"
                    class="inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-xs transition"
                    :class="diagnosticsFilter === filter.id ? 'bg-white text-slate-950' : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'"
                    @click="diagnosticsFilter = filter.id"
                  >
                    <span>{{ filter.label }}</span>
                    <span class="rounded bg-black/10 px-1.5 py-0.5 text-[11px]">{{ filter.count }}</span>
                  </button>
                </div>
                <input
                  v-model="diagnosticsSearch"
                  class="h-9 w-full rounded-md border border-white/10 bg-black/30 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50"
                  placeholder="Filter checks"
                >
              </div>

              <div class="mt-4 max-h-[420px] space-y-2 overflow-auto">
                <div v-if="!diagnosticChecks.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  Checks have not loaded yet.
                </div>
                <div v-else-if="!visibleDiagnosticChecks.length" class="rounded-md border border-white/10 bg-black/20 p-3 text-sm text-slate-500">
                  No checks match this filter.
                </div>
                <div v-for="check in visibleDiagnosticChecks" :key="check.id" class="rounded-md border border-white/10 bg-black/20 p-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <div class="font-medium text-white">{{ check.label }}</div>
                      <div class="mt-1 text-xs text-slate-400">{{ check.message }}</div>
                      <div v-if="check.path" class="mt-1 truncate font-mono text-xs text-slate-600">{{ check.path }}</div>
                    </div>
                    <span class="shrink-0 rounded-md px-2 py-1 text-xs" :class="diagnosticTone(check.status)">
                      {{ check.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-md border border-white/10 bg-[#0f151d] p-4">
              <h2 class="font-semibold text-white">Actions</h2>
              <div class="mt-4 grid gap-2">
                <button class="settings-btn" @click="copyAddress">
                  <Copy class="h-4 w-4" />
                  Copy address
                </button>
                <button class="settings-btn" :disabled="actionBusy(namedActionKey('world', 'active', 'backup'))" @click="backupWorld">
                  <DatabaseBackup class="h-4 w-4" />
                  Snapshot active world
                </button>
                <button
                  v-if="canWake(detail)"
                  class="settings-btn primary"
                  :disabled="actionBusy(lifecycleActionKey('wake'))"
                  @click="runLifecycle('wake')"
                >
                  <Play class="h-4 w-4" :class="{ 'animate-pulse': actionBusy(lifecycleActionKey('wake')) }" />
                  Wake server
                </button>
                <button
                  class="settings-btn danger"
                  :disabled="!canRestart(detail) || actionBusy(lifecycleActionKey('restart'))"
                  @click="runLifecycle('restart')"
                >
                  <RotateCw class="h-4 w-4" />
                  Restart server
                </button>
                <button
                  class="settings-btn danger"
                  :disabled="!canSleep(detail) || actionBusy(lifecycleActionKey('sleep'))"
                  @click="runLifecycle('sleep')"
                >
                  <Square class="h-4 w-4" />
                  Sleep server
                </button>
              </div>
            </div>
          </aside>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  Boxes,
  Clock3,
  Copy,
  Crown,
  DatabaseBackup,
  Download,
  FolderRoot,
  Globe2,
  History,
  LayoutDashboard,
  ListTree,
  LogOut,
  Logs,
  Package,
  PackageCheck,
  Play,
  Plus,
  Power,
  RefreshCcw,
  RotateCw,
  Save,
  SearchCheck,
  Send,
  Settings,
  ShieldCheck,
  Shuffle,
  Square,
  Terminal,
  Trash2,
  UploadCloud,
  UserPlus,
  Users,
} from 'lucide-vue-next'
import { useMinecraftStore } from '@/features/minecraft/stores/useMinecraftStore'
import { useToast } from '@/shared/components/ui/toast'
import MetricBar from '@/features/minecraft/components/MetricBar.vue'

const route = useRoute()
const router = useRouter()
const minecraft = useMinecraftStore()
const { toast } = useToast()

const activeTab = ref('overview')
const command = ref('')
const commandHistorySearch = ref('')
const commandHistoryFilter = ref('all')
const logSearch = ref('')
const logFilter = ref('all')
const logTail = ref(300)
const selectedLogFile = ref('latest.log')
const loadingExplorerLogs = ref(false)
const exportingLogs = ref(false)
const playerSearch = ref('')
const playerFilter = ref('all')
const modSearch = ref('')
const installedModFilter = ref('all')
const installedModSearch = ref('')
const modBackupSearch = ref('')
const modBackupFilter = ref('all')
const newPlayerName = ref('')
const newBlacklistName = ref('')
const newBlacklistIp = ref('')
const blacklistReason = ref('')
const newWorldName = ref('')
const worldSearch = ref('')
const worldFilter = ref('all')
const backupSearch = ref('')
const backupFilter = ref('all')
const activitySearch = ref('')
const activityFilter = ref('all')
const diagnosticsSearch = ref('')
const diagnosticsFilter = ref('all')
const settingsDraft = ref({})
const savingSettings = ref(false)
const installingProjectId = ref(null)
const updatingAllMods = ref(false)
const uploadingMod = ref(false)
const downloadingArchiveId = ref(null)
const actionLocks = ref(new Set())
const modUploadInput = ref(null)
const refreshingDiagnostics = ref(false)
const overviewLogsRef = ref(null)
const consoleRef = ref(null)
const explorerLogsRef = ref(null)
let pollHandle = null

const settingsKeys = [
  'white-list',
  'enforce-whitelist',
  'pvp',
  'difficulty',
  'max-players',
  'view-distance',
  'simulation-distance',
  'motd',
]
const settingsLabels = {
  'white-list': 'Whitelist',
  'enforce-whitelist': 'Enforce whitelist',
  pvp: 'PvP',
  difficulty: 'Difficulty',
  'max-players': 'Max players',
  'view-distance': 'View distance',
  'simulation-distance': 'Simulation distance',
  motd: 'MOTD',
}

const confirmationCommands = ['ban', 'ban-ip', 'kick', 'op', 'deop', 'whitelist', 'pardon', 'pardon-ip']
const destructiveCommands = ['stop', 'save-off']

const serverId = computed(() => String(route.params.id || 'hc'))
const detail = computed(() => minecraft.serverDetails[serverId.value] || null)
const detailIcon = computed(() => detail.value ? minecraft.serverIconUrl(detail.value) : '')
const refreshing = computed(() => minecraft.refreshingIds?.has(serverId.value))
const rconReady = computed(() => ['alive', 'degraded'].includes(detail.value?.state))
const logStreaming = computed(() => minecraft.streamingIds?.has(serverId.value))
const statusStreaming = computed(() => minecraft.statusStreamingIds?.has(serverId.value))
const latestLogs = computed(() => (detail.value?.logs || []).slice(-80))
const logFiles = computed(() => detail.value?.logFiles || [])
const diagnostics = computed(() => detail.value?.diagnostics || minecraft.diagnosticsByServer?.[serverId.value] || null)
const diagnosticChecks = computed(() => diagnostics.value?.checks || [])
const diagnosticsSummary = computed(() => diagnostics.value?.summary || { pass: 0, warning: 0, error: 0, info: 0 })
const diagnosticsFilters = computed(() => {
  const checks = diagnosticChecks.value
  return [
    { id: 'all', label: 'All', count: checks.length },
    { id: 'error', label: 'Errors', count: checks.filter((check) => check.status === 'error').length },
    { id: 'warning', label: 'Warnings', count: checks.filter((check) => check.status === 'warning').length },
    { id: 'pass', label: 'Pass', count: checks.filter((check) => check.status === 'pass').length },
    { id: 'info', label: 'Info', count: checks.filter((check) => check.status === 'info').length },
  ]
})
const visibleDiagnosticChecks = computed(() => {
  const query = diagnosticsSearch.value.trim().toLowerCase()
  return diagnosticChecks.value.filter((check) => diagnosticsMatchesFilter(check) && diagnosticsMatchesSearch(check, query))
})
const diagnosticsStatusLabel = computed(() => {
  if (!diagnostics.value) return 'No runtime check yet'
  if (diagnostics.value.status === 'ready') return `Ready at ${formatDate(diagnostics.value.checkedAt)}`
  if (diagnostics.value.status === 'error') return `Needs attention at ${formatDate(diagnostics.value.checkedAt)}`
  return `Warnings at ${formatDate(diagnostics.value.checkedAt)}`
})

const updateCount = computed(() => (detail.value?.mods || []).filter((mod) => mod.updateAvailable).length)
const commandHistoryItems = computed(() => detail.value?.commandHistory || [])
const commandHistoryFilters = computed(() => {
  const items = commandHistoryItems.value
  const countRisk = (risk) => items.filter((entry) => commandRisk(entry.command) === risk).length
  return [
    { id: 'all', label: 'All', count: items.length },
    { id: 'safe', label: 'Safe', count: countRisk('safe') },
    { id: 'guarded', label: 'Guarded', count: countRisk('guarded') },
    { id: 'destructive', label: 'Destructive', count: countRisk('destructive') },
  ]
})
const visibleCommandHistory = computed(() => {
  const query = commandHistorySearch.value.trim().toLowerCase()
  return commandHistoryItems.value.filter((entry) => commandHistoryMatchesFilter(entry) && commandHistoryMatchesSearch(entry, query))
})
const enabledMods = computed(() => (detail.value?.mods || []).filter((mod) => mod.enabled).length)
const disabledMods = computed(() => (detail.value?.mods || []).filter((mod) => !mod.enabled).length)
const installedModFilters = computed(() => {
  const mods = detail.value?.mods || []
  return [
    { id: 'all', label: 'All', count: mods.length },
    { id: 'updates', label: 'Updates', count: updateCount.value },
    { id: 'enabled', label: 'Enabled', count: enabledMods.value },
    { id: 'disabled', label: 'Disabled', count: disabledMods.value },
  ]
})
const visibleMods = computed(() => {
  const mods = [...(detail.value?.mods || [])]
  const query = installedModSearch.value.trim().toLowerCase()
  const filtered = mods.filter((mod) => {
    const matchesFilter =
      installedModFilter.value === 'updates' ? mod.updateAvailable
        : installedModFilter.value === 'enabled' ? mod.enabled
          : installedModFilter.value === 'disabled' ? !mod.enabled
            : true
    return matchesFilter && installedModMatchesQuery(mod, query)
  })

  return filtered.sort((a, b) => {
    if (a.updateAvailable !== b.updateAvailable) return a.updateAvailable ? -1 : 1
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1
    return modDisplayName(a).localeCompare(modDisplayName(b), undefined, { numeric: true, sensitivity: 'base' })
  })
})
const modSearchResults = computed(() => minecraft.modSearchResults?.[serverId.value] || [])
const modUpdateSummary = computed(() => minecraft.modUpdateSummaries?.[serverId.value] || null)
const modCheckSummary = computed(() => {
  const mods = detail.value?.mods || []
  const checkedMods = mods.filter((mod) => mod.updateCheckedAt || mod.lookupStatus)
  const checkedAt = checkedMods
    .map((mod) => new Date(mod.updateCheckedAt || 0).getTime())
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0]

  return {
    checked: checkedMods.length,
    checkedAt: checkedAt ? new Date(checkedAt).toISOString() : '',
    available: mods.filter((mod) => mod.updateAvailable).length,
    current: checkedMods.filter((mod) => !mod.updateAvailable && (!mod.lookupStatus || mod.lookupStatus === 'ok')).length,
    notFound: checkedMods.filter((mod) => mod.lookupStatus === 'not-found').length,
    errors: checkedMods.filter((mod) => mod.lookupStatus && !['ok', 'not-found'].includes(mod.lookupStatus)).length,
  }
})
const modBackups = computed(() => detail.value?.modBackups || [])
const sortedModBackups = computed(() => [...modBackups.value].sort((a, b) => {
  const diff = comparableModBackupTime(b) - comparableModBackupTime(a)
  if (diff) return diff
  return comparableModBackupName(a).localeCompare(comparableModBackupName(b), undefined, { numeric: true, sensitivity: 'base' })
}))
const modBackupFilters = computed(() => {
  const backups = modBackups.value
  return [
    { id: 'all', label: 'All', count: backups.length },
    { id: 'enabled', label: 'Enabled files', count: backups.filter((backup) => !comparableModBackupName(backup).includes('.disabled')).length },
    { id: 'disabled', label: 'Disabled files', count: backups.filter((backup) => comparableModBackupName(backup).includes('.disabled')).length },
  ]
})
const visibleModBackups = computed(() => {
  const query = modBackupSearch.value.trim().toLowerCase()
  return sortedModBackups.value.filter((backup) => modBackupMatchesFilter(backup) && modBackupMatchesSearch(backup, query))
})
const activityItems = computed(() => minecraft.activityForServer(serverId.value))
const activityFilters = computed(() => {
  const items = activityItems.value
  return [
    { id: 'all', label: 'All', count: items.length },
    { id: 'attention', label: 'Attention', count: items.filter((entry) => ['error', 'warning', 'failed'].includes(entry.status)).length },
    { id: 'restart', label: 'Restart', count: items.filter((entry) => entry.restartRequired).length },
    { id: 'lifecycle', label: 'Lifecycle', count: items.filter((entry) => entry.type === 'lifecycle').length },
    { id: 'mods', label: 'Mods', count: items.filter((entry) => entry.type === 'mods').length },
    { id: 'players', label: 'Players', count: items.filter((entry) => entry.type === 'players').length },
    { id: 'worlds', label: 'Worlds', count: items.filter((entry) => ['worlds', 'backups'].includes(entry.type)).length },
  ]
})
const visibleActivityItems = computed(() => {
  const query = activitySearch.value.trim().toLowerCase()
  return activityItems.value.filter((entry) => activityMatchesFilter(entry) && activityMatchesSearch(entry, query))
})
const pendingRestartReasons = computed(() => minecraft.restartReasonsForServer(serverId.value))
const restartRequired = computed(() => pendingRestartReasons.value.length > 0)
const bannedPlayersList = computed(() => (detail.value?.bannedPlayers || []).filter((entry) => displayBanName(entry)))
const bannedIpsList = computed(() => (detail.value?.bannedIps || []).filter((entry) => displayBanIp(entry)))
const sortedWorlds = computed(() => [...(detail.value?.worlds || [])].sort((a, b) => {
  const diff = comparableWorldTime(b) - comparableWorldTime(a)
  if (diff) return diff
  return comparableWorldName(b).localeCompare(comparableWorldName(a), undefined, { numeric: true, sensitivity: 'base' })
}))
const worldFilters = computed(() => {
  const worlds = detail.value?.worlds || []
  return [
    { id: 'all', label: 'All', count: worlds.length },
    { id: 'active', label: 'Active', count: worlds.filter((world) => world.active).length },
    { id: 'inactive', label: 'Inactive', count: worlds.filter((world) => !world.active).length },
    { id: 'datapacks', label: 'Datapacks', count: worlds.filter((world) => world.hasDatapacks).length },
  ]
})
const visibleWorlds = computed(() => {
  const query = worldSearch.value.trim().toLowerCase()
  return sortedWorlds.value.filter((world) => worldMatchesFilter(world) && worldMatchesSearch(world, query))
})
const sortedBackups = computed(() => [...(detail.value?.backups || [])].sort((a, b) => {
  const diff = comparableBackupTime(b) - comparableBackupTime(a)
  if (diff) return diff
  return comparableBackupName(b).localeCompare(comparableBackupName(a), undefined, { numeric: true, sensitivity: 'base' })
}))
const backupFilters = computed(() => {
  const backups = detail.value?.backups || []
  return [
    { id: 'all', label: 'All', count: backups.length },
    { id: 'success', label: 'Success', count: backups.filter((backup) => backup.status === 'success').length },
    { id: 'attention', label: 'Attention', count: backups.filter((backup) => backup.status !== 'success').length },
  ]
})
const visibleBackups = computed(() => {
  const query = backupSearch.value.trim().toLowerCase()
  return sortedBackups.value.filter((backup) => backupMatchesFilter(backup) && backupMatchesSearch(backup, query))
})
const settingsChanges = computed(() => settingsKeys.map((key) => {
  const current = settingCurrentValue(key)
  const draft = settingsDraft.value[key]
  return {
    key,
    label: settingsLabels[key] || key,
    current: settingDisplayValue(current),
    draft: settingDisplayValue(draft),
    changed: String(draft) !== String(current),
  }
}).filter((change) => change.changed))
const settingsChanged = computed(() => settingsChanges.value.length > 0)

const activeLogLines = computed(() => {
  const followLiveLatest = (selectedLogFile.value || 'latest.log') === 'latest.log' && !logSearch.value.trim()
  return followLiveLatest
    ? detail.value?.logs || []
    : detail.value?.exploredLogs || detail.value?.logs || []
})
const logFilters = computed(() => {
  const lines = activeLogLines.value
  return [
    { id: 'all', label: 'All', count: lines.length },
    { id: 'errors', label: 'Errors', count: lines.filter((line) => logLineGroup(line) === 'errors').length },
    { id: 'warnings', label: 'Warnings', count: lines.filter((line) => logLineGroup(line) === 'warnings').length },
    { id: 'players', label: 'Players', count: lines.filter((line) => logLineGroup(line) === 'players').length },
    { id: 'rcon', label: 'RCON', count: lines.filter((line) => logLineGroup(line) === 'rcon').length },
    { id: 'panel', label: 'Panel', count: lines.filter((line) => logLineGroup(line) === 'panel').length },
  ]
})
const filteredLogs = computed(() => {
  const query = logSearch.value.trim().toLowerCase()
  return activeLogLines.value.filter((line) => (
    logMatchesFilter(line) && (!query || String(line || '').toLowerCase().includes(query))
  ))
})

const filteredPlayers = computed(() => {
  const query = playerSearch.value.trim().toLowerCase()
  const players = detail.value?.players || []
  return players.filter((player) => playerMatchesFilter(player) && playerMatchesSearch(player, query))
})

const playerFilters = computed(() => {
  const players = detail.value?.players || []
  return [
    { id: 'all', label: 'All', count: players.length },
    { id: 'online', label: 'Online', count: players.filter((player) => player.online).length },
    { id: 'ops', label: 'OPs', count: players.filter((player) => player.op).length },
    { id: 'whitelist', label: 'Whitelist', count: players.filter((player) => player.whitelisted).length },
    { id: 'banned', label: 'Banned', count: players.filter((player) => player.banned).length },
  ]
})

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'console', label: 'Console', icon: Terminal },
  { id: 'players', label: 'Players', icon: Users },
  { id: 'mods', label: 'Mods', icon: Package },
  { id: 'worlds', label: 'Worlds', icon: ListTree },
  { id: 'logs', label: 'Logs', icon: Logs },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const tabIds = new Set(tabs.map((tab) => tab.id))
const normalizedTab = (tab) => {
  const id = Array.isArray(tab) ? tab[0] : tab
  return tabIds.has(String(id || '')) ? String(id) : 'overview'
}
const queryWithTab = (tab) => {
  const query = { ...route.query }
  if (tab === 'overview') delete query.tab
  else query.tab = tab
  return query
}

const errorMessage = (error) => error?.message || String(error || 'Unexpected Minecraft error')
const actionLabel = (action) => `${action.slice(0, 1).toUpperCase()}${action.slice(1)}`
const actionKey = (...parts) => parts.map((part) => String(part ?? '').trim()).filter(Boolean).join(':')
const namedActionKey = (scope, target, action) => actionKey(serverId.value, scope, target, action)
const lifecycleActionKey = (action) => namedActionKey('lifecycle', action, 'run')
const playerActionKey = (player, action) => namedActionKey('player', player?.uuid || player?.name, action)
const modActionKey = (mod, action) => namedActionKey('mod', mod?.file || mod?.id || mod?.name, action)
const modBackupActionKey = (backup, action) => namedActionKey('mod-backup', backup?.file || backup?.id || backup?.originalFile, action)
const worldActionKey = (world, action) => namedActionKey('world', world?.id || world?.name, action)
const backupActionKey = (backup, action) => namedActionKey('backup', backup?.id || backup?.label, action)
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
const commandTemplate = (item) => item.template || item.name || ''
const applyCommandTemplate = (item) => {
  if (!rconReady.value) return
  command.value = commandTemplate(item)
}
const applyHistoryCommand = (entry) => {
  if (!rconReady.value) return
  command.value = entry.command || ''
}
const commandTone = (risk = 'safe') => {
  if (risk === 'destructive') return 'border-rose-400/20 bg-rose-400/10 text-rose-100'
  if (risk === 'guarded') return 'border-amber-400/20 bg-amber-400/10 text-amber-100'
  return 'border-white/10 bg-white/[0.04] text-slate-200'
}
const commandRiskPillTone = (risk = 'safe') => {
  if (risk === 'destructive') return 'bg-rose-400/10 text-rose-200'
  if (risk === 'guarded') return 'bg-amber-400/10 text-amber-200'
  return 'bg-emerald-400/10 text-emerald-200'
}
const commandRisk = (value) => {
  const first = String(value || '').trim().split(/\s+/)[0]?.toLowerCase()
  const metadata = (detail.value?.allowedCommands || []).find((item) => item.name === first)
  if (metadata?.risk) return metadata.risk
  if (metadata?.requiresConfirmation) return 'guarded'
  if (destructiveCommands.includes(first)) return 'destructive'
  if (confirmationCommands.includes(first)) return 'guarded'
  return 'safe'
}
const commandHistoryMatchesFilter = (entry) => {
  if (commandHistoryFilter.value === 'all') return true
  return commandRisk(entry?.command) === commandHistoryFilter.value
}
const commandHistoryMatchesSearch = (entry, query) => {
  if (!query) return true
  return [
    entry?.command,
    entry?.output,
    entry?.timestamp,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const modDisplayName = (mod) => String(mod?.name || mod?.id || mod?.file || '')
const playerMatchesFilter = (player) => {
  if (playerFilter.value === 'online') return player.online
  if (playerFilter.value === 'ops') return player.op
  if (playerFilter.value === 'whitelist') return player.whitelisted
  if (playerFilter.value === 'banned') return player.banned
  return true
}
const playerMatchesSearch = (player, query) => {
  if (!query) return true
  return [
    player?.name,
    player?.uuid,
    player?.permission,
    player?.lastSeen,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const installedModMatchesQuery = (mod, query) => {
  if (!query) return true
  return [
    mod?.name,
    mod?.id,
    mod?.file,
    mod?.version,
    mod?.latestVersion,
    mod?.modrinthSlug,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const comparableModBackupName = (backup) => String(backup?.originalFile || backup?.file || backup?.id || '')
const comparableModBackupTime = (backup) => {
  const candidates = [
    backup?.createdAt,
    backup?.updatedAt,
    backup?.mtime,
    backup?.timestamp,
  ]
  for (const value of candidates) {
    const time = new Date(value).getTime()
    if (Number.isFinite(time)) return time
  }
  return 0
}
const modBackupMatchesFilter = (backup) => {
  const name = comparableModBackupName(backup)
  if (modBackupFilter.value === 'enabled') return !name.includes('.disabled')
  if (modBackupFilter.value === 'disabled') return name.includes('.disabled')
  return true
}
const modBackupMatchesSearch = (backup, query) => {
  if (!query) return true
  return [
    backup?.originalFile,
    backup?.file,
    backup?.id,
    backup?.size,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}

const comparableWorldName = (world) => String(world?.name || world?.id || world?.path || '')
const worldMatchesFilter = (world) => {
  if (worldFilter.value === 'active') return world.active
  if (worldFilter.value === 'inactive') return !world.active
  if (worldFilter.value === 'datapacks') return world.hasDatapacks
  return true
}
const worldMatchesSearch = (world, query) => {
  if (!query) return true
  return [
    world?.name,
    world?.id,
    world?.path,
    world?.size,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const comparableBackupName = (backup) => String(backup?.label || backup?.id || backup?.path || '')
const comparableBackupTime = (backup) => {
  const candidates = [
    backup?.createdAt,
    backup?.updatedAt,
    backup?.mtime,
    backup?.timestamp,
  ]
  for (const value of candidates) {
    const time = new Date(value).getTime()
    if (Number.isFinite(time)) return time
  }
  return 0
}
const backupMatchesFilter = (backup) => {
  if (backupFilter.value === 'success') return backup.status === 'success'
  if (backupFilter.value === 'attention') return backup.status !== 'success'
  return true
}
const backupMatchesSearch = (backup, query) => {
  if (!query) return true
  return [
    backup?.label,
    backup?.id,
    backup?.status,
    backup?.size,
    backup?.path,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const activityMatchesFilter = (entry) => {
  if (activityFilter.value === 'attention') return ['error', 'warning', 'failed'].includes(entry.status)
  if (activityFilter.value === 'restart') return entry.restartRequired
  if (activityFilter.value === 'worlds') return ['worlds', 'backups'].includes(entry.type)
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
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const diagnosticsMatchesFilter = (check) => {
  if (diagnosticsFilter.value === 'all') return true
  return check.status === diagnosticsFilter.value
}
const diagnosticsMatchesSearch = (check, query) => {
  if (!query) return true
  return [
    check?.label,
    check?.message,
    check?.path,
    check?.status,
    check?.id,
  ].some((value) => String(value || '').toLowerCase().includes(query))
}
const comparableWorldTime = (world) => {
  const candidates = [
    world?.updatedAt,
    world?.lastPlayed,
    world?.createdAt,
    world?.mtime,
    world?.modifiedAt,
  ]
  for (const value of candidates) {
    const time = new Date(value).getTime()
    if (Number.isFinite(time)) return time
  }

  const match = comparableWorldName(world).match(/(\d+)(?!.*\d)/)
  return match ? Number(match[1]) : 0
}

const scrollElementToBottom = (element) => {
  if (!element) return
  element.scrollTop = element.scrollHeight
}

const scrollLogViewsToBottom = async () => {
  await nextTick()
  if (activeTab.value === 'overview') scrollElementToBottom(overviewLogsRef.value)
  if (activeTab.value === 'console') scrollElementToBottom(consoleRef.value)
  if (activeTab.value === 'logs') scrollElementToBottom(explorerLogsRef.value)
}

const serverInitials = (server) => {
  return String(server?.label || serverId.value || 'MC')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

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
  minecraft.setSelectedServer(serverId.value)
  await runWithToast(
    () => minecraft.fetchServer(serverId.value),
    { error: 'Server refresh failed' },
  )
}

const refreshDiagnostics = async () => {
  refreshingDiagnostics.value = true
  try {
    await runWithToast(
      () => minecraft.fetchDiagnostics(serverId.value),
      {
        success: 'Diagnostics refreshed',
        description: detail.value?.label,
        error: 'Diagnostics failed',
      },
    )
  } finally {
    refreshingDiagnostics.value = false
  }
}

const loadLogExplorer = async () => {
  loadingExplorerLogs.value = true
  try {
    await runWithToast(
      () => minecraft.exploreLogs(serverId.value, {
        file: selectedLogFile.value || 'latest.log',
        tail: logTail.value || 300,
        query: logSearch.value.trim(),
      }),
      { error: 'Log load failed' },
    )
    await scrollLogViewsToBottom()
  } finally {
    loadingExplorerLogs.value = false
  }
}

const selectLogFile = async (file) => {
  selectedLogFile.value = file.name || file.id || 'latest.log'
  await loadLogExplorer()
}

const exportLogFile = async () => {
  exportingLogs.value = true
  try {
    const result = await runWithToast(
      () => minecraft.exportLogs(serverId.value, {
        file: selectedLogFile.value || 'latest.log',
        tail: logTail.value || 300,
        query: logSearch.value.trim(),
      }),
      {
        success: 'Log export ready',
        description: selectedLogFile.value || 'latest.log',
        error: 'Log export failed',
      },
    )
    if (!result) return
    const blob = new Blob([result.text || ''], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = result.filename || `minecraft-${serverId.value}-logs.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } finally {
    exportingLogs.value = false
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

const downloadWorld = async (world) => {
  const archiveId = `world:${world.id}`
  downloadingArchiveId.value = archiveId
  try {
    const result = await runWithToast(
      () => minecraft.downloadWorldArchive(serverId.value, world),
      {
        success: 'World archive ready',
        description: world.name || world.id,
        error: 'World download failed',
      },
    )
    if (result?.blob) {
      triggerDownload(result.blob, result.filename || `minecraft-${serverId.value}-${world.id}.tar.gz`)
    }
  } finally {
    if (downloadingArchiveId.value === archiveId) downloadingArchiveId.value = null
  }
}

const downloadBackup = async (backup) => {
  const archiveId = `backup:${backup.id}`
  downloadingArchiveId.value = archiveId
  try {
    const result = await runWithToast(
      () => minecraft.downloadBackupArchive(serverId.value, backup),
      {
        success: 'Backup archive ready',
        description: backup.label || backup.id,
        error: 'Backup download failed',
      },
    )
    if (result?.blob) {
      triggerDownload(result.blob, result.filename || `minecraft-${serverId.value}-${backup.id}.tar.gz`)
    }
  } finally {
    if (downloadingArchiveId.value === archiveId) downloadingArchiveId.value = null
  }
}

const asBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  return fallback
}

const settingCurrentValue = (key) => {
  const settings = detail.value?.settings || {}
  if (key === 'white-list') return asBoolean(settings['white-list'], true)
  if (key === 'enforce-whitelist') return asBoolean(settings['enforce-whitelist'], false)
  if (key === 'pvp') return asBoolean(settings.pvp, true)
  if (key === 'difficulty') return settings.difficulty || 'normal'
  if (key === 'max-players') return Number(settings['max-players'] || detail.value?.maxPlayers || 20)
  if (key === 'view-distance') return Number(settings['view-distance'] || 10)
  if (key === 'simulation-distance') return Number(settings['simulation-distance'] || 10)
  if (key === 'motd') return settings.motd || ''
  return settings[key] ?? ''
}

const settingDisplayValue = (value) => {
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (value === undefined || value === null || value === '') return 'Blank'
  return String(value)
}

const resetSettingsDraft = () => {
  settingsDraft.value = {
    'white-list': settingCurrentValue('white-list'),
    'enforce-whitelist': settingCurrentValue('enforce-whitelist'),
    pvp: settingCurrentValue('pvp'),
    difficulty: settingCurrentValue('difficulty'),
    'max-players': settingCurrentValue('max-players'),
    'view-distance': settingCurrentValue('view-distance'),
    'simulation-distance': settingCurrentValue('simulation-distance'),
    motd: settingCurrentValue('motd'),
  }
}

const saveSettings = async () => {
  if (!detail.value || !settingsChanged.value) return
  const ok = window.confirm(`Update server.properties for ${detail.value.label}?`)
  if (!ok) return

  savingSettings.value = true
  try {
    await runWithToast(
      () => minecraft.updateSettings(serverId.value, { ...settingsDraft.value }, true),
      {
        success: 'Settings saved',
        description: detail.value.label,
        error: 'Settings update failed',
      },
    )
  } finally {
    savingSettings.value = false
  }
}

const runLifecycle = async (action) => {
  if (!detail.value) return
  await withActionLock(lifecycleActionKey(action), async () => {
    let confirmed = false
    if (['sleep', 'stop', 'restart'].includes(action)) {
      const ok = window.confirm(`${action.toUpperCase()} ${detail.value.label}?`)
      if (!ok) return null
      confirmed = true
    }
    return runWithToast(
      () => minecraft.lifecycleAction(serverId.value, action, confirmed),
      {
        success: `${actionLabel(action)} requested`,
        description: detail.value.label,
        error: `${actionLabel(action)} failed`,
      },
    )
  })
}

const applyPendingRestart = async () => {
  if (!detail.value) return
  if (canWake(detail.value)) {
    await runLifecycle('wake')
    return
  }
  if (canRestart(detail.value)) {
    await runLifecycle('restart')
  }
}

const submitCommand = async () => {
  const clean = command.value.trim()
  if (!clean) return
  const result = await withActionLock(namedActionKey('rcon', 'command', 'send'), async () => {
    if (commandNeedsConfirm(clean)) {
      const ok = window.confirm(`Run RCON command: ${clean}?`)
      if (!ok) return null
    }
    return runWithToast(
      () => minecraft.sendCommand(serverId.value, clean, commandNeedsConfirm(clean)),
      {
        success: 'Command sent',
        description: clean,
        error: 'RCON command failed',
      },
    )
  })
  if (!result) return
  command.value = ''
  await scrollLogViewsToBottom()
}

const runPlayerAction = async (player, action) => {
  await withActionLock(playerActionKey(player, action), async () => {
    if (['ban', 'pardon'].includes(action)) {
      const nextAction = action === 'ban' ? 'add' : 'remove'
      const ok = window.confirm(`${action.toUpperCase()} ${player.name}?`)
      if (!ok) return null
      return runWithToast(
        () => minecraft.updatePlayerBlacklist(serverId.value, player.name, nextAction, '', true),
        {
          success: `${actionLabel(action)} requested`,
          description: player.name,
          error: `${actionLabel(action)} failed`,
        },
      )
    }

    if (['kick', 'op', 'deop'].includes(action)) {
      const ok = window.confirm(`${action.toUpperCase()} ${player.name}?`)
      if (!ok) return null
    }
    return runWithToast(
      () => minecraft.runPlayerAction(serverId.value, player.name, action, {}, true),
      {
        success: `${actionLabel(action)} requested`,
        description: player.name,
        error: `${actionLabel(action)} failed`,
      },
    )
  })
}

const changeOpLevel = async (player, event) => {
  const level = Number(event.target.value)
  const previous = player.opLevel || 4
  if (level === previous) return

  const result = await withActionLock(playerActionKey(player, 'op-level'), async () => {
    const ok = window.confirm(`Set ${player.name} to OP level ${level}?`)
    if (!ok) {
      event.target.value = previous
      return null
    }

    return runWithToast(
      () => minecraft.updateOpSettings(serverId.value, player.name, {
        level,
        bypassesPlayerLimit: player.bypassesPlayerLimit === true,
      }, true),
      {
        success: 'OP settings updated',
        description: `${player.name} level ${level}`,
        error: 'OP settings failed',
      },
    )
  })
  if (!result) event.target.value = previous
}

const toggleOpBypass = async (player) => {
  const next = player.bypassesPlayerLimit !== true
  await withActionLock(playerActionKey(player, 'op-bypass'), async () => {
    const ok = window.confirm(`${next ? 'Allow' : 'Remove'} player-limit bypass for ${player.name}?`)
    if (!ok) return null

    return runWithToast(
      () => minecraft.updateOpSettings(serverId.value, player.name, {
        level: player.opLevel || 4,
        bypassesPlayerLimit: next,
      }, true),
      {
        success: 'OP settings updated',
        description: player.name,
        error: 'OP settings failed',
      },
    )
  })
}

const toggleWhitelist = async (player) => {
  const action = player.whitelisted ? 'remove' : 'add'
  await withActionLock(playerActionKey(player, 'whitelist'), async () => {
    if (action === 'remove') {
      const ok = window.confirm(`Remove ${player.name} from whitelist?`)
      if (!ok) return null
    }
    return runWithToast(
      () => minecraft.updateWhitelist(serverId.value, player.name, action, action === 'remove'),
      {
        success: `Whitelist ${action}`,
        description: player.name,
        error: 'Whitelist update failed',
      },
    )
  })
}

const addWhitelist = async () => {
  const name = newPlayerName.value.trim()
  if (!name) return
  const result = await withActionLock(namedActionKey('whitelist', name, 'add'), () => runWithToast(
    () => minecraft.updateWhitelist(serverId.value, name, 'add', false),
    {
      success: 'Player whitelisted',
      description: name,
      error: 'Whitelist update failed',
    },
  ))
  if (!result) return
  newPlayerName.value = ''
}

const addPlayerBlacklist = async () => {
  const name = newBlacklistName.value.trim()
  if (!name) return
  const result = await withActionLock(namedActionKey('blacklist-player', name, 'add'), async () => {
    const ok = window.confirm(`Ban ${name} from ${detail.value.label}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.updatePlayerBlacklist(serverId.value, name, 'add', blacklistReason.value.trim(), true),
      {
        success: 'Player banned',
        description: name,
        error: 'Player ban failed',
      },
    )
  })
  if (!result) return
  newBlacklistName.value = ''
  blacklistReason.value = ''
}

const removePlayerBlacklist = async (entry) => {
  const name = displayBanName(entry)
  if (!name) return
  await withActionLock(namedActionKey('blacklist-player', name, 'remove'), async () => {
    const ok = window.confirm(`Pardon ${name}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.updatePlayerBlacklist(serverId.value, name, 'remove', '', true),
      {
        success: 'Player pardoned',
        description: name,
        error: 'Pardon failed',
      },
    )
  })
}

const addIpBlacklist = async () => {
  const target = newBlacklistIp.value.trim()
  if (!target) return
  const result = await withActionLock(namedActionKey('blacklist-ip', target, 'add'), async () => {
    const ok = window.confirm(`Ban IP ${target} from ${detail.value.label}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.updateIpBlacklist(serverId.value, target, 'add', blacklistReason.value.trim(), true),
      {
        success: 'IP banned',
        description: target,
        error: 'IP ban failed',
      },
    )
  })
  if (!result) return
  newBlacklistIp.value = ''
  blacklistReason.value = ''
}

const removeIpBlacklist = async (entry) => {
  const target = displayBanIp(entry)
  if (!target) return
  await withActionLock(namedActionKey('blacklist-ip', target, 'remove'), async () => {
    const ok = window.confirm(`Pardon IP ${target}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.updateIpBlacklist(serverId.value, target, 'remove', '', true),
      {
        success: 'IP pardoned',
        description: target,
        error: 'IP pardon failed',
      },
    )
  })
}

const toggleMod = async (mod) => {
  await withActionLock(modActionKey(mod, 'toggle'), async () => {
    if (mod.enabled) {
      const ok = window.confirm(`Disable ${mod.name || mod.file}?`)
      if (!ok) return null
    }
    return runWithToast(
      () => minecraft.setModEnabled(serverId.value, mod, !mod.enabled, mod.enabled),
      {
        success: mod.enabled ? 'Mod disabled' : 'Mod enabled',
        description: mod.name || mod.file,
        error: 'Mod toggle failed',
      },
    )
  })
}

const searchMods = async () => {
  await runWithToast(
    () => minecraft.searchMods(serverId.value, modSearch.value),
    { error: 'Modrinth search failed' },
  )
}

const checkModUpdates = async () => {
  await withActionLock(namedActionKey('mods', 'updates', 'check'), () => runWithToast(
    () => minecraft.checkModUpdates(serverId.value),
    {
      success: 'Mod check finished',
      description: detail.value?.label,
      error: 'Mod update check failed',
    },
  ))
}

const installModProject = async (project) => {
  const projectId = project.projectId || project.slug
  await withActionLock(namedActionKey('mod-project', projectId, 'install'), async () => {
    const ok = window.confirm(`Install ${project.title || project.slug} on ${detail.value.label}?`)
    if (!ok) return null

    installingProjectId.value = projectId
    try {
      return await runWithToast(
      () => minecraft.installMod(serverId.value, project, true),
        {
          success: 'Mod installed',
          description: project.title || project.slug,
          error: 'Mod install failed',
        },
      )
    } finally {
      installingProjectId.value = null
    }
  })
}

const selectModUpload = () => {
  modUploadInput.value?.click()
}

const uploadSelectedMod = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file || !detail.value) return

  if (!file.name.toLowerCase().endsWith('.jar')) {
    toast({
      title: 'Upload blocked',
      description: 'Select a .jar mod file.',
      variant: 'destructive',
    })
    return
  }

  const ok = window.confirm(`Upload ${file.name} to ${detail.value.label}?`)
  if (!ok) return

  uploadingMod.value = true
  try {
    await runWithToast(
      () => minecraft.uploadMod(serverId.value, file, true),
      {
        successTitle: 'Mod uploaded',
        successDescription: `${file.name} is installed and will load after restart or wake.`,
        errorTitle: 'Mod upload failed',
      },
    )
  } finally {
    uploadingMod.value = false
  }
}

const updateMod = async (mod) => {
  await withActionLock(modActionKey(mod, 'update'), async () => {
    const ok = window.confirm(`Update ${mod.name || mod.file} from Modrinth?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.updateMod(serverId.value, mod, true),
      {
        success: 'Mod updated',
        description: mod.name || mod.file,
        error: 'Mod update failed',
      },
    )
  })
}

const updateAllMods = async () => {
  if (!updateCount.value) return
  await withActionLock(namedActionKey('mods', 'updates', 'all'), async () => {
    const ok = window.confirm(`Update ${updateCount.value} available mods on ${detail.value.label}?`)
    if (!ok) return null

    updatingAllMods.value = true
    try {
      return await runWithToast(
        () => minecraft.updateAllMods(serverId.value, true),
        {
          success: 'Bulk update finished',
          description: `${updateCount.value} mods checked`,
          error: 'Bulk update failed',
        },
      )
    } finally {
      updatingAllMods.value = false
    }
  })
}

const restoreModBackup = async (backup) => {
  await withActionLock(modBackupActionKey(backup, 'restore'), async () => {
    const ok = window.confirm(`Restore ${backup.originalFile} from backup? The current mod file will be moved aside.`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.restoreModBackup(serverId.value, backup, true),
      {
        success: 'Mod backup restored',
        description: backup.originalFile,
        error: 'Mod restore failed',
      },
    )
  })
}

const deleteModBackup = async (backup) => {
  await withActionLock(modBackupActionKey(backup, 'delete'), async () => {
    const ok = window.confirm(`Delete mod backup ${backup.file || backup.id}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.deleteModBackup(serverId.value, backup, true),
      {
        success: 'Mod backup deleted',
        description: backup.file || backup.id,
        error: 'Mod backup delete failed',
      },
    )
  })
}

const switchWorld = async (world) => {
  await withActionLock(worldActionKey(world, 'switch'), async () => {
    const ok = window.confirm(`Switch ${detail.value.label} to ${world.name}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.switchWorld(serverId.value, world, true),
      {
        success: 'World switch queued',
        description: world.name,
        error: 'World switch failed',
      },
    )
  })
}

const createWorld = async () => {
  const name = newWorldName.value.trim()
  if (!name) return
  const result = await withActionLock(namedActionKey('world', name, 'create'), async () => {
    const ok = window.confirm(`Create new world ${name}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.createWorld(serverId.value, { name }, true),
      {
        success: 'World created',
        description: name,
        error: 'World create failed',
      },
    )
  })
  if (!result) return
  newWorldName.value = ''
}

const deleteWorld = async (world) => {
  await withActionLock(worldActionKey(world, 'delete'), async () => {
    const ok = window.confirm(`Delete world ${world.name}? This cannot be undone.`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.deleteWorld(serverId.value, world, true),
      {
        success: 'World deleted',
        description: world.name,
        error: 'World delete failed',
      },
    )
  })
}

const backupWorld = async () => {
  await withActionLock(namedActionKey('world', 'active', 'backup'), () => runWithToast(
    () => minecraft.backupWorld(serverId.value),
    {
      success: 'Snapshot queued',
      description: detail.value?.label,
      error: 'Snapshot failed',
    },
  ))
}

const restoreBackup = async (backup) => {
  await withActionLock(backupActionKey(backup, 'restore'), async () => {
    const ok = window.confirm(`Restore backup ${backup.label || backup.id}? This may replace the active world.`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.restoreBackup(serverId.value, backup, true),
      {
        success: 'Backup restore queued',
        description: backup.label || backup.id,
        error: 'Backup restore failed',
      },
    )
  })
}

const deleteBackup = async (backup) => {
  await withActionLock(backupActionKey(backup, 'delete'), async () => {
    const ok = window.confirm(`Delete backup ${backup.label || backup.id}?`)
    if (!ok) return null
    return runWithToast(
      () => minecraft.deleteBackup(serverId.value, backup, true),
      {
        success: 'Backup deleted',
        description: backup.label || backup.id,
        error: 'Backup delete failed',
      },
    )
  })
}

const copyAddress = async () => {
  if (!detail.value) return
  await runWithToast(
    () => navigator.clipboard.writeText(`${detail.value.host}:${detail.value.publicPort}`),
    {
      success: 'Address copied',
      description: `${detail.value.host}:${detail.value.publicPort}`,
      error: 'Copy failed',
    },
  )
}

const canWake = (server) => ['offline', 'hibernating', 'degraded'].includes(server?.state)
const canRestart = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)
const canSleep = (server) => ['alive', 'warming', 'degraded'].includes(server?.state)

const stateMeta = (state) => {
  const states = {
    alive: { label: 'Active', pill: 'bg-emerald-400/10 text-emerald-200', dot: 'bg-emerald-300' },
    hibernating: { label: 'Sleeping', pill: 'bg-indigo-400/10 text-indigo-200', dot: 'bg-indigo-300' },
    warming: { label: 'Warming', pill: 'bg-amber-400/10 text-amber-200', dot: 'bg-amber-300' },
    stopping: { label: 'Stopping', pill: 'bg-orange-400/10 text-orange-200', dot: 'bg-orange-300' },
    degraded: { label: 'Degraded', pill: 'bg-rose-400/10 text-rose-200', dot: 'bg-rose-300' },
    offline: { label: 'Offline', pill: 'bg-slate-400/10 text-slate-300', dot: 'bg-slate-400' },
  }
  return states[state] || states.offline
}

const formatDate = (value) => {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (seconds) => {
  const total = Number(seconds || 0)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  if (days) return `${days}d ${hours}h`
  if (hours) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const formatNumber = (value) => Number(value || 0).toLocaleString()

const displayBanName = (entry) => entry?.name || entry?.playerName || entry?.target || ''
const displayBanIp = (entry) => entry?.ip || entry?.target || ''

const commandNeedsConfirm = (value) => {
  return ['guarded', 'destructive'].includes(commandRisk(value))
}

const modrinthHref = (mod) => `https://modrinth.com/mod/${mod.modrinthSlug}`

const modDependencies = (mod) => Array.isArray(mod?.dependencies) ? mod.dependencies : []
const modDependencyCount = (mod) => Number(mod?.dependencyCount ?? modDependencies(mod).length ?? 0)
const modRequiredDependencyCount = (mod) => Number(mod?.requiredDependencyCount ?? modDependencies(mod).filter((dependency) => dependency.type === 'required').length ?? 0)
const dependencyLabel = (dependency) => dependency.fileName || dependency.projectId || dependency.versionId || 'dependency'
const dependencyTone = (type) => {
  if (type === 'required') return 'bg-amber-400/10 text-amber-200'
  if (type === 'optional') return 'bg-sky-400/10 text-sky-200'
  if (type === 'embedded') return 'bg-emerald-400/10 text-emerald-200'
  return 'bg-white/[0.06] text-slate-300'
}

const maintenanceCronLabel = (maintenance) => {
  if (maintenance?.cronMatched) return 'Matched'
  if (maintenance?.cronPresent === false) return 'Missing'
  return 'Pending'
}

const maintenanceCronTone = (maintenance) => {
  if (maintenance?.cronMatched) return 'bg-emerald-400/10 text-emerald-200'
  if (maintenance?.cronPresent === false) return 'bg-rose-400/10 text-rose-200'
  return 'bg-amber-400/10 text-amber-200'
}

const maintenanceSnapshotLabel = (maintenance) => {
  if (maintenance?.latestBackupToday) return 'Done'
  if (maintenance?.latestBackup) return 'Stale'
  return 'Waiting'
}

const maintenanceSnapshotTone = (maintenance) => {
  if (maintenance?.latestBackupToday) return 'bg-emerald-400/10 text-emerald-200'
  if (maintenance?.latestBackup) return 'bg-amber-400/10 text-amber-200'
  return 'bg-slate-400/10 text-slate-300'
}

const logLineGroup = (line) => {
  const lower = String(line || '').toLowerCase()
  if (/\b(error|exception|failed|fatal)\b/.test(lower)) return 'errors'
  if (/\b(warn|warning)\b/.test(lower)) return 'warnings'
  if (lower.includes('rcon')) return 'rcon'
  if (lower.includes('panel')) return 'panel'
  if (/(joined the game|left the game|\bplayer\b|whitelist|deop|opped|banned|pardon|kick)/.test(lower)) return 'players'
  return 'other'
}

const logMatchesFilter = (line) => {
  if (logFilter.value === 'all') return true
  return logLineGroup(line) === logFilter.value
}

const logClass = (line) => {
  const group = logLineGroup(line)
  if (group === 'errors') return 'text-rose-300'
  if (group === 'warnings') return 'text-amber-300'
  if (group === 'rcon') return 'text-sky-300'
  if (group === 'panel') return 'text-emerald-300'
  if (group === 'players') return 'text-violet-300'
  return 'text-slate-300'
}

const activityPill = (entry) => {
  if (entry.status === 'warning') return 'bg-amber-400/10 text-amber-200'
  if (entry.status === 'error') return 'bg-rose-400/10 text-rose-200'
  return 'bg-emerald-400/10 text-emerald-200'
}

const diagnosticTone = (status) => {
  if (status === 'pass') return 'bg-emerald-400/10 text-emerald-200'
  if (status === 'warning') return 'bg-amber-400/10 text-amber-200'
  if (status === 'error') return 'bg-rose-400/10 text-rose-200'
  return 'bg-slate-400/10 text-slate-300'
}

watch(serverId, async (newServerId, oldServerId) => {
  if (oldServerId) {
    minecraft.stopLogStream(oldServerId)
    minecraft.stopStatusStream(oldServerId)
  }
  selectedLogFile.value = 'latest.log'
  logSearch.value = ''
  resetSettingsDraft()
  await refresh()
  minecraft.startLogStream(newServerId)
  if (!minecraft.fallbackMode) minecraft.startStatusStream(newServerId, { interval: 5000 })
})

watch(
  () => detail.value?.settings,
  () => {
    if (activeTab.value !== 'settings' || !settingsChanged.value) {
      resetSettingsDraft()
    }
  },
  { deep: true, immediate: true },
)

watch(
  logFiles,
  (files) => {
    if (!files.length) return
    if (!files.some((file) => file.name === selectedLogFile.value)) {
      selectedLogFile.value = files[0].name
    }
  },
  { immediate: true },
)

watch(
  rconReady,
  (ready) => {
    if (!ready) command.value = ''
  },
  { immediate: true },
)

watch(
  () => route.query.tab,
  (tab) => {
    const next = normalizedTab(tab)
    if (activeTab.value !== next) activeTab.value = next
  },
  { immediate: true },
)

watch(
  () => activeTab.value,
  (tab) => {
    const next = normalizedTab(tab)
    if (next !== tab) {
      activeTab.value = next
      return
    }

    scrollLogViewsToBottom()
    const currentTab = Array.isArray(route.query.tab) ? route.query.tab[0] : route.query.tab
    const currentValue = currentTab ? String(currentTab) : ''
    const nextValue = next === 'overview' ? '' : next
    if (currentValue !== nextValue) {
      router.replace({ query: queryWithTab(next) }).catch(() => {})
    }
  },
)

watch(
  () => [latestLogs.value.length, latestLogs.value[latestLogs.value.length - 1]],
  () => {
    scrollLogViewsToBottom()
  },
  { flush: 'post' },
)

watch(
  () => [filteredLogs.value.length, filteredLogs.value[filteredLogs.value.length - 1]],
  () => {
    if (activeTab.value === 'logs') scrollLogViewsToBottom()
  },
  { flush: 'post' },
)

onMounted(async () => {
  await refresh()
  resetSettingsDraft()
  minecraft.startLogStream(serverId.value)
  if (!minecraft.fallbackMode) minecraft.startStatusStream(serverId.value, { interval: 5000 })
  pollHandle = window.setInterval(refresh, 12000)
  await scrollLogViewsToBottom()
})

onUnmounted(() => {
  if (pollHandle) window.clearInterval(pollHandle)
  minecraft.stopLogStream(serverId.value)
  minecraft.stopStatusStream(serverId.value)
})
</script>

<style scoped>
.player-btn,
.mod-btn,
.settings-btn {
  display: inline-flex;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: rgb(226 232 240);
  transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.player-btn:hover,
.mod-btn:hover,
.settings-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.player-btn:disabled,
.mod-btn:disabled,
.settings-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.player-btn.danger,
.mod-btn.danger,
.settings-btn.danger {
  border-color: rgba(251, 113, 133, 0.25);
  background: rgba(251, 113, 133, 0.1);
  color: rgb(255 228 230);
}

.settings-btn.primary {
  border-color: rgba(52, 211, 153, 0.25);
  background: rgba(52, 211, 153, 0.12);
  color: rgb(209 250 229);
}

.player-btn.danger:hover,
.mod-btn.danger:hover,
.settings-btn.danger:hover {
  background: rgba(251, 113, 133, 0.15);
}

.settings-btn.primary:hover {
  background: rgba(52, 211, 153, 0.18);
}

.setting-input {
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  padding: 0 0.75rem;
  color: white;
  outline: none;
  transition: border-color 0.15s ease;
}

.setting-input:focus {
  border-color: rgba(56, 189, 248, 0.5);
}

.settings-toggle {
  display: flex;
  min-height: 4rem;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.75rem;
}

.settings-toggle input {
  height: 1rem;
  width: 1rem;
  accent-color: rgb(52 211 153);
}
</style>
