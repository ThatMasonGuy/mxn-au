<template>
    <div class="w-full lg:grid lg:grid-cols-2 min-h-screen">
        <!-- Left: normal content scrolls -->
        <div class="flex items-center justify-center px-4 py-12">
            <div class="w-full max-w-md grid gap-6 relative">
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold mb-6">{{ title }}</h1>
                    <p class="text-balance text-muted-foreground">{{ subtitle }}</p>
                </div>

                <div v-if="isAuthenticated"
                    class="bg-green-900/40 border border-green-400/20 text-green-200 p-4 rounded-lg text-center text-sm">
                    <p>You are already logged in as <strong>{{ user?.email }}</strong>.</p>
                    <Button variant="secondary" class="mt-4" @click="handleLogout">Logout</Button>
                </div>

                <form class="grid gap-4" @submit.prevent="handleSignUp"
                    :class="{ 'pointer-events-none opacity-50': isAuthenticated }">
                    <div class="grid gap-2">
                        <Label for="userName">Username</Label>
                        <Input id="userName" type="text" autocomplete="username" placeholder="AwesomeUser24" required
                            v-model="userName" :tabindex="isAuthenticated ? -1 : 0" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="firstName">First Name</Label>
                            <Input id="firstName" type="text" autocomplete="given-name" placeholder="John" required
                                v-model="firstName" :tabindex="isAuthenticated ? -1 : 0" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lastName">Last Name</Label>
                            <Input id="lastName" type="text" autocomplete="family-name" placeholder="Appleseed" required
                                v-model="lastName" :tabindex="isAuthenticated ? -1 : 0" />
                        </div>
                    </div>

                    <div class="grid gap-2">
                        <Label for="emailAddress">Email</Label>
                        <Input id="emailAddress" type="email" autocomplete="email" placeholder="you@email.com" required
                            v-model="emailAddress" :tabindex="isAuthenticated ? -1 : 0" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="country">Country</Label>
                        <Select v-model="selectedCountry">
                            <SelectTrigger>
                                <SelectValue placeholder="Select your Country" class="text-gray-500">
                                    {{ displaySelectedCountry }}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="country in countries" :key="country.code" :value="country.code">
                                    {{ country.label }} ({{ country.value }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="phoneNumber">Phone Number</Label>
                            <div class="relative">
                                <span
                                    class="absolute left-3 top-[19px] transform -translate-y-1/2 text-gray-500 text-sm">{{
                                    callCode || '+61' }}</span>
                                <Input id="phoneNumber" type="tel" autocomplete="tel" placeholder="0412 345 678"
                                    required v-model="phoneNumber" :class="phonePadding"
                                    :tabindex="isAuthenticated ? -1 : 0" />
                            </div>
                        </div>
                        <div class="grid gap-2">
                            <Label for="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" required v-model="dateOfBirth" placeholder="DD/MM/YYYY"
                                :tabindex="isAuthenticated ? -1 : 0" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="password">Password</Label>
                            <Input id="password" type="password" autocomplete="new-password" placeholder="Password"
                                required v-model="password" :tabindex="isAuthenticated ? -1 : 0" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" autocomplete="new-password"
                                placeholder="Password" required v-model="confirmPassword"
                                :tabindex="isAuthenticated ? -1 : 0" />
                        </div>
                    </div>

                    <Button type="submit" class="w-full">Sign up</Button>
                </form>

                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <RouterLink :to="loginPath" class="underline">Login</RouterLink>
                </div>
            </div>
        </div>

        <div class="hidden lg:block sticky top-0 h-screen w-full overflow-hidden">
            <transition name="fade" mode="in-out" :enter-active-class="'transition-opacity duration-1000'"
                :leave-active-class="'transition-opacity duration-1000'" :enter-from-class="'opacity-0'"
                :leave-to-class="'opacity-0'">
                <img :key="currentImage" :src="currentImage" class="object-cover w-full h-full absolute inset-0" />
            </transition>
            <img :src="nextImage" class="object-cover w-full h-full absolute inset-0 opacity-0" />
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
import countryList from '@/data/countries.json'
import { signUp, getCurrentUser, signOut as logout } from '@/auth'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const router = useRouter()
const route = useRoute()

const basePath = '/' + (route.path.split('/')[1] || '')
const loginPath = `${basePath}/login`
const redirectPath = route.query.redirect || `${basePath}/`

const props = defineProps({
    title: {
        type: String,
        default: 'Sign up'
    },
    subtitle: {
        type: String,
        default: 'Enter your details below to create your account'
    },
    imageUrls: {
        type: Array,
        default: () => [
            'https://picsum.photos/1920/1081',
            'https://picsum.photos/1920/1080'
        ]
    }
})

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

const isAuthenticated = ref(false)
const user = ref(null)

onMounted(async () => {
    setInterval(changeImage, 8000)
    const current = await getCurrentUser()
    if (current) {
        user.value = current
        isAuthenticated.value = true
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
    await logout()
    isAuthenticated.value = false
    user.value = null
    toast({
        title: 'Logged out successfully',
        message: 'You have successfully logged out.',
        type: 'success'
    })
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

const changeImage = () => {
    const temp = currentImage.value
    currentImage.value = nextImage.value
    nextImage.value = temp
}

const handleSignUp = async () => {
    try {
        await signUp(
            firstName.value,
            lastName.value,
            userName.value,
            emailAddress.value,
            formattedPhoneNumber.value,
            selectedCountry.value,
            countryName.value,
            dateOfBirth.value,
            password.value,
            confirmPassword.value
        )
        toast({
            title: 'Sign up successful!',
            message: 'You have successfully signed up.',
            type: 'success'
        })
        router.push(redirectPath)
    } catch (error) {
        toast({
            title: error.message,
            message: 'Please check your inputs and try again.',
            type: 'error'
        })
    }
}
</script>