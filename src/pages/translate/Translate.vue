<template>
  <div class="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex flex-col">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-30">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto w-full flex-grow flex flex-col p-2">
      <!-- Main Card -->
      <div
        class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-visible flex-grow flex flex-col">
        <!-- Gradient Header -->
        <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-4 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <!-- Logo and Title -->
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
                  </path>
                </svg>
              </div>
              <div class="text-left">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  AI Translator
                </h1>
                <p class="text-purple-100 text-xs opacity-90">
                  Built by Mason, Powered by OpenAI
                </p>
              </div>
            </div>

            <!-- Settings Button & Popover Container -->
            <div class="relative">
              <!-- Settings Icon Button -->
              <button ref="settingsButton" @click="settingsOpen = !settingsOpen"
                class="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 text-white backdrop-blur-sm group">
                <svg class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                  </path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>

              <!-- Settings Popover -->
              <div ref="settingsPanel" v-show="settingsOpen"
                class="absolute top-full right-0 mt-2 z-50 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-6 w-96 transition-all duration-300 animate-fade-in">

                <!-- API Key Input -->
                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-white/90">
                    OpenAI API Key
                  </label>
                  <div class="relative">
                    <input v-model="apiKey" :type="showApiKey ? 'text' : 'password'"
                      placeholder="Enter your OpenAI API key"
                      class="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" />
                    <button @click.stop="showApiKey = !showApiKey"
                      class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors duration-200">
                      <svg v-if="showApiKey" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                        </path>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
                        </path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="block text-sm font-semibold text-white/90">Default Target Language</label>
                  <select v-model="selectedLanguage"
                    class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm">
                    <option v-for="lang in languages" :key="lang.code" :value="lang.code"
                      class="bg-slate-800 text-white">{{ lang.name }}</option>
                  </select>
                </div>
                <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <div class="space-y-1"><span class="text-sm font-semibold text-white/90">Auto-copy translations</span>
                    <p class="text-xs text-white/60">Automatically copy to clipboard</p>
                  </div>
                  <button @click="autoCopy = !autoCopy"
                    :class="autoCopy ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-white/20'"
                    class="relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300">
                    <span :class="autoCopy ? 'translate-x-6' : 'translate-x-1'"
                      class="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300" />
                  </button>
                </div>
                <div class="flex justify-end">
                  <button @click="settingsOpen = false"
                    class="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Translation Interface -->
        <div class="p-4 flex-grow flex flex-col border-t border-white/10">
          <div class="grid grid-cols-2 gap-4 flex-grow">

            <!-- Left Side (Source Language) -->
            <div class="space-y-2 flex flex-col">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <h4 class="font-bold text-white">{{ leftLanguageName }}</h4>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{ leftText.length }} chars</span>
                  <select v-model="fromLanguage"
                    class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                    <option v-for="lang in languages" :key="lang.code" :value="lang.code"
                      class="bg-slate-800 text-white">{{ lang.name }}</option>
                  </select>
                </div>
              </div>
              <div class="relative group flex-grow">
                <textarea v-model="leftText" @keydown.enter.exact.prevent="translate"
                  placeholder="Type here..."
                  class="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>
                <button @click="translate"
                  :disabled="!canTranslate"
                  class="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                  <svg v-if="isTranslating" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6">
                    </path>
                  </svg>
                  <span>Translate</span>
                </button>
              </div>
              <div class="flex justify-end">
                <button v-if="leftText" @click="copyToClipboard(leftText)"
                  class="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <!-- Right Side (Target Language) -->
            <div class="space-y-2 flex flex-col">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <h4 class="font-bold text-white">{{ rightLanguageName }}</h4>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{ rightText.length }} chars</span>
                  <select v-model="selectedLanguage"
                    class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                    <option v-for="lang in languages" :key="lang.code" :value="lang.code"
                      class="bg-slate-800 text-white">{{ lang.name }}</option>
                  </select>
                </div>
              </div>
              <div class="relative group flex-grow">
                <textarea v-model="rightText" readonly
                  :placeholder="`Translation will appear here...`"
                  class="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>
              </div>
              <div class="flex justify-end">
                <button v-if="rightText" @click="copyToClipboard(rightText)"
                  class="text-xs text-purple-400 hover:text-purple-300 transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Retranslation Section -->
          <div v-if="retranslatedText" class="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm animate-fade-in">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-amber-500/20 rounded-lg">
                  <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-amber-300">Round-trip Translation</h3>
                  <p class="text-xs text-amber-400/80">Translation accuracy check - translated back to {{ leftLanguageName }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-amber-400/80 bg-amber-500/10 px-2 py-1 rounded-full">{{ retranslatedText.length }} chars</span>
                <button @click="copyToClipboard(retranslatedText)"
                  class="text-xs text-amber-400 hover:text-amber-300 transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-amber-500/10">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <div class="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
              <p class="text-amber-100 text-sm leading-relaxed">{{ retranslatedText }}</p>
            </div>
            <div class="mt-3 flex items-center space-x-2">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span class="text-xs text-amber-400/80">Accuracy indicator:</span>
              </div>
              <div class="flex-1 bg-amber-500/10 rounded-full h-2 overflow-hidden">
                <div :class="accuracyClass" class="h-full transition-all duration-500"></div>
              </div>
              <span class="text-xs text-amber-400/80">{{ accuracyText }}</span>
            </div>
          </div>

          <!-- Message Display -->
          <div v-if="message.text"
            :class="message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-green-500/10 border-green-500/30 text-green-300'"
            class="mt-3 p-3 border rounded-xl backdrop-blur-sm animate-fade-in text-xs">
            <div class="flex items-center space-x-2">
              <svg v-if="message.type === 'error'" class="w-4 h-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="font-medium">{{ message.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const settingsOpen = ref(false)
const showApiKey = ref(false)
const apiKey = ref('')
const selectedLanguage = ref('es')
const fromLanguage = ref('en')
const autoCopy = ref(false)
const leftText = ref('')
const rightText = ref('')
const retranslatedText = ref('')
const isTranslating = ref(false)
const message = ref({ type: '', text: '' })

const settingsButton = ref(null)
const settingsPanel = ref(null)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' }
]

