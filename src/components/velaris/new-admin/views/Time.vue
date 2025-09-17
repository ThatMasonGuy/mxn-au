<!-- Time.vue -->
<template>
    <div class="pb-6">
        <!-- Header -->
        <div class="mb-4 lg:mb-6">
            <h1 class="text-xl lg:text-2xl font-semibold text-velaris-purple">Time Management</h1>
            <p class="text-xs lg:text-sm text-foreground/70 mt-1">Generate Discord timestamps and coordinate across
                timezones</p>
        </div>

        <!-- Stats Pills -->
        <div class="mb-4 lg:mb-6 flex flex-wrap items-center gap-2 lg:gap-3">
            <div
                class="inline-flex items-center gap-2 rounded-full bg-velaris-green/15 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-velaris-green">
                <Clock class="h-3 lg:h-4 w-3 lg:w-4" />
                Your Timezone: {{ userTimezone }}
            </div>
            <div
                class="inline-flex items-center gap-2 rounded-full bg-velaris-teal/15 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-velaris-teal">
                <Globe class="h-3 lg:h-4 w-3 lg:w-4" />
                {{ currentLocalTime }}
            </div>
        </div>

        <!-- Discord Timestamp Generator -->
        <section class="mb-6 lg:mb-8">
            <div class="elev-card">
                <!-- Card Header -->
                <div class="mb-4 lg:mb-6">
                    <div class="flex items-center gap-2 lg:gap-3 pb-2 border-b border-border/50">
                        <div
                            class="w-2 lg:w-3 h-4 lg:h-6 rounded-full bg-gradient-to-b from-velaris-purple to-velaris-teal">
                        </div>
                        <MessageSquare class="h-4 lg:h-5 w-4 lg:w-5 text-velaris-purple" />
                        <h3 class="text-base lg:text-lg font-semibold text-foreground">Discord Timestamp Generator</h3>
                        <span
                            class="text-xs lg:text-sm text-foreground/60 bg-card px-2 py-0.5 lg:py-1 rounded-full border border-border/50">
                            Auto-localized
                        </span>
                    </div>
                    <p class="text-xs lg:text-sm text-foreground/60 mt-2">Generate timestamps that automatically display
                        in each user's local timezone</p>
                </div>

                <div class="grid gap-6 xl:grid-cols-2">
                    <!-- Input Section -->
                    <div class="space-y-4 lg:space-y-6">
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-foreground/80">
                                Date & Time
                            </label>
                            <input type="datetime-local" v-model="discordTimestamp.datetime"
                                class="w-full px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all" />
                        </div>

                        <!-- Timezone Custom Dropdown -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-foreground/80">
                                Timezone
                            </label>

                            <!-- Country Filter -->
                            <div class="flex flex-col sm:flex-row gap-2 mb-2">
                                <div class="flex-1 flex items-center gap-2">
                                    <MapPin class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                                    <Select v-model="selectedCountry">
                                        <SelectTrigger class="flex-1">
                                            <SelectValue placeholder="(Optional) Filter by country" />
                                        </SelectTrigger>
                                        <SelectContent class="max-h-80">
                                            <SelectGroup>
                                                <SelectLabel>Country</SelectLabel>
                                                <SelectItem value="all">All countries</SelectItem>
                                                <SelectItem v-for="c in countryOptions" :key="c.code" :value="c.code">
                                                    {{ c.flag }} {{ c.name }} ({{ c.code }})
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Button v-if="selectedCountry && selectedCountry !== 'all'" size="sm"
                                        variant="outline" @click="applyPrimaryForCountry">
                                        Use primary TZ
                                    </Button>
                                </div>
                            </div>

                            <!-- Custom Timezone Dropdown -->
                            <div class="relative">
                                <div class="flex items-center gap-2">
                                    <Globe class="h-4 w-4 text-velaris-teal flex-shrink-0" />
                                    <button @click="toggleTimezoneDropdown" type="button"
                                        class="flex-1 flex items-center justify-between px-3 py-2 bg-background border border-border/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all text-left">
                                        <span class="truncate">{{ selectedTimezoneDisplay }}</span>
                                        <ChevronDown class="h-4 w-4 text-foreground/50 flex-shrink-0 ml-2" />
                                    </button>
                                </div>

                                <!-- Dropdown Panel -->
                                <div v-if="showTimezoneDropdown"
                                    class="absolute z-50 mt-2 w-full max-w-[32rem] bg-background border border-border rounded-lg shadow-lg overflow-hidden">

                                    <!-- Search Bar -->
                                    <div class="p-3 border-b border-border/60 bg-background sticky top-0 z-10">
                                        <div class="relative">
                                            <Search
                                                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                                            <input ref="tzSearchInput" v-model="tzSearchQuery" type="text"
                                                placeholder="Search by city, country, region, or timezone code..."
                                                class="w-full pl-10 pr-3 py-2 bg-card border border-border/60 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50"
                                                @keydown.escape="showTimezoneDropdown = false" />
                                        </div>
                                    </div>

                                    <!-- Timezone List -->
                                    <div class="max-h-[24rem] overflow-y-auto">
                                        <!-- Personal Section -->
                                        <div v-if="!tzSearchQuery" class="border-b border-border/30">
                                            <div
                                                class="px-3 py-2 text-xs font-medium text-foreground/60 uppercase tracking-wide">
                                                Personal
                                            </div>
                                            <button @click="selectTimezone('local')"
                                                class="w-full px-3 py-2 text-left hover:bg-velaris-purple/10 transition-colors flex items-center gap-2">
                                                <User class="h-4 w-4 text-velaris-green" />
                                                <span class="text-sm">Local ({{ userTimezone }})</span>
                                            </button>
                                        </div>

                                        <!-- Country Prioritized -->
                                        <div v-if="!tzSearchQuery && countryTimezones.length > 0"
                                            class="border-b border-border/30">
                                            <div
                                                class="px-3 py-2 text-xs font-medium text-foreground/60 uppercase tracking-wide">
                                                From {{ selectedCountryName }}
                                            </div>
                                            <button v-for="tz in countryTimezones" :key="'country_' + tz.id"
                                                @click="selectTimezone(tz.id)"
                                                class="w-full px-3 py-2 text-left hover:bg-velaris-purple/10 transition-colors">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm truncate">{{ tz.display }}</span>
                                                    <span class="text-xs text-foreground/60 ml-2">{{ tz.offset }}</span>
                                                </div>
                                            </button>
                                        </div>

                                        <!-- Grouped Timezones -->
                                        <div v-for="region in filteredGroupedTimezones" :key="region.name">
                                            <div
                                                class="px-3 py-2 text-xs font-medium text-foreground/60 uppercase tracking-wide sticky top-0 bg-background/95 backdrop-blur-sm">
                                                {{ region.name }}
                                            </div>
                                            <button v-for="tz in region.zones" :key="tz.id"
                                                @click="selectTimezone(tz.id)"
                                                class="w-full px-3 py-2 text-left hover:bg-velaris-purple/10 transition-colors">
                                                <div class="flex items-center justify-between">
                                                    <span class="text-sm truncate">{{ tz.display }}</span>
                                                    <span class="text-xs text-foreground/60 ml-2">{{ tz.offset }}</span>
                                                </div>
                                            </button>
                                        </div>

                                        <!-- No Results -->
                                        <div v-if="tzSearchQuery && filteredGroupedTimezones.length === 0"
                                            class="p-8 text-center text-sm text-foreground/50">
                                            No timezones found matching "{{ tzSearchQuery }}"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-foreground/80">
                                Unix Timestamp
                            </label>
                            <div class="flex items-center gap-2">
                                <input type="text" :value="unixTimestamp" readonly
                                    class="flex-1 px-3 py-2 bg-background/50 border border-border/60 rounded-lg text-sm font-mono text-foreground/80" />
                                <Button @click="copyToClipboard(unixTimestamp.toString())" variant="outline" size="icon"
                                    class="flex-shrink-0">
                                    <Copy class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <!-- Info box for mobile -->
                        <div class="xl:hidden p-3 bg-velaris-teal/10 border border-velaris-teal/30 rounded-lg">
                            <div class="flex items-start gap-2">
                                <Info class="h-4 w-4 text-velaris-teal mt-0.5 flex-shrink-0" />
                                <div class="text-xs text-foreground/70">
                                    Timestamps auto-display in each user's local timezone when posted in Discord
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Preview Section -->
                    <div class="space-y-3 lg:space-y-4">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm font-medium text-foreground/80">Format Previews</span>
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-velaris-green">Click to copy</span>
                                <button @click="showAllFormats = !showAllFormats"
                                    class="text-xs text-velaris-purple hover:text-velaris-teal transition-colors flex items-center gap-1">
                                    <component :is="showAllFormats ? ChevronUp : ChevronDown" class="h-3 w-3" />
                                    {{ showAllFormats ? 'Show less' : `Show all (${timestampFormats.length})` }}
                                </button>
                            </div>
                        </div>

                        <div class="grid gap-2 sm:gap-3">
                            <div v-for="(format, index) in displayedFormats" :key="format.type"
                                @click="copyTimestamp(format.code)"
                                class="group cursor-pointer p-3 lg:p-4 bg-background/50 border border-border/60 rounded-lg hover:border-velaris-purple/50 hover:bg-velaris-purple/5 transition-all active:scale-[0.98]">
                                <div class="flex items-center justify-between mb-2 gap-2">
                                    <span class="text-xs font-medium text-velaris-purple">{{ format.name }}</span>
                                    <code class="text-xs text-foreground/50 font-mono">{{ format.code }}</code>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex-1 min-w-0">
                                        <div class="text-sm text-foreground truncate">{{ format.preview }}</div>
                                        <div class="text-xs text-foreground/50 mt-0.5">{{ format.description }}</div>
                                    </div>
                                    <Copy
                                        class="h-3 w-3 text-foreground/30 group-hover:text-velaris-teal transition-colors flex-shrink-0" />
                                </div>
                            </div>
                        </div>

                        <!-- Desktop-only info box -->
                        <div
                            class="hidden xl:block mt-4 p-3 bg-velaris-teal/10 border border-velaris-teal/30 rounded-lg">
                            <div class="flex items-start gap-2">
                                <Info class="h-4 w-4 text-velaris-teal mt-0.5 flex-shrink-0" />
                                <div class="text-xs text-foreground/70">
                                    These timestamps will automatically display in each user's local timezone when
                                    posted in Discord
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Timeline Coordinator - Coming Soon -->
        <section class="w-full min-w-0">
            <div class="elev-card p-6 lg:p-8">
                <div class="mb-4 lg:mb-6">
                    <div class="flex items-center gap-2 lg:gap-3 pb-2 border-b border-border/50">
                        <div
                            class="w-2 lg:w-3 h-4 lg:h-6 rounded-full bg-gradient-to-b from-velaris-amber to-yellow-500">
                        </div>
                        <Calendar class="h-4 lg:h-5 w-4 lg:w-5 text-velaris-amber" />
                        <h3 class="text-base lg:text-lg font-semibold text-foreground">Timezone Timeline Coordinator
                        </h3>
                        <span
                            class="text-xs lg:text-sm text-foreground/60 bg-velaris-amber/20 px-2 py-0.5 lg:py-1 rounded-full border border-velaris-amber/30">
                            Coming Soon
                        </span>
                    </div>
                </div>

                <!-- Coming Soon Content -->
                <div class="text-center">
                    <div class="relative">
                        <!-- Animated background gradient -->
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-velaris-purple/5 via-velaris-teal/5 to-velaris-amber/5 rounded-2xl animate-pulse py-4">
                        </div>

                        <!-- Content -->
                        <div class="relative py-4">
                            <div class="flex justify-center mb-6">
                                <div class="relative">
                                    <Clock class="w-16 lg:w-20 h-16 lg:h-20 text-velaris-amber/50" />
                                    <div
                                        class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-velaris-purple to-velaris-teal rounded-full flex items-center justify-center">
                                        <Sparkles class="w-3 h-3 text-white" />
                                    </div>
                                </div>
                            </div>

                            <h3 class="text-xl lg:text-2xl font-semibold text-foreground mb-4">
                                Interactive Timeline Coordinator
                            </h3>

                            <p class="text-sm lg:text-base text-foreground/70 mb-6 max-w-2xl mx-auto px-4">
                                We're building an advanced timeline visualization tool that will help you coordinate
                                meetings and events across multiple timezones with interactive selection and real-time
                                conversion.
                            </p>

                            <!-- Feature list -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto mb-8 px-4">
                                <div class="p-4 bg-background/50 border border-border/60 rounded-lg">
                                    <Globe class="w-8 h-8 text-velaris-teal mx-auto mb-3" />
                                    <div class="text-sm font-medium text-foreground mb-1">Multi-timezone View</div>
                                    <div class="text-xs text-foreground/60">View multiple timezones simultaneously</div>
                                </div>

                                <div class="p-4 bg-background/50 border border-border/60 rounded-lg">
                                    <MousePointer class="w-8 h-8 text-velaris-purple mx-auto mb-3" />
                                    <div class="text-sm font-medium text-foreground mb-1">Interactive Selection</div>
                                    <div class="text-xs text-foreground/60">Click and drag to select time ranges</div>
                                </div>

                                <div class="p-4 bg-background/50 border border-border/60 rounded-lg">
                                    <Zap class="w-8 h-8 text-velaris-green mx-auto mb-3" />
                                    <div class="text-sm font-medium text-foreground mb-1">Real-time Conversion</div>
                                    <div class="text-xs text-foreground/60">Instant timezone calculations</div>
                                </div>
                            </div>

                            <!-- Progress indicator -->
                            <div class="flex items-center justify-center gap-2 text-xs text-foreground/50">
                                <div class="w-2 h-2 bg-velaris-green rounded-full animate-pulse"></div>
                                <span>In development</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
    MessageSquare, Clock, Globe, Copy, Info, Calendar,
    Sparkles, MousePointer, Zap, MapPin, User, ChevronDown,
    ChevronUp, Search
} from 'lucide-vue-next'
import { getTimeZones } from '@vvo/tzdb'
import {
    getUserTimezone,
    datetimeLocalToUnixTimestamp,
    getDiscordTimestampFormats,
    getCurrentTimeInTimezone,
    getAllTimezones,
    getTimezoneDisplayName,
    getTimezoneOffsetString,
    getTimezonesByCountry,
    getPrimaryTimezoneForCountry,
} from '@/utils/timezones'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

