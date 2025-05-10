<template>
    <Unauthorized title="🚷 Restricted Area" message="This section of your personal tools requires elevated access."
        button-text="Return to Personal Home"
        wrapper-class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-tr from-fuchsia-900 to-black text-white"
        banner-class="bg-fuchsia-700/20 text-fuchsia-300 border border-fuchsia-400/30 rounded-lg p-4" />
</template>

<script setup>
import Unauthorized from '@/components/common/pages/UnauthorizedComponent.vue'
</script>