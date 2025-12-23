<!-- CasinoHeader.vue -->
<template>
    <header class="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-8">
            <button @click="navigateTo('/casino')" class="flex items-center gap-2 group">
              <div class="relative">
                <div class="absolute inset-0 blur-lg bg-yellow-500/50 group-hover:bg-yellow-500/70 transition-all duration-300"></div>
                <Star :size="28" class="text-yellow-400 relative z-10 fill-current" />
              </div>
              <span class="text-xl font-black bg-gradient-to-r from-yellow-200 to-orange-500 text-transparent bg-clip-text">
                MXN CASINO
              </span>
            </button>
  
            <!-- Navigation -->
            <nav class="hidden lg:flex items-center gap-1">
              <button
                v-for="item in navItems"
                :key="item.name"
                @click="navigateTo(item.path)"
                class="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200 font-medium text-sm"
                :class="{ 'text-yellow-400 bg-gray-900': isActive(item.path) }"
              >
                {{ item.name }}
              </button>
            </nav>
          </div>
  
          <!-- Right Side Actions -->
          <div class="flex items-center gap-3">
            <!-- Balance Display (when logged in) -->
            <div v-if="isLoggedIn" class="hidden md:flex items-center gap-3">
              <!-- Compact Balance -->
              <div class="flex items-center gap-2 px-4 py-2 bg-gray-900/80 rounded-lg border border-gray-800 hover:border-yellow-500/30 transition-all duration-300">
                <Wallet :size="18" class="text-yellow-400" />
                <div class="flex items-baseline gap-1">
                  <span class="text-sm font-bold text-yellow-400 tabular-nums">${{ balance.toLocaleString() }}</span>
                </div>
              </div>
  
              <!-- Add Funds Button -->
              <button
                @click="showDepositModal = true"
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              >
                <Plus :size="16" />
                <span class="hidden xl:inline">Add Funds</span>
              </button>
  
              <!-- Notifications -->
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-all duration-200"
              >
                <Bell :size="20" />
                <span v-if="notificationCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {{ notificationCount }}
                </span>
              </button>
  
              <!-- User Menu -->
              <div class="relative">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-200"
                >
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {{ userInitials }}
                  </div>
                  <div class="text-left hidden xl:block">
                    <p class="text-xs font-bold text-white leading-tight">{{ userName }}</p>
                    <p class="text-xs text-gray-500 leading-tight">Lv {{ userLevel }}</p>
                  </div>
                  <ChevronDown :size="14" class="text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" />
                </button>
  
                <!-- User Dropdown -->
                <Transition name="dropdown">
                  <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
                    <div class="p-3 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-b border-gray-800">
                      <p class="text-white font-bold text-sm">{{ userName }}</p>
                      <p class="text-xs text-gray-400">{{ userEmail }}</p>
                    </div>
                    <div class="p-1.5">
                      <button
                        v-for="item in userMenuItems"
                        :key="item.name"
                        @click="handleUserMenuClick(item.action)"
                        class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200 text-left text-sm"
                      >
                        <component :is="item.icon" :size="18" />
                        <span class="font-medium">{{ item.name }}</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
  
            <!-- Login/Sign Up (when not logged in) -->
            <div v-else class="flex items-center gap-2">
              <button
                @click="handleLogin"
                class="px-5 py-2 rounded-lg font-semibold text-sm text-white hover:bg-gray-900 transition-all duration-200"
              >
                Log In
              </button>
              <button
                @click="handleSignUp"
                class="px-5 py-2 rounded-lg font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
              >
                Sign Up
              </button>
            </div>
  
            <!-- Mobile Menu Toggle -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="lg:hidden p-2 rounded-lg bg-gray-900 text-gray-400 hover:text-white"
            >
              <Menu :size="20" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Mobile Menu -->
      <Transition name="mobile-menu">
        <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-800 bg-black">
          <nav class="container mx-auto px-4 py-3 flex flex-col gap-1">
            <button
              v-for="item in navItems"
              :key="item.name"
              @click="handleMobileNavClick(item.path)"
              class="px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200 font-medium text-left text-sm"
              :class="{ 'text-yellow-400 bg-gray-900': isActive(item.path) }"
            >
              {{ item.name }}
            </button>
            
            <!-- Mobile Balance -->
            <div v-if="isLoggedIn" class="mt-2 pt-2 border-t border-gray-800">
              <div class="flex items-center justify-between px-4 py-3 bg-gray-900 rounded-lg">
                <div class="flex items-center gap-2">
                  <Wallet :size="18" class="text-yellow-400" />
                  <span class="text-sm font-bold text-yellow-400 tabular-nums">${{ balance.toLocaleString() }}</span>
                </div>
                <button
                  @click="showDepositModal = true"
                  class="px-4 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-xs"
                >
                  + Add
                </button>
              </div>
            </div>
          </nav>
        </div>
      </Transition>
  
      <!-- Notifications Panel -->
      <Transition name="slide-down">
        <div v-if="showNotifications" class="absolute top-16 right-4 w-80 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          <div class="p-3 border-b border-gray-800 flex items-center justify-between">
            <h3 class="font-bold text-white text-sm">Notifications</h3>
            <button @click="showNotifications = false" class="text-gray-400 hover:text-white">
              <X :size="18" />
            </button>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
            >
              <div class="flex items-start gap-2.5">
                <div class="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" v-if="!notification.read"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold text-xs">{{ notification.title }}</p>
                  <p class="text-gray-400 text-xs mt-0.5 line-clamp-2">{{ notification.message }}</p>
                  <p class="text-gray-600 text-xs mt-1">{{ notification.time }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-2 border-t border-gray-800">
            <button class="w-full py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors duration-200">
              View All Notifications
            </button>
          </div>
        </div>
      </Transition>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { 
    Star, 
    Bell, 
    ChevronDown, 
    Menu, 
    X, 
    User, 
    Clock, 
    Wallet, 
    Settings, 
    LogOut,
    Plus
  } from 'lucide-vue-next'
  
  const router = useRouter()
  const emit = defineEmits(['login', 'signup'])
  
  const isLoggedIn = ref(true)
  const balance = ref(10000)
  const userName = ref('Mason')
  const userEmail = ref('mason@mxn.au')
  const userInitials = ref('M')
  const userLevel = ref(12)
  const notificationCount = ref(3)
  
  const showMobileMenu = ref(false)
  const showUserMenu = ref(false)
  const showNotifications = ref(false)
  const showDepositModal = ref(false)
  
  const navItems = ref([
    { name: 'Casino', path: '/casino' },
    { name: 'Live Games', path: '/casino/live' },
    { name: 'Tournaments', path: '/casino/tournaments' },
    { name: 'Promotions', path: '/casino/promotions' },
    { name: 'Leaderboard', path: '/casino/leaderboard' }
  ])
  
  const userMenuItems = ref([
    { name: 'Profile', action: 'profile', icon: User },
    { name: 'Game History', action: 'history', icon: Clock },
    { name: 'Transactions', action: 'transactions', icon: Wallet },
    { name: 'Settings', action: 'settings', icon: Settings },
    { name: 'Logout', action: 'logout', icon: LogOut }
  ])
  
  const notifications = ref([
    {
      id: 1,
      title: 'Big Win! 🎉',
      message: 'Congratulations! You won $2,840 on Blackjack',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Daily Bonus Available',
      message: 'Claim your $500 daily bonus now!',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      title: 'New Game Released',
      message: 'Try our new Diamond Slots game',
      time: '1 day ago',
      read: true
    }
  ])
  
  const navigateTo = (path) => {
    router.push(path)
    showMobileMenu.value = false
  }
  
  const isActive = (path) => {
    return router.currentRoute.value.path === path
  }
  
  const handleMobileNavClick = (path) => {
    navigateTo(path)
  }
  
  const handleUserMenuClick = (action) => {
    showUserMenu.value = false
    
    switch(action) {
      case 'profile':
        router.push('/casino/profile')
        break
      case 'history':
        router.push('/casino/history')
        break
      case 'transactions':
        router.push('/casino/transactions')
        break
      case 'settings':
        router.push('/casino/settings')
        break
      case 'logout':
        isLoggedIn.value = false
        break
    }
  }
  
  const handleLogin = () => {
    emit('login')
  }
  
  const handleSignUp = () => {
    emit('signup')
  }
  </script>
  
  <style scoped>
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .mobile-menu-enter-active,
  .mobile-menu-leave-active {
    transition: all 0.3s ease;
  }
  
  .mobile-menu-enter-from,
  .mobile-menu-leave-to {
    opacity: 0;
    max-height: 0;
  }
  
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: all 0.3s ease;
  }
  
  .slide-down-enter-from,
  .slide-down-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  </style>