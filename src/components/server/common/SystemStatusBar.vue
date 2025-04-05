<!-- @/components/server/common/SystemStatusBar.vue -->
<template>
    <div class="mt-auto p-4 border-t border-gray-800">
        <h2 class="text-sm uppercase tracking-wider text-gray-400 mb-2">System Status</h2>
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <span class="text-sm">CPU</span>
                <div class="w-32 bg-gray-700 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 45%"></div>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Memory</span>
                <div class="w-32 bg-gray-700 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full" style="width: 72%"></div>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="text-sm">Disk</span>
                <div class="w-32 bg-gray-700 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 28%"></div>
                </div>
            </div>
        </div>
    </div>
</template>