<template>
    <div class="message-composer">
        <!-- Editable Area -->
        <div class="relative">
            <div ref="editorRef" contenteditable="true" @input="handleInput" @keydown="handleKeydown"
                @click="handleClick" @blur="handleBlur" :class="[
                    'w-full min-h-[120px] max-h-[300px] overflow-y-auto px-4 py-3',
                    'bg-zinc-800/50 border border-zinc-700/50 rounded-xl',
                    'text-white placeholder-zinc-500',
                    'focus:outline-none focus:ring-2 focus:ring-violet-500',
                    'whitespace-pre-wrap break-words'
                ]" :data-placeholder="placeholder"></div>

            <!-- Autocomplete Dropdown - Teleported to body to avoid clipping -->
            <Teleport to="body">
                <Transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-75" leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1">
                    <div v-if="showAutocomplete"
                        class="fixed z-[100] w-72 max-h-64 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
                        :style="autocompletePosition">
                        <div class="p-2">
                            <!-- Header for emote picker -->
                            <div v-if="autocompleteType === 'emote'" class="px-3 py-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                                Server Emotes
                            </div>
                            
                            <div v-if="filteredSuggestions.length === 0" class="px-3 py-2 text-sm text-zinc-500">
                                No matches found
                            </div>
                            <button v-for="(suggestion, index) in filteredSuggestions" :key="suggestion.id"
                                @mousedown.prevent="selectSuggestion(suggestion)" :class="[
                                    'w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 transition-colors',
                                    index === selectedIndex ? 'bg-violet-600/20 text-white' : 'text-zinc-300 hover:bg-zinc-800'
                                ]">
                                <!-- Icon based on type -->
                                <div v-if="suggestion.type === 'timestamp'"
                                    class="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <Clock class="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                <div v-else-if="suggestion.type === 'everyone'"
                                    class="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                    <Users class="h-3.5 w-3.5 text-amber-400" />
                                </div>
                                <div v-else-if="suggestion.type === 'here'"
                                    class="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin class="h-3.5 w-3.5 text-green-400" />
                                </div>
                                <div v-else-if="suggestion.type === 'role'" class="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                                    :style="{ backgroundColor: suggestion.color ? suggestion.color + '20' : 'rgb(113 113 122 / 0.2)' }">
                                    <AtSign class="h-3.5 w-3.5" :style="{ color: suggestion.color || '#a1a1aa' }" />
                                </div>
                                <!-- Emote image -->
                                <img v-else-if="suggestion.type === 'emote'" 
                                    :src="suggestion.url" 
                                    :alt="suggestion.name"
                                    class="w-6 h-6 object-contain flex-shrink-0" />

                                <span class="flex-1 truncate">{{ suggestion.type === 'emote' ? `:${suggestion.name}:` : suggestion.name }}</span>

                                <span v-if="suggestion.type === 'timestamp'" class="text-xs text-zinc-500">
                                    Dynamic time
                                </span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </div>

        <!-- Timestamp Config Modal -->
        <Teleport to="body">
            <div v-if="showTimestampConfig"
                class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                @click.self="closeTimestampConfig">
                <div class="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md overflow-hidden">
                    <div class="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2">
                            <Clock class="h-5 w-5 text-violet-400" />
                            Configure Timestamp
                        </h3>
                        <button @click="closeTimestampConfig"
                            class="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <div class="p-4 space-y-4">
                        <!-- Date -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Date</label>
                            <input v-model="timestampConfig.date" type="date"
                                class="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>

                        <!-- Time -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Time</label>
                            <input v-model="timestampConfig.time" type="time"
                                class="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>

                        <!-- Timezone -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Timezone</label>
                            <select v-model="timestampConfig.timezone"
                                class="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                    {{ tz.label }}
                                </option>
                            </select>
                        </div>

                        <!-- Display Format -->
                        <div>
                            <label class="block text-sm font-medium text-zinc-400 mb-2">Display Format</label>
                            <select v-model="timestampConfig.format"
                                class="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                                <option value="R">Relative (in 5 minutes, 2 hours ago)</option>
                                <option value="t">Short Time (4:20 PM)</option>
                                <option value="T">Long Time (4:20:30 PM)</option>
                                <option value="d">Short Date (20/04/2025)</option>
                                <option value="D">Long Date (April 20, 2025)</option>
                                <option value="f">Short Date/Time (April 20, 2025 4:20 PM)</option>
                                <option value="F">Long Date/Time (Friday, April 20, 2025 4:20 PM)</option>
                            </select>
                        </div>

                        <!-- Live Preview -->
                        <div class="p-4 bg-zinc-800/50 border border-zinc-700/30 rounded-xl">
                            <p class="text-xs text-zinc-500 mb-2">Discord Preview:</p>
                            <p class="text-white text-lg font-medium">{{ timestampPreview }}</p>
                            <p class="text-xs text-zinc-500 mt-2">
                                Unix: {{ timestampUnix || 'Not set' }}
                            </p>
                        </div>
                    </div>

                    <div class="p-4 border-t border-zinc-800 flex items-center justify-between">
                        <button @click="removeCurrentTimestamp"
                            class="px-3 py-2 text-red-400 hover:text-red-300 text-sm">
                            Remove
                        </button>
                        <div class="flex items-center gap-2">
                            <button @click="closeTimestampConfig"
                                class="px-4 py-2 text-zinc-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button @click="saveTimestampConfig"
                                class="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-xl text-white font-medium transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Clock, Users, MapPin, AtSign, X, Globe } from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Type your message... Use @ for mentions and : for emotes'
    },
    roles: {
        type: Array,
        default: () => []
    },
    emotes: {
        type: Array,
        default: () => []
    },
    timezone: {
        type: String,
        default: 'Australia/Brisbane'
    }
})

