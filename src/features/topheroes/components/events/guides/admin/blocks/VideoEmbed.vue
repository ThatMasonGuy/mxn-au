<template>
    <div class="space-y-3">
        <input v-model="block.data.title" placeholder="Video Title (optional)"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <input v-model="block.data.url" placeholder="HTTPS YouTube or Vimeo URL"
            class="w-full bg-transparent border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <div v-if="embedUrl" class="aspect-video w-full rounded overflow-hidden border border-zinc-700 mt-2">
            <iframe :src="embedUrl" class="w-full h-full border-0" allowfullscreen
                referrerpolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-presentation"></iframe>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
    props: {
        block: Object
    },
    setup(props) {
        function formatEmbedUrl(url) {
            try {
                const parsed = new URL(String(url))
                if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port) return ''

                const hostname = parsed.hostname.toLowerCase()
                if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(hostname)) {
                    if (parsed.pathname === '/watch') {
                        const videoId = parsed.searchParams.get('v')
                        return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : ''
                    }
                    if (parsed.pathname.startsWith('/embed/')) return parsed.href
                    return ''
                }

                if (hostname === 'youtu.be') {
                    const videoId = parsed.pathname.split('/').filter(Boolean)[0]
                    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : ''
                }

                if (['vimeo.com', 'www.vimeo.com'].includes(hostname)) {
                    const videoId = parsed.pathname.split('/').filter(Boolean)[0]
                    return /^\d+$/.test(videoId || '') ? `https://player.vimeo.com/video/${videoId}` : ''
                }

                if (hostname === 'player.vimeo.com' && /^\/video\/\d+\/?$/.test(parsed.pathname)) {
                    return parsed.href
                }
            } catch {
                return ''
            }

            return ''
        }

        const embedUrl = computed(() => formatEmbedUrl(props.block?.data?.url))

        return {
            embedUrl
        }
    }
})

export const meta = {
    id: 'VideoEmbed',
    title: 'Video Embed',
    icon: 'PlayCircleIcon',
    description: 'Embeds videos from verified YouTube or Vimeo URLs.',
    category: 'Media'
}
</script>
