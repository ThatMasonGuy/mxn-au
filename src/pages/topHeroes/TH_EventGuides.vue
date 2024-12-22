<!-- src/pages/topHeroes/TH_EventGuides.vue -->
<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col relative">
        <div class="absolute inset-0 bg-gray-800 opacity-60 backdrop-blur-lg z-0"></div>
        <TopHeroesHeader class="z-10" />
        <main class="flex-grow container mx-auto px-4 py-8 z-10">
            <h1 class="text-4xl font-bold text-center mb-12">Event Guides</h1>
            <div class="flex justify-center">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <NavCard @click="navigateTo('/topheroes/events/dark-empire-invasion')"
                        image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/445234940_427831276819902_1349053492408655854_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=_en0yWMeUCkQ7kNvgFHODhv&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=AxWUFji6iTs-As_jL30xov3&oh=00_AYDasv0aR-HX_oemRnloNdCPJI-nn_poIhIldKoQIMVfBw&oe=676DB6DE"
                        title="Dark Empire Invasion" text="Find out how many speed-ups you have." />
                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/455812722_484898251113204_1402616799450863597_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0dQyNKJC5jIQ7kNvgEGb81j&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=AzzPFl6Hby8M_WT5MxH5HNa&oh=00_AYCSQBt0W63dZdtAc6ZT4M9coGuFQlHnZeSdlFsnQ58lrQ&oe=676D9483"
                                title="Kingdom Duels" text="Build the best team you can, personalised to you." />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>
                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/422817861_351443091125388_2037123644161672061_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=4K3e5-c6MZcQ7kNvgF3Wp2k&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=AzJd9Ot1McoCVYnW7nsbdZQ&oh=00_AYDvxSUOcKy9WaL1Fcm0-Vsk8kiZFDDemBEAUhYoeOxU1g&oe=676D8B8E"
                                title="Guild Arms Race"
                                text="Learn tips and tricks to beat even the toughest events." />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/435100387_399087123027651_6026442008392122700_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Z0qdTA5Z0fMQ7kNvgEhQFdG&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=A0Xi6ACM7rtD4b4KlDhgK6C&oh=00_AYC0niWKGefSiPCp9ITVDO4SNPMZCgM_vDXXBxfnepRUHQ&oe=676D95BF"
                                title="Ancient Battlefield" text="Not sure if you have enough for that upgrade?" />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/424685068_354613307475033_2985230643094724656_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=njOCGeaoYewQ7kNvgH_8Gvq&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=AQgtWUWAPz-axWVO_O6A7Gd&oh=00_AYC_kbYnJNiwjl4dyiGZrLjwHo52nRsTJhhU_BlxWKtxbg&oe=676DBCFC"
                                title="Guild Boss" text="Learn tips and tricks to beat even the toughest events." />
                            <div class="absolute inset-0 bg-gray-800 opacity-50 rounded-lg"></div>
                        </div>
                        <div class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded">Coming Soon
                        </div>
                    </div>

                    <div class="relative">
                        <div class="relative pointer-events-none">
                            <NavCard
                                image="https://scontent.fbne3-1.fna.fbcdn.net/v/t39.30808-6/453654161_474292128840483_2593531550310496515_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=NHL_NitKKtAQ7kNvgEAFhmF&_nc_zt=23&_nc_ht=scontent.fbne3-1.fna&_nc_gid=Aa4ZXTQ6nMAOtNaZfmJa0Mv&oh=00_AYA3KshLysb3tiWyZ-Rrw3EXNduN59DcI2iAABn_R-S0bQ&oe=676DA86A"
                                title="Fort Contest" text="Learn tips and tricks to beat even the toughest events." />
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