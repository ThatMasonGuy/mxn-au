<template>
    <LoginPage v-if="login" @switch-to-signup="login = false" />
    <SignUp v-else @switch-to-login="login = true" />
</template>

<script setup>
import { ref } from 'vue'
import LoginPage from '@/shared/components/common/pages/LoginComponent.vue'
import SignUp from '@/shared/components/common/pages/SignUpComponent.vue'

const login = ref(true)
</script>