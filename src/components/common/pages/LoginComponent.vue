<template>
    <div class="w-full min-h-screen relative overflow-hidden bg-gray-900">
        <!-- Login Section with Dark Background Panel -->
        <div class="relative z-10 lg:grid lg:grid-cols-2 min-h-screen">
            <div
                class="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative bg-gray-900/95 backdrop-blur-xl border-r border-white/10">
                <!-- Animated background elements behind login panel -->
                <div class="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        class="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse">
                    </div>
                    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                        style="animation-delay: 2s"></div>
                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
                        style="animation-delay: 4s"></div>
                    <!-- Floating particles effect -->
                    <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
                        style="animation-delay: 0s; animation-duration: 4s;"></div>
                    <div class="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-300/40 rounded-full animate-ping"
                        style="animation-delay: 2s; animation-duration: 3s;"></div>
                    <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-300/30 rounded-full animate-ping"
                        style="animation-delay: 1s; animation-duration: 5s;"></div>
                    <div class="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white/20 rounded-full animate-ping"
                        style="animation-delay: 3s; animation-duration: 4s;"></div>
                </div>

                <!-- Glass morphism container with enhanced backdrop -->
                <div class="w-full max-w-md relative">
                    <div
                        class="backdrop-blur-xl bg-black/20 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <!-- Subtle gradient overlay -->
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>

                        <div class="relative z-10">
                            <div class="grid gap-2 text-center mb-8">
                                <h1
                                    class="text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                                    Tempest
                                    <span
                                        class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent -ml-2">ID</span>
                                </h1>
                                <h2 class="text-2xl font-semibold text-white/90">{{ title }}</h2>
                                <p class="text-white/70 text-sm leading-relaxed">
                                    {{ subtitle }}
                                </p>
                            </div>

                            <!-- Authenticated user state - replaces form -->
                            <div v-if="isAuthenticated" class="grid gap-6">
                                <div
                                    class="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-100 p-6 rounded-2xl text-center relative overflow-hidden">
                                    <div class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                                    </div>
                                    <div class="relative z-10">
                                        <div
                                            class="w-16 h-16 mx-auto mb-4 bg-green-500/30 rounded-full flex items-center justify-center">
                                            <CheckCircle class="w-8 h-8 text-green-200" />
                                        </div>
                                        <h3 class="text-lg font-semibold mb-2 text-green-100">Already Signed In</h3>
                                        <p class="mb-6 text-green-200/80">You are logged in as</p>
                                        <div class="bg-white/10 rounded-xl p-3 mb-6">
                                            <strong class="text-green-100 text-lg">{{ user?.email }}</strong>
                                        </div>
                                        <Button
                                            class="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 h-12 rounded-xl"
                                            @click="handleLogout" :disabled="isLoggingOut">
                                            <Loader2 v-if="isLoggingOut" class="w-4 h-4 mr-2 animate-spin" />
                                            <LogOut v-else class="w-4 h-4 mr-2" />
                                            {{ isLoggingOut ? 'Signing Out...' : 'Sign Out' }}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <!-- Login form - only show when not authenticated -->
                            <form v-else class="grid gap-6" @submit.prevent="handleEmailLogin">
                                <div class="grid gap-3">
                                    <Label for="email" class="text-white/90 font-medium flex items-center gap-2">
                                        <Mail class="w-4 h-4" />
                                        Email
                                    </Label>
                                    <div class="relative group">
                                        <Input id="email" type="email" placeholder="example@gmail.com"
                                            autocomplete="email" required v-model="email" :disabled="isLoading"
                                            class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div
                                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                    </div>
                                </div>
                                <div class="grid gap-3">
                                    <div class="flex items-center justify-between">
                                        <Label for="password" class="text-white/90 font-medium flex items-center gap-2">
                                            <Lock class="w-4 h-4" />
                                            Password
                                        </Label>
                                        <RouterLink :to="forgotPasswordPath"
                                            class="text-sm text-purple-300 hover:text-purple-200 transition-colors duration-300 underline decoration-purple-300/50 hover:decoration-purple-200">
                                            Forgot your password?
                                        </RouterLink>
                                    </div>
                                    <div class="relative group">
                                        <Input id="password" type="password" placeholder="Password"
                                            autocomplete="current-password" required v-model="password" :disabled="isLoading"
                                            class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div
                                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <Checkbox id="rememberMe" v-model="rememberMe" :disabled="isLoading"
                                        class="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 disabled:opacity-50" />
                                    <Label for="rememberMe"
                                        class="ml-3 text-white/80 cursor-pointer hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        <Shield class="w-4 h-4" />
                                        Remember Me
                                    </Label>
                                </div>
                                <Button type="submit" :disabled="isLoading"
                                    class="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                                    <span class="relative z-10">{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
                                    <div v-if="!isLoading"
                                        class="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                </Button>
                            </form>

                            <!-- At the bottom of the login form -->
                            <div class="mt-6 text-center text-sm">
                                <span class="text-white/70">Don't have an account? </span>
                                <button type="button" :disabled="isLoading"
                                    class="text-purple-300 hover:text-purple-200 font-medium underline decoration-purple-300/50 hover:decoration-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    @click="$emit('switch-to-signup')">
                                    Sign up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty div for image space - images are now full background -->
                <div class="hidden lg:block"></div>
            </div>

            <!-- Right side image for larger screens -->
            <div class="hidden lg:block relative">
                <div class="fixed top-0 right-0 h-screen w-1/2 overflow-hidden">
                    <transition name="fade" mode="in-out" :enter-active-class="'transition-opacity duration-1000'"
                        :leave-active-class="'transition-opacity duration-1000'" :enter-from-class="'opacity-0'"
                        :leave-to-class="'opacity-0'">
                        <img :key="currentImage" :src="currentImage" alt="Current Image" 
                            class="object-cover w-full h-full" loading="lazy" />
                    </transition>
                    <img :src="nextImage" alt="Next Image" 
                        class="object-cover w-full h-full absolute inset-0 opacity-0" loading="lazy" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Lock, Shield, CheckCircle, LogOut, Loader2 } from 'lucide-vue-next'