const emit = defineEmits(['update:modelValue', 'update:timestamps'])

const editorRef = ref(null)
const showAutocomplete = ref(false)
const autocompleteQuery = ref('')
const autocompletePosition = ref({ top: '0px', left: '0px' })
const selectedIndex = ref(0)
const mentionStartIndex = ref(-1)
const autocompleteType = ref('mention') // 'mention' or 'emote'

// Timestamp configuration
const showTimestampConfig = ref(false)
const editingTimestampId = ref(null)

// Timezone list (defined early so getDefaultTimestampConfig can use it)
const timezones = [
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
    { value: 'Australia/Adelaide', label: 'Adelaide (ACDT)' },
    { value: 'Australia/Perth', label: 'Perth (AWST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'UTC', label: 'UTC' }
]

// Get default date (today) and time (next hour)
function getDefaultTimestampConfig() {
    const now = new Date()
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
    // Try to get user's timezone from browser, fallback to prop
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Check if browser timezone is in our list, otherwise use prop
    const validTz = timezones.some(tz => tz.value === browserTz) ? browserTz : (props.timezone || 'Australia/Brisbane')
    return {
        date: nextHour.toISOString().split('T')[0],
        time: `${String(nextHour.getHours()).padStart(2, '0')}:00`,
        timezone: validTz,
        format: 'R'
    }
}

const timestampConfig = ref(getDefaultTimestampConfig())

// Store timestamp configs by ID
const timestampConfigs = ref({})
let timestampIdCounter = 0

// Base suggestions for @ mentions
const baseSuggestions = computed(() => [
    { id: 'timestamp', type: 'timestamp', name: 'timestamp', color: null },
    { id: 'everyone', type: 'everyone', name: 'everyone', color: null },
    { id: 'here', type: 'here', name: 'here', color: null },
    ...props.roles.map(role => ({
        id: `role-${role.id}`,
        type: 'role',
        name: role.name,
        color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : null,
        roleId: role.id
    }))
])

// Emote suggestions
const emoteSuggestions = computed(() => 
    props.emotes.map(emote => ({
        id: `emote-${emote.id}`,
        type: 'emote',
        name: emote.name,
        emoteId: emote.id,
        animated: emote.animated,
        url: emote.url
    }))
)

const filteredSuggestions = computed(() => {
    const query = autocompleteQuery.value.toLowerCase()
    
    if (autocompleteType.value === 'emote') {
        if (!query) return emoteSuggestions.value.slice(0, 15)
        return emoteSuggestions.value
            .filter(s => s.name.toLowerCase().includes(query))
            .slice(0, 15)
    } else {
        if (!query) return baseSuggestions.value.slice(0, 10)
        return baseSuggestions.value
            .filter(s => s.name.toLowerCase().includes(query))
            .slice(0, 10)
    }
})

// Calculate the Unix timestamp from config
const timestampUnix = computed(() => {
    try {
        const { date, time, timezone } = timestampConfig.value
        if (!date || !time) return null
        
        // Parse the datetime string
        const [year, month, day] = date.split('-').map(Number)
        const [hours, minutes] = time.split(':').map(Number)
        
        // Create a date object for the target time
        // We need to figure out the offset for the target timezone
        const testDate = new Date(year, month - 1, day, hours, minutes, 0)
        
        // Get the time in the target timezone by formatting and parsing
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
        
        // Get current time in target timezone to calculate offset
        const now = new Date()
        const nowParts = formatter.formatToParts(now)
        const getPartValue = (parts, type) => parseInt(parts.find(p => p.type === type)?.value || '0')
        
        const tzNow = new Date(
            getPartValue(nowParts, 'year'),
            getPartValue(nowParts, 'month') - 1,
            getPartValue(nowParts, 'day'),
            getPartValue(nowParts, 'hour'),
            getPartValue(nowParts, 'minute'),
            getPartValue(nowParts, 'second')
        )
        
        // Offset = local time - timezone time (in ms)
        const offsetMs = now.getTime() - tzNow.getTime()
        
        // Create the target date and apply the offset to get UTC
        const targetLocal = new Date(year, month - 1, day, hours, minutes, 0)
        const targetUtc = new Date(targetLocal.getTime() + offsetMs)
        
        return Math.floor(targetUtc.getTime() / 1000)
    } catch (e) {
        console.error('Timestamp calculation error:', e)
        return null
    }
})

const timestampPreview = computed(() => {
    const unix = timestampUnix.value
    if (!unix) return 'Select date and time'
    
    const targetDate = new Date(unix * 1000)
    const now = new Date()
    const format = timestampConfig.value.format
    
    // Format options for different display types
    switch (format) {
        case 'R': {
            // Relative time
            const diffMs = targetDate - now
            const diffMins = Math.round(diffMs / 60000)
            const diffHours = Math.round(diffMs / 3600000)
            const diffDays = Math.round(diffMs / 86400000)
            
            if (Math.abs(diffMins) < 60) {
                return diffMins >= 0 ? `in ${diffMins} minutes` : `${Math.abs(diffMins)} minutes ago`
            } else if (Math.abs(diffHours) < 24) {
                return diffHours >= 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`
            } else {
                return diffDays >= 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`
            }
        }
        case 't':
            return targetDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        case 'T':
            return targetDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
        case 'd':
            return targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        case 'D':
            return targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        case 'f':
            return targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
                   ' ' + targetDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        case 'F':
            return targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + 
                   ' ' + targetDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        default:
            return targetDate.toLocaleString()
    }
})

// Get the plain text content for storage
function getPlainTextValue() {
    if (!editorRef.value) return ''

    let text = ''
    const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains('mention-chip')) {
                const type = node.dataset.type
                const id = node.dataset.id

                if (type === 'timestamp') {
                    const config = timestampConfigs.value[id]
                    if (config && config.unix) {
                        // Store as {ts:UNIX:FORMAT} - Unix timestamp already calculated
                        text += `{ts:${config.unix}:${config.format}}`
                    } else {
                        text += '@timestamp'
                    }
                } else if (type === 'everyone') {
                    text += '@everyone'
                } else if (type === 'here') {
                    text += '@here'
                } else if (type === 'role') {
                    text += `<@&${node.dataset.roleId}>`
                } else if (type === 'emote') {
                    // Store as :emoteName: - will be resolved at send time
                    text += `:${node.dataset.name}:`
                }
            } else {
                node.childNodes.forEach(walk)
            }
        }
    }

    editorRef.value.childNodes.forEach(walk)
    return text.trim()
}

