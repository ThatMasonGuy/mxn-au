<!-- CasinoFooter.vue -->
<template>
    <footer class="relative bg-black border-t border-gray-800 mt-20">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <!-- Brand Column -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <Star :size="40" class="text-yellow-400 fill-current" />
              <span class="text-2xl font-black bg-gradient-to-r from-yellow-200 to-orange-500 text-transparent bg-clip-text">
                MXN CASINO
              </span>
            </div>
            <p class="text-gray-400 mb-6 max-w-sm">
              Your safe space to practice casino games. Play responsibly, lose nothing real, gain all the experience.
            </p>
            
            <!-- Responsible Gaming -->
            <div class="p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-900/30 mb-6">
              <div class="flex items-start gap-3">
                <AlertTriangle :size="24" class="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p class="text-orange-400 font-bold text-sm mb-1">Practice Responsibly</p>
                  <p class="text-gray-400 text-xs">
                    This is a practice platform with no real money. Use it to learn and have fun.
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Social Links -->
            <div class="flex items-center gap-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                class="w-10 h-10 rounded-lg bg-gray-900 hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <component :is="social.icon" :size="20" />
              </a>
            </div>
          </div>
  
          <!-- Games Column -->
          <div>
            <h3 class="text-white font-bold mb-4">Games</h3>
            <ul class="space-y-2">
              <li v-for="game in gameLinks" :key="game.name">
                <button
                  @click="navigateTo(game.path)"
                  class="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {{ game.name }}
                </button>
              </li>
            </ul>
          </div>
  
          <!-- Support Column -->
          <div>
            <h3 class="text-white font-bold mb-4">Support</h3>
            <ul class="space-y-2">
              <li v-for="link in supportLinks" :key="link.name">
                <button
                  @click="navigateTo(link.path)"
                  class="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {{ link.name }}
                </button>
              </li>
            </ul>
          </div>
  
          <!-- Legal Column -->
          <div>
            <h3 class="text-white font-bold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li v-for="link in legalLinks" :key="link.name">
                <button
                  @click="navigateTo(link.path)"
                  class="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {{ link.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>
  
        <!-- Payment Methods -->
        <div class="border-t border-gray-800 pt-8 mb-8">
          <h4 class="text-gray-400 text-sm font-semibold mb-4 text-center">Simulated Payment Methods</h4>
          <div class="flex items-center justify-center gap-6 flex-wrap">
            <div
              v-for="method in paymentMethods"
              :key="method.name"
              class="px-6 py-3 bg-gray-900 rounded-lg border border-gray-800 text-gray-400 font-semibold text-sm hover:border-gray-700 transition-colors duration-200"
            >
              {{ method.name }}
            </div>
          </div>
        </div>
  
        <!-- Bottom Bar -->
        <div class="border-t border-gray-800 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-gray-500 text-sm text-center md:text-left">
              © {{ currentYear }} MXN Casino. All rights reserved. This is a practice platform - no real money gambling.
            </p>
            <div class="flex items-center gap-6">
              <button
                v-for="link in bottomLinks"
                :key="link.name"
                @click="navigateTo(link.path)"
                class="text-gray-500 hover:text-gray-400 text-sm transition-colors duration-200"
              >
                {{ link.name }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- 18+ Badge -->
        <div class="flex items-center justify-center mt-8">
          <div class="px-6 py-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-full border border-purple-900/50 flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-lg">
              18+
            </div>
            <p class="text-gray-400 text-sm font-semibold">For educational purposes only</p>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Star, AlertTriangle, Twitter, MessageCircle, Instagram, Youtube } from 'lucide-vue-next'
  
  const router = useRouter()
  
  const currentYear = computed(() => new Date().getFullYear())
  
  const gameLinks = ref([
    { name: 'Blackjack', path: '/casino/blackjack' },
    { name: 'Roulette', path: '/casino/roulette' },
    { name: 'Poker', path: '/casino/poker' },
    { name: 'Slots', path: '/casino/slots' },
    { name: 'Craps', path: '/casino/craps' },
    { name: 'Baccarat', path: '/casino/baccarat' }
  ])
  
  const supportLinks = ref([
    { name: 'Help Center', path: '/casino/help' },
    { name: 'Contact Us', path: '/casino/contact' },
    { name: 'FAQ', path: '/casino/faq' },
    { name: 'Game Rules', path: '/casino/rules' },
    { name: 'Live Chat', path: '/casino/chat' }
  ])
  
  const legalLinks = ref([
    { name: 'Terms of Service', path: '/casino/terms' },
    { name: 'Privacy Policy', path: '/casino/privacy' },
    { name: 'Responsible Gaming', path: '/casino/responsible-gaming' },
    { name: 'Cookie Policy', path: '/casino/cookies' }
  ])
  
  const bottomLinks = ref([
    { name: 'About', path: '/casino/about' },
    { name: 'Blog', path: '/casino/blog' },
    { name: 'Affiliates', path: '/casino/affiliates' }
  ])
  
  const paymentMethods = ref([
    { name: 'Virtual Visa' },
    { name: 'Virtual Mastercard' },
    { name: 'Practice PayPal' },
    { name: 'Test Bitcoin' },
    { name: 'Demo Wallet' }
  ])
  
  const socialLinks = ref([
    { name: 'Twitter', url: '#', icon: Twitter },
    { name: 'Discord', url: '#', icon: MessageCircle },
    { name: 'Instagram', url: '#', icon: Instagram },
    { name: 'YouTube', url: '#', icon: Youtube }
  ])
  
  const navigateTo = (path) => {
    router.push(path)
  }
  </script>
  
  <style scoped>
  /* No additional styles needed */
  </style>