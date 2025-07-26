<template>
    <div class="w-full min-h-screen relative overflow-hidden bg-gray-900">
        <!-- Signup Section with Dark Background Panel -->
        <div class="relative z-10 flex min-h-screen">
            <div
                class="flex flex-col items-center justify-center min-h-screen py-12 px-4 relative bg-gray-900/95 backdrop-blur-xl w-full lg:w-3/5 border-r border-white/10">
                <!-- Animated background elements behind signup panel -->
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
                <div class="w-full max-w-2xl relative">
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

                            <!-- Authenticated user state -->
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

                            <!-- Signup form - only show when not authenticated -->
                            <form v-else class="grid gap-6" @submit.prevent="handleSignUp">
                                <!-- Username -->
                                <div class="grid gap-3">
                                    <Label for="userName" class="text-white/90 font-medium flex items-center gap-2">
                                        <User class="w-4 h-4" />
                                        Username
                                    </Label>
                                    <div class="relative group">
                                        <Input id="userName" type="text" autocomplete="username"
                                            placeholder="AwesomeUser24" required v-model="userName"
                                            :disabled="isLoading"
                                            class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div
                                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                    </div>
                                </div>

                                <!-- First and Last Name -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="grid gap-3">
                                        <Label for="firstName"
                                            class="text-white/90 font-medium flex items-center gap-2">
                                            <User class="w-4 h-4" />
                                            First Name
                                        </Label>
                                        <div class="relative group">
                                            <Input id="firstName" type="text" autocomplete="given-name"
                                                placeholder="John" required v-model="firstName" :disabled="isLoading"
                                                class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid gap-3">
                                        <Label for="lastName" class="text-white/90 font-medium flex items-center gap-2">
                                            <User class="w-4 h-4" />
                                            Last Name
                                        </Label>
                                        <div class="relative group">
                                            <Input id="lastName" type="text" autocomplete="family-name"
                                                placeholder="Appleseed" required v-model="lastName"
                                                :disabled="isLoading"
                                                class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Email -->
                                <div class="grid gap-3">
                                    <Label for="emailAddress" class="text-white/90 font-medium flex items-center gap-2">
                                        <Mail class="w-4 h-4" />
                                        Email
                                    </Label>
                                    <div class="relative group">
                                        <Input id="emailAddress" type="email" autocomplete="email"
                                            placeholder="you@email.com" required v-model="emailAddress"
                                            :disabled="isLoading"
                                            class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div
                                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                    </div>
                                </div>

                                <!-- Country and Phone Number -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div class="grid gap-3">
                                        <Label for="country" class="text-white/90 font-medium flex items-center gap-2">
                                            <Globe class="w-4 h-4" />
                                            Country
                                        </Label>
                                        <div class="relative group">
                                            <Select v-model="selectedCountry" :disabled="isLoading">
                                                <SelectTrigger
                                                    class="bg-white/10 border-white/20 text-white rounded-xl h-12 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <SelectValue placeholder="Select your Country"
                                                        class="text-white/50">
                                                        <span class="text-white">{{ displaySelectedCountry }}</span>
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem v-for="country in countries" :key="country.code"
                                                        :value="country.code">
                                                        {{ country.label }} ({{ country.value }})
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid gap-3">
                                        <Label for="phoneNumber"
                                            class="text-white/90 font-medium flex items-center gap-2">
                                            <Phone class="w-4 h-4" />
                                            Phone Number
                                        </Label>
                                        <div class="relative group">
                                            <span
                                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 text-sm z-10">{{
                                                    callCode || '+61' }}</span>
                                            <Input id="phoneNumber" type="tel" autocomplete="tel"
                                                placeholder="0412 345 678" required v-model="phoneNumber"
                                                :disabled="isLoading"
                                                :class="`bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed ${phonePadding}`" />
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Date of Birth -->
                                <div class="grid gap-3">
                                    <Label for="dateOfBirth" class="text-white/90 font-medium flex items-center gap-2">
                                        <Calendar class="w-4 h-4" />
                                        Date of Birth
                                    </Label>
                                    <div class="relative group">
                                        <Input id="dateOfBirth" type="date" required v-model="dateOfBirth"
                                            :disabled="isLoading"
                                            class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                        <div
                                            class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        </div>
                                    </div>
                                </div>

                                <!-- Password and Confirm Password -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div class="grid gap-3">
                                        <Label for="password" class="text-white/90 font-medium flex items-center gap-2">
                                            <Lock class="w-4 h-4" />
                                            Password
                                        </Label>
                                        <div class="relative group">
                                            <Input id="password" type="password" autocomplete="new-password"
                                                placeholder="Password" required v-model="password" :disabled="isLoading"
                                                class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid gap-3">
                                        <Label for="confirmPassword"
                                            class="text-white/90 font-medium flex items-center gap-2">
                                            <ShieldCheck class="w-4 h-4" />
                                            Confirm Password
                                        </Label>
                                        <div class="relative group">
                                            <Input id="confirmPassword" type="password" autocomplete="new-password"
                                                placeholder="Confirm Password" required v-model="confirmPassword"
                                                :disabled="isLoading"
                                                class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12 px-4 backdrop-blur-sm focus:bg-white/15 focus:border-purple-400/50 transition-all duration-300 group-hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <div
                                                class="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" :disabled="isLoading"
                                    class="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
                                    <UserPlus v-else class="w-4 h-4 mr-2" />
                                    <span class="relative z-10">{{ isLoading ? 'Creating Account...' : 'Create Account'
                                        }}</span>
                                    <div v-if="!isLoading"
                                        class="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    </div>
                                </Button>
                            </form>

                            <!-- At the bottom of the signup form -->
                            <div class="mt-6 text-center text-sm">
                                <span class="text-white/70">Already have an account? </span>
                                <button type="button" :disabled="isLoading"
                                    class="text-purple-300 hover:text-purple-200 font-medium underline decoration-purple-300/50 hover:decoration-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    @click="$emit('switch-to-login')">
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right side image for larger screens -->
            <div class="hidden lg:block lg:w-2/5 relative">
                <div class="fixed top-0 right-0 h-screen w-2/5 overflow-hidden">
                    <transition name="fade" mode="in-out" :enter-active-class="'transition-opacity duration-1000'"
                        :leave-active-class="'transition-opacity duration-1000'" :enter-from-class="'opacity-0'"
                        :leave-to-class="'opacity-0'">
                        <img :key="currentImage" :src="currentImage" alt="Current Image"
                            class="object-cover w-full h-full" loading="lazy" />
                    </transition>
                    <img :src="nextImage" alt="Next Image" class="object-cover w-full h-full absolute inset-0 opacity-0"
                        loading="lazy" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    User,
    Mail,
    Phone,
    Globe,
    Calendar,
    Lock,
    ShieldCheck,
    UserPlus,
    CheckCircle,
    LogOut,
    Loader2
} from 'lucide-vue-next'
import countryList from '@/data/countries.json'
import { signUp, signOut } from '@/auth'
import { useMainStore } from '@/stores/useMainStore'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()

