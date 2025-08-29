<template>
  <div class="w-full relative overflow-hidden flex flex-col flex-1 min-h-0">
    <!-- Enhanced Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900"></div>
    <div class="fixed inset-0 bg-gradient-to-tr from-violet-950/20 via-transparent to-fuchsia-950/20"></div>
    <div
      class="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent">
    </div>

    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 2s;"></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-600/3 to-fuchsia-600/3 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 4s;"></div>
    </div>

    <!-- Noise texture overlay -->
    <div class="fixed inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise"></div>

    <!-- Content -->
    <div class="relative z-10 text-zinc-100 flex-grow flex-col min-h-screen">
      <!-- Header -->
      <header
        class="sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl shadow-xl shadow-black/20">
        <div class="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 ring-1 ring-violet-500/40 shadow-lg shadow-violet-500/20">
              <Trophy class="h-5 w-5 text-violet-200" />
            </div>
            <div>
              <h1
                class="text-xl font-bold leading-none bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                MXN Daily
              </h1>
              <p class="text-xs text-zinc-400 mt-0.5">New challenges at 00:00 UTC</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- Share button (only on game select screen) -->
            <button v-if="!openGame" @click="shareDaily"
              class="px-3 py-1.5 text-xs rounded-lg bg-violet-900/30 border border-violet-700/50 hover:bg-violet-800/40 transition-all duration-200 hover:shadow-lg shadow-violet-500/20 flex items-center gap-1.5">
              <Share2 class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">Share</span>
            </button>

            <button v-if="openGame" @click="closeGame"
              class="px-3 py-1.5 text-xs rounded-lg bg-zinc-900/70 border border-zinc-700/50 hover:bg-zinc-800/70 transition-all duration-200 hover:shadow-lg shadow-black/20">
              ← Back to Games
            </button>

            <!-- Enhanced countdown pill -->
            <div v-if="openGame !== 'wordle-unlimited'"
              class="p-[1px] sm:flex sm:visible rounded-xl bg-gradient-to-r from-violet-500/50 via-fuchsia-500/40 to-violet-500/50 shadow-lg shadow-violet-500/20">
              <div
                class="px-3 py-1.5 rounded-[11px] bg-zinc-950/90 border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                <Clock class="w-3.5 h-3.5 text-zinc-400" />
                <span class="text-zinc-400 text-[11px] leading-none hidden sm:inline">Next in</span>
                <span class="font-mono text-sm font-semibold tracking-wider tabular-nums text-violet-300"
                  :key="countdownKey">
                  {{ countdown }}
                </span>
              </div>
            </div>

            <div v-if="profile?.totalPlays" class="sm:flex items-center gap-2 hidden sm:visible">
              <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <span class="text-xs text-zinc-400">Streak: {{ profile?.currentStreak ?? 0 }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="max-w-7xl mx-auto px-4 py-8 flex flex-col flex-1">
        <!-- Loading Overlay for URL param games -->
        <div v-if="initialLoading"
          class="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            class="rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 p-8 shadow-2xl">
            <div class="flex flex-col items-center gap-4">
              <div class="flex gap-1">
                <div class="w-3 h-3 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-3 h-3 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-3 h-3 bg-violet-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
              <div class="text-white font-semibold">Loading game...</div>
            </div>
          </div>
        </div>

        <!-- Game Actions Bar (shows when game is open) -->
        <div v-if="openGame"
          class="mb-6 w-full max-w-5xl mx-auto flex items-center justify-between space-x-6 sm:space-x-16 lg:space-x-24">
          <div>
            <h2 class="text-2xl font-bold">{{ currentGameData?.name }}</h2>
            <p class="text-sm text-zinc-400 mt-1">{{ currentGameData?.description }}</p>
          </div>
          <div class="flex items-center gap-3">
            <!-- Share button for Wordle games -->
            <button v-if="openGame === 'wordle' || openGame === 'wordle-unlimited'" type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium ring-1 ring-violet-500/40 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 shadow-lg shadow-violet-500/20"
              @click="onShare" :disabled="shareBusy || !canShare" :aria-disabled="shareBusy || !canShare">
              <Share2 class="h-4 w-4" />
              <span>{{ shareBusy ? 'Copying…' : 'Share' }}</span>
            </button>

            <!-- Dev reset for Wordle -->
            <button v-if="showDevReset && openGame === 'wordle'" type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 px-4 py-2 text-sm font-semibold ring-1 ring-rose-500/40 hover:from-rose-600 hover:to-rose-500 transition-all duration-200 shadow-lg shadow-rose-500/20"
              @click="devReset" title="Dev: clear local Wordle state">
              <Trash2 class="h-4 w-4" />
              <span>Dev Reset</span>
            </button>

            <span v-if="copyMsg" class="text-xs text-emerald-400">{{ copyMsg }}</span>
          </div>
        </div>

        <!-- Games grid -->
        <div v-if="!openGame" class="space-y-8 h-full transition-all duration-300 max-w-7xl">
          <div class="text-center space-y-4 py-8">
            <h2 class="text-4xl md:text-5xl font-bold">
              <span
                class="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-gradient">
                Daily Brain Games
              </span>
            </h2>
            <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
              Challenge yourself with {{ availableGames.length }} unique puzzles every day. Track your streaks, compete
              with friends, and sharpen your mind.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="game in availableGames" :key="game.id" @click="handleGameClick(game)"
              :class="getCardClasses(game)"
              class="group relative overflow-hidden rounded-2xl border backdrop-blur-sm cursor-pointer transition-all duration-300">

              <!-- Enhanced glass effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>

              <!-- status badge -->
              <div class="absolute top-4 right-4 z-10">
                <div v-if="getGameStatus(game.id) === 'won'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('emerald')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-emerald-300 leading-none">Completed</span>
                  </div>
                </div>
                <div v-else-if="getGameStatus(game.id) === 'lost'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('rose')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Ban class="w-3.5 h-3.5 text-rose-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-rose-300 leading-none">Attempted</span>
                  </div>
                </div>
                <div v-else-if="getGameStatus(game.id) === 'in-progress'" class="p-[1px] rounded-full inline-flex"
                  :class="pillGradient('amber')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Clock3 class="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-amber-300 leading-none">In Progress</span>
                  </div>
                </div>
                <div v-else-if="game.locked" class="p-[1px] rounded-full inline-flex" :class="pillGradient('zinc')"
                  @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Lock class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-zinc-300 leading-none">{{ game.lockReason }}</span>
                  </div>
                </div>
                <div v-else-if="game.comingSoon" class="p-[1px] rounded-full inline-flex" :class="pillGradient('zinc')"
                  @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Clock class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-zinc-300 leading-none">Coming Soon</span>
                  </div>
                </div>
                <div v-else class="p-[1px] rounded-full inline-flex" :class="pillGradient('zinc')" @click.stop>
                  <div
                    class="px-2 py-1 rounded-full bg-zinc-950/90 border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
                    <Circle class="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                    <span class="text-[10px] font-medium text-zinc-300 leading-none">Not Started</span>
                  </div>
                </div>
              </div>

              <!-- hover gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                :class="game.gradient"></div>

              <div class="relative p-6 space-y-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg" :class="game.iconBg">
                  <component :is="game.icon" class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-zinc-100 group-hover:text-white transition-colors">{{ game.name }}
                  </h3>
                  <p class="text-sm text-zinc-400 mt-1">{{ game.description }}</p>
                </div>
                <div class="flex items-center gap-4 pt-2">
                  <div class="flex items-center gap-1.5">
                    <Flame class="w-4 h-4 text-violet-300" />
                    <span class="text-xs text-zinc-300">{{ getStreak(game.id) }} streak</span>
                  </div>
                </div>
                <div class="pt-2">
                  <div
                    class="w-full py-2.5 rounded-xl bg-gradient-to-r text-center font-semibold text-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20"
                    :class="buttonGradient(game.id)">
                    {{ ctaText(game.id) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced daily stats overview -->
          <div
            class="mt-12 rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-black/20">
            <div class="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent rounded-2xl"></div>
            <div class="relative">
              <h3 class="text-lg font-bold mb-4">Today's Progress</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-violet-500/10">
                  <div class="text-2xl font-bold text-violet-300">{{ completedToday }}/{{ dailyGames.length }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Daily Games</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-fuchsia-500/10">
                  <div class="text-2xl font-bold text-fuchsia-300">{{ totalGamesPlayed }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Total Games</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                  <div class="text-2xl font-bold text-emerald-300">{{ totalDaysPlayed }}</div>
                  <div class="text-xs text-slate-300/70 mt-1">Total Days Played</div>
                </div>
                <div
                  class="rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-600/50 p-4 backdrop-blur-sm shadow-lg shadow-amber-500/10">
                  <div class="text-2xl font-bold text-amber-300">{{ avgWinRate }}%</div>
                  <div class="text-xs text-slate-300/70 mt-1">Avg. Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Game view -->
        <div v-if="openGame" class="w-full max-w-5xl mx-auto transition-all duration-300">
          <!-- Unauthorized state for Wordle Unlimited -->
          <div v-if="openGame === 'wordle-unlimited' && !canPlayWordleUnlimited"
            class="rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-black/20">
            <div class="relative text-center py-12">
              <div class="mb-6 flex justify-center">
                <div
                  class="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 ring-1 ring-violet-500/30 flex items-center justify-center">
                  <Lock class="h-10 w-10 text-violet-300" />
                </div>
              </div>
              <h2 class="text-2xl font-bold text-white mb-4">Wordle Unlimited Locked</h2>
              <p class="text-zinc-300 mb-6 max-w-md mx-auto">
                {{ !isAuthenticated
                  ? 'You need to be signed in with your TempestID to play Wordle Unlimited.'
                  : 'Complete today\'s daily Wordle puzzle first to unlock unlimited play!'
                }}
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                <button v-if="!isAuthenticated" @click="goToLogin"
                  class="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-fuchsia-500 transition-all">
                  Sign In / Create Account
                </button>
                <button v-else @click="selectGame('wordle')"
                  class="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-600 transition-all">
                  Play Daily Wordle
                </button>
                <button @click="closeGame"
                  class="flex-1 rounded-xl bg-white/10 backdrop-blur px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all">
                  Back to Games
                </button>
              </div>
            </div>
          </div>

          <!-- Normal game content -->
          <div v-else
            class="rounded-2xl border border-zinc-700/80 bg-gradient-to-br from-zinc-800/60 to-zinc-900/40 backdrop-blur-sm p-6 shadow-2xl shadow-black/20 max-w-[min(98vw,80rem)]">
            <div class="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent rounded-2xl"></div>
            <div class="relative">
              <!-- Wordle specific content -->
              <div v-if="openGame === 'wordle' && !loadingGame">
                <div v-if="wordleStore.loading" class="text-center py-12 text-zinc-400">
                  <div class="animate-pulse">Loading Wordle...</div>
                </div>
                <div v-else>
                  <WordleBoard />

                  <!-- Play Unlimited button after completion -->
                  <div v-if="wordleStore.isComplete" class="mt-6 flex justify-center">
                    <button @click="goToWordleUnlimited"
                      class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-cyan-600 transition-all">
                      <Infinity class="h-5 w-5" />
                      Play Wordle Unlimited
                    </button>
                  </div>

                  <!-- Footer stats for Wordle -->
                  <div class="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Plays</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.totalPlays ??
                        0 }}</div>
                    </div>
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Wins</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.wins ?? 0 }}
                      </div>
                    </div>
                    <div
                      class="rounded-xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-700/50 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                      <div class="text-xs text-emerald-200/70 uppercase tracking-wide">Losses</div>
                      <div class="mt-1 text-lg font-semibold tabular-nums text-emerald-300">{{ profile?.losses ?? 0 }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Wordle Unlimited specific content -->
              <div v-else-if="openGame === 'wordle-unlimited' && !loadingGame">
                <WordleUnlimitedBoard />
              </div>

              <!-- Other games -->
              <component v-else-if="currentGameComponent && !loadingGame" :is="currentGameComponent" :game-id="openGame"
                :playable="true" @completed="onGameCompleted" />

              <div v-else class="text-center py-12 text-zinc-400">
                <div class="animate-pulse">Loading game...</div>
              </div>
            </div>
          </div>

          <!-- Per-game stats (for non-wordle games) -->
          <div v-if="!['wordle', 'wordle-unlimited'].includes(openGame) && statsFor(openGame)"
            class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Current Streak
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).currentStreak }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Best Streak
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).maxStreak }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Times Played
              </div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).gamesPlayed }}</div>
            </div>
            <div
              :class="[getGameStatsClasses(openGame).bg, getGameStatsClasses(openGame).border, getGameStatsClasses(openGame).shadow]"
              class="rounded-xl backdrop-blur-sm p-4 shadow-lg">
              <div :class="getGameStatsClasses(openGame).label" class="text-xs uppercase tracking-wide">Win Rate</div>
              <div :class="getGameStatsClasses(openGame).text" class="text-2xl font-bold mt-1">{{
                statsFor(openGame).winPercentage }}%</div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-10 mt-auto border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div class="mx-auto max-w-7xl px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button @click="goHome"
                class="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                <Home class="w-3.5 h-3.5" />
                MXN Home
              </button>
              <div class="text-xs text-zinc-500">|</div>
              <div class="text-xs text-zinc-400">
                {{ isAuthenticated ? `Signed in as ${userEmail}` : 'Playing as Guest' }}
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button v-if="!isAuthenticated" @click="goToLogin"
                class="text-xs px-3 py-1.5 rounded-lg bg-violet-900/30 border border-violet-700/50 hover:bg-violet-800/40 text-violet-300 hover:text-violet-200 transition-all">
                Sign In
              </button>
              <button v-else @click="signOut" class="text-xs text-zinc-400 hover:text-white transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Auth Required Modal -->
    <AuthRequiredModal :show="showAuthModal" :type="authModalType" @close="showAuthModal = false" @sign-in="goToLogin"
      @play-daily="() => { showAuthModal = false; selectGame('wordle') }" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useWordleStore } from '@/stores/dailyGames/useWordleStore'
