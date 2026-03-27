<template>
    <header :class="[
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        isHidden ? '-translate-y-full' : 'translate-y-0',
        isScrolled ? 'bg-stone-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    ]">
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
            <div class="flex justify-between items-center h-16 lg:h-20">

                <!-- Brand -->
                <a href="/prints" class="group flex flex-col">
                    <span class="font-serif text-lg lg:text-xl tracking-[0.2em] text-white/90 group-hover:text-white transition-colors duration-300 uppercase">
                        Mason Bartholomai
                    </span>
                    <span class="text-[10px] lg:text-xs tracking-[0.35em] text-amber-400/70 uppercase font-light">
                        Photography
                    </span>
                </a>

                <!-- Desktop Nav -->
                <nav class="hidden md:flex items-center gap-8">
                    <button v-for="link in links" :key="link.id" @click="scrollToSection(link.id)"
                        class="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors duration-300 font-light">
                        {{ link.label }}
                    </button>
                </nav>

                <!-- Mobile Menu -->
                <Drawer>
                    <DrawerTrigger as-child>
                        <button class="flex md:hidden items-center justify-center">
                            <Menu class="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                        </button>
                    </DrawerTrigger>

                    <DrawerContent class="bg-stone-950/95 backdrop-blur-xl border-t border-amber-400/10">
                        <DrawerTitle class="sr-only">Navigation Menu</DrawerTitle>
                        <DrawerDescription class="sr-only">Navigate the prints shop.</DrawerDescription>

                        <nav class="flex flex-col items-center gap-4 py-8 px-6">
                            <DrawerClose v-for="link in links" :key="link.id" as-child>
                                <button @click="handleDrawerClick(link.id)"
                                    class="text-sm tracking-[0.25em] uppercase text-white/70 hover:text-amber-400 transition-colors duration-300 py-2">
                                    {{ link.label }}
                                </button>
                            </DrawerClose>
                        </nav>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose, DrawerTitle, DrawerDescription } from '@/shared/components/ui/drawer'
import { Menu } from 'lucide-vue-next'

const isHidden = ref(false)
const isScrolled = ref(false)
let lastScrollY = 0

const links = [
    { label: 'Collection', id: 'collection' },
    { label: 'About', id: 'about' },
    { label: 'Process', id: 'process' },
]

const handleScroll = () => {
    const current = window.scrollY
    isHidden.value = current > lastScrollY && current > 200
    isScrolled.value = current > 50
    lastScrollY = current
}

const scrollToSection = (id) => {
    const target = document.getElementById(id)
    if (target) {
        const offset = 100
        const pos = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: pos, behavior: 'smooth' })
    }
}

const handleDrawerClick = (id) => {
    setTimeout(() => scrollToSection(id), 300)
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))
</script>
