<template>
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-slate-200">
        <!-- Header with intense gradient -->
        <div class="bg-gradient-to-r from-indigo-700 to-purple-800 shadow-xl -mt-28 pt-16">
            <div class="max-w-7xl mx-auto px-6 py-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-white">VLR Admin Panel</h1>
                        <p class="text-indigo-200 mt-1">Manage your kingdom efficiently</p>
                    </div>
                    <div class="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                        <p class="text-white text-sm font-medium">Last login: May 19, 2025</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="max-w-7xl mx-auto px-6 py-12">
            <!-- Quick Access Cards -->
            <div class="mb-12">
                <h2 class="text-xl font-semibold text-slate-100 mb-6">Quick Access</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CardLink title="Members" description="View and update player roster, manage roles and permissions"
                        to="/topheroes/velaris/admin/members" icon="Users" />
                    <CardLink title="Events"
                        description="Log KvK, GR and other kingdom activities with detailed tracking"
                        to="/topheroes/velaris/admin/events" icon="Calendar" />
                    <CardLink title="Logs"
                        description="View complete audit trail of all admin actions and system changes"
                        to="/topheroes/velaris/admin/logs" icon="ClipboardList" />
                </div>
            </div>

            <!-- Kingdom Metrics -->
            <div class="mb-12">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-slate-100">Guild Metrics</h2>
                    <span
                        class="px-3 py-1 bg-indigo-900 text-indigo-300 text-xs font-medium rounded-full border border-indigo-700">Live
                        Data</span>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Members" :value="95" />
                    <StatCard label="R5–R4 Officers" :value="9" />
                    <StatCard label="Active Players" :value="90" />
                    <StatCard label="Turn over" :value="15" />
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-slate-800 rounded-xl shadow-md border border-slate-700 overflow-hidden -mb-12">
                <div class="px-6 py-4 bg-slate-700 border-b border-slate-600">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-slate-100">Recent Activity</h3>
                        <button class="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</button>
                    </div>
                </div>
                <div class="px-6 py-6">
                    <p class="text-slate-400 text-sm italic">Activity feed coming soon...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import CardLink from '@/components/velaris/CardLink.vue'
import StatCard from '@/components/velaris/StatCard.vue'
</script>
