<template>
  <div class="p-8 bg-white min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- Success Message -->
      <div class="bg-green-100 border-2 border-green-500 rounded-lg p-6 mb-6">
        <h1 class="text-3xl font-bold text-green-900 mb-2">
          ✅ Professional Layout is Working!
        </h1>
        <p class="text-green-700">
          If you can see this page with the sidebar, the professional suite is set up correctly.
        </p>
      </div>

      <!-- Debug Info -->
      <div class="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Debug Information</h2>
        
        <div class="space-y-2 font-mono text-sm">
          <div class="flex gap-2">
            <span class="text-gray-600">Current Route:</span>
            <span class="text-gray-900 font-semibold">{{ $route.path }}</span>
          </div>
          
          <div class="flex gap-2">
            <span class="text-gray-600">Layout:</span>
            <span class="text-gray-900 font-semibold">{{ $route.meta?.layout }}</span>
          </div>
          
          <div class="flex gap-2">
            <span class="text-gray-600">Requires Auth:</span>
            <span class="text-gray-900 font-semibold">{{ $route.meta?.requiresAuth }}</span>
          </div>
          
          <div class="flex gap-2">
            <span class="text-gray-600">User Authenticated:</span>
            <span class="text-gray-900 font-semibold">{{ mainStore.isAuthenticated }}</span>
          </div>
          
          <div class="flex gap-2">
            <span class="text-gray-600">User ID:</span>
            <span class="text-gray-900 font-semibold">{{ mainStore.user?.uid || 'Not logged in' }}</span>
          </div>
          
          <div class="flex gap-2">
            <span class="text-gray-600">User Email:</span>
            <span class="text-gray-900 font-semibold">{{ mainStore.user?.email || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Feature Checks -->
      <div class="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-blue-900 mb-4">Component Checks</h2>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ professionalStore ? '✅' : '❌' }}</span>
            <span class="text-gray-900">Professional Store Loaded</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-2xl">{{ mainStore ? '✅' : '❌' }}</span>
            <span class="text-gray-900">Main Store Loaded</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-2xl">✅</span>
            <span class="text-gray-900">Tailwind CSS Working</span>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="text-2xl">✅</span>
            <span class="text-gray-900">Lucide Icons Working</span>
            <CheckCircle :size="20" class="text-green-600" />
          </div>
        </div>
      </div>

      <!-- Navigation Test -->
      <div class="bg-purple-50 border border-purple-300 rounded-lg p-6">
        <h2 class="text-xl font-bold text-purple-900 mb-4">Test Navigation</h2>
        
        <p class="text-gray-700 mb-4">
          Try clicking these links to test the professional routes:
        </p>
        
        <div class="grid grid-cols-2 gap-3">
          <router-link
            to="/professional"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
          >
            Landing Page
          </router-link>
          
          <router-link
            to="/professional/home"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
          >
            Dashboard
          </router-link>
          
          <router-link
            to="/professional/company"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
          >
            Company Settings
          </router-link>
          
          <router-link
            to="/professional/contacts"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
          >
            Contacts
          </router-link>
          
          <router-link
            to="/professional/invoices"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center"
          >
            Invoices
          </router-link>
          
          <router-link
            to="/topheroes"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center"
          >
            Back to TopHeroes
          </router-link>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <h2 class="text-xl font-bold text-yellow-900 mb-2">✨ Next Steps</h2>
        <ol class="list-decimal list-inside space-y-2 text-gray-700">
          <li>Go to Company Settings and add your logo</li>
          <li>Add your first contact in Contacts</li>
          <li>Create your first invoice in Invoices</li>
          <li>Once everything works, you can remove this test page</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { CheckCircle } from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
</script>
