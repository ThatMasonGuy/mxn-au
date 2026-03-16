<template>
    <div class="relative overflow-hidden border border-zinc-700 rounded">
        <!-- Table Container with Controls -->
        <div class="relative">
            <!-- Column Add Button - Top Center -->
            <div v-if="hoveredColIndex === null" class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <button @click="addColumn(block.data.columns.length)"
                    class="bg-purple-600 hover:bg-purple-500 text-white rounded-md px-2 py-1 text-xs shadow transition-all duration-200 flex items-center gap-1">
                    <span class="font-bold">+</span> Add Column
                </button>
            </div>

            <!-- Row Add Button - Left Center -->
            <div v-if="hoveredRowIndex === null" class="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
                <button @click="addRow(block.data.rows.length)"
                    class="bg-purple-600 hover:bg-purple-500 text-white rounded-md px-2 py-1 text-xs shadow transition-all duration-200 flex items-center gap-1 rotate-90 origin-center">
                    <span class="font-bold">+</span> Add Row
                </button>
            </div>

            <!-- Table Wrapper with Scrolling -->
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm table-fixed border-collapse">
                    <thead class="bg-zinc-800/40">
                        <tr>
                            <th class="w-10 p-0"></th>
                            <th v-for="(col, c) in block.data.columns" :key="c"
                                class="border border-zinc-600 text-left relative" @mouseenter="hoveredColIndex = c"
                                @mouseleave="hoveredColIndex = null">

                                <!-- Column Header Content -->
                                <div class="px-3 py-2 flex items-center">
                                    <input v-model="block.data.columns[c]"
                                        class="bg-transparent w-full text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1"
                                        :placeholder="`Column ${c + 1}`" />

                                    <!-- Column Controls (only visible when hovering this specific column) -->
                                    <div v-if="hoveredColIndex === c" class="flex items-center ml-2 space-x-1">
                                        <button @click.stop="addColumn(c + 1)"
                                            class="bg-purple-600 hover:bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow transition-transform hover:scale-110"
                                            title="Add column">+</button>
                                        <button v-if="block.data.columns.length > 1" @click.stop="removeColumn(c)"
                                            class="bg-red-600 hover:bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow transition-transform hover:scale-110"
                                            title="Remove column">–</button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, r) in block.data.rows" :key="r" @mouseenter="hoveredRowIndex = r"
                            @mouseleave="hoveredRowIndex = null">

                            <!-- Row Controls -->
                            <td class="relative w-10 border border-zinc-600 p-0">
                                <div v-if="hoveredRowIndex === r"
                                    class="absolute inset-0 flex items-center justify-center space-x-1">
                                    <button @click.stop="addRow(r + 1)"
                                        class="bg-purple-600 hover:bg-purple-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow transition-transform hover:scale-110"
                                        title="Add row">+</button>
                                    <button v-if="block.data.rows.length > 1" @click.stop="removeRow(r)"
                                        class="bg-red-600 hover:bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow transition-transform hover:scale-110"
                                        title="Remove row">–</button>
                                </div>
                            </td>

                            <!-- Data Cells -->
                            <td v-for="(cell, c) in row" :key="c" class="px-3 py-2 border border-zinc-600">
                                <input v-model="block.data.rows[r][c]"
                                    class="w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1"
                                    :placeholder="`Row ${r + 1}, Col ${c + 1}`" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue'

export default defineComponent({
    props: {
        block: Object
    },
    setup(props) {
        const block = props.block
        const hoveredRowIndex = ref(null)
        const hoveredColIndex = ref(null)

        onMounted(() => {
            if (!block.data.columns || block.data.columns.length === 0) {
                block.data.columns = ['']
            }
            if (!block.data.rows || block.data.rows.length === 0) {
                block.data.rows = [[...block.data.columns.map(() => '')]]
            }

            ensureRowsMatchColumns()
        })

        function ensureRowsMatchColumns() {
            const columnCount = block.data.columns.length

            block.data.rows.forEach((row, index) => {
                while (row.length < columnCount) {
                    row.push('')
                }
                if (row.length > columnCount) {
                    block.data.rows[index] = row.slice(0, columnCount)
                }
            })
        }

        function addRow(index) {
            const newRow = block.data.columns.map(() => '')
            block.data.rows.splice(index, 0, newRow)

            setTimeout(() => {
                hoveredRowIndex.value = null
            }, 300)
        }

        function removeRow(index) {
            block.data.rows.splice(index, 1)
            hoveredRowIndex.value = null
        }

        function addColumn(index) {
            block.data.columns.splice(index, 0, '')
            block.data.rows.forEach(row => row.splice(index, 0, ''))

            setTimeout(() => {
                hoveredColIndex.value = null
            }, 300)
        }

        function removeColumn(index) {
            block.data.columns.splice(index, 1)
            block.data.rows.forEach(row => row.splice(index, 1))
            hoveredColIndex.value = null
        }

        return {
            hoveredRowIndex,
            hoveredColIndex,
            addRow,
            removeRow,
            addColumn,
            removeColumn
        }
    }
})

export const meta = {
    id: 'ItemTable',
    title: 'Item Table',
    icon: 'TableCellsIcon',
    description: 'Displays tabular data with headers and rows.',
    category: 'Data'
}
</script>

<style scoped>
/* Animations */
button {
    opacity: 1;
    transition: all 0.2s ease-in-out;
}

/* Ensure inputs have proper contrast */
input::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

/* Smooth transitions when hovering rows/columns */
tr,
th,
td {
    transition: background-color 0.15s ease-in-out;
}

tr:hover {
    background-color: rgba(139, 92, 246, 0.05);
}

/* Ensure the table has a min-height */
table {
    min-height: 100px;
}
</style>
