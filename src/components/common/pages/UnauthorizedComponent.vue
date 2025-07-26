<template>
    <div class="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 4s"></div>
            <!-- Floating particles -->
            <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" style="animation-delay: 0s; animation-duration: 4s;"></div>
            <div class="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-300/40 rounded-full animate-ping" style="animation-delay: 2s; animation-duration: 3s;"></div>
            <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-ping" style="animation-delay: 1s; animation-duration: 5s;"></div>
        </div>

        <div class="relative z-10 text-center max-w-md mx-auto">
            <!-- Glass morphism container -->
            <div class="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                <!-- Icon -->
                <div class="w-20 h-20 mx-auto mb-6 bg-orange-500/20 rounded-full flex items-center justify-center border-2 border-orange-400/30">
                    <ShieldX class="w-10 h-10 text-orange-300" />
                </div>

                <h1 class="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {{ title }}
                </h1>
                
                <p class="text-lg text-gray-300 mb-6 leading-relaxed">{{ message }}</p>

                <div class="bg-orange-500/20 text-orange-200 border border-orange-400/30 rounded-xl p-4 mb-8" v-if="requiredRole">
                    <div class="flex items-center gap-2 justify-center">
                        <Info class="w-5 h-5 text-orange-300" />
                        <p>This page requires the <strong class="text-orange-100">{{ requiredRole }}</strong> role to access.</p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <Button 
                        @click="goBack" 
                        v-if="redirectUrl" 
                        class="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 transition-all duration-300"
                    >
                        <ArrowLeft class="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                    <Button 
                        @click="goHome" 
                        class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                        <Home class="w-4 h-4 mr-2" />
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ShieldX, Info, ArrowLeft, Home } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const requiredRole = route.query.role || null
const redirectUrl = route.query.redirect || null

// Dynamic content based on query parameters
const title = computed(() => {
    if (requiredRole) return `${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} Access Required`
    return 'Access Denied'
})

const message = computed(() => {
    if (requiredRole) return `You need ${requiredRole} privileges to view this content.`
    return "You don't have permission to view this page."
})

const goBack = () => {
    if (redirectUrl) {
        router.push(redirectUrl)
    } else {
        router.go(-1)
    }
}

const goHome = () => {
    router.push('/')
}
</script>