<template>
  <div
    class="min-h-screen text-gray-100
           bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,197,94,0.12),transparent_45%),radial-gradient(1000px_circle_at_85%_20%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(900px_circle_at_70%_85%,rgba(168,85,247,0.10),transparent_40%),linear-gradient(135deg,#05060a_0%,#070914_35%,#07060c_100%)]"
  >
    <!-- Header -->
    <div class="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              @click="goBack"
              class="text-gray-200 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back
            </Button>

            <div class="flex items-center gap-3 min-w-0">
              <!-- status dot with subtle glow -->
              <div class="relative shrink-0">
                <div :class="['w-3 h-3 rounded-full', getStatusColor(instance?.status)]" />
                <div :class="['absolute inset-0 rounded-full blur-md opacity-40', getStatusColor(instance?.status)]" />
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 min-w-0">
                  <h1 class="text-xl font-semibold tracking-tight truncate text-white">
                    {{ instance?.name }}
                  </h1>

                  <!-- small badge that screams "this is an environment/instance" -->
                  <span
                    class="hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px]
                           bg-white/5 border border-white/10 text-gray-200/90"
                  >
                    Instance
                  </span>
                </div>

                <!-- Instance "profile" line -->
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-300/80">
                  <span class="inline-flex items-center gap-2">
                    <span class="rounded-full w-1 h-1 bg-gray-500"></span>
                    Environment
                  </span>
                  <span class="text-gray-500">•</span>

                  <span class="truncate">{{ instance?.serverType }} {{ instance?.version }}</span>

                  <span class="text-gray-500">•</span>

                  <span class="inline-flex items-center gap-2 min-w-0">
                    <Server class="w-3 h-3 text-gray-300/80 shrink-0" />
                    <span class="truncate">{{ serverName || 'Loading...' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <Button
              v-if="instance?.status === 'stopped'"
              @click="startServer"
              :disabled="loading"
              class="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 disabled:opacity-60"
            >
              <Play class="w-4 h-4 mr-2" />
              Start Instance
            </Button>

            <Button
              v-if="instance?.status === 'running'"
              @click="showRestartDialog = true"
              :disabled="loading"
              variant="outline"
              class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20 disabled:opacity-60"
            >
              <RotateCw class="w-4 h-4 mr-2" />
              Restart Instance
            </Button>

            <Button
              v-if="instance?.status === 'running'"
              @click="showStopDialog = true"
              :disabled="loading"
              variant="destructive"
              class="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 disabled:opacity-60"
            >
              <Square class="w-4 h-4 mr-2" />
              Stop Instance
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="outline"
                  size="icon"
                  class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                >
                  <MoreVertical class="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem
                  @click="openWorldManager"
                  class="hover:bg-white/10 focus:bg-white/10"
                >
                  <Globe class="w-4 h-4 mr-2 text-purple-300" />
                  Manage Worlds
                </DropdownMenuItem>

                <DropdownMenuItem
                  @click="openConfigEditor"
                  class="hover:bg-white/10 focus:bg-white/10"
                >
                  <Settings class="w-4 h-4 mr-2 text-blue-300" />
                  Instance Configuration
                </DropdownMenuItem>

                <DropdownMenuItem
                  @click="showBackupDialog = true"
                  class="hover:bg-white/10 focus:bg-white/10"
                >
                  <Database class="w-4 h-4 mr-2 text-green-300" />
                  Backup Active World
                </DropdownMenuItem>

                <DropdownMenuSeparator class="bg-white/10" />

                <DropdownMenuItem
                  @click="showDeleteDialog = true"
                  class="text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                >
                  <Trash2 class="w-4 h-4 mr-2" />
                  Delete Instance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Job Banner -->
    <div v-if="activeJob" class="border-b border-white/10 bg-blue-500/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <Loader2 class="w-5 h-5 animate-spin text-blue-200" />
            <div>
              <div class="font-semibold text-white">Instance Job: {{ activeJob.type }}</div>
              <div class="text-sm text-gray-300/80">{{ activeJob.currentStageText || 'Processing...' }}</div>
            </div>
          </div>
          <span class="text-sm text-gray-300/80">{{ activeJob.progress }}%</span>
        </div>

        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
            :style="{ width: `${activeJob.progress}%` }"
          />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="!instance" class="text-center py-16">
        <Loader2 class="w-8 h-8 animate-spin mx-auto text-green-300" />
        <p class="text-gray-300/80 mt-4">Loading instance...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Instance Snapshot -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Environment Status -->
          <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium text-gray-300/80">Environment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-semibold tracking-tight text-white">
                  {{ getStatusText(instance.status) }}
                </span>
                <Server :class="['w-8 h-8', getStatusColor(instance.status)]" />
              </div>
              <div class="mt-3 text-xs text-gray-300/70">
                Instance controls affect the whole environment.
              </div>
            </CardContent>
          </Card>

          <!-- Player Capacity -->
          <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium text-gray-300/80">Player Pool</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-semibold tracking-tight text-white">
                  {{ instance.vitals?.playersOnline || 0 }}/{{ instance.vitals?.maxPlayers || instance.maxPlayers }}
                </span>
                <Users class="w-8 h-8 text-blue-300" />
              </div>
              <div class="mt-3 text-xs text-gray-300/70">
                Whitelist/roles live on the instance.
              </div>
            </CardContent>
          </Card>

          <!-- Active World -->
          <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium text-gray-300/80">Mounted World</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-between gap-3">
                <span class="text-2xl font-semibold tracking-tight text-white truncate">
                  {{ getCurrentWorldName() }}
                </span>
                <Globe class="w-8 h-8 text-purple-300 shrink-0" />
              </div>
              <div class="mt-3 text-xs text-gray-300/70">
                Swap worlds without changing the environment.
              </div>
            </CardContent>
          </Card>

          <!-- Uptime -->
          <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
            <CardHeader class="pb-3">
              <CardTitle class="text-sm font-medium text-gray-300/80">Instance Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-semibold tracking-tight text-white">
                  {{ formatUptime(instance.vitals?.uptime) }}
                </span>
                <Clock class="w-8 h-8 text-green-300" />
              </div>
              <div class="mt-3 text-xs text-gray-300/70">
                Time since last environment boot.
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Tabs -->
        <Tabs default-value="overview" class="w-full">
          <TabsList class="grid w-full grid-cols-5 bg-white/5 border border-white/10 backdrop-blur-xl p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              class="rounded-lg text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="console"
              class="rounded-lg text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow"
            >
              Console
            </TabsTrigger>
            <TabsTrigger
              value="files"
              class="rounded-lg text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow"
            >
              Files
            </TabsTrigger>
            <TabsTrigger
              value="players"
              class="rounded-lg text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow"
            >
              Players
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              class="rounded-lg text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/10 data-[state=active]:shadow"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <!-- Overview -->
          <TabsContent value="overview" class="space-y-6 mt-4">
            <!-- World Slot (instance manager vibe) -->
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader class="pb-2">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle class="text-white">World Slot</CardTitle>
                    <div class="text-xs text-gray-300/70 mt-1">
                      This instance loads exactly one world at a time — swapable without changing rules/mods.
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                    @click="openWorldManager"
                  >
                    <Globe class="w-4 h-4 mr-2 text-purple-300" />
                    Swap / Manage Worlds
                  </Button>
                </div>
              </CardHeader>

              <CardContent class="pt-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <div class="text-xs text-gray-300/70">Mounted World</div>
                    <div class="mt-1 flex items-center gap-3">
                      <div class="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.35)]" />
                      <div class="text-lg font-semibold text-white truncate">
                        {{ getCurrentWorldName() }}
                      </div>
                    </div>

                    <div class="mt-3 text-xs text-gray-300/70">
                      Tip: Worlds are “content”. Instances are “policy + mods + identity”.
                    </div>
                  </div>

                  <div class="bg-black/20 border border-white/10 rounded-xl p-4">
                    <div class="text-xs text-gray-300/70">Instance Address</div>
                    <div class="mt-2 flex items-center gap-2">
                      <code class="bg-black/30 border border-white/10 px-2 py-1 rounded-md font-mono text-gray-100 text-xs">
                        {{ instance.serverName }}:{{ instance.port }}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        @click="copyAddress"
                        class="text-gray-200 hover:text-white hover:bg-white/10"
                      >
                        <Copy class="w-3 h-3" />
                      </Button>
                    </div>

                    <div class="mt-3 text-xs text-gray-300/70">
                      Players connect to the instance, not a specific world.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Vitals -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
                <CardHeader>
                  <CardTitle class="text-sm text-gray-200">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-300/80">Current</span>
                      <span class="font-semibold text-white">{{ instance.vitals?.cpu || 0 }}%</span>
                    </div>
                    <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all shadow-[0_0_18px_rgba(34,197,94,0.35)]"
                        :style="{ width: `${instance.vitals?.cpu || 0}%` }"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
                <CardHeader>
                  <CardTitle class="text-sm text-gray-200">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-300/80">Current</span>
                      <span class="font-semibold text-white">{{ instance.vitals?.memory || 0 }}%</span>
                    </div>
                    <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        class="bg-blue-500 h-2 rounded-full transition-all shadow-[0_0_18px_rgba(59,130,246,0.35)]"
                        :style="{ width: `${instance.vitals?.memory || 0}%` }"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
                <CardHeader>
                  <CardTitle class="text-sm text-gray-200">Disk Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-300/80">Current</span>
                      <span class="font-semibold text-white">{{ instance.vitals?.disk || 0 }}%</span>
                    </div>
                    <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        class="bg-purple-500 h-2 rounded-full transition-all shadow-[0_0_18px_rgba(168,85,247,0.35)]"
                        :style="{ width: `${instance.vitals?.disk || 0}%` }"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <!-- Server/Instance Info -->
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader>
                <CardTitle class="text-white">Instance Profile</CardTitle>
              </CardHeader>

              <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <span class="text-gray-300/80">Environment Type:</span>
                  <p class="font-semibold mt-2 text-white">{{ instance?.serverType }}</p>
                </div>

                <div>
                  <span class="text-gray-300/80">Version:</span>
                  <p class="font-semibold mt-2 text-white">{{ instance.version }}</p>
                </div>

                <div>
                  <span class="text-gray-300/80">Memory Allocated:</span>
                  <p class="font-semibold mt-2 text-white">{{ instance.memory }}GB</p>
                </div>

                <div>
                  <span class="text-gray-300/80">Created:</span>
                  <p class="font-semibold mt-2 text-white">{{ formatDate(instance.createdAt) }}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Console -->
          <TabsContent value="console" class="space-y-4 mt-4">
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader>
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle class="text-white">Instance Console</CardTitle>
                    <div class="text-xs text-gray-300/70 mt-1">
                      Commands target the active world running inside this instance.
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      @click="clearLogs"
                      class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                    >
                      <Trash2 class="w-3 h-3 mr-2" />
                      Clear
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      @click="toggleAutoScroll"
                      class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                    >
                      {{ autoScroll ? 'Disable' : 'Enable' }} Auto-scroll
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div
                  ref="consoleRef"
                  class="bg-black/40 border border-white/10 rounded-xl p-4 h-96 overflow-y-auto font-mono text-xs space-y-1 text-gray-100"
                >
                  <div
                    v-for="(log, index) in logs"
                    :key="index"
                    :class="getLogClass(log)"
                  >
                    <span class="text-gray-400">[{{ log.timestamp }}]</span>
                    <span :class="getLogLevelClass(log.level)">{{ log.level }}:</span>
                    <span class="text-gray-100">{{ log.message }}</span>
                  </div>

                  <div v-if="logs.length === 0" class="text-gray-400 text-center py-8">
                    No logs available. Start the instance to see console output.
                  </div>
                </div>

                <div class="mt-4 flex gap-2">
                  <Input
                    v-model="command"
                    placeholder="Enter instance command..."
                    @keyup.enter="sendCommand"
                    :disabled="instance.status !== 'running'"
                    class="font-mono bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 focus-visible:ring-green-500/30"
                  />
                  <Button
                    @click="sendCommand"
                    :disabled="!command || instance.status !== 'running'"
                    class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20 disabled:opacity-60"
                  >
                    <Send class="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Files -->
          <TabsContent value="files" class="mt-4 space-y-4">
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle class="text-white">Instance Files</CardTitle>
                    <div class="text-xs text-gray-300/70 mt-1">
                      Mock file manager for the instance environment (world folder, configs, mods, logs).
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                      @click="mockRefreshFiles"
                    >
                      <RefreshCcw class="w-4 h-4 mr-2" />
                      Refresh
                    </Button>

                    <Button
                      size="sm"
                      class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                      @click="showMockUpload = true"
                    >
                      <Upload class="w-4 h-4 mr-2" />
                      Upload
                    </Button>

                    <Button
                      size="sm"
                      class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                      @click="showMockNewFolder = true"
                    >
                      <Plus class="w-4 h-4 mr-2" />
                      New Folder
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent class="space-y-4">
                <!-- Path + search -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div class="flex items-center gap-2 min-w-0">
                    <HardDrive class="w-4 h-4 text-purple-300 shrink-0" />
                    <code class="text-xs bg-black/30 border border-white/10 px-2 py-1 rounded-md font-mono text-gray-100 truncate">
                      /instance/{{ instance?.name || 'unknown' }}{{ mockCwd }}
                    </code>

                    <Button
                      size="sm"
                      variant="ghost"
                      class="text-gray-200 hover:text-white hover:bg-white/10"
                      :disabled="mockCwd === '/'"
                      @click="mockGoUp"
                    >
                      Up
                    </Button>
                  </div>

                  <div class="flex items-center gap-2">
                    <div class="relative">
                      <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        v-model="mockFileSearch"
                        placeholder="Search files..."
                        class="pl-9 bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 w-64"
                      />
                    </div>

                    <Select v-model="mockFileScope">
                      <SelectTrigger class="w-40 bg-white/5 border-white/10 text-gray-100">
                        <SelectValue placeholder="Scope" />
                      </SelectTrigger>
                      <SelectContent class="bg-[#070914]/95 border border-white/10 text-gray-100">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="world">World</SelectItem>
                        <SelectItem value="configs">Configs</SelectItem>
                        <SelectItem value="mods">Mods</SelectItem>
                        <SelectItem value="logs">Logs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Split: tree + details -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <!-- File list -->
                  <div class="lg:col-span-2 bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                    <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div class="text-sm text-gray-200 font-semibold">Directory</div>
                      <div class="text-xs text-gray-300/70">{{ mockFilteredFiles.length }} items</div>
                    </div>

                    <div class="divide-y divide-white/5">
                      <button
                        v-for="f in mockFilteredFiles"
                        :key="f.path"
                        class="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center justify-between gap-3"
                        :class="mockSelectedFile?.path === f.path ? 'bg-white/5' : ''"
                        @click="mockSelectFile(f)"
                        @dblclick="f.type === 'folder' ? mockEnterFolder(f) : null"
                      >
                        <div class="flex items-center gap-3 min-w-0">
                          <component
                            :is="mockFileIcon(f)"
                            class="w-5 h-5 shrink-0"
                            :class="f.type === 'folder' ? 'text-blue-300' : 'text-gray-300/80'"
                          />
                          <div class="min-w-0">
                            <div class="text-sm text-white truncate">
                              {{ f.name }}
                            </div>
                            <div class="text-xs text-gray-300/70 truncate">
                              {{ f.type === 'folder' ? 'Folder' : f.mime }} • {{ f.scope }}
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-3 shrink-0">
                          <div class="text-xs text-gray-300/70 hidden sm:block">
                            {{ f.type === 'folder' ? '-' : f.size }}
                          </div>

                          <div class="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              class="text-gray-200 hover:text-white hover:bg-white/10"
                              @click.stop="mockPreviewFile(f)"
                              :disabled="f.type === 'folder'"
                            >
                              <Eye class="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              class="text-gray-200 hover:text-white hover:bg-white/10"
                              @click.stop="mockDownloadFile(f)"
                              :disabled="f.type === 'folder'"
                            >
                              <Download class="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              class="text-gray-200 hover:text-white hover:bg-white/10"
                              @click.stop="mockRenameFile(f)"
                            >
                              <Pencil class="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              class="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                              @click.stop="mockDeleteFile(f)"
                            >
                              <Trash class="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- Details panel -->
                  <div class="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                    <div class="px-4 py-3 border-b border-white/10">
                      <div class="text-sm text-white font-semibold">Selection</div>
                      <div class="text-xs text-gray-300/70">Metadata + actions</div>
                    </div>

                    <div class="p-4 space-y-4">
                      <div v-if="!mockSelectedFile" class="text-sm text-gray-300/80">
                        Select a file or folder to see details.
                      </div>

                      <div v-else class="space-y-3">
                        <div class="flex items-start gap-3">
                          <component :is="mockFileIcon(mockSelectedFile)" class="w-6 h-6 text-gray-200 shrink-0" />
                          <div class="min-w-0">
                            <div class="text-white font-semibold truncate">{{ mockSelectedFile.name }}</div>
                            <div class="text-xs text-gray-300/70 truncate">{{ mockSelectedFile.path }}</div>
                          </div>
                        </div>

                        <Separator class="bg-white/10" />

                        <div class="space-y-2 text-sm">
                          <div class="flex justify-between text-gray-300/80">
                            <span>Type</span>
                            <span class="text-white">{{ mockSelectedFile.type }}</span>
                          </div>
                          <div class="flex justify-between text-gray-300/80">
                            <span>Scope</span>
                            <span class="text-white">{{ mockSelectedFile.scope }}</span>
                          </div>
                          <div class="flex justify-between text-gray-300/80" v-if="mockSelectedFile.type !== 'folder'">
                            <span>Size</span>
                            <span class="text-white">{{ mockSelectedFile.size }}</span>
                          </div>
                          <div class="flex justify-between text-gray-300/80">
                            <span>Updated</span>
                            <span class="text-white">{{ mockSelectedFile.updated }}</span>
                          </div>
                        </div>

                        <Separator class="bg-white/10" />

                        <div class="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                            @click="mockPreviewFile(mockSelectedFile)"
                            :disabled="mockSelectedFile.type === 'folder'"
                          >
                            <Eye class="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                            @click="mockDownloadFile(mockSelectedFile)"
                            :disabled="mockSelectedFile.type === 'folder'"
                          >
                            <Download class="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                            @click="mockRenameFile(mockSelectedFile)"
                          >
                            <Pencil class="w-4 h-4 mr-2" />
                            Rename
                          </Button>
                          <Button
                            variant="outline"
                            class="bg-red-600/30 border-red-500/30 text-red-100 hover:bg-red-500/25 hover:border-red-400/40"
                            @click="mockDeleteFile(mockSelectedFile)"
                          >
                            <Trash class="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>

                        <div class="text-xs text-gray-300/70">
                          Future: permissions, server-side zip, log streaming, bulk operations.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Mock Preview Drawer -->
                <div v-if="showMockPreview" class="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                  <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div class="text-sm text-white font-semibold">Preview</div>
                    <Button variant="ghost" class="text-gray-200 hover:bg-white/10" @click="showMockPreview = false">
                      Close
                    </Button>
                  </div>

                  <div class="p-4">
                    <pre class="bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-gray-100 overflow-auto max-h-72">
                      {{ mockPreviewText }}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Upload Dialog (mock) -->
            <Dialog v-model:open="showMockUpload">
              <DialogContent class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div class="space-y-3">
                  <div class="text-lg font-semibold text-white">Upload Files (Mock)</div>
                  <div class="text-sm text-gray-300/80">
                    Later this will upload via agent/API. For now this is just the vision.
                  </div>
                  <div class="bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300/80">
                    Drop zone goes here • Choose destination folder • Progress bars • Cancel
                  </div>
                  <div class="flex justify-end gap-2">
                    <Button variant="outline" class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20" @click="showMockUpload = false">
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <!-- New Folder Dialog (mock) -->
            <Dialog v-model:open="showMockNewFolder">
              <DialogContent class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div class="space-y-3">
                  <div class="text-lg font-semibold text-white">New Folder (Mock)</div>
                  <div class="text-sm text-gray-300/80">Creates a folder in the current directory.</div>
                  <div class="flex items-center gap-2">
                    <Input v-model="mockNewFolderName" placeholder="Folder name..." class="bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500" />
                    <Button class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20" @click="mockCreateFolder">
                      Create
                    </Button>
                  </div>
                  <div class="flex justify-end">
                    <Button variant="outline" class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20" @click="showMockNewFolder = false">
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <!-- Players -->
          <TabsContent value="players" class="mt-4 space-y-4">
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle class="text-white">Player Set</CardTitle>
                    <div class="text-xs text-gray-300/70 mt-1">
                      Mock instance-level player controls (whitelist, ops, bans, roles, notes).
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                      @click="showMockAddPlayer = true"
                    >
                      <UserPlus class="w-4 h-4 mr-2" />
                      Add Player
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                      @click="mockRefreshPlayers"
                    >
                      <RefreshCcw class="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent class="space-y-4">
                <!-- Filters -->
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <div class="relative">
                      <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        v-model="mockPlayerSearch"
                        placeholder="Search players..."
                        class="pl-9 bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 w-72"
                      />
                    </div>

                    <Select v-model="mockPlayerFilter">
                      <SelectTrigger class="w-44 bg-white/5 border-white/10 text-gray-100">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent class="bg-[#070914]/95 border border-white/10 text-gray-100">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="whitelisted">Whitelisted</SelectItem>
                        <SelectItem value="ops">Operators</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="flex items-center gap-4 text-xs text-gray-300/70">
                    <div class="flex items-center gap-2">
                      <div class="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]" />
                      Online: {{ mockPlayers.filter(p => p.online).length }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(59,130,246,0.35)]" />
                      Whitelisted: {{ mockPlayers.filter(p => p.whitelisted).length }}
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_18px_rgba(239,68,68,0.35)]" />
                      Banned: {{ mockPlayers.filter(p => p.banned).length }}
                    </div>
                  </div>
                </div>

                <!-- Table -->
                <div class="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                  <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div class="text-sm font-semibold text-white">Players</div>
                    <div class="text-xs text-gray-300/70">{{ mockFilteredPlayers.length }} records</div>
                  </div>

                  <div class="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow class="border-white/10">
                          <TableHead class="text-gray-300/80">Player</TableHead>
                          <TableHead class="text-gray-300/80">Status</TableHead>
                          <TableHead class="text-gray-300/80">Access</TableHead>
                          <TableHead class="text-gray-300/80">Role</TableHead>
                          <TableHead class="text-gray-300/80">Last Seen</TableHead>
                          <TableHead class="text-gray-300/80 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow
                          v-for="p in mockFilteredPlayers"
                          :key="p.id"
                          class="border-white/5 hover:bg-white/5"
                        >
                          <TableCell class="text-white">
                            <div class="flex items-center gap-3">
                              <div class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-semibold text-gray-100">
                                {{ p.name.slice(0, 2).toUpperCase() }}
                              </div>
                              <div>
                                <div class="font-semibold">{{ p.name }}</div>
                                <div class="text-xs text-gray-300/70 font-mono">uuid: {{ p.uuid }}</div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div class="inline-flex items-center gap-2">
                              <span
                                class="w-2.5 h-2.5 rounded-full"
                                :class="p.online ? 'bg-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]' : 'bg-gray-500'"
                              />
                              <span class="text-sm text-gray-100">{{ p.online ? 'Online' : 'Offline' }}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div class="flex flex-wrap gap-2">
                              <Badge
                                v-if="p.whitelisted"
                                class="bg-blue-500/20 text-blue-100 border border-blue-400/30"
                              >
                                Whitelisted
                              </Badge>
                              <Badge
                                v-if="p.op"
                                class="bg-purple-500/20 text-purple-100 border border-purple-400/30"
                              >
                                OP
                              </Badge>
                              <Badge
                                v-if="p.banned"
                                class="bg-red-500/20 text-red-100 border border-red-400/30"
                              >
                                Banned
                              </Badge>
                              <Badge
                                v-if="!p.whitelisted && !p.banned"
                                class="bg-white/5 text-gray-200 border border-white/10"
                              >
                                Default
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell class="text-gray-100">
                            <div class="flex items-center gap-2">
                              <component
                                :is="p.role === 'Owner' ? Crown : (p.role === 'Admin' ? Shield : ScrollText)"
                                class="w-4 h-4 text-gray-300/80"
                              />
                              <span>{{ p.role }}</span>
                            </div>
                          </TableCell>

                          <TableCell class="text-gray-300/80">{{ p.lastSeen }}</TableCell>

                          <TableCell class="text-right">
                            <div class="inline-flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                class="text-gray-200 hover:text-white hover:bg-white/10"
                                @click="mockOpenPlayer(p)"
                              >
                                <Eye class="w-4 h-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                class="text-blue-200 hover:text-blue-100 hover:bg-blue-500/10"
                                @click="mockToggleWhitelist(p)"
                              >
                                <KeyRound class="w-4 h-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                class="text-purple-200 hover:text-purple-100 hover:bg-purple-500/10"
                                @click="mockToggleOp(p)"
                              >
                                <Crown class="w-4 h-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                class="text-red-300 hover:text-red-200 hover:bg-red-500/10"
                                @click="mockToggleBan(p)"
                              >
                                <Ban class="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        <TableRow v-if="mockFilteredPlayers.length === 0" class="border-white/5">
                          <TableCell colspan="6" class="text-center py-10 text-gray-300/70">
                            No players match your filters.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <!-- Player detail (mock) -->
                <div v-if="mockSelectedPlayer" class="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                  <div class="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <div class="text-sm font-semibold text-white">Player Profile</div>
                      <div class="text-xs text-gray-300/70">Mock view — instance-level identity and permissions</div>
                    </div>
                    <Button variant="ghost" class="text-gray-200 hover:bg-white/10" @click="mockSelectedPlayer = null">
                      Close
                    </Button>
                  </div>

                  <div class="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div class="lg:col-span-2 space-y-3">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-semibold text-white">
                          {{ mockSelectedPlayer.name.slice(0, 2).toUpperCase() }}
                        </div>
                        <div>
                          <div class="text-white font-semibold text-lg">{{ mockSelectedPlayer.name }}</div>
                          <div class="text-xs text-gray-300/70 font-mono">uuid: {{ mockSelectedPlayer.uuid }}</div>
                        </div>
                      </div>

                      <Separator class="bg-white/10" />

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div class="text-xs text-gray-300/70">Access</div>
                          <div class="mt-2 flex flex-wrap gap-2">
                            <Badge class="bg-blue-500/20 text-blue-100 border border-blue-400/30" v-if="mockSelectedPlayer.whitelisted">Whitelisted</Badge>
                            <Badge class="bg-purple-500/20 text-purple-100 border border-purple-400/30" v-if="mockSelectedPlayer.op">OP</Badge>
                            <Badge class="bg-red-500/20 text-red-100 border border-red-400/30" v-if="mockSelectedPlayer.banned">Banned</Badge>
                            <Badge class="bg-white/5 text-gray-200 border border-white/10" v-if="!mockSelectedPlayer.whitelisted && !mockSelectedPlayer.banned">Default</Badge>
                          </div>
                        </div>

                        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div class="text-xs text-gray-300/70">Role</div>
                          <div class="mt-2 text-white font-semibold">{{ mockSelectedPlayer.role }}</div>
                          <div class="mt-1 text-xs text-gray-300/70">Future: role groups per instance</div>
                        </div>

                        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div class="text-xs text-gray-300/70">Last Seen</div>
                          <div class="mt-2 text-white font-semibold">{{ mockSelectedPlayer.lastSeen }}</div>
                        </div>

                        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div class="text-xs text-gray-300/70">Notes</div>
                          <div class="mt-2 text-gray-200/90 text-sm">
                            {{ mockSelectedPlayer.notes || 'No notes (yet).' }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-3">
                      <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div class="text-sm font-semibold text-white">Quick Actions</div>
                        <div class="text-xs text-gray-300/70 mt-1">
                          Standard ops you’d expect in an instance manager.
                        </div>

                        <div class="mt-4 space-y-2">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-gray-200">
                              <KeyRound class="w-4 h-4 text-blue-300" />
                              Whitelist
                            </div>
                            <Switch :checked="mockSelectedPlayer.whitelisted" @update:checked="mockToggleWhitelist(mockSelectedPlayer)" />
                          </div>

                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-gray-200">
                              <Crown class="w-4 h-4 text-purple-300" />
                              OP (Admin)
                            </div>
                            <Switch :checked="mockSelectedPlayer.op" @update:checked="mockToggleOp(mockSelectedPlayer)" />
                          </div>

                          <Separator class="bg-white/10" />

                          <Button
                            class="w-full bg-red-600/30 border border-red-500/30 text-red-100 hover:bg-red-500/25 hover:border-red-400/40"
                            @click="mockToggleBan(mockSelectedPlayer)"
                          >
                            <Ban class="w-4 h-4 mr-2" />
                            {{ mockSelectedPlayer.banned ? 'Unban Player' : 'Ban Player' }}
                          </Button>

                          <Button
                            variant="outline"
                            class="w-full bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20"
                            @click="mockKickPlayer(mockSelectedPlayer)"
                            :disabled="!mockSelectedPlayer.online"
                          >
                            <UserMinus class="w-4 h-4 mr-2" />
                            Kick (Mock)
                          </Button>
                        </div>
                      </div>

                      <div class="text-xs text-gray-300/70">
                        Future: per-player permission nodes, history, infractions, chat logs, inventories, telemetry.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Add Player Dialog (mock) -->
            <Dialog v-model:open="showMockAddPlayer">
              <DialogContent class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
                <div class="space-y-3">
                  <div class="text-lg font-semibold text-white">Add Player (Mock)</div>
                  <div class="text-sm text-gray-300/80">
                    Later: lookup by username/UUID, invite flows, temp access, role assignment.
                  </div>

                  <div class="space-y-2">
                    <Label class="text-gray-200">Username</Label>
                    <Input v-model="mockNewPlayerName" placeholder="e.g. ThatMasonGuy" class="bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500" />
                  </div>

                  <div class="space-y-2">
                    <Label class="text-gray-200">Access</Label>
                    <Select v-model="mockNewPlayerAccess">
                      <SelectTrigger class="bg-white/5 border-white/10 text-gray-100">
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      <SelectContent class="bg-[#070914]/95 border border-white/10 text-gray-100">
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="whitelisted">Whitelisted</SelectItem>
                        <SelectItem value="op">OP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div class="flex justify-end gap-2">
                    <Button variant="outline" class="bg-white/5 border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20" @click="showMockAddPlayer = false">
                      Cancel
                    </Button>
                    <Button class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20" @click="mockAddPlayer">
                      Add
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <!-- Settings -->
          <TabsContent value="settings" class="mt-4">
            <Card class="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/30">
              <CardHeader>
                <CardTitle class="text-white">Instance Settings</CardTitle>
              </CardHeader>

              <CardContent class="space-y-6">
                <div class="space-y-2">
                  <Label htmlFor="instanceName" class="text-gray-200">Instance Name</Label>
                  <Input
                    id="instanceName"
                    :model-value="instance.name"
                    disabled
                    class="bg-white/5 border-white/10 text-gray-100 disabled:opacity-70"
                  />
                </div>

                <div class="space-y-2">
                  <Label htmlFor="memory" class="text-gray-200">Memory Allocation (GB)</Label>
                  <Input
                    id="memory"
                    type="number"
                    :model-value="instance.memory"
                    disabled
                    class="bg-white/5 border-white/10 text-gray-100 disabled:opacity-70"
                  />
                </div>

                <div class="space-y-2">
                  <Label htmlFor="port" class="text-gray-200">Server Port</Label>
                  <Input
                    id="port"
                    type="number"
                    :model-value="instance.port"
                    disabled
                    class="bg-white/5 border-white/10 text-gray-100 disabled:opacity-70"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <Checkbox :checked="instance.autoStart" disabled />
                  <Label class="text-gray-200">Auto-start on boot</Label>
                </div>

                <div class="flex items-center gap-2">
                  <Checkbox :checked="instance.autoRestart" disabled />
                  <Label class="text-gray-200">Auto-restart on crash</Label>
                </div>

                <Alert class="bg-white/5 border border-white/10 text-gray-100">
                  <Info class="h-4 w-4 text-blue-300" />
                  <AlertTitle class="text-white">Settings are locked</AlertTitle>
                  <AlertDescription class="text-gray-300/80">
                    Configuration editing will be enabled in a future update
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <!-- Stop Confirmation Dialog -->
    <AlertDialog v-model:open="showStopDialog">
      <AlertDialogContent class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-white">Stop Instance?</AlertDialogTitle>
          <AlertDialogDescription class="text-gray-300/80">
            This will gracefully shut down the environment. Players will be disconnected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction @click="stopServer" class="bg-red-600 hover:bg-red-700 text-white">
            Stop Instance
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Restart Confirmation Dialog -->
    <AlertDialog v-model:open="showRestartDialog">
      <AlertDialogContent class="bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-white">Restart Instance?</AlertDialogTitle>
          <AlertDialogDescription class="text-gray-300/80">
            The environment will shut down and reboot. This usually takes 30-60 seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-white/5 border border-white/10 text-gray-100 hover:bg-white/10 hover:border-white/20">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction @click="restartServer" class="bg-orange-600 hover:bg-orange-700 text-white">
            Restart Instance
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- World Manager Dialog -->
    <Dialog v-model:open="showWorldManager">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#070914]/95 text-gray-100 border border-white/10 shadow-2xl backdrop-blur-xl">
        <MinecraftWorldManager
          :instance="instance"
          @close="showWorldManager = false"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMinecraftStore } from '@/stores/useMinecraftStore'
import { useServers } from '@/composables/useServers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import MinecraftWorldManager from '@/components/minecraft/MinecraftWorldManager.vue'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  Play,
  Square,
  RotateCw,
  Loader2,
  Server,
  Users,
  Clock,
  Globe,
  MoreVertical,
  Settings,
  Database,
  Trash2,
  Copy,
  Send,
  Info,
  Layers,
  Package,
  Folder,
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  FileArchive, 
  FileCode2, 
  HardDrive,
  Upload, 
  Download, 
  RefreshCcw, 
  Search, 
  Plus, 
  Pencil, 
  Trash, 
  Eye, 
  Shield, 
  UserPlus,
  UserMinus, 
  Ban, 
  CheckCircle2, 
  XCircle, 
  Crown, 
  KeyRound, 
  Globe2, 
  ScrollText
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const minecraftStore = useMinecraftStore()
const { getServers } = useServers()

const instanceId = route.params.id
const serverId = route.query.serverId
const instance = ref(null)
const loading = ref(false)
const serverName = ref('')
const logs = ref([])
const command = ref('')
const consoleRef = ref(null)
const autoScroll = ref(true)

const showStopDialog = ref(false)
const showRestartDialog = ref(false)
const showDeleteDialog = ref(false)
const showBackupDialog = ref(false)
const showWorldManager = ref(false)

const activeJob = computed(() => {
  return minecraftStore.jobs.find(j => 
    j.instanceId === instanceId && 
    (j.status === 'running' || j.status === 'pending')
  )
})

// Load server name
async function loadServerName() {
  if (!serverId) return
  try {
    const servers = await getServers()
    const server = servers.find(s => s.id === serverId)
    if (server) {
      serverName.value = server.name
    }
  } catch (error) {
    console.error('Error loading server name:', error)
  }
}

// Go back to dashboard with serverId
function goBack() {
  router.push(`/minecraft/dashboard?serverId=${serverId}`)
}

onMounted(async () => {
  try {
    await loadServerName()
    await minecraftStore.fetchInstances(serverId)
    await minecraftStore.fetchJobs(instanceId)
    
    instance.value = minecraftStore.getInstanceById(instanceId)
    
    minecraftStore.subscribeToInstances(serverId)
    minecraftStore.subscribeToJobs(instanceId)
    
    // Mock logs for demonstration
    generateMockLogs()
  } catch (error) {
    console.error('Error loading instance:', error)
  }
})

onUnmounted(() => {
  minecraftStore.unsubscribeAll()
})

watch(() => minecraftStore.instances, () => {
  instance.value = minecraftStore.getInstanceById(instanceId)
}, { deep: true })

watch(logs, async () => {
  if (autoScroll.value) {
    await nextTick()
    if (consoleRef.value) {
      consoleRef.value.scrollTop = consoleRef.value.scrollHeight
    }
  }
}, { deep: true })

const getStatusColor = (status) => {
  const colors = {
    running: 'text-green-400 animate-pulse',
    stopped: 'text-gray-500',
    starting: 'text-yellow-400 animate-pulse',
    error: 'text-red-400'
  }
  return colors[status] || 'text-gray-500'
}

const getStatusText = (status) => {
  const texts = {
    running: 'Online',
    stopped: 'Offline',
    starting: 'Starting',
    error: 'Error'
  }
  return texts[status] || status
}

const getCurrentWorldName = () => {
  if (!instance.value?.activeWorld || !instance.value?.worlds) return 'None'
  const world = instance.value.worlds.find(w => w.id === instance.value.activeWorld)
  return world?.name || 'Unknown'
}

const formatUptime = (seconds) => {
  if (!seconds) return '0m'
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleString()
}

const startServer = async () => {
  loading.value = true
  try {
    // API call to start server
    console.log('Starting server...')
    await minecraftStore.updateInstance(instanceId, { status: 'starting' })
    setTimeout(() => {
      minecraftStore.updateInstance(instanceId, { status: 'running' })
    }, 3000)
  } catch (error) {
    console.error('Error starting server:', error)
  } finally {
    loading.value = false
  }
}

const stopServer = async () => {
  loading.value = true
  try {
    await minecraftStore.updateInstance(instanceId, { status: 'stopped' })
    showStopDialog.value = false
  } catch (error) {
    console.error('Error stopping server:', error)
  } finally {
    loading.value = false
  }
}

const restartServer = async () => {
  loading.value = true
  try {
    await minecraftStore.updateInstance(instanceId, { status: 'starting' })
    setTimeout(() => {
      minecraftStore.updateInstance(instanceId, { status: 'running' })
    }, 3000)
    showRestartDialog.value = false
  } catch (error) {
    console.error('Error restarting server:', error)
  } finally {
    loading.value = false
  }
}

const sendCommand = () => {
  if (!command.value) return
  
  logs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    level: 'COMMAND',
    message: command.value
  })
  
  command.value = ''
}

const copyAddress = () => {
  const address = `${instance.value.serverName}:${instance.value.port}`
  navigator.clipboard.writeText(address)
}

const clearLogs = () => {
  logs.value = []
}

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value
}

