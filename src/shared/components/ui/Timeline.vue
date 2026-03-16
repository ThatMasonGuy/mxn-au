<template>
    <section class="rounded-2xl mx-auto max-w-[1000px] bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-6 animate-slideUp">
        <h2 class="text-2xl md:text-3xl font-bold text-center pb-2 border-b border-white/10" :class="headingColor">{{
            heading }}</h2>
        <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-[8px] md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-indigo-400/30">
            </div>

            <div class="space-y-12">
                <div v-for="(item, index) in timeline" :key="index" class="relative group animate-fade-in-up">

                    <!-- Mobile layout (stacked, dot left) -->
                    <div class="flex md:hidden items-center gap-4">
                        <!-- Dot on timeline -->
                        <div class="flex items-center h-full">
                            <div class="w-5 h-5 rounded-full border-2 border-white"
                                :class="[item.dotColor, 'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md']">
                            </div>
                        </div>
                        <!-- Card -->
                        <div
                            class="bg-white/10 border border-white/10 p-4 rounded-xl w-full transition-all duration-300 group-hover:bg-white/20 group-hover:scale-[1.02] group-hover:shadow-lg">
                            <h3 class="font-bold" :class="item.textColor">{{ item.title }}</h3>
                            <p class="text-white/80 text-sm">{{ item.description }}</p>
                        </div>
                    </div>

                    <!-- Desktop layout (alternating sides) -->
                    <div class="hidden md:grid md:grid-cols-9 items-center">
                        <!-- Left card or spacer -->
                        <div class="col-span-4 flex justify-end">
                            <div v-if="index % 2 === 0"
                                class="bg-white/10 border border-white/10 p-4 rounded-xl w-full max-w-md transition-all duration-300 group-hover:bg-white/20 group-hover:scale-[1.02] group-hover:shadow-lg">
                                <h3 class="font-bold" :class="item.textColor">{{ item.title }}</h3>
                                <p class="text-white/80 text-sm">{{ item.description }}</p>
                            </div>
                        </div>

                        <!-- Dot -->
                        <div class="col-span-1 flex justify-center relative z-10">
                            <div class="w-5 h-5 rounded-full border-2 border-white mt-1"
                                :class="[item.dotColor, 'transition-all duration-300 group-hover:scale-110 group-hover:shadow-md']">
                            </div>
                        </div>

                        <!-- Right card or spacer -->
                        <div class="col-span-4 flex justify-start">
                            <div v-if="index % 2 !== 0"
                                class="bg-white/10 border border-white/10 p-4 rounded-xl w-full max-w-md transition-all duration-300 group-hover:bg-white/20 group-hover:scale-[1.02] group-hover:shadow-lg">
                                <h3 class="font-bold" :class="item.textColor">{{ item.title }}</h3>
                                <p class="text-white/80 text-sm">{{ item.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    heading: {
        type: String,
        default: 'Event Timeline'
    },
    headingColor: {
        type: String,
        default: 'text-yellow-300'
    },
    timeline: {
        type: Array,
        required: true
    }
})
</script>

<style scoped>
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slideUp {
    animation: slideUp 0.6s ease-out both;
}

@keyframes fade-in-up {
    0% {
        opacity: 0;
        transform: translateY(24px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out both;
}
</style>