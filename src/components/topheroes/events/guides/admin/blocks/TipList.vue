<template>
    <div class="space-y-2">
        <div class="space-y-1">
            <div v-for="(item, i) in block.data.items" :key="i" class="flex items-start gap-2">
                <span class="text-purple-400 mt-1">•</span>
                <input v-model="block.data.items[i]"
                    class="w-full bg-transparent border border-zinc-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tip text" />
            </div>
        </div>
        <button @click="addTip" class="mt-2 text-xs text-purple-400 hover:text-purple-300">
            + Add tip
        </button>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        block: Object
    },
    setup(props) {
        const block = props.block

        function addTip() {
            if (!Array.isArray(block.data.items)) block.data.items = []
            block.data.items.push('')
        }

        return {
            addTip
        }
    }
})

export const meta = {
    id: 'TipList',
    title: 'Tip List',
    icon: 'LightBulbIcon',
    description: 'A list of helpful tips with icons or emphasis.',
    category: 'Content'
}
</script>