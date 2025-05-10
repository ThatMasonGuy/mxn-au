<template>
    <div class="w-full lg:grid lg:grid-cols-2 min-h-screen">
        <div class="flex flex-col items-center justify-center py-12 px-4">
            <div class="w-full max-w-md grid gap-6 relative">
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold mb-6">{{ title }}</h1>
                    <p class="text-balance text-muted-foreground">
                        {{ subtitle }}
                    </p>
                </div>

                <!-- Popover for authenticated user -->
                <div v-if="isAuthenticated"
                    class="bg-green-900/40 border border-green-400/20 text-green-200 p-4 rounded-lg text-center text-sm">
                    <p>You are already logged in as <strong>{{ user?.email }}</strong>.</p>
                    <Button variant="secondary" class="mt-4" @click="handleLogout">Logout</Button>
                </div>

                <form class="grid gap-4" @submit.prevent="handleEmailLogin"
                    :class="{ 'pointer-events-none opacity-50': isAuthenticated }">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" placeholder="example@gmail.com" autocomplete="email"
                            :tabindex="isAuthenticated ? -1 : 0" required v-model="email" />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <RouterLink :to="forgotPasswordPath" class="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </RouterLink>
                        </div>
                        <Input id="password" type="password" placeholder="Password" autocomplete="current-password"
                            :tabindex="isAuthenticated ? -1 : 0" required v-model="password" />
                    </div>
                    <div class="flex items-center -mt-2">
                        <Checkbox id="rememberMe" v-model="rememberMe" />
                        <Label for="rememberMe" class="ml-2">Remember Me</Label>
                    </div>
                    <Button type="submit" class="w-full">
                        Login
                    </Button>
                </form>
                <div class="mt-4 text-center text-sm">
                    Don't have an account?
                    <RouterLink :to="signupPath" class="underline">Sign up</RouterLink>
                </div>
            </div>
        </div>

        <div class="hidden lg:block sticky top-0 h-screen w-full overflow-hidden">
            <transition name="fade" mode="in-out" :enter-active-class="'transition-opacity duration-1000'"
                :leave-active-class="'transition-opacity duration-1000'" :enter-from-class="'opacity-0'"
                :leave-to-class="'opacity-0'">
                <img :key="currentImage" :src="currentImage" alt="Current Image"
                    class="object-cover w-full h-full absolute inset-0" />
            </transition>
            <img :src="nextImage" alt="Next Image" class="object-cover w-full h-full absolute inset-0 opacity-0" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { signIn, getCurrentUser, signOut } from '@/auth'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()
const router = useRouter()
const route = useRoute()

const basePath = '/' + (route.path.split('/')[1] || '')
const signupPath = `${basePath}/signup`
const forgotPasswordPath = `${basePath}/forgot-password`

const props = defineProps({
    title: {
        type: String,
        default: 'Login'
    },
    subtitle: {
        type: String,
        default: 'Enter your email below to login to your account'
    },
    imageUrls: {
        type: Array,
        default: () => [
            'https://picsum.photos/1920/1081',
            'https://picsum.photos/1920/1080'
        ]
    }
})

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isAuthenticated = ref(false)
const user = ref(null)

const currentImage = ref(props.imageUrls[0])
const nextImage = ref(props.imageUrls[1])

const changeImage = () => {
    const temp = currentImage.value
    currentImage.value = nextImage.value
    nextImage.value = temp
}

onMounted(async () => {
    setInterval(changeImage, 8000)

    if (route.query.redirect) {
        toast({
            title: 'Sign in to continue',
            description: 'You need to be signed in to access that page.',
            variant: 'info'
        })
    }

    const current = await getCurrentUser()
    if (current) {
        user.value = current
        isAuthenticated.value = true

        // ✨ Blur active input if already focused
        setTimeout(() => {
            const active = document.activeElement
            if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
                active.blur()
            }
        }, 0)
    }
})

const handleEmailLogin = async () => {
    try {
        const userResult = await signIn(email.value, password.value, rememberMe.value)
        toast({ title: 'Login successful!', description: `Welcome back, ${userResult.email}`, variant: 'success' })

        const redirectTo = route.query.redirect || `${basePath}/`
        router.push(redirectTo)
    } catch (error) {
        toast({ title: 'Login failed!', description: error.message, variant: 'error' })
    }
}

const handleLogout = async () => {
    await signOut()
    isAuthenticated.value = false
    user.value = null
    toast({
        title: 'You have been logged out.',
        description: 'See you soon!',
        variant: 'success'
    })
}
</script>