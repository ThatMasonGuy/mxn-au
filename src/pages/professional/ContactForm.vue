<template>
  <div class="p-8 max-w-3xl">
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
          {{ isEditing ? 'Edit Contact' : 'New Contact' }}
        </h1>
      </div>
      <p class="text-gray-600 pl-11">{{ isEditing ? 'Update contact information' : 'Add a new client or vendor' }}</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contact Type *
            </label>
            <Select v-model="form.type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="John Doe"
              required
            />
          </div>

          <!-- Company -->
          <div>
            <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <Input
              id="company"
              v-model="form.company"
              placeholder="Acme Corporation"
            />
          </div>

          <!-- Email & Phone -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="john@example.com"
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

          <!-- Address -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              id="address"
              v-model="form.address"
              placeholder="123 Main Street"
            />
          </div>

          <!-- City, State, ZIP -->
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

          <!-- Country -->
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

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes about this contact..."
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
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
            {{ saving ? 'Saving...' : (isEditing ? 'Update Contact' : 'Create Contact') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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
import { ArrowLeft, Save, Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const saving = ref(false)
const isEditing = computed(() => !!route.params.id && route.params.id !== 'new')

const form = reactive({
  type: 'client',
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  notes: ''
})

onMounted(async () => {
  if (isEditing.value && mainStore.user?.uid) {
    // Load existing contact
    const contact = professionalStore.contacts.find(c => c.id === route.params.id)
    if (contact) {
      Object.assign(form, contact)
    } else {
      // If contact not in store, fetch it
      try {
        await professionalStore.fetchContacts(mainStore.user.uid)
        const loadedContact = professionalStore.contacts.find(c => c.id === route.params.id)
        if (loadedContact) {
          Object.assign(form, loadedContact)
        } else {
          toast({
            title: 'Error',
            description: 'Contact not found',
            variant: 'destructive'
          })
          router.push('/professional/contacts')
        }
      } catch (error) {
        console.error('Error loading contact:', error)
        toast({
          title: 'Error',
          description: 'Failed to load contact',
          variant: 'destructive'
        })
        router.push('/professional/contacts')
      }
    }
  }
})

async function handleSubmit() {
  if (!mainStore.user?.uid) return

  saving.value = true

  try {
    if (isEditing.value) {
      await professionalStore.updateContact(mainStore.user.uid, route.params.id, { ...form })
      toast({
        title: 'Success',
        description: 'Contact updated successfully'
      })
    } else {
      await professionalStore.addContact(mainStore.user.uid, { ...form })
      toast({
        title: 'Success',
        description: 'Contact created successfully'
      })
    }

    router.push('/professional/contacts')
  } catch (error) {
    console.error('Error saving contact:', error)
    toast({
      title: 'Error',
      description: `Failed to ${isEditing.value ? 'update' : 'create'} contact`,
      variant: 'destructive'
    })
  } finally {
    saving.value = false
  }
}
</script>
