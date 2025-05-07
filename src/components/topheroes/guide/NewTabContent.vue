<template>
    <div
        class="bg-white/5 p-6 border border-white/10 rounded-xl hover:border-indigo-500/40 hover:shadow-indigo-900/20 transition-all duration-300">
        <!-- Title -->
        <h3 v-if="title" class="text-2xl font-semibold mb-2">{{ title }}</h3>

        <!-- Description -->
        <p v-if="description" class="text-white/80 mb-4">{{ description }}</p>

        <!-- How to Score -->
        <div v-if="howToScore" class="mb-4">
            <h4 class="text-indigo-400 font-semibold mb-1">How to Score</h4>
            <ul class="list-disc list-inside text-white/70">
                <li v-for="(score, idx) in howToScore" :key="idx">{{ score }}</li>
            </ul>
        </div>

        <!-- Priority Buildings -->
        <div v-if="priorityBuildings" class="mb-4">
            <h4 class="text-indigo-400 font-semibold mb-1">Priority Buildings</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <h5 class="text-white/70 font-semibold">High</h5>
                    <ul class="list-disc list-inside text-white/60">
                        <li v-for="b in priorityBuildings.highPriority" :key="b">{{ b }}</li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white/70 font-semibold">Mid</h5>
                    <ul class="list-disc list-inside text-white/60">
                        <li v-for="b in priorityBuildings.midPriority" :key="b">{{ b }}</li>
                    </ul>
                </div>
                <div>
                    <h5 class="text-white/70 font-semibold">Low</h5>
                    <ul class="list-disc list-inside text-white/60">
                        <li v-for="b in priorityBuildings.lowPriority" :key="b">{{ b }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Preparation Strategy -->
        <div v-if="preparationStrategy" class="mb-4">
            <h4 class="text-indigo-400 font-semibold mb-1">Preparation Strategy</h4>
            <ul class="list-disc list-inside text-white/70">
                <li v-for="(prep, idx) in preparationStrategy" :key="idx">{{ prep }}</li>
            </ul>
        </div>

        <!-- Smart Upgrade Playbook -->
        <div v-if="smartUpgradePlaybook" class="mb-4">
            <h4 class="text-indigo-400 font-semibold mb-1">Smart Upgrade Playbook</h4>
            <ul class="list-disc list-inside text-white/70">
                <li v-for="(play, idx) in smartUpgradePlaybook" :key="idx">{{ play }}</li>
            </ul>
        </div>

        <!-- Do's and Don'ts -->
        <div v-if="dosAndDonts" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
                <h5 class="text-green-400 font-semibold mb-1">✅ Do</h5>
                <ul class="list-disc list-inside text-white/70">
                    <li v-for="(d, idx) in dosAndDonts.do" :key="idx">{{ d }}</li>
                </ul>
            </div>
            <div>
                <h5 class="text-red-400 font-semibold mb-1">❌ Don't</h5>
                <ul class="list-disc list-inside text-white/70">
                    <li v-for="(d, idx) in dosAndDonts.dont" :key="idx">{{ d }}</li>
                </ul>
            </div>
        </div>

        <!-- Meta Tip -->
        <div v-if="metaTip" class="p-3 bg-indigo-900/20 rounded-md text-white/70 border-l-4 border-indigo-400">
            <strong class="text-indigo-300">Meta Tip:</strong> {{ metaTip }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    howToScore: Array,
    priorityBuildings: Object,
    preparationStrategy: Array,
    smartUpgradePlaybook: Array,
    dosAndDonts: Object,
    metaTip: String
})
</script>