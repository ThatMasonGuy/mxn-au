<template>
    <LayoutComponent :header="true" :footer="true">
        <ToolBannerComponent
            title="QR Code Generator"
            subtitle="Create customisable QR codes for URLs, text, and Wi-Fi credentials"
            gradient="from-violet-500 to-indigo-600"
        />

        <main class="container mx-auto px-4 py-8 max-w-6xl">
            <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6 lg:p-8">
                <div class="grid lg:grid-cols-2 gap-8">

                    <!-- Left: Controls -->
                    <div class="space-y-6">

                        <!-- Input Mode Tabs -->
                        <div>
                            <div class="flex rounded-lg border border-gray-200 bg-gray-50 p-1 gap-1 mb-4">
                                <button
                                    @click="inputMode = 'text'"
                                    class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all"
                                    :class="inputMode === 'text'
                                        ? 'bg-white text-violet-700 shadow-sm border border-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'"
                                >
                                    <TypeIcon class="w-4 h-4" />
                                    Text / URL
                                </button>
                                <button
                                    @click="inputMode = 'wifi'"
                                    class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all"
                                    :class="inputMode === 'wifi'
                                        ? 'bg-white text-violet-700 shadow-sm border border-gray-200'
                                        : 'text-gray-500 hover:text-gray-700'"
                                >
                                    <WifiIcon class="w-4 h-4" />
                                    Wi-Fi
                                </button>
                            </div>

                            <!-- Text Input -->
                            <div v-if="inputMode === 'text'" class="space-y-2">
                                <label class="block text-sm font-medium text-gray-700">Content to encode</label>
                                <textarea
                                    v-model="textInput"
                                    placeholder="Enter URL, text, or any data..."
                                    rows="5"
                                    class="w-full resize-y font-mono text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
                                />
                                <p class="text-xs text-gray-500">
                                    {{ dataInfo.length }} characters
                                    <span v-if="dataInfo.isWarning" class="text-amber-600"> — approaching capacity limit</span>
                                    <span v-if="dataInfo.isError" class="text-red-600"> — exceeds capacity</span>
                                </p>
                            </div>

                            <!-- Wi-Fi Input -->
                            <div v-if="inputMode === 'wifi'" class="space-y-4">
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Network Name (SSID)</label>
                                    <input
                                        v-model="wifiSsid"
                                        type="text"
                                        placeholder="MyWiFiNetwork"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        v-model="wifiPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800"
                                    />
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="block text-sm font-medium text-gray-700">Security</label>
                                        <select
                                            v-model="wifiSecurity"
                                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 bg-white"
                                        >
                                            <option value="WPA">WPA/WPA2/WPA3</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">None (Open)</option>
                                        </select>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="block text-sm font-medium text-gray-700">Hidden Network</label>
                                        <div class="flex items-center gap-2 h-10">
                                            <button
                                                @click="wifiHidden = !wifiHidden"
                                                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                                                :class="wifiHidden ? 'bg-violet-600' : 'bg-gray-300'"
                                            >
                                                <span
                                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                                    :class="wifiHidden ? 'translate-x-4' : 'translate-x-1'"
                                                />
                                            </button>
                                            <span class="text-sm text-gray-600">Hidden</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <!-- QR Settings -->
                        <div class="space-y-5">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-sm flex items-center gap-2 text-gray-700">
                                    <Cog6ToothIcon class="w-4 h-4" />
                                    QR Settings
                                </h3>
                                <button
                                    @click="resetAll"
                                    title="Reset all settings"
                                    class="h-8 px-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowPathIcon class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Presets -->
                            <div class="space-y-2">
                                <label class="text-xs text-gray-500 font-medium uppercase tracking-wide">Quick Presets</label>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="(_, name) in presets"
                                        :key="name"
                                        @click="applyPreset(name)"
                                        class="capitalize text-sm px-3 py-1.5 rounded-md border font-medium transition-all"
                                        :class="activePreset === name
                                            ? 'bg-violet-600 text-white border-violet-600'
                                            : 'border-gray-300 text-gray-600 hover:border-violet-400 hover:text-violet-600'"
                                    >
                                        {{ name }}
                                    </button>
                                </div>
                            </div>

                            <!-- Size -->
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-medium text-gray-700">Size</label>
                                    <span class="text-sm text-gray-500 font-mono">{{ settings.size }}px</span>
                                </div>
                                <input
                                    type="range"
                                    :value="settings.size"
                                    @input="settings.size = Number($event.target.value)"
                                    min="128" max="1024" step="8"
                                    class="w-full accent-violet-600"
                                />
                            </div>

                            <!-- Margin -->
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-medium text-gray-700">Margin (Quiet Zone)</label>
                                    <span class="text-sm text-gray-500 font-mono">{{ settings.margin }}px</span>
                                </div>
                                <input
                                    type="range"
                                    :value="settings.margin"
                                    @input="settings.margin = Number($event.target.value)"
                                    min="0" max="50" step="1"
                                    class="w-full accent-violet-600"
                                />
                            </div>

                            <!-- Error Correction -->
                            <div class="space-y-1">
                                <label class="block text-sm font-medium text-gray-700">Error Correction Level</label>
                                <select
                                    v-model="settings.errorCorrection"
                                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 bg-white"
                                >
                                    <option value="L">L — Low (7%)</option>
                                    <option value="M">M — Medium (15%)</option>
                                    <option value="Q">Q — Quartile (25%)</option>
                                    <option value="H">H — High (30%)</option>
                                </select>
                                <p class="text-xs text-gray-400">Higher correction allows more damage but reduces capacity.</p>
                            </div>

                            <!-- Rounded Modules -->
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-medium text-gray-700">Rounded Modules</label>
                                    <button
                                        @click="settings.roundedModules = !settings.roundedModules"
                                        class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        :class="settings.roundedModules ? 'bg-violet-600' : 'bg-gray-300'"
                                    >
                                        <span
                                            class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                            :class="settings.roundedModules ? 'translate-x-4' : 'translate-x-1'"
                                        />
                                    </button>
                                </div>
                                <div v-if="settings.roundedModules" class="space-y-2 pl-1">
                                    <div class="flex items-center justify-between">
                                        <label class="text-sm text-gray-600">Rounding Intensity</label>
                                        <span class="text-sm text-gray-500 font-mono">{{ settings.roundingIntensity }}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        :value="settings.roundingIntensity"
                                        @input="settings.roundingIntensity = Number($event.target.value)"
                                        min="0" max="100" step="1"
                                        class="w-full accent-violet-600"
                                    />
                                </div>
                            </div>

                            <!-- Colors -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Foreground</label>
                                    <div class="flex items-center gap-2">
                                        <input
                                            type="color"
                                            v-model="settings.fgColor"
                                            class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                                        />
                                        <input
                                            v-model="settings.fgColor"
                                            type="text"
                                            maxlength="7"
                                            class="flex-1 font-mono text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase text-gray-800"
                                        />
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Background</label>
                                    <div class="flex items-center gap-2">
                                        <input
                                            type="color"
                                            v-model="settings.bgColor"
                                            :disabled="settings.transparentBg"
                                            class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5 disabled:opacity-40"
                                        />
                                        <input
                                            v-model="settings.bgColor"
                                            type="text"
                                            maxlength="7"
                                            :disabled="settings.transparentBg"
                                            class="flex-1 font-mono text-sm border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase text-gray-800 disabled:opacity-40"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Transparent Background -->
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium text-gray-700">Transparent Background</label>
                                <button
                                    @click="settings.transparentBg = !settings.transparentBg"
                                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    :class="settings.transparentBg ? 'bg-violet-600' : 'bg-gray-300'"
                                >
                                    <span
                                        class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                                        :class="settings.transparentBg ? 'translate-x-4' : 'translate-x-1'"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Preview & Actions -->
                    <div class="space-y-6">

                        <!-- Preview Area -->
                        <div
                            class="relative rounded-2xl border-2 border-dashed p-6 flex items-center justify-center min-h-[320px] transition-colors"
                            :class="settings.transparentBg
                                ? 'border-gray-400 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:16px_16px]'
                                : 'border-gray-300'"
                            :style="{ backgroundColor: settings.transparentBg ? undefined : settings.bgColor }"
                        >
                            <!-- Empty State -->
                            <div v-if="dataInfo.isEmpty" class="text-center text-gray-400">
                                <QrCodeIcon class="w-16 h-16 mx-auto mb-3 opacity-30" />
                                <p class="text-sm">Enter some content to generate a QR code</p>
                            </div>

                            <!-- Error State -->
                            <div v-else-if="dataInfo.isError" class="text-center text-red-500">
                                <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-3" />
                                <p class="text-sm font-medium">Content too long</p>
                                <p class="text-xs mt-1 text-red-400">Reduce content, increase size, or lower error correction.</p>
                            </div>

                            <!-- QR Container -->
                            <div
                                v-show="!dataInfo.isEmpty && !dataInfo.isError"
                                ref="qrContainer"
                                class="flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                                :style="{ maxWidth: `${Math.min(settings.size, 400)}px` }"
                            />
                        </div>

                        <!-- Capacity Warning -->
                        <div
                            v-if="dataInfo.isWarning && !dataInfo.isError"
                            class="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
                        >
                            <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div class="text-sm text-amber-800">
                                <p class="font-medium">Approaching capacity limit</p>
                                <p class="text-amber-600 text-xs mt-0.5">Consider increasing size or lowering error correction for reliable scanning.</p>
                            </div>
                        </div>

                        <!-- Export Section -->
                        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold uppercase tracking-wide text-gray-500">Export as</span>
                                <span
                                    v-if="!fileNameManuallySet"
                                    class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-600 border border-violet-200"
                                >auto</span>
                            </div>

                            <!-- Filename row -->
                            <div class="flex items-center gap-2">
                                <div class="relative flex-1">
                                    <input
                                        v-model="fileName"
                                        @input="fileNameManuallySet = true"
                                        type="text"
                                        placeholder="qrcode"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-16 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-800 bg-white"
                                    />
                                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">.png</span>
                                </div>
                                <button
                                    v-if="fileNameManuallySet"
                                    @click="resetFileName"
                                    title="Reset to auto"
                                    class="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-colors"
                                >
                                    <ArrowPathIcon class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Download buttons -->
                            <div class="grid grid-cols-3 gap-2">
                                <button
                                    @click="downloadPNG"
                                    :disabled="dataInfo.isEmpty || dataInfo.isError"
                                    class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <PhotoIcon class="w-4 h-4" />
                                    PNG
                                </button>
                                <button
                                    @click="downloadSVG"
                                    :disabled="dataInfo.isEmpty || dataInfo.isError"
                                    class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <CodeBracketIcon class="w-4 h-4" />
                                    SVG
                                </button>
                                <button
                                    @click="copyToClipboard"
                                    :disabled="dataInfo.isEmpty || dataInfo.isError"
                                    class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <component :is="copiedClipboard ? CheckIcon : ClipboardIcon" class="w-4 h-4" />
                                    {{ copiedClipboard ? 'Copied!' : 'Copy' }}
                                </button>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <!-- Encoded Data Preview (collapsible) -->
                        <div>
                            <button
                                @click="scanTestOpen = !scanTestOpen"
                                class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                <span class="flex items-center gap-2">
                                    <EyeIcon class="w-4 h-4" />
                                    Encoded Data Preview
                                </span>
                                <ChevronDownIcon
                                    class="w-4 h-4 transition-transform"
                                    :class="{ 'rotate-180': scanTestOpen }"
                                />
                            </button>
                            <div v-if="scanTestOpen" class="mt-3">
                                <div class="relative">
                                    <pre class="p-4 pr-12 rounded-lg bg-gray-50 border border-gray-200 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-48 text-gray-700">{{ qrData || '(empty)' }}</pre>
                                    <button
                                        v-if="qrData"
                                        @click="copyDataString"
                                        class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        <component :is="copied ? CheckIcon : DocumentDuplicateIcon" class="w-4 h-4" />
                                    </button>
                                </div>
                                <p class="text-xs text-gray-400 mt-2">This is the exact string encoded in the QR code. Scan to verify it matches.</p>
                            </div>
                        </div>

                        <!-- Info Footer -->
                        <div class="text-xs text-gray-400 space-y-1 border-t border-gray-100 pt-4">
                            <p>• Settings and content are saved automatically</p>
                            <p>• Use higher error correction for printed codes</p>
                            <p>• Transparent backgrounds work best with PNG</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </LayoutComponent>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import QRCodeStyling from 'qr-code-styling'

