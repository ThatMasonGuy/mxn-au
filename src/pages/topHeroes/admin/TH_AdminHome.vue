<template>
    <div>
        <h1 class="text-center text-3xl font-bold mt-8">Welcome to the Home Page</h1>
        <div v-if="authKey">
            <p class="text-center mt-4">Your Auth Key: {{ authKey }}</p>
        </div>
        <div v-else>
            <p class="text-center mt-4">You are not logged in. Please sign in to view your auth key.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const authKey = ref(null);

onMounted(() => {
    authKey.value = localStorage.getItem('authKey');
});

</script>