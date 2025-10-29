<template>
  <div class="p-8">
    <!-- Actions Bar -->
    <div class="flex items-center justify-between mb-8 print:hidden">
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft :size="20" />
        Back
      </button>

      <div class="flex items-center gap-3">
        <Select v-model="invoice.status" @update:model-value="updateStatus">
          <SelectTrigger class="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        <button
          v-if="invoice.status === 'draft'"
          @click="editInvoice"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Pencil :size="20" />
          Edit
        </button>

        <button
          @click="printInvoice"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer :size="20" />
          Print / Download
        </button>
      </div>
    </div>

    <!-- Invoice Document -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-4xl mx-auto print:shadow-none print:border-0">
      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center">
        <Loader2 :size="48" class="animate-spin text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600">Loading invoice...</p>
      </div>

      <!-- Invoice Content -->
      <div v-else-if="invoice">
        <!-- Header -->
        <div class="flex justify-between items-start mb-12">
          <!-- Company Info -->
          <div>
            <img
              v-if="companyInfo?.logoUrl"
              :src="companyInfo.logoUrl"
              :alt="companyInfo.companyName"
              class="h-16 w-auto mb-4"
            />
            <h1 class="text-2xl font-bold text-gray-900 mb-2">
              {{ companyInfo?.companyName || 'Your Company' }}
            </h1>
            <div class="text-sm text-gray-600 space-y-1">
              <p v-if="companyInfo?.address">{{ companyInfo.address }}</p>
              <p v-if="companyInfo?.city || companyInfo?.state || companyInfo?.zipCode">
                {{ [companyInfo.city, companyInfo.state, companyInfo.zipCode].filter(Boolean).join(', ') }}
              </p>
              <p v-if="companyInfo?.country">{{ companyInfo.country }}</p>
              <p v-if="companyInfo?.email">{{ companyInfo.email }}</p>
              <p v-if="companyInfo?.phone">{{ companyInfo.phone }}</p>
            </div>
          </div>

          <!-- Invoice Info -->
          <div class="text-right">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
            <div class="text-sm space-y-2">
              <div class="flex justify-end gap-8">
                <span class="text-gray-600">Invoice #:</span>
                <span class="font-medium text-gray-900">{{ invoice.invoiceNumber }}</span>
              </div>
              <div class="flex justify-end gap-8">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium text-gray-900">{{ formatDate(invoice.invoiceDate) }}</span>
              </div>
              <div class="flex justify-end gap-8">
                <span class="text-gray-600">Due Date:</span>
                <span class="font-medium text-gray-900">{{ formatDate(invoice.dueDate) }}</span>
              </div>
              <div class="flex justify-end gap-8">
                <span class="text-gray-600">Status:</span>
                <span
                  class="inline-flex px-2 py-1 text-xs font-medium rounded-full print:border"
                  :class="getStatusClass(invoice.status)"
                >
                  {{ invoice.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill To -->
        <div class="mb-12">
          <h3 class="text-sm font-semibold text-gray-900 uppercase mb-2">Bill To:</h3>
          <div class="text-gray-700">
            <p class="font-medium text-lg">{{ invoice.clientName }}</p>
            <div v-if="clientContact" class="text-sm space-y-1 mt-2">
              <p v-if="clientContact.company">{{ clientContact.company }}</p>
              <p v-if="clientContact.address">{{ clientContact.address }}</p>
              <p v-if="clientContact.city || clientContact.state || clientContact.zipCode">
                {{ [clientContact.city, clientContact.state, clientContact.zipCode].filter(Boolean).join(', ') }}
              </p>
              <p v-if="clientContact.country">{{ clientContact.country }}</p>
              <p v-if="clientContact.email">{{ clientContact.email }}</p>
              <p v-if="clientContact.phone">{{ clientContact.phone }}</p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="mb-12">
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-900">
                <th class="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                <th class="text-right py-3 text-sm font-semibold text-gray-900">Qty</th>
                <th class="text-right py-3 text-sm font-semibold text-gray-900">Rate</th>
                <th class="text-right py-3 text-sm font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in invoice.items"
                :key="index"
                class="border-b border-gray-200"
              >
                <td class="py-3 text-gray-700">{{ item.description }}</td>
                <td class="py-3 text-right text-gray-700">{{ item.quantity }}</td>
                <td class="py-3 text-right text-gray-700">${{ formatCurrency(item.rate) }}</td>
                <td class="py-3 text-right text-gray-900 font-medium">
                  ${{ formatCurrency(item.quantity * item.rate) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="flex justify-end mb-12">
          <div class="w-80">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="text-gray-900">${{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax ({{ invoice.taxRate }}%):</span>
                <span class="text-gray-900">${{ formatCurrency(invoice.taxAmount) }}</span>
              </div>
              <div class="flex justify-between pt-3 border-t-2 border-gray-900">
                <span class="text-lg font-bold text-gray-900">Total:</span>
                <span class="text-2xl font-bold text-gray-900">${{ formatCurrency(invoice.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="mb-8">
          <h3 class="text-sm font-semibold text-gray-900 uppercase mb-2">Notes:</h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ invoice.notes }}</p>
        </div>

        <!-- Footer -->
        <div class="pt-8 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-600">
            Thank you for your business!
          </p>
          <p v-if="companyInfo?.website" class="text-sm text-gray-500 mt-2">
            {{ companyInfo.website }}
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="py-24 text-center">
        <FileText :size="48" class="text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Invoice not found</h3>
        <p class="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
        <button
          @click="$router.push('/professional/invoices')"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft :size="16" />
          Back to Invoices
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { ArrowLeft, Pencil, Printer, Loader2, FileText } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const loading = ref(false)
const invoice = ref(null)

const companyInfo = computed(() => professionalStore.companyInfo)
const clientContact = computed(() => {
  if (!invoice.value?.clientId) return null
  return professionalStore.contacts.find(c => c.id === invoice.value.clientId)
})

onMounted(async () => {
  if (mainStore.user?.uid) {
    loading.value = true
    try {
      // Load all necessary data
      await Promise.all([
        professionalStore.fetchCompanyInfo(mainStore.user.uid),
        professionalStore.fetchContacts(mainStore.user.uid),
        professionalStore.fetchInvoices(mainStore.user.uid)
      ])

      // Find the invoice
      invoice.value = professionalStore.invoices.find(inv => inv.id === route.params.id)

      if (!invoice.value) {
        toast({
          title: 'Error',
          description: 'Invoice not found',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error loading invoice:', error)
      toast({
        title: 'Error',
        description: 'Failed to load invoice',
        variant: 'destructive'
      })
    } finally {
      loading.value = false
    }
  }
})

function formatDate(date) {
  if (!date) return '—'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return '—'
  }
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function getStatusClass(status) {
  const classes = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.draft
}

function editInvoice() {
  router.push(`/professional/invoices/${invoice.value.id}/edit`)
}

function printInvoice() {
  window.print()
}

async function updateStatus(newStatus) {
  if (!mainStore.user?.uid || !invoice.value) return

  try {
    await professionalStore.updateInvoice(mainStore.user.uid, invoice.value.id, {
      status: newStatus
    })
    invoice.value.status = newStatus
    toast({
      title: 'Success',
      description: 'Invoice status updated'
    })
  } catch (error) {
    console.error('Error updating status:', error)
    toast({
      title: 'Error',
      description: 'Failed to update status',
      variant: 'destructive'
    })
  }
}
</script>

<style scoped>
@media print {
  @page {
    margin: 1cm;
  }

  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