const basePath = '/' + (route.path.split('/')[1] || '')
const isAuthenticated = computed(() => mainStore.isAuthenticated)
const user = computed(() => mainStore.user)

const props = defineProps({
    title: {
        type: String,
        default: 'Create Account'
    },
    subtitle: {
        type: String,
        default: 'Join us today and start your journey with TempestID'
    },
    imageUrls: {
        type: Array,
        default: () => {
            const randomIds = Array.from({ length: 5 }, () => Math.floor(Math.random() * 1000) + 1);
            return randomIds.map(id => `https://picsum.photos/1280/720?random=${id}`);
        }
    }
})

const currentImageIndex = ref(0)
const currentImage = ref(props.imageUrls[0])
const nextImage = ref(props.imageUrls[1])

const firstName = ref('')
const lastName = ref('')
const userName = ref('')
const emailAddress = ref('')
const phoneNumber = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedCountry = ref('')
const dateOfBirth = ref('')
const countries = ref(countryList)
const isLoading = ref(false)
const isLoggingOut = ref(false)

const changeImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % props.imageUrls.length
    const nextIndex = (currentImageIndex.value + 1) % props.imageUrls.length

    currentImage.value = props.imageUrls[currentImageIndex.value]
    nextImage.value = props.imageUrls[nextIndex]
}

onMounted(async () => {
    setInterval(changeImage, 8000)
    if (user) {
        setTimeout(() => {
            const active = document.activeElement
            if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) active.blur()
        }, 0)
    }
})

const countryName = computed(() => {
    const country = countries.value.find((c) => c.code === selectedCountry.value)
    return country ? country.label : ''
})

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

const callCode = computed(() => {
    const country = countries.value.find((c) => c.code === selectedCountry.value)
    return country ? country.value : ''
})

const phonePadding = computed(() => {
    const length = callCode.value.length
    if (length === 2) return 'pl-7'
    if (length === 3) return 'pl-9'
    if (length === 4) return 'pl-11'
    if (length === 5) return 'pl-12'
    if (length === 6) return 'pl-[52px]'
    return 'pl-9'
})

const formattedPhoneNumber = computed(() => {
    if (selectedCountry.value && phoneNumber.value) {
        let formatted = phoneNumber.value.replace(/\s+/g, '')
        if (formatted.startsWith('0')) formatted = formatted.substring(1)
        return `${callCode.value}${formatted}`
    }
    return phoneNumber.value.replace(/\s+/g, '').replace(/^0/, '')
})

const displaySelectedCountry = computed(() => {
    const country = countries.value.find((c) => c.code === selectedCountry.value)
    return country ? `${country.label} (${country.value})` : ''
})

const handleSignUp = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
        await signUp({
            firstName: firstName.value,
            lastName: lastName.value,
            userName: userName.value,
            email: emailAddress.value,
            phoneNumber: formattedPhoneNumber.value,
            countryCode: selectedCountry.value,
            country: countryName.value,
            dateOfBirth: dateOfBirth.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        })

        toast({
            title: 'Account created successfully!',
            description: 'Welcome to TempestID! You can now start using your account.',
            variant: 'success'
        })

        const redirectTo = route.query.redirect || `${basePath}/`
        await router.push(redirectTo)
    } catch (error) {
        let errorMessage = error.message

        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'An account with this email already exists'
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address'
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Email/password accounts are not enabled'
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak'
        }

        toast({
            title: 'Sign up failed',
            description: errorMessage,
            variant: 'error'
        })
    } finally {
        isLoading.value = false
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