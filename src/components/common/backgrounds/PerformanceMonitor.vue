<template>
    <div class="performance-monitor" :class="{ 'expanded': expanded }">
        <div class="monitor-header" @click="expanded = !expanded">
            <span class="monitor-title">⚡ Performance</span>
            <span class="fps-badge" :class="fpsClass">{{ Math.round(fps) }} FPS</span>
        </div>
        
        <div v-if="expanded" class="monitor-body">
            <!-- FPS Graph -->
            <div class="stat-section">
                <div class="stat-label">Frame Rate</div>
                <div class="fps-graph">
                    <div 
                        v-for="(frame, index) in fpsHistory" 
                        :key="index"
                        class="fps-bar"
                        :style="{ 
                            height: `${(frame / 60) * 100}%`,
                            backgroundColor: getFpsColor(frame)
                        }"
                    ></div>
                </div>
                <div class="stat-value">{{ Math.round(fps) }} / 60 FPS</div>
            </div>

            <!-- Frame Time -->
            <div class="stat-section">
                <div class="stat-label">Frame Time</div>
                <div class="stat-value">{{ frameTime.toFixed(2) }}ms</div>
                <div class="stat-bar">
                    <div 
                        class="stat-bar-fill" 
                        :style="{ 
                            width: `${Math.min((frameTime / 16.67) * 100, 100)}%`,
                            backgroundColor: frameTime > 16.67 ? '#ef4444' : '#10b981'
                        }"
                    ></div>
                </div>
                <div class="stat-note">Target: 16.67ms</div>
            </div>

            <!-- Memory (if available) -->
            <div v-if="memorySupported" class="stat-section">
                <div class="stat-label">Memory</div>
                <div class="stat-value">{{ (memoryUsed / 1048576).toFixed(1) }} MB</div>
                <div class="stat-bar">
                    <div 
                        class="stat-bar-fill" 
                        :style="{ 
                            width: `${(memoryUsed / memoryLimit) * 100}%`,
                            backgroundColor: '#3b82f6'
                        }"
                    ></div>
                </div>
                <div class="stat-note">Limit: {{ (memoryLimit / 1048576).toFixed(0) }} MB</div>
            </div>

            <!-- Paint Count -->
            <div class="stat-section">
                <div class="stat-label">Paints (last sec)</div>
                <div class="stat-value">{{ paintCount }}</div>
                <div class="stat-note" :class="paintCount > 30 ? 'text-red-400' : 'text-green-400'">
                    {{ paintCount > 30 ? 'High' : 'Low' }}
                </div>
            </div>

            <!-- Composite Count -->
            <div class="stat-section">
                <div class="stat-label">Composites (last sec)</div>
                <div class="stat-value">{{ compositeCount }}</div>
            </div>

            <!-- Stats Summary -->
            <div class="stat-section summary">
                <div class="summary-item">
                    <span class="summary-label">Avg FPS:</span>
                    <span class="summary-value">{{ avgFps }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Min FPS:</span>
                    <span class="summary-value">{{ minFps }}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Max FPS:</span>
                    <span class="summary-value">{{ maxFps }}</span>
                </div>
            </div>

            <!-- Reset Button -->
            <button @click="resetStats" class="reset-btn">
                Reset Stats
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const expanded = ref(true)
const fps = ref(60)
const frameTime = ref(0)
const fpsHistory = ref(Array(60).fill(60))
const paintCount = ref(0)
const compositeCount = ref(0)
const memoryUsed = ref(0)
const memoryLimit = ref(0)
const memorySupported = ref(false)

// Make these reactive so computed properties update
const fpsValues = ref([])
const minFpsValue = ref(60)
const maxFpsValue = ref(60)

// FPS tracking
let lastTime = performance.now()
let frames = 0
let paintCountLastSecond = 0
let compositeCountLastSecond = 0

const avgFps = computed(() => {
    if (fpsValues.value.length === 0) return 60
    const sum = fpsValues.value.reduce((a, b) => a + b, 0)
    return Math.round(sum / fpsValues.value.length)
})

const minFps = computed(() => Math.round(minFpsValue.value))
const maxFps = computed(() => Math.round(maxFpsValue.value))

const fpsClass = computed(() => {
    if (fps.value >= 55) return 'fps-good'
    if (fps.value >= 30) return 'fps-ok'
    return 'fps-bad'
})

const getFpsColor = (value) => {
    if (value >= 55) return '#10b981'
    if (value >= 30) return '#f59e0b'
    return '#ef4444'
}

const updateFPS = () => {
    const now = performance.now()
    const delta = now - lastTime
    
    frames++
    
    if (delta >= 1000) {
        const currentFps = Math.round((frames * 1000) / delta)
        fps.value = currentFps
        frameTime.value = delta / frames
        
        // Update history
        fpsHistory.value.shift()
        fpsHistory.value.push(currentFps)
        
        // Track stats - using .value for reactive refs
        fpsValues.value.push(currentFps)
        if (fpsValues.value.length > 100) fpsValues.value.shift()
        
        minFpsValue.value = Math.min(minFpsValue.value, currentFps)
        maxFpsValue.value = Math.max(maxFpsValue.value, currentFps)
        
        frames = 0
        lastTime = now
        
        // Update paint/composite counts
        paintCount.value = paintCountLastSecond
        compositeCount.value = compositeCountLastSecond
        paintCountLastSecond = 0
        compositeCountLastSecond = 0
    }
    
    requestAnimationFrame(updateFPS)
}

const updateMemory = () => {
    if (performance.memory) {
        memoryUsed.value = performance.memory.usedJSHeapSize
        memoryLimit.value = performance.memory.jsHeapSizeLimit
    }
}

const resetStats = () => {
    fpsValues.value = []
    minFpsValue.value = fps.value
    maxFpsValue.value = fps.value
    fpsHistory.value = Array(60).fill(60)
}

onMounted(() => {
    // Check memory support
    memorySupported.value = !!performance.memory
    
    // Start FPS tracking
    requestAnimationFrame(updateFPS)
    
    // Update memory every second
    if (memorySupported.value) {
        const memoryInterval = setInterval(updateMemory, 1000)
        onUnmounted(() => clearInterval(memoryInterval))
    }
    
    // Track paint/composite operations
    if (window.PerformanceObserver) {
        try {
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'paint') {
                        paintCountLastSecond++
                    }
                }
            })
            paintObserver.observe({ entryTypes: ['paint'] })
            
            onUnmounted(() => paintObserver.disconnect())
        } catch (e) {
            console.log('Paint observer not supported')
        }
        
        try {
            const measureObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('composite')) {
                        compositeCountLastSecond++
                    }
                }
            })
            measureObserver.observe({ entryTypes: ['measure'] })
            
            onUnmounted(() => measureObserver.disconnect())
        } catch (e) {
            console.log('Measure observer not supported')
        }
    }
})
</script>

