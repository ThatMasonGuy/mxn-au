<template>
    <footer
        class="w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-md text-white/80 text-sm shadow-inner">
        <div class="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

            <!-- Left Icons -->
            <div class="flex items-center gap-4">
                <Tooltip>
                    <TooltipTrigger as-child>
                        <a href="https://github.com/ThatMasonGuy" target="_blank" rel="noopener noreferrer"
                            class="hover:text-white transition">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M12 .5C5.65.5.5 5.8.5 12.29c0 5.22 3.44 9.65 8.2 11.21.6.12.82-.27.82-.6v-2.14c-3.34.74-4.04-1.61-4.04-1.61-.54-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.09 1.83 1.28 1.83 1.28 1.08 1.93 2.83 1.37 3.52 1.05.1-.82.42-1.37.77-1.69-2.67-.3-5.47-1.4-5.47-6.24 0-1.38.45-2.5 1.2-3.39-.12-.3-.52-1.53.12-3.18 0 0 1-.33 3.3 1.28a11.4 11.4 0 016 0c2.3-1.6 3.3-1.28 3.3-1.28.64 1.65.24 2.88.12 3.18.75.89 1.2 2 1.2 3.39 0 4.86-2.8 5.93-5.48 6.23.43.37.82 1.1.82 2.22v3.3c0 .33.22.72.83.6A11.79 11.79 0 0023.5 12.3C23.5 5.8 18.35.5 12 .5Z" />
                            </svg>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>GitHub</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger as-child>
                        <a href="https://discord.com/users/358927850310598656" target="_blank" rel="noopener noreferrer"
                            class="hover:text-indigo-400 transition">
                            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.249a19.736 19.736 0 00-5.891 0 12.516 12.516 0 00-.617-1.249.077.077 0 00-.078-.037A19.736 19.736 0 003.683 4.37a.07.07 0 00-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 00.031.054 19.933 19.933 0 006.073 3.092.077.077 0 00.084-.027c.468-.644.885-1.32 1.247-2.023a.076.076 0 00-.041-.105 12.54 12.54 0 01-1.79-.864.078.078 0 01-.008-.128c.12-.09.239-.183.353-.275a.074.074 0 01.077-.01c3.752 1.709 7.814 1.709 11.538 0a.076.076 0 01.078.01c.114.092.233.185.353.275a.078.078 0 01-.006.128 12.298 12.298 0 01-1.792.864.075.075 0 00-.04.106c.363.703.78 1.38 1.248 2.023a.076.076 0 00.084.028 19.876 19.876 0 006.073-3.093.076.076 0 00.031-.053c.5-5.177-.838-9.653-3.549-13.661a.06.06 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.953 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                            </svg>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Message Me</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <!-- Center Text -->
            <p class="text-center text-sm sm:text-base font-medium text-white/70">
                Built with
                <span
                    class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 animate-gradient shimmer-glow">
                    caffeine
                </span>
                by
                <span
                    class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 animate-gradient shimmer-glow">
                    ThatMasonGuy
                </span>
            </p>

            <!-- Right Side (Empty) -->
            <div class="flex items-center gap-4">
                <!-- Reserved for future icons if you want -->
            </div>

        </div>
    </footer>
</template>

<script setup>
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip'
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