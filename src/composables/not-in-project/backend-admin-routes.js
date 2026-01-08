// backend-admin-routes.js
const express = require('express')
const os = require('os')
const router = express.Router()

// Store for tracking connections
const connectionLog = []
const MAX_LOG_ENTRIES = 100

// Track previous CPU times for accurate usage calculation
let previousCpuTimes = null

// Helper to calculate CPU usage accurately
function calculateCpuUsage() {
    const cpus = os.cpus()

    if (!previousCpuTimes) {
        previousCpuTimes = cpus.map(cpu => ({ ...cpu.times }))
        return cpus.map(() => 0)
    }

    const cpuUsage = cpus.map((cpu, idx) => {
        const prev = previousCpuTimes[idx]

        const totalDiff = Object.values(cpu.times).reduce((a, b) => a + b) -
            Object.values(prev).reduce((a, b) => a + b)
        const idleDiff = cpu.times.idle - prev.idle

        const usage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0

        return Math.max(0, Math.min(100, usage))
    })

    previousCpuTimes = cpus.map(cpu => ({ ...cpu.times }))

    return cpuUsage
}

// Helper to get system stats
function getSystemStats() {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const usedMem = totalMem - freeMem

    const cpus = os.cpus()
    const cpuUsage = calculateCpuUsage()
    const avgCpuUsage = cpuUsage.reduce((a, b) => a + b) / cpuUsage.length

    return {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        uptime: os.uptime(),
        memory: {
            total: totalMem,
            used: usedMem,
            free: freeMem,
            usagePercent: (usedMem / totalMem) * 100
        },
        cpu: {
            count: cpus.length,
            model: cpus[0].model,
            usage: avgCpuUsage,
            cores: cpuUsage
        },
        loadAverage: os.loadavg(),
        networkInterfaces: Object.keys(os.networkInterfaces()).length
    }
}

// Admin stats endpoint
router.get('/stats', (req, res) => {
    try {
        const sessions = Array.from(global.adminSessions || new Map()).map(([id, data]) => ({
            id,
            user: data.user || 'unknown',
            serverId: data.serverId || 'unknown',
            connectedAt: data.connectedAt,
            lastActivity: data.lastActivity,
            duration: Date.now() - data.connectedAt,
            messageCount: data.messageCount || 0
        }))

        res.json({
            system: getSystemStats(),
            sessions: sessions,
            sessionCount: sessions.length,
            connectionLog: connectionLog.slice(-50).reverse(),
            timestamp: new Date().toISOString(),
            health: {
                status: 'healthy',
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            }
        })
    } catch (error) {
        console.error('Error generating stats:', error)
        res.status(500).json({
            error: 'Failed to generate stats',
            message: error.message
        })
    }
})

// Connection log endpoint
router.get('/logs', (req, res) => {
    res.json({
        logs: connectionLog.slice(-100).reverse(),
        count: connectionLog.length
    })
})

// Health check endpoint
router.get('/health', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        activeSessions: (global.adminSessions || new Map()).size
    }

    res.json(health)
})

// Export function to log connections
function logConnection(type, data) {
    const entry = {
        type,
        timestamp: new Date().toISOString(),
        ...data
    }

    connectionLog.push(entry)

    // Keep only the last MAX_LOG_ENTRIES
    if (connectionLog.length > MAX_LOG_ENTRIES) {
        connectionLog.shift()
    }

    console.log(`[Admin Log] ${type.toUpperCase()}: ${data.email || data.user || 'unknown'}`)
}

// Export function to update session activity
function updateSessionActivity(sessionId) {
    if (!global.adminSessions) return

    const session = global.adminSessions.get(sessionId)
    if (session) {
        session.lastActivity = Date.now()
        session.messageCount = (session.messageCount || 0) + 1
    }
}

module.exports = {
    router,
    logConnection,
    updateSessionActivity
}