const openWorldManager = () => {
  showWorldManager.value = true
}

const openConfigEditor = () => {
  console.log('Open config editor')
}

const getLogClass = (log) => {
  return 'hover:bg-gray-900/50 px-2 py-0.5 rounded'
}

const getLogLevelClass = (level) => {
  const classes = {
    INFO: 'text-green-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
    DEBUG: 'text-blue-400',
    COMMAND: 'text-purple-400'
  }
  return classes[level] || 'text-gray-400'
}

const generateMockLogs = () => {
  logs.value = [
    { timestamp: '12:00:01', level: 'INFO', message: 'Starting Minecraft server version 1.21.4' },
    { timestamp: '12:00:02', level: 'INFO', message: 'Loading properties' },
    { timestamp: '12:00:03', level: 'INFO', message: 'Preparing level "world"' },
    { timestamp: '12:00:05', level: 'INFO', message: 'Preparing spawn area: 0%' },
    { timestamp: '12:00:07', level: 'INFO', message: 'Preparing spawn area: 47%' },
    { timestamp: '12:00:09', level: 'INFO', message: 'Preparing spawn area: 94%' },
    { timestamp: '12:00:10', level: 'INFO', message: 'Done! For help, type "help"' }
  ]
}

// ─────────────────────────────────────────────────────────────
// MOCK FILE SYSTEM (UI-only vision)
// ─────────────────────────────────────────────────────────────
const mockCwd = ref('/')
const mockFileSearch = ref('')
const mockFileScope = ref('all')
const mockSelectedFile = ref(null)
const showMockPreview = ref(false)
const mockPreviewText = ref('')
const showMockUpload = ref(false)
const showMockNewFolder = ref(false)
const mockNewFolderName = ref('')