<style scoped>
.performance-monitor {
    position: fixed;
    top: 0;
    left: 20px;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0 0 12px 12px;
    border-top: none;
    padding: 12px;
    color: white;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    z-index: 9999;
    min-width: 200px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.monitor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.monitor-title {
    font-weight: bold;
    font-size: 14px;
}

.fps-badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 13px;
}

.fps-good {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
}

.fps-ok {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
}

.fps-bad {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.monitor-body {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-section {
    margin-bottom: 16px;
}

.stat-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #3b82f6;
    margin-bottom: 4px;
}

.stat-note {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 4px;
}

.fps-graph {
    display: flex;
    gap: 1px;
    height: 40px;
    align-items: flex-end;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 4px;
    margin: 8px 0;
}

.fps-bar {
    flex: 1;
    min-width: 2px;
    border-radius: 2px;
    transition: height 0.3s ease;
}

.stat-bar {
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 4px;
}

.stat-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background-color 0.3s ease;
}

.summary {
    background: rgba(255, 255, 255, 0.05);
    padding: 8px;
    border-radius: 6px;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}

.summary-item:last-child {
    margin-bottom: 0;
}

.summary-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 11px;
}

.summary-value {
    color: white;
    font-weight: bold;
}

.reset-btn {
    width: 100%;
    padding: 8px;
    background: rgba(147, 51, 234, 0.2);
    border: 1px solid rgba(147, 51, 234, 0.4);
    color: #a855f7;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    transition: all 0.2s ease;
    margin-top: 8px;
}

.reset-btn:hover {
    background: rgba(147, 51, 234, 0.3);
    border-color: rgba(147, 51, 234, 0.6);
}

.text-red-400 {
    color: #ef4444;
}

.text-green-400 {
    color: #10b981;
}

/* Custom scrollbar */
.performance-monitor::-webkit-scrollbar {
    width: 6px;
}

.performance-monitor::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

.performance-monitor::-webkit-scrollbar-thumb {
    background: rgba(147, 51, 234, 0.5);
    border-radius: 3px;
}

.performance-monitor::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 51, 234, 0.7);
}
</style>