<template>
    <LoginComponent title="Welcome Back, Goblin" subtitle="Enter your credentials to rejoin the chaos"
     :image-urls="[
            'https://picsum.photos/id/1015/1920/1080',
            'https://picsum.photos/id/1025/1920/1080'
        ]" />
</template>

<script setup>
import LoginComponent from '@/components/common/pages/LoginComponent.vue'
</script>