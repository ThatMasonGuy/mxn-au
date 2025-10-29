<template>
  <div class="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's an overview of your business.</p>
    </div>

    <!-- Setup Alert -->
    <div v-if="!professionalStore.hasCompanyInfo"
      class="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <Info :size="24" class="text-blue-600 dark:text-blue-400" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">Complete Your Setup</h3>
          <p class="text-blue-700 dark:text-blue-300 mb-4">
            Get started by adding your company information and logo. This will be used on all your invoices.
          </p>
          <router-link to="/professional/company" class="btn-professional-primary">
            <Building2 :size="16" />
            Set Up Company
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contacts</span>
          <Users :size="20" class="text-blue-600 dark:text-blue-400" />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalContacts || 0 }}</p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</span>
          <FileText :size="20" class="text-green-600 dark:text-green-400" />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalInvoices || 0 }}</p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invoices</span>
          <Clock :size="20" class="text-orange-600 dark:text-orange-400" />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.pendingInvoices || 0 }}</p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</span>
          <DollarSign :size="20" class="text-purple-600 dark:text-purple-400" />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ formatCurrency(stats.totalRevenue || 0) }}
        </p>
      </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="grid lg:grid-cols-2 gap-8">
      <!-- Quick Actions -->
      <div class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <router-link to="/professional/invoices/new"
            class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Plus :size="20" class="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">Create Invoice</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Generate a new invoice</p>
            </div>
          </router-link>

          <router-link to="/professional/contacts/new"
            class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <div class="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <UserPlus :size="20" class="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">Add Contact</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Add a new client or vendor</p>
            </div>
          </router-link>

          <router-link to="/professional/company"
            class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <Building2 :size="20" class="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">Company Settings</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Update your company info</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Recent Invoices -->
      <div class="professional-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Invoices</h2>
          <router-link to="/professional/invoices"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View all
          </router-link>
        </div>

        <div v-if="recentInvoices.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          <FileText :size="48" class="mx-auto mb-2 text-gray-400 dark:text-gray-600" />
          <p>No invoices yet</p>
          <router-link to="/professional/invoices/new"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mt-2 inline-block">
            Create your first invoice
          </router-link>
        </div>

        <div v-else class="space-y-3">
          <div v-for="invoice in recentInvoices" :key="invoice.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            @click="$router.push(`/professional/invoices/${invoice.id}`)">
            <div class="flex-1">
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ invoice.invoiceNumber }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ invoice.clientName }}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900 dark:text-gray-100">${{ formatCurrency(invoice.total) }}</p>
              <span class="status-badge" :class="`status-badge-${invoice.status}`">
                {{ invoice.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import {
  Info,
  Building2,
  Users,
  FileText,
  Clock,
  DollarSign,
  Plus,
  UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()

const statsLoaded = ref(false)

const stats = computed(() => professionalStore.stats || {
  totalContacts: 0,
  totalInvoices: 0,
  totalRevenue: 0,
  pendingInvoices: 0
})

const recentInvoices = computed(() => {
  const invoices = professionalStore.sortedInvoices || []
  return invoices.slice(0, 5)
})

onMounted(async () => {
  // Only try to load if we have a user ID
  if (mainStore.user?.uid) {
    try {
      await professionalStore.initializeProfessional(mainStore.user.uid)
      statsLoaded.value = true
    } catch (error) {
      console.error('Error loading professional data:', error)
      statsLoaded.value = true // Still mark as loaded to show UI
    }
  } else {
    console.warn('No user ID available, skipping data load')
    statsLoaded.value = true
  }
})

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script>