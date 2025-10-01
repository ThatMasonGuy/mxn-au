<!-- DiscordLoadingSpinner.vue -->
<template>
    <div class="flex flex-col items-center justify-center py-12">
        <!-- Main spinner -->
        <div class="relative mb-6">
            <!-- Outer ring -->
            <div class="h-16 w-16 rounded-full border-4 border-border/20"></div>
            <!-- Animated ring -->
            <div
                class="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-violet-600 border-r-fuchsia-600 animate-spin">
            </div>
            <!-- Inner pulse -->
            <div
                class="absolute inset-2 h-12 w-12 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 animate-pulse">
            </div>
        </div>

        <!-- Loading text with animated dots -->
        <div class="flex items-center gap-2 text-sm text-foreground/70">
            <span>Loading Bot Dashboard</span>
            <div class="flex gap-1">
                <div class="h-1 w-1 rounded-full bg-violet-600 animate-bounce" style="animation-delay: 0ms"></div>
                <div class="h-1 w-1 rounded-full bg-fuchsia-600 animate-bounce" style="animation-delay: 150ms"></div>
                <div class="h-1 w-1 rounded-full bg-cyan-500 animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>

        <!-- Skeleton content -->
        <div class="w-full mt-8 space-y-4">
            <!-- Status pills skeleton -->
            <div class="flex flex-wrap items-center gap-2">
                <div v-for="i in 3" :key="i"
                    class="h-8 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-full animate-pulse"
                    :style="{ width: `${80 + (i * 20)}px` }"></div>
            </div>

            <!-- Main content skeleton -->
            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Main content area -->
                <div class="lg:col-span-2 space-y-4">
                    <div class="h-8 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded animate-pulse w-48">
                    </div>
                    <div class="space-y-3">
                        <div v-for="i in 5" :key="i"
                            class="h-24 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded-lg animate-pulse"
                            :style="{ animationDelay: `${i * 150}ms` }"></div>
                    </div>
                </div>

                <!-- Sidebar content -->
                <div class="space-y-4">
                    <div class="space-y-3">
                        <div class="h-6 bg-gradient-to-r from-foreground/5 to-foreground/10 rounded animate-pulse w-32">
                        </div>
                        <div class="grid grid-cols-1 gap-3">
                            <div v-for="i in 4" :key="i"
                                class="h-16 bg-gradient-to-br from-foreground/5 to-foreground/10 rounded-lg animate-pulse"
                                :style="{ animationDelay: `${i * 100}ms` }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>