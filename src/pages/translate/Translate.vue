<template>
  <!-- Outer wrapper that allows scrolling -->
  <div class="relative min-h-screen overflow-x-hidden">

    <!-- Background (scrolls with content) -->
    <div class="absolute top-0 left-0 w-full min-h-full opacity-30 z-[-1] pointer-events-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
      </div>
    </div>

    <!-- Actual App Content -->
    <div
      class="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans flex justify-center p-4">
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
                    <!-- Settings Button -->
                    <button ref="settingsButton" @click="settingsOpen = !settingsOpen"
                      class="group relative p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 text-white backdrop-blur-sm overflow-hidden">
                      <!-- Animated background -->
                      <div
                        class="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      </div>

                      <!-- Icon -->
                      <svg class="relative z-10 w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </button>

                    <!-- Settings Popover -->
                    <div ref="settingsPanel" v-show="settingsOpen"
                      class="absolute top-full right-0 mt-3 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300 animate-fade-in">
                      <!-- Background blur effect -->
                      <div
                        class="absolute inset-0 backdrop-blur-2xl bg-slate-900/90 border border-white/10 rounded-3xl shadow-2xl">
                      </div>

                      <!-- Gradient overlay -->
                      <div
                        class="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-indigo-500/5 rounded-3xl">
                      </div>

                      <!-- Content -->
                      <div class="relative z-10 p-6 space-y-6">

                        <!-- Header -->
                        <div class="flex items-center space-x-3 pb-4 border-b border-white/10">
                          <div
                            class="p-2 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-sliders-vertical-icon lucide-sliders-vertical">
                              <line x1="4" x2="4" y1="21" y2="14" />
                              <line x1="4" x2="4" y1="10" y2="3" />
                              <line x1="12" x2="12" y1="21" y2="12" />
                              <line x1="12" x2="12" y1="8" y2="3" />
                              <line x1="20" x2="20" y1="21" y2="16" />
                              <line x1="20" x2="20" y1="12" y2="3" />
                              <line x1="2" x2="6" y1="14" y2="14" />
                              <line x1="10" x2="14" y1="8" y2="8" />
                              <line x1="18" x2="22" y1="16" y2="16" />
                            </svg>
                          </div>
                          <div>
                            <h3
                              class="text-lg font-bold bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                              Settings
                            </h3>
                            <p class="text-sm text-white/60">Configure your translator</p>
                          </div>
                        </div>

                        <!-- API Key Section -->
                        <div class="space-y-4">
                          <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                            <h4 class="text-sm font-semibold text-white/90">API Configuration</h4>
                          </div>

                          <div class="relative group">
                            <!-- Input container with gradient border -->
                            <div
                              class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>

                            <div
                              class="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm group-hover:border-white/20 transition-all duration-300">
                              <div class="flex items-center h-12"> <!-- Add explicit height -->
                                <div
                                  class="h-full flex items-center justify-center px-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-r border-white/10">
                                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z">
                                    </path>
                                  </svg>
                                </div>
                                <input v-model="apiKey" :type="showApiKey ? 'text' : 'password'"
                                  placeholder="Enter your OpenAI API key"
                                  class="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 focus:outline-none" />
                                <button @click.stop="showApiKey = !showApiKey"
                                  class="h-full px-3 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
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
                                      d="M10.125 5.175A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7-.527 1.664-1.373 3.16-2.458 4.425L10.125 5.175z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M3 3l18 18" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                          <!-- API Key Info -->
                          <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl">
                            </div>
                            <div class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                              <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-0.5">
                                  <div
                                    class="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                      fill="none" stroke="white" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round" class="lucide lucide-info-icon lucide-info">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M12 16v-4" />
                                      <path d="M12 8h.01" />
                                    </svg>
                                  </div>
                                </div>
                                <div class="space-y-1">
                                  <p class="text-sm font-medium text-blue-300">Optional API Key</p>
                                  <p class="text-xs text-white/70 leading-relaxed">
                                    This app may be disabled if my sponsored API key runs out. Add your own OpenAI API
                                    key
                                    for uninterrupted service.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="space-y-4">
                          <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                            <h4 class="text-sm font-semibold text-white/90">Preferences</h4>
                          </div>

                          <!-- Auto-copy Toggle -->
                          <div class="relative group">
                            <div
                              class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>

                            <div
                              class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm group-hover:border-white/20 transition-all duration-300">
                              <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                  <div class="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor"
                                      viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                                      </path>
                                    </svg>
                                  </div>
                                  <div>
                                    <p class="text-sm font-medium text-white">Auto-copy translations</p>
                                    <p class="text-xs text-white/60">Automatically copy to clipboard</p>
                                  </div>
                                </div>

                                <!-- Toggle Switch -->
                                <button @click="autoCopy = !autoCopy" :class="[
                                  'relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900',
                                  autoCopy ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' : 'bg-white/20'
                                ]">
                                  <span :class="[
                                    'inline-block h-5 w-5 transform rounded-full shadow-lg transition-all duration-300',
                                    autoCopy ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white/80'
                                  ]" />
                                  <!-- Glow effect when active -->
                                  <div v-if="autoCopy"
                                    class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-sm">
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Support Section -->
                        <div class="space-y-4">
                          <div class="flex items-center space-x-2">
                            <div class="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                            <h4 class="text-sm font-semibold text-white/90">Support</h4>
                          </div>

                          <!-- Coffee Button -->
                          <div class="relative group">
                            <div class="relative group">
                              <div
                                class="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              </div>

                              <a href="https://buymeacoffee.com/thatmasonguy" target="_blank" rel="noopener"
                                class="relative block w-full">
                                <div
                                  class="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 rounded-xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/25 group-hover:scale-[1.02] transform">
                                  <div class="flex items-center justify-center space-x-3 -ml-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                      fill="none" stroke="black" stroke-width="2" stroke-linecap="round"
                                      stroke-linejoin="round" class="lucide lucide-coffee-icon lucide-coffee">
                                      <path d="M10 2v2" />
                                      <path d="M14 2v2" />
                                      <path
                                        d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
                                      <path d="M6 2v2" />
                                    </svg>
                                    <div class="text-center">
                                      <p class="text-lg font-bold text-gray-900">Buy me a coffee</p>
                                      <p class="text-sm text-gray-900/80">Support this project</p>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>

                          <!-- Support Message -->
                          <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl">
                            </div>
                            <div class="relative bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                              <div class="flex items-start space-x-3">
                                <div class="flex-shrink-0 mt-0.5">
                                  <div
                                    class="w-5 h-5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                      viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                      </path>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-yellow-300">Enjoying the app?</p>
                                  <p class="text-xs text-white/70 leading-relaxed mt-1">
                                    If you find this translator helpful, consider buying me a coffee to help keep it
                                    running!
                                  </p>
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
                        class="w-full h-full p-4 pb-16 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

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
                        class="w-full h-full p-4 pb-16 bg-white/5 border border-white/10 rounded-2xl resize-none text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm group-hover:bg-white/10"></textarea>

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
                          <svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
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
                <div v-if="retranslatedText" :class="[
                  'mt-4 mb-4 md:mb-0 p-3 sm:p-4 rounded-2xl backdrop-blur-sm animate-fade-in',
                  accuracy > 80 ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20' :
                    accuracy > 60 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20' :
                      accuracy > 40 ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20' :
                        'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20'
                ]">

                  <!-- Header Section -->
                  <div class="mb-3">
                    <!-- Title and Icon Row -->
                    <div class="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <div :class="[
                        'p-2 rounded-lg flex-shrink-0',
                        accuracy > 80 ? 'bg-green-500/20' :
                          accuracy > 60 ? 'bg-yellow-500/20' :
                            accuracy > 40 ? 'bg-orange-500/20' :
                              'bg-red-500/20'
                      ]">
                        <svg :class="[
                          'w-4 h-4 sm:w-5 sm:h-5',
                          accuracy > 80 ? 'text-green-400' :
                            accuracy > 60 ? 'text-yellow-400' :
                              accuracy > 40 ? 'text-orange-400' :
                                'text-red-400'
                        ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                          </path>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 :class="[
                          'font-bold text-sm sm:text-base',
                          accuracy > 80 ? 'text-green-300' :
                            accuracy > 60 ? 'text-yellow-300' :
                              accuracy > 40 ? 'text-orange-300' :
                                'text-red-300'
                        ]">Round-trip Translation</h3>
                        <p :class="[
                          'text-xs',
                          accuracy > 80 ? 'text-green-400/80' :
                            accuracy > 60 ? 'text-yellow-400/80' :
                              accuracy > 40 ? 'text-orange-400/80' :
                                'text-red-400/80'
                        ]" class="truncate">Translated back to {{
                        retranslationTargetLanguageName }}</p>
                      </div>
                    </div>

                    <!-- Stats and Actions Row -->
                    <div class="flex items-center justify-between flex-wrap gap-2">
                      <span :class="[
                        'text-xs px-2 py-1 rounded-full whitespace-nowrap',
                        accuracy > 80 ? 'text-green-400/80 bg-green-500/10' :
                          accuracy > 60 ? 'text-yellow-400/80 bg-yellow-500/10' :
                            accuracy > 40 ? 'text-orange-400/80 bg-orange-500/10' :
                              'text-red-400/80 bg-red-500/10'
                      ]">{{
                      retranslatedText.length }} chars</span>
                      <button @click="copyToClipboard(retranslatedText)" :class="[
                        'text-xs transition-colors duration-200 flex items-center space-x-1 px-2 py-1 rounded-lg flex-shrink-0',
                        accuracy > 80 ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' :
                          accuracy > 60 ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10' :
                            accuracy > 40 ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10' :
                              'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                      ]">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
                          </path>
                        </svg>
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <!-- Content Section -->
                  <div :class="[
                    'p-3 rounded-xl border',
                    accuracy > 80 ? 'bg-green-500/5 border-green-500/10' :
                      accuracy > 60 ? 'bg-yellow-500/5 border-yellow-500/10' :
                        accuracy > 40 ? 'bg-orange-500/5 border-orange-500/10' :
                          'bg-red-500/5 border-red-500/10'
                  ]">
                    <div :class="[
                      'text-sm leading-relaxed break-words',
                      accuracy > 80 ? 'text-green-100' :
                        accuracy > 60 ? 'text-yellow-100' :
                          accuracy > 40 ? 'text-orange-100' :
                            'text-red-100'
                    ]" v-html="retranslationWithDiff"></div>
                  </div>

                  <!-- Accuracy Section -->
                  <div class="mt-3 space-y-2">
                    <!-- Accuracy Label -->
                    <div class="flex items-center space-x-1">
                      <div :class="[
                        'w-2 h-2 rounded-full flex-shrink-0',
                        accuracy > 80 ? 'bg-green-400' :
                          accuracy > 60 ? 'bg-yellow-400' :
                            accuracy > 40 ? 'bg-orange-400' :
                              'bg-red-400'
                      ]"></div>
                      <span :class="[
                        'text-xs',
                        accuracy > 80 ? 'text-green-400/80' :
                          accuracy > 60 ? 'text-yellow-400/80' :
                            accuracy > 40 ? 'text-orange-400/80' :
                              'text-red-400/80'
                      ]">Accuracy indicator:</span>
                    </div>

                    <!-- Progress Bar and Rating -->
                    <div class="flex items-center space-x-2">
                      <div :class="[
                        'flex-1 rounded-full h-2 overflow-hidden min-w-0',
                        accuracy > 80 ? 'bg-green-500/10' :
                          accuracy > 60 ? 'bg-yellow-500/10' :
                            accuracy > 40 ? 'bg-orange-500/10' :
                              'bg-red-500/10'
                      ]">
                        <div :style="{ width: accuracyPercentage + '%' }" :class="accuracyBarClass"
                          class="h-full transition-all duration-500"></div>
                      </div>
                      <span :class="[
                        'text-xs font-semibold whitespace-nowrap',
                        accuracy > 80 ? 'text-green-400/80' :
                          accuracy > 60 ? 'text-yellow-400/80' :
                            accuracy > 40 ? 'text-orange-400/80' :
                              'text-red-400/80'
                      ]">{{ accuracyRating }} ({{ accuracyPercentage
                        }}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1 flex flex-col flex-grow min-h-0 space-y-2">
            <h3 class="text-xs font-medium text-white/80 uppercase tracking-wide">Usage</h3>

            <!-- Translations -->
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              </div>
              <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-cyan-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                    <div class="relative">
                      <div class="absolute inset-0 bg-cyan-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                      </div>
                      <div
                        class="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                        <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                          </path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-cyan-300 uppercase tracking-wide">Translations</p>
                      <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{ formattedTranslations }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div
                      class="w-5 h-5 md:w-7 md:h-7 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                      <div class="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 rounded-full bg-cyan-400 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Words -->
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              </div>
              <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                    <div class="relative">
                      <div
                        class="absolute inset-0 bg-emerald-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                      </div>
                      <div
                        class="relative bg-gradient-to-br from-emerald-400 to-teal-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                        <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h3.75M9 15h3.75M9 18h3.75m3-6h5.25m-5.25 3h5.25M12 3h6a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h6zm3 3H6v12h12V6z">
                          </path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-emerald-300 uppercase tracking-wide">Words</p>
                      <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{ formattedWords }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="flex flex-col items-end space-y-0.5">
                      <div class="w-4 h-1 bg-emerald-400 rounded-full"></div>
                      <div class="w-3 h-1 bg-emerald-400/70 rounded-full"></div>
                      <div class="w-2 h-1 bg-emerald-400/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- API Cost -->
            <div class="relative group">
              <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md md:rounded-lg xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              </div>
              <div
                class="relative backdrop-blur bg-white/10 border border-white/20 rounded-md md:rounded-lg xl:rounded-2xl p-2 xl:p-3 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:bg-white/15">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-1 md:space-x-2 xl:space-x-3">
                    <div class="relative">
                      <div
                        class="absolute inset-0 bg-purple-400 rounded-md md:rounded-lg xl:rounded-2xl blur opacity-30">
                      </div>
                      <div
                        class="relative bg-gradient-to-br from-purple-500 to-pink-500 p-1 md:p-2 xl:p-3 rounded-md md:rounded-lg xl:rounded-2xl">
                        <svg class="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-white" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                          </path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-purple-300 uppercase tracking-wide">API Cost</p>
                      <p class="text-base md:text-lg xl:text-2xl font-bold text-white">{{ formattedApiCost }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div
                      class="relative w-5 h-5 md:w-7 md:h-7 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <div
                        class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 animate-ping">
                      </div>
                      <div
                        class="relative w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center space-x-2 mt-6 pb-4 lg:pb-0 opacity-60">
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
                  <div v-for="item in recentTranslations" :key="item.id"
                    class="group relative bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300 rounded-xl p-4 animate-fade-in">

                    <!-- delete button -->
                    <button @click.stop="deleteHistoryItem(item.id)" aria-label="Delete history item"
                      class="absolute -top-2 -right-2 z-10 p-1 rounded-full bg-black/20 text-white/50 hover:text-red-500 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <!-- header with language info and timestamp -->
                    <div class="flex justify-between items-center mb-3">
                      <div class="flex items-center space-x-2 text-xs text-white/70">
                        <div class="flex items-center space-x-1">
                          <i :class="flagClass(item.fromLangName)" class="w-4 h-4 rounded-sm"></i>
                          <span>{{ item.fromLangName }}</span>
                        </div>
                        <svg class="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                        <div class="flex items-center space-x-1">
                          <i :class="flagClass(item.toLangName)" class="w-4 h-4 rounded-sm"></i>
                          <span>{{ item.toLangName }}</span>
                        </div>
                      </div>
                      <span class="text-white/50 text-xs">{{ formatTimeAgo(item.timestamp) }}</span>
                    </div>

                    <!-- translation content -->
                    <div class="space-y-3">
                      <!-- original text -->
                      <div class="relative group/text">
                        <div class="flex items-start space-x-3">
                          <div class="flex-shrink-0 mt-1">
                            <i :class="flagClass(item.fromLangName)" class="w-5 h-4 rounded shadow-sm"></i>
                          </div>
                          <div class="flex-1 relative">
                            <p class="text-white/80 text-sm bg-black/20 p-3 rounded-lg pr-10 min-h-[2.5rem]">
                              {{ item.originalText }}
                            </p>
                            <button @click="copyToClipboard(item.originalText)" aria-label="Copy original text"
                              class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- translated text -->
                      <div class="relative group/text">
                        <div class="flex items-start space-x-3">
                          <div class="flex-shrink-0 mt-1">
                            <i :class="flagClass(item.toLangName)" class="w-5 h-4 rounded shadow-sm"></i>
                          </div>
                          <div class="flex-1 relative">
                            <p class="text-white text-sm bg-black/30 p-3 rounded-lg pr-10 min-h-[2.5rem] font-medium">
                              {{ item.translatedText }}
                            </p>
                            <button @click="copyToClipboard(item.translatedText)" aria-label="Copy translated text"
                              class="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-white/40 hover:text-white opacity-0 group-hover/text:opacity-100 transition-all duration-200">
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
const accuracy = ref(null);
const accuracyRating = ref(null);

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
const accuracyPercentage = computed(() =>
  accuracy.value !== null ? Math.round(accuracy.value) : null
);

const accuracyBarClass = computed(() => {
  if (accuracy.value > 80) return 'bg-green-500';
  if (accuracy.value > 60) return 'bg-yellow-500';
  if (accuracy.value > 40) return 'bg-orange-500';
  return 'bg-red-500';
});

// --- Text Diffing ---
const retranslationWithDiff = computed(() => {
  return highlightDifferences(lastOriginalText.value, retranslatedText.value)
})

// --- Methods ---
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
      const underlineColor = accuracy.value > 80 ? 'decoration-green-400' :
        accuracy.value > 60 ? 'decoration-yellow-400' :
          accuracy.value > 40 ? 'decoration-orange-400' :
            'decoration-red-400';
      const textColor = accuracy.value > 80 ? 'text-green-50' :
        accuracy.value > 60 ? 'text-yellow-50' :
          accuracy.value > 40 ? 'text-orange-50' :
            'text-red-50';
      return `<u class="${underlineColor} decoration-2 underline ${textColor}">${cleanText}</u>`;
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

    accuracy.value = typeof data.accuracy === 'number'
      ? Math.ceil(data.accuracy * 100)
      : null;
    accuracyRating.value = data.accuracyRating || null;

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
      translatedText: outputText,
      accuracy: accuracy.value,
      accuracyRating: accuracyRating.value,
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
    accuracy.value = null;
    accuracyRating.value = null;
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