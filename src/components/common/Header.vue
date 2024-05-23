<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg text-black shadow-2xl py-3 px-4 h-[--header-height]">
        <nav>
            <div class="flex justify-between">
                <div class="flex justify-between items-center">
                    <img src="@/assets/vue.svg" alt="Logo image"
                        class="h-16 w-16 justify-center items-center object-cover cursor-pointer"
                        @click="$router.push('/')" />
                    <span class="text-3xl font-bold absolute ml-20 text-[--text-50] drop-shadow-[0_5px_30px_rgba(255,255,255,0.35)]">{{ currentPageTitle }}</span>
                </div>
                <ul class="flex text-md items-center font-bold text-[--text-50]">
                    <li><router-link to="/home"><Button variant="link">Home</Button></router-link></li>
                    <li><router-link to="/about"><Button variant="link">About</Button></router-link></li>
                    <li><router-link to="/contact"><Button variant="link">Contact</Button></router-link></li>
                    <li><router-link to="/websites"><Button variant="link" class="mr-4">Websites</Button></router-link></li>
                    <li><router-link to="/login">
                            <Avatar>
                                <!-- <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" /> -->
                                <AvatarFallback>
                                    <UserCircleIcon class="h-6 w-6" />
                                </AvatarFallback>
                            </Avatar>
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircleIcon } from "@heroicons/vue/24/outline";
import { toast } from "vue-sonner";
import { useRoute } from "vue-router";

export default {
    components: {
        Button,
        Avatar,
        AvatarFallback,
        AvatarImage,
        UserCircleIcon,
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
