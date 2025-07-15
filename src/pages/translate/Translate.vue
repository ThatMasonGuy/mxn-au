<template>
  <div class="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex justify-center p-4">
    <div class="fixed inset-0 opacity-30">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
    </div>

    <div class="flex flex-col flex-grow min-h-0 w-full xl:max-w-[80%] xl:py-12">
      <div class="relative z-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-grow min-h-0">

        <div class="lg:col-span-2 flex flex-col z-20">
          <div
            class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-visible flex-grow flex flex-col">
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
                    <h1
                      class="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                      AI Translator
                    </h1>
                    <p class="text-purple-100 text-xs opacity-90">
                      Built by Mason, Powered by OpenAI
                    </p>
                  </div>
                </div>

                <!-- Settings Button & Popover Container -->
                <div class="relative">
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
                    class="absolute top-full right-0 mt-2 z-50 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-6 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300 animate-fade-in">
                    <div class="space-y-6 p-4">

                      <!-- API Key Input Group -->
                      <div class="space-y-2">
                        <label class="block text-sm font-semibold text-white/90">
                          OpenAI API Key
                        </label>
                        <div
                          class="flex items-center bg-white/5 border border-white/15 rounded-xl focus-within:ring-2 focus-within:ring-violet-500">
                          <input v-model="apiKey" :type="showApiKey ? 'text' : 'password'"
                            placeholder="Enter your OpenAI API key"
                            class="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 focus:outline-none rounded-xl" />
                          <button @click.stop="showApiKey = !showApiKey"
                            class="p-2 text-white/70 hover:text-white transition">
                            <svg v-if="showApiKey" class="w-5 h-5" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .527-1.664 1.373-3.16 2.458-4.425L13.875 18.825z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.125 5.175A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7-.527 1.664-1.373-3.16-2.458 4.425L10.125 5.175z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                            </svg>
                          </button>
                        </div>
                        <p class="text-xs mt-1 text-violet-300 font-semibold">
                          Optional:
                          <span class="text-white/60 font-normal">
                            This app may be disabled at any time if my sponsored API key runs out or I need to chill on
                            costs.<br>
                            To keep using it with zero interruptions, just add your own OpenAI API key above.
                          </span>
                        </p>
                      </div>

                      <!-- Auto-copy Toggle Switch Card -->
                      <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div>
                          <div class="text-sm font-semibold text-white/90">Auto-copy translations</div>
                          <div class="text-xs text-white/60">Automatically copy to clipboard</div>
                        </div>
                        <button @click="autoCopy = !autoCopy"
                          :class="autoCopy ? 'bg-gradient-to-r from-violet-500 to-purple-600' : 'bg-white/20'"
                          class="relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300">
                          <span :class="autoCopy ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition" />
                        </button>
                      </div>

                      <!-- Buy Me a Coffee Button -->
                      <div class="flex flex-col items-center">
                        <a href="https://buymeacoffee.com/thatmasonguy" target="_blank" rel="noopener"
                          class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 rounded-xl shadow text-base font-bold text-gray-900 transition-all duration-300">
                          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              d="M6 2a1 1 0 00-1 1v2a7 7 0 107 7h-2a1 1 0 000 2h2a9 9 0 11-9-9V3a1 1 0 011-1zm3 14a5 5 0 01-5-5h2a3 3 0 006 0h2a5 5 0 01-5 5z" />
                          </svg>
                          Buy me a coffee
                        </a>
                        <span class="block text-xs text-white/40 text-center mt-2 mb-0.5">
                          Like this app? If you want to support it or just say thanks, you can buy me a coffee!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Translation Interface -->
            <div class="pt-4 px-4 sm:p-6 flex-grow flex flex-col border-t border-white/10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-grow">

                <!-- Left Side (Source Language) -->
                <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                      <div class="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      <h4 class="font-bold text-white">{{ leftLanguageName }}</h4>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{ leftText.length }}
                        chars</span>
                      <select v-model="fromLanguage"
                        class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                        <option v-for="lang in languages" :key="lang.code" :value="lang.code"
                          class="bg-slate-800 text-white">{{ lang.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="relative group flex-grow">
                    <textarea v-model="leftText" @keydown.enter.exact.prevent="translate('left')"
                      placeholder="Type here..."
                      class="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

                    <!-- Clear Text Button -->
                    <button v-if="leftText" @click="leftText = ''"
                      class="absolute bottom-3 left-3 z-10 text-white/40 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition-all duration-300"
                      aria-label="Clear text">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <!-- Translate Button -->
                    <button @click="translate('left')" :disabled="!canTranslateLeft"
                      class="absolute bottom-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                      <span>Translate</span>
                      <template v-if="isTranslating">
                        <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                          </path>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </template>
                    </button>
                  </div>

                  <div class="flex justify-end h-8 items-center">
                    <button @click="copyToClipboard(leftText)" :disabled="!leftText"
                      :class="['text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg', leftText ? 'text-blue-400 hover:text-blue-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed']">
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
                <div class="space-y-2 flex flex-col min-h-[300px] lg:min-h-0">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                      <div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <h4 class="font-bold text-white">{{ rightLanguageName }}</h4>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">{{ rightText.length }}
                        chars</span>
                      <select v-model="selectedLanguage"
                        class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-xs">
                        <option v-for="lang in languages" :key="lang.code" :value="lang.code"
                          class="bg-slate-800 text-white">{{
                            lang.name }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="relative group flex-grow">
                    <textarea v-model="rightText" @keydown.enter.exact.prevent="translate('right')"
                      placeholder="Translation appears here..."
                      class="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

                    <!-- Clear Text Button -->
                    <button v-if="rightText" @click="rightText = ''"
                      class="absolute bottom-3 left-3 z-10 text-white/40 hover:text-red-500 hover:bg-white/10 p-1.5 rounded-full transition-all duration-300"
                      aria-label="Clear text">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <!-- Translate Button -->
                    <button @click="translate('right')" :disabled="!canTranslateRight"
                      class="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl text-sm">
                      <template v-if="isTranslating">
                        <svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                          </path>
                        </svg>
                      </template>
                      <template v-else>
                        <svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </template>
                      <span>Translate</span>
                    </button>
                  </div>

                  <div class="flex justify-end h-8 items-center">
                    <button @click="copyToClipboard(rightText)" :disabled="!rightText"
                      :class="['text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg', rightText ? 'text-purple-400 hover:text-purple-300 hover:bg-white/5' : 'text-white/30 cursor-not-allowed']">
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
              <div v-if="retranslatedText"
                class="mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl backdrop-blur-sm animate-fade-in">
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
                      <p class="text-xs text-amber-400/80">Translated back to {{
                        retranslationTargetLanguageName }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-amber-400/80 bg-amber-500/10 px-2 py-1 rounded-full">{{
                      retranslatedText.length }} chars</span>
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
                  <div class="text-amber-100 text-sm leading-relaxed" v-html="retranslationWithDiff"></div>
                </div>
                <div class="mt-3 flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <div class="w-2 h-2 bg-amber-400 rounded-full"></div>
                    <span class="text-xs text-amber-400/80">Accuracy indicator:</span>
                  </div>
                  <div class="flex-1 bg-amber-500/10 rounded-full h-2 overflow-hidden">
                    <div :style="{ width: accuracyPercentage + '%' }" :class="accuracyBarClass"
                      class="h-full transition-all duration-500"></div>
                  </div>
                  <span class="text-xs text-amber-400/80 font-semibold">{{ accuracyText }} ({{ accuracyPercentage
                    }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Column -->
        <div class="lg:col-span-1 flex flex-col flex-grow min-h-0 space-y-4">
          <h3 class="text-sm font-medium text-white/80 uppercase tracking-wide">Usage</h3>

          <div class="relative group">

            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500">
            </div>
            <div
              class="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:bg-white/15">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="absolute inset-0 bg-cyan-400 rounded-2xl blur opacity-40"></div>
                    <div class="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-4 rounded-2xl">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-cyan-300 uppercase tracking-wide">Translations</p>
                    <p class="text-3xl font-bold text-white mt-1">{{ formattedTranslations }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div
                    class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                    <div class="w-6 h-6 rounded-full bg-cyan-400 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500">
            </div>
            <div
              class="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:bg-white/15">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">

                    <div class="absolute inset-0 bg-emerald-400 rounded-2xl blur opacity-40"></div>
                    <div class="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-2xl">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h5.25m-5.25 3h5.25M12 3h6a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h6zm3 3H6v12h12V6z">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-emerald-300 uppercase tracking-wide">Words</p>
                    <p class="text-3xl font-bold text-white mt-1">{{ formattedWords }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="flex flex-col items-end space-y-1">
                    <div class="w-8 h-1 bg-emerald-400 rounded-full"></div>
                    <div class="w-6 h-1 bg-emerald-400/70 rounded-full"></div>
                    <div class="w-4 h-1 bg-emerald-400/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500">
            </div>
            <div
              class="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:bg-white/15">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">

                    <div class="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-40"></div>
                    <div class="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-purple-300 uppercase tracking-wide">API Cost</p>
                    <p class="text-3xl font-bold text-white mt-1">{{ formattedApiCost }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div
                    class="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <div
                      class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 animate-ping">
                    </div>
                    <div class="relative w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center space-x-2 mt-6 opacity-60">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-xs text-white/60 font-medium">Live Statistics</span>
          </div>

          <!-- History -->
          <div class="hidden lg:flex flex-col flex-1 min-h-0 space-y-3">
            <div class="flex items-center justify-between px-1">
              <h3 class="text-sm font-medium text-white/80 uppercase tracking-wide">History</h3>
              <button v-if="recentTranslations.length" @click="clearHistory"
                class="text-xs text-red-400/70 hover:text-red-400 hover:bg-white/10 px-2 py-1 rounded-lg transition-all">
                Clear
              </button>
            </div>

            <div class="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl
              flex-1 min-h-0 overflow-hidden">

              <div class="h-full overflow-y-auto p-2 space-y-2 custom-scrollbar">
                <div v-if="!recentTranslations.length"
                  class="flex flex-col items-center justify-center h-full space-y-2 text-white/40 text-sm">
                  <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>No recent translations.</span>
                </div>

                <!-- history items -->
                <div v-for="item in recentTranslations" :key="item.id" class="group relative bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10
               transition-all duration-300 rounded-xl p-3 animate-fade-in">

                  <!-- delete button -->
                  <button @click.stop="deleteHistoryItem(item.id)" aria-label="Delete history item" class="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-black/20 text-white/50
                 hover:text-red-500 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div class="space-y-2">
                    <div class="flex justify-between items-center text-xs">
                      <span
                        class="font-bold text-white/90 bg-black/20 px-2 py-1 rounded-md flex items-center space-x-1">
                        <i :class="flagClass(item.fromLangName)" class="w-4 h-4 rounded-sm"></i>
                        <span>{{ item.fromLangName }}</span>
                        <span>→</span>
                        <i :class="flagClass(item.toLangName)" class="w-4 h-4 rounded-sm"></i>
                        <span>{{ item.toLangName }}</span>
                      </span>
                      <span class="text-white/50">{{ formatTimeAgo(item.timestamp) }}</span>
                    </div>

                    <div class="space-y-2">
                      <!-- original -->
                      <div class="relative group/text">
                        <p class="text-white/80 text-sm bg-black/20 p-2 rounded-lg pr-8">{{ item.originalText }}</p>
                        <button @click="copyToClipboard(item.originalText)" aria-label="Copy original text" class="absolute top-1/2 right-1 -translate-y-1/2 p-1 text-white/40 hover:text-white
                     opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <!-- translation -->
                      <div class="relative group/text">
                        <p class="text-white text-sm bg-black/20 p-2 rounded-lg pr-8">{{ item.translatedText }}</p>
                        <button @click="copyToClipboard(item.translatedText)" aria-label="Copy translated text" class="absolute top-1/2 right-1 -translate-y-1/2 p-1 text-white/40 hover:text-white
                     opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
import { useFlagIcon } from '@/utils/useFlagIcon'

// --- State ---
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
const recentTranslations = ref([])

const appStats = ref(null)
const unsubscribeStats = ref(null)

const lastOriginalText = ref('')
const lastTranslationDirection = ref('left')

// --- Template Refs ---
const settingsButton = ref(null)
const settingsPanel = ref(null)

// --- Data ---
const languages = [
  { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ru', name: 'Russian' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' }, { code: 'nl', name: 'Dutch' }, { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' }, { code: 'da', name: 'Danish' }, { code: 'fi', 'name': 'Finnish' },
  { code: 'pl', name: 'Polish' }, { code: 'cs', name: 'Czech' }, { code: 'hu', name: 'Hungarian' },
  { code: 'th', name: 'Thai' }, { code: 'vi', name: 'Vietnamese' }
]

const langFlagMap = {
  English: 'gb',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Italian: 'it',
  Portuguese: 'pt',
  Japanese: 'jp',
  Korean: 'kr',
  'Chinese (Simplified)': 'cn',
  Russian: 'ru',
  Arabic: 'sa',
  Hindi: 'in',
  Turkish: 'tr',
  Dutch: 'nl',
  Swedish: 'se',
  Norwegian: 'no',
  Danish: 'dk',
  Finnish: 'fi',
  Polish: 'pl',
  Czech: 'cz',
  Hungarian: 'hu',
  Thai: 'th',
  Vietnamese: 'vn'
}

const flagClass = (langName) => {
  if (!langName) return ''
  const code = langFlagMap[langName]
  if (code) return `fi fi-${code}`

  return useFlagIcon(langName)
}

// --- Computed Properties ---

const hasApiKey = computed(() => apiKey.value.trim() !== '')
const canTranslateLeft = computed(() => leftText.value.trim() && !isTranslating.value)
const canTranslateRight = computed(() => rightText.value.trim() && !isTranslating.value)

const leftLanguageName = computed(() => languages.find(l => l.code === fromLanguage.value)?.name || fromLanguage.value)
const rightLanguageName = computed(() => languages.find(l => l.code === selectedLanguage.value)?.name || selectedLanguage.value)

const retranslationTargetLanguageName = computed(() => {
  if (lastTranslationDirection.value === 'left') {
    return leftLanguageName.value;
  } else {
    return rightLanguageName.value;
  }
});

const formattedTranslations = computed(() => {
  return appStats.value?.totalTranslations?.toLocaleString() || '0';
});

const formattedWords = computed(() => {
  return appStats.value?.totalWords?.toLocaleString() || '0';
});

const formattedApiCost = computed(() => {
  if (!appStats.value) return '$0.00';

  const GPT4O_INPUT_COST_PER_MILLION = 2.5;
  const GPT4O_OUTPUT_COST_PER_MILLION = 10;

  const promptTokens = appStats.value.totalPromptTokens || 0;
  const completionTokens = appStats.value.totalCompletionTokens || 0;

  const inputCost = (promptTokens / 1000000) * GPT4O_INPUT_COST_PER_MILLION;
  const outputCost = (completionTokens / 1000000) * GPT4O_OUTPUT_COST_PER_MILLION;

  const totalCost = (inputCost + outputCost);

  return `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`;
});


// --- Accuracy Calculation ---
const similarity = computed(() => {
  if (!retranslatedText.value || !lastOriginalText.value) return 0
  return calculateSimilarity(lastOriginalText.value, retranslatedText.value)
})

const accuracyPercentage = computed(() => Math.round(similarity.value * 100))

const accuracyBarClass = computed(() => {
  if (similarity.value > 0.8) return 'bg-green-500'
  if (similarity.value > 0.6) return 'bg-yellow-500'
  if (similarity.value > 0.4) return 'bg-orange-500'
  return 'bg-red-500'
})

const accuracyText = computed(() => {
  if (!lastOriginalText.value) return 'N/A'
  if (similarity.value > 0.95) return 'Excellent'
  if (similarity.value > 0.8) return 'Good'
  if (similarity.value > 0.6) return 'Fair'
  return 'Poor'
})

// --- Text Diffing ---
const retranslationWithDiff = computed(() => {
  return highlightDifferences(lastOriginalText.value, retranslatedText.value)
})

// --- Methods ---
const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()
  const longer = s1.length > s2.length ? s1 : s2
  const shorter = s1.length > s2.length ? s2 : s1
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

function highlightDifferences(originalText, modifiedText) {
  if (!originalText || !modifiedText) return modifiedText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const splitRegex = /(\s+)/;
  const originalWords = originalText.split(splitRegex);
  const modifiedWords = modifiedText.split(splitRegex);

  const lcsMatrix = Array(originalWords.length + 1).fill(null).map(() => Array(modifiedWords.length + 1).fill(0));
  for (let i = 1; i <= originalWords.length; i++) {
    for (let j = 1; j <= modifiedWords.length; j++) {
      if (originalWords[i - 1] === modifiedWords[j - 1]) {
        lcsMatrix[i][j] = 1 + lcsMatrix[i - 1][j - 1];
      } else {
        lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]);
      }
    }
  }

  let i = originalWords.length;
  let j = modifiedWords.length;
  const result = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalWords[i - 1] === modifiedWords[j - 1]) {
      result.unshift({ text: modifiedWords[j - 1], type: 'common' });
      i--; j--;
    } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) {
      result.unshift({ text: modifiedWords[j - 1], type: 'added' });
      j--;
    } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) {
      i--;
    } else {
      break;
    }
  }

  return result.map(part => {
    const cleanText = part.text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (part.type === 'added' && part.text.trim() !== '') {
      return `<u class="decoration-red-400 decoration-2 no-underline text-amber-50">${cleanText}</u>`;
    }
    return cleanText;
  }).join('');
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
  toast({
    title: type === 'error' ? 'Error' : 'Success',
    description: text,
    variant: type === 'error' ? 'destructive' : 'default',
    duration: duration,
  })
}

// --- Core API Logic ---
const translate = async (fromSide = 'left') => {
  const isLeftToRight = fromSide === 'left';
  const inputText = isLeftToRight ? leftText.value : rightText.value;
  const fromLang = isLeftToRight ? fromLanguage.value : selectedLanguage.value;
  const toLang = isLeftToRight ? selectedLanguage.value : fromLanguage.value;

  const finalKey = apiKey.value?.trim() || import.meta.env.VITE_OPENAI_API_KEY_TRANSLATION_GENERIC;

  if (!inputText.trim() || !finalKey) return;

  isTranslating.value = true;
  lastOriginalText.value = inputText;
  lastTranslationDirection.value = fromSide;

  try {
    const response = await fetch('/translate/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-openai-key': finalKey
      },
      body: JSON.stringify({
        content: inputText,
        fromLang,
        targetLang: toLang,
        retranslate: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const outputText = data.outputText || '';

    if (isLeftToRight) {
      rightText.value = outputText;
    } else {
      leftText.value = outputText;
    }
    retranslatedText.value = data.retranslated || '';

    addTranslationToHistory({
      fromLangCode: fromLang,
      toLangCode: toLang,
      originalText: inputText,
      translatedText: outputText
    });

    if (autoCopy.value && outputText) {
      await copyToClipboard(outputText);
    }

    showMessage('success', 'Translation completed successfully!');
  } catch (error) {
    console.error('Translation error:', error);
    showMessage('error', `Translation failed: ${error.message}`);
    retranslatedText.value = '';
    lastOriginalText.value = '';
  } finally {
    isTranslating.value = false;
  }
}

const copyToClipboard = async (text) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text)
    showMessage('success', 'Copied to clipboard!')
  } catch (error) {
    console.error('Copy failed:', error)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('success', 'Copied to clipboard!');
    } catch (err) {
      showMessage('error', 'Failed to copy to clipboard');
    }
  }
}

