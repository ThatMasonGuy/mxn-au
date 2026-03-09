<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ isEditing ? 'Edit Invoice' : 'New Invoice' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ isEditing ? 'Update invoice details.' : 'Create a new invoice.' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Invoice Header -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Invoice Details</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Number *</label>
              <div class="flex gap-2">
                <Input v-model="form.invoiceNumber" placeholder="INV-0001" required class="flex-1" />
                <button
                  v-if="!isEditing"
                  type="button"
                  @click="autoNumber"
                  class="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                  title="Auto-generate number"
                >
                  Auto #
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Date *</label>
              <Input v-model="form.invoiceDate" type="date" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
              <Input v-model="form.dueDate" type="date" required />
            </div>
          </div>
        </div>
      </section>

      <!-- Client & Job -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Client &amp; Job</h2>

        <div class="space-y-4">
          <!-- Client Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client *</label>
            <div v-if="selectedContact" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm flex-shrink-0">
                {{ getInitials(selectedContact.name) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{{ selectedContact.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ selectedContact.email || selectedContact.company || '' }}</p>
              </div>
              <button type="button" @click="clearClient" class="p-1 text-gray-400 hover:text-red-500">
                <X :size="16" />
              </button>
            </div>
            <select
              v-else
              v-model="form.clientId"
              required
              @change="handleClientSelect"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>Select a client</option>
              <option v-for="c in professionalStore.clientContacts" :key="c.id" :value="c.id">
                {{ c.name }}{{ c.company ? ` (${c.company})` : '' }}
              </option>
            </select>
          </div>

          <!-- Job Link -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linked Job</label>
            <select
              v-model="form.jobId"
              @change="onJobChange"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">No job</option>
              <option v-for="job in professionalStore.jobs" :key="job.id" :value="job.id">{{ job.title }}</option>
            </select>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Link to a job for tracking. You can import billable expenses below.</p>
          </div>
        </div>
      </section>

      <!-- Line Items -->
      <section class="professional-card">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Items</h2>
          <div class="flex gap-2 flex-wrap">
            <button
              v-if="form.jobId"
              type="button"
              @click="importBillableExpenses"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <Receipt :size="13" />
              Import Billable
            </button>
            <button
              v-if="professionalStore.catalogue.length"
              type="button"
              @click="showCatalogueImport = !showCatalogueImport"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Package :size="13" />
              From Catalogue
            </button>
            <button
              type="button"
              @click="addLineItem"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus :size="13" />
              Add Item
            </button>
          </div>
        </div>

        <!-- Catalogue Quick Import -->
        <div v-if="showCatalogueImport" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="text-xs font-medium text-blue-700 dark:text-blue-400 mb-2">Select items to add:</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in professionalStore.catalogue"
              :key="item.id"
              type="button"
              @click="addFromCatalogue(item)"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Plus :size="11" />
              {{ item.name }} — {{ currencySymbol }}{{ formatCurrency(item.price) }}
            </button>
          </div>
        </div>

        <!-- Desktop Line Items -->
        <div class="hidden sm:block space-y-2">
          <!-- Header -->
          <div class="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
            <div class="col-span-5">Description</div>
            <div class="col-span-2">Qty</div>
            <div class="col-span-2">Rate</div>
            <div class="col-span-2 text-right">Amount</div>
            <div class="col-span-1"></div>
          </div>

          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="col-span-5">
              <Input v-model="item.description" placeholder="Description" required />
            </div>
            <div class="col-span-2">
              <input
                v-model.number="item.quantity"
                type="number" min="0.01" step="0.01"
                placeholder="1"
                required
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div class="col-span-2">
              <div class="relative">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{{ currencySymbol }}</span>
                <input
                  v-model.number="item.rate"
                  type="number" min="0" step="0.01"
                  placeholder="0.00"
                  required
                  class="w-full pl-7 pr-2 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div class="col-span-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ currencySymbol }}{{ formatCurrency((item.quantity || 0) * (item.rate || 0)) }}
            </div>
            <div class="col-span-1 flex justify-end">
              <button type="button" @click="removeLineItem(index)" :disabled="form.items.length === 1" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Line Items -->
        <div class="sm:hidden space-y-3">
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Item {{ index + 1 }}</span>
              <button type="button" @click="removeLineItem(index)" :disabled="form.items.length === 1" class="p-1 text-gray-400 hover:text-red-500 disabled:opacity-30">
                <Trash2 :size="14" />
              </button>
            </div>
            <Input v-model="item.description" placeholder="Description" required />
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">Qty</label>
                <input v-model.number="item.quantity" type="number" min="0.01" step="0.01" placeholder="1" required class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">Rate</label>
                <div class="relative">
                  <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{{ currencySymbol }}</span>
                  <input v-model.number="item.rate" type="number" min="0" step="0.01" placeholder="0.00" required class="w-full pl-7 pr-2 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                </div>
              </div>
            </div>
            <p class="text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ currencySymbol }}{{ formatCurrency((item.quantity || 0) * (item.rate || 0)) }}
            </p>
          </div>
        </div>

        <!-- Totals -->
        <div class="mt-4 flex justify-end">
          <div class="w-full sm:w-72 space-y-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(subtotal) }}</span>
            </div>

            <div v-if="taxEnabled" class="flex justify-between text-sm items-center gap-3">
              <span class="text-gray-600 dark:text-gray-400">{{ taxLabel }} ({{ form.taxRate }}%)</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(taxAmount) }}</span>
            </div>
            <div v-if="taxEnabled" class="flex items-center gap-2">
              <input
                v-model.number="form.taxRate"
                type="number" min="0" max="100" step="0.01"
                class="w-20 px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right"
              />
              <span class="text-xs text-gray-500 dark:text-gray-400">% tax rate</span>
            </div>

            <div v-if="form.discount > 0" class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Discount</span>
              <span class="font-medium text-red-600 dark:text-red-400">-{{ currencySymbol }}{{ formatCurrency(form.discount) }}</span>
            </div>

            <div class="pt-2 border-t border-gray-300 dark:border-gray-600 flex justify-between">
              <span class="font-semibold text-gray-900 dark:text-gray-100">Total</span>
              <span class="font-bold text-lg text-gray-900 dark:text-gray-100">{{ currencySymbol }}{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Discount -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Discount</h2>
        <div class="flex items-center gap-3">
          <div class="relative w-40">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ currencySymbol }}</span>
            <input
              v-model.number="form.discount"
              type="number" min="0" step="0.01"
              placeholder="0.00"
              class="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">flat discount</span>
        </div>
      </section>

      <!-- Notes & Payment Instructions -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Notes &amp; Payment</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              :placeholder="professionalStore.settings.defaultInvoiceNotes || 'Additional notes...'"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Instructions</label>
            <textarea
              v-model="form.paymentInstructions"
              rows="3"
              :placeholder="professionalStore.settings.defaultPaymentInstructions || 'Bank details, payment link, etc...'"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <!-- Attachments -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Attachments</h2>

        <div v-if="form.attachments.length > 0" class="space-y-2 mb-4">
          <div
            v-for="(att, i) in form.attachments"
            :key="i"
            class="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <Paperclip :size="14" class="text-gray-400 flex-shrink-0" />
            <a v-if="att.url" :href="att.url" target="_blank" class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate flex-1">{{ att.name }}</a>
            <span v-else class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{{ att.name }}</span>
            <button type="button" @click="removeAttachment(i)" class="text-xs text-red-500 hover:text-red-700 flex-shrink-0">Remove</button>
          </div>
        </div>

        <input ref="attachmentInput" type="file" class="hidden" multiple @change="handleAttachmentSelect" />
        <button
          type="button"
          @click="$refs.attachmentInput.click()"
          class="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Upload :size="15" />
          Add Attachment
        </button>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PDFs, images, etc. Max 10MB each.</p>
      </section>

      <!-- Actions -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pb-8">
        <button type="button" @click="$router.back()" class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          :disabled="saving"
        >
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ saving ? 'Saving...' : isEditing ? 'Update Invoice' : 'Create Invoice' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, X, Upload, Paperclip, Receipt, Package
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const isEditing = computed(() => !!route.params.id && route.params.id !== 'new')
const saving = ref(false)
const selectedContact = ref(null)
const showCatalogueImport = ref(false)
const attachmentInput = ref(null)
const newAttachmentFiles = ref([])

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')
const taxEnabled = computed(() => professionalStore.settings.taxEnabled)
const taxLabel = computed(() => professionalStore.settings.taxLabel || 'Tax')

