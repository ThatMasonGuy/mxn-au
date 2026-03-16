<template>
    <div class="min-h-screen">
        <!-- Performance Monitor -->
        <PerformanceMonitor v-if="showPerformance" />
        
        <!-- Current Background Component -->
        <component :is="currentBackground.component" v-bind="backgroundProps">
            <!-- Fixed Control Panel -->
            <div class="fixed top-0 right-4 z-50 max-w-sm">
                <div class="bg-gray-900/95 backdrop-blur-lg rounded-b-xl p-4 border border-gray-700 border-t-0 shadow-2xl max-h-screen overflow-y-auto">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="font-semibold text-white text-sm">Background Controls</h3>
                        <button 
                            @click="controlsExpanded = !controlsExpanded"
                            class="text-gray-400 hover:text-white transition-colors hover-test"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path v-if="!controlsExpanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div v-show="controlsExpanded" class="space-y-4">
                        <!-- Background Selector -->
                        <div>
                            <label class="text-xs text-gray-400 mb-2 block">Style</label>
                            <select 
                                v-model="currentBg" 
                                class="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-purple-500 focus:outline-none"
                            >
                                <option v-for="bg in backgrounds" :key="bg.name" :value="bg.name">
                                    {{ bg.emoji }} {{ bg.displayName }}
                                </option>
                            </select>
                        </div>

                        <!-- Dynamic Controls Based on Background -->
                        <div v-if="currentBg === 'mesh'" class="space-y-3">
                            <div v-for="color in ['color1', 'color2', 'color3', 'color4']" :key="color">
                                <label class="text-xs text-gray-400 mb-1 block capitalize">{{ color }}</label>
                                <input 
                                    type="color" 
                                    :value="meshColors[color]"
                                    @input="e => debouncedColorUpdate(() => meshColors[color] = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                        </div>

                        <div v-if="currentBg === 'wave'" class="space-y-3">
                            <div v-for="color in ['primaryColor', 'secondaryColor', 'tertiaryColor']" :key="color">
                                <label class="text-xs text-gray-400 mb-1 block">{{ color.replace('Color', '') }}</label>
                                <input 
                                    type="color" 
                                    :value="waveColors[color]"
                                    @input="e => debouncedColorUpdate(() => waveColors[color] = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Opacity: {{ waveOpacity }}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05"
                                    v-model="waveOpacity"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div v-if="currentBg === 'grid'" class="space-y-3">
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Grid Color</label>
                                <input 
                                    type="color" 
                                    :value="gridColor"
                                    @input="e => debouncedColorUpdate(() => gridColor = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Grid Size: {{ gridSize }}px</label>
                                <input 
                                    type="range" 
                                    min="20" 
                                    max="100" 
                                    v-model="gridSize"
                                    class="w-full"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Glow: {{ gridGlowOpacity }}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05"
                                    v-model="gridGlowOpacity"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div v-if="currentBg === 'scanline'" class="space-y-3">
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Primary Color</label>
                                <input 
                                    type="color" 
                                    :value="scanlineColor"
                                    @input="e => debouncedColorUpdate(() => scanlineColor = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Scan Speed: {{ scanlineSpeed }}s</label>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="30" 
                                    v-model="scanlineSpeed"
                                    class="w-full"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Glow: {{ scanlineGlow }}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="0.3" 
                                    step="0.01"
                                    v-model="scanlineGlow"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div v-if="currentBg === 'noise'" class="space-y-3">
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Base Color</label>
                                <input 
                                    type="color" 
                                    :value="noiseBaseColor"
                                    @input="e => debouncedColorUpdate(() => noiseBaseColor = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Accent Color</label>
                                <input 
                                    type="color" 
                                    :value="noiseAccentColor"
                                    @input="e => debouncedColorUpdate(() => noiseAccentColor = e.target.value)"
                                    class="w-full h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                                />
                            </div>
                            <div>
                                <label class="text-xs text-gray-400 mb-1 block">Noise: {{ noiseOpacity }}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="0.2" 
                                    step="0.01"
                                    v-model="noiseOpacity"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Copy Code Button -->
                        <button 
                            @click="copyCode"
                            class="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            {{ copied ? '✓ Copied!' : 'Copy Code' }}
                        </button>

                        <!-- Performance Monitor Toggle -->
                        <button 
                            @click="showPerformance = !showPerformance"
                            class="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all border border-gray-700 hover:scale-105 active:scale-95"
                        >
                            {{ showPerformance ? '📊 Hide Stats' : '📊 Show Stats' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Page Content -->
            <div class="relative z-10">
                <!-- Hero Section with Interactive Elements -->
                <section class="container mx-auto px-4 py-20 min-h-screen flex items-center">
                    <div class="max-w-5xl mx-auto">
                        <div class="text-center mb-12">
                            <div class="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6 hover:bg-purple-500/20 transition-all hover:scale-105">
                                <span class="text-purple-400 text-sm font-medium">{{ currentBackground.emoji }} {{ currentBackground.displayName }}</span>
                            </div>
                            <h1 class="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight hover-lift">
                                Performance<br />Stress Test
                            </h1>
                            <p class="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
                                Hover, click, and interact with everything. Watch the FPS counter. Does it hold 60?
                            </p>
                        </div>

                        <!-- Interactive Button Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <button 
                                v-for="n in 8" 
                                :key="n"
                                class="interactive-card group bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-110 hover:rotate-2 active:scale-95"
                            >
                                <div class="text-4xl mb-2 group-hover:scale-125 transition-transform">🚀</div>
                                <div class="text-white font-semibold">Hover Me {{ n }}</div>
                            </button>
                        </div>

                        <!-- Animated Floating Cards -->
                        <div class="grid md:grid-cols-3 gap-6">
                            <div 
                                v-for="(feature, index) in features" 
                                :key="index"
                                class="floating-card bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
                                :style="{ animationDelay: `${index * 0.2}s` }"
                            >
                                <div class="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 hover:scale-110 hover:rotate-12 transition-all">
                                    <span class="text-3xl">{{ feature.icon }}</span>
                                </div>
                                <h3 class="text-xl font-semibold text-white mb-3">{{ feature.title }}</h3>
                                <p class="text-gray-400">{{ feature.description }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Interactive Card Grid -->
                <section class="container mx-auto px-4 py-20">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-4xl font-bold text-white mb-12 text-center hover-lift">Hover Scale Test</h2>
                        <div class="grid md:grid-cols-4 gap-4">
                            <div 
                                v-for="n in 16" 
                                :key="n"
                                class="scale-card aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all cursor-pointer"
                            >
                                <span class="text-white font-bold text-2xl">{{ n }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Rotating Elements Test -->
                <section class="container mx-auto px-4 py-20">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-4xl font-bold text-white mb-12 text-center hover-lift">Rotate + Transform Test</h2>
                        <div class="grid md:grid-cols-3 gap-8">
                            <div 
                                v-for="n in 6" 
                                :key="n"
                                class="rotate-card bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
                            >
                                <div class="rotate-icon w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span class="text-3xl">⚡</span>
                                </div>
                                <h3 class="text-lg font-semibold text-white text-center">Rotate {{ n }}</h3>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Multiple Transform Layers -->
                <section class="container mx-auto px-4 py-20">
                    <div class="max-w-4xl mx-auto">
                        <h2 class="text-4xl font-bold text-white mb-12 text-center hover-lift">Nested Transform Test</h2>
                        <div class="nested-transform-test bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-12 hover:bg-white/10 transition-all">
                            <div class="transform-layer-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 hover:scale-105 transition-all">
                                <div class="transform-layer-2 bg-white/10 rounded-xl p-6 hover:scale-110 hover:rotate-2 transition-all">
                                    <div class="transform-layer-3 bg-white/10 rounded-lg p-4 hover:scale-110 hover:-rotate-2 transition-all text-center">
                                        <span class="text-white font-bold text-xl">Triple Nested Hover!</span>
                                        <p class="text-gray-400 text-sm mt-2">Each layer has its own transform</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Rapid Interaction Test -->
                <section class="container mx-auto px-4 py-20">
                    <div class="max-w-6xl mx-auto">
                        <h2 class="text-4xl font-bold text-white mb-12 text-center hover-lift">Rapid Hover Test (Move Mouse Fast!)</h2>
                        <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
                            <div 
                                v-for="n in 64" 
                                :key="n"
                                class="rapid-card aspect-square bg-white/5 border border-white/10 rounded-lg hover:bg-purple-500/30 hover:scale-125 hover:z-10 transition-all cursor-pointer"
                            ></div>
                        </div>
                    </div>
                </section>

                <!-- Stress Test Summary -->
                <section class="container mx-auto px-4 py-20">
                    <div class="max-w-4xl mx-auto text-center">
                        <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/20 rounded-3xl p-12 hover:from-purple-500/30 hover:to-pink-500/30 transition-all hover:scale-105">
                            <h2 class="text-4xl font-bold text-white mb-4">Did It Hold 60 FPS?</h2>
                            <p class="text-xl text-gray-300 mb-8">
                                If the FPS counter stayed green through all that hovering, scaling, and transforming - you've got a winner! 🏆
                            </p>
                            <div class="flex gap-4 justify-center">
                                <div class="bg-white/10 rounded-xl px-6 py-4">
                                    <div class="text-3xl font-bold text-green-400">60fps</div>
                                    <div class="text-sm text-gray-400">Target</div>
                                </div>
                                <div class="bg-white/10 rounded-xl px-6 py-4">
                                    <div class="text-3xl font-bold text-blue-400">100+</div>
                                    <div class="text-sm text-gray-400">Interactive Elements</div>
                                </div>
                                <div class="bg-white/10 rounded-xl px-6 py-4">
                                    <div class="text-3xl font-bold text-purple-400">∞</div>
                                    <div class="text-sm text-gray-400">Transforms</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="container mx-auto px-4 py-12 border-t border-white/10">
                    <div class="text-center text-gray-500">
                        <p>Stress tested and approved 💜</p>
                    </div>
                </footer>
            </div>
        </component>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MeshGradientBackground from './MeshGradientBackground.vue'
import WaveGradientBackground from './WaveGradientBackground.vue'
import GridBackground from './GridBackground.vue'
import ScanlineBackground from './ScanlineBackground.vue'
import NoiseGradientBackground from './NoiseGradientBackground.vue'
import PerformanceMonitor from './PerformanceMonitor.vue'

const currentBg = ref('mesh')
const controlsExpanded = ref(true)
const copied = ref(false)
const showPerformance = ref(true)

// Debounced color updates to prevent FPS drops
let colorUpdateTimeout = null
const debouncedColorUpdate = (callback) => {
    if (colorUpdateTimeout) clearTimeout(colorUpdateTimeout)
    colorUpdateTimeout = setTimeout(callback, 150)
}

// Feature cards data
const features = [
    { icon: '⚡', title: 'Lightning Fast', description: '60fps with GPU acceleration' },
    { icon: '🎨', title: 'Customizable', description: 'Change colors and settings live' },
    { icon: '♿', title: 'Accessible', description: 'Respects motion preferences' },
    { icon: '📱', title: 'Mobile Ready', description: 'Works on all devices' },
    { icon: '🔧', title: 'Zero Config', description: 'Works out of the box' },
    { icon: '📊', title: 'Monitored', description: 'Real-time performance stats' }
]

// Mesh colors
const meshColors = ref({
    color1: '#1e1b4b',
    color2: '#312e81',
    color3: '#7c3aed',
    color4: '#c026d3'
})

// Wave colors
const waveColors = ref({
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    tertiaryColor: '#3b82f6'
})
const waveOpacity = ref(0.3)

// Grid settings
const gridColor = ref('#9333ea')
const gridSize = ref(40)
const gridGlowOpacity = ref(0.2)

// Scanline settings
const scanlineColor = ref('#10b981')
const scanlineSpeed = ref(10)
const scanlineGlow = ref(0.15)

// Noise settings
const noiseBaseColor = ref('#0f172a')
const noiseAccentColor = ref('#7c3aed')
const noiseOpacity = ref(0.05)

const backgrounds = [
    {
        name: 'mesh',
        displayName: 'Mesh Gradient',
        emoji: '🌈',
        component: MeshGradientBackground
    },
    {
        name: 'wave',
        displayName: 'Wave Gradient',
        emoji: '🌊',
        component: WaveGradientBackground
    },
    {
        name: 'grid',
        displayName: 'Grid Pattern',
        emoji: '📐',
        component: GridBackground
    },
    {
        name: 'scanline',
        displayName: 'Scanline',
        emoji: '👾',
        component: ScanlineBackground
    },
    {
        name: 'noise',
        displayName: 'Noise Grain',
        emoji: '✨',
        component: NoiseGradientBackground
    }
]

const currentBackground = computed(() => {
    return backgrounds.find(bg => bg.name === currentBg.value) || backgrounds[0]
})

const backgroundProps = computed(() => {
    switch (currentBg.value) {
        case 'mesh':
            return meshColors.value
        case 'wave':
            return {
                primaryColor: hexToRgba(waveColors.value.primaryColor, waveOpacity.value),
                secondaryColor: hexToRgba(waveColors.value.secondaryColor, waveOpacity.value),
                tertiaryColor: hexToRgba(waveColors.value.tertiaryColor, waveOpacity.value)
            }
        case 'grid':
            return {
                gridSize: parseInt(gridSize.value),
                gridColor: hexToRgba(gridColor.value, 0.15),
                glowColor: hexToRgba(gridColor.value, parseFloat(gridGlowOpacity.value))
            }
        case 'scanline':
            return {
                primaryColor: scanlineColor.value,
                scanlineSpeed: parseInt(scanlineSpeed.value),
                glowIntensity: parseFloat(scanlineGlow.value)
            }
        case 'noise':
            return {
                baseColor: noiseBaseColor.value,
                accentColor: noiseAccentColor.value,
                noiseOpacity: parseFloat(noiseOpacity.value)
            }
        default:
            return {}
    }
})

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const copyCode = () => {
    const code = `<${currentBackground.value.component.__name} ${Object.entries(backgroundProps.value)
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `:${key}="'${value}'"`
            }
            return `:${key}="${value}"`
        })
        .join('\n    ')}>
    <!-- your content -->
</${currentBackground.value.component.__name}>`
    
    navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
/* Hover lift effect */
.hover-lift {
    transition: transform 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
}

/* Interactive cards */
.interactive-card {
    position: relative;
    cursor: pointer;
}

/* Floating animation */
.floating-card {
    animation: float 6s ease-in-out infinite;
    cursor: pointer;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* Scale cards */
.scale-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
}

.scale-card:hover {
    transform: scale(1.15);
    z-index: 10;
}

/* Rotate cards */
.rotate-card {
    cursor: pointer;
}

.rotate-card:hover {
    transform: scale(1.05) rotate(5deg);
}

.rotate-card:hover .rotate-icon {
    transform: rotate(360deg) scale(1.2);
    transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Rapid cards */
.rapid-card {
    position: relative;
}

/* Nested transforms */
.nested-transform-test {
    cursor: pointer;
}

/* Smooth transforms */
* {
    transform: translateZ(0);
    backface-visibility: hidden;
}
</style>