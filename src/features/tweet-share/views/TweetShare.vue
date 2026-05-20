<template>
    <div class="theme-x2vertical x2v-root min-h-screen overflow-x-hidden relative" :class="themeClass">

        <!-- Subtle dot grid background -->
        <div class="fixed inset-0 pointer-events-none z-0 x2v-dot-grid" aria-hidden="true" />
        <!-- Radial glow center -->
        <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0 x2v-top-glow" />

        <div class="relative z-10">

            <!-- ===== NAV ===== -->
            <nav class="sticky top-0 z-50 border-b border-white/5 x2v-nav-bg">
                <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    <!-- Logo lockup -->
                    <div class="flex items-center gap-0">
                        <!-- X2 branding logo -->
                        <img
                            :src="Logo"
                            alt="X2Vertical logo"
                            class="w-10 h-10 flex-shrink-0 object-contain"
                            />
                        <span class="x2v-wordmark text-xl font-bold tracking-tight select-none">X2Vertical</span>
                    </div>

                    <!-- Right buttons & Avatar -->
                    <div class="flex items-center gap-4">
                        <!-- Dark mode toggle -->
                        <button
                            type="button"
                            class="x2v-theme-toggle w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
                            :title="isLightMode ? 'Switch to dark mode' : 'Switch to light mode'"
                            :aria-label="isLightMode ? 'Switch to dark mode' : 'Switch to light mode'"
                            :aria-pressed="isLightMode"
                            @click="togglePageTheme"
                        >
                            <Moon v-if="isLightMode" class="w-4 h-4" />
                            <Sun v-else class="w-4 h-4" />
                        </button>
                        <!-- How it works button -->
                        <div ref="infoPopoverRef" class="relative">
                            <button
                                type="button"
                                class="x2v-nav-action flex items-center gap-1.5 px-3.5 py-1.5 border rounded-lg text-xs font-semibold transition-all"
                                :aria-expanded="isInfoOpen"
                                aria-haspopup="dialog"
                                @click="toggleInfoPopover"
                            >
                                <CircleHelp class="w-3.5 h-3.5" />
                                How it works
                            </button>
                            <div v-if="isInfoOpen" class="x2v-popover x2v-info-popover absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-xl p-4 text-left z-[60]">
                                <h3 class="text-sm font-bold mb-2">How it works</h3>
                                <p class="text-xs leading-relaxed">
                                    Paste an X post link and hit <span class="font-semibold">Get Post</span>. We check the cache first. If it is new, we request the post from the X API, then send the post content to the server to create a vertical file.
                                </p>
                                <p class="text-xs leading-relaxed mt-2">
                                    Posts with video or GIF media become a video, up to 2 minutes long. Image-only or text-only posts become an image. The tweet content is cached, then the finished file is served back for saving.
                                </p>
                            </div>
                        </div>
                        <!-- User Avatar -->
                        <div ref="profilePopoverRef" class="relative">
                            <button
                                type="button"
                                class="x2v-profile-btn w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors"
                                title="Profile"
                                aria-label="Profile"
                                :aria-expanded="isProfileOpen"
                                aria-haspopup="menu"
                                @click="toggleProfileMenu"
                            >
                                <CircleUserRound class="w-5 h-5" />
                            </button>
                            <div v-if="isProfileOpen" class="x2v-popover x2v-profile-menu absolute right-0 top-full mt-3 w-64 rounded-xl p-3 text-left z-[60]" role="menu">
                                <div class="flex items-start gap-2.5 px-2 py-2">
                                    <Mail class="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div class="min-w-0">
                                        <p class="text-[11px] font-semibold uppercase tracking-wide opacity-70">{{ isAuthenticated ? 'Signed in as' : 'Account' }}</p>
                                        <p class="text-xs font-semibold truncate">{{ userEmail }}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    class="x2v-menu-action mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all"
                                    role="menuitem"
                                    @click="handleAuthAction"
                                >
                                    <LogOut v-if="isAuthenticated" class="w-4 h-4" />
                                    <LogIn v-else class="w-4 h-4" />
                                    {{ isAuthenticated ? 'Log out' : 'Log in' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- ===== HERO ===== -->
            <section class="relative pt-20 pb-16 px-4 text-center overflow-visible">

                <div class="relative z-10 max-w-3xl mx-auto">
                    <h1 class="x2v-headline text-5xl sm:text-6xl lg:text-[72px] font-extrabold leading-[1.08] tracking-tight mb-6">
                        Turn any X post<br>into a shareable<br>
                        <span class="relative inline-block px-10">
                            <!-- Left dashes -->
                            <svg class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <path d="M18 8c-3-1-6-3-8-6" />
                                <path d="M20 12c-4 0-8-1-11-3" />
                                <path d="M18 16c-3 1-6 3-8 6" />
                            </svg>
                            <span class="x2v-gradient-text">vertical video</span>
                            <!-- Right dashes -->
                            <svg class="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                                <path d="M6 8c3-1 6-3 8-6" />
                                <path d="M4 12c4 0 8-1 11-3" />
                                <path d="M6 16c3 1 6 3 8 6" />
                            </svg>
                        </span>
                    </h1>
                    <p class="x2v-page-muted text-base sm:text-lg mb-10 leading-snug">
                        Drop a link. Get a clean 9:16 video.<br class="hidden sm:block">
                        No watermark. No spam. <span class="text-[#3b82f6] font-semibold">Just the post.</span>
                    </p>

                    <!-- URL input & decorative icons -->
                    <div class="relative max-w-2xl mx-auto mb-3">
                        <!-- Hand-drawn arrow left (purple) -->
                        <div class="absolute -left-24 top-[-30px] hidden lg:block pointer-events-none">
                            <svg viewBox="0 0 100 80" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" class="w-20 h-16">
                                <path d="M 20 10 C 10 30, 15 55, 45 65" />
                                <path d="M 34 60 L 45 65 L 42 52" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <!-- Phone icon right (blue, tilted) with waves -->
                        <div class="absolute -right-32 top-[-50px] hidden lg:block pointer-events-none">
                            <svg viewBox="0 0 100 120" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" class="w-24 h-28">
                                <g transform="rotate(15 50 60)">
                                    <rect x="25" y="15" width="50" height="90" rx="10" stroke="#3b82f6" stroke-width="2" fill="#0b0b10" />
                                    <line x1="45" y1="22" x2="55" y2="22" stroke="#3b82f6" stroke-width="1.5" />
                                    <line x1="43" y1="97" x2="57" y2="97" stroke="#3b82f6" stroke-width="1.5" />
                                    <polygon points="45,50 62,60 45,70" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round" fill="none" />
                                </g>
                                <path d="M 85 25 L 93 20" stroke="#3b82f6" stroke-width="2" />
                                <path d="M 91 33 L 99 33" stroke="#3b82f6" stroke-width="2" />
                                <path d="M 87 43 L 94 46" stroke="#3b82f6" stroke-width="2" />
                            </svg>
                        </div>

                        <!-- URL Input Bar -->
                        <div class="x2v-input-wrap flex items-center gap-2 p-1.5 pl-4 bg-[#09090d]/60 backdrop-blur-md rounded-2xl">
                            <div class="flex-grow flex items-center gap-3 min-w-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="x2v-input-icon w-5 h-5 flex-shrink-0">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                                </svg>
                                <input
                                    v-model="tweetUrl"
                                    type="url"
                                    placeholder="Paste an X (Twitter) post link here..."
                                    class="flex-1 bg-transparent text-sm focus:outline-none py-2"
                                    @keydown.enter="loadTweet"
                                />
                            </div>
                            <button
                                @click="loadTweet"
                                :disabled="!tweetUrl.trim() || loading"
                                class="x2v-generate-btn flex items-center gap-2 px-6 py-3.5 font-bold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 whitespace-nowrap"
                            >
                                <LoaderCircle v-if="loading" class="w-4 h-4 animate-spin" />
                                <Import v-else class="w-4 h-4" />
                                {{ loading ? 'Getting...' : 'Get Post' }}
                            </button>
                        </div>
                    </div>
                    <!-- Background Picker -->
                    <div class="mt-8 flex items-center justify-center gap-4 flex-wrap">
                        <span class="x2v-page-muted font-semibold text-sm">Background</span>
                        <div class="flex items-center gap-3">
                            <button
                                v-for="variant in quickBackgroundVariants"
                                :key="variant.id"
                                type="button"
                                @click="selectBackgroundVariant(variant.id)"
                                class="x2v-bg-swatch-btn w-9 h-9 rounded-full transition-all duration-150 flex-shrink-0"
                                :class="isBackgroundSelected(variant.id) ? 'x2v-bg-swatch-btn-active' : 'x2v-bg-swatch-btn-idle'"
                                :style="getVibeSwatchStyle(variant)"
                                :title="`${variant.name} vibe`"
                                :aria-label="`${variant.name} background`"
                            />
                            <div ref="vibePopoverRef" class="relative flex items-center">
                                <button
                                    type="button"
                                    @click="toggleVibePopover"
                                    class="x2v-bg-swatch-btn w-9 h-9 rounded-full transition-all duration-150 flex-shrink-0 relative overflow-hidden"
                                    :class="isVibePopoverOpen || isExpandedBackgroundSelected ? 'x2v-bg-swatch-btn-active' : 'x2v-bg-swatch-btn-idle'"
                                    :style="getVibeSwatchStyle(selectedExpandedBackgroundVariant || moreBackgroundVariant)"
                                    title="More background options"
                                    aria-label="More background options"
                                    aria-haspopup="dialog"
                                    :aria-expanded="isVibePopoverOpen"
                                >
                                    <Ellipsis class="absolute inset-0 m-auto w-5 h-5 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]" />
                                </button>
                                <div v-if="isVibePopoverOpen" class="x2v-popover x2v-vibe-popover absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-xl p-3 text-left z-[60]">
                                    <div class="grid grid-cols-4 gap-2">
                                        <button
                                            v-for="variant in backgroundVariants"
                                            :key="variant.id"
                                            type="button"
                                            class="x2v-vibe-option"
                                            :class="{ 'x2v-vibe-option-active': isBackgroundSelected(variant.id) }"
                                            :title="variant.name"
                                            :aria-label="`${variant.name} background`"
                                            @click="selectBackgroundVariant(variant.id)"
                                        >
                                            <span class="x2v-vibe-swatch" :style="getVibeSwatchStyle(variant)" />
                                            <span class="x2v-vibe-name">{{ variant.name }}</span>
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        class="x2v-vibe-examples-btn mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all"
                                        @click="openVibeExamples"
                                    >
                                        <Palette class="w-4 h-4" />
                                        Preview Styles
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Cursive arrow / text label -->
                        <span class="flex items-center gap-2 text-violet-400 font-semibold tracking-wide select-none" style="font-family: 'Caveat', cursive; font-size: 1.4rem;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-5 h-5">
                                <path d="M 20 12 L 6 12" />
                                <path d="M 12 18 L 6 12 L 12 6" stroke-linejoin="round" />
                            </svg>
                            Pick your vibe
                        </span>
                    </div>
                </div>
            </section>

            <!-- ===== RECENTS ===== -->
            <section class="x2v-recents-section relative px-4 pt-14 pb-10">
                <div class="max-w-6xl mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-3">
                        <h2 class="text-3xl font-extrabold">Recents</h2>
                        <!-- Lightning icon -->
                        <Zap class="w-5 h-5 text-violet-500 fill-violet-500/20" />
                    </div>
                    <button class="x2v-nav-action flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-semibold transition-all">
                        View all
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </button>
                </div>

                <!-- Empty state -->
                <div v-if="recentImports.length === 0" class="x2v-empty-state rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
                    <div class="w-14 h-14 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-violet-400">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </div>
                    <p class="font-bold text-xl">No posts cached yet</p>
                    <p class="x2v-page-muted text-sm max-w-xs leading-relaxed">
                        Paste an X post link above to generate your first vertical video.
                        Processed posts are cached globally to save API calls.
                    </p>
                </div>

                <!-- Phone card grid (Styled like Twitter, but overall layout matches mockup) -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        v-for="(item, idx) in recentImports"
                        :key="item.id"
                        class="x2v-phone-card cursor-pointer group relative flex flex-col"
                        :class="idx === 0 ? 'x2v-phone-recent' : ''"
                        @click="activeIdx = idx; loadFromCache(item); openPreviewModal(item)"
                        @mouseenter="handleMouseEnter($event, item)"
                        @mouseleave="handleMouseLeave($event, item)"
                    >
                        <!-- 9:16 phone frame -->
                        <div class="relative w-full overflow-hidden rounded-[20px] bg-black border transition-all duration-200 flex flex-col" style="aspect-ratio: 9/16; padding: 14px;">
                            
                            <!-- Header: Avatar, Name, Verified, Handle, Close/Delete button -->
                            <div class="flex items-start gap-2.5 mb-2.5 flex-shrink-0">
                                <!-- Avatar -->
                                <div class="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                                    :style="{ background: item.avatarColor || '#1d4ed8' }">
                                    {{ item.displayName.charAt(0) }}
                                </div>
                                
                                <!-- User info -->
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-1">
                                        <span class="font-bold text-[12px] leading-tight text-white truncate" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                            {{ item.displayName }}
                                        </span>
                                        <!-- Blue Verified Badge -->
                                        <svg v-if="item.verified" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-[#1d9bf0] flex-shrink-0">
                                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91-1.01-1.01-2.52-1.27-3.91-.81-.66-1.31-1.9-2.19-3.34-2.19-1.43 0-2.67.88-3.33 2.19-1.4-.46-2.91-.2-3.92.81-1.01 1.01-1.27 2.52-.8 3.91C2.88 9.33 2 10.57 2 12c0 1.43.88 2.67 2.19 3.34-.46 1.39-.2 2.9.81 3.91 1.01 1.01 2.52 1.27 3.91.81.66 1.31 1.9 2.19 3.34 2.19 1.43 0 2.67-.88 3.33-2.19 1.4.46 2.91.2 3.92-.81 1.01-1.01 1.27-2.52.8-3.91C21.37 14.67 22.25 13.43 22.25 12zm-6.44-3.53L10.66 14l-2.41-2.38a.75.75 0 10-1.06 1.06l3 2.95a.75.75 0 001.08-.02l5.65-6.05a.75.75 0 10-1.1-1.02z"/>
                                        </svg>
                                    </div>
                                    <div class="text-[11px] text-slate-400" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                        @{{ item.handle }}
                                    </div>
                                </div>
                                
                                <!-- Delete/Close button omitted -->
                            </div>
                            
                            <!-- Media Cards Layout (Cards 1, 2, 4) -->
                            <template v-if="item.mediaType !== 'none'">
                                <!-- Tweet Text content -->
                                <div class="text-[12.5px] leading-[1.4] text-white/95 mb-3 flex-shrink-0 select-text" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-wrap: break-word; overflow-wrap: break-word;">
                                    <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
                                        <span v-if="part.startsWith('@')" class="text-[#1d9bf0] hover:underline cursor-pointer">{{ part }}</span>
                                        <span v-else>{{ part }}</span>
                                    </template>
                                </div>
                                
                                <!-- Media Block (No border here!) -->
                                <div class="flex-grow min-h-0 relative rounded-xl overflow-hidden mb-3 bg-black" :style="{ background: item.mediaBg || '#0f172a' }">
                                    <!-- GIF Card (Card 1) -->
                                    <template v-if="item.mediaType === 'gif'">
                                        <canvas :id="'canvas-' + item.id" class="absolute inset-0 w-full h-full object-cover" :class="hoveredId === item.id ? 'hidden' : 'block'" />
                                        <img
                                            :src="item.mediaUrl"
                                            class="absolute inset-0 w-full h-full object-cover"
                                            :class="hoveredId === item.id ? 'block' : 'hidden'"
                                            @load="event => drawStaticFrame(event, item.id)"
                                            alt="GIF Preview"
                                        />
                                    </template>
                                    
                                    <!-- Video Card (Card 2) -->
                                    <template v-if="item.mediaType === 'video'">
                                        <video
                                            class="absolute inset-0 w-full h-full object-cover"
                                            :poster="item.mediaUrl"
                                            :src="item.videoUrl"
                                            loop
                                            muted
                                            playsinline
                                        />
                                    </template>
                                    
                                    <!-- Static Image Card (Card 4) -->
                                    <template v-if="item.mediaType === 'image'">
                                        <img :src="item.mediaUrl" class="absolute inset-0 w-full h-full object-cover" alt="Image Preview" />
                                    </template>

                                    <!-- Video duration overlay (absolute, styled with glassmorphism) -->
                                    <div v-if="item.duration" class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-semibold text-white/95 flex items-center gap-1 z-10 select-none border border-white/10">
                                        <svg viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 text-white/90"><path d="M8 5v14l11-7z"/></svg>
                                        {{ item.duration }}
                                    </div>
                                </div>
                                
                                <!-- Bottom Row inside card frame (timestamp and X logo) -->
                                <div class="flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 flex-shrink-0">
                                    <span class="text-[10px] text-slate-500" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                        {{ item.timestamp }}
                                    </span>
                                    <!-- X Logo -->
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-white/40">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </div>
                            </template>
                            
                            <!-- Text-Only Card Layout (Card 3: Centered vertically, text left-aligned) -->
                            <template v-else>
                                <!-- Left-aligned, vertically centered Tweet Text -->
                                <div class="flex-grow flex flex-col justify-center px-1 select-text text-left">
                                    <div class="text-[14px] leading-[1.5] text-white/95 font-normal" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; word-wrap: break-word; overflow-wrap: break-word;">
                                        <template v-for="(part, pIdx) in formatTweetText(item.text)" :key="pIdx">
                                            <span v-if="part.startsWith('@')" class="text-[#1d9bf0] hover:underline cursor-pointer font-medium">{{ part }}</span>
                                            <span v-else>{{ part }}</span>
                                        </template>
                                    </div>
                                </div>
                                
                                <!-- Bottom Row inside card frame (Card 3: timestamp and X logo, no video timer) -->
                                <div class="flex items-center justify-between mt-auto pt-2.5 border-t border-white/5 flex-shrink-0">
                                    <span class="text-[10px] text-slate-500" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                        {{ item.timestamp }}
                                    </span>
                                    <!-- X Logo -->
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-white/40">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </div>
                            </template>
                        </div>
                        
                        <!-- Action buttons below the card -->
                        <div class="mt-3 flex items-center justify-between gap-2.5 px-1 flex-shrink-0">
                            <!-- Download button -->
                            <button @click.stop class="flex-1 py-2 rounded-lg bg-[#09090d]/60 border border-white/5 hover:border-white/15 text-slate-400 hover:text-white transition-all flex items-center justify-center" title="Download Video">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                                </svg>
                            </button>
                            <!-- Copy/Share button -->
                            <button @click.stop class="flex-1 py-2 rounded-lg bg-[#09090d]/60 border border-white/5 hover:border-white/15 text-slate-400 hover:text-white transition-all flex items-center justify-center" title="Copy Link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            </button>
                            <!-- More options button -->
                            <button @click.stop class="flex-1 py-2 rounded-lg bg-[#09090d]/60 border border-white/5 hover:border-white/15 text-slate-400 hover:text-white transition-all flex items-center justify-center" title="More Actions">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                    <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <!-- ===== FEATURES ===== -->
            <section class="x2v-features-section px-4 pt-10 pb-12">
                <div class="x2v-feature-panel max-w-5xl mx-auto backdrop-blur-md rounded-2xl p-8 sm:p-10">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div class="flex flex-col gap-3">
                            <div class="w-12 h-12 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                                </svg>
                            </div>
                            <h3 class="font-bold text-[15px] tracking-wide mt-1">Just paste a link</h3>
                            <p class="x2v-page-muted text-xs leading-relaxed">No login. No API key.<br>No nonsense.</p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <div class="w-12 h-12 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-6 h-6">
                                    <rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="18" r="1" fill="currentColor"/>
                                </svg>
                            </div>
                            <h3 class="font-bold text-[15px] tracking-wide mt-1">Made for mobile</h3>
                            <p class="x2v-page-muted text-xs leading-relaxed">Perfect 9:16 format.<br>Share anywhere.</p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <div class="w-12 h-12 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" class="w-6 h-6">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 class="font-bold text-[15px] tracking-wide mt-1">Fast &amp; clean</h3>
                            <p class="x2v-page-muted text-xs leading-relaxed">High quality videos,<br>ready in seconds.</p>
                        </div>
                        <div class="flex flex-col gap-3">
                            <div class="w-12 h-12 rounded-xl border border-violet-500/20 bg-violet-500/5 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" class="w-6 h-6">
                                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                                </svg>
                            </div>
                            <h3 class="font-bold text-[15px] tracking-wide mt-1">Private by design</h3>
                            <p class="x2v-page-muted text-xs leading-relaxed">We don't store your data.<br>Your links. Your content.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===== FOOTER ===== -->
            <footer class="x2v-footer py-12 text-center border-t">
                <p class="text-violet-400 font-semibold tracking-wide select-none" style="font-family: 'Caveat', cursive; font-size: 1.6rem;">
                    Made with caffeine and spite ♡
                </p>
            </footer>

        </div>
    </div>

    <Transition name="fade">
        <div v-if="isVibeExamplesOpen" class="theme-x2vertical fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6" :class="themeClass">
            <div class="absolute inset-0 bg-[#050508]/80 backdrop-blur-md" @click="isVibeExamplesOpen = false" />
            <div class="x2v-popover x2v-example-modal relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-5">
                <div class="flex items-center justify-between gap-4 mb-4">
                    <div class="min-w-0">
                        <h3 class="text-md font-bold">Preview Styles</h3>
                        <p class="text-xs mt-1 truncate">{{ selectedBackgroundVariant.name }} background</p>
                    </div>
                    <button
                        type="button"
                        class="x2v-theme-toggle w-8 h-8 rounded-full border flex items-center justify-center transition-colors flex-shrink-0"
                        aria-label="Close examples"
                        @click="isVibeExamplesOpen = false"
                    >
                        <X class="w-4 h-4" />
                    </button>
                </div>

                <div v-if="exampleTweet" class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] gap-5 items-start">
                    <div class="x2v-example-phone relative w-full max-w-[280px] mx-auto rounded-[24px] p-4 overflow-hidden lg:order-2" :style="selectedExampleCardStyle">
                        <div class="relative z-10 h-full flex flex-col min-h-[498px]">
                            <div class="flex items-start gap-2.5 mb-3 flex-shrink-0">
                                <div
                                    class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                                    :style="{ background: exampleTweet.avatarColor || '#1d4ed8' }"
                                >
                                    {{ exampleTweet.displayName.charAt(0) }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="x2v-example-name font-bold text-[13px] leading-tight truncate">
                                        {{ exampleTweet.displayName }}
                                    </div>
                                    <div class="x2v-example-muted text-[11.5px]">
                                        @{{ exampleTweet.handle }}
                                    </div>
                                </div>
                            </div>

                            <div class="x2v-example-text text-[13px] leading-[1.4] mb-3 flex-shrink-0">
                                <template v-for="(part, pIdx) in formatTweetText(exampleTweet.text)" :key="pIdx">
                                    <span v-if="part.startsWith('@')" class="x2v-example-link">{{ part }}</span>
                                    <span v-else>{{ part }}</span>
                                </template>
                            </div>

                            <div v-if="exampleTweet.mediaType !== 'none'" class="x2v-example-media flex-grow min-h-0 relative rounded-xl overflow-hidden mb-3">
                                <img
                                    v-if="exampleTweet.mediaType === 'gif' || exampleTweet.mediaType === 'image'"
                                    :src="exampleTweet.mediaUrl"
                                    class="absolute inset-0 w-full h-full object-cover"
                                    alt="Example post media"
                                />
                                <video
                                    v-else-if="exampleTweet.mediaType === 'video'"
                                    :poster="exampleTweet.mediaUrl"
                                    :src="exampleTweet.videoUrl"
                                    class="absolute inset-0 w-full h-full object-cover"
                                    muted
                                    loop
                                    playsinline
                                />
                                <div v-if="exampleTweet.duration" class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-semibold text-white/95 flex items-center gap-1 z-10 border border-white/10">
                                    {{ exampleTweet.duration }}
                                </div>
                            </div>

                            <div class="x2v-example-footer flex items-center justify-between mt-auto pt-2.5 flex-shrink-0">
                                <span class="x2v-example-muted text-[10px]">{{ exampleTweet.timestamp }}</span>
                                <svg viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 opacity-55">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="x2v-vibe-board rounded-2xl lg:order-1">
                        <div class="x2v-vibe-grid-modal grid">
                            <button
                                v-for="variant in backgroundVariants"
                                :key="variant.id"
                                type="button"
                                class="x2v-vibe-option x2v-vibe-option-modal"
                                :class="{ 'x2v-vibe-option-active': isBackgroundSelected(variant.id) }"
                                :title="variant.name"
                                :aria-label="`${variant.name} background`"
                                @click="selectBackgroundVariant(variant.id)"
                            >
                                <span class="x2v-vibe-swatch" :style="getVibeSwatchStyle(variant)" />
                                <span class="x2v-vibe-name">{{ variant.name }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Tweet Preview Modal -->
    <TweetPreviewModal
        :is-open="isModalOpen"
        :item="selectedModalItem || recentImports[0]"
        @close="isModalOpen = false"
    />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CircleHelp, CircleUserRound, Ellipsis, Import, LoaderCircle, LogIn, LogOut, Mail, Moon, Palette, Sun, X, Zap } from 'lucide-vue-next'
import { signOut } from '@/auth'
import { useMainStore } from '@/shared/stores/useMainStore'
import TweetPreviewModal from './TweetPreviewModal.vue'
import Logo from '../assets/X2Vertical.png'

const router = useRouter()
const mainStore = useMainStore()

const X2V_THEME_KEY = 'x2vertical-theme'
const savedPageTheme = typeof window !== 'undefined' ? window.localStorage.getItem(X2V_THEME_KEY) : null
const isLightMode = ref(savedPageTheme === 'light')
const themeClass = computed(() => isLightMode.value ? 'x2v-light' : 'x2v-dark')
const isInfoOpen = ref(false)
const isProfileOpen = ref(false)
const isVibePopoverOpen = ref(false)
const isVibeExamplesOpen = ref(false)
const infoPopoverRef = ref(null)
const profilePopoverRef = ref(null)
const vibePopoverRef = ref(null)
const isAuthenticated = computed(() => mainStore.isAuthenticated)
const userEmail = computed(() => mainStore.user?.email || 'Not signed in')

function togglePageTheme() {
    isLightMode.value = !isLightMode.value
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(X2V_THEME_KEY, isLightMode.value ? 'light' : 'dark')
    }
}

function toggleInfoPopover() {
    isInfoOpen.value = !isInfoOpen.value
    if (isInfoOpen.value) {
        isProfileOpen.value = false
        isVibePopoverOpen.value = false
    }
}

function toggleProfileMenu() {
    isProfileOpen.value = !isProfileOpen.value
    if (isProfileOpen.value) {
        isInfoOpen.value = false
        isVibePopoverOpen.value = false
    }
}

function toggleVibePopover() {
    isVibePopoverOpen.value = !isVibePopoverOpen.value
    if (isVibePopoverOpen.value) {
        isInfoOpen.value = false
        isProfileOpen.value = false
    }
}

async function handleAuthAction() {
    isProfileOpen.value = false
    if (isAuthenticated.value) {
        await signOut()
        return
    }

    await router.push({ path: '/login', query: { redirect: '/tweet-share' } })
}

function openVibeExamples() {
    isVibePopoverOpen.value = false
    isVibeExamplesOpen.value = true
}

function closePopovers() {
    isInfoOpen.value = false
    isProfileOpen.value = false
    isVibePopoverOpen.value = false
}

function handleOutsidePopoverPointerDown(event) {
    const target = event.target
    if (!target) return

    const clickedInfoPopover = infoPopoverRef.value?.contains(target)
    const clickedProfilePopover = profilePopoverRef.value?.contains(target)
    const clickedVibePopover = vibePopoverRef.value?.contains(target)

    if (!clickedInfoPopover && !clickedProfilePopover && !clickedVibePopover) {
        closePopovers()
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleOutsidePopoverPointerDown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsidePopoverPointerDown)
})

const tweetUrl = ref('')
const loading = ref(false)
const activeIdx = ref(0)

const isModalOpen = ref(false)
const selectedModalItem = ref(null)

function openPreviewModal(item) {
    selectedModalItem.value = item
    isModalOpen.value = true
}

const settings = reactive({ background: 'black' })

const backgroundVariants = [
    { id: 'black', name: 'Void', css: '#000000', type: 'solid' },
    { id: 'slate', name: 'Graphite', css: '#1e293b', type: 'solid' },
    { id: 'white', name: 'Paper', css: '#ffffff', type: 'solid', textTone: 'dark' },
    { id: 'royal', name: 'Royal', css: '#4f46e5', type: 'solid' },
    { id: 'lagoon', name: 'Lagoon', css: '#0891b2', type: 'solid' },
    { id: 'rosewood', name: 'Rosewood', css: '#be123c', type: 'solid' },
    { id: 'aurora', name: 'Aurora', css: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 52%, #f472b6 100%)', type: 'gradient' },
    { id: 'night-city', name: 'Night City', css: 'linear-gradient(135deg, #0f172a 0%, #312e81 48%, #7c3aed 100%)', type: 'gradient' },
    { id: 'blue-hour', name: 'Blue Hour', css: 'linear-gradient(135deg, #020617 0%, #1d4ed8 54%, #06b6d4 100%)', type: 'gradient' },
    { id: 'candy', name: 'Candy', css: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 48%, #60a5fa 100%)', type: 'gradient', textTone: 'dark' },
    { id: 'signal', name: 'Signal', css: 'linear-gradient(135deg, #052e16 0%, #16a34a 52%, #bef264 100%)', type: 'gradient' },
    { id: 'sunset', name: 'Sunset', css: 'linear-gradient(135deg, #fb7185 0%, #f97316 50%, #facc15 100%)', type: 'gradient' },
    { id: 'lava', name: 'Lava', css: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 48%, #f97316 100%)', type: 'gradient' },
    { id: 'deep-space', name: 'Deep Space', css: 'linear-gradient(135deg, #020617 0%, #581c87 52%, #0e7490 100%)', type: 'gradient' },
    { id: 'mint', name: 'Mint Glass', css: 'linear-gradient(135deg, #ccfbf1 0%, #67e8f9 48%, #a7f3d0 100%)', type: 'gradient', textTone: 'dark' },
    { id: 'prism', name: 'Prism', css: 'linear-gradient(135deg, #ef4444 0%, #eab308 26%, #22c55e 52%, #3b82f6 76%, #a855f7 100%)', type: 'gradient' },
]

const quickBackgroundVariants = computed(() => backgroundVariants.slice(0, 3))
const moreBackgroundVariant = backgroundVariants[7]
const selectedBackgroundVariant = computed(() => backgroundVariants.find(variant => variant.id === settings.background) || backgroundVariants[0])
const isExpandedBackgroundSelected = computed(() => !quickBackgroundVariants.value.some(variant => variant.id === settings.background))
const selectedExpandedBackgroundVariant = computed(() => isExpandedBackgroundSelected.value ? selectedBackgroundVariant.value : null)
const selectedExampleCardStyle = computed(() => {
    const useDarkText = selectedBackgroundVariant.value.textTone === 'dark'
    return {
        background: selectedBackgroundVariant.value.css,
        '--x2v-example-text': useDarkText ? '#0f172a' : '#ffffff',
        '--x2v-example-muted': useDarkText ? 'rgba(15, 23, 42, 0.62)' : 'rgba(226, 232, 240, 0.68)',
        '--x2v-example-border': useDarkText ? 'rgba(15, 23, 42, 0.16)' : 'rgba(255, 255, 255, 0.14)',
        '--x2v-example-link': useDarkText ? '#0369a1' : '#38bdf8',
    }
})

function selectBackgroundVariant(id) {
    settings.background = id
    isVibePopoverOpen.value = false
}

function isBackgroundSelected(id) {
    return settings.background === id
}

function getVibeSwatchStyle(variant) {
    return { background: variant.css }
}

const dotGrid = [
    {x:2,y:2},{x:7,y:2},{x:12,y:2},
    {x:2,y:7},{x:7,y:7},{x:12,y:7},
    {x:2,y:12},{x:7,y:12},{x:12,y:12},
]

const recentImports = ref([
    {
        id: '1',
        displayName: 'Marie 🐈',
        handle: 'glitchu_',
        avatarColor: '#7c2d82',
        verified: false,
        text: 'why is my STOMACH GROWLING. EAT THE FAT. THATS FHE POINT.',
        mediaType: 'gif',
        mediaUrl: 'https://i.pinimg.com/originals/26/90/95/269095a59adfd1a4397f1ed39b810759.gif',
        mediaBg: '#181124',
        duration: '0:03',
        timestamp: '8:14 AM · May 20, 2026',
        cardTheme: 'dark',
    },
    {
        id: '2',
        displayName: '✝ Rush Ganyu ✝',
        handle: 'basedganyu',
        avatarColor: '#4338ca',
        verified: true,
        text: 'My friend just asked me to redownload Destiny 2',
        mediaType: 'video',
        mediaUrl: 'https://pbs.twimg.com/amplify_video_thumb/2050678992089292800/img/ThotTIKlVWRUdDzJ.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        mediaBg: '#0d1520',
        duration: '0:05',
        timestamp: '8:42 PM · May 19, 2026',
        cardTheme: 'dark',
    },
    {
        id: '3',
        displayName: 'That Mason Guy',
        handle: 'That_MasonGuy',
        avatarColor: '#0369a1',
        verified: true,
        text: "trying to build a simple app that shares x posts off-platform so my friends can see the good memes too, and somehow the privilege of free advertising costs a stupid amount of money. classic. thanks @XDevelopers",
        mediaType: 'none',
        mediaUrl: null,
        mediaBg: null,
        duration: null,
        timestamp: '10:31 AM · May 10, 2026',
        cardTheme: 'dark',
        replies: 1,
        likes: 1,
    },
    {
        id: '4',
        displayName: 'Dexerto',
        handle: 'Dexerto',
        avatarColor: '#b45309',
        verified: true,
        text: 'You can now play as Master Chief in Fortnite',
        mediaType: 'image',
        mediaUrl: 'https://www.svg.com/img/gallery/the-untold-truth-of-halos-master-chief/intro-1603465431.jpg',
        mediaBg: '#0d2010',
        duration: null,
        timestamp: '7:00 PM · May 19, 2026',
        cardTheme: 'dark',
    },
])

const exampleTweet = computed(() => recentImports.value[0])

const formatTweetText = (text) => {
    if (!text) return []
    return text.split(/(\s+)/)
}

const hoveredId = ref(null)

function drawStaticFrame(event, id) {
    const img = event.target
    const canvas = document.getElementById('canvas-' + id)
    if (canvas && img) {
        canvas.width = img.naturalWidth || img.width || 300
        canvas.height = img.naturalHeight || img.height || 500
        const ctx = canvas.getContext('2d')
        try {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        } catch (e) {
            console.warn('Canvas draw failed (CORS), falling back to GIF:', e)
            canvas.style.display = 'none'
            img.style.display = 'block'
            img.classList.remove('hidden')
        }
    }
}

function handleMouseEnter(event, item) {
    hoveredId.value = item.id
    const video = event.currentTarget.querySelector('video')
    if (video) {
        video.play().catch(err => {
            console.log('Video play interrupted:', err)
        })
    }
}

function handleMouseLeave(event, item) {
    hoveredId.value = null
    const video = event.currentTarget.querySelector('video')
    if (video) {
        video.pause()
        video.currentTime = 0
    }
}

function loadTweet() {
    if (!tweetUrl.value.trim() || loading.value) return
    loading.value = true
    setTimeout(() => {
        loading.value = false
        // TODO: const data = await api.fetchTweet(tweetUrl.value)
    }, 800)
}

function loadFromCache(item) {
    console.log('Loading from cache:', item.id)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&family=Oxanium:wght@500;600;700;800&display=swap');

/* ─── Roots ──────────────────────────────────────────────────────────────── */
.x2v-root {
    background: var(--x2v-bg);
    color: var(--x2v-text);
    font-family: 'Sora', sans-serif;
    transition: background-color 0.25s ease, color 0.25s ease;
}

/* ─── Typography roles ───────────────────────────────────────────────────── */
.x2v-wordmark  {
    color: var(--x2v-text-strong);
    font-family: 'Oxanium', sans-serif;
}
.x2v-headline  {
    color: var(--x2v-text-strong);
    font-family: 'Sora', sans-serif;
    letter-spacing: -0.03em;
}
.x2v-page-muted {
    color: var(--x2v-text-muted);
}

/* ─── Brand gradient ─────────────────────────────────────────────────────── */
.x2v-gradient-text {
    background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #00d8f6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ─── Nav ────────────────────────────────────────────────────────────────── */
.x2v-nav-bg {
    background: var(--x2v-nav-bg);
    border-color: var(--x2v-border-soft) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
}
.x2v-top-glow {
    background: radial-gradient(ellipse at center top, var(--x2v-top-glow) 0%, transparent 65%);
}
.x2v-theme-toggle,
.x2v-nav-action {
    background: var(--x2v-control-bg);
    border-color: var(--x2v-border);
    color: var(--x2v-text-muted);
}
.x2v-theme-toggle:hover,
.x2v-nav-action:hover {
    background: var(--x2v-control-hover-bg);
    border-color: var(--x2v-border-strong);
    color: var(--x2v-text-strong);
}
.x2v-profile-btn {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.22));
    border-color: var(--x2v-border);
    color: var(--x2v-text-strong);
}
.x2v-profile-btn:hover {
    border-color: rgba(139, 92, 246, 0.55);
    color: #ffffff;
}
.x2v-popover {
    background: var(--x2v-popover-bg);
    border: 1px solid var(--x2v-border);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
    color: var(--x2v-text);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
}
.x2v-popover h3 {
    color: var(--x2v-text-strong);
}
.x2v-popover p {
    color: var(--x2v-text-muted);
}
.x2v-profile-menu svg {
    color: var(--x2v-text-muted);
}
.x2v-menu-action {
    background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #00d8f6 100%);
    color: #ffffff;
    box-shadow: 0 8px 18px rgba(59, 130, 246, 0.22);
}
.x2v-menu-action:hover {
    filter: brightness(1.06);
}
.x2v-menu-action svg {
    color: currentColor;
}
.x2v-bg-swatch-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    border: 0;
    box-shadow: 0 0 0 1px var(--x2v-border);
    background-clip: padding-box;
    transform: none;
}
.x2v-bg-swatch-btn-idle:hover {
    box-shadow:
        inset 0 0 0 2px rgba(168, 85, 247, 0.74),
        0 0 10px rgba(139, 92, 246, 0.42);
}
.x2v-bg-swatch-btn-active,
.x2v-bg-swatch-btn-active:hover {
    box-shadow:
        inset 0 0 0 2px #8b5cf6,
        0 0 14px rgba(139, 92, 246, 0.78);
}
.x2v-bg-swatch-btn svg {
    pointer-events: none;
}
.x2v-vibe-popover {
    transform-origin: top right;
}
.x2v-vibe-option {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.25rem;
    border: 0;
    border-radius: 0.75rem;
    background: transparent;
    color: var(--x2v-text-muted);
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.x2v-vibe-option:hover,
.x2v-vibe-option-active {
    background: transparent;
    color: var(--x2v-text-strong);
}
.x2v-vibe-option-active {
    transform: translateY(-1px);
}
.x2v-vibe-swatch {
    display: block;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    border: 0;
    box-shadow:
        inset 0 0 0 1px rgba(255, 255, 255, 0.22),
        inset 0 1px 1px rgba(255, 255, 255, 0.28),
        0 6px 14px rgba(0, 0, 0, 0.18);
}
.x2v-vibe-option-active .x2v-vibe-swatch {
    box-shadow:
        inset 0 0 0 2px #8b5cf6,
        0 0 14px rgba(139, 92, 246, 0.45),
        inset 0 1px 1px rgba(255, 255, 255, 0.28);
}
.x2v-vibe-option:not(.x2v-vibe-option-active):hover .x2v-vibe-swatch {
    box-shadow:
        inset 0 0 0 2px rgba(168, 85, 247, 0.74),
        0 0 12px rgba(139, 92, 246, 0.38),
        inset 0 1px 1px rgba(255, 255, 255, 0.28);
}
.x2v-vibe-option-active:hover .x2v-vibe-swatch {
    box-shadow:
        inset 0 0 0 2px #8b5cf6,
        0 0 16px rgba(139, 92, 246, 0.58),
        inset 0 1px 1px rgba(255, 255, 255, 0.28);
}
.x2v-vibe-name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 0.62rem;
    line-height: 1;
    font-weight: 700;
}
.x2v-vibe-examples-btn {
    background: var(--x2v-control-bg);
    border: 1px solid var(--x2v-border);
    color: var(--x2v-text-strong);
}
.x2v-vibe-examples-btn:hover {
    background: var(--x2v-control-hover-bg);
    border-color: var(--x2v-border-strong);
}
.x2v-example-modal {
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
}
.x2v-example-phone {
    color: var(--x2v-example-text);
    border: 0;
    box-shadow:
        inset 0 0 0 1px var(--x2v-example-border),
        0 18px 44px rgba(0, 0, 0, 0.28);
}
.x2v-example-name,
.x2v-example-text {
    color: var(--x2v-example-text);
}
.x2v-example-muted {
    color: var(--x2v-example-muted);
}
.x2v-example-link {
    color: var(--x2v-example-link);
    font-weight: 600;
}
.x2v-example-media {
    background: rgba(0, 0, 0, 0.24);
    box-shadow: inset 0 0 0 1px var(--x2v-example-border);
}
.x2v-example-footer {
    border-top: 1px solid var(--x2v-example-border);
}
.x2v-vibe-option-modal {
    background: transparent;
    padding: 0.35rem 0.125rem;
}
.x2v-vibe-board {
    width: fit-content;
    justify-self: center;
    padding: 1.85rem 1.25rem;
    background: var(--x2v-control-bg);
    box-shadow: inset 0 0 0 1px var(--x2v-border-soft);
    display: flex;
    align-items: center;
    justify-content: center;
}
.x2v-vibe-grid-modal {
    grid-template-columns: repeat(4, 5.25rem);
    justify-content: center;
    align-content: center;
    column-gap: 0.5rem;
    row-gap: 1.2rem;
}
.x2v-vibe-option-modal .x2v-vibe-swatch {
    width: 4.75rem;
    height: 4.75rem;
}
@media (min-width: 1024px) {
    .x2v-vibe-board {
        min-height: 530px;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.16s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ─── Dot grid background ────────────────────────────────────────────────── */
.x2v-dot-grid {
    background-image: radial-gradient(var(--x2v-dot-color) 1px, transparent 1px);
    background-size: 28px 28px;
}

/* ─── URL input wrap (glowing gradient border) ────────────────────────────── */
.x2v-input-wrap {
    background-image: linear-gradient(var(--x2v-input-bg), var(--x2v-input-bg)), linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #00d8f6 100%);
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    border: 1.5px solid transparent;
    box-shadow:
        0 0 30px rgba(139, 92, 246, 0.12),
        inset 0 1px 1px rgba(255, 255, 255, 0.05);
    transition: background-image 0.2s ease, box-shadow 0.2s ease;
}
.x2v-input-wrap input {
    color: var(--x2v-text-strong);
}
.x2v-input-wrap input::placeholder {
    color: var(--x2v-placeholder);
}
.x2v-input-icon {
    color: var(--x2v-text-faint);
}
.x2v-input-wrap:focus-within {
    box-shadow:
        0 0 35px rgba(139, 92, 246, 0.22),
        inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

/* ─── Generate button ────────────────────────────────────────────────────── */
.x2v-generate-btn {
    background: linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #00d8f6 100%);
    border-radius: 9999px;
    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
    transition: all 0.2s ease;
}
.x2v-generate-btn:hover:not(:disabled) {
    filter: brightness(1.1);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.5);
}

/* ─── Phone cards ────────────────────────────────────────────────────────── */
.x2v-phone-card {
    background: transparent;
    transition: all 0.2s ease;
}
.x2v-phone-card > div.relative {
    border-color: rgba(255, 255, 255, 0.08);
    background: #000000;
}
.x2v-phone-card:hover > div.relative {
    border-color: rgba(255, 255, 255, 0.2);
}
.x2v-phone-recent > div.relative {
    border-color: #8b5cf6 !important;
    box-shadow:
        0 0 0 1px rgba(139, 92, 246, 0.2),
        0 0 24px rgba(124, 58, 237, 0.4),
        inset 0 0 12px rgba(124, 58, 237, 0.08) !important;
}
.x2v-phone-recent:hover > div.relative {
    border-color: #a78bfa !important;
}

/* ─── Action buttons ─────────────────────────────────────────────────────── */
.x2v-phone-card button {
    background: var(--x2v-action-bg);
    border: 1px solid var(--x2v-action-border);
    color: var(--x2v-text-muted);
    transition: all 0.15s ease;
}
.x2v-phone-card button:hover {
    background: var(--x2v-action-hover-bg);
    border-color: var(--x2v-action-hover-border);
    color: var(--x2v-text-strong);
}

.x2v-recents-section {
    background: var(--x2v-recents-bg);
    border-top: 1px solid var(--x2v-border-strong);
    border-bottom: 1px solid var(--x2v-border-strong);
    box-shadow: var(--x2v-band-shadow);
}
.x2v-recents-section h2,
.x2v-empty-state p:first-of-type {
    color: var(--x2v-text-strong);
}
.x2v-empty-state {
    background: var(--x2v-empty-bg);
    border: 1px solid var(--x2v-border);
}
.x2v-features-section {
    background: var(--x2v-feature-bg);
}
.x2v-feature-panel {
    background: var(--x2v-panel-bg);
    border: 1px solid rgba(139, 92, 246, 0.12);
    box-shadow: var(--x2v-panel-shadow);
}
.x2v-feature-panel h3 {
    color: var(--x2v-text-strong);
}
.x2v-footer {
    border-color: var(--x2v-border-soft);
}
</style>
