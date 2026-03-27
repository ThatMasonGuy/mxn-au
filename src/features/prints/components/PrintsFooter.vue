<template>
    <footer class="relative border-t border-stone-300/50">
        <div class="max-w-5xl mx-auto px-6 lg:px-8 py-12">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8">

                <!-- Brand -->
                <div class="text-center md:text-left">
                    <span class="font-serif text-lg tracking-[0.15em] text-stone-700 block uppercase">Mason Bartholomai</span>
                    <span class="text-[10px] tracking-[0.3em] text-amber-700/50 uppercase">Landscape Photography</span>
                </div>

                <!-- Links -->
                <div class="flex items-center gap-8">
                    <a href="/" class="text-[11px] tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors duration-300">
                        MXN.au
                    </a>
                    <button @click="scrollToTop" class="text-[11px] tracking-wider uppercase text-stone-400 hover:text-stone-600 transition-colors duration-300">
                        Back to Top
                    </button>
                </div>
            </div>

            <!-- Bottom -->
            <div class="mt-8 pt-6 border-t border-stone-300/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-[10px] tracking-wider text-stone-400">
                    &copy; {{ new Date().getFullYear() }} Mason Bartholomai. All rights reserved.
                </p>
                <div class="flex items-center gap-4 text-[10px] tracking-wider text-stone-400">
                    <span>Powered by Printful</span>
                    <span class="text-stone-300">&middot;</span>
                    <span>Payments by Stripe</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
