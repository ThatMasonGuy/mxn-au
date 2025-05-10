<template>
    <div
        class="min-h-screen bg-gradient-to-b from-black via-rose-950/30 to-black text-white p-10 flex flex-col items-center justify-center overflow-hidden">
        <!-- Pulsing background glow -->
        <div class="absolute inset-0 bg-rose-700/5 animate-pulse"></div>
        
        <div class="text-center mb-12 relative">
            <h1 class="text-6xl md:text-7xl font-black text-rose-500 drop-shadow-xl tracking-tight mb-4 animate-pulse">
                Dare Damage
            </h1>
            <p class="text-lg text-slate-300 italic font-light animate-fade-in">
                You could've had a house deposit. Instead, you have <span class="text-rose-400 font-medium">diabetes and debt</span>.
            </p>
        </div>

        <div
            class="bg-zinc-900/90 border border-zinc-700/60 shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl w-full space-y-10 backdrop-blur-sm relative animate-fade-in">
            
            <!-- Subtle corner glows -->
            <div class="absolute -top-2 -left-2 w-4 h-4 bg-rose-500/20 rounded-full blur-md animate-pulse"></div>
            <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-rose-500/20 rounded-full blur-md animate-pulse"></div>
            
            <!-- Big Dares -->
            <div class="text-center">
                <p class="text-xl text-yellow-200 tracking-widest uppercase mb-2 animate-shimmer">Big Dares</p>
                <p class="text-5xl font-extrabold text-yellow-400 animate-glow">{{ dareCountBig }} <span class="text-xl font-light">×
                        ${{ dareCostBig.toFixed(2) }}</span></p>
                <p class="text-lg text-yellow-200 mt-2">= <span class="text-3xl text-yellow-300 font-semibold animate-pulse">${{
                        totalBig.toFixed(2) }}</span></p>
            </div>

            <!-- Small Dares -->
            <div class="text-center">
                <p class="text-xl text-blue-200 tracking-widest uppercase mb-2 animate-shimmer">Small Dares</p>
                <p class="text-5xl font-extrabold text-blue-400 animate-glow">{{ dareCountSmall }} <span class="text-xl font-light">×
                        ${{ dareCostSmall.toFixed(2) }}</span></p>
                <p class="text-lg text-blue-200 mt-2">= <span class="text-3xl text-blue-300 font-semibold animate-pulse">${{
                        totalSmall.toFixed(2) }}</span></p>
            </div>

            <!-- Total -->
            <div class="border-t border-slate-700 pt-6 text-center">
                <p class="text-2xl text-rose-300 mb-2 uppercase tracking-wide animate-shimmer">Total Damage</p>
                <p class="text-6xl font-black text-red-600 drop-shadow-sm animate-throb">
                    ${{ totalCost.toFixed(2) }}
                </p>
            </div>

            <!-- Roast -->
            <div class="bg-rose-900/50 border border-rose-700 rounded-xl p-6 text-center shadow-inner relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-rose-900/0 via-rose-800/20 to-rose-900/0 animate-pulse"></div>
                <p class="text-lg text-rose-200 italic relative">
                    {{ roastMessage }}
                </p>
            </div>
        </div>

        <div class="text-xs text-slate-600 mt-10 italic animate-fade-in">
            <p>*Your therapist judges you. We judge you harder.*</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore';

const mainStore = useMainStore()
const uid = computed(() => mainStore.user?.uid)

const dareCountBig = ref(0)
const dareCostBig = 6.5
const dareCountSmall = ref(0)
const dareCostSmall = 4.5
const totalBig = computed(() => dareCountBig.value * dareCostBig)
const totalSmall = computed(() => dareCountSmall.value * dareCostSmall)
const totalCost = computed(() => totalBig.value + totalSmall.value)

// Meaner roast messages
const roastMessage = computed(() => {
  const cost = totalCost.value
  if (cost > 1000) return "You could've taken a weekend trip to Bali. But no. You chose bean juice and financial ruin. Sexy choice."
  if (cost > 500) return "Your bloodstream is 40% Dare. Your bank account is 100% crying. Your future self hates you, passionately."
  if (cost > 200) return "Financially reckless. Perpetually jittery. Undeniably pathetic. At least you're committed to something."
  if (cost > 100) return "Every sip whispers 'I've abandoned all financial dignity, but damn do I look good doing it.'"
  if (cost > 50) return "This isn't a treat anymore. It's a relationship, and it's toxic. But we're here for the drama."
  return "Still time to walk away. Or embrace the chaos and watch your future crumble one delicious sip at a time."
})

onMounted(async () => {
    if (!uid.value) return
    const dareDoc = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker')
    const dareSnap = await getDoc(dareDoc)

    if (dareSnap.exists()) {
        dareCountBig.value = dareSnap.data()?.dareCountBig || 0,
        dareCountSmall.value = dareSnap.data()?.dareCountSmall || 0
    }
})
</script>

<style>
@keyframes throb {
  0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(225, 29, 72, 0.4); }
  50% { opacity: 0.9; text-shadow: 0 0 20px rgba(225, 29, 72, 0.7); }
}

@keyframes shimmer {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 5px rgba(250, 204, 21, 0.3); }
  50% { text-shadow: 0 0 15px rgba(250, 204, 21, 0.5); }
}

@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-throb {
  animation: throb 3s infinite ease-in-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite ease-in-out;
}

.animate-glow {
  animation: glow 3s infinite ease-in-out;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
</style>