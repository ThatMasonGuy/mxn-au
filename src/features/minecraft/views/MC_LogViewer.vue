<template>
    <div class="p-6 max-w-full h-screen flex flex-col">
        <h1 class="text-3xl font-bold mb-4">Minecraft Log Viewer 📜</h1>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 mb-4">
            <input v-model="searchTerm" type="text" placeholder="Search logs..."
                class="border p-2 rounded w-full md:w-auto" />
            <select v-model="selectedType" class="border p-2 rounded">
                <option value="">All Types</option>
                <option value="chat">Chat</option>
                <option value="join">Join/Leave</option>
                <option value="error">Errors</option>
                <option value="command">Commands</option>
            </select>
            <Popover>
                <PopoverTrigger class="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">Export</PopoverTrigger>
                <PopoverContent class="w-96">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="font-bold mb-1 block">Line Count</label>
                            <div class="flex items-center gap-2">
                                <input v-model.number="exportLineInput" type="number" min="1"
                                    class="border p-2 rounded w-full" :disabled="exportAll" />
                                <button @click="exportAll = !exportAll"
                                    class="bg-blue-600 text-white px-3 py-1 rounded">
                                    {{ exportAll ? 'Limit' : 'All' }}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="font-bold mb-1 block">Include Types</label>
                            <div class="flex flex-wrap gap-2">
                                <label class="flex items-center gap-1">
                                    <input type="checkbox" value="chat" v-model="exportFilters" /> Chat
                                </label>
                                <label class="flex items-center gap-1">
                                    <input type="checkbox" value="join" v-model="exportFilters" /> Join/Leave
                                </label>
                                <label class="flex items-center gap-1">
                                    <input type="checkbox" value="error" v-model="exportFilters" /> Errors
                                </label>
                                <label class="flex items-center gap-1">
                                    <input type="checkbox" value="command" v-model="exportFilters" /> Commands
                                </label>
                            </div>
                        </div>

                        <button @click="exportLogs"
                            class="bg-green-700 text-white px-4 py-2 rounded mt-2">Download</button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>

        <!-- Log Display -->
        <div ref="logContainer"
            class="bg-gray-900 text-white p-4 rounded overflow-y-auto text-sm font-mono space-y-1 w-full flex-1 relative"
            @scroll.passive="onScroll">
            <div v-if="filteredLogs.length === 0" class="text-center text-gray-400 py-8">
                🪵 No logs found for this filter.
            </div>
            <div v-else v-for="(line, index) in filteredLogs" :key="index" class="border-b border-gray-700 pb-1"
                :class="getLogColor(line)" :style="getLogStyle(line)">
                <span class="log-line">
                    <template v-if="getSourceBadge(line)">
                        <span :class="getSourceBadge(line).class" class="px-2 py-0.5 rounded text-xs font-bold mr-2">{{
                            getSourceBadge(line).label }}</span>
                    </template>
                    <span v-html="highlightPlayer(line)"></span>
                </span>
            </div>
        </div>
        <transition name="fade">
            <button v-show="!autoScroll" @click="jumpToLive" class="fixed bottom-8 right-12 w-12 h-12 flex items-center justify-center
         bg-white/10 backdrop-blur text-white rounded-full shadow-md
         hover:bg-white/20 transition-transform duration-300 hover:scale-110 z-50" title="Jump to Live">
                <ArrowDownIcon class="w-6 h-6 text-white" />
            </button>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui';
import { ArrowDownIcon } from '@heroicons/vue/24/solid';

const logs = ref([]);
const lastLog = ref('');
const searchTerm = ref('');
const selectedType = ref('');
const exportFilters = ref(['chat', 'join', 'error', 'command']);
const exportLineInput = ref(200);
const exportAll = ref(false);
const intervalId = ref(null);
const logContainer = ref(null);
const autoScroll = ref(true);

// debug refs
const debugScrollTop = ref(0);
const debugClientHeight = ref(0);
const debugScrollHeight = ref(0);

const appendNewLogs = async () => {
    try {
        const now = new Date().toISOString();
        const from = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(); // last 3 hours
        const url = `${import.meta.env.VITE_MINECRAFT_AU_SERVER_API}/api/mc/logs?from=${from}&to=${now}&lines=300`;
        const res = await axios.get(url);
        if (res.data && Array.isArray(res.data.logs)) {
            const incomingLogs = res.data.logs;

            if (logs.value.length === 0) {
                logs.value = incomingLogs;
            } else {
                // Find where the old logs end
                const lastIndex = incomingLogs.findIndex(line => line === lastLog.value);
                const newLines = lastIndex === -1
                    ? incomingLogs // Fallback: reload everything
                    : incomingLogs.slice(lastIndex + 1);

                if (newLines.length) {
                    logs.value.push(...newLines);
                }

                // Limit memory usage if needed (optional)
                if (logs.value.length > 1000) {
                    logs.value = logs.value.slice(-1000);
                }
            }

            lastLog.value = logs.value[logs.value.length - 1] ?? '';
        }
    } catch (err) {
        console.error('❌ Failed to fetch logs:', err);
    }
};