// --- LocalStorage Persistence (Settings) ---
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
    showMessage('error', 'Could not load saved settings.')
  }
}

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
    showMessage('error', 'Could not save settings.')
  }
}

// --- LocalStorage Persistence (History) ---
const MAX_HISTORY_SIZE = 20;

const addTranslationToHistory = (translation) => {
  const newEntry = {
    id: crypto.randomUUID(),
    fromLangCode: translation.fromLangCode,
    fromLangName: languages.find(l => l.code === translation.fromLangCode)?.name,
    toLangCode: translation.toLangCode,
    toLangName: languages.find(l => l.code === translation.toLangCode)?.name,
    originalText: translation.originalText,
    translatedText: translation.translatedText,
    timestamp: new Date().toISOString()
  };
  recentTranslations.value.unshift(newEntry);
  if (recentTranslations.value.length > MAX_HISTORY_SIZE) {
    recentTranslations.value.pop();
  }
}

const clearHistory = () => {
  recentTranslations.value = [];
}

const deleteHistoryItem = (id) => {
  const idx = recentTranslations.value.findIndex((t) => t.id === id)
  if (idx !== -1) {
    recentTranslations.value.splice(idx, 1)
    showMessage('success', 'History item removed.')
  } else {
    showMessage('error', 'Could not find that entry.')
  }
}

