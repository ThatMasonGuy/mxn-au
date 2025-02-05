<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="p-6 space-y-8">
          <!-- Header -->
          <header class="text-center">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-800">
              Resource Calculator
            </h1>
          </header>
  
          <!-- Castle Level Selector -->
          <section class="mb-6">
            <label class="block text-base font-semibold text-gray-700 mb-2">
              Castle Level
            </label>
            <Select :model-value="castleLevel.toString()"
              @update:model-value="(value) => castleLevel = parseInt(value)" class="w-full">
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
  
          <!-- Resource Cards -->
          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card v-for="(crates, resourceType) in resources" :key="resourceType"
              class="p-4 rounded-lg shadow-inner bg-gray-50">
              <CardHeader>
                <CardTitle class="capitalize text-lg font-semibold flex items-center gap-2">
                  <img :src="resourceIcons[resourceType]" alt="icon" class="w-6 h-6" />
                  {{ resourceType }}
                </CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div v-for="(count, rarity) in crates" :key="rarity" class="flex items-center gap-4">
                  <label class="w-24 capitalize text-sm text-gray-700">
                    {{ rarity }}:
                  </label>
                  <Input type="number" min="0" :model-value="count"
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
  
          <!-- Grand Totals -->
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
  import { ref, computed } from 'vue'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Input } from '@/components/ui/input'
  
  // Icon URLs for each resource
  const rubyIcon = ref('https://img.icons8.com/ios/50/crystal.png')
  const woodIcon = ref('https://img.icons8.com/external-outline-design-circle/66/external-Timber-carpenter-outline-design-circle.png')
  const stoneIcon = ref('https://img.icons8.com/external-vitaliy-gorbachev-lineal-vitaly-gorbachev/60/external-stone-nature-resource-vitaliy-gorbachev-lineal-vitaly-gorbachev.png')
  const foodIcon = ref('https://img.icons8.com/external-dreamstale-lineal-dreamstale/32/external-ham-food-drinks-dreamstale-lineal-dreamstale.png')
  
  // Map resource types to their icons
  const resourceIcons = {
    wood: woodIcon.value,
    stone: stoneIcon.value,
    rubies: rubyIcon.value,
    food: foodIcon.value
  }
  
  const RESOURCE_MULTIPLIERS = {
    wood: { rare: 11200, epic: 250, legendary: 500 },
    stone: { rare: 80, epic: 200, legendary: 400 },
    rubies: { rare: 20, epic: 50, legendary: 100 },
    food: { rare: 150, epic: 300, legendary: 600 }
  }

  // Base growth rate and level 1 value
  const BASE_GROWTH_RATE = 1.0334638803715663 // ~3.35% increase
  const BASE_LEVEL_VALUE = 11200
  
  const getCastleLevelMultiplier = (level) => {
    // Calculate the multiplier based on exponential growth and rounding to nearest 100
    return Math.round(BASE_LEVEL_VALUE * (BASE_GROWTH_RATE ** (level - 1)) / 100) * 100 / BASE_LEVEL_VALUE
  }
  
  const castleLevel = ref(1)
  const resources = ref({
    wood: { rare: 0, epic: 0, legendary: 0 },
    stone: { rare: 0, epic: 0, legendary: 0 },
    rubies: { rare: 0, epic: 0, legendary: 0 },
    food: { rare: 0, epic: 0, legendary: 0 }
  })
  
  // Calculate totals for each resource type
  const totals = computed(() => {
    const levelMultiplier = getCastleLevelMultiplier(castleLevel.value)
    
    return Object.entries(resources.value).reduce((acc, [resourceType, crates]) => {
      const resourceTotal = Object.entries(crates).reduce((sum, [rarity, count]) => {
        return sum + (count * RESOURCE_MULTIPLIERS[resourceType][rarity] * levelMultiplier)
      }, 0)
      
      return { ...acc, [resourceType]: Math.floor(resourceTotal) }
    }, {})
  })
  
  const handleCrateChange = (resourceType, rarity, value) => {
    const numValue = parseInt(value) || 0
    resources.value[resourceType][rarity] = numValue
  }
  
  const castleLevels = Array.from({ length: 40 }, (_, i) => i + 1)
  </script>