const mockFiles = ref([
  // Root
  { type: 'folder', name: 'worlds', path: '/worlds', scope: 'world', updated: 'Today 11:12', size: '-' },
  { type: 'folder', name: 'config', path: '/config', scope: 'configs', updated: 'Today 10:40', size: '-' },
  { type: 'folder', name: 'mods', path: '/mods', scope: 'mods', updated: 'Yesterday 22:05', size: '-' },
  { type: 'folder', name: 'logs', path: '/logs', scope: 'logs', updated: 'Today 11:53', size: '-' },
  { type: 'file', name: 'server.properties', path: '/server.properties', scope: 'configs', mime: 'text/plain', updated: 'Today 09:18', size: '4.2 KB' },
  { type: 'file', name: 'whitelist.json', path: '/whitelist.json', scope: 'configs', mime: 'application/json', updated: 'Today 09:19', size: '1.1 KB' },

  // Worlds
  { type: 'folder', name: 'world_main', path: '/worlds/world_main', scope: 'world', updated: 'Today 11:50', size: '-' },
  { type: 'folder', name: 'world_hc', path: '/worlds/world_hc', scope: 'world', updated: 'Yesterday 21:12', size: '-' },

  { type: 'file', name: 'level.dat', path: '/worlds/world_main/level.dat', scope: 'world', mime: 'application/octet-stream', updated: 'Today 11:50', size: '256 KB' },
  { type: 'file', name: 'session.lock', path: '/worlds/world_main/session.lock', scope: 'world', mime: 'text/plain', updated: 'Today 11:50', size: '0.1 KB' },
  { type: 'file', name: 'region', path: '/worlds/world_main/region', scope: 'world', mime: 'folder-like', updated: 'Today 11:50', size: '—' },

  // Config
  { type: 'file', name: 'fabric-loader.json', path: '/config/fabric-loader.json', scope: 'configs', mime: 'application/json', updated: 'Today 10:40', size: '2.6 KB' },
  { type: 'file', name: 'ruleset.json', path: '/config/ruleset.json', scope: 'configs', mime: 'application/json', updated: 'Today 10:41', size: '3.0 KB' },

  // Mods
  { type: 'file', name: 'lithium-fabric.jar', path: '/mods/lithium-fabric.jar', scope: 'mods', mime: 'application/java-archive', updated: 'Yesterday 22:05', size: '1.3 MB' },
  { type: 'file', name: 'ferritecore.jar', path: '/mods/ferritecore.jar', scope: 'mods', mime: 'application/java-archive', updated: 'Yesterday 22:05', size: '370 KB' },
  { type: 'file', name: 'simple-voice-chat.jar', path: '/mods/simple-voice-chat.jar', scope: 'mods', mime: 'application/java-archive', updated: 'Yesterday 22:05', size: '6.4 MB' },

  // Logs
  { type: 'file', name: 'latest.log', path: '/logs/latest.log', scope: 'logs', mime: 'text/plain', updated: 'Today 11:53', size: '188 KB' },
  { type: 'file', name: '2026-01-05-1.log.gz', path: '/logs/2026-01-05-1.log.gz', scope: 'logs', mime: 'application/gzip', updated: 'Today 06:00', size: '12.2 MB' },
])

