<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-[#050508]/85 backdrop-blur-md" @click="close"></div>

      <!-- Floating Close Button Outside Card -->
      <button @click="close" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 z-30 shadow-lg">
        <X class="w-6 h-6" />
      </button>

      <!-- Modal Content (Actual 9:16 Card Mockup) -->
      <div class="relative w-full max-w-[390px] aspect-[9/16] max-h-[85vh] bg-black border border-white/10 rounded-[24px] p-4 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.15)] transition-all duration-300 transform scale-100 z-10">
        
        <!-- Header of Tweet -->
        <div class="flex items-start gap-2.5 mb-3 flex-shrink-0">
          <div class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
            :style="{ background: item.avatarColor || '#1d4ed8' }">
            {{ item.displayName.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1">
              <span class="font-bold text-[13px] leading-tight text-white truncate" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                {{ item.displayName }}
              </span>
              <svg v-if="item.verified" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-[#1d9bf0] flex-shrink-0">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1.01-2.52-1.27-3.91-.81-.66-1.31-1.9-2.19-3.34-2.19-1.43 0-2.67.88-3.33 2.19-1.4-.46-2.91-.2-3.92.81-1.01 1.01-1.27 2.52-.8 3.91C2.88 9.33 2 10.57 2 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1.01 2.52 1.27 3.91.81.66 1.31 1.9 2.19 3.34 2.19 1.43 0 2.67-.88 3.33-2.19 1.4.46 2.91.2 3.92-.81 1.01-1.01 1.27-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.44-3.53L10.66 14l-2.41-2.38a.75.75 0 10-1.06 1.06l3 2.95a.75.75 0 001.08-.02l5.65-6.05a.75.75 0 10-1.1-1.02z"/>
              </svg>
            </div>
            <div class="text-[11.5px] text-slate-400" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              @{{ item.handle }}
            </div>
          </div>
        </div>

        <!-- Render template conditionally depending on if it has media or not -->
        <!-- Media Card Layout (Cards 1, 2, 4) -->
        <template v-if="item.mediaType !== 'none'">
          <!-- Tweet Text content -->
          <div class="text-[13px] leading-[1.4] text-white/95 mb-3 flex-shrink-0 select-text" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-wrap: break-word; overflow-wrap: break-word;">
            <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
              <span v-if="part.startsWith('@')" class="text-[#1d9bf0] hover:underline cursor-pointer">{{ part }}</span>
              <span v-else>{{ part }}</span>
            </template>
          </div>

          <!-- Media block -->
          <div class="flex-grow min-h-0 relative rounded-xl overflow-hidden mb-3 bg-black flex items-center justify-center" :style="{ background: item.mediaBg || '#0f172a' }">
            <!-- Real Video Player -->
            <video
              v-if="item.videoUrl"
              ref="videoPlayer"
              :src="item.videoUrl"
              class="absolute inset-0 w-full h-full object-cover"
              loop
              :muted="isMuted"
              playsinline
              @timeupdate="onTimeUpdate"
              @loadedmetadata="onLoadedMetadata"
            />

            <!-- GIF Player -->
            <img
              v-else-if="item.mediaType === 'gif'"
              :src="item.mediaUrl"
              class="absolute inset-0 w-full h-full object-cover"
              alt="GIF Preview"
            />

            <!-- Static Image -->
            <img
              v-else-if="item.mediaType === 'image'"
              :src="item.mediaUrl"
              class="absolute inset-0 w-full h-full object-cover"
              alt="Image Preview"
            />

            <!-- Play/Pause Overlay indicator (Only for Video) -->
            <div v-if="hasVideo" class="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/15 transition-all cursor-pointer z-10" @click="togglePlay">
              <Transition name="scale-fade">
                <div v-if="!isPlaying" class="w-11 h-11 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg border border-violet-400/20 backdrop-blur-sm">
                  <Play class="w-4.5 h-4.5 fill-current translate-x-[1px]" />
                </div>
              </Transition>
            </div>

            <!-- Absolute Video Controls overlay inside the Media block (Only for Video) -->
            <div v-if="hasVideo" class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col gap-2 z-20">
              <!-- Timeline scrubber -->
              <div class="flex items-center gap-2">
                <span class="text-[9px] font-mono text-slate-300 w-7 select-none">{{ formatTime(currentTime) }}</span>
                <div
                  class="flex-grow h-1 rounded-full bg-white/20 hover:bg-white/30 relative cursor-pointer group transition-all"
                  ref="progressBar"
                  @mousedown="startScrubbing"
                  @click="seek"
                >
                  <div
                    class="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    :style="{ width: progressPercent + '%' }"
                  ></div>
                  <div
                    class="absolute w-2.5 h-2.5 rounded-full bg-white border border-violet-500 -top-[3px] -translate-x-[5px] opacity-0 group-hover:opacity-100 transition-opacity"
                    :style="{ left: progressPercent + '%' }"
                  ></div>
                </div>
                <span class="text-[9px] font-mono text-slate-300 w-7 select-none text-right">{{ formatTime(totalDuration) }}</span>
              </div>

              <!-- Controls row -->
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

          <!-- Bottom Row inside card frame (timestamp and X logo) -->
          <div class="flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 flex-shrink-0">
            <span class="text-[10px] text-slate-500" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              {{ item.timestamp }}
            </span>
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-white/40">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        </template>

        <!-- Text-Only Card Layout (Card 3) -->
        <template v-else>
          <!-- Left-aligned, vertically centered Tweet Text -->
          <div class="flex-grow flex flex-col justify-center px-1 select-text text-left">
            <div class="text-[14.5px] leading-[1.5] text-white/95 font-normal" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-wrap: break-word; overflow-wrap: break-word;">
              <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
                <span v-if="part.startsWith('@')" class="text-[#1d9bf0] hover:underline cursor-pointer font-medium">{{ part }}</span>
                <span v-else>{{ part }}</span>
              </template>
            </div>
          </div>

          <!-- Bottom Row inside card frame (timestamp and X logo) -->
          <div class="flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 flex-shrink-0">
            <span class="text-[10px] text-slate-500" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              {{ item.timestamp }}
            </span>
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-white/40">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
        </template>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  item: { type: Object, required: true }
})

const emit = defineEmits(['close'])

// Real Video Element Reference
const videoPlayer = ref(null)

// Playback States
const isPlaying = ref(false)
const isMuted = ref(true)

// Time States
const currentTime = ref(0)
const totalDuration = ref(0)

// Drag / Scrub State
const isScrubbing = ref(false)
const progressBar = ref(null)

// Check if item has video capability
const hasVideo = computed(() => {
  return props.item.mediaType === 'video' || !!props.item.videoUrl
})

// Compute current playback progress percentage
const progressPercent = computed(() => {
  if (totalDuration.value === 0) return 0
  return (currentTime.value / totalDuration.value) * 100
})

// Helper to format tweet text links/mentions
function formatTweetText(text) {
  if (!text) return []
  return text.split(/(\s+)/)
}

// watch isOpen state to handle initialization
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Reset state
    isPlaying.value = false
    currentTime.value = 0
    if (hasVideo.value && props.item.duration) {
      const parts = props.item.duration.split(':')
      if (parts.length === 2) {
        totalDuration.value = parseInt(parts[0]) * 60 + parseInt(parts[1])
      } else {
        totalDuration.value = parseInt(parts[0])
      }
    }
  } else {
    if (videoPlayer.value) {
      videoPlayer.value.pause()
    }
  }
})