import { useWordleUnlimitedStore } from '@/stores/dailyGames/useWordleUnlimitedStore'
import { useDailyStore } from '@/stores/useDailyStore'
import { useMainStore } from '@/stores/useMainStore'
import WordleBoard from '@/components/mxn/dailyGames/WordleBoard.vue'
import WordleUnlimitedBoard from '@/components/mxn/dailyGames/WordleUnlimitedBoard.vue'
import AuthRequiredModal from '@/components/mxn/dailyGames/components/AuthRequiredModal.vue'
import {
  Trophy, User, Clock, Share2, Trash2, CheckCircle2, Ban, Clock3, Circle, Flame,
  Type, Link as LinkIcon, Flag, HelpCircle, ListOrdered, Brain, Lock, Infinity, Home
} from 'lucide-vue-next'

/* stores */
const router = useRouter()
const wordleStore = useWordleStore()
const wordleUnlimitedStore = useWordleUnlimitedStore()
const dailyStore = useDailyStore()
const mainStore = useMainStore()

/* Auth state */
const isAuthenticated = computed(() => mainStore.isAuthenticated)
const userEmail = computed(() => mainStore.user?.email || 'Guest')

/* Modal state */
const showAuthModal = ref(false)
const authModalType = ref('auth-required')

/* Initial loading state */
const initialLoading = ref(false)

