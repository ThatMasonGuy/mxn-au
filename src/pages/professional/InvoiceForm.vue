<template>
  <div class="p-8 max-w-5xl">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft :size="20" />
        </button>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Invoice' : 'New Invoice' }}
        </h1>
      </div>
      <p class="text-gray-600 pl-11">{{ isEditing ? 'Update invoice details' : 'Create a new invoice for your client' }}</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form @submit.prevent="handleSubmit">
        <!-- Invoice Header Info -->
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label for="invoiceNumber" class="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number *
            </label>
            <Input
              id="invoiceNumber"
              v-model="form.invoiceNumber"
              placeholder="INV-001"
              required
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <Select v-model="form.status" required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label for="invoiceDate" class="block text-sm font-medium text-gray-700 mb-2">
              Invoice Date *
            </label>
            <Input
              id="invoiceDate"
              v-model="form.invoiceDate"
              type="date"
              required
            />
          </div>

          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <Input
              id="dueDate"
              v-model="form.dueDate"
              type="date"
              required
            />
          </div>
        </div>

        <!-- Client Selection -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Client *
          </label>
          <div v-if="selectedContact" class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {{ getInitials(selectedContact.name) }}
            </div>
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ selectedContact.name }}</p>
              <p class="text-sm text-gray-600">{{ selectedContact.email }}</p>
            </div>
            <button
              type="button"
              @click="selectedContact = null; form.clientId = ''; form.clientName = ''"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X :size="16" />
            </button>
          </div>
          <Select v-else v-model="form.clientId" required @update:model-value="handleClientSelect">
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="contact in clientContacts"
                :key="contact.id"
                :value="contact.id"
              >
                {{ contact.name }} {{ contact.company ? `(${contact.company})` : '' }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Line Items -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <label class="block text-sm font-medium text-gray-700">
              Items *
            </label>
            <button
              type="button"
              @click="addLineItem"
              class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus :size="16" />
              Add Item
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg"
            >
              <div class="col-span-5">
                <Input
                  v-model="item.description"
                  placeholder="Description"
                  required
                />
              </div>
              <div class="col-span-2">
                <Input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Qty"
                  required
                  @input="calculateTotal"
                />
              </div>
              <div class="col-span-2">
                <Input
                  v-model.number="item.rate"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Rate"
                  required
                  @input="calculateTotal"
                />
              </div>
              <div class="col-span-2 flex items-center">
                <span class="text-sm font-medium text-gray-900">
                  ${{ formatCurrency(item.quantity * item.rate) }}
                </span>
              </div>
              <div class="col-span-1 flex items-center justify-end">
                <button
                  type="button"
                  @click="removeLineItem(index)"
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  :disabled="form.items.length === 1"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="mb-8">
          <div class="bg-gray-50 rounded-lg p-6 ml-auto max-w-xs">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-gray-900">${{ formatCurrency(form.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm items-center gap-4">
                <span class="text-gray-600">Tax (%)</span>
                <Input
                  v-model.number="form.taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-20 text-right"
                  @input="calculateTotal"
                />
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Tax Amount</span>
                <span class="font-medium text-gray-900">${{ formatCurrency(form.taxAmount) }}</span>
              </div>
              <div class="pt-3 border-t border-gray-300 flex justify-between">
                <span class="font-semibold text-gray-900">Total</span>
                <span class="font-bold text-xl text-gray-900">${{ formatCurrency(form.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mb-8">
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes or payment terms..."
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="saving"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
          >
            <Loader2 v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" />
            {{ saving ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { ArrowLeft, Save, Loader2, Plus, Trash2, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const saving = ref(false)
const isEditing = computed(() => !!route.params.id && route.params.id !== 'new')
const selectedContact = ref(null)

const form = reactive({
  invoiceNumber: '',
  status: 'draft',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  clientId: '',
  clientName: '',
  items: [
    { description: '', quantity: 1, rate: 0 }
  ],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  notes: ''
})

const clientContacts = computed(() => 
  professionalStore.sortedContacts.filter(c => c.type === 'client')
)

onMounted(async () => {
  if (mainStore.user?.uid) {
    // Load contacts if not already loaded
    if (professionalStore.contacts.length === 0) {
      try {
        await professionalStore.fetchContacts(mainStore.user.uid)
      } catch (error) {
        console.error('Error loading contacts:', error)
      }
    }

    // Load existing invoice if editing
    if (isEditing.value) {
      const invoice = professionalStore.invoices.find(inv => inv.id === route.params.id)
      if (invoice) {
        Object.assign(form, invoice)
        // Set selected contact
        if (invoice.clientId) {
          selectedContact.value = professionalStore.contacts.find(c => c.id === invoice.clientId)
        }
      } else {
        // If invoice not in store, fetch it
        try {
          await professionalStore.fetchInvoices(mainStore.user.uid)
          const loadedInvoice = professionalStore.invoices.find(inv => inv.id === route.params.id)
          if (loadedInvoice) {
            Object.assign(form, loadedInvoice)
            if (loadedInvoice.clientId) {
              selectedContact.value = professionalStore.contacts.find(c => c.id === loadedInvoice.clientId)
            }
          } else {
            toast({
              title: 'Error',
              description: 'Invoice not found',
              variant: 'destructive'
            })
            router.push('/professional/invoices')
          }
        } catch (error) {
          console.error('Error loading invoice:', error)
          toast({
            title: 'Error',
            description: 'Failed to load invoice',
            variant: 'destructive'
          })
          router.push('/professional/invoices')
        }
      }
    }
  }

  calculateTotal()
})

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function handleClientSelect(clientId) {
  const contact = professionalStore.contacts.find(c => c.id === clientId)
  if (contact) {
    form.clientId = contact.id
    form.clientName = contact.name
    selectedContact.value = contact
  }
}

function addLineItem() {
  form.items.push({ description: '', quantity: 1, rate: 0 })
}

function removeLineItem(index) {
  if (form.items.length > 1) {
    form.items.splice(index, 1)
    calculateTotal()
  }
}

function calculateTotal() {
  // Calculate subtotal
  form.subtotal = form.items.reduce((sum, item) => {
    return sum + (item.quantity * item.rate)
  }, 0)

  // Calculate tax
  form.taxAmount = (form.subtotal * form.taxRate) / 100

  // Calculate total
  form.total = form.subtotal + form.taxAmount
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return

  // Validate
  if (!form.clientId) {
    toast({
      title: 'Error',
      description: 'Please select a client',
      variant: 'destructive'
    })
    return
  }

  if (form.items.length === 0 || form.items.some(item => !item.description)) {
    toast({
      title: 'Error',
      description: 'Please add at least one item with a description',
      variant: 'destructive'
    })
    return
  }

  saving.value = true

  try {
    const invoiceData = {
      ...form,
      // Ensure all numbers are properly formatted
      subtotal: Number(form.subtotal),
      taxRate: Number(form.taxRate),
      taxAmount: Number(form.taxAmount),
      total: Number(form.total),
      items: form.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        rate: Number(item.rate)
      }))
    }

    if (isEditing.value) {
      await professionalStore.updateInvoice(mainStore.user.uid, route.params.id, invoiceData)
      toast({
        title: 'Success',
        description: 'Invoice updated successfully'
      })
    } else {
      await professionalStore.addInvoice(mainStore.user.uid, invoiceData)
      toast({
        title: 'Success',
        description: 'Invoice created successfully'
      })
    }

    router.push('/professional/invoices')
  } catch (error) {
    console.error('Error saving invoice:', error)
    toast({
      title: 'Error',
      description: `Failed to ${isEditing.value ? 'update' : 'create'} invoice`,
      variant: 'destructive'
    })
  } finally {
    saving.value = false
  }
}

// Watch for changes in items, taxRate to recalculate
watch(() => [form.items, form.taxRate], () => {
  calculateTotal()
}, { deep: true })
</script>
