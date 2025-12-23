<template>
    <footer class="relative">
        <!-- Gradient Fade-in Overlay -->
        <div class="absolute bottom-full left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
        
        <div class="w-full bg-black/90 backdrop-blur-md text-white/80 border-t border-white/5">
            <div class="max-w-7xl mx-auto px-6 py-8">
            
            <div class="flex flex-col lg:flex-row gap-8">
                
                <!-- Main Footer Links -->
                <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                    
                    <!-- TopHeroes Section -->
                    <div>
                        <h3 class="text-pink-400 font-semibold mb-4 flex items-center gap-2">
                            <Sword class="w-4 h-4" />
                            TopHeroes
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <RouterLink to="/topheroes" class="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Dashboard
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/topheroes/tools" class="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Tools
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/topheroes/events" class="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Event Guides
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/topheroes/queues" class="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Queues
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/topheroes/velaris" class="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Velaris Guild
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                    <!-- MXN Tools -->
                    <div>
                        <h3 class="text-blue-400 font-semibold mb-4 flex items-center gap-2">
                            <Wrench class="w-4 h-4" />
                            MXN Tools
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <a href="/translate" class="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Translate Bot
                                </a>
                            </li>
                            <li>
                                <a href="/devtools" class="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    DevTools
                                </a>
                            </li>
                            <li>
                                <a href="/qr" class="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    QR Generator
                                </a>
                            </li>
                            <li>
                                <a href="/destiny" class="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Destiny 2
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Gaming -->
                    <div>
                        <h3 class="text-purple-400 font-semibold mb-4 flex items-center gap-2">
                            <Gamepad2 class="w-4 h-4" />
                            Gaming
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <a href="/casino" class="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Casino Games
                                </a>
                            </li>
                            <li>
                                <a href="/daily" class="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Daily Games
                                </a>
                            </li>
                            <li>
                                <a href="/minecraft" class="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Minecraft
                                </a>
                            </li>
                            <li>
                                <a href="/dnd" class="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    D&D Tools
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Business -->
                    <div>
                        <h3 class="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                            <Briefcase class="w-4 h-4" />
                            Business
                        </h3>
                        <ul class="space-y-2.5">
                            <li>
                                <a href="/professional" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Professional Suite
                                </a>
                            </li>
                            <li>
                                <a href="/everhomes" class="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-sm">
                                    <ChevronRight class="w-3 h-3" />
                                    Everhomes Tools
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                <!-- Right Sidebar -->
                <div class="lg:w-72 shrink-0">
                    <div class="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-lg border border-white/10 p-6">
                        <h3 class="text-white font-semibold mb-4 flex items-center gap-2">
                            <Sparkles class="w-4 h-4 text-pink-400" />
                            TopHeroes Community
                        </h3>
                        
                        <p class="text-sm text-white/70 mb-4">
                            {{ author }}
                        </p>

                        <div class="flex flex-wrap gap-3 mb-4">
                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <a href="https://discord.gg/th-vlr" target="_blank" rel="noopener noreferrer"
                                        class="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md transition-colors border border-indigo-500/20">
                                        <svg class="w-4 h-4 fill-current text-indigo-400" viewBox="0 0 24 24">
                                            <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.249a19.736 19.736 0 00-5.891 0 12.516 12.516 0 00-.617-1.249.077.077 0 00-.078-.037A19.736 19.736 0 003.683 4.37a.07.07 0 00-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 00.031.054 19.933 19.933 0 006.073 3.092.077.077 0 00.084-.027c.468-.644.885-1.32 1.247-2.023a.076.076 0 00-.041-.105 12.54 12.54 0 01-1.79-.864.078.078 0 01-.008-.128c.12-.09.239-.183.353-.275a.074.074 0 01.077-.01c3.752 1.709 7.814 1.709 11.538 0a.076.076 0 01.078.01c.114.092.233.185.353.275a.078.078 0 01-.006.128 12.298 12.298 0 01-1.792.864.075.075 0 00-.04.106c.363.703.78 1.38 1.248 2.023a.076.076 0 00.084.028 19.876 19.876 0 006.073-3.093.076.076 0 00.031-.053c.5-5.177-.838-9.653-3.549-13.661a.06.06 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.953 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                                        </svg>
                                        <span class="text-sm text-indigo-300">Discord</span>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Join the community</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger as-child>
                                    <a href="https://github.com/ThatMasonGuy" target="_blank" rel="noopener noreferrer"
                                        class="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors border border-white/10">
                                        <Github class="w-4 h-4" />
                                        <span class="text-sm">GitHub</span>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Source code</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div class="pt-4 border-t border-white/10 space-y-2">
                            <RouterLink to="/topheroes/admin" class="text-sm text-white/60 hover:text-white/90 transition-colors flex items-center gap-1.5">
                                <Settings class="w-3 h-3" />
                                Admin Panel
                            </RouterLink>
                            <a href="/" class="text-sm text-white/60 hover:text-white/90 transition-colors flex items-center gap-1.5">
                                <Home class="w-3 h-3" />
                                Back to MXN Home
                            </a>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Bottom Bar -->
            <Separator class="my-6" />
            
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <p class="text-center sm:text-left text-white/60">
                    © {{ new Date().getFullYear() }} MXN.au - All rights reserved
                </p>
                
                <p class="text-center text-white/70">
                    Built with
                    <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 animate-gradient shimmer-glow">
                        caffeine
                    </span>
                    by
                    <span class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 animate-gradient shimmer-glow">
                        ThatMasonGuy
                    </span>
                </p>
            </div>

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
import { Separator } from '@/components/ui/separator'
import { 
    Sword,
    Wrench,
    Gamepad2,
    Briefcase,
    ChevronRight,
    Sparkles,
    Github,
    Settings,
    Home
} from 'lucide-vue-next'

const props = defineProps({
    author: {
        type: String,
        default: 'Built for TopHeroes players by [VLR]Mason'
    }
})
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