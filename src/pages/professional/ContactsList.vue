<template>
  <div class="p-8 bg-gray-950 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Contacts</h1>
        <p class="text-gray-400">Manage your clients and vendors.</p>
      </div>
      <router-link to="/professional/contacts/new"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
        <Plus :size="20" />
        Add Contact
      </router-link>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-4 mb-6">
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input v-model="searchQuery" placeholder="Search contacts..."
            class="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20" />
        </div>
        <Select v-model="filterType">
          <SelectTrigger
            class="w-48 bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent class="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="all" class="focus:bg-gray-700">All Types</SelectItem>
            <SelectItem value="client" class="focus:bg-gray-700">Clients</SelectItem>
            <SelectItem value="vendor" class="focus:bg-gray-700">Vendors</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Contacts List -->
    <div class="bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <Loader2 :size="48" class="animate-spin text-gray-600 mx-auto mb-4" />
        <p class="text-gray-500">Loading contacts...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredContacts.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
          <Users :size="32" class="text-gray-600" />
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">
          {{ searchQuery || filterType !== 'all' ? 'No contacts found' : 'No contacts yet' }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ searchQuery || filterType !== 'all'
            ? 'Try adjusting your search or filters'
            : 'Get started by adding your first contact'
          }}
        </p>
        <router-link v-if="!searchQuery && filterType === 'all'" to="/professional/contacts/new"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <Plus :size="20" />
          Add Contact
        </router-link>
      </div>

      <!-- Contacts Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="contact in paginatedContacts" :key="contact.id"
              class="hover:bg-gray-800/50 cursor-pointer transition-colors group" @click="viewContact(contact.id)">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
                    {{ getInitials(contact.name) }}
                  </div>
                  <div>
                    <div class="font-medium text-white">{{ contact.name }}</div>
                    <div v-if="contact.company" class="text-sm text-gray-500">{{ contact.company }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2.5 py-1 text-xs font-medium rounded-full border" :class="contact.type === 'client'
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30'">
                  {{ contact.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ contact.email || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ contact.phone || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click.stop>
                  <button @click="editContact(contact.id)"
                    class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit">
                    <Pencil :size="16" />
                  </button>
                  <button @click="confirmDelete(contact)"
                    class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1"
        class="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-gray-800/30">
        <p class="text-sm text-gray-400">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredContacts.length) }} of {{
            filteredContacts.length }} contacts
        </p>
        <div class="flex gap-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="px-3 py-1.5 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="deleteDialog.open" @update:open="deleteDialog.open = $event">
      <AlertDialogContent class="bg-gray-900 border-gray-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-white">Delete Contact</AlertDialogTitle>
          <AlertDialogDescription class="text-gray-400">
            Are you sure you want to delete <strong class="text-white">{{ deleteDialog.contact?.name }}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDelete" class="bg-red-600 hover:bg-red-700 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/toast'
import { Plus, Search, Users, Pencil, Trash2, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const loading = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

const deleteDialog = ref({
  open: false,
  contact: null
})

onMounted(async () => {
  if (mainStore.user?.uid) {
    loading.value = true
    try {
      await professionalStore.fetchContacts(mainStore.user.uid)
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive'
      })
    } finally {
      loading.value = false
    }
  }
})

const filteredContacts = computed(() => {
  let contacts = professionalStore.sortedContacts

  if (filterType.value !== 'all') {
    contacts = contacts.filter(c => c.type === filterType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    contacts = contacts.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.company?.toLowerCase().includes(query) ||
      c.phone?.includes(query)
    )
  }

  return contacts
})

const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)
const paginatedContacts = computed(() =>
  filteredContacts.value.slice(startIndex.value, endIndex.value)
)

watch([searchQuery, filterType], () => {
  currentPage.value = 1
})

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function viewContact(id) {
  router.push(`/professional/contacts/${id}`)
}

function editContact(id) {
  router.push(`/professional/contacts/${id}/edit`)
}

function confirmDelete(contact) {
  deleteDialog.value = {
    open: true,
    contact
  }
}

async function handleDelete() {
  if (!mainStore.user?.uid || !deleteDialog.value.contact) return

  try {
    await professionalStore.deleteContact(mainStore.user.uid, deleteDialog.value.contact.id)
    toast({
      title: 'Success',
      description: 'Contact deleted successfully'
    })
    deleteDialog.value = { open: false, contact: null }
  } catch (error) {
    console.error('Error deleting contact:', error)
    toast({
      title: 'Error',
      description: 'Failed to delete contact',
      variant: 'destructive'
    })
  }
}
</script>