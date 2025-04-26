<template>
    <header :class="[
        'fixed top-0 left-0 w-full z-50 transition-transform duration-300',
        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div
            class="glass px-6 py-4 flex justify-between items-center shadow-md backdrop-blur-xl border-b border-white/10">
            <!-- Brand -->
            <a href="#top"
                class="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide hover:scale-105 transition-transform duration-300">
                MXN
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden sm:flex gap-6 text-sm sm:text-base font-medium">
                <button v-for="link in links" :key="link.href" @click="scrollToSection(link.href)"
                    class="relative text-white/80 hover:text-indigo-400 transition-colors duration-200 group">
                    {{ link.label }}
                    <span
                        class="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </button>
            </nav>

            <Drawer>
                <DrawerTrigger as-child>
                    <button class="flex sm:hidden items-center justify-center">
                        <!-- Hamburger Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </DrawerTrigger>

                <DrawerContent
                    class="bg-black/80 backdrop-blur-lg border-t border-white/10 flex flex-col items-center gap-8 py-12">

                    <!-- ADD TITLE (Visually Hidden if you don't want it shown) -->
                    <DrawerTitle class="sr-only">Navigation Menu</DrawerTitle>

                    <!-- Optional: ADD DESCRIPTION if you want -->
                    <DrawerDescription class="sr-only">Select a section to navigate to.</DrawerDescription>

                    <nav class="flex flex-col items-center gap-8 text-2xl text-white font-bold">
                        <DrawerClose v-for="link in links" :key="link.href" as-child>
                            <button @click="handleDrawerLinkClick(link.href)"
                                class="hover:text-indigo-400 transition-colors duration-300">
                                {{ link.label }}
                            </button>
                        </DrawerClose>
                    </nav>
                </DrawerContent>
            </Drawer>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'

const isHidden = ref(false)
let lastScrollY = window.scrollY

const handleScroll = () => {
    const current = window.scrollY
    isHidden.value = current > lastScrollY && current > 100
    lastScrollY = current
}

const handleDrawerLinkClick = (href) => {
    setTimeout(() => {
        scrollToSection(href)
    }, 300)
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Links array
const links = [
    { label: 'Terminal', href: '#terminal' },
    { label: 'Explore', href: '#explore' },
    { label: 'Skills', href: '#skills' },
    { label: 'GitHub', href: '#github' },
    { label: 'Contact', href: '#contact' }
]

// Smart scrollToSection function
const scrollToSection = (href) => {
    const id = href.replace('#', '')
    const target = document.getElementById(id)
    if (target) {
        const headerOffset = 100
        const elementPosition = target.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        })
    }
}
</script>

<style scoped>
.glass {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(14px);
}

a,
button {
    position: relative;
    padding-bottom: 2px;
}

a span,
button span {
    display: block;
}
</style>