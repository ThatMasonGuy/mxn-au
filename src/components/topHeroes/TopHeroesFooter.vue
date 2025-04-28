<template>
    <footer
        class="absolute bottom-0 left-0 right-0 w-full z-50 text-sm text-white/80 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-md shadow-inner">
        <div class="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <!-- Left Icons -->
            <div class="flex items-center gap-4 text-white/70">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <a href="https://github.com/ThatMasonGuy" target="_blank" rel="noopener noreferrer"
                            class="hover:text-white transition">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M12 .5C5.65.5.5 5.8.5 12.29c0 5.22 3.44 9.65 8.2 11.21.6.12.82-.27.82-.6v-2.14c-3.34.74-4.04-1.61-4.04-1.61-.54-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.09 1.83 1.28 1.83 1.28 1.08 1.93 2.83 1.37 3.52 1.05.1-.82.42-1.37.77-1.69-2.67-.3-5.47-1.4-5.47-6.24 0-1.38.45-2.5 1.2-3.39-.12-.3-.52-1.53.12-3.18 0 0 1-.33 3.3 1.28a11.4 11.4 0 0 1 6 0c2.3-1.6 3.3-1.28 3.3-1.28.64 1.65.24 2.88.12 3.18.75.89 1.2 2 1.2 3.39 0 4.86-2.8 5.93-5.48 6.23.43.37.82 1.1.82 2.22v3.3c0 .33.22.72.83.6A11.79 11.79 0 0 0 23.5 12.3C23.5 5.8 18.35.5 12 .5Z" />
                            </svg>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>GitHub Profile</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger as-child>
                        <a href="https://discord.gg/th-vlr" target="_blank" rel="noopener noreferrer"
                            class="hover:text-indigo-400 transition">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.271 18.271 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.993a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.329c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.095 2.157 2.419 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Join the Discord</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <!-- Center Signature -->
            <p class="text-center text-sm sm:text-base font-medium text-white/70">
                Built with
                <span
                    class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 animate-gradient shimmer-glow">
                    caffeine
                </span>
                by
                <span
                    class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 animate-gradient shimmer-glow">
                    {{ author }}
                </span>
            </p>

            <!-- Right Icons -->
            <div class="flex items-center gap-4 text-white/70">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <button @click="navigateTo('/topheroes/admin')" class="hover:text-pink-400 transition">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Admin Panel</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger as-child>
                        <button @click="navigateTo('/topheroes/velaris')" class="hover:text-indigo-400 transition">
                            <!-- Custom VLR Icon -->
                            <svg class="w-8 h-6" viewBox="0 0 110 55" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.20 43.90L0 9.50L11.80 9.50L18.70 32.50L18.90 32.50L25.85 9.50L37.15 9.50L25 43.90L12.20 43.90ZM41.75 9.50L52.80 9.50L52.80 35.10L70.45 35.10L70.45 43.90L41.75 43.90L41.75 9.50ZM107.75 20.05Q107.75 23.20 106.05 25.75Q104.35 28.30 101.10 29.50L108.75 43.90L96.35 43.90L90.25 31.35L86.15 31.35L86.15 43.90L75.10 43.90L75.10 9.50L96.15 9.50Q99.85 9.50 102.48 10.92Q105.10 12.35 106.43 14.77Q107.75 17.20 107.75 20.05M96.50 20.50Q96.50 19.15 95.60 18.25Q94.70 17.35 93.40 17.35L86.15 17.35L86.15 23.70L93.40 23.70Q94.70 23.70 95.60 22.77Q96.50 21.85 96.50 20.50Z" />
                            </svg>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Velaris Hub</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </footer>
</template>

<script setup>
import router from '@/router'
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'

const props = defineProps({
    author: {
        type: String,
        default: '[VLR]Mason in s10154'
    }
})
const navigateTo = (path) => router.push(path)
</script>

<style scoped>
@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.animate-gradient {
    background-size: 300% auto;
    animation: shimmer 6s linear infinite;
}

.shimmer-glow {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.15);
}
</style>