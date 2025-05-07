<template>
    <div class="min-h-screen bg-zinc-900 text-white p-6 flex flex-col gap-6">
        <header class="flex justify-between items-center">
            <h1 class="text-4xl font-bold flex items-center gap-2">
                <span>🍽️ Eat, you Goblin</span>
            </h1>
            <div class="text-xl font-semibold">
                {{ currentTimeDisplay }}
            </div>
        </header>

        <div class="flex gap-4 flex-wrap">
            <button @click="logAction('breakfast')"
                class="px-4 py-2 bg-amber-600 rounded hover:bg-amber-700 flex items-center gap-2">
                <SunIcon class="h-5 w-5" />
                Breakfast
            </button>
            <button @click="logAction('lunch')"
                class="px-4 py-2 bg-green-600 rounded hover:bg-green-700 flex items-center gap-2">
                <CakeIcon class="h-5 w-5" />
                Lunch
            </button>
            <button @click="logAction('dinner')"
                class="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 flex items-center gap-2">
                <MoonIcon class="h-5 w-5" />
                Dinner
            </button>
            <button @click="logAction('water')"
                class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 flex items-center gap-2">
                <BeakerIcon class="h-5 w-5" />
                Water
            </button>
            <button @click="logAction('coffee')"
                class="px-4 py-2 bg-amber-800 rounded hover:bg-amber-900 flex items-center gap-2">
                <FireIcon class="h-5 w-5" />
                Dare
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Today's Status -->
            <div class="bg-zinc-800 p-4 rounded-lg">
                <h2 class="text-2xl font-bold mb-4">Today's Status</h2>

                <div :class="['p-3 rounded-md mb-3', needsBreakfast ? 'bg-red-700' : 'bg-zinc-700']">
                    <div class="flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <SunIcon class="h-5 w-5" />
                            Breakfast
                        </span>
                        <span>{{ lastBreakfastToday ? timeAgo(lastBreakfastToday) : 'Not yet' }}</span>
                    </div>
                </div>

                <div :class="['p-3 rounded-md mb-3', needsLunch ? 'bg-red-700' : 'bg-zinc-700']">
                    <div class="flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <CakeIcon class="h-5 w-5" />
                            Lunch
                        </span>
                        <span>{{ lastLunchToday ? timeAgo(lastLunchToday) : 'Not yet' }}</span>
                    </div>
                </div>

                <div :class="['p-3 rounded-md mb-3', needsDinner ? 'bg-red-700' : 'bg-zinc-700']">
                    <div class="flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <MoonIcon class="h-5 w-5" />
                            Dinner
                        </span>
                        <span>{{ lastDinnerToday ? timeAgo(lastDinnerToday) : 'Not yet' }}</span>
                    </div>
                </div>

                <div :class="['p-3 rounded-md', needsWater ? 'bg-red-700' : 'bg-zinc-700']">
                    <div class="flex justify-between items-center">
                        <span class="flex items-center gap-2">
                            <BeakerIcon class="h-5 w-5" />
                            Water
                        </span>
                        <span>{{ lastWaterToday ? timeAgo(lastWaterToday) : 'Not yet' }}</span>
                    </div>
                </div>
            </div>

            <!-- Last Actions -->
            <div class="bg-zinc-800 p-4 rounded-lg">
                <h2 class="text-2xl font-bold mb-4">Recent Activity</h2>

                <div class="space-y-3">
                    <div class="p-3 bg-zinc-700 rounded-md">
                        <p class="text-lg flex items-center gap-2">
                            <BeakerIcon class="h-5 w-5 text-blue-400" />
                            Water: {{ timeAgo(lastWater) }}
                        </p>
                    </div>

                    <div class="p-3 bg-zinc-700 rounded-md">
                        <p class="text-lg flex items-center gap-2">
                            <SunIcon class="h-5 w-5 text-amber-400" />
                            Breakfast: {{ timeAgo(lastBreakfast) }}
                        </p>
                    </div>

                    <div class="p-3 bg-zinc-700 rounded-md">
                        <p class="text-lg flex items-center gap-2">
                            <CakeIcon class="h-5 w-5 text-green-400" />
                            Lunch: {{ timeAgo(lastLunch) }}
                        </p>
                    </div>

                    <div class="p-3 bg-zinc-700 rounded-md">
                        <p class="text-lg flex items-center gap-2">
                            <MoonIcon class="h-5 w-5 text-indigo-400" />
                            Dinner: {{ timeAgo(lastDinner) }}
                        </p>
                    </div>

                    <div class="p-3 bg-zinc-700 rounded-md" v-if="lastCoffee">
                        <p class="text-lg flex items-center gap-2">
                            <FireIcon class="h-5 w-5 text-amber-500" />
                            Dare Coffee: {{ timeAgo(lastCoffee) }}
                        </p>
                        <p class="text-sm italic text-red-300">Shame.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Weekly Overview -->
        <div class="bg-zinc-800 p-4 rounded-lg mt-4">
            <h2 class="text-2xl font-bold mb-4">Weekly Overview</h2>

            <div class="grid grid-cols-7 gap-2">
                <div v-for="(day, index) in weekDays" :key="index" class="p-3 bg-zinc-700 rounded-md">
                    <h3 class="text-lg font-semibold mb-2">{{ day.name }}</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="flex items-center gap-1">
                                <SunIcon class="h-4 w-4" />
                            </span>
                            <span :class="day.breakfast ? 'text-green-400' : 'text-red-400'">
                                {{ day.breakfast ? '✓' : '✗' }}
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="flex items-center gap-1">
                                <CakeIcon class="h-4 w-4" />
                            </span>
                            <span :class="day.lunch ? 'text-green-400' : 'text-red-400'">
                                {{ day.lunch ? '✓' : '✗' }}
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="flex items-center gap-1">
                                <MoonIcon class="h-4 w-4" />
                            </span>
                            <span :class="day.dinner ? 'text-green-400' : 'text-red-400'">
                                {{ day.dinner ? '✓' : '✗' }}
                            </span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="flex items-center gap-1">
                                <BeakerIcon class="h-4 w-4" />
                            </span>
                            <span>{{ day.waterCount }}/8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { firestore } from '@/firebase'
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, where, Timestamp } from 'firebase/firestore'
import {
    BeakerIcon,
    SunIcon,
    MoonIcon,
    CakeIcon,
    FireIcon
} from '@heroicons/vue/24/solid'

