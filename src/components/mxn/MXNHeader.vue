<template>
    <header :class="[
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isHidden ? '-translate-y-full' : 'translate-y-0'
    ]">
        <div
            class="glass px-6 py-3.5 flex justify-between items-center shadow-lg backdrop-blur-xl border-b border-white/10">
            
            <!-- Brand with Icon -->
            <a href="#top" @click.prevent="scrollToSection('#top')"
                class="flex items-center gap-2 group cursor-pointer">
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div class="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-1.5">
                        <Code2 class="w-4 h-4 text-white" />
                    </div>
                </div>
                <span class="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide group-hover:scale-105 transition-transform duration-300">
                    MXN
                </span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center gap-8">
                <button v-for="link in links" :key="link.href" @click="scrollToSection(link.href)"
                    class="relative text-white/80 hover:text-white transition-colors duration-200 group text-sm font-medium">
                    <span class="flex items-center gap-1.5">
                        <component :is="link.icon" class="w-4 h-4" />
                        {{ link.label }}
                    </span>
                    <span
                        class="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
                </button>

                <!-- CTA Button -->
                <button @click="scrollToSection('#contact')"
                    class="relative group overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
                    <span class="relative z-10 flex items-center gap-2 text-white text-sm font-semibold">
                        <MessageCircle class="w-4 h-4" />
                        Get in Touch
                    </span>
                </button>
            </nav>

            <!-- Mobile Menu Button -->
            <Drawer>
                <DrawerTrigger as-child>
                    <button class="flex md:hidden items-center justify-center group">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                            <Menu class="relative w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                        </div>
                    </button>
                </DrawerTrigger>

                <DrawerContent
                    class="bg-black/90 backdrop-blur-lg border-t border-white/10">
                    
                    <DrawerTitle class="sr-only">Navigation Menu</DrawerTitle>
                    <DrawerDescription class="sr-only">Select a section to navigate to.</DrawerDescription>

                    <nav class="flex flex-col items-center gap-6 py-8 px-6">
                        <DrawerClose v-for="link in links" :key="link.href" as-child>
                            <button @click="handleDrawerLinkClick(link.href)"
                                class="group w-full max-w-xs">
                                <div class="flex items-center gap-3 px-6 py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                                    <component :is="link.icon" class="w-5 h-5 text-purple-400" />
                                    <span class="text-lg font-semibold text-white/90 group-hover:text-white">{{ link.label }}</span>
                                </div>
                            </button>
                        </DrawerClose>

                        <!-- Mobile CTA -->
                        <DrawerClose as-child>
                            <button @click="handleDrawerLinkClick('#contact')"
                                class="w-full max-w-xs mt-4">
                                <div class="flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
                                    <MessageCircle class="w-5 h-5 text-white" />
                                    <span class="text-lg font-bold text-white">Get in Touch</span>
                                </div>
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
import { 
    Code2, 
    Terminal, 
    Compass, 
    Sparkles, 
    Github, 
    MessageCircle,
    Menu
} from 'lucide-vue-next'

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

// Links array with icons
const links = [
    { label: 'Terminal', href: '#terminal', icon: Terminal },
    { label: 'Explore', href: '#explore', icon: Compass },
    { label: 'Skills', href: '#skills', icon: Sparkles },
    { label: 'GitHub', href: '#github', icon: Github }
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
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(16px);
}
</style>