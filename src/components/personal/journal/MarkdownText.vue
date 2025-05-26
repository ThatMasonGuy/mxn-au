<!-- @/components/MarkdownText.vue -->
<template>
    <div class="prose dark:prose-invert w-full">
        <div v-html="rendered" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMarkdown } from '@/utils/useMarkdown'

const props = defineProps({
    content: { type: String, required: true }
})

const rendered = computed(() => useMarkdown(props.content))
</script>

<style scoped>
.markdown-wrapper {
    max-width: 100%;
    overflow-x: auto;
}

.prose pre {
    max-width: 100%;
    overflow-x: auto;
    white-space: pre;
}

.prose code {
    white-space: pre;
}
</style>