// Current time tracking
const currentTime = ref(new Date())
const currentTimeDisplay = computed(() => {
    const options = {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }
    return currentTime.value.toLocaleString('en-US', options)
})

// Time state
const lastWater = ref(null)
const lastBreakfast = ref(null)
const lastLunch = ref(null)
const lastDinner = ref(null)
const lastCoffee = ref(null)

// Today's specific actions
const lastWaterToday = ref(null)
const lastBreakfastToday = ref(null)
const lastLunchToday = ref(null)
const lastDinnerToday = ref(null)

// Weekly data
const weekDays = ref([
    { name: 'Mon', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Tue', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Wed', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Thu', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Fri', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Sat', breakfast: false, lunch: false, dinner: false, waterCount: 0 },
    { name: 'Sun', breakfast: false, lunch: false, dinner: false, waterCount: 0 }
])

// Check if meal is needed based on time of day
const needsBreakfast = computed(() => {
    const hour = currentTime.value.getHours()
    return hour >= 7 && hour < 10 && !lastBreakfastToday.value
})

const needsLunch = computed(() => {
    const hour = currentTime.value.getHours()
    return hour >= 11 && hour < 14 && !lastLunchToday.value
})

const needsDinner = computed(() => {
    const hour = currentTime.value.getHours()
    return hour >= 17 && hour < 21 && !lastDinnerToday.value
})

const needsWater = computed(() => {
    if (!lastWaterToday.value) return true

    const hoursSinceLastWater = (currentTime.value - lastWaterToday.value) / (1000 * 60 * 60)
    const currentHour = currentTime.value.getHours()

    // Need water if it's between 7am-10pm and 2+ hours since last water
    return currentHour >= 7 && currentHour <= 22 && hoursSinceLastWater >= 2
})

async function logAction(type) {
    await addDoc(collection(firestore, 'goblinTracker'), {
        type,
        timestamp: serverTimestamp(),
        source: 'manual',
    })

    // Update the UI immediately with a local timestamp before Firestore returns
    const localNow = new Date()

    if (type === 'water') {
        lastWater.value = localNow
        lastWaterToday.value = localNow

        // Update weekly count
        const dayIndex = (currentTime.value.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
        if (weekDays.value[dayIndex].waterCount < 8) {
            weekDays.value[dayIndex].waterCount++
        }
    }
    else if (type === 'breakfast') {
        lastBreakfast.value = localNow
        lastBreakfastToday.value = localNow

        // Update weekly data
        const dayIndex = (currentTime.value.getDay() + 6) % 7
        weekDays.value[dayIndex].breakfast = true
    }
    else if (type === 'lunch') {
        lastLunch.value = localNow
        lastLunchToday.value = localNow

        // Update weekly data
        const dayIndex = (currentTime.value.getDay() + 6) % 7
        weekDays.value[dayIndex].lunch = true
    }
    else if (type === 'dinner') {
        lastDinner.value = localNow
        lastDinnerToday.value = localNow

        // Update weekly data
        const dayIndex = (currentTime.value.getDay() + 6) % 7
        weekDays.value[dayIndex].dinner = true
    }
    else if (type === 'coffee') {
        lastCoffee.value = localNow
    }

    // Fetch data from Firestore for consistency
    await fetchAllData()
}

function timeAgo(date) {
    if (!date) return 'Never? 😬'

    const diff = Math.floor((currentTime.value - date) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
    return `${Math.floor(diff / 86400)} days ago`
}

async function fetchAllData() {
    const col = collection(firestore, 'goblinTracker')

    // Fetch the last entry of each type
    const [waterSnap, breakfastSnap, lunchSnap, dinnerSnap, coffeeSnap] = await Promise.all([
        getDocs(query(col, where("type", "==", "water"), orderBy("timestamp", "desc"), limit(1))),
        getDocs(query(col, where("type", "==", "breakfast"), orderBy("timestamp", "desc"), limit(1))),
        getDocs(query(col, where("type", "==", "lunch"), orderBy("timestamp", "desc"), limit(1))),
        getDocs(query(col, where("type", "==", "dinner"), orderBy("timestamp", "desc"), limit(1))),
        getDocs(query(col, where("type", "==", "coffee"), orderBy("timestamp", "desc"), limit(1))),
    ])

    // Update last activity timestamps
    lastWater.value = waterSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastBreakfast.value = breakfastSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastLunch.value = lunchSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastDinner.value = dinnerSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastCoffee.value = coffeeSnap.docs[0]?.data()?.timestamp?.toDate() || null

    // Fetch today's data
    const startOfDay = new Date(currentTime.value)
    startOfDay.setHours(0, 0, 0, 0)
    const startOfDayTimestamp = Timestamp.fromDate(startOfDay)

    const [todayWaterSnap, todayBreakfastSnap, todayLunchSnap, todayDinnerSnap] = await Promise.all([
        getDocs(query(
            col,
            where("type", "==", "water"),
            where("timestamp", ">=", startOfDayTimestamp),
            orderBy("timestamp", "desc"),
            limit(1)
        )),
        getDocs(query(
            col,
            where("type", "==", "breakfast"),
            where("timestamp", ">=", startOfDayTimestamp),
            orderBy("timestamp", "desc"),
            limit(1)
        )),
        getDocs(query(
            col,
            where("type", "==", "lunch"),
            where("timestamp", ">=", startOfDayTimestamp),
            orderBy("timestamp", "desc"),
            limit(1)
        )),
        getDocs(query(
            col,
            where("type", "==", "dinner"),
            where("timestamp", ">=", startOfDayTimestamp),
            orderBy("timestamp", "desc"),
            limit(1)
        )),
    ])

    // Update today's data
    lastWaterToday.value = todayWaterSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastBreakfastToday.value = todayBreakfastSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastLunchToday.value = todayLunchSnap.docs[0]?.data()?.timestamp?.toDate() || null
    lastDinnerToday.value = todayDinnerSnap.docs[0]?.data()?.timestamp?.toDate() || null

    // Fetch weekly data
    await fetchWeeklyData()
}

async function fetchWeeklyData() {
    const col = collection(firestore, 'goblinTracker')

    // Calculate start of the week (Monday)
    const now = new Date(currentTime.value)
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7)) // Adjust to previous Monday
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfWeekTimestamp = Timestamp.fromDate(startOfWeek)

    // Get all entries for the week
    const weeklySnap = await getDocs(query(
        col,
        where("timestamp", ">=", startOfWeekTimestamp),
        orderBy("timestamp", "asc")
    ))

    // Reset weekly data
    weekDays.value = weekDays.value.map(day => ({
        ...day,
        breakfast: false,
        lunch: false,
        dinner: false,
        waterCount: 0
    }))

    // Process entries
    weeklySnap.docs.forEach(doc => {
        const data = doc.data()
        if (!data.timestamp) return

        const date = data.timestamp.toDate()
        const dayIndex = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

        if (dayIndex >= 0 && dayIndex < 7) {
            switch (data.type) {
                case 'breakfast':
                    weekDays.value[dayIndex].breakfast = true
                    break
                case 'lunch':
                    weekDays.value[dayIndex].lunch = true
                    break
                case 'dinner':
                    weekDays.value[dayIndex].dinner = true
                    break
                case 'water':
                    if (weekDays.value[dayIndex].waterCount < 8) {
                        weekDays.value[dayIndex].waterCount++
                    }
                    break
            }
        }
    })
}

// Time polling functions
let timeInterval = null

function updateTime() {
    currentTime.value = new Date()
}

onMounted(() => {
    fetchAllData()

    // Update time every 5 seconds
    timeInterval = setInterval(() => {
        updateTime()
    }, 5000)
})

onBeforeUnmount(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})
</script>