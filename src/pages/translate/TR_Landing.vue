<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-900 via-violet-950 to-zinc-900">
        <!-- Navigation Bar -->
        <nav
            class="fixed top-0 left-0 right-0 z-50 px-8 py-4 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <router-link to="/translate/bot" class="flex items-center gap-2 text-white font-bold text-xl">
                    <Languages class="h-6 w-6 text-violet-400" />
                    <span>MXNTranslate</span>
                </router-link>

                <router-link to="/translate/bot/dashboard"
                    class="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg font-semibold text-white hover:from-violet-700 hover:to-fuchsia-700 transition-all flex items-center gap-2">
                    <Settings class="h-4 w-4" />
                    Manage Bot
                </router-link>
            </div>
        </nav>

        <!-- Noise texture overlay -->
        <div class="fixed inset-0 opacity-20 mix-blend-soft-light pointer-events-none"
            style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 opacity=%220.4%22/%3E%3C/svg%3E')">
        </div>

        <!-- Hero Section - Full Width -->
        <section class="relative px-8 pt-28 pb-24 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent"></div>

            <div class="max-w-7xl mx-auto relative z-10">
                <div class="grid lg:grid-cols-2 gap-16 items-center">
                    <!-- Left: Text Content -->
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
                            <Sparkles class="h-4 w-4 text-violet-400" />
                            <span class="text-sm text-violet-300">24/7 Discord Translation Bot</span>
                        </div>

                        <h1 class="text-6xl lg:text-7xl font-black mb-6">
                            <span class="text-white">React.</span><br />
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Translate.</span><br />
                            <span class="text-white/80">Repeat.</span>
                        </h1>

                        <p class="text-xl text-zinc-300 mb-4 leading-relaxed">
                            Break language barriers instantly with the simplest Discord translation bot ever built. No
                            commands to remember, no complex setup, no subscription fees.
                        </p>

                        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
                            Just react with a flag emoji and watch messages transform into your language in real-time.
                            Used by thousands of international communities worldwide.
                        </p>

                        <div class="flex flex-wrap gap-4 mb-12">
                            <a href="https://discord.com/oauth2/authorize?client_id=1360582974277550090" target="_blank"
                                class="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white overflow-hidden transition-all hover:scale-105">
                                <span class="relative z-10 flex items-center gap-2">
                                    <Bot class="h-5 w-5" />
                                    Add to Discord
                                </span>
                                <div
                                    class="absolute inset-0 bg-gradient-to-r from-violet-700 to-fuchsia-700 translate-y-full group-hover:translate-y-0 transition-transform">
                                </div>
                            </a>

                            <router-link to="/translate"
                                class="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                                <Globe class="h-5 w-5" />
                                Web Version
                            </router-link>

                            <router-link to="/translate/legal"
                                class="px-8 py-4 rounded-xl font-semibold text-zinc-400 hover:text-white transition-all flex items-center gap-2">
                                <Shield class="h-5 w-5" />
                                Privacy & Terms
                            </router-link>
                        </div>

                        <!-- Enhanced Support Banner -->
                        <div
                            class="p-6 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-2xl backdrop-blur relative overflow-hidden">
                            <div
                                class="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-orange-600/5 animate-pulse">
                            </div>
                            <div class="relative flex items-start gap-4">
                                <div class="flex-shrink-0">
                                    <div class="p-2 bg-amber-500/20 rounded-lg">
                                        <Heart class="h-6 w-6 text-amber-400" />
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-bold text-amber-300 mb-2">⚡ Solo Dev Running 24/7 AI Magic!</h3>
                                    <p class="text-zinc-300 text-sm mb-3 leading-relaxed">
                                        This bot costs me <strong class="text-amber-300">~$5/month</strong> in OpenAI
                                        API calls and server hosting.
                                        Every translation request hits premium AI models to give you the best quality
                                        possible.
                                        <span class="text-amber-200">Help keep the magic alive!</span>
                                    </p>
                                    <div class="flex flex-wrap gap-3">
                                        <a href="https://buymeacoffee.com/thatmasonguy" target="_blank"
                                            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 hover:from-amber-500/40 hover:to-orange-500/40 border border-amber-500/40 rounded-lg text-amber-200 font-semibold transition-all transform hover:scale-105">
                                            <Coffee class="h-4 w-4" />
                                            Buy Me a Coffee
                                        </a>
                                        <div class="px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                            <span class="text-xs text-amber-300">Even $3 helps cover API costs!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Live Demo -->
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-3xl">
                        </div>
                        <div
                            class="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
                            <div class="flex items-center gap-2 mb-6">
                                <div class="h-3 w-3 bg-red-500 rounded-full"></div>
                                <div class="h-3 w-3 bg-yellow-500 rounded-full"></div>
                                <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                                <span class="text-zinc-500 text-sm ml-auto"># general</span>
                            </div>

                            <!-- Message 1 -->
                            <div class="flex gap-3 mb-6">
                                <div
                                    class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                    <User class="h-5 w-5 text-white" />
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-baseline gap-2 mb-1">
                                        <span class="font-semibold text-zinc-200">Alex</span>
                                        <span class="text-xs text-zinc-500">2:34 PM</span>
                                    </div>
                                    <div class="bg-zinc-700/50 rounded-2xl rounded-tl-sm p-3">
                                        <p class="text-zinc-200">Anyone tried the new update? It's incredible!</p>
                                    </div>
                                    <div class="flex gap-2 mt-2">
                                        <span
                                            class="fi fi-jp hover:scale-125 transition-transform cursor-pointer"></span>
                                        <span
                                            class="fi fi-gr hover:scale-125 transition-transform cursor-pointer"></span>
                                        <span
                                            class="fi fi-fr hover:scale-125 transition-transform cursor-pointer"></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Bot Translation 1 - Japanese -->
                            <div class="flex gap-3 ml-8 animate-fade-in opacity-0 mb-4"
                                style="animation-delay: 1s; animation-fill-mode: forwards;">
                                <div
                                    class="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                                    <Bot class="h-4 w-4 text-white" />
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs text-violet-400 flex items-center gap-1">
                                            <Languages class="h-3 w-3" />
                                            Translated to Japanese
                                        </span>
                                    </div>
                                    <div
                                        class="bg-gradient-to-r from-violet-900/30 to-fuchsia-900/30 border border-violet-700/30 rounded-2xl rounded-tl-sm p-3">
                                        <p class="text-zinc-200">誰か新しいアップデートを試しましたか？信じられない！</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Bot Translation 2 - Greek -->
                            <div class="flex gap-3 ml-8 animate-fade-in opacity-0 mb-4"
                                style="animation-delay: 2.5s; animation-fill-mode: forwards;">
                                <div
                                    class="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                                    <Bot class="h-4 w-4 text-white" />
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs text-emerald-400 flex items-center gap-1">
                                            <Languages class="h-3 w-3" />
                                            Translated to Greek
                                        </span>
                                    </div>
                                    <div
                                        class="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-2xl rounded-tl-sm p-3">
                                        <p class="text-zinc-200">Κάποιος δοκίμασε τη νέα ενημέρωση; Είναι απίστευτη!</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Bot Translation 3 - French -->
                            <div class="flex gap-3 ml-8 animate-fade-in opacity-0"
                                style="animation-delay: 4s; animation-fill-mode: forwards;">
                                <div
                                    class="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                                    <Bot class="h-4 w-4 text-white" />
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs text-rose-400 flex items-center gap-1">
                                            <Languages class="h-3 w-3" />
                                            Translated to French
                                        </span>
                                    </div>
                                    <div
                                        class="bg-gradient-to-r from-rose-900/30 to-pink-900/30 border border-rose-700/30 rounded-2xl rounded-tl-sm p-3">
                                        <p class="text-zinc-200">Quelqu'un a essayé la nouvelle mise à jour ? C'est
                                            incroyable !</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Stats Section -->
        <section class="px-8 py-16 bg-black/20 backdrop-blur-sm">
            <div class="max-w-6xl mx-auto">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <!-- Words Translated -->
                    <div class="text-center relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all blur-xl">
                        </div>
                        <div
                            class="relative p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl backdrop-blur">
                            <div class="text-3xl lg:text-4xl font-black text-emerald-400 mb-2">{{ store.formattedWords
                            }}</div>
                            <div class="text-zinc-400">Words Translated</div>
                        </div>
                    </div>

                    <!-- Translations Made -->
                    <div class="text-center relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all blur-xl">
                        </div>
                        <div class="relative p-6 bg-violet-500/5 border border-violet-500/20 rounded-2xl backdrop-blur">
                            <div class="text-3xl lg:text-4xl font-black text-violet-400 mb-2">{{
                                store.formattedTranslations }}</div>
                            <div class="text-zinc-400">Translations Made</div>
                        </div>
                    </div>

                    <!-- Discord Servers -->
                    <div class="text-center relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all blur-xl">
                        </div>
                        <div class="relative p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl backdrop-blur">
                            <div class="text-3xl lg:text-4xl font-black text-blue-400 mb-2">{{
                                store.discordCounts.guilds || 0 }}+</div>
                            <div class="text-zinc-400">Discord Servers</div>
                        </div>
                    </div>

                    <!-- Months Running -->
                    <div class="text-center relative group">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all blur-xl">
                        </div>
                        <div class="relative p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl backdrop-blur">
                            <div class="text-3xl lg:text-4xl font-black text-amber-400 mb-2">{{ monthsRunning }}</div>
                            <div class="text-zinc-400">{{ monthsRunning === 1 ? 'Month' : 'Months' }} Running</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works - Wide 3-column -->
        <section class="px-8 py-16">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-black text-white mb-4">Dead Simple Process</h2>
                    <p class="text-zinc-400 text-lg">No commands to memorize. No complex configuration. No learning
                        curve.</p>
                    <p class="text-zinc-500 mt-2">Three clicks and you're translating messages worldwide.</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div class="group relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
                        </div>
                        <div
                            class="relative p-8 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                            <div class="inline-flex p-3 bg-violet-500/10 rounded-xl mb-6">
                                <Flag class="h-8 w-8 text-violet-400" />
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-3">React with Flag</h3>
                            <p class="text-zinc-400 leading-relaxed mb-4">
                                See a message in another language? Just click any flag emoji reaction. We support over
                                40+ languages through intuitive flag emojis.
                            </p>
                            <div class="flex gap-2 opacity-60">
                                <span class="fi fi-jp"></span>
                                <span class="fi fi-de"></span>
                                <span class="fi fi-fr"></span>
                                <span class="fi fi-es"></span>
                                <span class="fi fi-kr"></span>
                            </div>
                        </div>
                    </div>

                    <div class="group relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-fuchsia-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
                        </div>
                        <div
                            class="relative p-8 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-fuchsia-700/50 transition-all">
                            <div class="inline-flex p-3 bg-fuchsia-500/10 rounded-xl mb-6">
                                <Zap class="h-8 w-8 text-fuchsia-400" />
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-3">Instant Translation</h3>
                            <p class="text-zinc-400 leading-relaxed mb-4">
                                Our advanced AI processes the message in milliseconds, maintaining context, tone, and
                                meaning. Even handles slang and regional expressions.
                            </p>
                            <div class="text-xs text-zinc-500 font-mono bg-zinc-800/50 px-3 py-2 rounded-lg">
                                &lt; 600ms average response time
                            </div>
                        </div>
                    </div>

                    <div class="group relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl">
                        </div>
                        <div
                            class="relative p-8 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                            <div class="inline-flex p-3 bg-violet-500/10 rounded-xl mb-6">
                                <MessageSquare class="h-8 w-8 text-violet-400" />
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-3">Clean Reply</h3>
                            <p class="text-zinc-400 leading-relaxed mb-4">
                                Translation appears as a threaded reply, keeping conversations organized. All URLs,
                                mentions, and Discord markdown stay perfectly intact.
                            </p>
                            <div class="flex items-center gap-2 text-xs text-zinc-500">
                                <span>✓ Links preserved</span>
                                <span>✓ Mentions work</span>
                                <span>✓ Emojis intact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Grid - Bento Box Style -->
        <section class="px-8 py-16 bg-gradient-to-b from-black/10 via-transparent to-black/10">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-black text-white mb-4">Built Different</h2>
                    <p class="text-zinc-400 text-lg">Every feature designed for the perfect translation experience.</p>
                    <p class="text-zinc-500 mt-2">Professional-grade infrastructure meets dead-simple usability.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Large feature -->
                    <div class="md:col-span-2 group relative overflow-hidden rounded-2xl">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 rounded-2xl">
                        </div>
                        <div
                            class="relative p-8 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                            <Clock class="h-10 w-10 text-violet-400 mb-4" />
                            <h3 class="text-2xl font-bold text-white mb-3">99.7% Uptime Guarantee</h3>
                            <p class="text-zinc-300 text-lg leading-relaxed mb-4">
                                Professionally hosted on enterprise-grade infrastructure with automatic failover and
                                monitoring. No self-hosting headaches, no surprise downtime.
                            </p>
                            <div class="grid grid-cols-2 gap-4 mt-6">
                                <div class="bg-zinc-900/50 rounded-lg p-3">
                                    <div class="text-sm text-zinc-400">Current Uptime</div>
                                    <div class="text-lg font-bold text-green-400">99.67%</div>
                                </div>
                                <div class="bg-zinc-900/50 rounded-lg p-3">
                                    <div class="text-sm text-zinc-400">Response Time</div>
                                    <div class="text-lg font-bold text-blue-400">&lt;600ms</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Small features -->
                    <div class="group relative overflow-hidden rounded-2xl">
                        <div
                            class="relative p-6 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-fuchsia-700/50 transition-all">
                            <Link2 class="h-8 w-8 text-fuchsia-400 mb-4" />
                            <h3 class="text-lg font-bold text-white mb-2">Link Safe</h3>
                            <p class="text-zinc-400 text-sm mb-3">URLs stay clickable and functional</p>
                            <div class="text-xs text-zinc-500">Advanced parsing preserves all link metadata</div>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden rounded-2xl">
                        <div
                            class="relative p-6 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                            <Type class="h-8 w-8 text-violet-400 mb-4" />
                            <h3 class="text-lg font-bold text-white mb-2">Markdown Safe</h3>
                            <p class="text-zinc-400 text-sm mb-3">All Discord formatting preserved</p>
                            <div class="text-xs text-zinc-500">**Bold**, *italic*, and `code` blocks intact</div>
                        </div>
                    </div>

                    <!-- Medium feature -->
                    <div class="md:col-span-2 group relative overflow-hidden rounded-2xl">
                        <div
                            class="relative p-8 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-fuchsia-700/50 transition-all">
                            <Gauge class="h-10 w-10 text-fuchsia-400 mb-4" />
                            <h3 class="text-2xl font-bold text-white mb-3">Smart Caching & Rate Limiting</h3>
                            <p class="text-zinc-300 leading-relaxed mb-4">
                                Recent translations are cached for lightning-fast responses. Intelligent rate limiting
                                prevents spam while ensuring legitimate requests always go through.
                            </p>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-center">
                                    <div class="text-lg font-bold text-fuchsia-400">5min</div>
                                    <div class="text-xs text-zinc-500">Cache Duration</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-lg font-bold text-violet-400">10/min</div>
                                    <div class="text-xs text-zinc-500">Rate Limit</div>
                                </div>
                                <div class="text-center">
                                    <div class="flex items-center justify-center text-lg font-bold text-green-400">
                                        <Infinity class="h-6 w-6" />
                                    </div>
                                    <div class="text-xs text-zinc-500">Usage Limit</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Small features -->
                    <div class="group relative overflow-hidden rounded-2xl">
                        <div
                            class="relative p-6 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                            <Users class="h-8 w-8 text-violet-400 mb-4" />
                            <h3 class="text-lg font-bold text-white mb-2">DM Support</h3>
                            <p class="text-zinc-400 text-sm mb-3">Works in servers and private messages</p>
                            <div class="text-xs text-zinc-500">Full functionality everywhere</div>
                        </div>
                    </div>

                    <div class="group relative overflow-hidden rounded-2xl">
                        <div
                            class="relative p-6 h-full bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-fuchsia-700/50 transition-all">
                            <History class="h-8 w-8 text-fuchsia-400 mb-4" />
                            <h3 class="text-lg font-bold text-white mb-2">Thread Ready</h3>
                            <p class="text-zinc-400 text-sm mb-3">Perfect for long conversations</p>
                            <div class="text-xs text-zinc-500">Maintains conversation context</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Language Support Section -->
        <section class="px-8 py-16">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-black text-white mb-4">40+ Languages Supported</h2>
                    <p class="text-zinc-400">From major world languages to regional favorites</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8">
                    <div class="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl p-6">
                        <h3 class="text-xl font-bold text-white mb-4">Popular Languages</h3>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-us"></span>
                                <span>English (US, UK, AU, CA, NZ)</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-es"></span>
                                <span>Spanish (ES, MX, AR, CO, CL)</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-fr"></span>
                                <span>French, German, Italian</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-pt"></span>
                                <span>Portuguese (PT, BR)</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl p-6">
                        <h3 class="text-xl font-bold text-white mb-4">Asian Languages</h3>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-jp"></span>
                                <span>Japanese, Korean, Chinese</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-in"></span>
                                <span>Hindi, Urdu, Bengali</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-th"></span>
                                <span>Thai, Vietnamese, Indonesian</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-my"></span>
                                <span>Malay, Tagalog</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl p-6">
                        <h3 class="text-xl font-bold text-white mb-4">European & More</h3>
                        <div class="space-y-2">
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-ru"></span>
                                <span>Russian, Ukrainian, Serbian</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-se"></span>
                                <span>Swedish, Norwegian, Danish</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-pl"></span>
                                <span>Polish, Czech, Hungarian</span>
                            </div>
                            <div class="flex items-center gap-3 text-zinc-300">
                                <span class="fi fi-gr"></span>
                                <span>Greek, Turkish, Arabic, Hebrew</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-8">
                    <p class="text-zinc-500">Plus many more regional languages and variants!</p>
                </div>
            </div>
        </section>

        <!-- Coming Soon - Card Layout -->
        <section class="px-8 py-16 bg-gradient-to-b from-violet-950/30 via-transparent to-violet-950/30">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
                        <Sparkles class="h-4 w-4 text-violet-400" />
                        <span class="text-sm text-violet-300 font-semibold">ROADMAP 2025/26</span>
                    </div>
                    <h2 class="text-4xl font-black text-white mb-4">What's Cooking</h2>
                    <p class="text-zinc-400 text-lg">The future of Discord translation is being built right now</p>
                </div>

                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Priority Feature -->
                    <div class="relative group">
                        <div
                            class="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity">
                        </div>
                        <div class="relative p-8 bg-zinc-900/80 backdrop-blur border border-violet-700/50 rounded-2xl">
                            <div class="flex items-center justify-between mb-4">
                                <Settings class="h-10 w-10 text-violet-400" />
                                <span
                                    class="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-bold rounded-full animate-pulse">
                                    Q3 2025
                                </span>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-3">Server Dashboard</h3>
                            <p class="text-zinc-300 leading-relaxed mb-4">
                                Web-based control panel to configure your server's translation preferences. Set default
                                languages, manage permissions, customize bot responses, and view usage statistics.
                            </p>
                            <div class="space-y-2 text-sm text-zinc-400">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                                    <span>Language preferences per channel</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                                    <span>Custom response templates</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                                    <span>Role-based permissions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Other Features -->
                    <div
                        class="relative p-8 bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-violet-700/50 transition-all">
                        <div class="flex items-center justify-between mb-4">
                            <BarChart3 class="h-10 w-10 text-fuchsia-400" />
                            <span class="px-3 py-1 bg-zinc-700/50 text-zinc-400 text-xs font-bold rounded-full">
                                Q4 2025
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-3">Usage Analytics</h3>
                        <p class="text-zinc-300 leading-relaxed mb-4">
                            Comprehensive insights into your server's translation patterns, popular language pairs, peak
                            usage times, and cost optimization suggestions.
                        </p>
                        <div class="space-y-2 text-sm text-zinc-400">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
                                <span>Translation frequency charts</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-fuchsia-400 rounded-full"></div>
                                <span>Language popularity metrics</span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative p-8 bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-2xl hover:border-fuchsia-700/50 transition-all">
                        <div class="flex items-center justify-between mb-4">
                            <MessageCircle class="h-10 w-10 text-violet-400" />
                            <span class="px-3 py-1 bg-zinc-700/50 text-zinc-400 text-xs font-bold rounded-full">
                                Q1 2026
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-white mb-3">Community Features</h3>
                        <p class="text-zinc-300 leading-relaxed mb-4">
                            Vote on new features, suggest improvements, report translation issues, and help shape the
                            bot's future through community feedback.
                        </p>
                        <div class="space-y-2 text-sm text-zinc-400">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                                <span>Feature request voting</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 bg-violet-400 rounded-full"></div>
                                <span>Translation quality feedback</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQs - Two Column -->
        <section class="px-8 py-16">
            <div class="max-w-6xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl font-black text-white mb-4">Quick Answers</h2>
                    <p class="text-zinc-400 text-lg">Everything you need to know to get started translating</p>
                    <p class="text-zinc-500 mt-2">Still have questions? DM @thatmasonguy on Discord</p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-violet-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">I reacted but nothing happened?</span>
                            <ChevronDown
                                class="h-5 w-5 text-violet-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                The bot can only translate messages sent after it joined your server. Historical
                                messages can't be translated due to Discord API limitations. Also make sure the bot has
                                permission to read messages and send replies in that channel.
                            </div>
                        </div>
                    </details>

                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-violet-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">Is it recording my messages?</span>
                            <ChevronDown
                                class="h-5 w-5 text-violet-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                Messages and translations are stored securely for a limited period to provide caching,
                                troubleshoot issues, and improve our translation models. We don't share your data with
                                third parties for marketing. Some anonymised data may be retained for model
                                improvements. Check our
                                <router-link to="/translate/legal"
                                    class="text-violet-400 hover:text-violet-300 underline">privacy policy</router-link>
                                for full details.
                            </div>
                        </div>
                    </details>

                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-fuchsia-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">How do I check if it's working?</span>
                            <ChevronDown
                                class="h-5 w-5 text-fuchsia-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                Use <code
                                    class="px-2 py-1 bg-zinc-700 rounded text-fuchsia-400">/translate status</code> to
                                check the bot and API health. You can also send a test message and react with a flag to
                                verify functionality. The bot should respond within 200ms if everything is working
                                properly.
                            </div>
                        </div>
                    </details>

                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-fuchsia-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">Something's broken! Who do I tell?</span>
                            <ChevronDown
                                class="h-5 w-5 text-fuchsia-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                DM <span class="text-fuchsia-400 font-mono">@thatmasonguy</span> on Discord and I'll fix
                                it ASAP! Include details like which server, what flag you used, and any error messages.
                                Most issues are resolved within 24 hours.
                            </div>
                        </div>
                    </details>

                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-violet-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">What about translation accuracy?</span>
                            <ChevronDown
                                class="h-5 w-5 text-violet-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                We use state-of-the-art AI translation APIs with 95%+ accuracy for major languages.
                                Context is preserved, and the system handles slang, idioms, and technical terms well.
                                For critical communications, we recommend verification with native speakers.
                            </div>
                        </div>
                    </details>

                    <details class="group faq-item">
                        <summary
                            class="flex items-center justify-between p-6 bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-2xl cursor-pointer hover:border-violet-700/50 transition-all">
                            <span class="font-semibold text-white pr-4">Can I customize the bot behavior?</span>
                            <ChevronDown
                                class="h-5 w-5 text-violet-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                        </summary>
                        <div class="faq-content">
                            <div
                                class="px-6 pb-6 pt-4 bg-zinc-800/20 border border-zinc-700/30 border-t-0 rounded-b-2xl text-zinc-300">
                                Currently, the bot works out-of-the-box with no configuration needed. However, a server
                                dashboard with custom settings is coming in Q1 2025! You'll be able to set default
                                languages, manage permissions, and customize responses.
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </section>

        <!-- Final CTA -->
        <section class="px-8 py-24">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-5xl font-black text-white mb-8">
                    Ready to <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">go
                        global?</span>
                </h2>
                <p class="text-xl text-zinc-300 mb-4">
                    Join thousands of servers already breaking language barriers worldwide.
                </p>
                <p class="text-lg text-zinc-400 mb-12">
                    Free forever. No subscriptions. No auth walls. Just translate.
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="https://discord.com/oauth2/authorize?client_id=1360582974277550090" target="_blank"
                        class="group relative px-10 py-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-white text-lg overflow-hidden transition-all hover:scale-105 inline-flex items-center justify-center gap-3">
                        <Bot class="h-6 w-6" />
                        <span>Add to Discord</span>
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-violet-700 to-fuchsia-700 translate-y-full group-hover:translate-y-0 transition-transform">
                        </div>
                    </a>

                    <div class="flex items-center gap-3">
                        <span class="text-zinc-500">or</span>
                        <router-link to="/translate/bot/dashboard"
                            class="px-8 py-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                            <Settings class="h-5 w-5" />
                            Already added? Login to manage
                        </router-link>
                    </div>
                </div>

                <div class="mt-8 flex items-center justify-center gap-6">
                    <router-link to="/translate" class="text-zinc-400 hover:text-white transition-colors">
                        Web Version
                    </router-link>
                    <span class="text-zinc-700">•</span>
                    <router-link to="/translate/legal" class="text-zinc-400 hover:text-white transition-colors">
                        Privacy Policy
                    </router-link>
                    <span class="text-zinc-700">•</span>
                    <a href="https://buymeacoffee.com/thatmasonguy" target="_blank"
                        class="text-zinc-400 hover:text-white transition-colors">
                        Support
                    </a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="px-8 py-12 border-t border-zinc-800">
            <div class="max-w-7xl mx-auto text-center">
                <p class="text-zinc-500 mb-2">
                    Made with <span class="text-violet-400">💜</span> by @thatmasonguy
                </p>
                <p class="text-zinc-600 text-sm">
                    No subscriptions. No auth walls. Just translate.
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import {
    BarChart3,
    Bot,
    ChevronDown,
    Clock,
    Coffee,
    Flag,
    Gauge,
    Globe,
    Heart,
    History,
    Infinity,
    Languages,
    Link2,
    MessageCircle,
    MessageSquare,
    Settings,
    Shield,
    Sparkles,
    Type,
    User,
    Users,
    Zap
} from 'lucide-vue-next';
import { onMounted, computed } from 'vue';
import { useTranslateStore } from '@/stores/useTranslateStore';

