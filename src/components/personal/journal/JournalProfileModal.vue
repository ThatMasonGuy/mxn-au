<template>
    <div v-bind="$attrs">
        <div v-show="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur"
            @click.self="closeModal" @keydown.esc.prevent="closeModal" tabindex="0">
            <div class="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border border-zinc-200 dark:border-zinc-800"
                @click.stop>
                <!-- X Close Button -->
                <button @click="closeModal"
                    class="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Close">
                    <!-- Heroicon: X -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 pointer-events-none" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 class="text-2xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">User Profile</h2>
                <div class="text-zinc-500 mb-4 text-sm">This profile shapes your journaling AI's behavior and how it
                    greets
                    you.</div>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">Display
                            Name</label>
                        <input v-model="displayName" type="text"
                            class="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Your display name" maxlength="32" />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1 block">Journal Profile /
                            Instructions</label>
                        <textarea v-model="profile" rows="4"
                            class="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="E.g. I want to focus on gratitude, self-reflection, and personal growth. My tone should be casual and encouraging. Avoid talking about work."
                            maxlength="1000" />
                    </div>
                    <div v-if="errorMsg" class="text-red-600 text-xs">{{ errorMsg }}</div>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button
                        class="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600"
                        @click="closeModal" :disabled="saving">
                        Cancel
                    </button>
                    <button class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                        @click="saveProfile" :disabled="saving">
                        {{ saving ? 'Saving...' : 'Save' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useJournalChatStore } from '@/stores/useJournalChatStore'
import { useMainStore } from '@/stores/useMainStore'

const props = defineProps({
    show: Boolean,
})
const emit = defineEmits(['close'])

const mainStore = useMainStore()
const chatStore = useJournalChatStore()

const displayName = ref('')
const profile = ref('')
const saving = ref(false)
const errorMsg = ref('')

watch(() => chatStore.userProfile, (val) => {
    displayName.value = val?.displayName || (mainStore.user?.userName || mainStore.user?.email || '')
    profile.value = val?.profile || ''
}, { immediate: true })

onMounted(() => {
    if (mainStore.user && mainStore.user.uid) chatStore.loadUserProfile(mainStore.user.uid)
})

function closeModal() {
    emit('close')
    errorMsg.value = ''
}
async function saveProfile() {
    if (!profile.value.trim()) {
        errorMsg.value = 'Profile instructions cannot be empty.'
        return
    }
    saving.value = true
    await chatStore.saveUserProfile(mainStore.user.uid, {
        displayName: displayName.value,
        profile: profile.value
    })
    saving.value = false
    closeModal()
}
</script>