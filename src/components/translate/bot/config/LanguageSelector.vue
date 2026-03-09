<template>
    <div :class="[compact ? '' : 'space-y-3']">
        <label v-if="!compact && label" class="block text-sm font-semibold text-white">
            {{ label }}
        </label>
        <p v-if="!compact && description" class="text-sm text-zinc-400 mb-2">
            {{ description }}
        </p>

        <select
            :value="modelValue"
            @change="$emit('update:modelValue', $event.target.value)"
            class="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
        >
            <option value="">Select a language...</option>
            <optgroup 
                v-for="category in languageCategories" 
                :key="category.name"
                :label="category.name"
            >
                <option 
                    v-for="lang in category.languages" 
                    :key="lang.code"
                    :value="lang.code"
                >
                    {{ lang.flag }} {{ lang.name }}
                </option>
            </optgroup>
        </select>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    compact: {
        type: Boolean,
        default: false
    }
})

defineEmits(['update:modelValue'])

const languageCategories = [
    {
        name: 'Popular Languages',
        languages: [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Spanish', flag: '🇪🇸' },
            { code: 'fr', name: 'French', flag: '🇫🇷' },
            { code: 'de', name: 'German', flag: '🇩🇪' },
            { code: 'it', name: 'Italian', flag: '🇮🇹' },
            { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
            { code: 'ru', name: 'Russian', flag: '🇷🇺' },
            { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
            { code: 'ko', name: 'Korean', flag: '🇰🇷' },
            { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
        ]
    },
    {
        name: 'European Languages',
        languages: [
            { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
            { code: 'pl', name: 'Polish', flag: '🇵🇱' },
            { code: 'cs', name: 'Czech', flag: '🇨🇿' },
            { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
            { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
            { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
            { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
            { code: 'da', name: 'Danish', flag: '🇩🇰' },
            { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
            { code: 'el', name: 'Greek', flag: '🇬🇷' },
            { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
        ]
    },
    {
        name: 'Asian Languages',
        languages: [
            { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
            { code: 'th', name: 'Thai', flag: '🇹🇭' },
            { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
            { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
            { code: 'ms', name: 'Malay', flag: '🇲🇾' },
            { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
            { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
            { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
        ]
    },
    {
        name: 'Other Languages',
        languages: [
            { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
            { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
            { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
            { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
            { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
            { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
            { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
            { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
        ]
    }
]
</script>
