<template>
    <section class="w-full pt-20 pb-8 md:pb-10 px-4 shadow-md relative overflow-hidden"
        :class="[gradientClass, 'text-white']">
        <div class="max-w-4xl mx-auto">
            <!-- If actions slot provided, use a flex row; otherwise centred title -->
            <div v-if="$slots.actions" class="flex items-start justify-between gap-4">
                <div class="text-left">
                    <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ title }}</h1>
                    <p v-if="subtitle" class="mt-2 text-sm md:text-base opacity-90">{{ subtitle }}</p>
                </div>
                <div class="flex-shrink-0 pt-1">
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
    }
})

const gradientClass = `bg-gradient-to-r ${props.gradient}`
</script>