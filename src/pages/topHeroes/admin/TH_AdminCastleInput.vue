<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 p-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-gray-700 text-xl font-bold mr-8">Admin Castle Input</h1>
      <div class="flex items-center space-x-2">
        <Label class="text-gray-700 w-20">Preview rarity:</Label>
        <Select v-model="previewRarity" class="w-40">
          <SelectTrigger class="w-40 bg-gray-50 shadow-inner">
            <SelectValue :placeholder="previewRarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="rarity in rarityOptions" :key="rarity.value" :value="rarity.value">
              {{ rarity.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div class="shadow-2xl rounded-lg p-6 border">
      <Accordion v-model="openItems" type="multiple" class="space-y-0">
        <AccordionItem v-for="(row, idx) in tableData" :key="row.id || idx" :value="String(row.level ?? idx)"
          class="bg-white border border-gray-200">
          <AccordionTrigger class="flex w-full items-center justify-between px-4 py-3">
            <div class="flex items-center space-x-6">
              <div class="w-16 font-semibold">Level {{ row.level || '??' }}</div>
              <div class="w-20 text-sm text-gray-600">{{ getPreviewValue(row, 'woodStone') }}k</div>
              <div class="w-16 text-sm text-gray-600">{{ getPreviewValue(row, 'rubies') }}k</div>
              <div class="w-16 text-sm text-gray-600">{{ getPreviewValue(row, 'food') }}k</div>
              <div class="w-48 text-sm text-gray-500 truncate">{{ condensedBuildings(row) }}</div>
            </div>
          </AccordionTrigger>

          <AccordionContent class="px-6 py-4 border-t border-gray-200 space-y-4">
            <div class="flex items-center space-x-2">
              <Label class="w-24">Castle Level</Label>
              <Input type="number" class="w-24" v-model="row.level" />
            </div>

            <div class="grid grid-cols-4 gap-4">
              <div v-for="rarity in ['Rare', 'Epic', 'Legendary']" :key="rarity">
                <h4 class="font-semibold mb-2">{{ rarity }}</h4>
                <div class="space-y-2">
                  <Label>Wood & Stone</Label>
                  <Input type="number" v-model="row[`woodStone${rarity}`]" class="w-full" />
                  <Label>Rubies</Label>
                  <Input type="number" v-model="row[`rubies${rarity}`]" class="w-full" />
                  <Label>Food</Label>
                  <Input type="number" v-model="row[`food${rarity}`]" class="w-full" />
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Required Buildings</h4>
                <div v-for="(building, bIdx) in row.requiredBuildings" :key="bIdx" class="flex space-x-2 items-center">
                  <Select :items="buildingOptions" v-model="row.requiredBuildings[bIdx]" class="w-full" />

                  <Popover>
                    <PopoverTrigger>
                      <Button variant="outline" size="icon">⚙️</Button>
                    </PopoverTrigger>
                    <PopoverContent class="p-4 space-y-2">
                      <h4 class="font-semibold">Upgrade Cost</h4>
                      <Label>Wood</Label>
                      <Input type="number" v-model="building.wood" class="w-full" />
                      <Label>Stone</Label>
                      <Input type="number" v-model="building.stone" class="w-full" />
                      <Label>Rubies</Label>
                      <Input type="number" v-model="building.rubies" class="w-full" />
                      <h4 class="font-semibold mt-2">Upgrade Time</h4>
                      <Label>Days</Label>
                      <Input type="number" v-model="building.days" class="w-full" />
                      <Label>Hours</Label>
                      <Input type="number" v-model="building.hours" class="w-full" />
                      <Label>Minutes</Label>
                      <Input type="number" v-model="building.minutes" class="w-full" />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button variant="outline" size="sm" class="mt-2" @click="addBuilding(row)">+ Add more</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div class="mt-6 flex items-center space-x-4">
        <Button variant="outline" class="shadow-sm" @click="addRow">Add Row</Button>
        <Button variant="default" class="shadow-sm" @click="saveData">Save Data</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Popover, PopoverTrigger, PopoverContent } from '@/components/ui'
import { firestore } from '@/firebase.js'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'

const castleCollection = collection(firestore, 'castleData')
const tableData = ref([])
const openItems = ref([])
const previewRarity = ref('Legendary')
const rarityOptions = [{ label: 'Rare', value: 'Rare' }, { label: 'Epic', value: 'Epic' }, { label: 'Legendary', value: 'Legendary' }]
const buildingOptions = [{ label: 'Research Hall', value: 'Research Hall' }, { label: 'Barracks', value: 'Barracks' }, { label: 'Workshop', value: 'Workshop' }]

onMounted(async () => await loadDataFromFirestore())

async function loadDataFromFirestore() {
  const snapshot = await getDocs(castleCollection)
  const results = snapshot.docs.map(docSnap => ({ ...docSnap.data(), id: docSnap.id }))
  tableData.value = results.length ? results : Array.from({ length: 40 }, (_, i) => ({ level: i + 1, requiredBuildings: [] }))
}

async function saveData() {
  for (const row of tableData.value) {
    if (!row.level) continue
    const docRef = doc(castleCollection, row.level.toString())
    await setDoc(docRef, row)
  }
}

function addRow() {
  tableData.value.push({ level: '', requiredBuildings: [] })
}

function addBuilding(row) {
  row.requiredBuildings.push({ name: '', wood: 0, stone: 0, rubies: 0, days: 0, hours: 0, minutes: 0 })
}

function condensedBuildings(row) {
  return row.requiredBuildings.length ? row.requiredBuildings.map(b => b.name).join(', ') : '—'
}

function getPreviewValue(row, type) {
  return ((row[`${type}${previewRarity.value}`] || 0) / 1000).toFixed(0)
}
</script>
