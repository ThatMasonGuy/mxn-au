<template>
    <div class="flex flex-col space-y-2">
        <h3 class="text-xs font-medium text-white/80 uppercase tracking-wide">Usage</h3>

        <!-- Translations Stat Panel -->
        <div class="relative group">
            <div
                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
            </div>
            <!-- Main panel content -->
            <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                        <div class="relative">
                            <div
                                class="absolute inset-0 bg-cyan-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                            </div>
                            <div
                                class="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                                <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-cyan-300 uppercase tracking-wide">Translations</p>
                            <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{
                                store.appStats.totalTranslations.toLocaleString() }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div
                            class="w-5 h-5 md:w-7 md:h-7 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                            <div class="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 rounded-full bg-cyan-400 animate-pulse">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Words Stat Panel -->
        <div class="relative group">
            <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
            </div>
            <!-- Main panel content -->
            <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                        <div class="relative">
                            <div
                                class="absolute inset-0 bg-emerald-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                            </div>
                            <div
                                class="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                                <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h5.25m-5.25 3h5.25M12 3h6a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h6zm3 3H6v12h12V6z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-emerald-300 uppercase tracking-wide">Words</p>
                            <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{
                                store.appStats.totalWords.toLocaleString() }}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="flex flex-col items-end space-y-0.5">
                            <div class="w-4 h-1 bg-emerald-400 rounded-full"></div>
                            <div class="w-3 h-1 bg-emerald-400/70 rounded-full"></div>
                            <div class="w-2 h-1 bg-emerald-400/40 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- API Cost Stat Panel -->
        <div class="relative group">
            <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
            </div>
            <!-- Main panel content -->
            <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                        <div class="relative">
                            <div
                                class="absolute inset-0 bg-purple-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                            </div>
                            <div
                                class="relative bg-gradient-to-br from-purple-500 to-pink-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                                <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-purple-300 uppercase tracking-wide">API Cost</p>
                            <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{
                                store.formattedApiCost }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div
                            class="relative w-5 h-5 md:w-7 md:h-7 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                            <div
                                class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 animate-ping">
                            </div>
                            <div
                                class="relative w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Live Statistics Indicator -->
        <div class="flex items-center justify-center space-x-2 mt-6 pb-4 lg:pb-0 opacity-60">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-xs text-white/60 font-medium">Live Statistics</span>
        </div>

    </div>
</template>

<script setup>
import { useTranslateStore } from '@/stores/useTranslateStore'

const store = useTranslateStore()
</script>