const today = new Date().toISOString().split('T')[0]
const defaultDue = computed(() => {
  const days = professionalStore.settings.defaultPaymentTermsDays || 14
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
})

const form = reactive({
  invoiceNumber: '',
  status: 'draft',
  invoiceDate: today,
  dueDate: defaultDue.value,
  clientId: '',
  clientName: '',
  jobId: '',
  jobName: '',
  items: [{ description: '', quantity: 1, rate: 0 }],
  taxRate: professionalStore.settings.taxRate || 10,
  discount: 0,
  notes: professionalStore.settings.defaultInvoiceNotes || '',
  paymentInstructions: professionalStore.settings.defaultPaymentInstructions || '',
  attachments: []
})

const subtotal = computed(() => form.items.reduce((s, i) => s + ((i.quantity || 0) * (i.rate || 0)), 0))
const taxAmount = computed(() => taxEnabled.value ? (subtotal.value * (form.taxRate || 0)) / 100 : 0)
const total = computed(() => subtotal.value + taxAmount.value - (form.discount || 0))

function autoNumber() {
  form.invoiceNumber = professionalStore.generateInvoiceNumber()
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
}

function handleClientSelect() {
  const contact = professionalStore.contacts.find(c => c.id === form.clientId)
  if (contact) {
    form.clientName = contact.name
    selectedContact.value = contact
  }
}

