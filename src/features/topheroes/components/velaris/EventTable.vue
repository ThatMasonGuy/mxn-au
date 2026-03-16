<template>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-border/60">
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Event
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Type
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Guild
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Participants
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Status
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Date Range
                    </th>
                    <th scope="col"
                        class="px-6 py-4 text-right text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-border/60">
                <tr v-for="event in events" :key="event.id"
                    class="hover:bg-foreground/5 transition-colors duration-200 group cursor-pointer"
                    @click="$emit('edit', event)">

                    <!-- Event Info -->
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                                :class="getEventTypeGradient(event.type)">
                                <component :is="getEventIcon(event.type)" class="h-4 w-4" />
                            </div>
                            <div class="min-w-0">
                                <div class="font-medium text-foreground truncate">
                                    {{ getEventDisplayName(event) }}
                                </div>
                                <div class="text-xs text-foreground/60 truncate">
                                    {{ event.eventId }}
                                </div>
                            </div>
                        </div>
                    </td>

                    <!-- Type -->
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getTypeBadgeColor(event.type)">
                            {{ event.type || 'N/A' }}
                        </span>
                    </td>

                    <!-- Guild -->
                    <td class="px-6 py-4">
                        <div class="font-medium text-foreground">
                            {{ event.guild || event.guildShort || 'N/A' }}
                        </div>
                    </td>

                    <!-- Participants -->
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0">
                                <span class="font-medium text-foreground">
                                    {{ event.memberIds?.length || 0 }}/95
                                </span>
                            </div>
                            <div class="flex-1 max-w-24">
                                <div class="w-full bg-border/60 rounded-full h-1.5">
                                    <div class="bg-gradient-to-r from-velaris-purple to-velaris-teal h-1.5 rounded-full transition-all duration-300"
                                        :style="{ width: `${Math.min(((event.memberIds?.length || 0) / 95) * 100, 100)}%` }">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getStatusColor(event.status)">
                            <div class="w-1.5 h-1.5 rounded-full" :class="getStatusDotColor(event.status)"></div>
                            {{ event.status || 'unknown' }}
                        </span>
                    </td>

                    <!-- Date Range -->
                    <td class="px-6 py-4">
                        <div class="text-sm">
                            <div class="font-medium text-foreground">
                                {{ formatDate(event.startDate) }}
                            </div>
                            <div class="text-xs text-foreground/60">
                                to {{ formatDate(event.endDate) }}
                            </div>
                        </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button @click.stop="$emit('edit', event)"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-velaris-purple hover:text-velaris-purple/80 hover:bg-velaris-purple/10 rounded-md transition-colors">
                                <Edit class="w-3 h-3" />
                                Edit
                            </button>
                            <button @click.stop="$emit('delete', event)"
                                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                                <Trash2 class="w-3 h-3" />
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { Sword, Shield, Trophy, Target, Edit, Trash2 } from 'lucide-vue-next'

const props = defineProps({
    events: Array
})

const formatDate = (date) => {
    if (!date) return 'N/A'
    const dateObj = typeof date?.toDate === 'function' ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-AU', {
        year: '2-digit',
        month: 'short',
        day: 'numeric'
    })
}

const getEventDisplayName = (event) => {
    if (event.event) return event.event
    if (event.name) return event.name
    return event.eventId || 'Unnamed Event'
}

const getEventTypeGradient = (type) => {
    const gradients = {
        'KvK': 'bg-gradient-to-br from-velaris-purple to-velaris-teal',
        'GvG': 'bg-gradient-to-br from-velaris-teal to-velaris-green',
        'GR': 'bg-gradient-to-br from-velaris-amber to-velaris-purple'
    }
    return gradients[type] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getEventIcon = (type) => {
    const icons = {
        'KvK': Shield,
        'GvG': Sword,
        'GR': Trophy
    }
    return icons[type] || Target
}

const getTypeBadgeColor = (type) => {
    const colors = {
        'KvK': 'bg-velaris-purple/15 text-velaris-purple border border-velaris-purple/20',
        'GvG': 'bg-velaris-teal/15 text-velaris-teal border border-velaris-teal/20',
        'GR': 'bg-velaris-amber/15 text-velaris-amber border border-velaris-amber/20'
    }
    return colors[type] || 'bg-foreground/10 text-foreground/70 border border-border/60'
}

const getStatusColor = (status) => {
    const colors = {
        'active': 'bg-velaris-green/15 text-velaris-green border border-velaris-green/20',
        'upcoming': 'bg-velaris-teal/15 text-velaris-teal border border-velaris-teal/20',
        'completed': 'bg-foreground/10 text-foreground/70 border border-border/60',
        'cancelled': 'bg-red-500/15 text-red-400 border border-red-500/20'
    }
    return colors[status] || 'bg-velaris-amber/15 text-velaris-amber border border-velaris-amber/20'
}

const getStatusDotColor = (status) => {
    const colors = {
        'active': 'bg-velaris-green',
        'upcoming': 'bg-velaris-teal',
        'completed': 'bg-foreground/50',
        'cancelled': 'bg-red-400'
    }
    return colors[status] || 'bg-velaris-amber'
}
</script>