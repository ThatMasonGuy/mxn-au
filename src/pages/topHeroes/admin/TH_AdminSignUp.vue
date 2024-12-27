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
                    <div class="grid gap-2">
                        <Label for="country">Country</Label>
                        <Select v-model="selectedCountry">
                            <SelectTrigger>
                                <SelectValue placeholder="Select your Country" class="text-gray-500">{{
                                    displaySelectedCountry }}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="country in countries" :key="country.code" :value="country.code">
                                    {{ country.label }} ({{ country.value }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid gap-2">
                        <Label for="phoneNumber">Phone Number</Label>
                        <div class="relative">
                            <span class="absolute left-3 top-[19px] transform -translate-y-1/2 text-gray-500 text-sm">{{
                                callCode || '+61' }}</span>
                            <Input id="phoneNumber" type="tel" autocomplete="tel" placeholder="0412 345 678" required
                                v-model="phoneNumber" :class="phonePadding" />
                        </div>
                    </div>
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
                    <Button type="submit" class="w-full">
                        Sign up
                    </Button>
                    <!--
                    <Button variant="outline" class="w-full" @click.prevent="handleGoogleSignUp">
                        Sign up with Google
                    </Button>
                    -->
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
import { ref, onMounted, computed, watch } from 'vue';
// import { signInWithGoogle } from '@/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countryList from '@/data/countries.json';

const currentImage = ref(`https://picsum.photos/1920/1081`);
const nextImage = ref(`https://picsum.photos/1920/1080`);
const firstName = ref('');
const lastName = ref('');
const userName = ref('');
const emailAddress = ref('');
const country = ref('');
const phoneNumber = ref('');
const password = ref('');
const confirmPassword = ref('');
const selectedCountry = ref('');
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

const formattedPhoneNumber = computed(() => {
    if (selectedCountry.value && phoneNumber.value) {
        let formattedNumber = phoneNumber.value.replace(/\s+/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = formattedNumber.substring(1);
        }
        return `${callCode.value}${formattedNumber}`;
    }
    return phoneNumber.value ? phoneNumber.value.replace(/\s+/g, '').replace(/^0/, '') : '';
});

const displaySelectedCountry = computed(() => {
    const country = countries.value.find(c => c.code === selectedCountry.value);
    return country ? `${country.label} (${country.value})` : '';
});

const callCode = computed(() => {
    const country = countries.value.find(c => c.code === selectedCountry.value);
    return country ? country.value : '';
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

const handleSignUp = async () => {
    try {
        console.log('Initiating user sign up');
        const response = await axios.post('https://us-central1-maso-au.cloudfunctions.net/createUser', {
            firstName: firstName.value,
            lastName: lastName.value,
            userName: userName.value,
            emailAddress: emailAddress.value,
            country: country.value,
            phoneNumber: formattedPhoneNumber.value,
            password: password.value,
        });
        console.log('Sign up successful', response.data);
        toast.success('Sign up successful! Email verification sent.');
    } catch (error) {
        console.error('Error during sign up:', error);
        toast.error(error.response ? error.response.data : error.message);
    }
};

const handleGoogleSignUp = async () => {
    try {
        console.log('Initiating Google sign up');
        await signInWithGoogle();
        console.log('Google sign up successful');
        toast.success('Sign up successful!');
    } catch (error) {
        console.error('Error during Google sign up:', error);
        toast.error(error.message);
    }
};
</script>