function clearClient() {
  form.clientId = ''
  form.clientName = ''
  selectedContact.value = null
}

function onJobChange() {
  if (form.jobId) {
    const job = professionalStore.jobs.find(j => j.id === form.jobId)
    form.jobName = job?.title || ''
    // Auto-select client from job if not already set
    if (!form.clientId && job?.clientId) {
      form.clientId = job.clientId
      form.clientName = job.clientName || ''
      selectedContact.value = professionalStore.contacts.find(c => c.id === job.clientId) || null
    }
  } else {
    form.jobName = ''
  }
}

function addLineItem() {
  form.items.push({ description: '', quantity: 1, rate: 0 })
}

function removeLineItem(index) {
  if (form.items.length > 1) form.items.splice(index, 1)
}

function addFromCatalogue(item) {
  form.items.push({
    description: item.name + (item.description ? ` — ${item.description}` : ''),
    quantity: 1,
    rate: item.price || 0,
    catalogueItemId: item.id
  })
  showCatalogueImport.value = false
}

function importBillableExpenses() {
  if (!form.jobId) return
  const billable = professionalStore.getBillableExpensesForJob(form.jobId)
  if (billable.length === 0) {
    toast({ title: 'No billable expenses', description: 'No billable expenses found for this job' })
    return
  }
  billable.forEach(exp => {
    const markup = exp.markupPercent || 0
    const billableRate = (exp.amount || 0) * (1 + markup / 100)
    form.items.push({
      description: `${exp.description}${markup > 0 ? ` (+${markup}% markup)` : ''}`,
      quantity: 1,
      rate: Math.round(billableRate * 100) / 100,
      expenseId: exp.id
    })
  })
  toast({ title: 'Imported', description: `Added ${billable.length} billable expense(s)` })
}

function handleAttachmentSelect(event) {
  const files = Array.from(event.target.files)
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Error', description: `${file.name} is over 10MB`, variant: 'destructive' })
      continue
    }
    newAttachmentFiles.value.push(file)
    form.attachments.push({ name: file.name, url: '', path: '', isNew: true, fileIndex: newAttachmentFiles.value.length - 1 })
  }
  if (attachmentInput.value) attachmentInput.value.value = ''
}