const mockFilesInCwd = computed(() => {
  const cwd = mockCwd.value
  const isRoot = cwd === '/'
  // show direct children only
  return mockFiles.value.filter(f => {
    const parent = isRoot ? '/' : cwd
    if (!f.path.startsWith(parent)) return false
    const rest = isRoot ? f.path.slice(1) : f.path.slice(parent.length + 1)
    if (!rest) return false
    return !rest.includes('/')
  })
})

const mockFilteredFiles = computed(() => {
  const q = mockFileSearch.value.trim().toLowerCase()
  return mockFilesInCwd.value.filter(f => {
    if (mockFileScope.value !== 'all' && f.scope !== mockFileScope.value) return false
    if (!q) return true
    return (f.name || '').toLowerCase().includes(q) || (f.path || '').toLowerCase().includes(q)
  })
})

function mockFileIcon(f) {
  if (!f) return FileText
  if (f.type === 'folder') return Folder
  const mime = f.mime || ''
  if (mime.includes('json')) return FileCode2
  if (mime.includes('gzip')) return FileArchive
  if (mime.includes('image')) return ImageIcon
  if (mime.includes('java-archive')) return FileArchive
  return FileText
}

function mockSelectFile(f) {
  mockSelectedFile.value = f
}

function mockEnterFolder(f) {
  if (f.type !== 'folder') return
  mockCwd.value = f.path
  mockSelectedFile.value = null
  showMockPreview.value = false
}

