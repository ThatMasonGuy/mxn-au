<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ isEditing ? 'Edit Item' : 'New Catalogue Item' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ isEditing ? 'Update product or service details.' : 'Add a product or service to your catalogue.' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Image -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Image</h2>

        <div class="flex items-start gap-4 sm:gap-6">
          <div class="w-28 h-28 sm:w-36 sm:h-36 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            <img
              v-if="imagePreview || form.imageUrl"
              :src="imagePreview || form.imageUrl"
              alt="Item image"
              class="w-full h-full object-cover"
            />
            <Package v-else :size="36" class="text-gray-300 dark:text-gray-600" />
          </div>
          <div class="flex-1">
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                @click="$refs.imageInput.click()"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Upload :size="15" />
                {{ form.imageUrl ? 'Change' : 'Upload' }}
              </button>
              <button
                v-if="form.imageUrl || imagePreview"
                type="button"
                @click="removeImage"
                class="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 :size="15" />
                Remove
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Square image recommended. Max 5MB.</p>
          </div>
        </div>
      </section>

      <!-- Details -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Details</h2>

        <div class="space-y-4">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type *</label>
            <div class="flex gap-3">
              <label
                class="flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                :class="form.type === 'product'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
              >
                <input v-model="form.type" type="radio" value="product" class="sr-only" />
                <Package :size="18" :class="form.type === 'product' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'" />
                <div>
                  <p class="text-sm font-medium" :class="form.type === 'product' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'">Product</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Physical or digital item</p>
                </div>
              </label>
              <label
                class="flex-1 flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                :class="form.type === 'service'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
              >
                <input v-model="form.type" type="radio" value="service" class="sr-only" />
                <Wrench :size="18" :class="form.type === 'service' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'" />
                <div>
                  <p class="text-sm font-medium" :class="form.type === 'service' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'">Service</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Work or time-based</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
            <Input v-model="form.name" placeholder="e.g. Logo Design Package" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Describe this product or service..."
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Pricing</h2>

        <div class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ currencySymbol }}</span>
                <input
                  v-model.number="form.price"
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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit</label>
              <select
                v-model="form.unit"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">No unit</option>
                <option value="each">Each</option>
                <option value="hour">Hour</option>
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="project">Project</option>
                <option value="kg">kg</option>
                <option value="metre">Metre</option>
                <option value="sqm">Sqm</option>
                <option value="unit">Unit</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU / Item Code</label>
            <Input v-model="form.sku" placeholder="Optional identifier" />
          </div>

          <div class="flex items-center gap-3">
            <input id="taxable" v-model="form.taxable" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label for="taxable" class="text-sm text-gray-700 dark:text-gray-300">
              Taxable ({{ professionalStore.settings.taxLabel || 'GST' }} applies)
            </label>
          </div>
        </div>
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
          {{ saving ? 'Saving...' : isEditing ? 'Update Item' : 'Save Item' }}
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
  ArrowLeft, Save, Loader2, Upload, Trash2, Package, Wrench
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const imageInput = ref(null)
const imagePreview = ref(null)
const newImageFile = ref(null)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const form = reactive({
  type: 'product',
  name: '',
  description: '',
  price: null,
  unit: '',
  sku: '',
  taxable: true,
  imageUrl: '',
  imagePath: ''
})

function handleImageSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast({ title: 'Error', description: 'Image must be less than 5MB', variant: 'destructive' })
    return
  }
  if (!file.type.startsWith('image/')) {
    toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' })
    return
  }
  newImageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = e.target.result }
  reader.readAsDataURL(file)
}

function removeImage() {
  newImageFile.value = null
  imagePreview.value = null
  form.imageUrl = ''
  form.imagePath = ''
  if (imageInput.value) imageInput.value.value = ''
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return
  saving.value = true

  try {
    // Upload image if new
    if (newImageFile.value) {
      if (form.imagePath) {
        await professionalStore.deleteFile(form.imagePath)
      }
      const result = await professionalStore.uploadCatalogueImage(mainStore.user.uid, newImageFile.value)
      form.imageUrl = result.url
      form.imagePath = result.path
    }

    const itemData = { ...form }

    if (isEditing.value) {
      await professionalStore.updateCatalogueItem(mainStore.user.uid, route.params.id, itemData)
      toast({ title: 'Updated', description: 'Catalogue item updated' })
    } else {
      await professionalStore.addCatalogueItem(mainStore.user.uid, itemData)
      toast({ title: 'Saved', description: 'Catalogue item added' })
    }

    router.push('/professional/catalogue')
  } catch (error) {
    console.error('Error saving catalogue item:', error)
    toast({ title: 'Error', description: 'Failed to save item', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!mainStore.user?.uid) return

  if (isEditing.value) {
    if (!professionalStore.catalogue.length) {
      await professionalStore.fetchCatalogue(mainStore.user.uid)
    }
    const item = professionalStore.catalogue.find(i => i.id === route.params.id)
    if (item) {
      Object.keys(form).forEach(key => {
        if (item[key] !== undefined) form[key] = item[key]
      })
    } else {
      toast({ title: 'Not found', description: 'Catalogue item not found', variant: 'destructive' })
      router.push('/professional/catalogue')
    }
  }
})
</script>
