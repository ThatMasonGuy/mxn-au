<template>
    <section class="w-full pt-20 pb-8 md:pb-10 px-4 text-center shadow-md relative overflow-hidden"
        :class="[gradientClass, 'text-white']">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
                {{ title }}
            </h1>
            <p v-if="subtitle" class="mt-2 text-sm md:text-base opacity-90">
                {{ subtitle }}
            </p>

            <!-- Optional slot (for future back button or CTA) -->
            <div v-if="$slots.actions" class="absolute top-4 right-6">
                <slot name="actions" />
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