function mockGoUp() {
  if (mockCwd.value === '/') return
  const parts = mockCwd.value.split('/').filter(Boolean)
  parts.pop()
  mockCwd.value = '/' + parts.join('/')
  if (mockCwd.value === '/') mockCwd.value = '/'
  mockSelectedFile.value = null
  showMockPreview.value = false
}

function mockPreviewFile(f) {
  if (!f || f.type === 'folder') return
  showMockPreview.value = true

  // mock content
  if (f.name === 'server.properties') {
    mockPreviewText.value =
`# Minecraft server properties (mock)
motd=${instance.value?.name || 'MC Instance'} — Instance Environment
max-players=${instance.value?.maxPlayers || 20}
level-name=${getCurrentWorldName()}
difficulty=hard
white-list=true
spawn-protection=0`
    return
  }

  if ((f.mime || '').includes('json')) {
    mockPreviewText.value =
`{
  "mock": true,
  "file": "${f.name}",
  "instance": "${instance.value?.name || 'unknown'}",
  "note": "This is placeholder content for the UI vision."
}`
    return
  }

  if (f.name.includes('.log')) {
    mockPreviewText.value =
`[12:00:01] [INFO] Starting Minecraft server
[12:00:02] [INFO] Loading instance environment
[12:00:03] [INFO] Mounting world: ${getCurrentWorldName()}
[12:00:10] [INFO] Done! For help, type "help"`
    return
  }

  mockPreviewText.value = `Preview not available for ${f.name} (mock).`
}

