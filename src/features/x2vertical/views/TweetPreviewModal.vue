<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#050508]/85 backdrop-blur-md" @click="close" />

      <!-- Card + side panel -->
      <div class="relative z-10 flex items-start gap-5 w-full max-w-[680px]">

        <!-- ── 9:16 Tweet Card ─────────────────────────────────────────── -->
        <div
          class="relative flex-shrink-0 w-full max-w-[320px] mx-auto aspect-[9/16] max-h-[82vh] rounded-[22px] p-4 flex flex-col overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.22)] border transition-all duration-300"
          :style="cardStyle"
        >
          <!-- Header -->
          <div class="flex items-start gap-2.5 mb-3 flex-shrink-0">
            <div
              class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
              :style="item.avatarUrl ? {} : { background: item.avatarColor || '#1d4ed8', color: '#fff' }"
            >
              <img v-if="item.avatarUrl" :src="item.avatarUrl" class="w-full h-full object-cover" :alt="item.displayName" crossorigin="anonymous" />
              <template v-else>{{ item.displayName.charAt(0) }}</template>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1">
                <span class="font-bold text-[13px] leading-tight truncate" :style="{ color: textColor, fontFamily: twitterFont }">
                  {{ item.displayName }}
                </span>
                <svg v-if="item.verified" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 flex-shrink-0 text-[#1d9bf0]">
                  <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1.01-2.52-1.27-3.91-.81-.66-1.31-1.9-2.19-3.34-2.19-1.43 0-2.67.88-3.33 2.19-1.4-.46-2.91-.2-3.92.81-1.01 1.01-1.27 2.52-.8 3.91C2.88 9.33 2 10.57 2 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1.01 2.52 1.27 3.91.81.66 1.31 1.9 2.19 3.34 2.19 1.43 0 2.67-.88 3.33-2.19 1.4.46 2.91.2 3.92-.81 1.01-1.01 1.27-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.44-3.53L10.66 14l-2.41-2.38a.75.75 0 10-1.06 1.06l3 2.95a.75.75 0 001.08-.02l5.65-6.05a.75.75 0 10-1.1-1.02z"/>
                </svg>
              </div>
              <div class="text-[11.5px]" :style="{ color: mutedColor, fontFamily: twitterFont }">@{{ item.handle }}</div>
            </div>
          </div>

          <!-- Media post -->
          <template v-if="item.mediaType !== 'none'">
            <div class="text-[13px] leading-[1.4] mb-3 flex-shrink-0 select-text" :style="{ color: textColor, fontFamily: twitterFont, wordWrap:'break-word', overflowWrap:'break-word' }">
              <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
                <span v-if="part.startsWith('@') || part.startsWith('http')" :style="{ color: linkColor }" class="hover:underline cursor-pointer">{{ part }}</span>
                <span v-else>{{ part }}</span>
              </template>
            </div>

            <div class="flex-grow min-h-0 relative rounded-xl overflow-hidden mb-3" :style="{ background: item.mediaBg || '#0f172a' }">
              <!-- Proxied video (crossorigin required for canvas drawImage) -->
              <video
                v-if="hasVideo && !videoError"
                ref="videoPlayer"
                :src="item.videoUrl"
                :poster="item.mediaUrl || undefined"
                class="absolute inset-0 w-full h-full object-cover"
                loop
                :muted="isMuted"
                playsinline
                crossorigin="anonymous"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="onLoadedMetadata"
                @error="onVideoError"
              />
              <!-- Video 403 fallback -->
              <template v-else-if="hasVideo && videoError">
                <img v-if="item.mediaUrl" :src="item.mediaUrl" class="absolute inset-0 w-full h-full object-cover" alt="thumbnail" />
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 z-10">
                  <a :href="`https://x.com/i/status/${item.id}`" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/80 border border-white/20 text-white text-xs font-bold backdrop-blur-sm hover:bg-black/95 transition-all" @click.stop>
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Watch on X
                  </a>
                  <p class="text-[10px] text-white/50">Video restricted to X's CDN</p>
                </div>
              </template>
              <!-- GIF -->
              <img v-else-if="item.mediaType === 'gif'" :src="item.mediaUrl" class="absolute inset-0 w-full h-full object-cover" alt="GIF" />
              <!-- Image -->
              <img v-else-if="item.mediaType === 'image'" :src="item.mediaUrl" class="absolute inset-0 w-full h-full object-cover" alt="Image" crossorigin="anonymous" />

              <!-- Play/pause overlay -->
              <div v-if="hasVideo && !videoError" class="absolute inset-0 flex items-center justify-center hover:bg-black/10 transition-all cursor-pointer z-10" @click="togglePlay">
                <Transition name="scale-fade">
                  <div v-if="!isPlaying" class="w-11 h-11 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg border border-violet-400/20 backdrop-blur-sm">
                    <Play class="w-4 h-4 fill-current translate-x-[1px]" />
                  </div>
                </Transition>
              </div>

              <!-- Video controls bar -->
              <div v-if="hasVideo && !videoError" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col gap-2 z-20">
                <div class="flex items-center gap-2">
                  <span class="text-[9px] font-mono text-slate-300 w-7 select-none">{{ formatTime(currentTime) }}</span>
                  <div class="flex-grow h-1 rounded-full bg-white/20 hover:bg-white/30 relative cursor-pointer group" ref="progressBar" @mousedown="startScrubbing" @click="seek">
                    <div class="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" :style="{ width: progressPercent + '%' }" />
                    <div class="absolute w-2.5 h-2.5 rounded-full bg-white border border-violet-500 -top-[3px] -translate-x-[5px] opacity-0 group-hover:opacity-100 transition-opacity" :style="{ left: progressPercent + '%' }" />
                  </div>
                  <span class="text-[9px] font-mono text-slate-300 w-7 select-none text-right">{{ formatTime(totalDuration) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <button @click="togglePlay" class="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-200 hover:text-white transition-all">
                    <Pause v-if="isPlaying" class="w-3.5 h-3.5 fill-current text-white" />
                    <Play v-else class="w-3.5 h-3.5 fill-current text-white translate-x-[0.5px]" />
                  </button>
                  <button @click="toggleMute" class="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-200 hover:text-white transition-all">
                    <VolumeX v-if="isMuted" class="w-3.5 h-3.5 text-white" />
                    <Volume2 v-else class="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Quoted tweet embed — below media -->
            <div
              v-if="item.quotedTweet"
              class="mb-3 rounded-xl overflow-hidden flex-shrink-0"
              :style="{ border: `1px solid ${borderColor}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }"
            >
              <div class="px-2.5 pt-2 pb-2">
                <div class="flex items-center gap-1.5 mb-1 min-w-0">
                  <div class="w-4 h-4 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[7px] font-bold text-white" :style="{ background: '#64748b' }">
                    <img v-if="item.quotedTweet.author?.avatarUrl" :src="item.quotedTweet.author.avatarUrl" class="w-full h-full object-cover" />
                    <template v-else>{{ (item.quotedTweet.author?.displayName || '?').charAt(0).toUpperCase() }}</template>
                  </div>
                  <span class="font-bold text-[10px] truncate" :style="{ color: textColor, fontFamily: twitterFont }">{{ item.quotedTweet.author?.displayName }}</span>
                  <span class="text-[9px] flex-shrink-0" :style="{ color: mutedColor, fontFamily: twitterFont }">@{{ item.quotedTweet.author?.handle }}</span>
                </div>
                <p class="text-[10px] leading-[1.4] line-clamp-4 select-text" :style="{ color: textColor, fontFamily: twitterFont }">{{ item.quotedTweet.text }}</p>
              </div>
              <img v-if="item.quotedTweet.media?.[0]?.type === 'photo'" :src="item.quotedTweet.media[0].url" class="w-full object-cover block" style="max-height: 64px;" alt="" />
            </div>
          </template>

          <!-- Text-only post -->
          <template v-else>
            <div class="flex-grow flex flex-col px-1 select-text" :class="item.quotedTweet ? 'justify-start pt-1' : 'justify-center'">
              <div class="text-[14.5px] leading-[1.5] font-normal" :style="{ color: textColor, fontFamily: twitterFont, wordWrap:'break-word', overflowWrap:'break-word' }">
                <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
                  <span v-if="part.startsWith('@') || part.startsWith('http')" :style="{ color: linkColor }" class="hover:underline cursor-pointer font-medium">{{ part }}</span>
                  <span v-else>{{ part }}</span>
                </template>
              </div>
              <!-- Quoted tweet embed (text-only post) -->
              <div
                v-if="item.quotedTweet"
                class="mt-3 rounded-xl overflow-hidden flex-shrink-0"
                :style="{ border: `1px solid ${borderColor}`, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }"
              >
                <div class="px-2.5 pt-2 pb-2">
                  <div class="flex items-center gap-1.5 mb-1 min-w-0">
                    <div class="w-4 h-4 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-[7px] font-bold text-white" :style="{ background: '#64748b' }">
                      <img v-if="item.quotedTweet.author?.avatarUrl" :src="item.quotedTweet.author.avatarUrl" class="w-full h-full object-cover" />
                      <template v-else>{{ (item.quotedTweet.author?.displayName || '?').charAt(0).toUpperCase() }}</template>
                    </div>
                    <span class="font-bold text-[10px] truncate" :style="{ color: textColor, fontFamily: twitterFont }">{{ item.quotedTweet.author?.displayName }}</span>
                    <span class="text-[9px] flex-shrink-0" :style="{ color: mutedColor, fontFamily: twitterFont }">@{{ item.quotedTweet.author?.handle }}</span>
                  </div>
                  <p class="text-[10px] leading-[1.4] line-clamp-4 select-text" :style="{ color: textColor, fontFamily: twitterFont }">{{ item.quotedTweet.text }}</p>
                </div>
                <img v-if="item.quotedTweet.media?.[0]?.type === 'photo'" :src="item.quotedTweet.media[0].url" class="w-full object-cover block" style="max-height: 64px;" alt="" />
              </div>
            </div>
          </template>

          <!-- Metrics row -->
          <div v-if="item.metrics" class="flex items-center gap-4 mt-2 pb-2 flex-shrink-0" :style="{ borderBottom: `1px solid ${borderColor}` }">
            <span class="flex items-center gap-1 text-[10px] font-semibold" :style="{ color: mutedColor, fontFamily: twitterFont }">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91z"/></svg>
              {{ fmtNum(item.metrics.likes) }}
            </span>
            <span class="flex items-center gap-1 text-[10px] font-semibold" :style="{ color: mutedColor, fontFamily: twitterFont }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/></svg>
              {{ fmtNum(item.metrics.retweets) }}
            </span>
            <span v-if="item.metrics.views" class="flex items-center gap-1 text-[10px] font-semibold" :style="{ color: mutedColor, fontFamily: twitterFont }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {{ fmtNum(item.metrics.views) }}
            </span>
          </div>

          <!-- Bottom row -->
          <div class="flex items-center justify-between mt-auto pt-2.5 flex-shrink-0" :style="{ borderTop: `1px solid ${borderColor}` }">
            <span class="text-[10px]" :style="{ color: mutedColor, fontFamily: twitterFont }">{{ item.timestamp }}</span>
            <div class="flex items-center gap-2">
              <span class="text-[9px] font-bold tracking-wide" :style="{ color: mutedColor, fontFamily: twitterFont }">MXN.AU</span>
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5" :style="{ color: mutedColor }">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- ── Side panel ─────────────────────────────────────────────────── -->
        <div class="hidden sm:flex flex-col gap-3 pt-1 flex-shrink-0">
          <!-- Close -->
          <button @click="close" class="modal-action-btn" title="Close">
            <X class="w-4 h-4" />
          </button>

          <div class="w-8 h-px bg-white/10 mx-auto" />

          <!-- Download -->
          <button
            @click="handleExport('download')"
            :disabled="isExporting"
            class="modal-action-btn export-btn"
            :class="{ 'opacity-50 cursor-wait': isExporting }"
            :title="isVideo ? 'Download WebM video' : 'Download PNG image'"
          >
            <LoaderCircle v-if="isExporting" class="w-4 h-4 animate-spin" />
            <Download v-else class="w-4 h-4" />
          </button>

          <!-- Copy -->
          <button
            @click="handleExport('copy')"
            :disabled="isExporting"
            class="modal-action-btn"
            :class="{ 'opacity-50 cursor-wait': isExporting }"
            :title="isVideo ? 'Copy (video will download — clipboard limitation)' : 'Copy PNG to clipboard'"
          >
            <ClipboardCopy class="w-4 h-4" />
          </button>

          <!-- Progress indicator -->
          <div v-if="isExporting" class="flex flex-col items-center gap-1.5 w-8">
            <div class="w-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-200" :style="{ width: exportProgress + '%' }" />
            </div>
            <span class="text-[9px] text-white/50 tabular-nums">{{ exportProgress }}%</span>
          </div>

          <!-- Status message -->
          <Transition name="fade">
            <div v-if="exportStatus === 'done' && !isExporting" class="flex items-center justify-center w-8">
              <CheckCircle2 class="w-4 h-4 text-emerald-400" />
            </div>
          </Transition>
        </div>

      </div>

      <!-- Export status / error (below card, full width) -->
      <Transition name="fade">
        <p
          v-if="exportError"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-amber-400 font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/20 whitespace-nowrap z-30"
        >
          {{ exportError }}
        </p>
      </Transition>

      <!-- Mobile controls -->
      <div class="sm:hidden absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 z-30">
        <button
          @click="handleExport('download')"
          :disabled="isExporting"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg disabled:opacity-50"
        >
          <LoaderCircle v-if="isExporting" class="w-3.5 h-3.5 animate-spin" />
          <Download v-else class="w-3.5 h-3.5" />
          {{ isExporting ? exportProgress + '%' : 'Download' }}
        </button>
        <button
          @click="handleExport('copy')"
          :disabled="isExporting"
          class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all shadow-lg disabled:opacity-50"
        >
          <ClipboardCopy class="w-3.5 h-3.5" />
          Copy
        </button>
        <button @click="close" class="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all shadow-lg">
          <X class="w-4 h-4" />
        </button>
      </div>

    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { CheckCircle2, ClipboardCopy, Download, LoaderCircle, Pause, Play, Volume2, VolumeX, X } from 'lucide-vue-next'
import { useCardExporter } from '../composables/useCardExporter.js'

const props = defineProps({
  isOpen:     { type: Boolean, required: true },
  item:       { type: Object,  required: true },
  background: { type: Object,  default: () => ({ id: 'black', css: '#000000', type: 'solid' }) },
})

const emit = defineEmits(['close'])

// ── Theme from background prop ─────────────────────────────────────────────
const twitterFont = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

const isDark     = computed(() => props.background?.textTone !== 'dark')
const textColor  = computed(() => isDark.value ? '#ffffff'                : '#0f172a')
const mutedColor = computed(() => isDark.value ? 'rgba(226,232,240,0.68)' : 'rgba(15,23,42,0.62)')
const borderColor = computed(() => isDark.value ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')
const linkColor  = computed(() => isDark.value ? '#38bdf8'                : '#0369a1')

const cardStyle  = computed(() => ({
  background: props.background?.css ?? '#000000',
  borderColor: isDark.value ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
}))

// ── Video player ───────────────────────────────────────────────────────────
const videoPlayer   = ref(null)
const isPlaying     = ref(false)
const isMuted       = ref(true)
const currentTime   = ref(0)
const totalDuration = ref(0)
const isScrubbing   = ref(false)
const progressBar   = ref(null)
const videoError    = ref(false)

const hasVideo = computed(() => props.item?.mediaType === 'video' || !!props.item?.videoUrl)
const isVideo  = computed(() => hasVideo.value && !videoError.value)

const progressPercent = computed(() =>
  totalDuration.value === 0 ? 0 : (currentTime.value / totalDuration.value) * 100,
)

// ── Export ─────────────────────────────────────────────────────────────────
const { isExporting, exportProgress, exportStatus, exportError, doExport, resetExport } = useCardExporter()

async function handleExport(mode) {
  resetExport()
  await doExport(mode, props.item, props.background, isVideo.value ? videoPlayer.value : null)
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (!n && n !== 0) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}

function formatTweetText(text) {
  if (!text) return []
  return text.split(/(\s+)/)
}

// ── Watchers ───────────────────────────────────────────────────────────────
watch(() => props.isOpen, newVal => {
  if (!newVal) {
    videoPlayer.value?.pause()
    isPlaying.value = false
    resetExport()
  } else {
    isPlaying.value = false
    currentTime.value = 0
  }
})

watch(() => props.item, () => {
  isPlaying.value = false
  currentTime.value = 0
  totalDuration.value = 0
  videoError.value = false
  resetExport()
})

// ── Video event handlers ───────────────────────────────────────────────────
function onLoadedMetadata() {
  if (videoPlayer.value) totalDuration.value = videoPlayer.value.duration
}
function onTimeUpdate() {
  if (videoPlayer.value && !isScrubbing.value) currentTime.value = videoPlayer.value.currentTime
}
function onVideoError() {
  videoError.value = true
  isPlaying.value = false
}
function togglePlay() {
  if (!videoPlayer.value) return
  isPlaying.value ? videoPlayer.value.pause() : videoPlayer.value.play().catch(console.error)
  isPlaying.value = !isPlaying.value
}
function toggleMute() {
  isMuted.value = !isMuted.value
  if (videoPlayer.value) videoPlayer.value.muted = isMuted.value
}
function seek(event) {
  if (!progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const pct  = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  currentTime.value = pct * totalDuration.value
  if (videoPlayer.value) videoPlayer.value.currentTime = currentTime.value
}
function startScrubbing(event) {
  isScrubbing.value = true
  seek(event)
  window.addEventListener('mousemove', onScrubDrag)
  window.addEventListener('mouseup',   stopScrubbing)
}
function onScrubDrag(event) { if (isScrubbing.value) seek(event) }
function stopScrubbing() {
  isScrubbing.value = false
  window.removeEventListener('mousemove', onScrubDrag)
  window.removeEventListener('mouseup',   stopScrubbing)
}
function formatTime(s) {
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}
function close() { emit('close') }

onUnmounted(() => {
  window.removeEventListener('mousemove', onScrubDrag)
  window.removeEventListener('mouseup',   stopScrubbing)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.22s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.scale-fade-enter-from, .scale-fade-leave-to { opacity: 0; transform: scale(0.7); }

.modal-action-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-all border;
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: rgba(226,232,240,0.7);
}
.modal-action-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
  color: #ffffff;
}
.export-btn:not(:disabled) {
  background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3));
  border-color: rgba(139,92,246,0.4);
  color: #c4b5fd;
}
.export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(139,92,246,0.45), rgba(59,130,246,0.45));
  border-color: rgba(139,92,246,0.6);
  color: #ffffff;
}
</style>
