<template>
    <div class="min-h-screen bg-[#0a0e14] text-gray-100 p-6 relative overflow-hidden">
        <!-- Animated background -->
        <div class="fixed inset-0 opacity-30 pointer-events-none">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                style="animation-delay: 1s"></div>
        </div>

        <!-- Error State -->
        <div v-if="connectionError"
            class="relative z-10 mb-6 p-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 backdrop-blur-sm">
            <div class="flex items-center gap-3">
                <AlertTriangle class="w-6 h-6 text-red-400 animate-pulse" />
                <div>
                    <p class="font-mono text-red-400 font-bold">CONNECTION FAILED</p>
                    <p class="text-sm text-gray-400 font-mono">{{ connectionError }}</p>
                </div>
                <button @click="fetchStats"
                    class="ml-auto px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-mono text-sm">
                    RETRY
                </button>
            </div>
        </div>

        <!-- Header -->
        <div class="relative z-10 mb-8">
            <div class="flex items-center justify-between mb-2">
                <h1 class="flex items-center gap-3 font-mono text-3xl">
                    <Activity class="w-8 h-8 text-emerald-400 animate-pulse" />
                    <span class="text-emerald-400">SSH Relay</span>
                    <span class="text-gray-600">/</span>
                    <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Admin
                        Monitor</span>
                </h1>

                <div class="flex items-center gap-4">
                    <button @click="autoRefresh = !autoRefresh" class="neon-button"
                        :class="autoRefresh ? 'neon-button-active' : ''">
                        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
                        <span class="font-mono text-sm">AUTO</span>
                    </button>

                    <button @click="fetchStats" class="neon-button">
                        <RefreshCw class="w-4 h-4" />
                        <span class="font-mono text-sm">REFRESH</span>
                    </button>

                    <div class="glass-panel px-4 py-2">
                        <Clock class="w-4 h-4 text-emerald-400 inline mr-2" />
                        <span class="font-mono text-xs text-gray-400">{{ lastUpdate }}</span>
                    </div>
                </div>
            </div>

            <p class="text-gray-500 font-mono text-sm flex items-center gap-2">
                <Zap class="w-4 h-4 text-yellow-400" />
                Real-time monitoring • {{ refreshInterval / 1000 }}s refresh • {{ stats.sessionCount || 0 }} active
            </p>
        </div>

        <!-- Stats Grid -->
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <!-- Server Status -->
            <div class="cyber-card" :class="connectionError ? 'border-red-500/50' : 'border-emerald-500/50'">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="glow-icon bg-emerald-500/10">
                            <Server class="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-mono">SERVER STATUS</p>
                            <p class="text-2xl font-bold text-emerald-400 font-mono">{{ connectionError ? 'ERROR' :
                                'ONLINE' }}</p>
                        </div>
                    </div>
                    <div class="status-pulse" :class="connectionError ? 'bg-red-500' : 'bg-emerald-400'"></div>
                </div>
                <div class="space-y-1 text-xs font-mono text-gray-500">
                    <p>Uptime: {{ formatUptime(stats.system?.uptime) }}</p>
                    <p>Host: {{ stats.system?.hostname || 'N/A' }}</p>
                </div>
            </div>

            <!-- Active Sessions -->
            <div class="cyber-card border-blue-500/50">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="glow-icon bg-blue-500/10">
                            <Users class="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-mono">ACTIVE SESSIONS</p>
                            <p class="text-2xl font-bold text-blue-400 font-mono">{{ stats.sessionCount || 0 }}</p>
                        </div>
                    </div>
                    <TrendingUp v-if="stats.sessionCount > 0" class="w-6 h-6 text-blue-400" />
                </div>
                <div class="mini-chart">
                    <canvas ref="sessionsChart" class="w-full h-12"></canvas>
                </div>
            </div>

            <!-- CPU Usage -->
            <div class="cyber-card border-purple-500/50">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="glow-icon bg-purple-500/10">
                            <Cpu class="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-mono">CPU USAGE</p>
                            <p class="text-2xl font-bold text-purple-400 font-mono">{{
                                formatPercent(stats.system?.cpu?.usage) }}</p>
                        </div>
                    </div>
                </div>
                <div class="mini-chart">
                    <canvas ref="cpuChart" class="w-full h-12"></canvas>
                </div>
            </div>

            <!-- Memory Usage -->
            <div class="cyber-card border-orange-500/50">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="glow-icon bg-orange-500/10">
                            <Database class="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-mono">MEMORY</p>
                            <p class="text-2xl font-bold text-orange-400 font-mono">{{
                                formatPercent(stats.system?.memory?.usagePercent) }}</p>
                        </div>
                    </div>
                </div>
                <div class="mini-chart">
                    <canvas ref="memChart" class="w-full h-12"></canvas>
                </div>
            </div>
        </div>

        <!-- Alert Thresholds -->
        <div v-if="alerts.length > 0" class="relative z-10 mb-6">
            <div class="cyber-card border-yellow-500/50 bg-yellow-500/5">
                <div class="flex items-center gap-3 mb-3">
                    <AlertCircle class="w-5 h-5 text-yellow-400 animate-pulse" />
                    <h3 class="font-mono text-yellow-400">ALERTS</h3>
                </div>
                <div class="space-y-2">
                    <div v-for="alert in alerts" :key="alert.id"
                        class="flex items-center justify-between p-2 rounded bg-black/30 border-l-2 border-yellow-500">
                        <span class="text-sm font-mono text-gray-300">{{ alert.message }}</span>
                        <span class="text-xs font-mono text-gray-500">{{ alert.value }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Active Sessions & Network -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Active Sessions -->
                <div class="cyber-card border-emerald-500/50">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <Terminal class="w-5 h-5 text-emerald-400" />
                            <h2 class="font-mono text-lg text-emerald-400">Active Sessions</h2>
                        </div>
                        <div class="glass-panel px-3 py-1">
                            <Activity class="w-4 h-4 text-emerald-400 animate-pulse inline mr-2" />
                            <span class="font-mono text-sm text-emerald-400">LIVE</span>
                        </div>
                    </div>

                    <div v-if="!stats.sessions || stats.sessions.length === 0" class="text-center py-16">
                        <div class="relative w-16 h-16 mx-auto mb-4">
                            <Wifi class="w-16 h-16 text-gray-700" />
                            <div class="absolute inset-0 bg-emerald-400/20 blur-xl"></div>
                        </div>
                        <p class="text-gray-500 font-mono">No active sessions</p>
                    </div>

                    <div v-else class="space-y-3">
                        <div v-for="session in stats.sessions" :key="session.id" class="session-card">
                            <div class="flex items-start justify-between">
                                <div class="flex items-start gap-3 flex-1">
                                    <div class="status-pulse bg-emerald-400 mt-2"></div>

                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-2 mb-1">
                                            <User class="w-4 h-4 text-emerald-400" />
                                            <span class="font-mono text-sm text-gray-200">{{ session.user }}</span>
                                        </div>

                                        <div class="flex items-center gap-3 text-xs font-mono text-gray-500 mb-2">
                                            <div class="flex items-center gap-1">
                                                <Server class="w-3 h-3" />
                                                <span>{{ session.serverId }}</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <Clock class="w-3 h-3" />
                                                <span>{{ formatDuration(session.duration) }}</span>
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <span
                                                class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-mono">
                                                CONNECTED
                                            </span>
                                            <span class="text-xs text-gray-600 font-mono">
                                                {{ formatTimestamp(session.connectedAt) }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="text-xs font-mono text-gray-600 bg-black/30 px-2 py-1 rounded">
                                    {{ session.id.split('_')[1] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network & Performance -->
                <div class="cyber-card border-cyan-500/50">
                    <div class="flex items-center gap-2 mb-6">
                        <Wifi class="w-5 h-5 text-cyan-400" />
                        <h2 class="font-mono text-lg text-cyan-400">Connection Metrics</h2>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="glass-panel p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-mono text-gray-500">AVG LATENCY</span>
                                <Zap class="w-4 h-4 text-yellow-400" />
                            </div>
                            <p class="text-2xl font-bold font-mono text-yellow-400">
                                {{ averageLatency !== null ? Math.round(averageLatency) + 'ms' : 'N/A' }}
                            </p>
                            <canvas ref="latencyChart" class="w-full h-12 mt-2"></canvas>
                        </div>

                        <div class="glass-panel p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-mono text-gray-500">TOTAL CONNECTIONS</span>
                                <TrendingUp class="w-4 h-4 text-cyan-400" />
                            </div>
                            <p class="text-2xl font-bold font-mono text-cyan-400">{{ totalConnections }}</p>
                            <p class="text-xs font-mono text-gray-500 mt-1">Peak concurrent: {{ peakSessions }}</p>
                        </div>

                        <div class="glass-panel p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-mono text-gray-500">ERROR RATE</span>
                                <AlertTriangle class="w-4 h-4"
                                    :class="errorRate > 5 ? 'text-red-400' : 'text-gray-600'" />
                            </div>
                            <p class="text-2xl font-bold font-mono"
                                :class="errorRate > 5 ? 'text-red-400' : 'text-emerald-400'">{{ errorRate.toFixed(1) }}%
                            </p>
                            <p class="text-xs font-mono text-gray-500 mt-1">
                                {{stats.connectionLog?.filter(log => log.type === 'error').length || 0}} errors
                            </p>
                        </div>

                        <div class="glass-panel p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-mono text-gray-500">ACTIVE SESSIONS</span>
                                <Activity class="w-4 h-4 text-purple-400" />
                            </div>
                            <div class="space-y-1">
                                <div v-for="session in stats.sessions?.slice(0, 2)" :key="session.id"
                                    class="flex items-center justify-between">
                                    <span class="text-xs font-mono text-gray-400 truncate max-w-[100px]">{{
                                        session.user.split('@')[0] }}</span>
                                    <span class="text-xs font-mono" :class="getLatencyColor(session.avgLatency)">
                                        {{ session.avgLatency ? Math.round(session.avgLatency) + 'ms' : '-' }}
                                    </span>
                                </div>
                                <div v-if="!stats.sessions || stats.sessions.length === 0"
                                    class="text-center text-xs font-mono text-gray-600 py-1">
                                    No active sessions
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Resources -->
            <div class="space-y-6">
                <div class="cyber-card border-purple-500/50">
                    <div class="flex items-center gap-2 mb-6">
                        <Gauge class="w-5 h-5 text-purple-400" />
                        <h2 class="font-mono text-lg text-purple-400">System Resources</h2>
                    </div>

                    <div class="space-y-6">
                        <!-- CPU Cores -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono text-gray-500">CPU CORES</span>
                                <span class="text-xs font-mono text-purple-400">{{ stats.system?.cpu?.count }}
                                    cores</span>
                            </div>
                            <div class="space-y-2">
                                <div v-for="(usage, idx) in (stats.system?.cpu?.cores || [])" :key="idx"
                                    class="flex items-center gap-2">
                                    <span class="text-xs font-mono text-gray-600 w-12">Core {{ idx }}</span>
                                    <div class="flex-1 bg-black/30 rounded-full h-2 overflow-hidden relative">
                                        <div class="h-full neon-bar-purple transition-all duration-500"
                                            :style="{ width: formatPercent(usage) }"></div>
                                    </div>
                                    <span class="text-xs font-mono text-gray-500 w-12 text-right">{{
                                        formatPercent(usage) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Load Average -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono text-gray-500">LOAD AVERAGE</span>
                            </div>
                            <div class="grid grid-cols-3 gap-2">
                                <div class="glass-panel p-3 text-center border"
                                    :class="getLoadClass(stats.system?.loadAverage?.[0], stats.system?.cpu?.count)">
                                    <p class="text-xs font-mono text-gray-500 mb-1">1m</p>
                                    <p class="text-lg font-bold font-mono text-blue-400">{{
                                        (stats.system?.loadAverage?.[0] || 0).toFixed(2) }}</p>
                                </div>
                                <div class="glass-panel p-3 text-center border"
                                    :class="getLoadClass(stats.system?.loadAverage?.[1], stats.system?.cpu?.count)">
                                    <p class="text-xs font-mono text-gray-500 mb-1">5m</p>
                                    <p class="text-lg font-bold font-mono text-purple-400">{{
                                        (stats.system?.loadAverage?.[1] || 0).toFixed(2) }}</p>
                                </div>
                                <div class="glass-panel p-3 text-center border"
                                    :class="getLoadClass(stats.system?.loadAverage?.[2], stats.system?.cpu?.count)">
                                    <p class="text-xs font-mono text-gray-500 mb-1">15m</p>
                                    <p class="text-lg font-bold font-mono text-orange-400">{{
                                        (stats.system?.loadAverage?.[2] || 0).toFixed(2) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Memory Breakdown -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono text-gray-500">MEMORY BREAKDOWN</span>
                            </div>
                            <div class="space-y-2">
                                <div class="glass-panel p-2 flex items-center justify-between">
                                    <span class="text-xs font-mono text-gray-400">Total</span>
                                    <span class="text-xs font-mono text-gray-200">{{
                                        formatBytes(stats.system?.memory?.total) }}</span>
                                </div>
                                <div
                                    class="glass-panel p-2 flex items-center justify-between border border-orange-500/30 bg-orange-500/5">
                                    <span class="text-xs font-mono text-orange-400">Used</span>
                                    <span class="text-xs font-mono text-orange-400">{{
                                        formatBytes(stats.system?.memory?.used) }}</span>
                                </div>
                                <div
                                    class="glass-panel p-2 flex items-center justify-between border border-emerald-500/30 bg-emerald-500/5">
                                    <span class="text-xs font-mono text-emerald-400">Free</span>
                                    <span class="text-xs font-mono text-emerald-400">{{
                                        formatBytes(stats.system?.memory?.free) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Platform Info -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-xs font-mono text-gray-500">PLATFORM</span>
                            </div>
                            <div class="space-y-2">
                                <div class="glass-panel p-2 flex items-center justify-between">
                                    <span class="text-xs font-mono text-gray-400">OS</span>
                                    <span class="text-xs font-mono text-gray-200">{{ stats.system?.platform }} {{
                                        stats.system?.arch }}</span>
                                </div>
                                <div class="glass-panel p-2 flex items-center justify-between">
                                    <span class="text-xs font-mono text-gray-400">Hostname</span>
                                    <span class="text-xs font-mono text-gray-200">{{ stats.system?.hostname }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Connection Logs -->
        <div class="relative z-10 cyber-card border-blue-500/50 mt-6">
            <div class="flex items-center gap-2 mb-6">
                <FileText class="w-5 h-5 text-blue-400" />
                <h2 class="font-mono text-lg text-blue-400">Connection Logs</h2>
                <span class="text-xs font-mono text-gray-500 ml-auto">Latest {{ Math.min(50, stats.connectionLog?.length
                    || 0) }} entries</span>
            </div>

            <div class="max-h-96 overflow-y-auto space-y-1 scrollbar-custom">
                <div v-for="(log, idx) in stats.connectionLog" :key="idx" class="log-entry"
                    :class="getLogClass(log.type)">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3 flex-1 min-w-0">
                            <span class="px-2 py-0.5 rounded text-xs font-mono font-bold"
                                :class="getLogBadgeClass(log.type)">
                                {{ log.type.toUpperCase() }}
                            </span>

                            <span class="text-xs font-mono text-gray-400 truncate">
                                {{ log.user || log.email || 'unknown' }}
                            </span>

                            <span v-if="log.serverId" class="text-xs font-mono text-gray-600">
                                → {{ log.serverId }}
                            </span>
                        </div>

                        <span class="text-xs font-mono text-gray-600 flex-shrink-0">
                            {{ formatTimestamp(log.timestamp) }}
                        </span>
                    </div>
                </div>

                <div v-if="!stats.connectionLog || stats.connectionLog.length === 0" class="text-center py-8">
                    <FileText class="w-12 h-12 text-gray-700 mx-auto mb-2" />
                    <p class="text-gray-500 font-mono text-sm">No logs available</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import {
    Activity, Server, Users, Cpu, Database, Terminal,
    Clock, RefreshCw, TrendingUp, Gauge, FileText,
    User, Wifi, Zap, AlertTriangle, AlertCircle
} from 'lucide-vue-next'

// State
const stats = ref({})
const autoRefresh = ref(true)
const isRefreshing = ref(false)
const lastUpdate = ref('Never')
const connectionError = ref(null)
const refreshInterval = 3000
let intervalId = null

// Historical data for charts
const cpuHistory = ref(Array(30).fill(0))
const memHistory = ref(Array(30).fill(0))
const sessionHistory = ref(Array(30).fill(0))
const latencyHistory = ref(Array(30).fill(null))

// Metrics
const averageLatency = ref(null)
const totalConnections = ref(0)
const errorRate = ref(0)

// Chart refs
const cpuChart = ref(null)
const memChart = ref(null)
const sessionsChart = ref(null)
const latencyChart = ref(null)

// Computed
const peakSessions = computed(() => {
    if (!stats.value.connectionLog) return 0
    let current = 0
    let peak = 0
    stats.value.connectionLog.forEach(log => {
        if (log.type === 'connect') current++
        if (log.type === 'disconnect') current--
        peak = Math.max(peak, current)
    })
    return peak
})

const alerts = computed(() => {
    const alertList = []

    if (stats.value.system?.cpu?.usage > 80) {
        alertList.push({
            id: 'cpu',
            message: 'High CPU usage detected',
            value: formatPercent(stats.value.system.cpu.usage)
        })
    }

    if (stats.value.system?.memory?.usagePercent > 85) {
        alertList.push({
            id: 'memory',
            message: 'High memory usage detected',
            value: formatPercent(stats.value.system.memory.usagePercent)
        })
    }

    const load1m = stats.value.system?.loadAverage?.[0] || 0
    const cpuCount = stats.value.system?.cpu?.count || 1
    if (load1m > cpuCount * 0.8) {
        alertList.push({
            id: 'load',
            message: 'High system load detected',
            value: load1m.toFixed(2)
        })
    }

    return alertList
})

// Fetch stats
const fetchStats = async () => {
    if (isRefreshing.value) return

    isRefreshing.value = true
    connectionError.value = null

    try {
        const WS_URL = import.meta.env.VITE_SSH_WS_URL || 'wss://ssh.mxn.au'
        const API_URL = WS_URL.replace('wss://', 'https://')
        const apiUrl = API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/admin/stats`, {
            signal: AbortSignal.timeout(5000)
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        stats.value = data

        // Update history
        cpuHistory.value.shift()
        cpuHistory.value.push(data.system?.cpu?.usage || 0)

        memHistory.value.shift()
        memHistory.value.push(data.system?.memory?.usagePercent || 0)

        sessionHistory.value.shift()
        sessionHistory.value.push(data.sessionCount || 0)

        // Update latency history
        latencyHistory.value.shift()
        latencyHistory.value.push(data.avgLatency || null)

        // Update average latency
        averageLatency.value = data.avgLatency

        // Update metrics
        totalConnections.value = data.connectionLog?.length || 0

        const errors = data.connectionLog?.filter(log => log.type === 'error').length || 0
        errorRate.value = totalConnections.value > 0 ? (errors / totalConnections.value) * 100 : 0

        const now = new Date()
        lastUpdate.value = now.toLocaleTimeString()

        // Update charts
        await nextTick()
        drawCharts()

    } catch (error) {
        console.error('Error fetching stats:', error)
        connectionError.value = error.message || 'Failed to connect to server'
    } finally {
        setTimeout(() => {
            isRefreshing.value = false
        }, 500)
    }
}

// Draw charts
const drawCharts = () => {
    drawMiniChart(cpuChart.value, cpuHistory.value, '#a855f7', '#9333ea')
    drawMiniChart(memChart.value, memHistory.value, '#fb923c', '#f97316')
    drawMiniChart(sessionsChart.value, sessionHistory.value, '#60a5fa', '#3b82f6')
    drawMiniChart(latencyChart.value, latencyHistory.value, '#facc15', '#eab308')
}

const drawMiniChart = (canvas, data, color1, color2) => {
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
    const height = canvas.height = canvas.offsetHeight * window.devicePixelRatio

    ctx.clearRect(0, 0, width, height)

    // Filter out null values for max calculation
    const validData = data.filter(v => v !== null)
    if (validData.length === 0) return

    const max = Math.max(...validData, 1)
    const step = width / (data.length - 1)

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color1
    ctx.lineWidth = 2 * window.devicePixelRatio

    let firstPoint = true
    data.forEach((value, i) => {
        if (value === null) return

        const x = i * step
        const y = height - (value / max) * height

        if (firstPoint) {
            ctx.moveTo(x, y)
            firstPoint = false
        } else {
            ctx.lineTo(x, y)
        }
    })

    ctx.stroke()

    // Draw gradient fill
    const lastValidIndex = data.length - 1
    ctx.lineTo(lastValidIndex * step, height)
    ctx.lineTo(0, height)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color1 + '40')
    gradient.addColorStop(1, color2 + '00')

    ctx.fillStyle = gradient
    ctx.fill()
}

// Helper functions
const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const formatPercent = (value) => {
    if (!value) return '0%'
    return `${value.toFixed(1)}%`
}

const formatUptime = (seconds) => {
    if (!seconds) return '0s'
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
}

const formatDuration = (ms) => {
    if (!ms) return '0s'
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const hours = Math.floor(mins / 60)

    if (hours > 0) return `${hours}h ${mins % 60}m`
    if (mins > 0) return `${mins}m ${seconds % 60}s`
    return `${seconds}s`
}

const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
}

const getLoadClass = (load, cpuCount) => {
    if (!load || !cpuCount) return 'border-gray-700'
    const percentage = (load / cpuCount) * 100
    if (percentage > 80) return 'border-red-500/50 bg-red-500/10'
    if (percentage > 60) return 'border-yellow-500/50 bg-yellow-500/10'
    return 'border-emerald-500/50 bg-emerald-500/10'
}

const getLogClass = (type) => {
    const classes = {
        'connect': 'border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10',
        'disconnect': 'border-l-red-500 bg-red-500/5 hover:bg-red-500/10',
        'error': 'border-l-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10',
        'auth': 'border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10'
    }
    return classes[type] || 'border-l-gray-700 bg-gray-800/50'
}

const getLogBadgeClass = (type) => {
    const classes = {
        'connect': 'bg-emerald-500/20 text-emerald-400',
        'disconnect': 'bg-red-500/20 text-red-400',
        'error': 'bg-yellow-500/20 text-yellow-400',
        'auth': 'bg-blue-500/20 text-blue-400'
    }
    return classes[type] || 'bg-gray-500/20 text-gray-400'
}

const getLatencyColor = (latency) => {
    if (!latency) return 'text-gray-600'
    if (latency < 50) return 'text-emerald-400'
    if (latency < 150) return 'text-yellow-400'
    return 'text-red-400'
}

// Lifecycle
onMounted(() => {
    fetchStats()

    intervalId = setInterval(() => {
        if (autoRefresh.value) {
            fetchStats()
        }
    }, refreshInterval)
})

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.cyber-card {
    @apply p-6 rounded-xl border-2 backdrop-blur-sm relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
    transition: all 0.3s ease;
}

.cyber-card:hover {
    @apply shadow-2xl;
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
}

.glass-panel {
    @apply rounded-lg backdrop-blur-sm border border-white/10;
    background: rgba(255, 255, 255, 0.03);
}

.glow-icon {
    @apply p-2 rounded-lg relative;
}

.glow-icon::before {
    content: '';
    @apply absolute inset-0 rounded-lg blur-xl opacity-50;
    background: inherit;
}

.status-pulse {
    @apply w-3 h-3 rounded-full animate-pulse;
    box-shadow: 0 0 20px currentColor;
}

.neon-button {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all;
    @apply bg-white/5 border-white/20 text-gray-400;
}

.neon-button:hover {
    @apply bg-emerald-500/10 border-emerald-500/50 text-emerald-400;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.neon-button-active {
    @apply bg-emerald-500/20 border-emerald-500/70 text-emerald-400;
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
}

.neon-bar-purple {
    background: linear-gradient(90deg, #a855f7 0%, #9333ea 100%);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

.session-card {
    @apply p-4 rounded-lg border-2 border-white/10;
    background: rgba(255, 255, 255, 0.02);
    transition: all 0.2s ease;
}

.session-card:hover {
    @apply border-emerald-500/50;
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.log-entry {
    @apply p-3 rounded border-l-4 transition-all duration-200;
}

.mini-chart {
    @apply relative w-full h-12 overflow-hidden;
}

.scrollbar-custom::-webkit-scrollbar {
    width: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
    background: rgba(16, 185, 129, 0.3);
    border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
    background: rgba(16, 185, 129, 0.5);
}
</style>