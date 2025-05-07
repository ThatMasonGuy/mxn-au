<template>
    <div class="font-mono text-sm">
        <!-- Enhanced code editor with syntax highlighting -->
        <div ref="jsonContainer" class="rounded-lg overflow-auto">
            <pre class="whitespace-pre-wrap break-words selection:bg-purple-900/40 text-sm">
                <code v-html="highlightedJson"></code>
            </pre>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
    blocks: Array
})

const jsonContainer = ref(null)

// Format the JSON with proper indentation
const formattedJson = computed(() => {
    return JSON.stringify(props.blocks, null, 2)
})

// Add syntax highlighting to the JSON
const highlightedJson = computed(() => {
    if (!formattedJson.value) return ''

    // Simple syntax highlighting
    return formattedJson.value
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'text-green-400' // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-purple-300' // key
                } else {
                    cls = 'text-amber-300' // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-pink-400' // boolean
            } else if (/null/.test(match)) {
                cls = 'text-red-400' // null
            }
            return `<span class="${cls}">${match}</span>`
        })
        .replace(/\n/g, '<br>')
        .replace(/\s{2}/g, '&nbsp;&nbsp;')
})

// Add copy function that can be exposed to parent
function copyToClipboard() {
    const jsonString = JSON.stringify(props.blocks, null, 2)
    navigator.clipboard.writeText(jsonString)
        .then(() => {
            console.log('JSON copied to clipboard')
        })
        .catch(err => {
            console.error('Failed to copy JSON: ', err)
        })
}

// Define the interface to expose functionality to the parent
defineExpose({
    copyToClipboard
})
</script>