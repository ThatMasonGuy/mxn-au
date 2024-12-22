<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col relative">
        <div class="absolute inset-0 bg-gray-800 opacity-60 backdrop-blur-lg z-0"></div>

        <TopHeroesHeader class="z-10" />

        <main class="flex-grow container mx-auto px-4 py-8 z-10">
            <h1 class="text-4xl font-bold text-center mb-12">TopHeroes Assistant</h1>
            <div class="flex justify-center">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NavCard @click="navigateTo('/TopHeroes/SpeedUps')"
                        image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/428645457_368851172717913_6633478444700073678_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=SaEXbkSmJCkQ7kNvgGA9sIQ&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=AKq5ifdP9vtwu_GQCPJ9UdJ&oh=00_AYA231eKNfPQRzMQhFFnS1UQbsp5umoBmyZQsz38PUer3g&oe=676B2616"
                        title="Speed-up Calculator" text="Find out how many speed-ups you have." />

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/422817861_351443091125388_2037123644161672061_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=9SCLMwnFh_QQ7kNvgGSx4KY&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=ATp-xYg1tz3Rs-1S5DgLeO_&oh=00_AYCsDk7xdUSYBpxdKqS5PWlC1eU0wZN9fwT1iHKjsnjzsA&oe=676B20CE"
                                title="Team Builder" text="Build the best team you can, personalised to you." />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://www.hardcoredroid.com/wp-content/upLoads/2024/07/Top-Heroes-mobile-game-1.jpg"
                                title="Resource Calculator" text="Not sure if you have enough for that upgrade?" />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/445234940_427831276819902_1349053492408655854_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=54TSLx9mbzsQ7kNvgFTxLEM&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=A97Rou7w14ZbhDPTTo0Uckb&oh=00_AYD-3d9YumYSe3UCZrQVJAGJ_ZTIJlyGaB8ORBWajj3oBQ&oe=676B13DE"
                                title="Event Guides" text="Learn tips and tricks to beat even the toughest events." />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <TopHeroesFooter class="z-10" />
    </div>
</template>

<script setup>
import router from '@/router.js';
import TopHeroesHeader from '@/components/TopHeroesHeader.vue';
import TopHeroesFooter from '@/components/TopHeroesFooter.vue';
import NavCard from '@/components/NavCard.vue';

const navigateTo = (path) => {
    router.push(path);
};
</script>