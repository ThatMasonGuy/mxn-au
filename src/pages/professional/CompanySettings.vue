<template>
  <div class="p-8 max-w-4xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Company Settings</h1>
      <p class="text-gray-600">Manage your company information and branding.</p>
    </div>

    <!-- Company Information Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form @submit.prevent="handleSubmit">
        <!-- Logo Upload -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
          <div class="flex items-start gap-6">
            <!-- Logo Preview -->
            <div class="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                v-if="logoPreview || form.logoUrl"
                :src="logoPreview || form.logoUrl"
                alt="Company logo"
                class="w-full h-full object-contain"
              />
              <Building2 v-else :size="48" class="text-gray-400" />
            </div>

            <!-- Upload Controls -->
            <div class="flex-1">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload :size="16" />
                  {{ form.logoUrl ? 'Change Logo' : 'Upload Logo' }}
                </button>
                <button
                  v-if="form.logoUrl || logoPreview"
                  type="button"
                  @click="removeLogo"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 :size="16" />
                  Remove
                </button>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                Recommended: Square image, at least 200x200px. Max 2MB.
              </p>
              <p v-if="uploadProgress > 0 && uploadProgress < 100" class="text-sm text-blue-600 mt-2">
                Uploading: {{ uploadProgress }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Company Details -->
        <div class="space-y-6">
          <div>
            <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <Input
              id="companyName"
              v-model="form.companyName"
              placeholder="Acme Corporation"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="contact@company.com"
                required
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              id="address"
              v-model="form.address"
              placeholder="123 Business Street"
            />
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <Input
                id="city"
                v-model="form.city"
                placeholder="New York"
              />
            </div>

            <div>
              <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <Input
                id="state"
                v-model="form.state"
                placeholder="NY"
              />
            </div>

            <div>
              <label for="zipCode" class="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <Input
                id="zipCode"
                v-model="form.zipCode"
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <Input
              id="country"
              v-model="form.country"
              placeholder="United States"
            />
          </div>

          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <Input
              id="website"
              v-model="form.website"
              type="url"
              placeholder="https://company.com"
            />
          </div>

          <div>
            <label for="taxId" class="block text-sm font-medium text-gray-700 mb-2">
              Tax ID / Business Number
            </label>
            <Input
              id="taxId"
              v-model="form.taxId"
              placeholder="12-3456789"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            :disabled="saving"
          >
            Reset
          </button>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
          >
            <Loader2 v-if="saving" :size="16" class="animate-spin" />
            <Save v-else :size="16" />
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useMainStore } from '@/stores/useMainStore'
import { useProfessionalStore } from '@/stores/useProfessionalStore'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { Building2, Upload, Trash2, Save, Loader2 } from 'lucide-vue-next'

const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const fileInput = ref(null)
const logoPreview = ref(null)
const logoFile = ref(null)
const uploadProgress = ref(0)
const saving = ref(false)

const form = reactive({
  companyName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  website: '',
  taxId: '',
  logoUrl: '',
  logoPath: ''
})

onMounted(async () => {
  if (mainStore.user?.uid) {
    try {
      await professionalStore.fetchCompanyInfo(mainStore.user.uid)
      if (professionalStore.companyInfo) {
        Object.assign(form, professionalStore.companyInfo)
      }
    } catch (error) {
      console.error('Error loading company info:', error)
    }
  }
})

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast({
      title: 'Error',
      description: 'File size must be less than 2MB',
      variant: 'destructive'
    })
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast({
      title: 'Error',
      description: 'Please select an image file',
      variant: 'destructive'
    })
    return
  }

  logoFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeLogo() {
  logoFile.value = null
  logoPreview.value = null
  form.logoUrl = ''
  form.logoPath = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return

  saving.value = true
  uploadProgress.value = 0

  try {
    // Upload logo if there's a new file
    if (logoFile.value) {
      uploadProgress.value = 50
      const logoData = await professionalStore.uploadCompanyLogo(
        mainStore.user.uid,
        logoFile.value
      )
      form.logoUrl = logoData.logoUrl
      form.logoPath = logoData.logoPath
      uploadProgress.value = 100
    }

    // Save company info
    await professionalStore.saveCompanyInfo(mainStore.user.uid, { ...form })

    toast({
      title: 'Success',
      description: 'Company information saved successfully'
    })

    // Clear logo file and preview
    logoFile.value = null
    logoPreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    console.error('Error saving company info:', error)
    toast({
      title: 'Error',
      description: 'Failed to save company information',
      variant: 'destructive'
    })
  } finally {
    saving.value = false
    uploadProgress.value = 0
  }
}

function resetForm() {
  if (professionalStore.companyInfo) {
    Object.assign(form, professionalStore.companyInfo)
  } else {
    Object.keys(form).forEach(key => {
      form[key] = ''
    })
  }
  logoFile.value = null
  logoPreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
