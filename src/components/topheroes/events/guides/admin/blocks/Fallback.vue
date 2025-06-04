<template>
    <div class="space-y-2">
        <div class="flex items-center gap-4">
            <span class="text-sm text-zinc-400">FALLBACK - Type:</span>
            <select v-model="block.data.calloutType"
                class="bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="info">Info</option>
                <option value="tip">Tip</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
            </select>
        </div>

        <div class="border p-4 rounded shadow-sm" :class="{
            'bg-blue-900/20 border-blue-700/30': block.data.calloutType === 'info',
            'bg-green-900/20 border-green-700/30': block.data.calloutType === 'tip',
            'bg-amber-900/20 border-amber-700/30': block.data.calloutType === 'warning',
            'bg-red-900/20 border-red-700/30': block.data.calloutType === 'error'
        }">
            <div class="border border-zinc-700 p-2 bg-zinc-800/40 rounded mb-2">
                <input v-model="block.data.title" placeholder="Callout Title"
                    class="w-full bg-transparent border-none font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1" />
            </div>
            <div class="border border-zinc-700 p-2 bg-zinc-800/40 rounded">
                <textarea v-model="block.data.content" placeholder="Callout content goes here..."
                    class="w-full bg-transparent border-none text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 min-h-20 resize-y"
                    rows="4"></textarea>
            </div>
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
    calloutType: 'info'
}

export const meta = {
    id: 'CalloutBox',
    title: 'Callout Box',
    icon: 'ChatBubbleLeftRightIcon',
    description: 'A stylized block for highlighting key content or summaries.',
    category: 'Content'
}
</script>