/* Wordle specific state */
const shareBusy = ref(false)
const copyMsg = ref('')
const profile = computed(() => dailyStore.wordleStats)

// show the Dev Reset only in dev OR with ?dev
const showDevReset = computed(() => {
  try { if (import.meta.env.DEV) return true; } catch { }
  return new URLSearchParams(location.search).has('dev');
})

// Can play Wordle Unlimited checks
const canPlayWordleUnlimited = computed(() => {
  return isAuthenticated.value && isWordleUnlimitedUnlocked.value
})

// DEV reset (local only)
async function devReset() {
  try {
    localStorage.removeItem('mxn:daily:wordle')
    wordleStore.hardResetLocal?.()
    copyMsg.value = 'Local state cleared'
    setTimeout(() => location.reload(), 350)
  } catch { /* ignore */ }
}

// Share daily page
async function shareDaily() {
  try {
    const text = 'Check out MXN Daily Games - Challenge yourself with unique puzzles every day!\nhttps://mxn.au/daily'
    if (navigator.share) {
      await navigator.share({ text })
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    }
  } catch (error) {
    console.warn('Share failed:', error)
  }
}

// Navigation
function goHome() {
  router.push('/')
}

function goToLogin() {
  router.push('/login?redirect=/daily')
}

async function signOut() {
  mainStore.clearAuth()
  location.reload()
}

