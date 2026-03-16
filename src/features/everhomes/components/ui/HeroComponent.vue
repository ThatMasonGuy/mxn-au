<template>
    <section class="w-full pt-28 pb-10 md:pb-16 lg:pb-20 relative overflow-hidden text-white" :class="{
        'text-center': align === 'center',
        'text-left': align === 'left',
        'text-right': align === 'right'
    }">

        <div class="max-w-4xl mx-auto px-6 flex flex-col gap-4" :class="{
            'items-center': align === 'center',
            'items-start': align === 'left',
            'items-end': align === 'right'
        }">
            <!-- Icon -->
            <slot name="icon">
                <component v-if="icon" :is="icon" class="w-10 h-10 md:w-12 md:h-12 text-teal-400 drop-shadow mb-2"
                    aria-hidden="true" />
            </slot>

            <!-- Heading -->
            <slot name="heading">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">
                    {{ heading }}
                </h1>
            </slot>

            <!-- Byline -->
            <slot name="byline">
                <p v-if="byline" class="text-slate-300 text-base md:text-lg max-w-xl">
                    {{ byline }}
                </p>
            </slot>

            <!-- CTA Button -->
            <slot name="cta">
                <a v-if="cta?.text && cta?.link" :href="cta.link"
                    class="mt-4 inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg transition-all">
                    {{ cta.text }}
                </a>
            </slot>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    heading: { type: String, required: true },
    byline: { type: String, default: '' },
    icon: [Object, Function],
    cta: {
        type: Object,
        default: null
    },
    align: {
        type: String,
        default: 'center',
        validator: (val) => ['center', 'left', 'right'].includes(val)
    }
})
</script>