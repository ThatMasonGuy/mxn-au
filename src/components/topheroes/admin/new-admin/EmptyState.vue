<!-- EmptyState.vue - Reusable empty state component -->
<template>
    <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
        <!-- Icon -->
        <div
            class="mb-6 p-4 rounded-full bg-gradient-to-br from-velaris-purple/10 to-velaris-teal/10">
            <component :is="icon" class="h-12 w-12 text-velaris-purple" />
        </div>

        <!-- Title -->
        <h3 class="text-lg font-semibold text-foreground mb-2">{{ title }}</h3>

        <!-- Description -->
        <p class="text-foreground/60 mb-6 max-w-md">{{ description }}</p>

        <!-- Action Button -->
        <button v-if="actionText" @click="$emit('action')" class="btn-solid-purple">
            <component v-if="actionIcon" :is="actionIcon" class="h-4 w-4" />
            {{ actionText }}
        </button>

        <!-- Secondary Action -->
        <button v-if="secondaryText" @click="$emit('secondary-action')" class="btn-soft-violet mt-3">
            {{ secondaryText }}
        </button>
    </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'

defineProps({
    icon: {
        type: [Object, Function],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    actionText: {
        type: String,
        default: null
    },
    actionIcon: {
        type: [Object, Function],
        default: Plus
    },
    secondaryText: {
        type: String,
        default: null
    }
})

defineEmits(['action', 'secondary-action'])
</script>