// Countdown (UTC)
const countdown = ref('00:00:00')
const countdownKey = ref(0)
let timer = null
function tick() {
  try {
    const iso = dailyStore.rolloverAt || wordleStore.rolloverAt
    if (!iso) { countdown.value = '—'; return; }
    const ms = Date.parse(iso) - Date.now()
    if (isNaN(ms) || ms <= 0) {
      countdown.value = '00:00:00'
      dailyStore.checkRollover()
      wordleStore.refreshIfRolledOver?.()
      return
    }
    const total = Math.floor(ms / 1000)
    const h = String(Math.floor(total / 3600)).padStart(2, '0')
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
    const s = String(total % 60).padStart(2, '0')
    countdown.value = `${h}:${m}:${s}`
    countdownKey.value++
  } catch (error) {
    console.warn('Error in countdown tick:', error)
    countdown.value = '—'
  }
}

// Share
const canShare = computed(() => {
  if (openGame.value === 'wordle') {
    return wordleStore?.rows?.length > 0
  } else if (openGame.value === 'wordle-unlimited') {
    return wordleUnlimitedStore?.isComplete
  }
  return false
})

async function onShare() {
  try {
    shareBusy.value = true; copyMsg.value = ''

    let text = ''
    if (openGame.value === 'wordle') {
      text = wordleStore.shareText?.() || 'Wordle completed!'
    } else if (openGame.value === 'wordle-unlimited') {
      text = wordleUnlimitedStore.shareText?.() || 'Wordle Unlimited completed!'
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      copyMsg.value = 'Copied!'
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      copyMsg.value = 'Copied!'
    }
  } catch (error) {
    console.warn('Error sharing:', error)
    copyMsg.value = 'Share failed'
  } finally {
    shareBusy.value = false
    setTimeout(() => (copyMsg.value = ''), 1800)
  }
}

