<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-600 from-10% backdrop-blur-md text-black shadow-2xl py-3 px-4 h-[--header-height]">
        <nav>
            <div class="flex justify-between">
                <div class="flex justify-between items-center">
                    <img src="@/assets/vue.svg" alt="Logo image"
                        class="h-16 w-16 justify-center items-center object-cover cursor-pointer"
                        @click="$router.push('/')" />
                    <span class="text-3xl font-bold absolute ml-20">{{ currentPageTitle }}</span>
                </div>
                <ul class="flex text-lg items-center font-bold">
                    <li><router-link to="/"><Button class="mr-4">Home</Button></router-link></li>
                    <li><router-link to="/about"><Button class="mr-4">About</Button></router-link></li>
                    <li><router-link to="/contact"><Button class="mr-4">Contact</Button></router-link></li>
                    <li><router-link to="/websites"><Button class="mr-4">Websites</Button></router-link></li>
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