import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolBannerComponent from '@/features/everhomes/components/ui/ToolBannerComponent.vue'

import {
    QrCodeIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    ChevronDownIcon,
    CheckIcon,
    ClipboardIcon,
    PhotoIcon,
    CodeBracketIcon,
    DocumentDuplicateIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

// Inline icon stubs for lucide equivalents not in heroicons
const TypeIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>' }
const WifiIcon = { template: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>' }

const defaultSettings = {
    size: 300,
    margin: 10,
    errorCorrection: 'M',
    roundedModules: false,
    roundingIntensity: 50,
    fgColor: '#000000',
    bgColor: '#ffffff',
    transparentBg: false
}

const presets = {
    default: { ...defaultSettings },
    sticker: {
        size: 400,
        margin: 30,
        errorCorrection: 'H',
        roundedModules: true,
        roundingIntensity: 100,
        fgColor: '#000000',
        bgColor: '#ffffff',
        transparentBg: false
    },
    tiny: {
        size: 150,
        margin: 4,
        errorCorrection: 'L',
        roundedModules: false,
        roundingIntensity: 0,
        fgColor: '#000000',
        bgColor: '#ffffff',
        transparentBg: false
    }
}

const inputMode = useLocalStorage('qr-input-mode', 'text')
const textInput = useLocalStorage('qr-text-input', '')
const settings = useLocalStorage('qr-settings', { ...defaultSettings })
const wifiSsid = useLocalStorage('qr-wifi-ssid', '')
const wifiPassword = useLocalStorage('qr-wifi-password', '')
const wifiSecurity = useLocalStorage('qr-wifi-security', 'WPA')
const wifiHidden = useLocalStorage('qr-wifi-hidden', false)
const fileName = useLocalStorage('qr-filename', 'qrcode')
const fileNameManuallySet = ref(false)

const qrContainer = ref(null)
const qrInstance = ref(null)
const scanTestOpen = ref(false)
const copied = ref(false)
const copiedClipboard = ref(false)
const activePreset = ref('default')

function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40)
}