// watch active item change
watch(() => props.item, () => {
  isPlaying.value = false
  currentTime.value = 0
})

// Video Event Handlers
function onLoadedMetadata() {
  if (videoPlayer.value) {
    totalDuration.value = videoPlayer.value.duration
  }
}

function onTimeUpdate() {
  if (videoPlayer.value && !isScrubbing.value) {
    currentTime.value = videoPlayer.value.currentTime
  }
}

// Play / Pause logic
function togglePlay() {
  if (videoPlayer.value) {
    if (isPlaying.value) {
      videoPlayer.value.pause()
    } else {
      videoPlayer.value.play().catch(err => console.log('Video play error:', err))
    }
    isPlaying.value = !isPlaying.value
  }
}

// Mute logic
function toggleMute() {
  isMuted.value = !isMuted.value
  if (videoPlayer.value) {
    videoPlayer.value.muted = isMuted.value
  }
}

// Timeline seeking/scrubbing
function seek(event) {
  if (!progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const width = rect.width
  const percent = Math.max(0, Math.min(1, clickX / width))
  
  const targetTime = percent * totalDuration.value
  currentTime.value = targetTime

  if (videoPlayer.value) {
    videoPlayer.value.currentTime = targetTime
  }
}

function startScrubbing(event) {
  isScrubbing.value = true
  seek(event)
  
  window.addEventListener('mousemove', onScrubDrag)
  window.addEventListener('mouseup', stopScrubbing)
}

function onScrubDrag(event) {
  if (!isScrubbing.value) return
  seek(event)
}

function stopScrubbing() {
  isScrubbing.value = false
  window.removeEventListener('mousemove', onScrubDrag)
  window.removeEventListener('mouseup', stopScrubbing)
}

// Formatting helper
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function close() {
  emit('close')
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onScrubDrag)
  window.removeEventListener('mouseup', stopScrubbing)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
