<template>
    <div class="flex flex-wrap gap-2">
        <div v-for="(guild, index) in kvkStore.selectedComparisonGuilds" :key="guild.shortCode"
            class="flex items-center gap-2 px-3 py-2 rounded-full border transition-all hover:shadow-sm" :class="[
                'bg-card border-border',
                `hover:border-[${kvkStore.guildColorMap[guild.shortCode]}]`
            ]" :style="{ borderColor: kvkStore.guildColorMap[guild.shortCode] }">

            <!-- Guild Color Indicator -->
            <div class="w-3 h-3 rounded-full border border-white/20"
                :style="{ backgroundColor: kvkStore.guildColorMap[guild.shortCode] }">
            </div>

            <!-- Guild Info -->
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-foreground">{{ guild.shortCode }}</span>
                <span class="text-xs text-muted-foreground">{{ guild.fullName }}</span>
            </div>

            <!-- Server Badge -->
            <span class="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                {{ kvkStore.eventMeta.serverNames[guild.server] || guild.server }}
            </span>

            <!-- Remove Button -->
            <button @click="removeGuild(guild)" class="ml-1 p-1 rounded-full hover:bg-muted transition-colors"
                :title="`Remove ${guild.shortCode}`">
                <X :size="14" class="text-muted-foreground hover:text-foreground" />
            </button>
        </div>

        <!-- Clear All Button -->
        <button v-if="kvkStore.selectedComparisonGuilds.length > 1" @click="clearAll"
            class="px-3 py-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-full hover:bg-muted transition-all">
            Clear All
        </button>
    </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import { useKvKEventDataStore } from '@/stores/useKvKEventDataStore'

const kvkStore = useKvKEventDataStore()

const removeGuild = (guild) => {
    kvkStore.toggleGuildForComparison(guild)
}

const clearAll = () => {
    kvkStore.selectedComparisonGuilds = []
}
</script>