function removeAttachment(index) {
  const att = form.attachments[index]
  if (att.isNew) {
    // Remove from new files too
    newAttachmentFiles.value = newAttachmentFiles.value.filter((_, i) => i !== att.fileIndex)
  }
  form.attachments.splice(index, 1)
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return
  if (!form.clientId) {
    toast({ title: 'Error', description: 'Please select a client', variant: 'destructive' })
    return
  }
  if (form.items.length === 0 || form.items.some(i => !i.description)) {
    toast({ title: 'Error', description: 'Add at least one item with a description', variant: 'destructive' })
    return
  }

  saving.value = true

  try {
    // Upload new attachments
    const uploadedAttachments = []
    for (const att of form.attachments) {
      if (att.isNew && att.fileIndex !== undefined) {
        const file = newAttachmentFiles.value[att.fileIndex]
        if (file) {
          const result = await professionalStore.uploadInvoiceAttachment(mainStore.user.uid, file)
          uploadedAttachments.push({ name: result.name, url: result.url, path: result.path })
        }
      } else if (att.url) {
        uploadedAttachments.push({ name: att.name, url: att.url, path: att.path })
      }
    }

    const invoiceData = {
      invoiceNumber: form.invoiceNumber,
      status: form.status,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      clientId: form.clientId,
      clientName: form.clientName,
      jobId: form.jobId || '',
      jobName: form.jobName || '',
      items: form.items.map(i => ({
        description: i.description,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
        ...(i.catalogueItemId && { catalogueItemId: i.catalogueItemId }),
        ...(i.expenseId && { expenseId: i.expenseId })
      })),
      subtotal: Number(subtotal.value),
      taxRate: Number(form.taxRate),
      taxAmount: Number(taxAmount.value),
      discount: Number(form.discount || 0),
      total: Number(total.value),
      notes: form.notes,
      paymentInstructions: form.paymentInstructions,
      attachments: uploadedAttachments
    }

    if (isEditing.value) {
      await professionalStore.updateInvoice(mainStore.user.uid, route.params.id, invoiceData)
      toast({ title: 'Updated', description: 'Invoice updated' })
    } else {
      await professionalStore.addInvoice(mainStore.user.uid, invoiceData)
      // Auto-increment invoice number
      await professionalStore.incrementInvoiceNumber(mainStore.user.uid)
      toast({ title: 'Created', description: 'Invoice created' })
    }

    router.push('/professional/invoices')
  } catch (error) {
    console.error('Error saving invoice:', error)
    toast({ title: 'Error', description: 'Failed to save invoice', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(async () => {
  if (!mainStore.user?.uid) return

  await Promise.all([
    professionalStore.contacts.length ? null : professionalStore.fetchContacts(mainStore.user.uid),
    professionalStore.jobs.length ? null : professionalStore.fetchJobs(mainStore.user.uid),
    professionalStore.catalogue.length ? null : professionalStore.fetchCatalogue(mainStore.user.uid),
    professionalStore.expenses.length ? null : professionalStore.fetchExpenses(mainStore.user.uid)
  ])

  // Auto-generate number for new invoices
  if (!isEditing.value) {
    form.invoiceNumber = professionalStore.generateInvoiceNumber()
  }

  // Load existing invoice if editing
  if (isEditing.value) {
    if (!professionalStore.invoices.length) {
      await professionalStore.fetchInvoices(mainStore.user.uid)
    }
    const invoice = professionalStore.invoices.find(inv => inv.id === route.params.id)
    if (invoice) {
      Object.keys(form).forEach(key => {
        if (invoice[key] !== undefined) {
          if (key === 'items') {
            form.items = [...invoice.items]
          } else if (key === 'attachments') {
            form.attachments = [...(invoice.attachments || [])]
          } else {
            form[key] = invoice[key]
          }
        }
      })
      if (invoice.clientId) {
        selectedContact.value = professionalStore.contacts.find(c => c.id === invoice.clientId) || null
      }
    } else {
      toast({ title: 'Not found', description: 'Invoice not found', variant: 'destructive' })
      router.push('/professional/invoices')
    }
  }

  // Pre-fill job from query param
  if (route.query.jobId) {
    form.jobId = route.query.jobId
    onJobChange()
  }
})
</script>