function deriveFileName(data) {
    if (inputMode.value === 'wifi') {
        return wifiSsid.value ? slugify(wifiSsid.value) + '-qrcode' : 'wifi-qrcode'
    }
    try {
        const url = new URL(data)
        const host = url.hostname.replace(/^www\./, '')
        return slugify(host) + '-qrcode'
    } catch {
        const words = data.trim().split(/\s+/).slice(0, 4).join(' ')
        const slug = slugify(words)
        return slug ? slug + '-qrcode' : 'qrcode'
    }
}

function resetFileName() {
    fileNameManuallySet.value = false
    if (qrData.value) fileName.value = deriveFileName(qrData.value)
}

function escapeWifiString(str) {
    return str.replace(/([\\;,:"'])/g, '\\$1')
}

const wifiString = computed(() => {
    if (!wifiSsid.value) return ''
    const hidden = wifiHidden.value ? 'H:true;' : ''
    const password = wifiPassword.value ? `P:${escapeWifiString(wifiPassword.value)};` : ''
    const security = wifiSecurity.value === 'nopass' ? '' : `T:${wifiSecurity.value};`
    return `WIFI:${security}S:${escapeWifiString(wifiSsid.value)};${password}${hidden};`
})

const qrData = computed(() => inputMode.value === 'wifi' ? wifiString.value : textInput.value)

const dataInfo = computed(() => {
    const len = qrData.value.length
    const capacities = {
        L: { max: 4296, warn: 3500 },
        M: { max: 3391, warn: 2800 },
        Q: { max: 2420, warn: 2000 },
        H: { max: 1852, warn: 1500 }
    }
    const cap = capacities[settings.value.errorCorrection]
    return {
        length: len,
        isWarning: len > cap.warn && len <= cap.max,
        isError: len > cap.max,
        isEmpty: len === 0
    }
})

const dotType = computed(() => {
    if (!settings.value.roundedModules) return 'square'
    const i = settings.value.roundingIntensity
    if (i < 33) return 'rounded'
    if (i < 66) return 'extra-rounded'
    return 'dots'
})

const cornerType = computed(() => {
    if (!settings.value.roundedModules) return 'square'
    return settings.value.roundingIntensity > 50 ? 'dot' : 'extra-rounded'
})

function generateQR() {
    if (!qrContainer.value || !qrData.value) {
        if (qrContainer.value) qrContainer.value.innerHTML = ''
        qrInstance.value = null
        return
    }
    const bgColor = settings.value.transparentBg ? 'transparent' : settings.value.bgColor
    const options = {
        width: settings.value.size,
        height: settings.value.size,
        type: 'svg',
        data: qrData.value,
        margin: settings.value.margin,
        qrOptions: { errorCorrectionLevel: settings.value.errorCorrection },
        dotsOptions: { color: settings.value.fgColor, type: dotType.value },
        cornersSquareOptions: { color: settings.value.fgColor, type: cornerType.value },
        cornersDotOptions: { color: settings.value.fgColor, type: settings.value.roundedModules ? 'dot' : 'square' },
        backgroundOptions: { color: bgColor }
    }
    qrContainer.value.innerHTML = ''
    qrInstance.value = new QRCodeStyling(options)
    qrInstance.value.append(qrContainer.value)
}

const debouncedGenerate = useDebounceFn(generateQR, 150)

watch([qrData, settings], () => { debouncedGenerate() }, { deep: true })

watch(qrData, (newData) => {
    if (!fileNameManuallySet.value && newData) {
        fileName.value = deriveFileName(newData)
    }
})

async function downloadPNG() {
    if (!qrInstance.value) return
    await qrInstance.value.download({ name: fileName.value.trim() || 'qrcode', extension: 'png' })
}

async function downloadSVG() {
    if (!qrInstance.value) return
    await qrInstance.value.download({ name: fileName.value.trim() || 'qrcode', extension: 'svg' })
}

async function copyToClipboard() {
    if (!qrInstance.value) return
    try {
        const blob = await qrInstance.value.getRawData('png')
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        copiedClipboard.value = true
        setTimeout(() => { copiedClipboard.value = false }, 2000)
    } catch {}
}

async function copyDataString() {
    try {
        await navigator.clipboard.writeText(qrData.value)
        copied.value = true
        setTimeout(() => { copied.value = false }, 2000)
    } catch {}
}

function applyPreset(name) {
    const preset = presets[name]
    if (preset) {
        settings.value = { ...preset }
        activePreset.value = name
    }
}

function resetAll() {
    settings.value = { ...defaultSettings }
    textInput.value = ''
    wifiSsid.value = ''
    wifiPassword.value = ''
    wifiSecurity.value = 'WPA'
    wifiHidden.value = false
    fileName.value = 'qrcode'
    fileNameManuallySet.value = false
    activePreset.value = 'default'
}

onMounted(() => {
    nextTick(() => {
        if (qrData.value) generateQR()
    })
})
</script>
