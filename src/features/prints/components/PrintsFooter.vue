<template>
    <footer class="relative border-t border-white/5">
        <div class="max-w-5xl mx-auto px-6 lg:px-8 py-12">
            <div class="flex flex-col md:flex-row justify-between items-center gap-8">

                <!-- Brand -->
                <div class="text-center md:text-left">
                    <span class="font-serif text-lg tracking-[0.15em] text-white/80 block uppercase">Mason Bartholomai</span>
                    <span class="text-[10px] tracking-[0.3em] text-amber-400/50 uppercase">Landscape Photography</span>
                </div>

                <!-- Links -->
                <div class="flex items-center gap-8">
                    <a href="/" class="text-[11px] tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors duration-300">
                        MXN.au
                    </a>
                    <button @click="scrollToTop" class="text-[11px] tracking-wider uppercase text-white/30 hover:text-white/60 transition-colors duration-300">
                        Back to Top
                    </button>
                </div>
            </div>

            <!-- Bottom -->
            <div class="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-[10px] tracking-wider text-white/20">
                    &copy; {{ new Date().getFullYear() }} Mason Bartholomai. All rights reserved.
                </p>
                <div class="flex items-center gap-4 text-[10px] tracking-wider text-white/20">
                    <span>Powered by Printful</span>
                    <span class="text-white/10">&middot;</span>
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
