<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-3xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
        <ArrowLeft :size="20" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ isEditing ? 'Edit Job' : 'New Job' }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ isEditing ? 'Update job details.' : 'Create a new project or job.' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">

      <!-- Details -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Details</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title *</label>
            <Input v-model="form.title" placeholder="e.g. Website Redesign" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
              <select
                v-model="form.clientId"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                @change="onClientChange"
              >
                <option value="">No client</option>
                <option v-for="c in professionalStore.clientContacts" :key="c.id" :value="c.id">{{ c.name }}</option>
                <optgroup v-if="professionalStore.vendorContacts.length" label="Vendors">
                  <option v-for="c in professionalStore.vendorContacts" :key="c.id" :value="c.id">{{ c.name }}</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Active</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="What is this job about?"
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <!-- Budget & Dates -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Budget &amp; Timeline</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ currencySymbol }}</span>
              <input
                v-model.number="form.budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full sm:w-64 pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty if no fixed budget.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <Input v-model="form.startDate" type="date" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <Input v-model="form.dueDate" type="date" />
            </div>
          </div>
        </div>
      </section>

      <!-- Internal Notes -->
      <section class="professional-card">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Internal Notes</h2>
        <textarea
          v-model="form.notes"
          rows="3"
          placeholder="Private notes (not visible to clients)..."
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
          {{ saving ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/shared/stores/useMainStore'
import { useProfessionalStore } from '@/features/professional/stores/useProfessionalStore'
import { Input } from '@/shared/components/ui/input'
import { useToast } from '@/shared/components/ui/toast'
import {
  ArrowLeft, Save, Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()
const professionalStore = useProfessionalStore()
const { toast } = useToast()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)

const currencySymbol = computed(() => professionalStore.settings.currencySymbol || '$')

const form = reactive({
  title: '',
  clientId: '',
  clientName: '',
  status: 'active',
  description: '',
  budget: null,
  startDate: '',
  dueDate: '',
  notes: ''
})

function onClientChange() {
  if (form.clientId) {
    const contact = professionalStore.contacts.find(c => c.id === form.clientId)
    form.clientName = contact?.name || ''
  } else {
    form.clientName = ''
  }
}

async function handleSubmit() {
  if (!mainStore.user?.uid) return
  saving.value = true

  try {
    const jobData = { ...form }

    if (!jobData.clientId) {
      jobData.clientId = ''
      jobData.clientName = ''
    }

    if (isEditing.value) {
      await professionalStore.updateJob(mainStore.user.uid, route.params.id, jobData)
      toast({ title: 'Updated', description: 'Job updated successfully' })
      router.push(`/professional/jobs/${route.params.id}`)
    } else {
      const newJob = await professionalStore.addJob(mainStore.user.uid, jobData)
      toast({ title: 'Created', description: 'Job created successfully' })
      router.push(`/professional/jobs/${newJob.id}`)
    }
  } catch (error) {
    console.error('Error saving job:', error)
    toast({ title: 'Error', description: 'Failed to save job', variant: 'destructive' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!mainStore.user?.uid) return

  // Load contacts for dropdown
  if (!professionalStore.contacts.length) {
    await professionalStore.fetchContacts(mainStore.user.uid)
  }

  if (isEditing.value) {
    if (!professionalStore.jobs.length) {
      await professionalStore.fetchJobs(mainStore.user.uid)
    }
    const job = professionalStore.jobs.find(j => j.id === route.params.id)
    if (job) {
      Object.keys(form).forEach(key => {
        if (job[key] !== undefined) form[key] = job[key]
      })
    } else {
      toast({ title: 'Not found', description: 'Job not found', variant: 'destructive' })
      router.push('/professional/jobs')
    }
  }
})
</script>