function mockDownloadFile(f) {
  // mock only
  console.log('Mock download:', f?.path)
}

function mockRenameFile(f) {
  console.log('Mock rename:', f?.path)
}

function mockDeleteFile(f) {
  console.log('Mock delete:', f?.path)
  if (!f) return
  // purely visual remove for mock
  mockFiles.value = mockFiles.value.filter(x => x.path !== f.path)
  if (mockSelectedFile.value?.path === f.path) mockSelectedFile.value = null
}

function mockRefreshFiles() {
  console.log('Mock refresh files')
}

function mockCreateFolder() {
  const name = mockNewFolderName.value.trim()
  if (!name) return
  const base = mockCwd.value === '/' ? '' : mockCwd.value
  const path = `${base}/${name}`.replaceAll('//', '/')
  mockFiles.value.unshift({
    type: 'folder',
    name,
    path,
    scope: 'all',
    updated: 'Just now',
    size: '-',
  })
  mockNewFolderName.value = ''
  showMockNewFolder.value = false
}


// ─────────────────────────────────────────────────────────────
// MOCK PLAYERS (UI-only vision)
// ─────────────────────────────────────────────────────────────
const mockPlayers = ref([
  { id: 'p1', name: 'ThatMasonGuy', uuid: '0d00...cafe', online: true,  whitelisted: true,  op: true,  banned: false, role: 'Owner', lastSeen: 'Now', notes: 'Instance owner.' },
  { id: 'p2', name: 'Dylan',       uuid: 'd1y1...b33f', online: false, whitelisted: true,  op: false, banned: false, role: 'Member', lastSeen: 'Yesterday 9:12 PM', notes: 'Roommate. Allowed to vibe.' },
  { id: 'p3', name: 'Froggy',      uuid: 'fr0g...1234', online: false, whitelisted: true,  op: false, banned: false, role: 'Member', lastSeen: '2 days ago', notes: '' },
  { id: 'p4', name: 'Velvet',      uuid: 'v3lv...eeee', online: false, whitelisted: false, op: false, banned: false, role: 'Guest', lastSeen: 'Never', notes: 'Pending invite.' },
  { id: 'p5', name: 'GrieferAlt',  uuid: 'baad...f00d', online: false, whitelisted: false, op: false, banned: true,  role: 'Banned', lastSeen: '3 weeks ago', notes: 'Banned for obvious reasons.' },
])

