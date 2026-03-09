<template>
  <div class="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-16">
      <Loader2 :size="32" class="mx-auto mb-3 text-gray-400 animate-spin" />
      <p class="text-gray-500 dark:text-gray-400">Loading invoice...</p>
    </div>

    <!-- Not Found -->
    <div v-else-if="!invoice" class="text-center py-16">
      <FileText :size="48" class="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400 mb-3">Invoice not found</p>
      <router-link to="/professional/invoices" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Back to Invoices</router-link>
    </div>

    <template v-else>
      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 print:hidden">
        <button @click="$router.push('/professional/invoices')" class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          <ArrowLeft :size="16" />
          Back to Invoices
        </button>

        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="invoice.status"
            @change="updateStatus"
            class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <router-link
            v-if="invoice.status === 'draft'"
            :to="`/professional/invoices/${invoice.id}/edit`"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <Pencil :size="14" />
            Edit
          </router-link>

          <button
            v-if="emailEnabled"
            @click="showEmailDialog = true"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Mail :size="14" />
            Send Email
          </button>

          <button
            @click="printInvoice"
            class="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer :size="14" />
            Print
          </button>
        </div>
      </div>

      <!-- Invoice Document -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-10 max-w-4xl mx-auto print:shadow-none print:border-0 print:bg-white print:text-black">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between gap-6 mb-10">
          <!-- Company Info -->
          <div>
            <img v-if="companyInfo?.logoUrl" :src="companyInfo.logoUrl" :alt="companyInfo.companyName" class="h-14 w-auto mb-3" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-1.5">
              {{ companyInfo?.companyName || 'Your Company' }}
            </h1>
            <div class="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600 space-y-0.5">
              <p v-if="companyInfo?.address">{{ companyInfo.address }}</p>
              <p v-if="companyInfo?.city || companyInfo?.state || companyInfo?.zipCode">
                {{ [companyInfo.city, companyInfo.state, companyInfo.zipCode].filter(Boolean).join(', ') }}
              </p>
              <p v-if="companyInfo?.country">{{ companyInfo.country }}</p>
              <p v-if="companyInfo?.email">{{ companyInfo.email }}</p>
              <p v-if="companyInfo?.phone">{{ companyInfo.phone }}</p>
              <p v-if="companyInfo?.taxId" class="mt-1">ABN: {{ companyInfo.taxId }}</p>
            </div>
          </div>

          <!-- Invoice Meta -->
          <div class="sm:text-right">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 print:text-black mb-3">INVOICE</h2>
            <div class="text-sm space-y-1.5">
              <div class="flex sm:justify-end gap-4">
                <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">Invoice #:</span>
                <span class="font-medium text-gray-900 dark:text-gray-100 print:text-black">{{ invoice.invoiceNumber }}</span>
              </div>
              <div class="flex sm:justify-end gap-4">
                <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">Date:</span>
                <span class="font-medium text-gray-900 dark:text-gray-100 print:text-black">{{ formatDate(invoice.invoiceDate) }}</span>
              </div>
              <div class="flex sm:justify-end gap-4">
                <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">Due:</span>
                <span class="font-medium text-gray-900 dark:text-gray-100 print:text-black">{{ formatDate(invoice.dueDate) }}</span>
              </div>
              <div class="flex sm:justify-end gap-4 print:hidden">
                <span class="text-gray-500 dark:text-gray-400">Status:</span>
                <span class="inline-flex text-xs px-2 py-0.5 rounded-full font-medium" :class="statusClass(invoice.status)">{{ invoice.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill To -->
        <div class="mb-10">
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 print:text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
          <p class="font-semibold text-lg text-gray-900 dark:text-gray-100 print:text-black">{{ invoice.clientName }}</p>
          <div v-if="clientContact" class="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600 space-y-0.5 mt-1">
            <p v-if="clientContact.company">{{ clientContact.company }}</p>
            <p v-if="clientContact.address">{{ clientContact.address }}</p>
            <p v-if="clientContact.city || clientContact.state || clientContact.zipCode">
              {{ [clientContact.city, clientContact.state, clientContact.zipCode].filter(Boolean).join(', ') }}
            </p>
            <p v-if="clientContact.email">{{ clientContact.email }}</p>
            <p v-if="clientContact.phone">{{ clientContact.phone }}</p>
          </div>
        </div>

        <!-- Job reference -->
        <div v-if="invoice.jobName" class="mb-6 print:hidden">
          <span class="text-xs text-gray-500 dark:text-gray-400">Job:</span>
          <router-link :to="`/professional/jobs/${invoice.jobId}`" class="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-1">{{ invoice.jobName }}</router-link>
        </div>

        <!-- Items Table -->
        <div class="mb-10">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-2 border-gray-900 dark:border-gray-300 print:border-gray-900">
                <th class="text-left py-3 font-semibold text-gray-900 dark:text-gray-100 print:text-black">Description</th>
                <th class="text-right py-3 font-semibold text-gray-900 dark:text-gray-100 print:text-black w-20">Qty</th>
                <th class="text-right py-3 font-semibold text-gray-900 dark:text-gray-100 print:text-black w-28">Rate</th>
                <th class="text-right py-3 font-semibold text-gray-900 dark:text-gray-100 print:text-black w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in invoice.items"
                :key="index"
                class="border-b border-gray-200 dark:border-gray-700 print:border-gray-200"
              >
                <td class="py-3 text-gray-700 dark:text-gray-300 print:text-gray-700">{{ item.description }}</td>
                <td class="py-3 text-right text-gray-700 dark:text-gray-300 print:text-gray-700">{{ item.quantity }}</td>
                <td class="py-3 text-right text-gray-700 dark:text-gray-300 print:text-gray-700">{{ currencySymbol }}{{ formatCurrency(item.rate) }}</td>
                <td class="py-3 text-right font-medium text-gray-900 dark:text-gray-100 print:text-black">
                  {{ currencySymbol }}{{ formatCurrency(item.quantity * item.rate) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="flex justify-end mb-10">
          <div class="w-72 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">Subtotal</span>
              <span class="text-gray-900 dark:text-gray-100 print:text-black">{{ currencySymbol }}{{ formatCurrency(invoice.subtotal) }}</span>
            </div>
            <div v-if="invoice.taxRate > 0" class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">{{ taxLabel }} ({{ invoice.taxRate }}%)</span>
              <span class="text-gray-900 dark:text-gray-100 print:text-black">{{ currencySymbol }}{{ formatCurrency(invoice.taxAmount) }}</span>
            </div>
            <div v-if="invoice.discount > 0" class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400 print:text-gray-500">Discount</span>
              <span class="text-red-600 dark:text-red-400 print:text-red-600">-{{ currencySymbol }}{{ formatCurrency(invoice.discount) }}</span>
            </div>
            <div class="pt-2 border-t-2 border-gray-900 dark:border-gray-300 print:border-gray-900 flex justify-between">
              <span class="font-bold text-gray-900 dark:text-gray-100 print:text-black">Total</span>
              <span class="font-bold text-xl text-gray-900 dark:text-gray-100 print:text-black">{{ currencySymbol }}{{ formatCurrency(invoice.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Instructions -->
        <div v-if="invoice.paymentInstructions || hasBankDetails" class="mb-8">
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 print:text-gray-500 uppercase tracking-wider mb-2">Payment Details</h3>

          <div v-if="hasBankDetails" class="text-sm text-gray-700 dark:text-gray-300 print:text-gray-700 space-y-0.5 mb-2">
            <p v-if="settings.bankName"><span class="text-gray-500">Bank:</span> {{ settings.bankName }}</p>
            <p v-if="settings.bankAccountName"><span class="text-gray-500">Account:</span> {{ settings.bankAccountName }}</p>
            <p v-if="settings.bankBSB"><span class="text-gray-500">BSB:</span> {{ settings.bankBSB }}</p>
            <p v-if="settings.bankAccountNumber"><span class="text-gray-500">Acc #:</span> {{ settings.bankAccountNumber }}</p>
          </div>

          <p v-if="invoice.paymentInstructions" class="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600 whitespace-pre-line">
            {{ invoice.paymentInstructions }}
          </p>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="mb-8">
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 print:text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 print:text-gray-600 whitespace-pre-line">{{ invoice.notes }}</p>
        </div>

        <!-- Attachments (screen only) -->
        <div v-if="invoice.attachments?.length" class="mb-8 print:hidden">
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Attachments</h3>
          <div class="space-y-1.5">
            <a
              v-for="(att, i) in invoice.attachments"
              :key="i"
              :href="att.url"
              target="_blank"
              class="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Paperclip :size="13" />
              {{ att.name }}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700 print:border-gray-200 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400 print:text-gray-500">Thank you for your business!</p>
          <p v-if="companyInfo?.website" class="text-xs text-gray-400 mt-1">{{ companyInfo.website }}</p>
        </div>
      </div>
    </template>

    <!-- Email Dialog -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEmailDialog" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden" @click.self="showEmailDialog = false">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Send Invoice Email</h3>

            <div class="space-y-3 mb-5">
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">To</label>
                <input
                  v-model="emailTo"
                  type="email"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="client@email.com"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</label>
                <input
                  v-model="emailSubject"
                  type="text"
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
                <textarea
                  v-model="emailMessage"
                  rows="4"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button @click="showEmailDialog = false" class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">Cancel</button>
              <button @click="sendEmail" :disabled="sendingEmail" class="inline-flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                <Loader2 v-if="sendingEmail" :size="14" class="animate-spin" />
                <Send v-else :size="14" />
                Send
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
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { useToast } from '@/components/ui/toast'
import {
  ArrowLeft, Pencil, Printer, Mail, Send, Loader2, FileText, Paperclip
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const loading = ref(false)
const invoice = ref(null)
const showEmailDialog = ref(false)
const sendingEmail = ref(false)

const emailTo = ref('')
const emailSubject = ref('')
const emailMessage = ref('')

const companyInfo = computed(() => professionalStore.companyInfo)
const settings = computed(() => professionalStore.settings)
const currencySymbol = computed(() => settings.value.currencySymbol || '$')
const taxLabel = computed(() => settings.value.taxLabel || 'Tax')
const emailEnabled = computed(() => settings.value.emailEnabled)

const hasBankDetails = computed(() =>
  settings.value.bankName || settings.value.bankBSB || settings.value.bankAccountNumber
)

const clientContact = computed(() => {
  if (!invoice.value?.clientId) return null
  return professionalStore.contacts.find(c => c.id === invoice.value.clientId)
})

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

function formatDate(date) {
  if (!date) return '—'
  try { return new Date(date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return '—' }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function printInvoice() { window.print() }

async function updateStatus() {
  if (!mainStore.user?.uid || !invoice.value) return
  try {
    await professionalStore.updateInvoice(mainStore.user.uid, invoice.value.id, { status: invoice.value.status })
    toast({ title: 'Updated', description: 'Invoice status updated' })
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' })
  }
}

async function sendEmail() {
  if (!mainStore.user?.uid || !invoice.value || !emailTo.value) return
  sendingEmail.value = true
  try {
    await professionalStore.sendInvoiceEmail(
      mainStore.user.uid,
      invoice.value.id,
      emailTo.value,
      emailSubject.value,
      emailMessage.value
    )

    // Update status to sent if draft/pending
    if (['draft', 'pending'].includes(invoice.value.status)) {
      invoice.value.status = 'sent'
      await professionalStore.updateInvoice(mainStore.user.uid, invoice.value.id, { status: 'sent' })
    }

    toast({ title: 'Queued', description: 'Invoice email has been queued for sending' })
    showEmailDialog.value = false
  } catch (error) {
    toast({ title: 'Error', description: 'Failed to send email', variant: 'destructive' })
  } finally {
    sendingEmail.value = false
  }
}

onMounted(async () => {
  if (!mainStore.user?.uid) return
  loading.value = true

  try {
    await Promise.all([
      professionalStore.fetchCompanyInfo(mainStore.user.uid),
      professionalStore.fetchContacts(mainStore.user.uid),
      professionalStore.fetchInvoices(mainStore.user.uid),
      professionalStore.fetchSettings(mainStore.user.uid)
    ])

    invoice.value = professionalStore.invoices.find(inv => inv.id === route.params.id)

    if (invoice.value) {
      // Pre-fill email dialog
      emailTo.value = clientContact.value?.email || ''
      emailSubject.value = `Invoice ${invoice.value.invoiceNumber} from ${companyInfo.value?.companyName || 'Us'}`
      emailMessage.value = `Hi ${invoice.value.clientName},\n\nPlease find attached invoice ${invoice.value.invoiceNumber} for ${currencySymbol.value}${formatCurrency(invoice.value.total)}.\n\nPayment is due by ${formatDate(invoice.value.dueDate)}.\n\nThank you!`
    }
  } catch (error) {
    console.error('Error loading invoice:', error)
    toast({ title: 'Error', description: 'Failed to load invoice', variant: 'destructive' })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media print {
  @page { margin: 1.5cm; }
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
</style>