<template>
    <footer
        class="w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent text-gray-300 text-sm px-6 py-8 backdrop-blur-xl shadow-inner relative z-50">
        <div class="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <!-- Left -->
            <p @click="navigateTo('/topheroes/admin')"
                class="cursor-pointer text-white/70 hover:text-pink-400 transition duration-300 ease-in-out hover:underline">
                💻 Nerds
            </p>

            <!-- Center -->
            <p class="text-center text-white/80 flex-1">
                Built with ☕️ by
                <span class="bg-gradient-to-r from-pink-500 to-violet-400 bg-clip-text text-transparent font-semibold">
                    {{ author }}
                </span>
            </p>

            <!-- Right -->
            <p @click="navigateTo('/topheroes/velaris')"
                class="cursor-pointer text-white/70 hover:text-indigo-400 transition duration-300 ease-in-out hover:underline">
                🌌 Velaris
            </p>
        </div>
    </footer>
</template>

<script setup>
import router from '@/router.js'

const author = '[VLR]Mason in s10154'
const navigateTo = (path) => {
    router.push(path)
}
</script>

<style scoped>
footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>