const canTranslate = computed(() =>
  leftText.value.trim() && apiKey.value.trim() && !isTranslating.value
)

const leftLanguageName = computed(() =>
  languages.find(l => l.code === fromLanguage.value)?.name || fromLanguage.value
)

const rightLanguageName = computed(() =>
  languages.find(l => l.code === selectedLanguage.value)?.name || selectedLanguage.value
)

const accuracyClass = computed(() => {
  if (!retranslatedText.value || !leftText.value) return 'bg-gray-500/50 w-0'
  
  const similarity = calculateSimilarity(leftText.value, retranslatedText.value)
  
  if (similarity > 0.8) return 'bg-green-500 w-full'
  if (similarity > 0.6) return 'bg-yellow-500 w-3/4'
  if (similarity > 0.4) return 'bg-orange-500 w-1/2'
  return 'bg-red-500 w-1/4'
})

const accuracyText = computed(() => {
  if (!retranslatedText.value || !leftText.value) return 'N/A'
  
  const similarity = calculateSimilarity(leftText.value, retranslatedText.value)
  
  if (similarity > 0.8) return 'Excellent'
  if (similarity > 0.6) return 'Good'
  if (similarity > 0.4) return 'Fair'
  return 'Poor'
})

const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

const handleClickOutside = (event) => {
  if (
    settingsOpen.value &&
    settingsPanel.value &&
    !settingsPanel.value.contains(event.target) &&
    settingsButton.value &&
    !settingsButton.value.contains(event.target)
  ) {
    settingsOpen.value = false
  }
}

const showMessage = (type, text, duration = 3000) => {
  message.value = { type, text }
  setTimeout(() => {
    message.value = { type: '', text: '' }
  }, duration)
}

const translate = async () => {
  if (!leftText.value.trim() || !apiKey.value.trim()) return

  isTranslating.value = true
  message.value = { type: '', text: '' }
  retranslatedText.value = ''

  try {
    const response = await fetch('/translate/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-openai-key': apiKey.value
      },
      body: JSON.stringify({
        content: leftText.value,
        fromLang: fromLanguage.value,
        targetLang: selectedLanguage.value
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData?.error || `HTTP error! status: ${response.status}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    rightText.value = data.translated || ''
    retranslatedText.value = data.retranslated || ''

    if (autoCopy.value && rightText.value) {
      await copyToClipboard(rightText.value)
    }

    showMessage('success', 'Translation completed successfully!')
  } catch (error) {
    console.error('Translation error:', error)
    showMessage('error', `Translation failed: ${error.message}`)
  } finally {
    isTranslating.value = false
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showMessage('success', 'Copied to clipboard!')
  } catch (error) {
    console.error('Copy failed:', error)
    showMessage('error', 'Failed to copy to clipboard')
  }
}

// Add event listener for clicking outside settings
document.addEventListener('click', handleClickOutside)

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Load settings from localStorage on component mount
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('translator-settings')
    if (saved) {
      const settings = JSON.parse(saved)
      apiKey.value = settings.apiKey || ''
      selectedLanguage.value = settings.selectedLanguage || 'es'
      fromLanguage.value = settings.fromLanguage || 'en'
      autoCopy.value = settings.autoCopy || false
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

// Save settings to localStorage
const saveSettings = () => {
  try {
    const settings = {
      apiKey: apiKey.value,
      selectedLanguage: selectedLanguage.value,
      fromLanguage: fromLanguage.value,
      autoCopy: autoCopy.value
    }
    localStorage.setItem('translator-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// Load settings on component mount
loadSettings()

// Watch for settings changes and persist them
watch([apiKey, selectedLanguage, fromLanguage, autoCopy], () => {
  saveSettings()
}, { deep: true })
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>