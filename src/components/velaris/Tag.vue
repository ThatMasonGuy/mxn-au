<template>
    <span
        class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-all duration-200"
        :class="tagClasses">

        <!-- Tag label -->
        <span>{{ tagInfo.label || tagId }}</span>

        <!-- Remove button (only show when removable) -->
        <button v-if="removable" @click.stop="$emit('remove', tagId)"
            class="ml-1 hover:bg-current/20 rounded-full p-0.5 transition-colors"
            :title="`Remove ${tagInfo.label} tag`">
            <X class="w-2.5 h-2.5" />
        </button>
    </span>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { MEMBER_TAGS } from '@/composables/topheroes/admin/useMembers'

const props = defineProps({
    tagId: {
        type: String,
        required: true
    },
    removable: {
        type: Boolean,
        default: false
    },
    size: {
        type: String,
        default: 'sm', // sm, xs
        validator: (value) => ['xs', 'sm'].includes(value)
    }
})

const emit = defineEmits(['remove'])

const tagInfo = computed(() => MEMBER_TAGS[props.tagId] || { label: props.tagId, color: 'gray' })

const tagClasses = computed(() => {
    const color = tagInfo.value.color
    const size = props.size

    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
        red: 'bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-400 dark:border-red-500/30',
        green: 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400 dark:border-green-500/30',
        yellow: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30',
        purple: 'bg-purple-500/10 text-purple-700 border-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
        teal: 'bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-400 dark:border-teal-500/30',
        orange: 'bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
        gray: 'bg-gray-500/10 text-gray-700 border-gray-500/20 dark:text-gray-400 dark:border-gray-500/30'
    }

    const sizeClasses = {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1'
    }

    return `${colorClasses[color] || colorClasses.gray} ${sizeClasses[size]}`
})
</script>

<style scoped>
/* Subtle hover effect */
span:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>