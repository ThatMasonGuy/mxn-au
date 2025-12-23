<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-gradient-to-br from-green-900 to-emerald-950 rounded-2xl border-2 border-lime-500/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-lime-500/30 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center">
            <Share2 class="w-5 h-5 text-lime-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-lime-300">Share & Export</h2>
            <p class="text-sm text-lime-400/60">{{ datasetName }}</p>
          </div>
        </div>
        <button @click="close" class="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
          <X class="w-5 h-5 text-red-400" />
        </button>
      </div>

      <!-- Tab Navigation -->
      <div class="flex border-b border-lime-500/30 px-4 gap-1 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap',
            activeTab === tab.id
              ? 'border-lime-400 text-lime-300 bg-lime-500/10'
              : 'border-transparent text-lime-400/60 hover:text-lime-300 hover:bg-lime-500/5'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Discord Tab -->
        <div v-if="activeTab === 'discord'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Options -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-lime-300">Include in Export:</h3>
              
              <!-- Checkboxes for data selection -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="discordOptions.rankings" class="accent-lime-500 w-4 h-4" />
                  <div>
                    <span class="text-lime-200">Rankings Table</span>
                    <p class="text-xs text-lime-400/60">Ordered list with positions and scores</p>
                  </div>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="discordOptions.eventScores" class="accent-lime-500 w-4 h-4" />
                  <div>
                    <span class="text-lime-200">Event Scores</span>
                    <p class="text-xs text-lime-400/60">Breakdown by each event</p>
                  </div>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="discordOptions.winRecords" class="accent-lime-500 w-4 h-4" />
                  <div>
                    <span class="text-lime-200">Win/Loss Records</span>
                    <p class="text-xs text-lime-400/60">W-L for GvG events</p>
                  </div>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="discordOptions.power" class="accent-lime-500 w-4 h-4" />
                  <div>
                    <span class="text-lime-200">Guild Power</span>
                    <p class="text-xs text-lime-400/60">Power values for each guild</p>
                  </div>
                </label>
              </div>

              <!-- Format Options -->
              <div class="pt-4 border-t border-lime-500/20">
                <h3 class="text-sm font-semibold text-lime-300 mb-2">Format:</h3>
                <div class="flex gap-2">
                  <button
                    v-for="fmt in ['embed', 'compact', 'table']"
                    :key="fmt"
                    @click="discordOptions.format = fmt"
                    :class="[
                      'px-3 py-1.5 text-xs rounded-md border transition-colors capitalize',
                      discordOptions.format === fmt
                        ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                        : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                    ]"
                  >
                    {{ fmt }}
                  </button>
                </div>
              </div>

              <!-- Limit -->
              <div class="pt-4 border-t border-lime-500/20">
                <h3 class="text-sm font-semibold text-lime-300 mb-2">Show Top:</h3>
                <div class="flex gap-2">
                  <button
                    v-for="n in [3, 5, 10, 'all']"
                    :key="n"
                    @click="discordOptions.limit = n"
                    :class="[
                      'px-3 py-1.5 text-xs rounded-md border transition-colors',
                      discordOptions.limit === n
                        ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                        : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                    ]"
                  >
                    {{ n === 'all' ? 'All' : `Top ${n}` }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-lime-300">Preview:</h3>
                <span class="text-xs text-lime-400/60">{{ discordOutput.length }} / 2000 chars</span>
              </div>
              <div class="bg-[#36393f] rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto font-mono text-sm text-gray-100 whitespace-pre-wrap">
                {{ discordOutput }}
              </div>
            </div>
          </div>

          <!-- Copy Button -->
          <div class="flex justify-end gap-2 pt-4 border-t border-lime-500/20">
            <Button
              @click="copyToClipboard(discordOutput)"
              class="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            >
              <Copy class="w-4 h-4 mr-2" />
              {{ copied === 'discord' ? 'Copied!' : 'Copy to Clipboard' }}
            </Button>
          </div>
        </div>

        <!-- Twitter Tab -->
        <div v-if="activeTab === 'twitter'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Options -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-lime-300">Tweet Content:</h3>
              
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="twitterOptions.topThree" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Include Top 3 Guilds</span>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="twitterOptions.scores" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Include Scores</span>
                </label>
              </div>

              <div class="pt-4 border-t border-lime-500/20">
                <h3 class="text-sm font-semibold text-lime-300 mb-2">Custom Message:</h3>
                <textarea
                  v-model="twitterOptions.customMessage"
                  class="w-full h-20 bg-green-900/50 border border-lime-500/30 rounded-lg p-3 text-lime-100 text-sm resize-none"
                  placeholder="Add a custom message..."
                ></textarea>
              </div>
            </div>

            <!-- Preview -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-lime-300">Preview:</h3>
                <span :class="['text-xs', twitterOutput.length > 280 ? 'text-red-400' : 'text-lime-400/60']">
                  {{ twitterOutput.length }} / 280 chars
                </span>
              </div>
              <div class="bg-black rounded-lg p-4 min-h-[200px] text-white text-sm whitespace-pre-wrap">
                {{ twitterOutput }}
              </div>
            </div>
          </div>

          <!-- Share Button -->
          <div class="flex justify-end gap-2 pt-4 border-t border-lime-500/20">
            <Button
              @click="copyToClipboard(twitterOutput, 'twitter')"
              variant="outline"
              class="border-lime-500/50 text-lime-300"
            >
              <Copy class="w-4 h-4 mr-2" />
              {{ copied === 'twitter' ? 'Copied!' : 'Copy' }}
            </Button>
            <Button
              @click="shareToTwitter"
              class="bg-black hover:bg-gray-900 text-white"
            >
              <Twitter class="w-4 h-4 mr-2" />
              Post to X
            </Button>
          </div>
        </div>

        <!-- PNG Tab -->
        <div v-if="activeTab === 'png'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Options -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-lime-300">Image Options:</h3>
              
              <div class="space-y-3">
                <div>
                  <label class="text-xs text-lime-400/70 mb-1 block">Theme</label>
                  <div class="flex gap-2">
                    <button
                      v-for="style in ['dark', 'light']"
                      :key="style"
                      @click="pngOptions.theme = style"
                      :class="[
                        'px-4 py-2 text-sm rounded-lg border transition-colors capitalize flex-1',
                        pngOptions.theme === style
                          ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                          : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                      ]"
                    >
                      {{ style }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-xs text-lime-400/70 mb-1 block">Show Top</label>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      v-for="n in [3, 5, 10, 'all']"
                      :key="n"
                      @click="pngOptions.limit = n"
                      :class="[
                        'px-3 py-1.5 text-xs rounded-md border transition-colors',
                        pngOptions.limit === n
                          ? 'bg-lime-600 border-lime-500 text-green-950 font-medium'
                          : 'bg-green-900/50 border-lime-500/30 text-lime-300 hover:bg-green-800/50'
                      ]"
                    >
                      {{ n === 'all' ? 'All' : n }}
                    </button>
                  </div>
                </div>

                <div class="space-y-2 pt-2">
                  <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                    <input type="checkbox" v-model="pngOptions.showScores" class="accent-lime-500 w-4 h-4" />
                    <span class="text-lime-200 text-sm">Show Event Scores</span>
                  </label>
                  <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                    <input type="checkbox" v-model="pngOptions.showPower" class="accent-lime-500 w-4 h-4" />
                    <span class="text-lime-200 text-sm">Show Guild Power</span>
                  </label>
                  <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                    <input type="checkbox" v-model="pngOptions.showWatermark" class="accent-lime-500 w-4 h-4" />
                    <span class="text-lime-200 text-sm">Show Watermark</span>
                  </label>
                </div>
              </div>

              <Button
                @click="generatePngPreview"
                variant="outline"
                class="w-full border-lime-500/50 text-lime-300"
              >
                <RefreshCw class="w-4 h-4 mr-2" />
                Update Preview
              </Button>
            </div>

            <!-- Preview -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-lime-300">Preview:</h3>
              <div class="bg-green-950/50 rounded-lg p-2 border border-lime-500/20 overflow-hidden">
                <canvas 
                  ref="previewCanvas" 
                  class="w-full rounded"
                  :class="pngOptions.theme === 'dark' ? 'bg-gray-900' : 'bg-white'"
                ></canvas>
              </div>
            </div>
          </div>

          <!-- Download Button -->
          <div class="flex justify-end gap-2 pt-4 border-t border-lime-500/20">
            <Button
              @click="downloadPng"
              :disabled="isExporting"
              class="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download class="w-4 h-4 mr-2" />
              {{ isExporting ? 'Generating...' : 'Download PNG' }}
            </Button>
          </div>
        </div>

        <!-- CSV Tab -->
        <div v-if="activeTab === 'csv'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Options -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-lime-300">Include Columns:</h3>
              
              <div class="space-y-2">
                <label 
                  v-for="col in csvColumns"
                  :key="col.id"
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer"
                >
                  <input type="checkbox" v-model="col.enabled" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">{{ col.label }}</span>
                </label>
              </div>
            </div>

            <!-- Preview -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-lime-300">Preview:</h3>
              <div class="bg-green-950/50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-auto font-mono text-xs text-lime-200 whitespace-pre">
                {{ csvPreview }}
              </div>
            </div>
          </div>

          <!-- Download Button -->
          <div class="flex justify-end gap-2 pt-4 border-t border-lime-500/20">
            <Button
              @click="downloadCsv"
              class="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download class="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>

        <!-- JSON Tab -->
        <div v-if="activeTab === 'json'" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Options -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-lime-300">Export Options:</h3>
              
              <div class="space-y-2">
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="jsonOptions.rankings" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Rankings Data</span>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="jsonOptions.weights" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Weight Configuration</span>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="jsonOptions.events" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Event Configurations</span>
                </label>
                
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="jsonOptions.rawData" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Raw Guild Data</span>
                </label>
              </div>

              <div class="pt-4 border-t border-lime-500/20">
                <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-lime-500/10 cursor-pointer">
                  <input type="checkbox" v-model="jsonOptions.prettyPrint" class="accent-lime-500 w-4 h-4" />
                  <span class="text-lime-200">Pretty Print (formatted)</span>
                </label>
              </div>
            </div>

            <!-- Preview -->
            <div class="space-y-2">
              <h3 class="text-sm font-semibold text-lime-300">Preview:</h3>
              <div class="bg-green-950/50 rounded-lg p-4 min-h-[200px] max-h-[300px] overflow-auto font-mono text-xs text-lime-200 whitespace-pre">
                {{ jsonPreview }}
              </div>
            </div>
          </div>

          <!-- Download Button -->
          <div class="flex justify-end gap-2 pt-4 border-t border-lime-500/20">
            <Button
              @click="copyToClipboard(jsonOutput, 'json')"
              variant="outline"
              class="border-lime-500/50 text-lime-300"
            >
              <Copy class="w-4 h-4 mr-2" />
              {{ copied === 'json' ? 'Copied!' : 'Copy' }}
            </Button>
            <Button
              @click="downloadJson"
              class="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Download class="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { 
  Share2, X, Copy, Download, RefreshCw,
  MessageSquare, Twitter, Image as ImageIcon, 
  FileSpreadsheet, FileJson
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  rankings: {
    type: Array,
    default: () => []
  },
  events: {
    type: Array,
    default: () => []
  },
  weights: {
    type: Object,
    default: null
  },
  datasetName: {
    type: String,
    default: 'Rankings'
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('discord')
const copied = ref(null)
const isExporting = ref(false)

// Tabs configuration
const tabs = [
  { id: 'discord', label: 'Discord', icon: MessageSquare },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
  { id: 'png', label: 'Image', icon: ImageIcon },
  { id: 'csv', label: 'CSV', icon: FileSpreadsheet },
  { id: 'json', label: 'JSON', icon: FileJson }
]

// Discord options
const discordOptions = ref({
  rankings: true,
  eventScores: false,
  winRecords: false,
  power: false,
  format: 'embed',
  limit: 10
})

// Twitter options
const twitterOptions = ref({
  topThree: true,
  scores: true,
  customMessage: ''
})

// PNG options
const pngOptions = ref({
  theme: 'dark',
  limit: 10,
  showScores: false,
  showPower: true,
  showWatermark: true
})

// Canvas ref
const previewCanvas = ref(null)

// CSV columns
const csvColumns = ref([
  { id: 'rank', label: 'Rank', enabled: true },
  { id: 'guild', label: 'Guild Name', enabled: true },
  { id: 'shorthand', label: 'Shorthand', enabled: true },
  { id: 'score', label: 'Total Score', enabled: true },
  { id: 'power', label: 'Power', enabled: true },
  { id: 'eventScores', label: 'Event Scores', enabled: false },
  { id: 'winRecords', label: 'Win Records', enabled: false }
])

// JSON options
const jsonOptions = ref({
  rankings: true,
  weights: true,
  events: false,
  rawData: false,
  prettyPrint: true
})

// Helper functions
function formatNumber(num) {
  if (num == null) return '-'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toLocaleString()
}

function getRankEmoji(rank) {
  switch (rank) {
    case 1: return '🥇'
    case 2: return '🥈'
    case 3: return '🥉'
    default: return `${rank}.`
  }
}

// Discord output
const discordOutput = computed(() => {
  const rankings = props.rankings
  const limit = discordOptions.value.limit === 'all' ? rankings.length : discordOptions.value.limit
  const topRankings = rankings.slice(0, limit)
  
  let output = ''
  
  if (discordOptions.value.format === 'embed') {
    output += `**${props.datasetName} Rankings**\n\n`
    
    if (discordOptions.value.rankings) {
      topRankings.forEach((r, i) => {
        const rank = i + 1
        const shorthand = r.shorthand || r.guild?.shorthand || '???'
        const name = r.guildName || r.guild?.name || 'Unknown'
        output += `${rank}. **${shorthand}** - ${name} - **${r.weightedScore?.toFixed(1) || '0'}pts**\n`
        
        if (discordOptions.value.power && r.rawData?.power) {
          output += ` Power: **${formatNumber(r.rawData.power)}**\n`
        }
        
        if (discordOptions.value.eventScores && r.results) {
          Object.entries(r.results).forEach(([eventId, result]) => {
            const event = props.events?.find(e => e.id === eventId)
            if (event && result.totalScore) {
              output += ` ${event.name}: **${formatNumber(result.totalScore)}**\n`
            }
          })
        }
        
        if (discordOptions.value.winRecords && r.results) {
          Object.entries(r.results).forEach(([eventId, result]) => {
            const event = props.events?.find(e => e.id === eventId)
            if (event && result.wins != null) {
              output += ` ${event.name}: **${result.wins}W - ${result.losses}L**\n`
            }
          })
        }
      })
    }
  } else if (discordOptions.value.format === 'compact') {
    output += `**${props.datasetName}**\n`
    topRankings.forEach((r, i) => {
      const shorthand = r.shorthand || r.guild?.shorthand || '???'
      const name = r.guildName || r.guild?.name || 'Unknown'
      output += `${i + 1}. **${shorthand}** - ${name} - **${r.weightedScore?.toFixed(1)}pts**\n`
    })
  } else if (discordOptions.value.format === 'table') {
    output += '```\n'
    output += `${props.datasetName}\n`
    output += '─'.repeat(40) + '\n'
    output += 'Rank  Guild                Score\n'
    output += '─'.repeat(40) + '\n'
    topRankings.forEach((r, i) => {
      const name = (r.guildName || r.guild?.name || '').substring(0, 18).padEnd(18)
      const score = (r.weightedScore?.toFixed(1) || '0').padStart(8)
      output += `${String(i + 1).padStart(3)}   ${name} ${score}\n`
    })
    output += '```'
  }
  
  return output.trim()
})

// Twitter output
const twitterOutput = computed(() => {
  let output = ''
  
  if (twitterOptions.value.customMessage) {
    output += twitterOptions.value.customMessage + '\n\n'
  }
  
  output += `🏆 ${props.datasetName}\n\n`
  
  if (twitterOptions.value.topThree) {
    const top3 = props.rankings.slice(0, 3)
    top3.forEach((r, i) => {
      output += `${getRankEmoji(i + 1)} ${r.guildName || r.guild?.name}`
      if (twitterOptions.value.scores) {
        output += ` — ${r.weightedScore?.toFixed(1)}pts`
      }
      output += '\n'
    })
  }
  
  return output.trim()
})

// CSV output
const csvOutput = computed(() => {
  const enabledCols = csvColumns.value.filter(c => c.enabled)
  const headers = enabledCols.map(c => c.label)
  
  const rows = props.rankings.map((r, i) => {
    return enabledCols.map(col => {
      switch (col.id) {
        case 'rank': return i + 1
        case 'guild': return r.guildName || r.guild?.name || ''
        case 'shorthand': return r.shorthand || ''
        case 'score': return r.weightedScore?.toFixed(2) || 0
        case 'power': return r.rawData?.power || 0
        case 'eventScores':
          return Object.entries(r.results || {})
            .map(([id, res]) => `${id}:${res.totalScore || 0}`)
            .join(';')
        case 'winRecords':
          return Object.entries(r.results || {})
            .filter(([_, res]) => res.wins != null)
            .map(([id, res]) => `${id}:${res.wins}W-${res.losses}L`)
            .join(';')
        default: return ''
      }
    })
  })
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
})

const csvPreview = computed(() => {
  const lines = csvOutput.value.split('\n')
  if (lines.length > 10) {
    return lines.slice(0, 10).join('\n') + '\n...'
  }
  return csvOutput.value
})

// JSON output
const jsonOutput = computed(() => {
  const data = {}
  
  if (jsonOptions.value.rankings) {
    data.rankings = props.rankings.map((r, i) => ({
      rank: i + 1,
      guildName: r.guildName || r.guild?.name,
      shorthand: r.shorthand,
      weightedScore: r.weightedScore,
      breakdown: r.breakdown,
      results: r.results
    }))
  }
  
  if (jsonOptions.value.weights) {
    data.weights = props.weights
  }
  
  if (jsonOptions.value.events) {
    data.events = props.events
  }
  
  if (jsonOptions.value.rawData) {
    data.rawData = props.rankings.map(r => ({
      guild: r.guild,
      rawData: r.rawData
    }))
  }
  
  return jsonOptions.value.prettyPrint 
    ? JSON.stringify(data, null, 2)
    : JSON.stringify(data)
})

const jsonPreview = computed(() => {
  const output = jsonOutput.value
  if (output.length > 2000) {
    return output.substring(0, 2000) + '\n...'
  }
  return output
})

// Actions
function close() {
  emit('close')
}

async function copyToClipboard(text, type = 'discord') {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = type
    setTimeout(() => {
      copied.value = null
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

function shareToTwitter() {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(twitterOutput.value)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
}

// Generate PNG preview on canvas
function generatePngPreview() {
  const canvas = previewCanvas.value
  if (!canvas) return
  
  const rankings = props.rankings
  const limit = pngOptions.value.limit === 'all' ? rankings.length : pngOptions.value.limit
  const topRankings = rankings.slice(0, limit)
  const isDark = pngOptions.value.theme === 'dark'
  
  // Calculate dimensions
  const padding = 40
  const rowHeight = pngOptions.value.showScores ? 60 : 45
  const headerHeight = 80
  const footerHeight = pngOptions.value.showWatermark ? 40 : 20
  const width = 600
  const height = headerHeight + (topRankings.length * rowHeight) + footerHeight + padding
  
  // Set canvas size (2x for retina)
  const scale = 2
  canvas.width = width * scale
  canvas.height = height * scale
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  
  // Background
  if (isDark) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#064e3b')
    gradient.addColorStop(1, '#022c22')
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = '#ffffff'
  }
  ctx.fillRect(0, 0, width, height)
  
  // Header
  ctx.fillStyle = isDark ? '#a3e635' : '#16a34a'
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
  ctx.fillText(props.datasetName, padding, padding + 24)
  
  ctx.fillStyle = isDark ? 'rgba(163, 230, 53, 0.6)' : '#6b7280'
  ctx.font = '14px system-ui, -apple-system, sans-serif'
  ctx.fillText(`Top ${topRankings.length} Rankings`, padding, padding + 48)
  
  // Rankings
  topRankings.forEach((r, i) => {
    const y = headerHeight + (i * rowHeight) + 30
    const rank = i + 1
    const shorthand = r.shorthand || r.guild?.shorthand || '???'
    const name = r.guildName || r.guild?.name || 'Unknown'
    const score = r.weightedScore?.toFixed(1) || '0'
    
    // Rank badge background
    let badgeColor
    if (rank === 1) badgeColor = isDark ? '#fbbf24' : '#f59e0b'
    else if (rank === 2) badgeColor = isDark ? '#9ca3af' : '#6b7280'
    else if (rank === 3) badgeColor = isDark ? '#f97316' : '#ea580c'
    else badgeColor = isDark ? 'rgba(163, 230, 53, 0.3)' : '#e5e7eb'
    
    // Rank circle
    ctx.beginPath()
    ctx.arc(padding + 20, y, 16, 0, Math.PI * 2)
    ctx.fillStyle = badgeColor
    ctx.fill()
    
    // Rank number
    ctx.fillStyle = rank <= 3 ? '#000' : (isDark ? '#a3e635' : '#16a34a')
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(rank.toString(), padding + 20, y + 5)
    ctx.textAlign = 'left'
    
    // Guild shorthand
    ctx.fillStyle = isDark ? '#ffffff' : '#1f2937'
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.fillText(shorthand, padding + 50, y)
    
    // Guild name
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : '#6b7280'
    ctx.font = '14px system-ui, -apple-system, sans-serif'
    const nameWidth = ctx.measureText(shorthand).width
    ctx.fillText(`- ${name}`, padding + 55 + nameWidth, y)
    
    // Score
    ctx.fillStyle = isDark ? '#a3e635' : '#16a34a'
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${score} pts`, width - padding, y)
    ctx.textAlign = 'left'
    
    // Power (if enabled)
    if (pngOptions.value.showPower && r.rawData?.power) {
      ctx.fillStyle = isDark ? 'rgba(163, 230, 53, 0.6)' : '#9ca3af'
      ctx.font = '12px system-ui, -apple-system, sans-serif'
      ctx.fillText(`⚡ ${formatNumber(r.rawData.power)}`, padding + 50, y + 18)
    }
    
    // Event scores (if enabled)
    if (pngOptions.value.showScores && r.results) {
      let scoreX = pngOptions.value.showPower ? padding + 150 : padding + 50
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : '#9ca3af'
      ctx.font = '11px system-ui, -apple-system, sans-serif'
      
      Object.entries(r.results).forEach(([eventId, result]) => {
        if (result.totalScore) {
          const event = props.events?.find(e => e.id === eventId)
          const label = event?.name?.substring(0, 8) || eventId.substring(0, 8)
          ctx.fillText(`${label}: ${formatNumber(result.totalScore)}`, scoreX, y + 18)
          scoreX += 120
        }
      })
    }
  })
  
  // Watermark
  if (pngOptions.value.showWatermark) {
    ctx.fillStyle = isDark ? 'rgba(163, 230, 53, 0.4)' : '#d1d5db'
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Generated by TopHeroes Guild Rankings', width / 2, height - 15)
    ctx.textAlign = 'left'
  }
}

// Download the PNG
function downloadPng() {
  generatePngPreview()
  
  const canvas = previewCanvas.value
  if (!canvas) return
  
  isExporting.value = true
  
  setTimeout(() => {
    const link = document.createElement('a')
    link.download = `${props.datasetName.replace(/\s+/g, '_')}_rankings.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    isExporting.value = false
  }, 100)
}

// Auto-generate preview when tab changes to PNG
watch([activeTab, () => props.isOpen], ([tab, isOpen]) => {
  if (tab === 'png' && isOpen) {
    nextTick(() => {
      generatePngPreview()
    })
  }
})

function downloadCsv() {
  const blob = new Blob([csvOutput.value], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.datasetName.replace(/\s+/g, '_')}_rankings.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function downloadJson() {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.datasetName.replace(/\s+/g, '_')}_rankings.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>