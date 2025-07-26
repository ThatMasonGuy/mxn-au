import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// --- Constants ---
const ALL_DAYS = [1, 2, 3, 4, 5, 6];
const DAY_LABELS = {
    D1: 'Construction', D2: 'Research', D3: 'Rally',
    D4: 'Hero', D5: 'Training', D6: 'Combat'
};
const COMPARISON_COLORS = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

// Helper to process an array in chunks
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export const useEventDataStore = defineStore('eventData', () => {
    // --- Core state ---
    const isLoaded = ref(false);
    const eventMeta = ref({});
    const players = ref([]);

    // --- UI/Filter state ---
    const searchTerm = ref('');
    const sortField = ref('dynamicTotalRank');
    const sortDirection = ref('asc');
    const activeRoleFilters = ref(['all']);
    const activeCastleFilters = ref(['all']);
    const activePowerFilters = ref(['all']);
    const activeDayFilters = ref([]);
    const lowScoreFilter = ref(false);
    const itemsPerPage = ref(20);
    const page = ref(1);

    // --- Firestore loader (Corrected) ---
    async function loadFromFirestore(eventId) {
        if (!eventId) {
            console.error("No eventId provided to loadFromFirestore.");
            return;
        }
        isLoaded.value = false;
        players.value = [];
        eventMeta.value = {};
        const db = getFirestore();
        
        try {
            // 1. Fetch Event Metadata
            const eventDocRef = doc(db, 'topheroes', 'velaris', 'events', eventId);
            const eventSnap = await getDoc(eventDocRef);

            if (!eventSnap.exists()) {
                console.error(`Event with ID "${eventId}" not found.`);
                eventMeta.value = { eventName: 'Event Not Found', eventId };
                isLoaded.value = true;
                return;
            }
            eventMeta.value = eventSnap.data();

            // 2. Get member IDs from the event document
            const memberIds = eventMeta.value.memberIds || [];
            if (!memberIds.length) {
                console.log("Event has no members.");
                isLoaded.value = true;
                return;
            }

            // 3. Batch-load player data using the logic from your original, working store
            const fetchedPlayers = [];
            const batches = chunkArray(memberIds, 25); // Process in chunks to avoid overwhelming requests
            for (const batch of batches) {
                const batchPromises = batch.map(async (memberId) => {
                    const pRef = doc(db, 'topheroes', 'velaris', 'members', memberId, 'events', eventId);
                    const pSnap = await getDoc(pRef);
                    // Return the document data with its ID, or null if it doesn't exist
                    return pSnap.exists() ? { ...pSnap.data(), id: memberId } : null;
                });
                // Wait for all promises in the batch to resolve and filter out any nulls
                const batchDocs = (await Promise.all(batchPromises)).filter(Boolean);
                fetchedPlayers.push(...batchDocs);
            }

            players.value = fetchedPlayers.map(normalizePlayer);
            
        } catch (error) {
            console.error("Error loading event data from Firestore:", error);
            eventMeta.value = { eventName: 'Error Loading Event', error: error.message };
        } finally {
            isLoaded.value = true;
        }
    }

    // --- Data Normalization ---
    function normalizePlayer(p) {
        const scores = {};
        for (let i = 1; i <= 6; i++) {
            scores[`D${i}`] = Number(p[`scoreD${i}`] ?? 0);
        }
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        const power = Number(p.power ?? 0);

        return {
            ...p, // Spreads the original data, including the 'id'
            scores,
            totalScore,
            power,
            castle: Number(p.castle ?? 0),
            player: p.player ?? 'Unknown',
            role: p.role ?? 'N/A',
            scorePerPower: power > 0 ? totalScore / power : 0,
            overallRank: p.overallRank ?? null,
        };
    }

    // --- Core Computed Properties ---
    const totalPlayers = computed(() => players.value.length);
    const activePlayers = computed(() => players.value.filter(p => p.totalScore > 0).length);
    const totalScoreOverall = computed(() => players.value.reduce((s, p) => s + (p.totalScore || 0), 0));
    const averagePower = computed(() => {
        const active = players.value.filter(p => p.power > 0);
        if (!active.length) return 0;
        const total = active.reduce((s, p) => s + p.power, 0);
        return total / active.length;
    });
    const averageCastle = computed(() => {
        const active = players.value.filter(p => p.castle > 0);
        if (!active.length) return 0;
        const total = active.reduce((s, p) => s + p.castle, 0);
        return Math.round(total / active.length);
    });

    // --- Day-related Helpers ---
    const allDays = computed(() => ALL_DAYS);
    const dayHasData = computed(() => {
        const map = {};
        ALL_DAYS.forEach(day => {
            map[day] = players.value.some(p => p.scores[`D${day}`] > 0);
        });
        return map;
    });
    const dayOptions = computed(() => [
        { label: 'All Days', value: 'all', disabled: false },
        ...ALL_DAYS.map(day => ({
            label: `Day ${day}`,
            value: day,
            disabled: !dayHasData.value[day]
        }))
    ]);

    // --- Filtering, Sorting, and Pagination Logic ---
    const filteredData = computed(() => {
        let data = [...players.value];
        const term = searchTerm.value.trim().toLowerCase();

        if (term) data = data.filter(p => p.player.toLowerCase().includes(term));
        if (!activeRoleFilters.value.includes('all')) data = data.filter(p => activeRoleFilters.value.includes(p.role));
        // Add castle and power filters here if needed...

        if (lowScoreFilter.value) {
            const days = activeDayFilters.value.length > 0 ? activeDayFilters.value : ALL_DAYS;
            data = data.filter(p => days.some(d => (p.scores[`D${d}`] || 0) < 1000000));
        }

        return data;
    });

    const processedFilteredData = computed(() => {
        const days = activeDayFilters.value.length ? activeDayFilters.value : ALL_DAYS;
        return filteredData.value.map(p => {
            const score = days.reduce((s, d) => s + (p.scores[`D${d}`] || 0), 0);
            return {
                ...p,
                dynamicTotalScore: score,
                dynamicTotalRank: 0, // Will be calculated after sorting
                scorePerPower: p.power > 0 ? score / p.power : 0
            };
        }).sort((a, b) => b.dynamicTotalScore - a.dynamicTotalScore)
          .map((p, i) => ({ ...p, dynamicTotalRank: i + 1 })); // Assign rank based on dynamic score
    });

    const filteredAndSortedData = computed(() => {
        const sorted = [...processedFilteredData.value];
        if (sortField.value) {
            sorted.sort((a, b) => {
                let valA = a[sortField.value];
                let valB = b[sortField.value];
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortDirection.value === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                return sortDirection.value === 'asc' ? valA - valB : valB - valA;
            });
        }
        return sorted;
    });

    const paginatedData = computed(() => {
        const start = (page.value - 1) * itemsPerPage.value;
        return filteredAndSortedData.value.slice(start, start + itemsPerPage.value);
    });

    // --- UI Filter Toggle Actions ---
    function toggleFilter(filterRef, value) {
        const filters = filterRef.value;
        if (value === 'all') {
            filterRef.value = ['all'];
        } else if (filters.includes(value)) {
            const index = filters.indexOf(value);
            filters.splice(index, 1);
            if (filters.length === 0) filterRef.value = ['all'];
        } else {
            if (filters.includes('all')) filters.splice(filters.indexOf('all'), 1);
            filters.push(value);
        }
    }
    const toggleRoleFilter = (role) => toggleFilter(activeRoleFilters, role);
    const toggleCastleFilter = (castle) => toggleFilter(activeCastleFilters, castle);
    const togglePowerFilter = (power) => toggleFilter(activePowerFilters, power);
    const toggleDayFilter = (day) => {
        if (day === 'all') {
            activeDayFilters.value = [];
        } else {
            const idx = activeDayFilters.value.indexOf(day);
            if (idx > -1) activeDayFilters.value.splice(idx, 1);
            else {
                activeDayFilters.value.push(day);
                activeDayFilters.value.sort((a, b) => a - b);
            }
        }
        page.value = 1;
    };
    const toggleLowScoreFilter = () => {
        lowScoreFilter.value = !lowScoreFilter.value;
        page.value = 1;
    };

    function updateSort(field) {
        if (sortField.value === field) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortField.value = field;
            sortDirection.value = 'asc';
        }
        page.value = 1;
    }
    
    function formatNumber(num, decimals = 0) {
        const number = Number(num);
        if (isNaN(number)) return '-';
        return number.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        });
    }

    // --- "Top 10" Leaderboards ---
    const topPerformers = computed(() =>
        [...players.value]
            .filter(p => p.totalScore > 0)
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10)
    );
    const efficiencyLeaders = computed(() =>
        [...players.value]
            .filter(p => p.totalScore > 0 && p.power > 0)
            .sort((a, b) => (b.totalScore / b.power) - (a.totalScore / a.power))
            .slice(0, 10)
    );

    // --- Exported API ---
    return {
        isLoaded, eventMeta, players,
        searchTerm, sortField, sortDirection, activeRoleFilters, activeCastleFilters, activePowerFilters, activeDayFilters,
        lowScoreFilter, page, itemsPerPage,
        totalPlayers, activePlayers, totalScoreOverall, averagePower, averageCastle,
        allDays, dayOptions,
        filteredAndSortedData, paginatedData,
        topPerformers, efficiencyLeaders,
        loadFromFirestore,
        toggleRoleFilter, toggleCastleFilter, togglePowerFilter, toggleDayFilter, toggleLowScoreFilter, updateSort, formatNumber,
        DAY_LABELS, COMPARISON_COLORS,
    };
});
