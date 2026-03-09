<template>
    <div class="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col">
        <GoblinTodoNav />

        <div class="flex-1 overflow-y-auto">
            <div class="max-w-2xl mx-auto px-6 py-8">
                <div class="mb-8">
                    <h1 class="text-base font-semibold text-zinc-100 flex items-center gap-2">
                        <Settings2 :size="16" class="text-zinc-400" />
                        Settings
                    </h1>
                    <p class="text-xs text-zinc-500 mt-1">Customise your task workflow</p>
                </div>

                <!-- ── Task statuses ───────────────────────────────────────────── -->
                <section class="mb-10">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h2 class="text-sm font-semibold text-zinc-200">Task statuses</h2>
                            <p class="text-xs text-zinc-500 mt-0.5">
                                Default statuses can't be removed. Custom ones appear in the status dropdown on your
                                plate.
                            </p>
                        </div>
                    </div>

                    <!-- Default statuses (read only) -->
                    <div class="space-y-2 mb-4">
                        <div v-for="s in store.DEFAULT_STATUSES" :key="s.id"
                            class="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                            <span :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', dotClass(s.color)]" />
                            <span class="text-sm text-zinc-300 flex-1">{{ s.label }}</span>
                            <span
                                class="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">default</span>
                        </div>
                    </div>

                    <!-- Custom statuses -->
                    <div class="space-y-2 mb-4">
                        <div v-for="(s, i) in customStatuses" :key="s.id"
                            class="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700">
                            <!-- Color picker -->
                            <div class="relative">
                                <button @click="colorPickerIndex = colorPickerIndex === i ? null : i"
                                    :class="['w-5 h-5 rounded-full border-2 border-zinc-600 flex-shrink-0', dotClass(s.color)]" />
                                <div v-if="colorPickerIndex === i"
                                    class="absolute left-0 top-7 z-10 flex gap-1 p-2 rounded-lg bg-zinc-800 border border-zinc-600 shadow-xl">
                                    <button v-for="color in COLOR_OPTIONS" :key="color"
                                        :class="['w-5 h-5 rounded-full transition-transform hover:scale-110', dotClass(color), s.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-800' : '']"
                                        @click.stop="setCustomStatusColor(i, color); colorPickerIndex = null" />
                                </div>
                            </div>

                            <input v-model="customStatuses[i].label" type="text"
                                class="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none placeholder-zinc-600 border-b border-transparent focus:border-zinc-600 transition-colors"
                                placeholder="Status name" @blur="saveStatuses" />

                            <button @click="removeCustomStatus(i)"
                                class="p-1 text-zinc-600 hover:text-rose-400 transition-colors">
                                <X :size="14" />
                            </button>
                        </div>
                    </div>

                    <!-- Add custom status -->
                    <div v-if="!addingStatus" class="mt-2">
                        <button @click="startAddStatus"
                            class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-zinc-500 transition-colors w-full justify-center">
                            <Plus :size="13" />
                            Add custom status
                        </button>
                    </div>

                    <div v-else class="mt-2 p-3 rounded-lg bg-zinc-800 border border-zinc-600">
                        <div class="flex items-center gap-3 mb-3">
                            <!-- Color pick for new -->
                            <div class="flex gap-1">
                                <button v-for="color in COLOR_OPTIONS" :key="color"
                                    :class="['w-4 h-4 rounded-full transition-transform hover:scale-110', dotClass(color), newStatus.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-800' : '']"
                                    @click="newStatus.color = color" />
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <input v-model="newStatus.label" ref="newStatusInput" type="text"
                                placeholder="Status name..."
                                class="flex-1 px-3 py-1.5 rounded-md text-sm bg-zinc-700 border border-zinc-600 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                                @keydown.enter="confirmAddStatus" @keydown.escape="addingStatus = false" />
                            <button @click="confirmAddStatus" :disabled="!newStatus.label.trim()"
                                class="px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-40 transition-colors">
                                Add
                            </button>
                            <button @click="addingStatus = false"
                                class="px-3 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </section>

                <!-- ── Permanent tags ──────────────────────────────────────────── -->
                <section class="mb-10">
                    <div class="mb-4">
                        <h2 class="text-sm font-semibold text-zinc-200">Permanent tags</h2>
                        <p class="text-xs text-zinc-500 mt-0.5">
                            These always appear as filter options in the queue. All tags — including freeform ones — are
                            always searchable.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2 mb-3">
                        <div v-for="(tag, i) in permanentTags" :key="tag"
                            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm bg-zinc-800 border border-zinc-600 text-zinc-300">
                            {{ tag }}
                            <button @click="removePermanentTag(i)"
                                class="text-zinc-600 hover:text-rose-400 transition-colors">
                                <X :size="12" />
                            </button>
                        </div>
                    </div>

                    <!-- Existing freeform tags that aren't permanent yet -->
                    <div v-if="unpinnedExistingTags.length" class="mb-3">
                        <p class="text-xs text-zinc-600 mb-2">From your existing tasks (click to pin):</p>
                        <div class="flex flex-wrap gap-1.5">
                            <button v-for="tag in unpinnedExistingTags" :key="tag" @click="pinTag(tag)"
                                class="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-zinc-800 border border-dashed border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors">
                                <Plus :size="10" />
                                {{ tag }}
                            </button>
                        </div>
                    </div>

                    <!-- Add new permanent tag -->
                    <div class="flex gap-2">
                        <input v-model="newTagInput" type="text" placeholder="Add permanent tag..."
                            class="flex-1 px-3 py-2 rounded-lg text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                            @keydown.enter="addPermanentTag" @keydown.comma.prevent="addPermanentTag" />
                        <button @click="addPermanentTag" :disabled="!newTagInput.trim()"
                            class="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-700 text-zinc-200 hover:bg-zinc-600 border border-zinc-600 disabled:opacity-40 transition-colors">
                            Add
                        </button>
                    </div>
                </section>

                <!-- Save indicator -->
                <div v-if="saveMsg" class="flex items-center gap-2 text-xs text-emerald-400 transition-opacity">
                    <CheckCircle :size="13" />
                    {{ saveMsg }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Settings2, Plus, X, CheckCircle } from 'lucide-vue-next'