// Reactive data
const userTimezone = ref(getUserTimezone())
const currentLocalTime = ref('')
const discordTimestamp = ref({
    datetime: new Date().toISOString().slice(0, 16),
    timezone: 'local'
})

// Custom dropdown state
const showTimezoneDropdown = ref(false)
const tzSearchQuery = ref('')
const tzSearchInput = ref(null)

// Collapsible formats state
const showAllFormats = ref(false)

const allTimezones = ref([])
const groupedTimezones = ref([])
const selectedCountry = ref('all')

// Click outside handler
const handleClickOutside = (e) => {
    const dropdown = document.querySelector('.absolute.z-50')
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest('button')) {
        showTimezoneDropdown.value = false
    }
}

onMounted(() => {
    try {
        const names = getAllTimezones()

        // Create a map to dedupe and organize
        const uniqueZones = new Map()
        const regionMap = new Map()

        names.forEach(id => {
            if (!id || typeof id !== 'string') return

            try {
                const display = getTimezoneDisplayName(id)
                const offset = getTimezoneOffsetString(id)

                // Skip if we already have this exact combination
                const key = `${id}-${offset}`
                if (uniqueZones.has(key)) return

                const zone = { id, display, offset }
                uniqueZones.set(key, zone)

                // Determine region from the timezone ID
                const parts = id.split('/')
                let region = 'Other'

                if (parts.length > 1) {
                    region = parts[0]
                    // Clean up region names
                    region = region.replace(/_/g, ' ')

                    // Group some regions together
                    if (region === 'US' || region === 'Canada' || region === 'Mexico' || region === 'Brazil') {
                        region = 'America'
                    } else if (region === 'GB' || region === 'GB-Eire') {
                        region = 'Europe'
                    }
                }

                if (!regionMap.has(region)) {
                    regionMap.set(region, [])
                }
                regionMap.get(region).push(zone)

            } catch (error) {
                console.warn(`Error processing timezone ${id}:`, error)
            }
        })

        // Convert to array and sort
        allTimezones.value = Array.from(uniqueZones.values())
            .sort((a, b) => a.display.localeCompare(b.display))

        // Create grouped structure
        const regionOrder = ['Africa', 'America', 'Antarctica', 'Arctic', 'Asia', 'Atlantic', 'Australia', 'Europe', 'Indian', 'Pacific', 'Other']

        groupedTimezones.value = regionOrder
            .map(region => {
                const zones = regionMap.get(region) || []
                if (zones.length === 0) return null
                return {
                    name: region,
                    zones: zones.sort((a, b) => a.display.localeCompare(b.display))
                }
            })
            .filter(Boolean)

    } catch (error) {
        console.error('Error loading timezones:', error)
        allTimezones.value = []
        groupedTimezones.value = []
    }

    // Add click outside listener
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Toggle dropdown and focus search
const toggleTimezoneDropdown = async () => {
    showTimezoneDropdown.value = !showTimezoneDropdown.value
    if (showTimezoneDropdown.value) {
        tzSearchQuery.value = ''
        await nextTick()
        tzSearchInput.value?.focus()
    }
}

// Select timezone
const selectTimezone = (timezone) => {
    discordTimestamp.value.timezone = timezone
    showTimezoneDropdown.value = false
    tzSearchQuery.value = ''
}

// Computed selected timezone display
const selectedTimezoneDisplay = computed(() => {
    const tz = discordTimestamp.value.timezone
    if (tz === 'local') {
        return `Local (${userTimezone.value})`
    }
    try {
        return getTimezoneDisplayName(tz)
    } catch {
        return tz
    }
})

// Country timezones
const countryTimezones = computed(() => {
    if (!selectedCountry.value || selectedCountry.value === 'all') return []
    try {
        const zones = getTimezonesByCountry(selectedCountry.value)
        return zones
            .filter(z => z && z.id)
            .map(z => {
                try {
                    return {
                        id: z.id,
                        display: getTimezoneDisplayName(z.id),
                        offset: getTimezoneOffsetString(z.id),
                    }
                } catch (error) {
                    console.warn(`Error processing country timezone ${z.id}:`, error)
                    return null
                }
            })
            .filter(Boolean)
    } catch (error) {
        console.error('Error loading country timezones:', error)
        return []
    }
})

// Filtered grouped timezones based on search
const filteredGroupedTimezones = computed(() => {
    const query = tzSearchQuery.value.trim().toLowerCase()

    if (!query) {
        return groupedTimezones.value
    }

    const filtered = []
    const countryHidden = new Set(countryTimezones.value.map(z => z.id))

    for (const region of groupedTimezones.value) {
        const filteredZones = region.zones.filter(zone => {
            // Skip if in country section
            if (countryHidden.has(zone.id)) return false

            // Search in multiple fields
            const searchIn = [
                zone.id.toLowerCase(),
                zone.display.toLowerCase(),
                zone.offset.toLowerCase()
            ]

            // Also search in the city/location part
            const parts = zone.id.split('/')
            if (parts.length > 1) {
                searchIn.push(parts[parts.length - 1].toLowerCase().replace(/_/g, ' '))
            }

            return searchIn.some(text => text.includes(query))
        })

        if (filteredZones.length > 0) {
            filtered.push({
                name: region.name,
                zones: filteredZones
            })
        }
    }

    return filtered
})

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
const countryOptions = computed(() => {
    try {
        const set = new Set()
        getTimeZones().forEach((z) => {
            if (Array.isArray(z.countries) && z.countries.length) {
                z.countries.forEach((c) => set.add(c))
            } else if (z.countryCode) {
                set.add(z.countryCode)
            }
        })
        return Array.from(set)
            .map((code) => {
                try {
                    return {
                        code,
                        name: regionNames.of(code) || code,
                        flag: code.replace(/./g, (c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))),
                    }
                } catch (error) {
                    console.warn(`Error processing country ${code}:`, error)
                    return null
                }
            })
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
        console.error('Error loading countries:', error)
        return []
    }
})

const selectedCountryName = computed(() => {
    if (!selectedCountry.value || selectedCountry.value === 'all') return ''
    const found = countryOptions.value.find((c) => c.code === selectedCountry.value)
    return found ? `${found.flag} ${found.name}` : ''
})

function applyPrimaryForCountry() {
    if (!selectedCountry.value || selectedCountry.value === 'all') return
    try {
        const primary = getPrimaryTimezoneForCountry(selectedCountry.value, 'UTC')
        discordTimestamp.value.timezone = primary
    } catch (error) {
        console.error('Error applying primary timezone:', error)
    }
}

// Update current time every second
let timeInterval = null

const updateCurrentTime = () => {
    try {
        currentLocalTime.value = getCurrentTimeInTimezone(userTimezone.value)
    } catch (error) {
        console.error('Error updating current time:', error)
        currentLocalTime.value = new Date().toLocaleTimeString()
    }
}

// Computed properties
const unixTimestamp = computed(() => {
    try {
        return datetimeLocalToUnixTimestamp(
            discordTimestamp.value.datetime,
            discordTimestamp.value.timezone
        )
    } catch (error) {
        console.error('Error computing unix timestamp:', error)
        return Math.floor(Date.now() / 1000)
    }
})

const timestampFormats = computed(() => {
    try {
        return getDiscordTimestampFormats(unixTimestamp.value)
    } catch (error) {
        console.error('Error computing timestamp formats:', error)
        return []
    }
})

// Displayed formats (collapsible)
const displayedFormats = computed(() => {
    if (showAllFormats.value) {
        return timestampFormats.value
    }
    return timestampFormats.value.slice(0, 2)
})

// Methods
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        toast({
            title: 'Copied!',
            description: 'Text copied to clipboard',
        })
    } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        toast({
            title: 'Copy failed',
            description: 'Unable to copy to clipboard',
            variant: 'destructive',
        })
    }
}

const copyTimestamp = async (code) => {
    await copyToClipboard(code)
}

// Lifecycle
onMounted(() => {
    // Set initial datetime to current time in user's timezone
    const now = new Date()
    discordTimestamp.value.datetime = now.toISOString().slice(0, 16)

    // Start time updates
    updateCurrentTime()
    timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})
</script>

<style scoped>
/* Ensure dropdown doesn't cause horizontal overflow on mobile */
@media (max-width: 640px) {
    .absolute.z-50 {
        max-width: calc(100vw - 2rem);
        left: 0;
        right: 0;
    }
}
</style>