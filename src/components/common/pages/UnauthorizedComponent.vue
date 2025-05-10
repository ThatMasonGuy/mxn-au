<template>
    <div :class="wrapperClass">
        <div :class="contentClass">
            <h1 :class="titleClass">{{ title }}</h1>
            <p class="text-lg">{{ message }}</p>

            <div :class="bannerClass" v-if="requiredRole">
                <p>This page requires the <strong>{{ requiredRole }}</strong> role.</p>
            </div>

            <Button @click="goHome" class="mt-4">{{ buttonText }}</Button>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const requiredRole = route.query.role || null
const basePath = '/' + (route.path.split('/')[1] || '')
const toPath = `${basePath}/`

const props = defineProps({
    title: {
        type: String,
        default: '🚫 Access Denied'
    },
    message: {
        type: String,
        default: "You don't have permission to view this page."
    },
    buttonText: {
        type: String,
        default: 'Return Home'
    },
    wrapperClass: {
        type: String,
        default: 'min-h-screen flex items-center justify-center px-4 text-center bg-gradient-to-br from-red-900 via-black to-red-800 text-white'
    },
    contentClass: {
        type: String,
        default: 'max-w-lg space-y-6'
    },
    titleClass: {
        type: String,
        default: 'text-4xl font-extrabold'
    },
    bannerClass: {
        type: String,
        default: 'bg-red-500/20 text-red-300 border border-red-300/30 rounded-lg p-4'
    }
})

const goHome = () => {
    router.push(toPath)
}
</script>