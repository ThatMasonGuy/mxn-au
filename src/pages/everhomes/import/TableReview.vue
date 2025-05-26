<template>
    <LayoutComponent :header="true" :footer="true">
        <div class="max-w-5xl mx-auto px-6 pb-12 pt-24 space-y-12">
            <!-- Page Header -->
            <h1 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MagnifyingGlassCircleIcon class="h-7 w-7 text-teal-400" />
                <span>Review Detected Tables</span>
            </h1>

            <!-- Loop through selected sheets -->
            <div v-for="sheet in selectedSheets" :key="sheet.name"
                class="border border-gray-700 rounded-xl p-6 bg-gray-800/40">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                        <TableCellsIcon class="h-5 w-5 text-teal-300" />
                        {{ sheet.name }}
                    </h2>
                    <p class="text-xs text-gray-400">
                        {{ sheet.tables.length }} table{{ sheet.tables.length !== 1 ? 's' : '' }}
                    </p>
                </div>

                <div class="space-y-8">
                    <TablePreview v-for="(table, index) in sheet.tables" :key="index" :table="table"
                        :table-index="index" :sheet-name="sheet.name" />
                </div>
            </div>

            <!-- Continue Button -->
            <div class="flex justify-end pt-10 border-t border-gray-700">
                <button
                    class="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-2 rounded-lg text-sm transition"
                    @click="goToNextStep">
                    Continue
                </button>
            </div>
        </div>
    </LayoutComponent>
</template>

<script setup>
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'
import TablePreview from '@/pages/everhomes/import/TablePreview.vue'
import { useImportStore } from '@/composables/everhomes/useImportStore'
import { useRouter } from 'vue-router'

import {
    MagnifyingGlassCircleIcon,
    TableCellsIcon
} from '@heroicons/vue/24/solid'

const { sheets } = useImportStore()
const router = useRouter()

const selectedSheets = sheets.value.filter(s => s.selected)

function goToNextStep() {
    router.push({ name: 'DatasetSummary' })
}
</script>