const gameComponents = {
  connections: defineAsyncComponent(() => import('@/components/mxn/dailyGames/ConnectionsGame.vue')),
  flag: defineAsyncComponent(() => import('@/components/mxn/dailyGames/FlagGame.vue')), // Add this line
  trivia: defineAsyncComponent(() => import('@/components/mxn/dailyGames/TriviaGame.vue')),
  sequence: defineAsyncComponent(() => import('@/components/mxn/dailyGames/SequenceGame.vue')),
  memory: defineAsyncComponent(() => import('@/components/mxn/dailyGames/MemoryGame.vue')),
}

// Also import the FlagleStore at the top of the script:
import { useFlagleStore } from '@/stores/dailyGames/useFlagleStore'

// And create a store instance:
const flagleStore = useFlagleStore()

// In the selectGame function, add initialization for flag game:
async function selectGame(gameId) {
  const game = availableGames.value.find(g => g.id === gameId)
  if (game?.comingSoon) return

  const url = new URL(window.location)
  url.searchParams.set('game', gameId)
  window.history.replaceState({}, '', url)

  loadingGame.value = true
  openGame.value = gameId

  try {
    if (gameId === 'wordle') {
      if (!wordleStore.puzzleId) {
        await wordleStore.loadDaily(true)
      }
    } else if (gameId === 'wordle-unlimited') {
      if (!wordleUnlimitedStore.initialized) {
        await wordleUnlimitedStore.initialize()
      }
    } else if (gameId === 'flag') {  // Add this block
      if (!flagleStore.puzzleId) {
        await flagleStore.loadDaily(true)
      }
      currentGameComponent.value = gameComponents.flag
    } else {
      currentGameComponent.value = gameComponents[gameId] || null
    }
  } catch (error) {
    console.error('Error loading game:', error)
  } finally {
    loadingGame.value = false
  }
}

