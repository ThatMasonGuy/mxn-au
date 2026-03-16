<template>
    <div class="grid w-full gap-6" :class="gridClass">
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    cols: {
        type: [Number, Object],
        default: () => ({
            base: 1,
            sm: 2,
            lg: 3,
            xl: 4
        })
    },
    align: {
        type: String,
        default: 'start', // start | center | end
        validator: val => ['start', 'center', 'end'].includes(val)
    }
})

const gridClass = computed(() => {
    const colMap = typeof props.cols === 'number'
        ? { base: props.cols }
        : props.cols

    const base = `grid-cols-${colMap.base ?? 1}`
    const sm = colMap.sm ? `sm:grid-cols-${colMap.sm}` : ''
    const lg = colMap.lg ? `lg:grid-cols-${colMap.lg}` : ''
    const xl = colMap.xl ? `xl:grid-cols-${colMap.xl}` : ''

    const justify = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end'
    }[props.align]

    return [base, sm, lg, xl, justify]
})
</script>