// Parse stored value back to editor content
function setContentFromValue(value) {
    if (!editorRef.value || !value) {
        if (editorRef.value) editorRef.value.innerHTML = ''
        return
    }

    // Parse new format: {ts:UNIX:FORMAT} - Unix timestamp with format
    let html = value
        .replace(/\{ts:(\d+):([^}]+)\}/g, (match, unix, format) => {
            const id = `ts-${++timestampIdCounter}`
            // Reconstruct date/time from Unix for editing
            const date = new Date(parseInt(unix) * 1000)
            timestampConfigs.value[id] = { 
                unix: parseInt(unix),
                format,
                date: date.toISOString().split('T')[0],
                time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
                timezone: 'UTC' // Display in UTC since we have the Unix timestamp
            }
            // Show formatted time in chip
            const displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            return createChipHtml('timestamp', id, `🕐 ${displayTime}`, true)
        })
        // Legacy format: {timestamp:HH:MM:FORMAT} - for backwards compatibility
        .replace(/\{timestamp:([^:]+):([^}]+)\}/g, (match, time, format) => {
            const id = `ts-${++timestampIdCounter}`
            const today = new Date().toISOString().split('T')[0]
            timestampConfigs.value[id] = { 
                time, 
                format,
                date: today,
                timezone: props.timezone || 'Australia/Brisbane'
            }
            return createChipHtml('timestamp', id, `🕐 ${time}`, true)
        })
        .replace(/@timestamp/g, () => {
            const id = `ts-${++timestampIdCounter}`
            return createChipHtml('timestamp', id, '🕐 timestamp', false)
        })
        .replace(/@everyone/g, () => createChipHtml('everyone', 'everyone', '@everyone', true))
        .replace(/@here/g, () => createChipHtml('here', 'here', '@here', true))
        .replace(/<@&(\d+)>/g, (match, roleId) => {
            const role = props.roles.find(r => r.id === roleId)
            const name = role ? `@${role.name}` : `@role`
            return createChipHtml('role', `role-${roleId}`, name, true, roleId, role?.color)
        })

    editorRef.value.innerHTML = html
}

