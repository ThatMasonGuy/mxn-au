<!--
  QR Code Generator Page for mxn site
  
  DEPENDENCY: Install qr-code-styling before use:
  npm install qr-code-styling
  
  Assumes: Vue 3, Tailwind CSS, shadcn/vue components, lucide-vue-next, @vueuse/core, vue-sonner
-->

<template>
    <div class="dark min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center gap-3 mb-3">
            <div class="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
              <QrCode class="w-7 h-7" />
            </div>
            <h1 class="text-3xl font-bold text-white">
              QR Code Generator
            </h1>
          </div>
          <p class="text-zinc-400 max-w-md mx-auto">
            Create customizable QR codes for URLs, text, Wi-Fi credentials, and more.
          </p>
        </div>
  
        <!-- Main Card -->
        <Card class="border-zinc-700/50 shadow-2xl bg-zinc-800/50 backdrop-blur-sm">
          <CardContent class="p-6 lg:p-8">
            <div class="grid lg:grid-cols-2 gap-8">
              <!-- Left: Controls -->
              <div class="space-y-6">
                <!-- Input Mode Tabs -->
                <Tabs v-model="inputMode" class="w-full">
                  <TabsList class="grid w-full grid-cols-2 mb-4 bg-zinc-700/50">
                    <TabsTrigger value="text" class="gap-2 data-[state=active]:bg-zinc-600 data-[state=active]:text-white text-zinc-300">
                      <Type class="w-4 h-4" />
                      Text / URL
                    </TabsTrigger>
                    <TabsTrigger value="wifi" class="gap-2 data-[state=active]:bg-zinc-600 data-[state=active]:text-white text-zinc-300">
                      <Wifi class="w-4 h-4" />
                      Wi-Fi
                    </TabsTrigger>
                  </TabsList>
  
                  <!-- Text Input Tab -->
                  <TabsContent value="text" class="space-y-4 mt-0">
                    <div class="space-y-2">
                      <Label for="text-input" class="text-sm font-medium text-zinc-200">Content to encode</Label>
                      <Textarea
                        id="text-input"
                        v-model="textInput"
                        placeholder="Enter URL, text, JSON, or any data..."
                        class="min-h-[120px] resize-y font-mono text-sm bg-zinc-900/50 border-zinc-600 text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
                      />
                      <p class="text-xs text-zinc-400">
                        {{ dataInfo.length }} characters
                        <span v-if="dataInfo.isWarning" class="text-amber-400">
                          — approaching capacity limit
                        </span>
                        <span v-if="dataInfo.isError" class="text-red-400">
                          — exceeds capacity, increase size or lower error correction
                        </span>
                      </p>
                    </div>
                  </TabsContent>
  
                  <!-- Wi-Fi Tab -->
                  <TabsContent value="wifi" class="space-y-4 mt-0">
                    <div class="space-y-2">
                      <Label for="wifi-ssid" class="text-zinc-200">Network Name (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        v-model="wifiSsid"
                        placeholder="MyWiFiNetwork"
                        class="bg-zinc-900/50 border-zinc-600 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label for="wifi-password" class="text-zinc-200">Password</Label>
                      <Input
                        id="wifi-password"
                        v-model="wifiPassword"
                        type="password"
                        placeholder="••••••••"
                        class="bg-zinc-900/50 border-zinc-600 text-zinc-100 placeholder:text-zinc-500"
                      />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <Label for="wifi-security" class="text-zinc-200">Security</Label>
                        <Select v-model="wifiSecurity">
                          <SelectTrigger id="wifi-security" class="bg-zinc-900/50 border-zinc-600 text-zinc-100">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent class="bg-zinc-800 border-zinc-600">
                            <SelectItem value="WPA" class="text-zinc-100 focus:bg-zinc-700">WPA/WPA2/WPA3</SelectItem>
                            <SelectItem value="WEP" class="text-zinc-100 focus:bg-zinc-700">WEP</SelectItem>
                            <SelectItem value="nopass" class="text-zinc-100 focus:bg-zinc-700">None (Open)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div class="space-y-2">
                        <Label class="text-zinc-200">Hidden Network</Label>
                        <div class="flex items-center gap-2 h-10">
                          <Switch id="wifi-hidden" v-model:checked="wifiHidden" />
                          <Label for="wifi-hidden" class="font-normal text-zinc-400 cursor-pointer">
                            Hidden
                          </Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
  
                <Separator class="bg-zinc-700" />
  
                <!-- QR Settings -->
                <div class="space-y-5">
                  <div class="flex items-center justify-between">
                    <h3 class="font-semibold text-sm flex items-center gap-2 text-zinc-200">
                      <Settings2 class="w-4 h-4" />
                      QR Settings
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Button variant="ghost" size="sm" @click="resetAll" class="h-8 px-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700">
                            <RotateCcw class="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Reset all settings</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
  
                  <!-- Presets -->
                  <div class="space-y-2">
                    <Label class="text-xs text-zinc-400">Quick Presets</Label>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        v-for="(_, name) in presets"
                        :key="name"
                        :variant="activePreset === name ? 'default' : 'outline'"
                        size="sm"
                        @click="applyPreset(name)"
                        class="capitalize"
                        :class="activePreset === name 
                          ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                          : 'border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'"
                      >
                        <template v-if="name === 'default'">
                          <RotateCcw class="w-3 h-3 mr-1" />
                        </template>
                        <template v-else-if="name === 'sticker'">
                          <Sparkles class="w-3 h-3 mr-1" />
                        </template>
                        <template v-else-if="name === 'tiny'">
                          <Minimize2 class="w-3 h-3 mr-1" />
                        </template>
                        {{ name }}
                      </Button>
                    </div>
                  </div>
  
                  <!-- Size -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label class="text-zinc-200">Size</Label>
                      <span class="text-sm text-zinc-400 font-mono">{{ settings.size }}px</span>
                    </div>
                    <Slider
                      :model-value="[settings.size]"
                      @update:model-value="(v) => settings.size = v[0]"
                      :min="128"
                      :max="1024"
                      :step="8"
                      class="[&_[role=slider]]:bg-violet-500 [&_[role=slider]]:border-violet-500"
                    />
                  </div>
  
                  <!-- Margin -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label class="text-zinc-200">Margin (Quiet Zone)</Label>
                      <span class="text-sm text-zinc-400 font-mono">{{ settings.margin }}px</span>
                    </div>
                    <Slider
                      :model-value="[settings.margin]"
                      @update:model-value="(v) => settings.margin = v[0]"
                      :min="0"
                      :max="50"
                      :step="1"
                      class="[&_[role=slider]]:bg-violet-500 [&_[role=slider]]:border-violet-500"
                    />
                  </div>
  
                  <!-- Error Correction -->
                  <div class="space-y-2">
                    <Label class="text-zinc-200">Error Correction Level</Label>
                    <Select v-model="settings.errorCorrection">
                      <SelectTrigger class="bg-zinc-900/50 border-zinc-600 text-zinc-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent class="bg-zinc-800 border-zinc-600">
                        <SelectItem value="L" class="text-zinc-100 focus:bg-zinc-700">L - Low (7%)</SelectItem>
                        <SelectItem value="M" class="text-zinc-100 focus:bg-zinc-700">M - Medium (15%)</SelectItem>
                        <SelectItem value="Q" class="text-zinc-100 focus:bg-zinc-700">Q - Quartile (25%)</SelectItem>
                        <SelectItem value="H" class="text-zinc-100 focus:bg-zinc-700">H - High (30%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p class="text-xs text-zinc-500">
                      Higher correction allows more damage but reduces capacity.
                    </p>
                  </div>
  
                  <!-- Rounded Modules -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <Label for="rounded-switch" class="text-zinc-200">Rounded Modules</Label>
                      <Switch id="rounded-switch" v-model:checked="settings.roundedModules" />
                    </div>
                    <div v-if="settings.roundedModules" class="space-y-3 pl-1">
                      <div class="flex items-center justify-between">
                        <Label class="text-sm text-zinc-400">Rounding Intensity</Label>
                        <span class="text-sm text-zinc-400 font-mono">{{ settings.roundingIntensity }}%</span>
                      </div>
                      <Slider
                        :model-value="[settings.roundingIntensity]"
                        @update:model-value="(v) => settings.roundingIntensity = v[0]"
                        :min="0"
                        :max="100"
                        :step="1"
                        class="[&_[role=slider]]:bg-violet-500 [&_[role=slider]]:border-violet-500"
                      />
                    </div>
                  </div>
  
                  <!-- Colors -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <Label for="fg-color" class="text-zinc-200">Foreground</Label>
                      <div class="flex items-center gap-2">
                        <input
                          id="fg-color"
                          type="color"
                          v-model="settings.fgColor"
                          class="w-10 h-10 rounded-lg border border-zinc-600 cursor-pointer bg-transparent"
                        />
                        <Input
                          v-model="settings.fgColor"
                          class="flex-1 font-mono text-sm uppercase bg-zinc-900/50 border-zinc-600 text-zinc-100"
                          maxlength="7"
                        />
                      </div>
                    </div>
                    <div class="space-y-2">
                      <Label for="bg-color" class="text-zinc-200">Background</Label>
                      <div class="flex items-center gap-2">
                        <input
                          id="bg-color"
                          type="color"
                          v-model="settings.bgColor"
                          :disabled="settings.transparentBg"
                          class="w-10 h-10 rounded-lg border border-zinc-600 cursor-pointer bg-transparent disabled:opacity-50"
                        />
                        <Input
                          v-model="settings.bgColor"
                          :disabled="settings.transparentBg"
                          class="flex-1 font-mono text-sm uppercase bg-zinc-900/50 border-zinc-600 text-zinc-100 disabled:opacity-50"
                          maxlength="7"
                        />
                      </div>
                    </div>
                  </div>
  
                  <!-- Transparent Background -->
                  <div class="flex items-center justify-between">
                    <Label for="transparent-bg" class="text-zinc-200">Transparent Background</Label>
                    <Switch id="transparent-bg" v-model:checked="settings.transparentBg" />
                  </div>
                </div>
              </div>
  
              <!-- Right: Preview & Actions -->
              <div class="space-y-6">
                <!-- Preview Card -->
                <div 
                  class="relative rounded-2xl border-2 border-dashed p-6 flex items-center justify-center min-h-[320px] transition-colors"
                  :class="settings.transparentBg 
                    ? 'border-zinc-400 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,white_0%_50%)] bg-[length:16px_16px]' 
                    : 'border-zinc-300'"
                  :style="{ backgroundColor: settings.transparentBg ? undefined : settings.bgColor }"
                >
                  <!-- Empty State -->
                  <div v-if="dataInfo.isEmpty" class="text-center text-zinc-400">
                    <QrCode class="w-16 h-16 mx-auto mb-3 opacity-40" />
                    <p class="text-sm">Enter some content to generate a QR code</p>
                  </div>
  
                  <!-- Warning State -->
                  <div v-else-if="dataInfo.isError" class="text-center text-red-500">
                    <AlertTriangle class="w-16 h-16 mx-auto mb-3" />
                    <p class="text-sm font-medium">Content too long</p>
                    <p class="text-xs mt-1 text-red-400">
                      Reduce content length, increase size, or lower error correction.
                    </p>
                  </div>
  
                  <!-- QR Code Container -->
                  <div
                    v-show="!dataInfo.isEmpty && !dataInfo.isError"
                    ref="qrContainer"
                    class="flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                    :style="{ maxWidth: `${Math.min(settings.size, 400)}px` }"
                  />
                </div>
  
                <!-- Warning Banner -->
                <div
                  v-if="dataInfo.isWarning && !dataInfo.isError"
                  class="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                  <AlertTriangle class="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div class="text-sm text-amber-200">
                    <p class="font-medium">Approaching capacity limit</p>
                    <p class="text-amber-300/80 text-xs mt-0.5">
                      Consider increasing size or lowering error correction level for reliable scanning.
                    </p>
                  </div>
                </div>
  
                <!-- Filename Input -->
                <div class="space-y-2">
                  <Label for="filename" class="text-sm text-zinc-300">Filename</Label>
                  <div class="flex items-center gap-2">
                    <Input
                      id="filename"
                      v-model="fileName"
                      placeholder="qrcode"
                      class="flex-1 bg-zinc-900/50 border-zinc-600 text-zinc-100 placeholder:text-zinc-500"
                    />
                    <span class="text-zinc-400 text-sm">.png / .svg</span>
                  </div>
                </div>
  
                <!-- Download Actions -->
                <div class="grid grid-cols-3 gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          @click="downloadPNG"
                          :disabled="dataInfo.isEmpty || dataInfo.isError"
                          class="w-full bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                        >
                          <Image class="w-4 h-4 mr-2" />
                          PNG
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Download as PNG image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="outline"
                          @click="downloadSVG"
                          :disabled="dataInfo.isEmpty || dataInfo.isError"
                          class="w-full border-zinc-600 text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                        >
                          <FileCode class="w-4 h-4 mr-2" />
                          SVG
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Download as SVG vector</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Button
                          variant="outline"
                          @click="copyToClipboard"
                          :disabled="dataInfo.isEmpty || dataInfo.isError"
                          class="w-full border-zinc-600 text-zinc-200 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                        >
                          <component :is="copiedClipboard ? Check : Clipboard" class="w-4 h-4 mr-2" />
                          {{ copiedClipboard ? 'Copied!' : 'Copy' }}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Copy image to clipboard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
  
                <Separator class="bg-zinc-700" />
  
                <!-- Scan Test Collapsible -->
                <Collapsible v-model:open="scanTestOpen">
                  <CollapsibleTrigger as-child>
                    <Button variant="ghost" class="w-full justify-between px-3 h-10 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50">
                      <span class="flex items-center gap-2 text-sm">
                        <Eye class="w-4 h-4" />
                        Encoded Data Preview
                      </span>
                      <ChevronDown
                        class="w-4 h-4 transition-transform"
                        :class="{ 'rotate-180': scanTestOpen }"
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent class="mt-3">
                    <div class="relative">
                      <pre class="p-4 pr-12 rounded-lg bg-zinc-900 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-all max-h-48 text-zinc-300 border border-zinc-700">{{ qrData || '(empty)' }}</pre>
                      <Button
                        v-if="qrData"
                        variant="ghost"
                        size="sm"
                        @click="copyDataString"
                        class="absolute top-2 right-2 h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                      >
                        <component :is="copied ? Check : Copy" class="w-4 h-4" />
                      </Button>
                    </div>
                    <p class="text-xs text-zinc-500 mt-2">
                      This is the exact string encoded in the QR code. Scan to verify it matches.
                    </p>
                  </CollapsibleContent>
                </Collapsible>
  
                <!-- Info Footer -->
                <div class="text-xs text-zinc-500 space-y-1">
                  <p>• Settings and content are saved automatically</p>
                  <p>• Use higher error correction for printed codes</p>
                  <p>• Transparent backgrounds work best with PNG</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
  
        <!-- Footer -->
        <p class="text-center text-xs text-zinc-500 mt-6">
          QR codes generated entirely in your browser. No data is sent to any server.
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue'
  import { useDebounceFn, useLocalStorage } from '@vueuse/core'
  import { toast } from 'vue-sonner'
  import QRCodeStyling from 'qr-code-styling'
  
  // shadcn/vue components
  import { Card, CardContent } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Textarea } from '@/components/ui/textarea'
  import { Label } from '@/components/ui/label'
  import { Slider } from '@/components/ui/slider'
  import { Switch } from '@/components/ui/switch'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Separator } from '@/components/ui/separator'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip'
  
  // Icons
  import {
    QrCode,
    Copy,
    Check,
    Wifi,
    Type,
    Settings2,
    ChevronDown,
    AlertTriangle,
    RotateCcw,
    Sparkles,
    Minimize2,
    Image,
    FileCode,
    Clipboard,
    Eye
  } from 'lucide-vue-next'
  
  // Default settings
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
  
  // Presets
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
  
  // Reactive state with localStorage persistence
  const inputMode = useLocalStorage('qr-input-mode', 'text')
  const textInput = useLocalStorage('qr-text-input', '')
  const settings = useLocalStorage('qr-settings', { ...defaultSettings })
  
  // Wi-Fi specific fields
  const wifiSsid = useLocalStorage('qr-wifi-ssid', '')
  const wifiPassword = useLocalStorage('qr-wifi-password', '')
  const wifiSecurity = useLocalStorage('qr-wifi-security', 'WPA')
  const wifiHidden = useLocalStorage('qr-wifi-hidden', false)
  
  // Filename for downloads
  const fileName = useLocalStorage('qr-filename', 'qrcode')
  
  // UI state
  const qrContainer = ref(null)
  const qrInstance = ref(null)
  const scanTestOpen = ref(false)
  const copied = ref(false)
  const copiedClipboard = ref(false)
  const activePreset = ref('default')
  
  // Computed: Generate Wi-Fi string
  const wifiString = computed(() => {
    if (!wifiSsid.value) return ''
    const hidden = wifiHidden.value ? 'H:true;' : ''
    const password = wifiPassword.value ? `P:${escapeWifiString(wifiPassword.value)};` : ''
    const security = wifiSecurity.value === 'nopass' ? '' : `T:${wifiSecurity.value};`
    return `WIFI:${security}S:${escapeWifiString(wifiSsid.value)};${password}${hidden};`
  })
  
  // Helper to escape special characters in Wi-Fi strings
  function escapeWifiString(str) {
    return str.replace(/([\\;,:"'])/g, '\\$1')
  }
  
  // Computed: Current data to encode
  const qrData = computed(() => {
    if (inputMode.value === 'wifi') {
      return wifiString.value
    }
    return textInput.value
  })
  
  // Computed: Data length and capacity warnings
  const dataInfo = computed(() => {
    const data = qrData.value
    const len = data.length
    
    // Approximate capacity based on error correction level (for alphanumeric)
    const capacities = {
      L: { max: 4296, warn: 3500 },
      M: { max: 3391, warn: 2800 },
      Q: { max: 2420, warn: 2000 },
      H: { max: 1852, warn: 1500 }
    }
    
    const cap = capacities[settings.value.errorCorrection]
    
    return {
      length: len,
      maxCapacity: cap.max,
      warnThreshold: cap.warn,
      isWarning: len > cap.warn && len <= cap.max,
      isError: len > cap.max,
      isEmpty: len === 0
    }
  })
  
  // Computed: Dot type based on rounding settings
  const dotType = computed(() => {
    if (!settings.value.roundedModules) return 'square'
    const intensity = settings.value.roundingIntensity
    if (intensity < 33) return 'rounded'
    if (intensity < 66) return 'extra-rounded'
    return 'dots'
  })
  
  // Computed: Corner type based on rounding
  const cornerType = computed(() => {
    if (!settings.value.roundedModules) return 'square'
    return settings.value.roundingIntensity > 50 ? 'dot' : 'extra-rounded'
  })
  
  // Generate QR code
  function generateQR() {
    if (!qrContainer.value || !qrData.value) {
      if (qrContainer.value) {
        qrContainer.value.innerHTML = ''
      }
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
      qrOptions: {
        errorCorrectionLevel: settings.value.errorCorrection
      },
      dotsOptions: {
        color: settings.value.fgColor,
        type: dotType.value
      },
      cornersSquareOptions: {
        color: settings.value.fgColor,
        type: cornerType.value
      },
      cornersDotOptions: {
        color: settings.value.fgColor,
        type: settings.value.roundedModules ? 'dot' : 'square'
      },
      backgroundOptions: {
        color: bgColor
      }
    }
  
    qrContainer.value.innerHTML = ''
    qrInstance.value = new QRCodeStyling(options)
    qrInstance.value.append(qrContainer.value)
  }
  
  // Debounced generation for live updates
  const debouncedGenerate = useDebounceFn(generateQR, 150)
  
  // Watch for changes and regenerate
  watch([qrData, settings], () => {
    debouncedGenerate()
  }, { deep: true })
  
  // Download handlers
  async function downloadPNG() {
    if (!qrInstance.value) return
    try {
      const name = fileName.value.trim() || 'qrcode'
      await qrInstance.value.download({
        name: name,
        extension: 'png'
      })
      toast.success(`Downloaded ${name}.png`)
    } catch (err) {
      toast.error('Failed to download PNG')
    }
  }
  
  async function downloadSVG() {
    if (!qrInstance.value) return
    try {
      const name = fileName.value.trim() || 'qrcode'
      await qrInstance.value.download({
        name: name,
        extension: 'svg'
      })
      toast.success(`Downloaded ${name}.svg`)
    } catch (err) {
      toast.error('Failed to download SVG')
    }
  }
  
  async function copyToClipboard() {
    if (!qrInstance.value) return
    try {
      const blob = await qrInstance.value.getRawData('png')
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      copiedClipboard.value = true
      toast.success('QR code copied to clipboard')
      setTimeout(() => { copiedClipboard.value = false }, 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }
  
  async function copyDataString() {
    try {
      await navigator.clipboard.writeText(qrData.value)
      copied.value = true
      toast.success('Data copied to clipboard')
      setTimeout(() => { copied.value = false }, 2000)
    } catch (err) {
      toast.error('Failed to copy')
    }
  }
  
  // Apply preset
  function applyPreset(presetName) {
    const preset = presets[presetName]
    if (preset) {
      settings.value = { ...preset }
      activePreset.value = presetName
      toast.success(`Applied "${presetName}" preset`)
    }
  }
  
  // Reset to defaults
  function resetAll() {
    settings.value = { ...defaultSettings }
    textInput.value = ''
    wifiSsid.value = ''
    wifiPassword.value = ''
    wifiSecurity.value = 'WPA'
    wifiHidden.value = false
    fileName.value = 'qrcode'
    activePreset.value = 'default'
    toast.success('Reset to defaults')
  }
  
  // Initialize on mount
  onMounted(() => {
    nextTick(() => {
      if (qrData.value) {
        generateQR()
      }
    })
  })
  </script>