const getLogColor = (line) => {
    if (/\b(error|exception|failed)\b/i.test(line)) return 'text-red-400';
    if (/\b(warn|warning)\b/i.test(line)) return 'text-yellow-300';
    if (/\binfo\b/i.test(line)) return 'text-blue-300';
    return 'text-gray-200';
};

const getLogStyle = (line) => {
    const colonIndex = line.indexOf(':');
    const paddingLeft = colonIndex > -1 ? `${colonIndex + 2}ch` : '0';
    return {
        'white-space': 'pre-wrap',
        'word-break': 'break-word',
        'text-indent': `-${paddingLeft}`,
        'padding-left': paddingLeft,
    };
};

const getSourceBadge = (line) => {
    if (line.includes('[DiscordSRV]')) return { label: 'DISCORD', class: 'bg-purple-600 text-white' };
    if (line.includes('Async Chat Thread')) return { label: 'MINECRAFT', class: 'bg-green-600 text-white' };
    if (/issued server command/i.test(line)) return { label: 'COMMAND', class: 'bg-orange-600 text-white' };
    return null;
};

const highlightPlayer = (line) => {
    return line.replace(/<([^>]+)>/g, '<span class="text-cyan-400">&lt;$1&gt;</span>')
        .replace(/\[DiscordSRV\]/g, '<span class="text-purple-400">[DiscordSRV]</span>');
};

const filteredLogs = computed(() => {
    return logs.value.filter(line => {
        const termMatch = searchTerm.value === '' || line.toLowerCase().includes(searchTerm.value.toLowerCase());
        if (selectedType.value === 'chat') return termMatch && (/\[Async Chat Thread/.test(line) || /\[DiscordSRV\] Chat:/.test(line));
        if (selectedType.value === 'join') return termMatch && (/joined the game|left the game/i).test(line);
        if (selectedType.value === 'error') return termMatch && /\b(error|exception|failed)\b/i.test(line);
        if (selectedType.value === 'command') return termMatch && /issued server command/i.test(line);
        return termMatch;
    });
});

const scrollToBottom = () => {
    if (logContainer.value && autoScroll.value) logContainer.value.scrollTop = logContainer.value.scrollHeight;
};

const jumpToLive = () => {
    autoScroll.value = true;
    scrollToBottom();
};

const onScroll = () => {
    const el = logContainer.value;
    if (!el) return;
    debugScrollTop.value = el.scrollTop;
    debugClientHeight.value = el.clientHeight;
    debugScrollHeight.value = el.scrollHeight;

    const isAtBottom = Math.abs(el.scrollTop + el.clientHeight - el.scrollHeight) < 20;
    autoScroll.value = isAtBottom;
};

const exportLogs = async () => {
    const lines = exportAll.value ? 100000 : exportLineInput.value;
    try {
        const url = `${import.meta.env.VITE_MINECRAFT_AU_SERVER_API}/api/mc/logs?lines=${lines}`;
        const res = await axios.get(url);
        let exportData = res.data.logs;
        if (exportFilters.value.length) {
            exportData = exportData.filter(line => {
                return exportFilters.value.some(type => {
                    if (type === 'chat') return /\[Async Chat Thread/.test(line) || /\[DiscordSRV\] Chat:/.test(line);
                    if (type === 'join') return /joined the game|left the game/i.test(line);
                    if (type === 'error') return /\b(error|exception|failed)\b/i.test(line);
                    if (type === 'command') return /issued server command/i.test(line);
                });
            });
        }
        const blob = new Blob([exportData.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `mc-logs-${new Date().toISOString()}.txt`;
        link.click();
    } catch (err) {
        alert("Failed to export logs");
    }
};

onMounted(() => {
    appendNewLogs(); // initial
    intervalId.value = setInterval(() => {
        appendNewLogs().then(() => {
            if (autoScroll.value) scrollToBottom();
        });
    }, 1000);
});


onBeforeUnmount(() => {
    clearInterval(intervalId.value);
});
</script>

<style scoped>
select,
input {
    min-width: 150px;
}

.log-line {
    display: block;
    line-height: 1.4;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>