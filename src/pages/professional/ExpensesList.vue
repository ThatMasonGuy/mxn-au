<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Expenses</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">Track and manage your business expenses.</p>
      </div>
      <router-link to="/professional/expenses/new" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium self-start sm:self-auto">
        <Plus :size="16" />
        Add Expense
      </router-link>
    </div>

    <!-- Summary Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
        <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(totalAmount) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Count</p>
        <p class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ filteredExpenses.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Billable</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{{ currencySymbol }}{{ formatCurrency(billableTotal) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <p class="text-xs text-gray-500 dark:text-gray-400">Tax Deductible</p>
        <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ currencySymbol }}{{ formatCurrency(deductibleTotal) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <div class="flex-1">
        <div class="relative">
          <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search expenses..."
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>
      </div>
      <select
        v-model="filterCategory"
        class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select
        v-model="filterJob"
        class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">All Jobs</option>
        <option value="__none__">No Job</option>
        <option v-for="job in professionalStore.jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="filteredExpenses.length === 0" class="text-center py-16">
      <Receipt :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400 mb-1">{{ searchQuery || filterCategory || filterJob ? 'No matching expenses' : 'No expenses yet' }}</p>
      <router-link v-if="!searchQuery && !filterCategory && !filterJob" to="/professional/expenses/new" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
        Add your first expense
      </router-link>
    </div>

    <!-- Mobile Cards -->
    <div v-else class="sm:hidden space-y-3">
      <div
        v-for="expense in paginatedExpenses"
        :key="expense.id"
        class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        @click="$router.push(`/professional/expenses/${expense.id}/edit`)"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="min-w-0 flex-1">
            <p class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ expense.description }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ expense.category || 'Uncategorised' }}</p>
          </div>
          <p class="text-base font-bold text-gray-900 dark:text-gray-100 ml-3">{{ currencySymbol }}{{ formatCurrency(expense.amount) }}</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ expense.date }}</span>
          <span v-if="expense.jobName" class="text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">{{ expense.jobName }}</span>
          <span v-if="expense.billable" class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">Billable</span>
          <span v-if="expense.taxDeductible" class="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400">Deductible</span>
        </div>
        <div class="flex justify-end mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            @click.stop="confirmDelete(expense)"
            class="text-xs text-red-500 hover:text-red-700 dark:text-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div v-if="filteredExpenses.length > 0" class="hidden sm:block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Date</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Description</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Category</th>
              <th class="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Job</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Amount</th>
              <th class="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Flags</th>
              <th class="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="expense in paginatedExpenses"
              :key="expense.id"
              class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              @click="$router.push(`/professional/expenses/${expense.id}/edit`)"
            >
              <td class="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{{ expense.date }}</td>
              <td class="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                <div class="flex items-center gap-2">
                  <span class="truncate max-w-[200px] lg:max-w-[300px]">{{ expense.description }}</span>
                  <Paperclip v-if="expense.receiptUrl" :size="14" class="text-gray-400 flex-shrink-0" />
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ expense.category || '—' }}</td>
              <td class="px-4 py-3 text-gray-600 dark:text-gray-400">
                <span v-if="expense.jobName" class="text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{{ expense.jobName }}</span>
                <span v-else>—</span>
              </td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ currencySymbol }}{{ formatCurrency(expense.amount) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <span v-if="expense.billable" class="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">Bill</span>
                  <span v-if="expense.taxDeductible" class="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400">Tax</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click.stop="confirmDelete(expense)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4 px-1">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredExpenses.length) }} of {{ filteredExpenses.length }}
      </p>
      <div class="flex gap-1">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300"
        >
          Prev
        </button>
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="deleteTarget = null">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete Expense</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Delete "{{ deleteTarget.description }}"? This cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
              <button @click="deleteTarget = null" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button @click="handleDelete" class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { useToast } from '@/components/ui/toast'
import {
  Plus, Search, Receipt, Trash2, Paperclip
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const searchQuery = ref('')
const filterCategory = ref('')
const filterJob = ref('')
const currentPage = ref(1)
const perPage = 20
const deleteTarget = ref(null)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const defaultCategories = [
  'Materials', 'Supplies', 'Equipment', 'Software', 'Subscriptions',
  'Travel', 'Fuel', 'Food & Drink', 'Office', 'Marketing',
  'Insurance', 'Utilities', 'Rent', 'Contractor', 'Other'
]

const categories = computed(() => {
  const used = new Set(professionalStore.expenses.map(e => e.category).filter(Boolean))
  defaultCategories.forEach(c => used.add(c))
  return [...used].sort()
})

const filteredExpenses = computed(() => {
  let list = [...professionalStore.sortedExpenses]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(e =>
      (e.description || '').toLowerCase().includes(q) ||
      (e.vendor || '').toLowerCase().includes(q) ||
      (e.notes || '').toLowerCase().includes(q)
    )
  }

  if (filterCategory.value) {
    list = list.filter(e => e.category === filterCategory.value)
  }

  if (filterJob.value === '__none__') {
    list = list.filter(e => !e.jobId)
  } else if (filterJob.value) {
    list = list.filter(e => e.jobId === filterJob.value)
  }

  return list
})

const totalAmount = computed(() => filteredExpenses.value.reduce((s, e) => s + (e.amount || 0), 0))
const billableTotal = computed(() => filteredExpenses.value.filter(e => e.billable).reduce((s, e) => s + (e.amount || 0), 0))
const deductibleTotal = computed(() => filteredExpenses.value.filter(e => e.taxDeductible).reduce((s, e) => s + (e.amount || 0), 0))

const totalPages = computed(() => Math.ceil(filteredExpenses.value.length / perPage))
const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredExpenses.value.slice(start, start + perPage)
})

function confirmDelete(expense) {
  deleteTarget.value = expense
}

async function handleDelete() {
  if (!deleteTarget.value || !mainStore.user?.uid) return
  try {
    await professionalStore.deleteExpense(mainStore.user.uid, deleteTarget.value.id)
    toast({ title: 'Deleted', description: 'Expense deleted' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to delete expense', variant: 'destructive' })
  }
  deleteTarget.value = null
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (mainStore.user?.uid) {
    await professionalStore.fetchExpenses(mainStore.user.uid)
    if (!professionalStore.jobs.length) {
      await professionalStore.fetchJobs(mainStore.user.uid)
    }
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
