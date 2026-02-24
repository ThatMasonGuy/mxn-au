<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ isEditing ? 'Edit Expense' : 'New Expense' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ isEditing ? 'Update expense details.' : 'Record a new business expense.' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Main Details -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Details</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <Input v-model="form.description" placeholder="What was this expense for?" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ currencySymbol }}</span>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  class="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
              <Input v-model="form.date" type="date" required />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor / Supplier</label>
              <Input v-model="form.vendor" placeholder="Where was it purchased?" />
            </div>
          </div>
        </div>
      </section>

      <!-- Job Assignment -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Job Assignment</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Job</label>
          <select
            v-model="form.jobId"
            class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            @change="onJobChange"
          >
            <option value="">No job</option>
            <option v-for="job in professionalStore.jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
          </select>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Link this expense to a specific job for tracking and invoicing.</p>
        </div>

        <!-- Billable -->
        <div class="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex items-center gap-3 mb-3">
            <input id="billable" v-model="form.billable" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="billable" class="text-sm font-medium text-gray-700 dark:text-gray-300">Billable to client</label>
          </div>

          <div v-if="form.billable" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Markup %</label>
              <div class="flex items-center gap-3">
                <input
                  v-model.number="form.markupPercent"
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  placeholder="0"
                  class="w-32 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400">%</span>
              </div>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Billable amount: <strong class="text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(billableAmount) }}</strong>
              <span v-if="form.markupPercent > 0" class="text-emerald-600 dark:text-emerald-400 ml-1">(+{{ form.markupPercent }}%)</span>
            </div>
          </div>
        </div>

        <!-- Tax Deductible -->
        <div class="flex items-center gap-3 mt-4">
          <input id="taxDeductible" v-model="form.taxDeductible" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label for="taxDeductible" class="text-sm text-gray-700 dark:text-gray-300">Tax deductible</label>
        </div>
      </section>

      <!-- Receipt Upload -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Receipt</h2>

        <div v-if="form.receiptUrl && !newReceiptFile" class="mb-4">
          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Paperclip :size="16" class="text-gray-400 flex-shrink-0" />
            <a :href="form.receiptUrl" target="_blank" class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate flex-1">
              {{ form.receiptName || 'View receipt' }}
            </a>
            <button type="button" @click="removeReceipt" class="text-xs text-red-500 hover:text-red-700">Remove</button>
          </div>
        </div>

        <div v-if="receiptPreview" class="mb-4">
          <img :src="receiptPreview" alt="Receipt preview" class="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700" />
        </div>

        <input ref="receiptInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleReceiptSelect" />
        <button
          type="button"
          @click="$refs.receiptInput.click()"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Upload :size="16" />
          {{ form.receiptUrl || newReceiptFile ? 'Change Receipt' : 'Upload Receipt' }}
        </button>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Image or PDF, max 10MB.</p>
      </section>

      <!-- Notes -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Notes</h2>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Any additional notes about this expense..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
        />
      </section>

      <!-- Actions -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-8">
        <button
          type="button"
          @click="$router.back()"
          class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          :disabled="saving"
        >
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ saving ? 'Saving...' : isEditing ? 'Update Expense' : 'Save Expense' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft, Save, Loader2, Upload, Paperclip
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const newReceiptFile = ref(null)
const receiptPreview = ref(null)
const receiptInput = ref(null)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const categories = [
  'Materials', 'Supplies', 'Equipment', 'Software', 'Subscriptions',
  'Travel', 'Fuel', 'Food & Drink', 'Office', 'Marketing',
  'Insurance', 'Utilities', 'Rent', 'Contractor', 'Other'
]

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  description: '',
  amount: null,
  date: today,
  category: '',
  vendor: '',
  jobId: '',
  jobName: '',
  billable: false,
  markupPercent: 0,
  taxDeductible: false,
  receiptUrl: '',
  receiptPath: '',
  receiptName: '',
  notes: ''
})

const billableAmount = computed(() => {
  const base = form.amount || 0
  const markup = form.markupPercent || 0
  return base + (base * markup / 100)
})

function onJobChange() {
  if (form.jobId) {
    const job = professionalStore.jobs.find(j => j.id === form.jobId)
    form.jobName = job?.title || ''
  } else {
    form.jobName = ''
  }
}

function handleReceiptSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    toast({ title: 'Error', description: 'File must be less than 10MB', variant: 'destructive' })
    return
  }
  newReceiptFile.value = file
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => { receiptPreview.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    receiptPreview.value = null
  }
}

function removeReceipt() {
  form.receiptUrl = ''
  form.receiptPath = ''
  form.receiptName = ''
  newReceiptFile.value = null
  receiptPreview.value = null
  if (receiptInput.value) receiptInput.value.value = ''
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return
  saving.value = true

  try {
    // Upload receipt if new file
    if (newReceiptFile.value) {
      // Delete old receipt if replacing
      if (form.receiptPath) {
        await professionalStore.deleteFile(form.receiptPath)
      }
      const result = await professionalStore.uploadExpenseReceipt(mainStore.user.uid, newReceiptFile.value)
      form.receiptUrl = result.url
      form.receiptPath = result.path
      form.receiptName = result.name
    }

    const expenseData = { ...form }

    // Clean up empty job
    if (!expenseData.jobId) {
      expenseData.jobId = ''
      expenseData.jobName = ''
    }

    if (isEditing.value) {
      await professionalStore.updateExpense(mainStore.user.uid, route.params.id, expenseData)
      toast({ title: 'Updated', description: 'Expense updated successfully' })
    } else {
      await professionalStore.addExpense(mainStore.user.uid, expenseData)
      toast({ title: 'Saved', description: 'Expense added successfully' })
    }

    router.push('/professional/expenses')
  } catch (error) {
    console.error('Error saving expense:', error)
    toast({ title: 'Error', description: 'Failed to save expense', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!mainStore.user?.uid) return

  // Load jobs for dropdown
  if (!professionalStore.jobs.length) {
    await professionalStore.fetchJobs(mainStore.user.uid)
  }

  // If editing, load existing expense
  if (isEditing.value) {
    if (!professionalStore.expenses.length) {
      await professionalStore.fetchExpenses(mainStore.user.uid)
    }
    const expense = professionalStore.expenses.find(e => e.id === route.params.id)
    if (expense) {
      Object.keys(form).forEach(key => {
        if (expense[key] !== undefined) form[key] = expense[key]
      })
    } else {
      toast({ title: 'Not found', description: 'Expense not found', variant: 'destructive' })
      router.push('/professional/expenses')
    }
  }

  // Pre-fill job if passed as query param
  if (route.query.jobId) {
    form.jobId = route.query.jobId
    onJobChange()
  }
})

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>