const mockPlayerSearch = ref('')
const mockPlayerFilter = ref('all')
const mockSelectedPlayer = ref(null)

const showMockAddPlayer = ref(false)
const mockNewPlayerName = ref('')
const mockNewPlayerAccess = ref('default')

const mockFilteredPlayers = computed(() => {
  const q = mockPlayerSearch.value.trim().toLowerCase()
  return mockPlayers.value.filter(p => {
    if (mockPlayerFilter.value === 'online' && !p.online) return false
    if (mockPlayerFilter.value === 'whitelisted' && !p.whitelisted) return false
    if (mockPlayerFilter.value === 'ops' && !p.op) return false
    if (mockPlayerFilter.value === 'banned' && !p.banned) return false

    if (!q) return true
    return p.name.toLowerCase().includes(q) || p.uuid.toLowerCase().includes(q)
  })
})

function mockOpenPlayer(p) {
  mockSelectedPlayer.value = p
}

function mockToggleWhitelist(p) {
  if (!p) return
  p.whitelisted = !p.whitelisted
  if (p.whitelisted && p.banned) p.banned = false
  if (mockSelectedPlayer.value?.id === p.id) mockSelectedPlayer.value = { ...p }
}

function mockToggleOp(p) {
  if (!p) return
  p.op = !p.op
  if (p.op) {
    p.whitelisted = true
    p.role = p.role === 'Owner' ? 'Owner' : 'Admin'
  } else {
    if (p.role === 'Admin') p.role = 'Member'
  }
  if (mockSelectedPlayer.value?.id === p.id) mockSelectedPlayer.value = { ...p }
}

