<template>
    <LoginPage v-if="login" />
    <SignUp v-else />
</template>

<script setup>
import { ref } from 'vue'
import LoginPage from '@/components/common/pages/LoginComponent.vue'
import SignUp from '@/components/common/pages/SignUpComponent.vue'

const login = ref(true)
</script>