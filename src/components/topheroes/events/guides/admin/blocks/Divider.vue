<template>
    <div class="space-y-2">
        <div class="flex items-center gap-4">
            <span class="text-sm text-zinc-400">Style:</span>
            <select v-model="block.data.style"
                class="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
            </select>
        </div>

        <div class="border border-zinc-700 p-4 bg-zinc-800/40 rounded flex items-center justify-center">
            <div class="w-full border-t" :class="{
                'border-dashed': block.data.style === 'dashed',
                'border-dotted': block.data.style === 'dotted'
            }"></div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        block: Object
    }
})

export const defaultData = {
    style: 'solid'
}

export const meta = {
    id: 'Divider',
    title: 'Divider',
    icon: 'MinusIcon',
    description: 'Horizontal divider to visually separate content blocks.',
    category: 'Layout'
}
</script>