function mockToggleBan(p) {
  if (!p) return
  p.banned = !p.banned
  if (p.banned) {
    p.online = false
    p.whitelisted = false
    p.op = false
    p.role = 'Banned'
  } else {
    if (p.role === 'Banned') p.role = 'Guest'
  }
  if (mockSelectedPlayer.value?.id === p.id) mockSelectedPlayer.value = { ...p }
}

function mockKickPlayer(p) {
  console.log('Mock kick:', p?.name)
  if (!p) return
  p.online = false
  if (mockSelectedPlayer.value?.id === p.id) mockSelectedPlayer.value = { ...p }
}

function mockAddPlayer() {
  const name = mockNewPlayerName.value.trim()
  if (!name) return

  const base = {
    id: `p_${Math.random().toString(16).slice(2)}`,
    name,
    uuid: `${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
    online: false,
    whitelisted: false,
    op: false,
    banned: false,
    role: 'Guest',
    lastSeen: 'Never',
    notes: '',
  }

  if (mockNewPlayerAccess.value === 'whitelisted') base.whitelisted = true
  if (mockNewPlayerAccess.value === 'op') {
    base.whitelisted = true
    base.op = true
    base.role = 'Admin'
  }

  mockPlayers.value.unshift(base)
  mockNewPlayerName.value = ''
  mockNewPlayerAccess.value = 'default'
  showMockAddPlayer.value = false
}

function mockRefreshPlayers() {
  console.log('Mock refresh players')
}

</script>