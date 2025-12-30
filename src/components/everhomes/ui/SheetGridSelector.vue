<template>
    <div class="rounded-xl border border-gray-700 bg-gray-900/50 overflow-hidden">
        <!-- Toolbar -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/50">
            <div class="flex items-center gap-3">
                <TableCellsIcon class="h-5 w-5 text-teal-400" />
                <span class="text-sm font-medium text-white">{{ sheetName }}</span>
                <span class="text-xs text-gray-500">{{ rowCount }} rows × {{ colCount }} cols</span>
            </div>
            
            <div class="flex items-center gap-4">
                <!-- Selection info -->
                <div v-if="hasSelection" class="flex items-center gap-2 text-sm">
                    <span class="text-gray-400">Selected:</span>
                    <code class="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded text-xs font-mono">
                        {{ selectionRange }}
                    </code>
                </div>
                
                <!-- Header rows selector -->
                <div v-if="hasSelection" class="flex items-center gap-2">
                    <label class="text-xs text-gray-400">Header rows:</label>
                    <select v-model="headerRowCount" 
                        class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-teal-500">
                        <option :value="1">1</option>
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="4">4</option>
                    </select>
                </div>
                
                <!-- Add table button -->
                <button v-if="hasSelection" @click="createTableFromSelection"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium rounded transition">
                    <PlusIcon class="h-4 w-4" />
                    Add Table
                </button>
                
                <!-- Clear selection -->
                <button v-if="hasSelection" @click="clearSelection"
                    class="p-1.5 text-gray-400 hover:text-red-400 transition">
                    <XMarkIcon class="h-4 w-4" />
                </button>
            </div>
        </div>
        
        <!-- Grid container -->
        <div v-if="rowCount > 0" class="overflow-auto max-h-[500px] relative" ref="gridContainer"
            @mousedown="startSelection"
            @mousemove="updateSelection"
            @mouseup="endSelection"
            @mouseleave="endSelection">
            
            <table class="border-collapse select-none" :style="{ minWidth: `${(colCount + 1) * 80}px` }">
                <!-- Column headers (A, B, C, ...) -->
                <thead class="sticky top-0 z-20">
                    <tr>
                        <!-- Corner cell -->
                        <th class="sticky left-0 z-30 w-12 h-8 bg-gray-800 border-b border-r border-gray-600"></th>
                        <!-- Column letters -->
                        <th v-for="col in colCount" :key="col"
                            class="h-8 min-w-[80px] px-2 bg-gray-800 border-b border-r border-gray-600 text-xs font-medium text-gray-400 text-center"
                            :class="{ 'bg-teal-900/50 text-teal-300': isColInSelection(col - 1) }">
                            {{ getColumnLetter(col - 1) }}
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr v-for="(row, rowIndex) in visibleData" :key="rowIndex">
                        <!-- Row number -->
                        <td class="sticky left-0 z-10 w-12 h-8 bg-gray-800 border-b border-r border-gray-600 text-xs font-medium text-gray-400 text-center"
                            :class="{ 'bg-teal-900/50 text-teal-300': isRowInSelection(rowIndex) }">
                            {{ rowIndex + 1 }}
                        </td>
                        
                        <!-- Data cells -->
                        <td v-for="(cell, colIndex) in row" :key="colIndex"
                            class="h-8 min-w-[80px] px-2 border-b border-r border-gray-700 text-xs text-gray-300 truncate max-w-[200px] transition-colors"
                            :class="getCellClass(rowIndex, colIndex)"
                            :data-row="rowIndex"
                            :data-col="colIndex">
                            {{ formatCell(cell) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-16 text-gray-500">
            <TableCellsIcon class="h-12 w-12 mb-3 opacity-50" />
            <p class="text-sm">This sheet appears to be empty</p>
        </div>
        
        <!-- Defined tables list -->
        <div v-if="definedTables.length > 0" class="border-t border-gray-700 p-4 space-y-3">
            <h4 class="text-xs font-medium text-gray-400 uppercase tracking-wide">Defined Tables</h4>
            <div v-for="(table, index) in definedTables" :key="table.tableId"
                class="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div class="flex items-center gap-3">
                    <RectangleGroupIcon class="h-4 w-4 text-teal-400" />
                    <div>
                        <input v-model="table.tableName" 
                            class="bg-transparent text-sm font-medium text-white border-b border-transparent hover:border-gray-600 focus:border-teal-500 focus:outline-none px-1 -mx-1"
                            placeholder="Table name" />
                        <p class="text-xs text-gray-500 mt-0.5">
                            {{ table.cellReference }} · {{ table.headerRowCount }} header row{{ table.headerRowCount > 1 ? 's' : '' }} · {{ table.rowCount }} data rows
                        </p>
                    </div>
                </div>
                <button @click="removeTable(index)" class="p-1.5 text-gray-400 hover:text-red-400 transition">
                    <TrashIcon class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
    TableCellsIcon, 
    PlusIcon, 
    XMarkIcon, 
    TrashIcon,
    RectangleGroupIcon 
} from '@heroicons/vue/24/solid'
import { simpleHash } from '@/utils/hash'
import { slugify } from '@/utils/slugify'

const props = defineProps({
    sheetName: { type: String, required: true },
    rawData: { type: Array, required: true }, // 2D array of cell values
    existingTables: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:tables'])

// Grid dimensions
const rowCount = computed(() => props.rawData.length)
const colCount = computed(() => Math.max(...props.rawData.map(r => r?.length || 0), 0))

// Limit visible rows for performance (can add virtualization later)
const MAX_VISIBLE_ROWS = 200
const visibleData = computed(() => {
    return props.rawData.slice(0, MAX_VISIBLE_ROWS).map(row => {
        // Ensure each row has the right number of columns
        const paddedRow = [...(row || [])]
        while (paddedRow.length < colCount.value) {
            paddedRow.push(null)
        }
        return paddedRow
    })
})

// Selection state
const isSelecting = ref(false)
const selectionStart = ref(null) // { row, col }
const selectionEnd = ref(null)   // { row, col }
const headerRowCount = ref(1)

// Defined tables for this sheet
const definedTables = ref([...props.existingTables])

// Selection helpers
const hasSelection = computed(() => selectionStart.value && selectionEnd.value)

const normalizedSelection = computed(() => {
    if (!hasSelection.value) return null
    
    const startRow = Math.min(selectionStart.value.row, selectionEnd.value.row)
    const endRow = Math.max(selectionStart.value.row, selectionEnd.value.row)
    const startCol = Math.min(selectionStart.value.col, selectionEnd.value.col)
    const endCol = Math.max(selectionStart.value.col, selectionEnd.value.col)
    
    return { startRow, endRow, startCol, endCol }
})

const selectionRange = computed(() => {
    if (!normalizedSelection.value) return ''
    const { startRow, endRow, startCol, endCol } = normalizedSelection.value
    const startCell = `${getColumnLetter(startCol)}${startRow + 1}`
    const endCell = `${getColumnLetter(endCol)}${endRow + 1}`
    return `${startCell}:${endCell}`
})

// Column letter helper (0 -> A, 1 -> B, 26 -> AA, etc.)
function getColumnLetter(index) {
    let letter = ''
    let temp = index
    while (temp >= 0) {
        letter = String.fromCharCode((temp % 26) + 65) + letter
        temp = Math.floor(temp / 26) - 1
    }
    return letter
}

// Cell formatting
function formatCell(value) {
    if (value === null || value === undefined) return ''
    if (typeof value === 'number') {
        // Format numbers nicely
        if (Number.isInteger(value)) return value.toString()
        return value.toFixed(2)
    }
    return String(value)
}

// Selection detection
function isRowInSelection(rowIndex) {
    if (!normalizedSelection.value) return false
    const { startRow, endRow } = normalizedSelection.value
    return rowIndex >= startRow && rowIndex <= endRow
}

function isColInSelection(colIndex) {
    if (!normalizedSelection.value) return false
    const { startCol, endCol } = normalizedSelection.value
    return colIndex >= startCol && colIndex <= endCol
}

function isCellInSelection(rowIndex, colIndex) {
    return isRowInSelection(rowIndex) && isColInSelection(colIndex)
}

function isCellInHeaderRows(rowIndex) {
    if (!normalizedSelection.value) return false
    const { startRow } = normalizedSelection.value
    return rowIndex >= startRow && rowIndex < startRow + headerRowCount.value
}

function getCellClass(rowIndex, colIndex) {
    const inSelection = isCellInSelection(rowIndex, colIndex)
    const inHeader = inSelection && isCellInHeaderRows(rowIndex)
    
    if (inHeader) {
        return 'bg-amber-500/30 text-amber-200'
    }
    if (inSelection) {
        return 'bg-teal-500/20 text-teal-200'
    }
    return 'hover:bg-gray-800/50'
}

// Mouse selection handlers
function startSelection(event) {
    const cell = event.target.closest('td[data-row]')
    if (!cell) return
    
    const row = parseInt(cell.dataset.row)
    const col = parseInt(cell.dataset.col)
    
    isSelecting.value = true
    selectionStart.value = { row, col }
    selectionEnd.value = { row, col }
}

function updateSelection(event) {
    if (!isSelecting.value) return
    
    const cell = event.target.closest('td[data-row]')
    if (!cell) return
    
    const row = parseInt(cell.dataset.row)
    const col = parseInt(cell.dataset.col)
    
    selectionEnd.value = { row, col }
}

function endSelection() {
    isSelecting.value = false
}

function clearSelection() {
    selectionStart.value = null
    selectionEnd.value = null
    headerRowCount.value = 1
}

// Table creation
function createTableFromSelection() {
    if (!normalizedSelection.value) return
    
    const { startRow, endRow, startCol, endCol } = normalizedSelection.value
    
    // Extract header rows
    const headerRows = []
    for (let r = startRow; r < startRow + headerRowCount.value && r <= endRow; r++) {
        const headerRow = []
        for (let c = startCol; c <= endCol; c++) {
            headerRow.push(props.rawData[r]?.[c] ?? null)
        }
        headerRows.push(headerRow)
    }
    
    // Flatten multi-row headers into single header array
    const colCountInSelection = endCol - startCol + 1
    const flatHeaders = []
    for (let c = 0; c < colCountInSelection; c++) {
        const parts = headerRows
            .map(row => row[c])
            .filter(v => v !== null && v !== undefined && String(v).trim() !== '')
            .map(v => String(v).trim())
        flatHeaders.push(parts.join(' - ') || `Column ${getColumnLetter(startCol + c)}`)
    }
    
    // Extract data rows (after headers)
    const dataStartRow = startRow + headerRowCount.value
    const dataRows = []
    for (let r = dataStartRow; r <= endRow; r++) {
        const dataRow = []
        for (let c = startCol; c <= endCol; c++) {
            dataRow.push(props.rawData[r]?.[c] ?? null)
        }
        dataRows.push(dataRow)
    }
    
    // Guess column types from data
    const columnTypes = guessColumnTypes(dataRows)
    
    // Create table object
    const tableId = `${slugify(props.sheetName)}-${slugify(flatHeaders[0] || 'table')}-${simpleHash(selectionRange.value).slice(0, 5)}`
    
    const newTable = {
        sourceSheet: props.sheetName,
        tableName: flatHeaders[0] || `Table ${definedTables.value.length + 1}`,
        tableId,
        createdAt: new Date().toISOString(),
        cellReference: selectionRange.value,
        headerRowCount: headerRowCount.value,
        detectedHeaders: [...flatHeaders],
        headers: [...flatHeaders],
        detectedTypes: [...columnTypes],
        columnTypes: [...columnTypes],
        preview: dataRows.slice(0, 5),
        allData: dataRows,
        rowCount: dataRows.length,
        columnCount: colCountInSelection,
        hash: simpleHash({ headers: flatHeaders, preview: dataRows.slice(0, 5) }),
        excluded: false,
        detected: false, // manually defined
        updated: false,
        schemaVersion: '1.0'
    }
    
    definedTables.value.push(newTable)
    emit('update:tables', definedTables.value)
    
    clearSelection()
}

function guessColumnTypes(dataRows) {
    if (dataRows.length === 0) return []
    
    const colCount = dataRows[0]?.length || 0
    const types = []
    
    for (let c = 0; c < colCount; c++) {
        const values = dataRows.map(row => row[c]).filter(v => v !== null && v !== undefined && v !== '')
        
        if (values.length === 0) {
            types.push('string')
            continue
        }
        
        // Check if all numbers
        const allNumbers = values.every(v => typeof v === 'number' || !isNaN(parseFloat(v)))
        if (allNumbers) {
            // Check if currency (has $ or formatted like currency)
            const hasCurrency = values.some(v => String(v).includes('$'))
            types.push(hasCurrency ? 'currency' : 'number')
            continue
        }
        
        // Check if dates
        const datePatterns = [/^\d{1,2}\/\d{1,2}\/\d{2,4}$/, /^\d{4}-\d{2}-\d{2}$/]
        const allDates = values.every(v => datePatterns.some(p => p.test(String(v))))
        if (allDates) {
            types.push('date')
            continue
        }
        
        types.push('string')
    }
    
    return types
}

function removeTable(index) {
    definedTables.value.splice(index, 1)
    emit('update:tables', definedTables.value)
}

// Watch for external table updates
onMounted(() => {
    if (props.existingTables.length > 0) {
        definedTables.value = [...props.existingTables]
    }
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-auto::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.5);
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.8);
    border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.8);
}

/* Prevent text selection during drag */
table {
    user-select: none;
    -webkit-user-select: none;
}
</style>
