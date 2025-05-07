<template>
    <div class="w-full lg:grid lg:min-h-screen lg:grid-cols-2 h-screen">
        <div class="flex items-center justify-center py-12 px-4 mx-auto">
            <div class="mx-auto grid w-[350px] gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold mb-6">Sign up</h1>
                    <p class="text-balance text-muted-foreground">
                        Enter your details below to create your account
                    </p>
                </div>
                <!-- Sign up form -->
                <form class="grid gap-4" @submit.prevent="handleSignUp">
                    <div class="grid gap-2">
                        <Label for="userName">Username</Label>
                        <Input id="userName" type="text" autocomplete="username" placeholder="AwesomeUser24" required
                            v-model="userName" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="firstName">First Name</Label>
                            <Input id="firstName" type="text" autocomplete="given-name" placeholder="John" required
                                v-model="firstName" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="lastName">Last Name</Label>
                            <Input id="lastName" type="text" autocomplete="family-name" placeholder="Appleseed" required
                                v-model="lastName" />
                        </div>
                    </div>

                    <div class="grid gap-2">
                        <Label for="emailAddress">Email</Label>
                        <Input id="emailAddress" type="email" autocomplete="email" placeholder="JohnAppleseed@email.com"
                            required v-model="emailAddress" />
                    </div>

                    <!-- Select Country -->
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

                    <!-- Phone Number -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="phoneNumber">Phone Number</Label>
                            <div class="relative">
                                <span
                                    class="absolute left-3 top-[19px] transform -translate-y-1/2 text-gray-500 text-sm">{{
                                    callCode || '+61' }}</span>
                                <Input id="phoneNumber" type="tel" autocomplete="tel" placeholder="0412 345 678"
                                    required v-model="phoneNumber" :class="phonePadding" />
                            </div>
                        </div>
                        <!-- Date of Birth -->
                        <div class="grid gap-2">
                            <Label for="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" required v-model="dateOfBirth"
                                placeholder="DD/MM/YYYY" />
                        </div>
                    </div>

                    <!-- Passwords -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="grid gap-2">
                            <Label for="password">Password</Label>
                            <Input id="password" type="password" autocomplete="new-password" placeholder="Password"
                                required v-model="password" />
                        </div>
                        <div class="grid gap-2">
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" autocomplete="new-password"
                                placeholder="Password" required v-model="confirmPassword" />
                        </div>
                    </div>

                    <Button type="submit" class="w-full">Sign up</Button>
                </form>

                <div class="mt-4 text-center text-sm">
                    Already have an account?
                    <router-link to="/topheroes/admin/login" class="underline">
                        Login
                    </router-link>
                </div>
            </div>
        </div>

        <div class="bg-gray-500 lg:block relative overflow-hidden">
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
import { ref, onMounted, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import countryList from '@/data/countries.json';
import router from '@/router';
import { signUp } from '@/auth';

const currentImage = ref(`https://picsum.photos/1920/1081`);
const nextImage = ref(`https://picsum.photos/1920/1080`);

const firstName = ref('');
const lastName = ref('');
const userName = ref('');
const emailAddress = ref('');
const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedCountry = ref('');
const dateOfBirth = ref(''); // NEW: capture DOB

const countries = ref(countryList);

const phonePadding = computed(() => {
    const countryCodeLength = callCode.value ? callCode.value.length : 0;
    switch (countryCodeLength) {
        case 2:
            return 'pl-7';
        case 3:
            return 'pl-9';
        case 4:
            return 'pl-11';
        case 5:
            return 'pl-12';
        case 6:
            return 'pl-[52px]';
        default:
            return 'pl-9';
    }
});

const callCode = computed(() => {
    const country = countries.value.find((c) => c.code === selectedCountry.value);
    return country ? country.value : '';
});

// Remove leading 0 from phone number, then prepend the call code
const formattedPhoneNumber = computed(() => {
    if (selectedCountry.value && phoneNumber.value) {
        let formattedNumber = phoneNumber.value.replace(/\s+/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
        }
        return `${callCode.value}${formattedNumber}`;
    }
    return phoneNumber.value
        ? phoneNumber.value.replace(/\s+/g, '').replace(/^0/, '')
        : '';
});

// For display in the Select
const displaySelectedCountry = computed(() => {
    const country = countries.value.find((c) => c.code === selectedCountry.value);
    return country ? `${country.label} (${country.value})` : '';
});

const changeImage = () => {
    nextImage.value = `https://picsum.photos/1920/1080`;
    const temp = currentImage.value;
    currentImage.value = nextImage.value;
    nextImage.value = temp;
};

onMounted(() => {
    setInterval(changeImage, 8000);
});

// Our sign-up handler
const handleSignUp = async () => {
    try {
        await signUp(
            firstName.value,
            lastName.value,
            userName.value,
            emailAddress.value,
            formattedPhoneNumber.value,
            selectedCountry.value, // pass the country code
            dateOfBirth.value,     // pass the raw date
            password.value,
            confirmPassword.value
        );

        toast.success('Sign up successful!');
        router.push('/topheroes/admin/home');
    } catch (error) {
        toast.error(error.message || 'Error signing up');
    }
};
</script>