import { signIn, signOut } from '@/auth'
import { useMainStore } from '@/stores/useMainStore'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()

const basePath = '/' + (route.path.split('/')[1] || '')
const forgotPasswordPath = `${basePath}/forgot-password`
const isAuthenticated = computed(() => mainStore.isAuthenticated)
const user = computed(() => mainStore.user)

const props = defineProps({
    title: {
        type: String,
        default: 'Welcome Back'
    },
    subtitle: {
        type: String,
        default: 'Sign in to your account to continue your journey'
    },
    imageUrls: {
        type: Array,
        default: () => {
            const randomIds = Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000) + 1);
            return randomIds.map(id => `https://picsum.photos/1280/720?random=${id}`);
        }
    }
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const isLoggingOut = ref(false)

const currentImageIndex = ref(0)
const currentImage = ref(props.imageUrls[0])
const nextImage = ref(props.imageUrls[1])

const changeImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.imageUrls.length
    const nextIndex = (currentImageIndex.value + 1) % props.imageUrls.length

    currentImage.value = props.imageUrls[currentImageIndex.value]
    nextImage.value = props.imageUrls[nextIndex]
}

onMounted(async () => {
    setInterval(changeImage, 6000)

    if (route.query.redirect) {
        toast({
            title: 'Sign in to continue',
            description: 'You need to be signed in to access that page.',
            variant: 'info'
        })
    }
})

const handleEmailLogin = async () => {
    if (isLoading.value) return
    
    isLoading.value = true
    try {
        await signIn(email.value, password.value, rememberMe.value)
        
        toast({
            title: 'Welcome back!',
            description: `Successfully signed in`,
            variant: 'success'
        })

        // Handle redirect with fallback
        const redirectTo = route.query.redirect || `${basePath}/`
        await router.push(redirectTo)
    } catch (error) {
        let errorMessage = 'Invalid email or password'
        
        // Handle specific Firebase auth errors
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email'
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address'
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled'
        }
        
        toast({
            title: 'Sign in failed',
            description: errorMessage,
            variant: 'error'
        })
    } finally {
        isLoading.value = false
    }
}

const handleLogout = async () => {
    if (isLoggingOut.value) return
    
    isLoggingOut.value = true
    try {
        await signOut()
        toast({
            title: 'Signed out successfully',
            description: 'See you again soon!',
            variant: 'success'
        })
    } catch (error) {
        toast({
            title: 'Error signing out',
            description: error.message,
            variant: 'error'
        })
    } finally {
        isLoggingOut.value = false
    }
}
</script>

<style scoped>
@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-10px);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
    opacity: 0;
    transform: scale(1.05);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>