/* Game list */
const dailyGames = ref([
  {
    id: 'wordle', name: 'Wordle', description: 'Guess the 5-letter word in 6 tries', icon: Type,
    iconBg: 'bg-gradient-to-br from-emerald-600/20 to-emerald-500/20 ring-1 ring-emerald-500/30',
    gradient: 'from-emerald-600/10 to-transparent'
  },
  {
    id: 'wordle-unlimited',
    name: 'Wordle Unlimited',
    description: 'Endless word puzzles to solve',
    icon: Infinity,
    iconBg: 'bg-gradient-to-br from-cyan-600/20 to-cyan-500/20 ring-1 ring-cyan-500/30',
    gradient: 'from-cyan-600/10 to-transparent',
    requiresAuth: true,
    unlockCondition: () => wordleStore.status === 'won' || wordleStore.status === 'lost'
  },
  {
    id: 'flag', name: 'Flagle', description: 'Identify countries by their flags', icon: Flag,
    iconBg: 'bg-gradient-to-br from-amber-600/20 to-amber-500/20 ring-1 ring-amber-500/30',
    gradient: 'from-amber-600/10 to-transparent'
  },
  {
    id: 'connections', name: 'Connections', description: 'Find groups of 4 related words', icon: LinkIcon,
    iconBg: 'bg-gradient-to-br from-violet-600/20 to-violet-500/20 ring-1 ring-violet-500/30',
    gradient: 'from-violet-600/10 to-transparent',
  },
  {
    id: 'trivia', name: 'Quick Quiz', description: 'Test your general knowledge', icon: HelpCircle,
    iconBg: 'bg-gradient-to-br from-fuchsia-600/20 to-fuchsia-500/20 ring-1 ring-fuchsia-500/30',
    gradient: 'from-fuchsia-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'sequence', name: 'Pattern Pro', description: 'Complete the sequence', icon: ListOrdered,
    iconBg: 'bg-gradient-to-br from-amber-600/20 to-amber-500/20 ring-1 ring-amber-500/30',
    gradient: 'from-amber-600/10 to-transparent',
    comingSoon: true
  },
  {
    id: 'memory', name: 'Memory Match', description: 'Remember and match pairs', icon: Brain,
    iconBg: 'bg-gradient-to-br from-rose-600/20 to-rose-500/20 ring-1 ring-rose-500/30',
    gradient: 'from-rose-600/10 to-transparent',
    comingSoon: true
  },
])

// Check if Wordle Unlimited should be available
const isWordleUnlimitedUnlocked = computed(() => {
  const game = dailyGames.value.find(g => g.id === 'wordle-unlimited')
  return game?.unlockCondition() || false
})

// Combine games based on availability
const availableGames = computed(() => {
  const games = []

  // Add daily games first (except unlimited)
  dailyGames.value.forEach(game => {
    if (game.id === 'wordle-unlimited') {
      // Handle Wordle Unlimited with lock status
      if (isWordleUnlimitedUnlocked.value && isAuthenticated.value) {
        games.push(game)
      } else {
        const lockReason = !isAuthenticated.value
          ? 'Sign In Required'
          : 'Complete Daily'
        games.push({
          ...game,
          locked: true,
          lockReason
        })
      }
    } else {
      games.push(game)
    }
  })

  return games
})

const openGame = ref(null)
const currentGameComponent = shallowRef(null)
const currentGameData = computed(() => availableGames.value.find(g => g.id === openGame.value))
const loadingGame = ref(false)

// Handle game card clicks with modal checks
function handleGameClick(game) {
  if (game.comingSoon) return

  if (game.id === 'wordle-unlimited') {
    if (!isAuthenticated.value) {
      authModalType.value = 'auth-required'
      showAuthModal.value = true
      return
    } else if (!isWordleUnlimitedUnlocked.value) {
      authModalType.value = 'daily-required'
      showAuthModal.value = true
      return
    }
  }

  selectGame(game.id)
}

// Go to Wordle Unlimited (from daily completion)
function goToWordleUnlimited() {
  if (!isAuthenticated.value) {
    authModalType.value = 'auth-required'
    showAuthModal.value = true
  } else {
    selectGame('wordle-unlimited')
  }
}

function closeGame() {
  const url = new URL(window.location)
  url.searchParams.delete('game')
  window.history.replaceState({}, '', url)

  openGame.value = null
  currentGameComponent.value = null
}

