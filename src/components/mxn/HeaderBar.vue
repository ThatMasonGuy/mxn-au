<!-- src/components/mxn/HeaderBar.vue -->
<template>
    <header
        :class="['fixed top-0 left-0 w-full z-50 transition-transform duration-300', isHidden ? '-translate-y-full' : 'translate-y-0']">
        <div
            class="glass px-6 py-4 flex flex-wrap gap-4 justify-between items-center shadow-md backdrop-blur-xl border-b border-white/10">
            <h1
                class="text-lg sm:text-xl font-bold text-blue-400 tracking-wide transition-all hover:scale-105 duration-300">
                Mason Unleashed</h1>
            <nav class="flex gap-4 text-sm sm:text-base">
                <a v-for="link in links" :key="link.href" :href="link.href"
                    class="text-white/80 hover:text-blue-400 transition-colors duration-200 relative group">
                    {{ link.label }}
                    <span
                        class="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isHidden = ref(false)
let lastScrollY = window.scrollY

const handleScroll = () => {
    const current = window.scrollY
    isHidden.value = current > lastScrollY && current > 100
    lastScrollY = current
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

const links = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#dashboard' },
    { label: 'GitHub', href: '#github' }
]
</script>

<style scoped>
.glass {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
}

a {
    position: relative;
    padding-bottom: 2px;
}

a span {
    display: block;
}
</style>