import { useGoblinTodoStore } from '@/stores/useGoblinTodoStore'
import GoblinTodoNav from '@/components/personal/todo/GoblinTodoNav.vue'

const store = useGoblinTodoStore()

// ─── Local copies (we edit locally, save on change) ──────────────────────────
const customStatuses = ref([])
const permanentTags = ref([])
const addingStatus = ref(false)
const colorPickerIndex = ref(null)
const newStatusInput = ref(null)
const newTagInput = ref('')
const saveMsg = ref('')

const COLOR_OPTIONS = ['zinc', 'blue', 'emerald', 'amber', 'rose', 'purple']

const newStatus = ref({ label: '', color: 'blue' })

onMounted(async () => {
    if (!store.isInitialized) await store.init()
    customStatuses.value = store.customStatuses.map(s => ({ ...s }))
    permanentTags.value = [...store.permanentTags]
})

const dotClass = (color) => ({
    zinc: 'bg-zinc-500',
    blue: 'bg-blue-400',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    purple: 'bg-purple-400',
}[color] ?? 'bg-zinc-500')

// ─── Existing tags not yet pinned ─────────────────────────────────────────────
const unpinnedExistingTags = computed(() =>
    store.allTags.filter(t => !permanentTags.value.includes(t))
)

// ─── Status management ────────────────────────────────────────────────────────
const startAddStatus = async () => {
    addingStatus.value = true
    newStatus.value = { label: '', color: 'blue' }
    await nextTick()
    newStatusInput.value?.focus()
}

const confirmAddStatus = async () => {
    const label = newStatus.value.label.trim()
    if (!label) return
    const id = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    customStatuses.value.push({ id: `custom-${id}-${Date.now()}`, label, color: newStatus.value.color })
    addingStatus.value = false
    await saveStatuses()
}

const removeCustomStatus = async (i) => {
    customStatuses.value.splice(i, 1)
    await saveStatuses()
}

const setCustomStatusColor = async (i, color) => {
    customStatuses.value[i].color = color
    await saveStatuses()
}

const saveStatuses = async () => {
    await store.saveSettings({ newCustomStatuses: customStatuses.value.map(s => ({ ...s })) })
    showSaved()
}

// ─── Tag management ───────────────────────────────────────────────────────────
const addPermanentTag = async () => {
    const tag = newTagInput.value.trim().toLowerCase().replace(/,/g, '')
    if (!tag || permanentTags.value.includes(tag)) return
    permanentTags.value.push(tag)
    newTagInput.value = ''
    await saveTags()
}

const pinTag = async (tag) => {
    if (!permanentTags.value.includes(tag)) {
        permanentTags.value.push(tag)
        await saveTags()
    }
}

const removePermanentTag = async (i) => {
    permanentTags.value.splice(i, 1)
    await saveTags()
}

const saveTags = async () => {
    await store.saveSettings({ newPermanentTags: [...permanentTags.value] })
    showSaved()
}

// ─── Save indicator ───────────────────────────────────────────────────────────
let saveTimeout = null
const showSaved = () => {
    saveMsg.value = 'Saved'
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => { saveMsg.value = '' }, 2000)
}
</script>