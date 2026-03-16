<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's an overview of your business.</p>
    </div>

    <!-- Setup Alert -->
    <div
      v-if="!professionalStore.hasCompanyInfo"
      class="mb-6 lg:mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6"
    >
      <div class="flex items-start gap-3 sm:gap-4">
        <Info :size="24" class="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">Complete Your Setup</h3>
          <p class="text-sm sm:text-base text-blue-700 dark:text-blue-300 mb-3">
            Get started by adding your company information. This will appear on your invoices and emails.
          </p>
          <router-link to="/professional/company" class="btn-professional-primary inline-flex items-center gap-2">
            <Building2 :size="16" />
            Set Up Company
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</span>
          <DollarSign :size="18" class="text-emerald-600 dark:text-emerald-400" />
        </div>
        <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ currencySymbol }}{{ formatCurrency(stats.totalRevenue) }}
        </p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Outstanding</span>
          <Clock :size="18" class="text-orange-600 dark:text-orange-400" />
        </div>
        <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ currencySymbol }}{{ formatCurrency(stats.outstandingBalance) }}
        </p>
        <p v-if="stats.overdueInvoices" class="text-xs text-red-500 mt-1">
          {{ stats.overdueInvoices }} overdue
        </p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Expenses</span>
          <Receipt :size="18" class="text-red-500 dark:text-red-400" />
        </div>
        <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ currencySymbol }}{{ formatCurrency(stats.totalExpenses) }}
        </p>
      </div>

      <div class="professional-stat-card">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</span>
          <FolderKanban :size="18" class="text-blue-600 dark:text-blue-400" />
        </div>
        <p class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.activeJobs || 0 }}
        </p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6 lg:mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <router-link
          v-for="action in quickActions"
          :key="action.path"
          :to="action.path"
          class="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all text-center"
        >
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="action.bgClass">
            <component :is="action.icon" :size="20" :class="action.iconClass" />
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ action.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity Grid -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Recent Invoices -->
      <div class="professional-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Invoices</h2>
          <router-link to="/professional/invoices" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">
            View all
          </router-link>
        </div>

        <div v-if="recentInvoices.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <FileText :size="36" class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p class="text-sm">No invoices yet</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="invoice in recentInvoices"
            :key="invoice.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            @click="$router.push(`/professional/invoices/${invoice.id}`)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ invoice.invoiceNumber || 'Draft' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ invoice.clientName }}</p>
            </div>
            <div class="text-right ml-3 flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(invoice.total) }}</p>
              <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium" :class="statusClass(invoice.status)">
                {{ invoice.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="professional-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Recent Expenses</h2>
          <router-link to="/professional/expenses" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">
            View all
          </router-link>
        </div>

        <div v-if="recentExpenses.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <Receipt :size="36" class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p class="text-sm">No expenses yet</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="expense in recentExpenses"
            :key="expense.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            @click="$router.push(`/professional/expenses/${expense.id}/edit`)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ expense.description }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ expense.category || 'Uncategorised' }}</p>
            </div>
            <div class="text-right ml-3 flex-shrink-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(expense.amount) }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ expense.date }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Jobs -->
      <div class="professional-card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Active Jobs</h2>
          <router-link to="/professional/jobs" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">
            View all
          </router-link>
        </div>

        <div v-if="recentJobs.length === 0" class="text-center py-6 text-gray-500 dark:text-gray-400">
          <FolderKanban :size="36" class="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p class="text-sm">No active jobs</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="job in recentJobs"
            :key="job.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            @click="$router.push(`/professional/jobs/${job.id}`)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ job.title }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ job.clientName || 'No client' }}</p>
            </div>
            <div class="text-right ml-3 flex-shrink-0">
              <p v-if="job.budget" class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ currencySymbol }}{{ formatCurrency(job.budget) }}
              </p>
              <span class="inline-block text-xs px-1.5 py-0.5 rounded-full font-medium" :class="jobStatusClass(job.status)">
                {{ formatJobStatus(job.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
import {
  Info,
  Building2,
  DollarSign,
  Clock,
  Receipt,
  FolderKanban,
  FileText,
  Plus,
  UserPlus,
  Package,
  CreditCard
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()

const stats = computed(() => professionalStore.stats)
const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const quickActions = [
  { label: 'New Invoice', path: '/professional/invoices/new', icon: FileText, bgClass: 'bg-blue-100 dark:bg-blue-900/50', iconClass: 'text-blue-600 dark:text-blue-400' },
  { label: 'Add Contact', path: '/professional/contacts/new', icon: UserPlus, bgClass: 'bg-green-100 dark:bg-green-900/50', iconClass: 'text-green-600 dark:text-green-400' },
  { label: 'New Job', path: '/professional/jobs/new', icon: FolderKanban, bgClass: 'bg-purple-100 dark:bg-purple-900/50', iconClass: 'text-purple-600 dark:text-purple-400' },
  { label: 'Add Expense', path: '/professional/expenses/new', icon: Receipt, bgClass: 'bg-orange-100 dark:bg-orange-900/50', iconClass: 'text-orange-600 dark:text-orange-400' },
  { label: 'Catalogue', path: '/professional/catalogue/new', icon: Package, bgClass: 'bg-teal-100 dark:bg-teal-900/50', iconClass: 'text-teal-600 dark:text-teal-400' },
  { label: 'Payment Link', path: '/professional/payments', icon: CreditCard, bgClass: 'bg-pink-100 dark:bg-pink-900/50', iconClass: 'text-pink-600 dark:text-pink-400' },
]

const recentInvoices = computed(() => (professionalStore.sortedInvoices || []).slice(0, 5))
const recentExpenses = computed(() => (professionalStore.sortedExpenses || []).slice(0, 5))
const recentJobs = computed(() => {
  const active = professionalStore.activeJobs || []
  if (active.length) return active.slice(0, 5)
  return (professionalStore.sortedJobs || []).slice(0, 5)
})

onMounted(async () => {
  if (mainStore.user?.uid) {
    try {
      await professionalStore.initializeProfessional(mainStore.user.uid)
    } catch (error) {
      console.error('Error loading professional data:', error)
    }
  }
})

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function statusClass(status) {
  const map = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  }
  return map[status] || map.draft
}

function jobStatusClass(status) {
  const map = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    on_hold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  }
  return map[status] || map.active
}

function formatJobStatus(status) {
  return (status || 'active').replace(/_/g, ' ')
}
</script>