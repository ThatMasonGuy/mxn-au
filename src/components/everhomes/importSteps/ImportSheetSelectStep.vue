<template>
    <div class="max-w-5xl mx-auto px-6 pb-12 pt-24">
        <!-- Heading -->
        <h1 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FolderIcon class="h-7 w-7 text-teal-400" />
            <span>Select Sheets to Include</span>
        </h1>

        <p class="text-sm text-gray-400 mb-10">
            We've scanned your file and found the following sheets. Select the ones that contain data you want to
            process.
        </p>

        <!-- Empty state -->
        <div v-if="store.parsedSheets.length === 0" class="text-center text-sm text-gray-400 py-12">
            <FolderIcon class="h-10 w-10 mx-auto mb-2 text-gray-600" />
            No sheets were detected in this file.
        </div>

        <!-- Sheet cards -->
        <TransitionGroup name="fade-slide" appear tag="div" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="sheet in store.parsedSheets" :key="sheet.name" tabindex="0"
                class="group border rounded-xl p-5 transition cursor-pointer outline-none" :class="[
                    sheet.selected ? 'border-teal-400 bg-gray-800/60' : 'border-gray-600 bg-gray-800/30',
                    'hover:border-teal-300 hover:shadow-md'
                ]" @click="toggleSheet(sheet)" @keyup.enter="toggleSheet(sheet)">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="font-semibold text-white text-sm truncate group-hover:text-teal-300 transition">
                        {{ sheet.name }}
                    </h2>
                    <div class="rounded-full px-2 py-0.5 text-xs font-medium transition duration-200" :class="sheet.selected
                        ? 'bg-teal-500/20 text-teal-300 scale-105'
                        : 'bg-gray-600/20 text-gray-400 scale-100'">
                        {{ sheet.selected ? 'Included' : 'Excluded' }}
                    </div>
                </div>

                <p class="text-xs text-gray-400">
                    {{ sheet.rowCount }} rows × {{ sheet.columnCount }} columns
                </p>

                <div class="text-xs mt-1 text-gray-500 flex items-center gap-1" v-if="sheet.hasTables">
                    <CheckCircleIcon class="h-4 w-4 text-green-400" />
                    {{ sheet.tables.length }} table{{ sheet.tables.length !== 1 ? 's' : '' }}
                </div>

                <div class="text-xs mt-1 text-gray-500 flex items-center gap-1" v-if="!sheet.hasTables">
                    <ExclamationTriangleIcon class="h-4 w-4 text-yellow-400" />
                    No detected tables
                </div>
            </div>
        </TransitionGroup>

        <!-- Footer action -->
        <div class="mt-10 flex justify-between items-center">
            <p class="text-sm text-gray-400">
                {{ selectedCount }} sheet{{ selectedCount === 1 ? '' : 's' }} selected
            </p>
            <button
                class="bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-6 py-2 rounded-lg disabled:opacity-30 transition"
                :disabled="selectedCount === 0" @click="emitNext">
                Continue
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useImportWizardStore } from '@/stores/useImportWizardStore'
import {
    FolderIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const store = useImportWizardStore()
const router = useRouter()

const selectedCount = computed(() => store.parsedSheets.filter(s => s.selected).length)

function toggleSheet(parsedSheets) {
    parsedSheets.selected = !parsedSheets.selected
}

async function goToNextStep() {
    router.push({ name: 'TableReview' })
}

onMounted(() => {
    console.log(store.parsedSheets)
})

function emitNext() {
    emit('next')
}

const emit = defineEmits(['next'])
</script>

<style scoped>
.fade-slide-enter-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>