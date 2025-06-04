<template>
    <div class="text-white">
        <div class="relative">
            <div v-if="!isExpanded" class="text-zinc-400 text-sm">
                <div class="line-clamp-2 opacity-75">
                    {{ getBlockPreview(block) }}
                </div>
            </div>
            <div v-else>
                <component :is="getComponent(block.type) || Fallback" :block="block" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useBlockRegistry } from '@/composables/useBlockRegistry'
import Fallback from './blocks/Fallback.vue'

const props = defineProps({
    block: Object,
    isExpanded: Boolean
})

const { getComponent, getBlockPreview } = useBlockRegistry()
</script>