function createChipHtml(type, id, label, configured, roleId = null, roleColor = null) {
    const colorStyle = roleColor ? `border-color: #${roleColor.toString(16).padStart(6, '0')}40; color: #${roleColor.toString(16).padStart(6, '0')};` : ''
    const configuredClass = configured ? 'bg-violet-500/20 border-violet-500/30' : 'bg-zinc-700/50 border-zinc-600/50'

    return `<span contenteditable="false" class="mention-chip inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-pointer select-none ${configuredClass}" data-type="${type}" data-id="${id}"${roleId ? ` data-role-id="${roleId}"` : ''} style="${colorStyle}">${label}</span>`
}

function handleInput(e) {
    checkForMention()
    emitValue()
}

function emitValue() {
    const value = getPlainTextValue()
    emit('update:modelValue', value)

    // Emit timestamp configs for the parent to use
    emit('update:timestamps', Object.values(timestampConfigs.value))
}

function checkForMention() {
    const selection = window.getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer

    if (textNode.nodeType !== Node.TEXT_NODE) {
        showAutocomplete.value = false
        return
    }

    const text = textNode.textContent
    const cursorPos = range.startOffset
    const beforeCursor = text.slice(0, cursorPos)

    // Check for @ mention trigger
    const atIndex = beforeCursor.lastIndexOf('@')
    // Check for : emote trigger  
    const colonIndex = beforeCursor.lastIndexOf(':')

    // Determine which trigger is more recent and valid
    let triggerIndex = -1
    let triggerType = null
    let triggerChar = ''

    // Check @ trigger
    if (atIndex !== -1 && (atIndex === 0 || beforeCursor[atIndex - 1] === ' ' || beforeCursor[atIndex - 1] === '\n')) {
        const query = beforeCursor.slice(atIndex + 1)
        if (!query.includes(' ') && !query.includes('\n')) {
            triggerIndex = atIndex
            triggerType = 'mention'
            triggerChar = '@'
        }
    }

    // Check : emote trigger (must be at start of word, not end like "word:")
    if (colonIndex !== -1 && colonIndex > triggerIndex) {
        const charBefore = colonIndex > 0 ? beforeCursor[colonIndex - 1] : ' '
        // Only trigger if : is at start of word (after space/newline/start)
        if (charBefore === ' ' || charBefore === '\n' || colonIndex === 0) {
            const query = beforeCursor.slice(colonIndex + 1)
            // Close if space is typed after :
            if (!query.includes(' ') && !query.includes('\n') && !query.includes(':')) {
                triggerIndex = colonIndex
                triggerType = 'emote'
                triggerChar = ':'
            }
        }
    }

    if (triggerIndex === -1 || !triggerType) {
        showAutocomplete.value = false
        return
    }

    autocompleteQuery.value = beforeCursor.slice(triggerIndex + 1)
    autocompleteType.value = triggerType
    mentionStartIndex.value = triggerIndex
    selectedIndex.value = 0

    // Position autocomplete using viewport coordinates (fixed positioning)
    const rect = range.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const dropdownHeight = 256 // max-h-64 = 16rem = 256px
    const dropdownWidth = 288 // w-72 = 18rem = 288px

    // Calculate vertical position - show above if not enough space below
    let top = rect.bottom + 8
    if (top + dropdownHeight > viewportHeight - 20) {
        // Not enough space below, show above
        top = rect.top - dropdownHeight - 8
    }

    // Calculate horizontal position - keep within viewport
    let left = rect.left - 20
    if (left + dropdownWidth > viewportWidth - 20) {
        left = viewportWidth - dropdownWidth - 20
    }
    if (left < 20) {
        left = 20
    }

    autocompletePosition.value = {
        top: `${Math.max(20, top)}px`,
        left: `${left}px`
    }

    showAutocomplete.value = true
}

