<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Jobs</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Manage your projects and jobs.</p>
      </div>
      <router-link to="/professional/jobs/new" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto">
        <Plus :size="16" />
        New Job
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <div class="flex-1">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search jobs..."
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>
      <select
        v-model="filterStatus"
        class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="in_progress">In Progress</option>
        <option value="on_hold">On Hold</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="filteredJobs.length === 0" class="text-center py-16">
      <FolderKanban :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400 mb-1">{{ searchQuery || filterStatus ? 'No matching jobs' : 'No jobs yet' }}</p>
      <router-link v-if="!searchQuery && !filterStatus" to="/professional/jobs/new" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        Create your first job
      </router-link>
    </div>

    <!-- Jobs Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="$router.push(`/professional/jobs/${job.id}`)"
      >
        <!-- Top row -->
        <div class="flex items-start justify-between mb-3">
          <div class="min-w-0 flex-1 mr-3">
            <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ job.title }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{{ job.clientName || 'No client assigned' }}</p>
          </div>
          <span
            class="inline-flex text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0"
            :class="statusClass(job.status)"
          >
            {{ formatStatus(job.status) }}
          </span>
        </div>

        <!-- Description -->
        <p v-if="job.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {{ job.description }}
        </p>

        <!-- Budget & Expenses -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p class="text-xs text-gray-500 dark:text-gray-400">Budget</p>
            <p class="text-sm font-bold text-gray-900 dark:text-gray-100">
              {{ job.budget ? `${currencySymbol}${formatCurrency(job.budget)}` : '—' }}
            </p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
            <p class="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
            <p class="text-sm font-bold text-gray-900 dark:text-gray-100">
              {{ currencySymbol }}{{ formatCurrency(getJobExpenses(job.id)) }}
            </p>
          </div>
        </div>

        <!-- Dates -->
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span v-if="job.startDate">Start: {{ job.startDate }}</span>
          <span v-else>No start date</span>
          <span v-if="job.dueDate" :class="isOverdue(job) ? 'text-red-500 font-medium' : ''">
            Due: {{ job.dueDate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
import {
  Plus, Search, FolderKanban
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()

const searchQuery = ref('')
const filterStatus = ref('')

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const filteredJobs = computed(() => {
  let list = [...professionalStore.sortedJobs]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(j =>
      (j.title || '').toLowerCase().includes(q) ||
      (j.clientName || '').toLowerCase().includes(q) ||
      (j.description || '').toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    list = list.filter(j => j.status === filterStatus.value)
  }

  return list
})

function getJobExpenses(jobId) {
  return professionalStore.getJobExpenseTotal(jobId)
}

function isOverdue(job) {
  if (!job.dueDate || job.status === 'completed' || job.status === 'cancelled') return false
  return new Date(job.dueDate) < new Date()
}

function statusClass(status) {
  const map = {
    active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    in_progress: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    on_hold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    cancelled: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  }
  return map[status] || map.active
}

function formatStatus(status) {
  return (status || 'active').replace(/_/g, ' ')
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (mainStore.user?.uid) {
    await Promise.all([
      professionalStore.fetchJobs(mainStore.user.uid),
      professionalStore.fetchExpenses(mainStore.user.uid)
    ])
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
