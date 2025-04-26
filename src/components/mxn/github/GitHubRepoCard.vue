<template>
    <div
        class="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg hover:shadow-fuchsia-500/30 transition-all space-y-4 animate-fade-up overflow-hidden">

        <!-- Top Row: Title + Date Badge -->
        <div class="flex items-start justify-between space-x-4">
            <h3 class="text-lg font-semibold text-white truncate max-w-[70%]">
                <a :href="repo.html_url" target="_blank" rel="noopener noreferrer"
                    class="hover:underline hover:text-fuchsia-400 transition">
                    {{ repo.name }}
                </a>
            </h3>

            <!-- Date Badge -->
            <div :class="[
                'px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-all duration-500 whitespace-nowrap',
                badgeColor,
                { 'animate-pulse-glow': isRecent }
            ]">
                {{ formattedDate }}
            </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-white/70 line-clamp-3">
            {{ repo.description || 'No description provided.' }}
        </p>

        <!-- Bottom Stats -->
        <div class="flex items-center justify-between text-xs text-white/50 mt-4">
            <!-- Star Count -->
            <span :class="{ 'text-yellow-400 animate-star-glow': isTopStarred }">
                ⭐ {{ repo.stargazers_count }}
            </span>

            <!-- Fork Count -->
            <span>🍴 {{ repo.forks_count }}</span>

            <!-- Language Badge -->
            <span :class="[
                'px-2 py-1 rounded-full font-semibold text-xs',
                languageBackground,
                languageText
            ]">
                {{ repo.language || 'Other' }}
            </span>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    repo: Object,
    topStarCount: Number // New prop: passed from parent
})

const formattedDate = computed(() => {
    if (!props.repo.updated_at) return 'Unknown'
    const date = new Date(props.repo.updated_at)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
})

const badgeColor = computed(() => {
    if (!props.repo.updated_at) return 'bg-gray-500 text-white'

    const updatedDate = new Date(props.repo.updated_at)
    const now = new Date()
    const diffDays = (now - updatedDate) / (1000 * 60 * 60 * 24)

    if (diffDays <= 7) return 'bg-green-600 text-white'
    if (diffDays <= 30) return 'bg-yellow-400 text-black'
    return 'bg-red-600 text-white'
})

const isRecent = computed(() => {
    if (!props.repo.updated_at) return false
    const updatedDate = new Date(props.repo.updated_at)
    const now = new Date()
    const diffDays = (now - updatedDate) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
})

const isTopStarred = computed(() => {
    return props.repo.stargazers_count === props.topStarCount
})

// Language styling
const languageBackground = computed(() => {
    switch (props.repo.language) {
        case 'JavaScript':
            return 'bg-yellow-400'
        case 'Vue':
        case 'Vue.js':
            return 'bg-green-400'
        case 'TypeScript':
            return 'bg-blue-400'
        case 'HTML':
            return 'bg-orange-400'
        case 'CSS':
            return 'bg-blue-300'
        case 'Python':
            return 'bg-yellow-500'
        case 'Shell':
            return 'bg-gray-400'
        case 'Dockerfile':
            return 'bg-cyan-400'
        default:
            return 'bg-slate-600'
    }
})

const languageText = computed(() => {
    switch (props.repo.language) {
        case 'JavaScript':
        case 'HTML':
        case 'Python':
        case 'Dockerfile':
        case 'TypeScript':
            return 'text-black'
        default:
            return 'text-white'
    }
})
</script>

<style scoped>
/* Pulse glow for green date badge */
@keyframes pulseGlow {

    0%,
    100% {
        opacity: 1;
        box-shadow: 0 0 8px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.4);
    }

    50% {
        opacity: 0.9;
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6);
    }
}

.animate-pulse-glow {
    animation: pulseGlow 2s infinite;
}

/* Star glow for top-starred repos */
@keyframes starGlow {

    0%,
    100% {
        text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 10px rgba(255, 215, 0, 0.4);
    }

    50% {
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.6);
    }
}

.animate-star-glow {
    animation: starGlow 2.5s infinite;
}
</style>