function handleKeydown(e) {
    if (showAutocomplete.value) {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            selectedIndex.value = Math.min(selectedIndex.value + 1, filteredSuggestions.value.length - 1)
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
        } else if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault()
            if (filteredSuggestions.value[selectedIndex.value]) {
                selectSuggestion(filteredSuggestions.value[selectedIndex.value])
            }
        } else if (e.key === 'Escape') {
            showAutocomplete.value = false
        }
    }
}

function handleClick(e) {
    const chip = e.target.closest('.mention-chip')
    if (chip) {
        const type = chip.dataset.type
        const id = chip.dataset.id

        if (type === 'timestamp') {
            editingTimestampId.value = id
            if (timestampConfigs.value[id]) {
                timestampConfig.value = { ...timestampConfigs.value[id] }
            } else {
                timestampConfig.value = getDefaultTimestampConfig()
            }
            showTimestampConfig.value = true
        }
    }
}

function handleBlur() {
    // Delay to allow click on autocomplete
    setTimeout(() => {
        showAutocomplete.value = false
    }, 150)
}

function selectSuggestion(suggestion) {
    const selection = window.getSelection()
    if (!selection.rangeCount) return

    const range = selection.getRangeAt(0)
    const textNode = range.startContainer

    if (textNode.nodeType !== Node.TEXT_NODE) return

    const text = textNode.textContent
    const cursorPos = range.startOffset
    const beforeCursor = text.slice(0, cursorPos)
    
    // Find the trigger character based on type
    const triggerChar = autocompleteType.value === 'emote' ? ':' : '@'
    const triggerIndex = beforeCursor.lastIndexOf(triggerChar)

    // Create the chip
    let chip
    if (suggestion.type === 'timestamp') {
        const id = `ts-${++timestampIdCounter}`
        chip = document.createElement('span')
        chip.contentEditable = 'false'
        chip.className = 'mention-chip inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-pointer select-none bg-zinc-700/50 border-zinc-600/50'
        chip.dataset.type = 'timestamp'
        chip.dataset.id = id
        chip.textContent = '🕐 timestamp'

        // Open config immediately for new timestamps
        editingTimestampId.value = id
        timestampConfig.value = getDefaultTimestampConfig()
        setTimeout(() => {
            showTimestampConfig.value = true
        }, 50)
    } else if (suggestion.type === 'emote') {
        chip = document.createElement('span')
        chip.contentEditable = 'false'
        chip.className = 'mention-chip emote-chip inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-default select-none bg-zinc-700/30 border-zinc-600/30'
        chip.dataset.type = 'emote'
        chip.dataset.id = suggestion.emoteId
        chip.dataset.name = suggestion.name
        chip.dataset.animated = suggestion.animated ? 'true' : 'false'
        
        // Add emote image
        const img = document.createElement('img')
        img.src = suggestion.url
        img.alt = suggestion.name
        img.className = 'h-5 w-5 object-contain'
        chip.appendChild(img)
        
        const nameSpan = document.createElement('span')
        nameSpan.className = 'text-zinc-400'
        nameSpan.textContent = `:${suggestion.name}:`
        chip.appendChild(nameSpan)
    } else {
        chip = document.createElement('span')
        chip.contentEditable = 'false'
        chip.className = 'mention-chip inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-pointer select-none bg-violet-500/20 border-violet-500/30'
        chip.dataset.type = suggestion.type

        if (suggestion.type === 'role') {
            chip.dataset.id = suggestion.id
            chip.dataset.roleId = suggestion.roleId
            chip.textContent = `@${suggestion.name}`
            if (suggestion.color) {
                chip.style.borderColor = suggestion.color + '40'
                chip.style.color = suggestion.color
            }
        } else {
            chip.dataset.id = suggestion.id
            chip.textContent = `@${suggestion.name}`
        }
    }

    // Replace the trigger text with the chip
    const beforeTrigger = text.slice(0, triggerIndex)
    const afterCursor = text.slice(cursorPos)

    // Create new text nodes
    const beforeTextNode = document.createTextNode(beforeTrigger)
    const afterTextNode = document.createTextNode(' ' + afterCursor)

    // Replace
    const parent = textNode.parentNode
    parent.insertBefore(beforeTextNode, textNode)
    parent.insertBefore(chip, textNode)
    parent.insertBefore(afterTextNode, textNode)
    parent.removeChild(textNode)

    // Move cursor after chip
    const newRange = document.createRange()
    newRange.setStart(afterTextNode, 1)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    showAutocomplete.value = false
    emitValue()
}