/* Game status helpers */
function getGameStatus(gameId) {
  if (gameId === 'wordle') {
    return wordleStore.status || dailyStore.getGameStatus(gameId)
  } else if (gameId === 'wordle-unlimited') {
    return wordleUnlimitedStore.status || 'not-started'
  } else if (gameId === 'flag') {  // Add this
    return flagleStore.status || dailyStore.getGameStatus(gameId)
  }
  return dailyStore.getGameStatus(gameId)
}

function getStreak(gameId) {
  if (gameId === 'wordle-unlimited') {
    return dailyStore.wordleUnlimitedStats?.currentStreak || 0
  }
  const stats = dailyStore.getStatsFor(gameId)
  return stats?.currentStreak ?? 0
}

function ctaText(gameId) {
  const game = availableGames.value.find(g => g.id === gameId)
  if (game?.comingSoon) return 'Coming Soon'
  if (game?.locked) return game.lockReason

  const status = getGameStatus(gameId)
  switch (status) {
    case 'won': return 'Completed ✓'
    case 'lost': return gameId === 'wordle-unlimited' ? 'Play Again' : 'Try Again Tomorrow'
    case 'in-progress': return 'Continue Playing'
    default: return 'Play Now'
  }
}

function buttonGradient(gameId) {
  const game = availableGames.value.find(g => g.id === gameId)
  if (game?.comingSoon || game?.locked) return 'from-zinc-700 to-zinc-800 text-zinc-400'

  const status = getGameStatus(gameId)
  switch (status) {
    case 'won': return 'from-emerald-600 to-emerald-700 text-white shadow-emerald-500/20'
    case 'lost': return gameId === 'wordle-unlimited' ? 'from-violet-600 to-fuchsia-600 text-white shadow-violet-500/20' : 'from-rose-600 to-rose-700 text-white shadow-rose-500/20'
    default: return 'from-violet-600 to-fuchsia-600 text-white shadow-violet-500/20'
  }
}

function statsFor(gameId) {
  if (gameId === 'wordle-unlimited') {
    return wordleUnlimitedStore.profile
  }
  return dailyStore.getStatsFor(gameId)
}

/* Computed stats */
const completedToday = computed(() => dailyStore.totalCompletedToday)
const totalGamesPlayed = computed(() => {
  const dailyTotal = dailyStore.totalDaysPlayed
  const unlimitedTotal = wordleUnlimitedStore.totalWordsPlayed || 0
  return dailyTotal + unlimitedTotal
})
const totalDaysPlayed = computed(() => dailyStore.totalDaysPlayed)
const avgWinRate = computed(() => dailyStore.averageWinRate)

/* pill gradient helper */
function pillGradient(kind) {
  switch (kind) {
    case 'emerald': return 'bg-gradient-to-r from-emerald-500/50 via-emerald-400/40 to-emerald-500/50 shadow-lg shadow-emerald-500/25'
    case 'rose': return 'bg-gradient-to-r from-rose-500/50 via-rose-400/40 to-rose-500/50 shadow-lg shadow-rose-500/25'
    case 'amber': return 'bg-gradient-to-r from-amber-500/50 via-amber-400/40 to-amber-500/50 shadow-lg shadow-amber-500/25'
    case 'zinc': return 'bg-gradient-to-r from-zinc-600/40 via-zinc-500/30 to-zinc-600/40'
    default: return 'bg-gradient-to-r from-violet-500/50 via-fuchsia-500/40 to-violet-500/50 shadow-lg shadow-violet-500/25'
  }
}

function onGameCompleted(result) {
  console.log('Game completed:', result)
}

function getGameStatsClasses(gameId) {
  switch (gameId) {
    case 'wordle':
      return {
        bg: 'bg-gradient-to-br from-emerald-950/60 to-emerald-900/40',
        border: 'border-emerald-700/50',
        shadow: 'shadow-emerald-500/10',
        text: 'text-emerald-300',
        label: 'text-emerald-200/70'
      }
    case 'wordle-unlimited':
      return {
        bg: 'bg-gradient-to-br from-cyan-950/60 to-cyan-900/40',
        border: 'border-cyan-700/50',
        shadow: 'shadow-cyan-500/10',
        text: 'text-cyan-300',
        label: 'text-cyan-200/70'
      }
    case 'flag':
      return {
        bg: 'bg-gradient-to-br from-amber-950/60 to-amber-900/40',
        border: 'border-amber-700/50',
        shadow: 'shadow-amber-500/10',
        text: 'text-amber-300',
        label: 'text-amber-200/70'
      }
    case 'connections':
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-violet-500/10',
        text: 'text-violet-300',
        label: 'text-slate-300/70'
      }
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-800/80 to-slate-900/60',
        border: 'border-slate-600/50',
        shadow: 'shadow-black/10',
        text: 'text-slate-300',
        label: 'text-slate-400'
      }
  }
}

