<!-- src/components/mxn/HeroSection.vue -->
<template>
    <section class="min-h-screen flex flex-col items-center justify-center text-center pt-24 pb-12">
        <div v-if="isLottieReady" class="w-[300px] h-[300px]">
            <lottie-player ref="lottieRef" autoplay loop background="transparent" speed="1"
                style="width: 100%; height: 100%" src="https://assets4.lottiefiles.com/packages/lf20_ydo1amjm.json" />
        </div>
        <h1 class="text-5xl font-extrabold mb-4">Hey, I'm <span class="text-blue-400">Mason</span></h1>
        <div id="typewriter" class="text-xl text-gray-300 max-w-xl min-h-[40px]"></div>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const isLottieReady = ref(false)
const lottieRef = ref(null)

onMounted(() => {
    // Ensure Lottie loads properly
    if (customElements.get('lottie-player')) {
        isLottieReady.value = true
    } else {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js'
        script.onload = () => (isLottieReady.value = true)
        document.body.appendChild(script)
    }

    // Inject Typed.js
    import('typed.js').then(({ default: Typed }) => {
        new Typed('#typewriter', {
            strings: [
                'Web Dev. Game Dev. Bot Dev.',
                'Obsessed with systems. And raccoons.',
                'Building a world that works *better*.',
                'Trying not to reinvent every wheel.'
            ],
            typeSpeed: 40,
            backSpeed: 25,
            loop: true,
            showCursor: false
        })

    })
})
</script>