const store = useTranslateStore();

// Calculate months running since August 1, 2025
const monthsRunning = computed(() => {
    const startDate = new Date('2025-08-01');
    const currentDate = new Date();

    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.max(1, Math.ceil(diffDays / 30));

    return diffMonths;
});

// Initialize store listeners for live data
onMounted(() => {
    store.initializeAllListeners();

    // Load flag icons CSS
    if (!document.querySelector('#flag-icons-css')) {
        const link = document.createElement('link');
        link.id = 'flag-icons-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@6.6.6/css/flag-icons.min.css';
        document.head.appendChild(link);
    }
});
</script>

<style scoped>
/* Fade in animation */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.6s ease-out;
}

/* Flag styling */
.fi {
    @apply inline-block rounded-md shadow-md transition-all;
    width: 1.5em;
    height: 1.125em;
}

/* FAQ Smooth animations */
.faq-item {
    @apply transition-all duration-200;
}

.faq-item summary::-webkit-details-marker {
    display: none;
}

.faq-item summary {
    @apply transition-all duration-200;
}

.faq-item[open] summary {
    @apply rounded-b-none;
}

.faq-content {
    animation: slideDown 0.3s ease-out;
    overflow: hidden;
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        max-height: 200px;
        transform: translateY(0);
    }
}

/* Custom scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    @apply bg-zinc-900;
}

::-webkit-scrollbar-thumb {
    @apply bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors;
}

/* Code styling */
code {
    @apply font-mono text-sm;
}

/* Hover glow effect for feature cards */
.group:hover .absolute.inset-0 {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.1;
    }

    50% {
        opacity: 0.2;
    }
}

/* Ensure bento boxes have consistent rounded corners */
.grid>div {
    @apply rounded-2xl;
}
</style>