function getCardClasses(game) {
  const baseClasses = [
    'border-zinc-700/80',
    'hover:translate-y-[-4px]',
    'hover:shadow-2xl',
    'transition-all', 'duration-300',
  ]

  if (game.comingSoon || game.locked) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  switch (game.id) {
    case 'wordle':
      baseClasses.push(
        'bg-gradient-to-br', 'from-emerald-950/40', 'to-emerald-900/20',
        'hover:from-emerald-900/60', 'hover:to-emerald-800/40',
        'hover:border-emerald-500/70', 'hover:shadow-emerald-500/25'
      )
      break
    case 'wordle-unlimited':
      baseClasses.push(
        'bg-gradient-to-br', 'from-cyan-950/40', 'to-cyan-900/20',
        'hover:from-cyan-900/60', 'hover:to-cyan-800/40',
        'hover:border-cyan-500/70', 'hover:shadow-cyan-500/25'
      )
      break
    case 'flag':
      baseClasses.push(
        'bg-gradient-to-br', 'from-amber-950/40', 'to-amber-900/20',
        'hover:from-amber-900/60', 'hover:to-amber-800/40',
        'hover:border-amber-500/70', 'hover:shadow-amber-500/25'
      )
      break
    case 'connections':
      baseClasses.push(
        'bg-gradient-to-br', 'from-violet-950/40', 'to-violet-900/20',
        'hover:from-violet-900/60', 'hover:to-violet-800/40',
        'hover:border-violet-500/70', 'hover:shadow-violet-500/25'
      )
      break
  }

  return baseClasses
}

// Handle browser back/forward buttons
function handlePopState() {
  const params = new URLSearchParams(window.location.search)
  const gameParam = params.get('game')
  if (gameParam && availableGames.value.some(g => g.id === gameParam)) {
    openGame.value = gameParam
    if (!['wordle', 'wordle-unlimited'].includes(gameParam)) {
      loadingGame.value = true
      try {
        currentGameComponent.value = gameComponents[gameParam] || null
      } finally {
        loadingGame.value = false
      }
    }
  } else {
    openGame.value = null
    currentGameComponent.value = null
  }
}

/* Lifecycle */
onMounted(async () => {
  tick()
  timer = setInterval(tick, 1000)

  try {
    // Set initial loading state
    const params = new URLSearchParams(window.location.search)
    const gameParam = params.get('game')
    if (gameParam) {
      initialLoading.value = true
    }

    // Initialize stores FIRST and wait for completion
    wordleStore.initAuthListener()
    await wordleStore.loadDaily(true)

    flagleStore.initAuthListener()  // Add this

    await dailyStore.initializeGames()

    // THEN handle URL params after stores are ready
    window.addEventListener('popstate', handlePopState)

    if (gameParam && availableGames.value.some(g => g.id === gameParam && !g.comingSoon)) {
      // Check if it's wordle unlimited and user can't play it
      if (gameParam === 'wordle-unlimited' && !canPlayWordleUnlimited.value) {
        openGame.value = gameParam
        initialLoading.value = false
      } else {
        // Use selectGame instead of manually setting values
        await selectGame(gameParam)
        initialLoading.value = false
      }
    } else {
      initialLoading.value = false
    }
  } catch (error) {
    console.warn('Error initializing stores:', error)
    initialLoading.value = false
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
@keyframes gradient-move {
  0% {
    background-position: 0% 50%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 50%
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-move 8s ease infinite;
}

.bg-noise {
  background-image:
    radial-gradient(circle at 25% 25%, #ffffff03 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, #ffffff03 1px, transparent 1px);
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
}

@media (prefers-reduced-motion: reduce) {

  .animate-gradient,
  .animate-pulse {
    animation: none;
  }
}
</style>