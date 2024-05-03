<template>
    <header class="bg-gray-800 text-white py-3 px-4 h-[--header-height]">
        <nav>
            <div class="flex justify-between">
                <img src="@/assets/vue.svg" alt="Logo image"
                    class="h-16 w-16 drop-shadow-sm justify-center items-center object-cover cursor-pointer"
                    @click="$router.push('/')" />
                <span class="text-3xl font-bold pt-4 ml-4 absolute ml-20">{{ currentPageTitle }}</span>
                <ul class="flex text-lg items-center font-bold">
                    <li><router-link to="/"><Button class="mr-4">Home</Button></router-link></li>
                    <li><router-link to="/about"><Button class="mr-4">About</Button></router-link></li>
                    <li><router-link to="/contact"><Button class="mr-4">Contact</Button></router-link></li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { useRoute } from "vue-router";

export default {
    components: {
        Button,
    },
    setup() {
        const route = useRoute();

        const currentPageTitle = computed(() => {
            return (route.meta && route.meta.title) || 'Default Title';
        });

        onMounted(() => {
            toast.success(`Welcome to ${currentPageTitle.value}`);
        });

        watch(() => route.path, (newPath) => {
            toast.success(`Transitioned to ${currentPageTitle.value}`);
        });

        return {
            currentPageTitle
        };
    }
};
</script>

<style scoped></style>