const loadHistory = () => {
  try {
    const saved = localStorage.getItem('translator-history');
    if (saved) {
      recentTranslations.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
    showMessage('error', 'Could not load translation history.');
  }
}

const saveHistory = () => {
  try {
    localStorage.setItem('translator-history', JSON.stringify(recentTranslations.value));
  } catch (error) {
    console.error('Failed to save history:', error);
    showMessage('error', 'Could not save translation history.');
  }
}

// --- Time Ago Formatter ---
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

// --- Lifecycle Hooks ---
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadSettings()
  loadHistory()

  try {
    const statsDocRef = doc(firestore, 'translations', 'meta');
    unsubscribeStats.value = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        appStats.value = doc.data();
      } else {
        console.log("No stats document found!");
        appStats.value = {};
      }
    }, (error) => {
      console.error("Error fetching stats:", error);
      showMessage('error', 'Could not load live statistics.')
    });
  } catch (error) {
    console.error("Firestore listener setup failed:", error);
    showMessage('error', 'Could not connect to statistics service.')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (unsubscribeStats.value) {
    unsubscribeStats.value();
  }
})

watch([apiKey, selectedLanguage, fromLanguage, autoCopy], () => {
  saveSettings()
}, { deep: true })

watch(recentTranslations, () => {
  saveHistory();
}, { deep: true });

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

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

@keyframes ping {

  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Custom scrollbar for WebKit browsers */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>