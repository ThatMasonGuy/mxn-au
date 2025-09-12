<template>
    <div class="bg-muted/30 rounded-lg p-4 mb-6 space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <!-- Server Filters -->
            <div class="flex-1">
                <h4 class="text-sm font-medium text-foreground mb-2">Filter by Server</h4>
                <div class="flex flex-wrap gap-2">
                    <button @click="$emit('toggleServer', 'all')" :class="[
                        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors border',
                        activeServerFilters.includes('all')
                            ? 'bg-velaris-purple text-white border-velaris-purple'
                            : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                    ]">
                        All Servers
                    </button>

                    <button v-for="server in servers" :key="server.server" @click="$emit('toggleServer', server.server)"
                        :class="[
                            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors border',
                            activeServerFilters.includes(server.server)
                                ? 'bg-velaris-teal text-white border-velaris-teal'
                                : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                        ]">
                        {{ server.serverName }} ({{ server.guildCount }})
                    </button>
                </div>
            </div>

            <!-- Clear All Filters Button -->
            <div class="lg:self-end">
                <button @click="$emit('clearAllFilters')"
                    class="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors">
                    <FilterX :size="16" class="inline mr-2" />
                    Clear All
                </button>
            </div>
        </div>

        <!-- Day Filters Row -->
        <div>
            <h4 class="text-sm font-medium text-foreground mb-2">Filter by Day(s)</h4>
            <div class="flex flex-wrap gap-2">
                <button v-for="dayOption in dayOptions" :key="dayOption.value"
                    @click="$emit('toggleDay', dayOption.value)" :disabled="dayOption.disabled" :class="[
                        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors border',
                        dayOption.disabled
                            ? 'bg-muted/50 text-muted-foreground/50 border-border/50 cursor-not-allowed'
                            : (dayOption.value === 'all' ?
                                (activeDayFilters.length === 0 ? 'bg-velaris-green text-white border-velaris-green' : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground') :
                                (activeDayFilters.includes(dayOption.value) ? 'bg-velaris-amber text-white border-velaris-amber' : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground')
                            )
                    ]">
                    {{ dayOption.label }}
                    <span v-if="dayOption.disabled" class="ml-1 text-xs">(No Data)</span>
                </button>
            </div>
            <p v-if="activeDayFilters.length > 0" class="text-xs text-muted-foreground mt-2">
                Showing scores for {{ activeDayFilters.length }} selected day(s). Rankings are recalculated based on
                filtered days.
            </p>
        </div>

        <!-- Score Filter Row -->
        <div>
            <h4 class="text-sm font-medium text-foreground mb-2">Filter by Score</h4>
            <div class="flex flex-wrap items-center gap-3">
                <select :value="scoreFilter.operator" @input="updateScoreOperator($event.target.value)"
                    class="px-3 py-1.5 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50">
                    <option value="">No Filter</option>
                    <option value="gte">Greater than or equal to</option>
                    <option value="lte">Less than or equal to</option>
                    <option value="eq">Equal to</option>
                </select>

                <input v-if="scoreFilter.operator" type="number" :value="scoreFilter.value || ''"
                    @input="updateScoreValue($event.target.value)" placeholder="Enter score..."
                    class="px-3 py-1.5 rounded-md border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 w-40" />

                <span v-if="scoreFilter.operator && scoreFilter.value" class="text-xs text-muted-foreground">
                    Filtering {{ getFilterDescription() }}
                </span>
            </div>
        </div>

        <!-- Active Filters Summary -->
        <div v-if="hasActiveFilters" class="border-t border-border pt-3 mt-3">
            <div class="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span class="font-medium">Active filters:</span>

                <span v-if="!activeServerFilters.includes('all')"
                    class="px-2 py-1 bg-velaris-teal/10 text-velaris-teal rounded">
                    Servers: {{ activeServerFilters.length }}
                </span>

                <span v-if="activeDayFilters.length > 0"
                    class="px-2 py-1 bg-velaris-amber/10 text-velaris-amber rounded">
                    Days: {{ activeDayFilters.join(', ') }}
                </span>

                <span v-if="scoreFilter.operator && scoreFilter.value"
                    class="px-2 py-1 bg-velaris-green/10 text-velaris-green rounded">
                    Score: {{ getFilterDescription() }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { FilterX } from 'lucide-vue-next'

const props = defineProps({
    activeServerFilters: { type: Array, required: true },
    activeDayFilters: { type: Array, required: true },
    scoreFilter: { type: Object, required: true },
    servers: { type: Array, required: true },
    allDays: { type: Array, required: true },
    dayHasData: { type: Object, required: true },
    dayOptions: { type: Array, required: true }
})

const emit = defineEmits([
    'toggleServer',
    'toggleDay',
    'updateScoreFilter',
    'clearAllFilters'
])

const hasActiveFilters = computed(() => {
    return !props.activeServerFilters.includes('all') ||
        props.activeDayFilters.length > 0 ||
        (props.scoreFilter.operator && props.scoreFilter.value)
})

const updateScoreOperator = (operator) => {
    emit('updateScoreFilter', {
        ...props.scoreFilter,
        operator,
        value: operator ? props.scoreFilter.value : null
    })
}

const updateScoreValue = (value) => {
    emit('updateScoreFilter', {
        ...props.scoreFilter,
        value: value ? parseFloat(value) : null
    })
}

const getFilterDescription = () => {
    const { operator, value } = props.scoreFilter
    if (!operator || !value) return ''

    const formattedValue = value.toLocaleString()
    switch (operator) {
        case 'gte': return `≥ ${formattedValue}`
        case 'lte': return `≤ ${formattedValue}`
        case 'eq': return `= ${formattedValue}`
        default: return ''
    }
}
</script>