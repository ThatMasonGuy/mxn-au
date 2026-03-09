<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl">
    <!-- Header -->
    <div class="mb-6 lg:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Company Settings</h1>
      <p class="text-gray-600 dark:text-gray-400">Manage your company information, billing defaults and integrations.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- ═══ Company Info ═══ -->
      <section class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5">Company Information</h2>

        <!-- Logo Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Company Logo</label>
          <div class="flex items-start gap-4 sm:gap-6">
            <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              <img
                v-if="logoPreview || form.logoUrl"
                :src="logoPreview || form.logoUrl"
                alt="Company logo"
                class="w-full h-full object-contain"
              />
              <Building2 v-else :size="40" class="text-gray-400" />
            </div>
            <div class="flex-1">
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
              <div class="flex flex-wrap gap-2">
                <button type="button" @click="$refs.fileInput.click()" class="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors">
                  <Upload :size="15" />
                  {{ form.logoUrl ? 'Change' : 'Upload' }}
                </button>
                <button v-if="form.logoUrl || logoPreview" type="button" @click="removeLogo" class="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 :size="15" />
                  Remove
                </button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Square image, at least 200×200px. Max 2MB.</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
            <Input v-model="form.companyName" placeholder="Acme Corporation" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <Input v-model="form.email" type="email" placeholder="contact@company.com" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <Input v-model="form.phone" type="tel" placeholder="+61 400 000 000" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <Input v-model="form.address" placeholder="123 Business Street" />
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <Input v-model="form.city" placeholder="Brisbane" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
              <Input v-model="form.state" placeholder="QLD" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postcode</label>
              <Input v-model="form.zipCode" placeholder="4000" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <Input v-model="form.country" placeholder="Australia" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <Input v-model="form.website" type="url" placeholder="https://company.com" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ABN / Tax ID</label>
            <Input v-model="form.taxId" placeholder="12 345 678 901" />
          </div>
        </div>
      </section>

      <!-- ═══ Bank Details ═══ -->
      <section class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Bank Details</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Displayed on your invoices for direct bank transfers.</p>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
              <Input v-model="form.bankName" placeholder="Commonwealth Bank" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
              <Input v-model="form.bankAccountName" placeholder="Acme Corporation Pty Ltd" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BSB</label>
              <Input v-model="form.bankBSB" placeholder="062-000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
              <Input v-model="form.bankAccountNumber" placeholder="1234 5678" />
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ Invoice Defaults ═══ -->
      <section class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Invoice Defaults</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Configure numbering, tax and payment terms for new invoices.</p>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice Prefix</label>
              <Input v-model="form.invoicePrefix" placeholder="INV-" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Number</label>
              <Input v-model.number="form.invoiceNextNumber" type="number" min="1" placeholder="1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Terms (days)</label>
              <Input v-model.number="form.defaultPaymentTermsDays" type="number" min="0" placeholder="14" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
              <select v-model="form.currency" class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm">
                <option value="AUD">AUD ($)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="EUR">EUR (€)</option>
                <option value="NZD">NZD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Label</label>
              <Input v-model="form.taxLabel" placeholder="GST" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
              <Input v-model.number="form.taxRate" type="number" min="0" max="100" step="0.1" placeholder="10" />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input id="taxEnabled" v-model="form.taxEnabled" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="taxEnabled" class="text-sm text-gray-700 dark:text-gray-300">Enable tax on invoices by default</label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Invoice Notes</label>
            <textarea
              v-model="form.defaultInvoiceNotes"
              rows="2"
              placeholder="Thank you for your business!"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Payment Instructions</label>
            <textarea
              v-model="form.defaultPaymentInstructions"
              rows="2"
              placeholder="Please pay via bank transfer or use the payment link provided."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <!-- ═══ Stripe Connection ═══ -->
      <section class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Stripe Integration</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Connect Stripe to generate payment and subscription links.</p>

        <div v-if="form.stripeConnected" class="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg mb-4">
          <CheckCircle :size="20" class="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm font-medium text-emerald-800 dark:text-emerald-200">Stripe Connected</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400">Account: {{ form.stripeAccountId }}</p>
          </div>
          <button type="button" @click="disconnectStripe" class="text-sm text-red-600 dark:text-red-400 hover:underline">
            Disconnect
          </button>
        </div>

        <div v-else class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <AlertCircle :size="20" class="text-gray-400 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">Stripe is not connected. Payment links will not work until connected.</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stripe Account ID</label>
          <Input v-model="form.stripeAccountId" placeholder="acct_1234567890" />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter your Stripe account ID and save to connect.</p>
        </div>

        <div class="flex items-center gap-3 mt-3">
          <input id="stripeConnected" v-model="form.stripeConnected" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label for="stripeConnected" class="text-sm text-gray-700 dark:text-gray-300">Mark as connected</label>
        </div>
      </section>

      <!-- ═══ Email Configuration ═══ -->
      <section class="professional-card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Configuration</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">Configure how outgoing invoice and reminder emails appear.</p>

        <div class="space-y-4">
          <div class="flex items-center gap-3 mb-2">
            <input id="emailEnabled" v-model="form.emailEnabled" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="emailEnabled" class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable email sending</label>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Name</label>
              <Input v-model="form.emailFromName" placeholder="Acme Corporation" :disabled="!form.emailEnabled" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reply-To Email</label>
              <Input v-model="form.emailReplyTo" type="email" placeholder="billing@company.com" :disabled="!form.emailEnabled" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reminder Schedule</label>
            <div class="flex items-center gap-3 mb-2">
              <input id="reminderEnabled" v-model="form.reminderEnabled" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" :disabled="!form.emailEnabled" />
              <label for="reminderEnabled" class="text-sm text-gray-700 dark:text-gray-300">Send automatic reminders for overdue invoices</label>
            </div>
            <p v-if="form.reminderEnabled" class="text-xs text-gray-500 dark:text-gray-400">
              Reminders will be sent {{ form.reminderDays?.join(', ') || '7, 14, 30' }} days after the due date.
            </p>
          </div>
        </div>
      </section>

      <!-- ═══ Save Actions ═══ -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2 pb-8">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm"
          :disabled="saving"
        >
          Reset
        </button>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          :disabled="saving"
        >
          <Loader2 v-if="saving" :size="16" class="animate-spin" />
          <Save v-else :size="16" />
          {{ saving ? 'Saving...' : 'Save All Settings' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import {
  Building2,
  Upload,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const fileInput = ref(null)
const logoPreview = ref(null)
const logoFile = ref(null)
const saving = ref(false)

const form = reactive({
  // Company info
  companyName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Australia',
  website: '',
  taxId: '',
  logoUrl: '',
  logoPath: '',
  // Bank details
  bankName: '',
  bankAccountName: '',
  bankBSB: '',
  bankAccountNumber: '',
  // Invoice defaults
  invoicePrefix: 'INV-',
  invoiceNextNumber: 1,
  defaultPaymentTermsDays: 14,
  currency: 'AUD',
  currencySymbol: '$',
  taxEnabled: true,
  taxLabel: 'GST',
  taxRate: 10,
  defaultInvoiceNotes: '',
  defaultPaymentInstructions: '',
  // Stripe
  stripeAccountId: '',
  stripeConnected: false,
  // Email
  emailEnabled: false,
  emailFromName: '',
  emailReplyTo: '',
  reminderEnabled: false,
  reminderDays: [7, 14, 30],
})

// Map currency to symbol
const currencySymbols = { AUD: '$', USD: '$', GBP: '£', EUR: '€', NZD: '$', CAD: '$' }

onMounted(async () => {
  if (!mainStore.user?.uid) return
  try {
    await professionalStore.fetchCompanyInfo(mainStore.user.uid)
    await professionalStore.fetchSettings(mainStore.user.uid)

    // Merge company info
    if (professionalStore.companyInfo) {
      const ci = professionalStore.companyInfo
      Object.keys(ci).forEach(key => {
        if (key in form && ci[key] !== undefined) form[key] = ci[key]
      })
    }

    // Merge settings
    const s = professionalStore.settings
    Object.keys(s).forEach(key => {
      if (key in form && s[key] !== undefined) form[key] = s[key]
    })
  } catch (error) {
    console.error('Error loading company settings:', error)
  }
})

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    toast({ title: 'Error', description: 'File must be less than 2MB', variant: 'destructive' })
    return
  }
  if (!file.type.startsWith('image/')) {
    toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' })
    return
  }
  logoFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { logoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

function removeLogo() {
  logoFile.value = null
  logoPreview.value = null
  form.logoUrl = ''
  form.logoPath = ''
  if (fileInput.value) fileInput.value.value = ''
}

function disconnectStripe() {
  form.stripeAccountId = ''
  form.stripeConnected = false
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return
  saving.value = true

  try {
    // Upload logo if new file
    if (logoFile.value) {
      const logoData = await professionalStore.uploadCompanyLogo(mainStore.user.uid, logoFile.value)
      form.logoUrl = logoData.logoUrl
      form.logoPath = logoData.logoPath
    }

    // Update currency symbol
    form.currencySymbol = currencySymbols[form.currency] || '$'

    // Split data: company info vs settings
    const companyFields = [
      'companyName', 'email', 'phone', 'address', 'city', 'state',
      'zipCode', 'country', 'website', 'taxId', 'logoUrl', 'logoPath'
    ]
    const companyData = {}
    companyFields.forEach(k => { companyData[k] = form[k] })

    const settingsFields = [
      'bankName', 'bankAccountName', 'bankBSB', 'bankAccountNumber',
      'invoicePrefix', 'invoiceNextNumber', 'defaultPaymentTermsDays',
      'currency', 'currencySymbol', 'taxEnabled', 'taxLabel', 'taxRate',
      'defaultInvoiceNotes', 'defaultPaymentInstructions',
      'stripeAccountId', 'stripeConnected',
      'emailEnabled', 'emailFromName', 'emailReplyTo',
      'reminderEnabled', 'reminderDays'
    ]
    const settingsData = {}
    settingsFields.forEach(k => { settingsData[k] = form[k] })

    // Save both
    await Promise.all([
      professionalStore.saveCompanyInfo(mainStore.user.uid, companyData),
      professionalStore.saveSettings(mainStore.user.uid, settingsData)
    ])

    toast({ title: 'Saved', description: 'All settings saved successfully' })

    logoFile.value = null
    logoPreview.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    console.error('Error saving:', error)
    toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}

function resetForm() {
  // Reload from store
  if (professionalStore.companyInfo) {
    const ci = professionalStore.companyInfo
    Object.keys(ci).forEach(key => {
      if (key in form && ci[key] !== undefined) form[key] = ci[key]
    })
  }
  const s = professionalStore.settings
  Object.keys(s).forEach(key => {
    if (key in form && s[key] !== undefined) form[key] = s[key]
  })
  logoFile.value = null
  logoPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>