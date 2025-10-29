<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <Briefcase :size="24" class="text-blue-600" />
            <span class="text-xl font-bold text-gray-900">Professional Suite</span>
          </div>
          <router-link
            v-if="isAuthenticated"
            to="/professional/home"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
            <ArrowRight :size="16" />
          </router-link>
          <router-link
            v-else
            to="/login"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
            <ArrowRight :size="16" />
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <h1 class="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Business
            <span class="block text-blue-600 mt-2">Professionally</span>
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A complete suite of tools to manage your contacts, generate professional invoices, 
            and keep your business organized. Simple, powerful, and built for small businesses.
          </p>
          <router-link
            :to="isAuthenticated ? '/professional/home' : '/login'"
            class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            {{ isAuthenticated ? 'Go to Dashboard' : 'Get Started' }}
            <ArrowRight :size="20" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
          <p class="text-lg text-gray-600">Powerful features to run your business smoothly</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <component :is="feature.icon" :size="24" class="text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-lg text-gray-600">Get started in three simple steps</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="(step, index) in steps" 
            :key="step.title"
            class="text-center"
          >
            <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{ index + 1 }}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Join thousands of small businesses managing their work professionally.
        </p>
        <router-link
          :to="isAuthenticated ? '/professional/home' : '/login'"
          class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          {{ isAuthenticated ? 'Go to Dashboard' : 'Start Free Today' }}
          <ArrowRight :size="20" />
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center text-gray-600">
        <p>&copy; {{ new Date().getFullYear() }} Professional Suite. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { 
  Briefcase, 
  ArrowRight, 
  Building2, 
  Users, 
  FileText, 
  Zap, 
  Shield, 
  Cloud 
} from 'lucide-vue-next'

const mainStore = useMainStore()
const isAuthenticated = computed(() => mainStore.isAuthenticated)

const features = [
  {
    icon: Building2,
    title: 'Company Branding',
    description: 'Upload your logo and add company details to create professional, branded invoices.'
  },
  {
    icon: Users,
    title: 'Contact Management',
    description: 'Keep all your client and vendor contacts organized in one centralized location.'
  },
  {
    icon: FileText,
    title: 'Invoice Generator',
    description: 'Create professional invoices in seconds with our easy-to-use invoice builder.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate and send invoices in just a few clicks. No more manual document creation.'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and stored securely with enterprise-grade security.'
  },
  {
    icon: Cloud,
    title: 'Cloud Storage',
    description: 'Access your business data from anywhere, on any device, at any time.'
  }
]

const steps = [
  {
    title: 'Add Your Company',
    description: 'Upload your logo and enter your company details to get started.'
  },
  {
    title: 'Add Contacts',
    description: 'Import or manually add your clients and vendors to your contact list.'
  },
  {
    title: 'Create Invoices',
    description: 'Generate professional invoices and send them to your clients instantly.'
  }
]
</script>
