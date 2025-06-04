<template>
    <div class="space-y-3">
        <input v-model="block.data.title" placeholder="Video Title (optional)"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input v-model="block.data.url" placeholder="Video URL (YouTube, Vimeo, etc.)"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <div v-if="block.data.url" class="aspect-video w-full rounded overflow-hidden border border-zinc-700 mt-2">
            <iframe :src="formatEmbedUrl(block.data.url)" class="w-full h-full border-0" allowfullscreen></iframe>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        block: Object
    },
    setup() {
        function formatEmbedUrl(url) {
            if (url.includes('youtube.com/watch')) {
                return url.replace('watch?v=', 'embed/')
            }
            if (url.includes('youtu.be/')) {
                return url.replace('youtu.be/', 'youtube.com/embed/')
            }
            if (url.includes('vimeo.com/')) {
                return url.replace('vimeo.com/', 'player.vimeo.com/video/')
            }
            return url
        }

        return {
            formatEmbedUrl
        }
    }
})

export const meta = {
    id: 'VideoEmbed',
    title: 'Video Embed',
    icon: 'PlayCircleIcon',
    description: 'Embeds videos from YouTube, Vimeo, or custom sources.',
    category: 'Media'
}
</script>