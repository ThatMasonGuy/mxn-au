<!-- ReportStatusBanner.vue - Status banner for rankings reports -->
<template>
    <div v-if="shouldShowBanner && !dismissed" class="mb-6">
        <!-- Report Generation In Progress -->
        <div v-if="isGeneratingReport" class="bg-velaris-teal/10 border border-velaris-teal/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-velaris-teal/15 flex items-center justify-center">
                        <RefreshCw class="h-4 w-4 text-velaris-teal animate-spin" />
                    </div>
                    <div>
                        <h4 class="font-medium text-velaris-teal">Generating New Rankings Report</h4>
                        <p class="text-sm text-foreground/70 mt-1">
                            Processing member data and calculating rankings... This may take a few minutes.
                        </p>
                    </div>
                </div>
                <button @click="$emit('dismiss')" class="text-foreground/60 hover:text-foreground/80 transition">
                    <X class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Generation Error -->
        <div v-else-if="generateError" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-red-500/15 flex items-center justify-center">
                        <AlertTriangle class="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                        <h4 class="font-medium text-red-500">Report Generation Failed</h4>
                        <p class="text-sm text-foreground/70 mt-1">{{ generateError }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="$emit('retry')" class="text-sm text-velaris-purple hover:underline">
                        Try Again
                    </button>
                    <button @click="$emit('dismiss')" class="text-foreground/60 hover:text-foreground/80 transition">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Generation Complete -->
        <div v-else-if="showGenerationComplete"
            class="bg-velaris-green/10 border border-velaris-green/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-velaris-green/15 flex items-center justify-center">
                        <CheckCircle class="h-4 w-4 text-velaris-green" />
                    </div>
                    <div>
                        <h4 class="font-medium text-velaris-green">New Report Generated Successfully</h4>
                        <p class="text-sm text-foreground/70 mt-1">
                            Rankings have been updated with the latest member data.
                        </p>
                    </div>
                </div>
                <button @click="$emit('dismiss')" class="text-foreground/60 hover:text-foreground/80 transition">
                    <X class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Report is Stale -->
        <div v-else-if="isReportStale && !isCriticallyStale"
            class="bg-velaris-amber/10 border border-velaris-amber/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-velaris-amber/15 flex items-center justify-center">
                        <Clock class="h-4 w-4 text-velaris-amber" />
                    </div>
                    <div>
                        <h4 class="font-medium text-velaris-amber">Rankings Data is Stale</h4>
                        <p class="text-sm text-foreground/70 mt-1">
                            Report is {{ reportAgeText }} old. Consider refreshing for the latest data.
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="$emit('refresh')" class="btn-soft-violet text-sm">
                        <RefreshCw class="h-4 w-4" />
                        Refresh Now
                    </button>
                    <button @click="$emit('dismiss')" class="text-foreground/60 hover:text-foreground/80 transition">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Report is Critically Stale -->
        <div v-else-if="isCriticallyStale" class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-red-500/15 flex items-center justify-center">
                        <AlertTriangle class="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                        <h4 class="font-medium text-red-500">Rankings Data is Critically Outdated</h4>
                        <p class="text-sm text-foreground/70 mt-1">
                            Report is {{ reportAgeText }} old. A fresh report is strongly recommended.
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="$emit('refresh')" class="btn-soft-violet text-sm">
                        <Zap class="h-4 w-4" />
                        Generate Fresh Report
                    </button>
                    <button @click="$emit('dismiss')" class="text-foreground/60 hover:text-foreground/80 transition">
                        <X class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { RefreshCw, AlertTriangle, CheckCircle, Clock, X, Zap } from 'lucide-vue-next'

const props = defineProps({
    isGeneratingReport: {
        type: Boolean,
        default: false
    },
    isReportStale: {
        type: Boolean,
        default: false
    },
    isCriticallyStale: {
        type: Boolean,
        default: false
    },
    reportAgeText: {
        type: String,
        default: 'Unknown'
    },
    generateError: {
        type: String,
        default: null
    },
    showGenerationComplete: {
        type: Boolean,
        default: false
    },
    dismissed: {
        type: Boolean,
        default: false
    }
})

defineEmits(['refresh', 'retry', 'dismiss'])

// Determine if banner should show
const shouldShowBanner = computed(() => {
    return props.isGeneratingReport ||
        props.generateError ||
        props.showGenerationComplete ||
        props.isReportStale ||
        props.isCriticallyStale
})
</script>