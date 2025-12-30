<template>
    <div class="max-w-6xl mx-auto px-6 pb-12 pt-24 space-y-8">
        <!-- Page Header -->
        <div>
            <h1 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <TableCellsIcon class="h-7 w-7 text-teal-400" />
                <span>Define Table Regions</span>
            </h1>
            <p class="text-sm text-gray-400">
                Click and drag on each sheet to select the data regions you want to import. 
                For multi-row headers (like NDIS files), increase the header row count before adding.
            </p>
        </div>

        <!-- Sheet selector tabs -->
        <div class="flex gap-2 border-b border-gray-700">
            <button v-for="(sheet, index) in selectedSheets" :key="sheet.name"
                @click="activeSheetIndex = index"
                class="px-4 py-2 text-sm font-medium transition border-b-2 -mb-px"
                :class="activeSheetIndex === index 
                    ? 'text-teal-400 border-teal-400' 
                    : 'text-gray-400 border-transparent hover:text-gray-300'">
                {{ sheet.name }}
                <span v-if="getTableCount(sheet) > 0" 
                    class="ml-2 px-1.5 py-0.5 bg-teal-500/20 text-teal-300 text-xs rounded">
                    {{ getTableCount(sheet) }}
                </span>
            </button>
        </div>

        <!-- Active sheet grid -->
        <SheetGridSelector 
            v-if="activeSheet"
            :key="activeSheet.name"
            :sheet-name="activeSheet.name"
            :raw-data="activeSheet.rawData"
            :existing-tables="activeSheet.tables || []"
            @update:tables="tables => updateSheetTables(activeSheetIndex, tables)"
        />

        <!-- Summary -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-700">
            <div class="text-sm text-gray-400">
                <span class="text-white font-medium">{{ totalTableCount }}</span> 
                table{{ totalTableCount !== 1 ? 's' : '' }} defined across 
                <span class="text-white font-medium">{{ selectedSheets.length }}</span> 
                sheet{{ selectedSheets.length !== 1 ? 's' : '' }}
            </div>
            
            <div class="flex gap-3">
                <button @click="emit('prev')"
                    class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition">
                    Back
                </button>
                <button @click="handleContinue"
                    :disabled="totalTableCount === 0"
                    class="px-6 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition">
                    Continue
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { TableCellsIcon } from '@heroicons/vue/24/solid'
import { useImportWizardStore } from '@/stores/useImportWizardStore'
import SheetGridSelector from '../ui/SheetGridSelector.vue'

const store = useImportWizardStore()
const emit = defineEmits(['next', 'prev'])

const activeSheetIndex = ref(0)

const selectedSheets = computed(() => store.parsedSheets.filter(s => s.selected))
const activeSheet = computed(() => selectedSheets.value[activeSheetIndex.value])

const totalTableCount = computed(() => {
    return selectedSheets.value.reduce((sum, sheet) => sum + (sheet.tables?.length || 0), 0)
})

function getTableCount(sheet) {
    return sheet.tables?.length || 0
}

function updateSheetTables(sheetIndex, tables) {
    const sheet = selectedSheets.value[sheetIndex]
    if (sheet) {
        sheet.tables = tables
        sheet.hasTables = tables.length > 0
    }
}

function handleContinue() {
    if (totalTableCount.value > 0) {
        emit('next')
    }
}
</script>