function saveTimestampConfig() {
    if (editingTimestampId.value) {
        // Calculate Unix timestamp from date, time, and timezone
        const unix = timestampUnix.value
        
        if (!unix) {
            alert('Please select a valid date and time')
            return
        }
        
        timestampConfigs.value[editingTimestampId.value] = { 
            ...timestampConfig.value,
            unix // Store the pre-calculated Unix timestamp
        }

        // Update chip appearance with formatted time
        const chip = editorRef.value.querySelector(`[data-id="${editingTimestampId.value}"]`)
        if (chip) {
            chip.className = 'mention-chip inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded border text-sm cursor-pointer select-none bg-violet-500/20 border-violet-500/30'
            // Show a nice preview in the chip
            const date = new Date(unix * 1000)
            const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            const displayTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            chip.textContent = `🕐 ${displayDate} ${displayTime}`
        }
    }

    closeTimestampConfig()
    emitValue()
}

function removeCurrentTimestamp() {
    if (editingTimestampId.value) {
        delete timestampConfigs.value[editingTimestampId.value]

        // Remove chip from editor
        const chip = editorRef.value.querySelector(`[data-id="${editingTimestampId.value}"]`)
        if (chip) {
            chip.remove()
        }
    }

    closeTimestampConfig()
    emitValue()
}

function closeTimestampConfig() {
    showTimestampConfig.value = false
    editingTimestampId.value = null
}

// Initialize with value
onMounted(() => {
    if (props.modelValue) {
        setContentFromValue(props.modelValue)
    }
})

// Watch for external value changes
watch(() => props.modelValue, (newVal, oldVal) => {
    // Only update if the change came from outside (not from our own emit)
    const currentVal = getPlainTextValue()
    if (newVal !== currentVal) {
        setContentFromValue(newVal)
    }
})

// Expose methods for parent
defineExpose({
    focus: () => editorRef.value?.focus(),
    clear: () => {
        if (editorRef.value) {
            editorRef.value.innerHTML = ''
            timestampConfigs.value = {}
            emitValue()
        }
    }
})
</script>

<style scoped>
.message-composer [contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: rgb(113 113 122);
    pointer-events: none;
}

.message-composer [contenteditable]:focus:empty:before {
    content: attr(data-placeholder);
}

/* Ensure chips don't break */
.message-composer :deep(.mention-chip) {
    user-select: none;
    white-space: nowrap;
}

.message-composer :deep(.mention-chip:hover) {
    filter: brightness(1.1);
}
</style>