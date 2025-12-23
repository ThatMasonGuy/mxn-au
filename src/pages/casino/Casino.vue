<!-- Casino.vue (Updated) -->
<template>
    <div class="min-h-screen bg-black relative overflow-hidden">
      <CasinoHeader @login="handleLogin" @signup="handleSignup" />
      
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20"></div>
        <div 
          v-for="i in 50" 
          :key="i"
          class="absolute rounded-full mix-blend-screen animate-float"
          :style="{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${['rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)', 'rgba(251, 191, 36, 0.1)'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 15}s`
          }"
        ></div>
      </div>
  
      <div class="relative z-10">
        <!-- Hero Section -->
        <div class="container mx-auto px-4 pt-20 pb-12">
          <div class="text-center mb-8">
            <p class="text-2xl text-gray-400 font-light mb-8 max-w-3xl mx-auto">
              Where the house always wins, but you never lose anything real
            </p>
  
            <!-- Balance Card -->
            <div class="inline-block relative group mb-12">
              <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 animate-pulse-slow"></div>
              <div class="relative bg-black rounded-2xl p-8 border border-yellow-500/30">
                <div class="flex items-center gap-8">
                  <div class="text-left">
                    <p class="text-sm text-gray-500 uppercase tracking-widest mb-2 font-semibold">Available Balance</p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-6xl font-black text-yellow-400 tabular-nums">${{ balance.toLocaleString() }}</span>
                      <span class="text-2xl text-gray-600">.00</span>
                    </div>
                  </div>
                  <div class="border-l border-gray-800 pl-8 text-left">
                    <p class="text-sm text-gray-500 uppercase tracking-widest mb-2 font-semibold">Total Wagered</p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-4xl font-bold text-purple-400 tabular-nums">${{ totalWagered.toLocaleString() }}</span>
                    </div>
                  </div>
                  <div class="border-l border-gray-800 pl-8 text-left">
                    <p class="text-sm text-gray-500 uppercase tracking-widest mb-2 font-semibold">Biggest Win</p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-4xl font-bold text-green-400 tabular-nums">${{ biggestWin.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Live Stats Ticker -->
          <div class="mb-16 overflow-hidden bg-gradient-to-r from-purple-950/30 via-black to-purple-950/30 border-y border-purple-900/30 py-4">
            <div class="flex items-center gap-16 animate-scroll-left">
              <div v-for="n in 3" :key="n" class="flex items-center gap-16 flex-shrink-0">
                <div v-for="(activity, idx) in recentActivity" :key="`${n}-${idx}`" class="flex items-center gap-3 flex-shrink-0">
                  <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span class="text-gray-400">{{ activity.user }}</span>
                  <span class="text-yellow-400 font-bold">${{ activity.amount.toLocaleString() }}</span>
                  <span class="text-gray-600">on</span>
                  <span class="text-purple-400">{{ activity.game }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Featured Games Grid -->
          <div class="mb-16">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-4xl font-black text-white">Featured Games</h2>
              <div class="flex gap-2">
                <button 
                  v-for="filter in filters" 
                  :key="filter"
                  @click="activeFilter = filter"
                  class="px-6 py-2 rounded-full font-semibold transition-all duration-300"
                  :class="activeFilter === filter 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'"
                >
                  {{ filter }}
                </button>
              </div>
            </div>
  
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="game in filteredGames"
                :key="game.id"
                @click="navigateToGame(game.route)"
                @mouseenter="hoveredGame = game.id"
                @mouseleave="hoveredGame = null"
                class="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border border-gray-800 hover:border-purple-500"
                :class="hoveredGame === game.id ? 'scale-105 shadow-2xl shadow-purple-500/50 z-20' : 'scale-100'"
              >
                <div class="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-orange-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-orange-600/20 transition-all duration-500"></div>
                
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div class="absolute inset-0 rounded-2xl animate-rotate-border" 
                       style="background: conic-gradient(from 0deg, transparent, #a855f7, transparent, #ec4899, transparent, #f59e0b, transparent); mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite: exclude; padding: 2px;">
                  </div>
                </div>
  
                <div class="relative p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="relative">
                      <div class="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {{ game.icon }}
                      </div>
                      <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {{ game.players }}
                      </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end">
                      <span
                        class="px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        :class="game.statusClass"
                      >
                        {{ game.status }}
                      </span>
                      <div class="flex items-center gap-1">
                        <svg v-for="star in 5" :key="star" class="w-3 h-3" :class="star <= game.rating ? 'text-yellow-400' : 'text-gray-700'" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
  
                  <h3 class="text-2xl font-black text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                    {{ game.name }}
                  </h3>
                  <p class="text-gray-500 mb-6 text-sm leading-relaxed">{{ game.description }}</p>
  
                  <div class="grid grid-cols-3 gap-4 mb-6 p-4 bg-black/50 rounded-xl">
                    <div class="text-center">
                      <p class="text-xs text-gray-600 uppercase tracking-wider mb-1">Min Bet</p>
                      <p class="text-lg font-bold text-yellow-400">${{ game.minBet }}</p>
                    </div>
                    <div class="text-center border-x border-gray-800">
                      <p class="text-xs text-gray-600 uppercase tracking-wider mb-1">Max Bet</p>
                      <p class="text-lg font-bold text-purple-400">${{ game.maxBet }}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-xs text-gray-600 uppercase tracking-wider mb-1">RTP</p>
                      <p class="text-lg font-bold text-green-400">{{ game.rtp }}%</p>
                    </div>
                  </div>
  
                  <div class="mb-4 p-3 bg-gradient-to-r from-green-950/50 to-emerald-950/50 rounded-lg border border-green-900/30">
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-green-400 font-semibold">LAST BIG WIN</span>
                      <span class="text-sm text-yellow-400 font-bold">${{ game.lastWin.toLocaleString() }}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">{{ game.lastWinTime }}</p>
                  </div>
  
                  <button class="w-full relative overflow-hidden group/btn">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 group-hover/btn:from-purple-500 group-hover/btn:to-pink-500 transition-all duration-300"></div>
                    <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span class="relative z-10 block py-4 text-white font-black text-lg tracking-wide">
                      PLAY NOW
                    </span>
                  </button>
                </div>
  
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </div>
          </div>
  
          <!-- Statistics Dashboard -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div class="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 group-hover:border-purple-500 transition-all duration-300">
                <div class="text-5xl mb-4">🎮</div>
                <div class="text-4xl font-black text-white mb-2">{{ totalGames }}</div>
                <div class="text-gray-500 font-semibold">Total Games</div>
              </div>
            </div>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div class="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 group-hover:border-yellow-500 transition-all duration-300">
                <div class="text-5xl mb-4">🔥</div>
                <div class="text-4xl font-black text-white mb-2">{{ activePlayers }}</div>
                <div class="text-gray-500 font-semibold">Active Players</div>
              </div>
            </div>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div class="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 group-hover:border-green-500 transition-all duration-300">
                <div class="text-5xl mb-4">💰</div>
                <div class="text-4xl font-black text-white mb-2">${{ totalPaidOut.toLocaleString() }}</div>
                <div class="text-gray-500 font-semibold">Paid Today</div>
              </div>
            </div>
            <div class="relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div class="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 group-hover:border-blue-500 transition-all duration-300">
                <div class="text-5xl mb-4">⚡</div>
                <div class="text-4xl font-black text-white mb-2">24/7</div>
                <div class="text-gray-500 font-semibold">Always Open</div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <CasinoFooter />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import CasinoHeader from './CasinoHeader.vue'
  import CasinoFooter from './CasinoFooter.vue'
  
  const router = useRouter()
  const balance = ref(10000)
  const totalWagered = ref(47250)
  const biggestWin = ref(5420)
  const activePlayers = ref(127)
  const totalPaidOut = ref(892450)
  const hoveredGame = ref(null)
  const activeFilter = ref('All')
  
  const filters = ['All', 'Hot', 'New', 'Classic']
  
  const games = ref([
    {
      id: 1,
      name: 'Blackjack',
      description: 'Beat the dealer in this classic card game. Double down and split your way to victory.',
      icon: '🃏',
      route: 'blackjack',
      minBet: 10,
      maxBet: 5000,
      rtp: 99.5,
      rating: 5,
      status: 'Hot',
      statusClass: 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse',
      players: 42,
      lastWin: 2840,
      lastWinTime: '3 minutes ago',
      category: 'Hot'
    },
    {
      id: 2,
      name: 'Roulette',
      description: 'Spin the wheel of fortune. Place your bets on red, black, or your lucky numbers.',
      icon: '🎰',
      route: 'roulette',
      minBet: 5,
      maxBet: 10000,
      rtp: 97.3,
      rating: 5,
      status: 'Hot',
      statusClass: 'bg-gradient-to-r from-red-600 to-orange-600 text-white animate-pulse',
      players: 38,
      lastWin: 5420,
      lastWinTime: '12 minutes ago',
      category: 'Hot'
    },
    {
      id: 3,
      name: 'Texas Hold\'em',
      description: 'The ultimate poker game. Outsmart your opponents with strategy and skill.',
      icon: '♠️',
      route: 'poker',
      minBet: 20,
      maxBet: 25000,
      rtp: 98.9,
      rating: 5,
      status: 'VIP',
      statusClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      players: 24,
      lastWin: 8910,
      lastWinTime: '8 minutes ago',
      category: 'Classic'
    },
    {
      id: 4,
      name: 'Diamond Slots',
      description: 'Spin the reels and line up symbols for massive multipliers and jackpots.',
      icon: '💎',
      route: 'slots',
      minBet: 1,
      maxBet: 100,
      rtp: 96.8,
      rating: 4,
      status: 'New',
      statusClass: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
      players: 67,
      lastWin: 1250,
      lastWinTime: '1 minute ago',
      category: 'New'
    },
    {
      id: 5,
      name: 'Craps',
      description: 'Roll the dice and ride the wave. Simple rules, endless excitement.',
      icon: '🎲',
      route: 'craps',
      minBet: 10,
      maxBet: 5000,
      rtp: 98.6,
      rating: 4,
      status: 'Classic',
      statusClass: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
      players: 19,
      lastWin: 3200,
      lastWinTime: '25 minutes ago',
      category: 'Classic'
    },
    {
      id: 6,
      name: 'Baccarat',
      description: 'High stakes elegance. Player or Banker? Make your choice and let fate decide.',
      icon: '🂡',
      route: 'baccarat',
      minBet: 25,
      maxBet: 50000,
      rtp: 98.9,
      rating: 5,
      status: 'VIP',
      statusClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      players: 15,
      lastWin: 12500,
      lastWinTime: '18 minutes ago',
      category: 'Classic'
    }
  ])
  
  const recentActivity = ref([
    { user: 'Player_7234', amount: 2840, game: 'Blackjack' },
    { user: 'HighRoller', amount: 5420, game: 'Roulette' },
    { user: 'Lucky_Ace', amount: 890, game: 'Slots' },
    { user: 'SharpShooter', amount: 3200, game: 'Craps' },
    { user: 'CardShark', amount: 8910, game: 'Poker' }
  ])
  
  const totalGames = computed(() => games.value.length)
  
  const filteredGames = computed(() => {
    if (activeFilter.value === 'All') return games.value
    return games.value.filter(game => game.category === activeFilter.value)
  })
  
  const navigateToGame = (route) => {
    router.push(`/casino/${route}`)
  }
  
  const handleLogin = () => {
    console.log('Login clicked')
  }
  
  const handleSignup = () => {
    console.log('Signup clicked')
  }
  </script>
  
  <style scoped>
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0);
    }
    33% {
      transform: translate(30px, -30px);
    }
    66% {
      transform: translate(-20px, 20px);
    }
  }
  
  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.333%);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 0.75;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes rotate-border {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .animate-float {
    animation: float infinite ease-in-out;
  }
  
  .animate-scroll-left {
    animation: scroll-left 30s linear infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
  
  .animate-rotate-border {
    animation: rotate-border 3s linear infinite;
  }
  </style>