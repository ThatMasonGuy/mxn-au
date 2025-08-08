<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1
                    class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    Translation Stats Rebuild
                </h1>
                <p class="text-gray-300 text-lg">
                    Backup and rebuild all translation statistics from source documents
                </p>
            </div>

            <!-- Main Card -->
            <div class="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 p-8">

                <!-- Status Section -->
                <div v-if="!hasStarted" class="text-center py-12">
                    <div class="mb-8">
                        <svg class="w-24 h-24 mx-auto text-purple-400 animate-pulse" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-white mb-4">Ready to Rebuild Stats</h2>
                    <p class="text-gray-400 mb-8 max-w-md mx-auto">
                        This process will backup your current statistics and rebuild them from ~5,100 translation
                        documents.
                        Expected duration: 3-5 minutes.
                    </p>
                    <button @click="startRebuild" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl
                     transform transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25
                     active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                        <span class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Start Rebuild Process
                        </span>
                    </button>
                </div>

                <!-- Processing Section -->
                <div v-else-if="isProcessing" class="py-8">
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-purple-300">Processing...</span>
                            <span class="text-sm font-medium text-purple-300">{{ elapsedTime }}s</span>
                        </div>
                        <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div class="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full animate-pulse transition-all duration-1000"
                                :style="`width: ${progressPercentage}%`"></div>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(phase, index) in phases" :key="index"
                            class="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
                            :class="getPhaseClass(index)">
                            <div class="flex-shrink-0">
                                <svg v-if="index < currentPhase" class="w-6 h-6 text-green-400" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <svg v-else-if="index === currentPhase" class="w-6 h-6 text-purple-400 animate-spin"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <svg v-else class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium" :class="index <= currentPhase ? 'text-white' : 'text-gray-500'">
                                    {{ phase.name }}
                                </p>
                                <p class="text-sm" :class="index <= currentPhase ? 'text-gray-400' : 'text-gray-600'">
                                    {{ phase.description }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-if="currentStatus" class="mt-6 p-4 bg-gray-900/50 rounded-xl">
                        <p class="text-sm text-gray-400 font-mono">{{ currentStatus }}</p>
                    </div>
                </div>

                <!-- Success Section -->
                <div v-else-if="result" class="py-8">
                    <div class="text-center mb-8">
                        <div
                            class="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                            <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-semibold text-white mb-2">Rebuild Complete!</h3>
                        <p class="text-gray-400">Stats have been successfully rebuilt from source documents</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div class="bg-gray-900/50 rounded-xl p-4">
                            <p class="text-sm text-gray-400 mb-1">Duration</p>
                            <p class="text-2xl font-bold text-white">{{ result.duration }}</p>
                        </div>
                        <div class="bg-gray-900/50 rounded-xl p-4">
                            <p class="text-sm text-gray-400 mb-1">Total Processed</p>
                            <p class="text-2xl font-bold text-white">{{ result.stats.total_processed.toLocaleString() }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                            <span class="text-gray-400">Documents Backed Up</span>
                            <span class="font-semibold text-white">{{ result.stats.backed_up }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                            <span class="text-gray-400">Main Translations</span>
                            <span class="font-semibold text-white">{{ result.stats.main_translations.toLocaleString()
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                            <span class="text-gray-400">User Translations</span>
                            <span class="font-semibold text-white">{{ result.stats.user_translations.toLocaleString()
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                            <span class="text-gray-400">Discord Entries</span>
                            <span class="font-semibold text-white">{{ result.stats.discord_entries.toLocaleString()
                                }}</span>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <p class="text-sm text-blue-300 mb-1">Backup Location</p>
                        <p class="text-xs font-mono text-gray-300 break-all">{{ result.backupPath }}</p>
                    </div>

                    <div class="mt-8 text-center">
                        <button @click="reset" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl
                       transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50">
                            Run Another Rebuild
                        </button>
                    </div>
                </div>

                <!-- Error Section -->
                <div v-else-if="error" class="py-8">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
                            <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 class="text-2xl font-semibold text-white mb-2">Rebuild Failed</h3>
                        <p class="text-gray-400">An error occurred during the rebuild process</p>
                    </div>

                    <div class="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p class="text-sm text-red-300 mb-2 font-semibold">Error Details:</p>
                        <p class="text-sm text-gray-300 font-mono">{{ error.message || error }}</p>
                    </div>

                    <div v-if="error.backupPath" class="p-4 bg-gray-900/50 rounded-xl mb-6">
                        <p class="text-sm text-gray-400 mb-1">Backup was created at:</p>
                        <p class="text-xs font-mono text-gray-300 break-all">{{ error.backupPath }}</p>
                    </div>

                    <div class="text-center">
                        <button @click="reset" class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl
                       transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50">
                            Try Again
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8 text-gray-500 text-sm">
                <p>⚠️ This is a destructive operation. Ensure you have proper backups before proceeding.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

// Replace with your actual function URL
const FUNCTION_URL = 'https://rebuildtranslationstats-hrylnb6aja-ts.a.run.app'
const ADMIN_KEY = 'xK9m2P7qR4sT6vW8yA3bC5dE7fG9hJ2kL4mN6pQ8rS0tU2vW4xY6zA8bC0dE2fG4'

const hasStarted = ref(false)
const isProcessing = ref(false)
const result = ref(null)
const error = ref(null)
const currentPhase = ref(0)
const currentStatus = ref('')
const startTime = ref(null)
const elapsedTime = ref(0)
let timer = null

const phases = [
    { name: 'Phase 1: Backup', description: 'Backing up existing statistics' },
    { name: 'Phase 2: Clear', description: 'Clearing existing stats documents' },
    { name: 'Phase 3: Initialize', description: 'Setting up new stats structure' },
    { name: 'Phase 4: Main Translations', description: 'Processing ~2,800 translations' },
    { name: 'Phase 5: User Translations', description: 'Processing ~2,300 user translations' },
    { name: 'Phase 6: Discord Data', description: 'Processing Discord histories' },
    { name: 'Phase 7: Write Stats', description: 'Writing aggregated statistics' }
]

const progressPercentage = computed(() => {
    if (!isProcessing.value) return 0
    // Estimate based on phase (each phase roughly equal time)
    const baseProgress = (currentPhase.value / phases.length) * 100
    return Math.min(baseProgress + 10, 95) // Never show 100% until complete
})

const getPhaseClass = (index) => {
    if (index < currentPhase.value) return 'bg-green-900/20 border-l-4 border-green-500'
    if (index === currentPhase.value) return 'bg-purple-900/30 border-l-4 border-purple-500'
    return 'bg-gray-900/20 opacity-50'
}

const updateTimer = () => {
    if (startTime.value) {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
    }
}

const simulateProgress = () => {
    // Simulate phase progression based on expected timing
    const phaseTimings = [5, 3, 2, 45, 40, 25, 10] // seconds per phase (rough estimates)
    let totalTime = 0

    phaseTimings.forEach((duration, index) => {
        totalTime += duration
        setTimeout(() => {
            if (isProcessing.value) {
                currentPhase.value = index + 1
                currentStatus.value = `${phases[index].name}: Processing...`
            }
        }, totalTime * 1000)
    })
}

const startRebuild = async () => {
    hasStarted.value = true
    isProcessing.value = true
    error.value = null
    result.value = null
    currentPhase.value = 0
    startTime.value = Date.now()
    currentStatus.value = 'Initializing rebuild process...'

    // Start timer
    timer = setInterval(updateTimer, 1000)

    // Start progress simulation
    simulateProgress()

    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_KEY}`
            }
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        // Success
        currentPhase.value = phases.length
        setTimeout(() => {
            isProcessing.value = false
            result.value = data
        }, 1000)

    } catch (err) {
        console.error('Rebuild error:', err)
        isProcessing.value = false
        error.value = err
    } finally {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
    }
}

const reset = () => {
    hasStarted.value = false
    isProcessing.value = false
    result.value = null
    error.value = null
    currentPhase.value = 0
    currentStatus.value = ''
    elapsedTime.value = 0
    startTime.value = null
}

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})
</script>