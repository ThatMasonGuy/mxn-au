<template>
    <div class="relative w-full overflow-hidden leading-none" :class="{ 'rotate-180': flip }" :style="{ color: color }">
        <svg v-if="variantPath" :viewBox="variantPath.viewBox" preserveAspectRatio="none" class="w-full h-[100px]"
            xmlns="http://www.w3.org/2000/svg">
            <path :d="variantPath.path" fill="currentColor"
                :filter="shadow ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' : undefined" />
        </svg>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'wavey'
    },
    color: {
        type: String,
        default: '#1e1b4b' // fallback to a nice indigo-ish bg
    },
    flip: {
        type: Boolean,
        default: false
    },
    shadow: {
        type: Boolean,
        default: false
    }
})

const paths = {
    wavey: {
        viewBox: '0 0 1440 320',
        path: `M0,224C360,96,1080,384,1440,256L1440,320L0,320Z`
    },
    angle: {
        viewBox: '0 0 1440 320',
        path: `M0,160L1440,0L1440,320L0,320Z`
    },
    curve: {
        viewBox: '0 0 1440 320',
        path: `M0,96C360,256,1080,0,1440,160L1440,320L0,320Z`
    }
}

const variantPath = computed(() => paths[props.variant])
</script>