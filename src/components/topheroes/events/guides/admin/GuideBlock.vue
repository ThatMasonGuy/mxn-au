<template>
    <div class="text-white">
        <div class="relative">
            <div v-if="!isExpanded" class="text-zinc-400 text-sm">
                <div class="line-clamp-2 opacity-75">
                    {{ getBlockPreview(block) }}
                </div>
            </div>
            <div v-else>
                <component :is="getComponent(block.type)" :block="block" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import TitleSection from './blocks/TitleSection.vue'
import Divider from './blocks/Divider.vue'
import CalloutBox from './blocks/CalloutBox.vue'
import Spacer from './blocks/Spacer.vue'
import TipList from './blocks/TipList.vue'
import WarningBox from './blocks/WarningBox.vue'
import QuoteHighlight from './blocks/QuoteHighlight.vue'
import TimelineSection from './blocks/TimelineSection.vue'
import ItemTable from './blocks/ItemTable.vue'
import HeroImageBanner from './blocks/HeroImageBanner.vue'
import ImageGallery from './blocks/ImageGallery.vue'
import VideoEmbed from './blocks/VideoEmbed.vue'
import Fallback from './blocks/Fallback.vue'

const props = defineProps({
    block: Object,
    isExpanded: Boolean
})

function getBlockPreview(block) {
    switch (block.type) {
        case 'TitleSection': return block.data.title || 'Untitled Section'
        case 'Divider': return `Divider (${block.data.style || 'solid'})`
        case 'CalloutBox': return `${block.data.title || 'Untitled'} - ${block.data.calloutType || 'info'} callout`
        default: return `${block.type} block`
    }
}

function getComponent(type) {
  const components = {
    TitleSection,
    Divider,
    CalloutBox,
    Spacer,
    TipList,
    WarningBox,
    QuoteHighlight,
    TimelineSection,
    ItemTable,
    HeroImageBanner,
    ImageGallery,
    VideoEmbed
  }
  if (!components[type]) console.warn(`Unknown block type: ${type}`)
  return components[type] || Fallback
}
</script>