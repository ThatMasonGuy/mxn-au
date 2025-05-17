<template>
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
        <h1 class="text-3xl font-bold">VLR Admin Panel</h1>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CardLink title="Members" description="View and update player roster"
                to="/topheroes/velaris/admin/members" />
            <CardLink title="Events" description="Log KvK, GR and other chaos" to="/topheroes/velaris/admin/events" />
            <CardLink title="Logs" description="View edit history and admin actions"
                to="/topheroes/velaris/admin/logs" />
        </div>

        <div class="mt-10">
            <h2 class="text-xl font-semibold mb-2">Quick Stats (Coming Soon)</h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Members" :value="95" />
                <StatCard label="R5–R4" :value="9" />
                <StatCard label="Active Players" :value="90" />
                <StatCard label="Retired" :value="7" />
            </div>
        </div>
    </div>
</template>

<script setup>
import CardLink from '@/components/velaris/CardLink.vue'
import StatCard from '@/components/velaris/StatCard.vue'
// You can later pull this data from Firestore
</script>