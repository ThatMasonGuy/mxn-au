<!-- @/pages/topHeroes/TH_ResourceCalculator.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6 space-y-8">
        <header class="text-center">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-800">
            Resource Calculator
          </h1>
        </header>

        <section class="mb-6">
          <label class="block text-base font-semibold text-gray-700 mb-2">
            Castle Level
          </label>
          <Select :model-value="castleLevel.toString()" @update:model-value="(value) => castleLevel = parseInt(value)"
            class="w-full">
            <SelectTrigger class="w-full mx-auto bg-gray-50 shadow-inner">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="level in castleLevels" :key="level" :value="level.toString()">
                Level {{ level }}
              </SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card v-for="(crateCounts, resourceType) in resources" :key="resourceType"
            class="p-4 rounded-lg shadow-inner bg-gray-50">
            <CardHeader>
              <CardTitle class="capitalize text-lg font-semibold flex items-center gap-2">
                <img :src="resourceIcons[resourceType]" alt="icon" class="w-6 h-6" />
                {{ resourceType }}
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">

              <div class="flex items-center gap-4">
                <label class="w-24 capitalize text-sm text-gray-700">
                  Storage:
                </label>
                <Input type="number" min="0" :model-value="crateCounts.storage"
                  @update:model-value="(value) => handleCrateChange(resourceType, 'storage', value)"
                  class="w-full ml-6 border rounded-md p-1 bg-white shadow-sm" />
              </div>

              <div v-for="rarity in rarities" :key="rarity" class="flex items-center gap-4">
                <label class="w-24 capitalize text-sm text-gray-700">
                  {{ rarity }}:
                </label>
                <Input type="number" min="0" :model-value="crateCounts[rarity]"
                  @update:model-value="(value) => handleCrateChange(resourceType, rarity, value)"
                  class="w-full ml-6 border rounded-md p-1 bg-white shadow-sm" />
              </div>

              <div class="mt-4 pt-4 border-t">
                <p class="font-semibold text-md text-gray-800">
                  Total: {{ totals[resourceType].toLocaleString() }}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section class="mt-8 p-4 bg-gray-100 rounded-lg shadow-inner">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">
            Grand Totals
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(total, resourceType) in totals" :key="resourceType" class="text-center">
              <img :src="resourceIcons[resourceType]" alt="icon" class="w-6 h-6 mx-auto mb-1" />
              <p class="capitalize font-medium text-sm text-gray-700">
                {{ resourceType }}
              </p>
              <p class="text-lg font-bold text-gray-900">
                {{ total.toLocaleString() }}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase.js'

const rubyIcon = ref('https://img.icons8.com/ios/50/crystal.png')
const woodIcon = ref('https://img.icons8.com/external-outline-design-circle/66/external-Timber-carpenter-outline-design-circle.png')
const stoneIcon = ref('https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/external-stone-nature-resource-vitaliy-gorbachev-lineal-vitaly-gorbachev.png')
const foodIcon = ref('https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/external-ham-food-drinks-dreamstale-lineal-dreamstale.png')

const resourceIcons = {
  wood: woodIcon.value,
  stone: stoneIcon.value,
  rubies: rubyIcon.value,
  food: foodIcon.value
}

const rarities = ['rare', 'epic', 'legendary']

const resources = ref({
  wood: { rare: 0, epic: 0, legendary: 0, storage: 0 },
  stone: { rare: 0, epic: 0, legendary: 0, storage: 0 },
  rubies: { rare: 0, epic: 0, legendary: 0, storage: 0 },
  food: { rare: 0, epic: 0, legendary: 0, storage: 0 }
})

const castleDataArray = ref([])

const castleLevel = ref(1)
const castleLevels = Array.from({ length: 40 }, (_, i) => i + 1)

onMounted(async () => {
  try {
    const castleCollectionRef = collection(firestore, 'castleData')
    const snapshot = await getDocs(castleCollectionRef)
    castleDataArray.value = snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error loading castle data:', error)
  }
})

const selectedCastleData = computed(() => {
  return castleDataArray.value.find(data => data.level === castleLevel.value)
})

const totals = computed(() => {
  if (!selectedCastleData.value) {
    return { wood: 0, stone: 0, rubies: 0, food: 0 }
  }

  const result = {}
  for (const resourceType in resources.value) {
    let sum = 0
    for (const rarity of ['rare', 'epic', 'legendary']) {
      const count = resources.value[resourceType][rarity] || 0
      let fieldName = ""
      if (resourceType === 'wood' || resourceType === 'stone') {
        fieldName = 'woodStone' + rarity.charAt(0).toUpperCase() + rarity.slice(1)
      } else {
        fieldName = resourceType + rarity.charAt(0).toUpperCase() + rarity.slice(1)
      }
      const crateValue = selectedCastleData.value[fieldName] || 0
      sum += count * crateValue
    }
    sum += resources.value[resourceType].storage || 0
    result[resourceType] = sum
  }
  return result
})

const handleCrateChange = (resourceType, key, value) => {
  const numValue = parseInt(value) || 0
  resources.value[resourceType][key] = numValue
}
</script>
