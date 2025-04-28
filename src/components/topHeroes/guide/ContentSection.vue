<!-- ContentSection.vue -->
<template>
    <section class="rounded-2xl mx-auto max-w-[1000px] bg-white/5 border border-white/10 backdrop-blur-lg shadow-lg p-6 sm:p-8 animate-fade-in 
      hover:shadow-indigo-900/30 hover:transform hover:-translate-y-1 transition-all duration-300">
        <div class="flex items-center gap-3 mb-6">
            <component v-if="icon" :is="resolveIcon(icon)" class="w-6 h-6 text-indigo-400" />
            <h2 v-if="title" class="text-2xl font-bold">{{ title }}</h2>
        </div>

        <!-- Cards -->
        <div v-if="cards" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(card, idx) in cards" :key="idx"
                class="bg-white/10 border border-white/10 p-4 rounded-xl shadow-sm 
          hover:shadow-indigo-900/30 hover:border-indigo-500/40 hover:transform hover:-translate-y-1 transition-all duration-300">
                <h3 class="font-semibold text-lg text-white/90 mb-1">{{ card.title }}</h3>
                <div class="text-white/80 text-sm whitespace-pre-line">{{ card.content }}</div>
            </div>
        </div>

        <!-- Tabs -->
        <div v-if="tabs" class="mt-2">
            <div class="flex flex-wrap gap-2 pb-2">
                <button v-for="tab in tabs" :key="tab.short" @click="activeTab = tab.short" :class="[
                    'px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300',
                    activeTab === tab.short
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30 transform -translate-y-0.5'
                        : 'bg-white/10 hover:bg-white/20 hover:shadow-indigo-900/20 hover:transform hover:-translate-y-0.5'
                ]">
                    {{ tab.title }}
                </button>
            </div>

            <div class="animate-slide-fade" v-for="tab in tabs" :key="tab.short" v-show="activeTab === tab.short">
                <template v-if="tab.newStyle">
                    <NewTabContent :title="tab.title" :description="tab.description" :how-to-score="tab.howToScore"
                        :priority-buildings="tab.priorityBuildings" :preparation-strategy="tab.preparationStrategy"
                        :smart-upgrade-playbook="tab.smartUpgradePlaybook" :dos-and-donts="tab.dosAndDonts"
                        :meta-tip="tab.metaTip" />
                </template>
                <template v-else>
                    <div
                        class="bg-white/5 p-6 border border-white/10 rounded-xl hover:border-indigo-500/40 hover:shadow-indigo-900/20 transition-all duration-300">
                        <h3 class="text-2xl font-semibold mb-2">{{ tab.title }}</h3>
                        <p class="text-white/80">{{ tab.description }}</p>
                        <ul v-if="tab.tips" class="list-disc pl-6 mt-4 text-white/70">
                            <li v-for="(tip, i) in tab.tips" :key="i">{{ tip }}</li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { BookOpenIcon, ClipboardIcon, LightBulbIcon } from '@heroicons/vue/24/outline';
import NewTabContent from '@/components/topHeroes/guide/NewTabContent.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: ''
    },
    cards: {
        type: Array,
        default: () => []
    },
    tabs: {
        type: Array,
        default: () => []
    }
})

const activeTab = ref(props.tabs.length > 0 ? props.tabs[0].short : '')

// Map component names to icons
const iconMap = {
    BookOpenIcon,
    ClipboardIcon,
    LightBulbIcon
}

// Helper function to resolve icon names to components
const resolveIcon = (iconName) => {
    return iconMap[iconName] || BookOpenIcon // Default to BookOpenIcon if not found
}
</script>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.6s ease both;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-fade {
    animation: slide-fade 0.4s ease both;
}

@keyframes slide-fade {
    from {
        opacity: 0;
        transform: translateX(8px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>