<template>
    <section
        class="w-full shadow-md relative overflow-hidden"
        :class="[gradientClass, 'text-white', spacious ? 'pt-24 pb-12 md:pb-14 px-5 sm:px-6' : 'pt-20 pb-8 md:pb-10 px-4']"
    >
        <div class="mx-auto" :class="$slots.actions ? 'max-w-5xl' : 'max-w-4xl'">
            <!-- If actions slot provided, keep the action aligned with the subtitle; otherwise centre the title -->
            <div v-if="$slots.actions" class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                <div class="text-left min-w-0">
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{{ title }}</h1>
                    <p v-if="subtitle" class="mt-1.5 text-sm md:text-base opacity-90">{{ subtitle }}</p>
                </div>
                <div>
                    <slot name="actions" />
                </div>
            </div>
            <div v-else class="text-center">
                <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ title }}</h1>
                <p v-if="subtitle" class="mt-2 text-sm md:text-base opacity-90">{{ subtitle }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    gradient: {
        type: String,
        default: 'from-teal-500 to-blue-500'
    },
    spacious: { type: Boolean, default: false },
})

const gradientClass = `bg-gradient-to-r ${props.gradient}`
</script>
