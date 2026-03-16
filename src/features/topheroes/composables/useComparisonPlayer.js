import { ref, computed, watch } from 'vue';

// Comparison color palette
const COMPARISON_COLORS = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
];

export function useComparisonPlayers(playersSource, max = 10) {
    // --- State ---
    const selected = ref([]);
    const comparisonSearchTerm = ref('');

    // --- Computed Properties ---
    const filteredSearchResults = computed(() => {
        const term = comparisonSearchTerm.value.trim().toLowerCase();
        // The `playersSource` is a ref passed from the component, so we access it with `.value`
        const source = playersSource.value || [];

        // Filter out players already selected
        const availablePlayers = source.filter(
            p => !selected.value.some(sel => sel.id === p.id)
        );

        if (!term) return availablePlayers;

        return availablePlayers.filter(
            p => p.player.toLowerCase().includes(term)
        );
    });

    // --- Actions ---
    function toggle(player) {
        const idx = selected.value.findIndex(p => p.id === player.id);
        if (idx > -1) {
            selected.value.splice(idx, 1);
        } else if (selected.value.length < max) {
            selected.value.push(player);
        }
    }

    function addPlayerToComparisonFromSearch(player) {
        if (selected.value.length < max && !selected.value.some(sel => sel.id === player.id)) {
            selected.value.push(player);
            comparisonSearchTerm.value = '';
        }
    }

    function removePlayerFromComparison(player) {
        const idx = selected.value.findIndex(p => p.id === player.id);
        if (idx > -1) {
            selected.value.splice(idx, 1);
        }
    }

    // --- Keyboard navigation for search results ---
    const searchIndex = ref(-1);
    function handleComparisonSearchKeydown(e) {
        const results = filteredSearchResults.value;
        if (!results.length) return;
        if (e.key === 'ArrowDown') {
            searchIndex.value = Math.min(searchIndex.value + 1, results.length - 1);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            searchIndex.value = Math.max(searchIndex.value - 1, 0);
            e.preventDefault();
        } else if (e.key === 'Enter' && searchIndex.value > -1) {
            addPlayerToComparisonFromSearch(results[searchIndex.value]);
            searchIndex.value = -1;
            e.preventDefault();
        }
    }
    watch(comparisonSearchTerm, () => { searchIndex.value = -1; });

    // --- Average Player Calculation ---
    const averagePlayer = computed(() => {
        const active = selected.value.filter(p => p.totalScore > 0);
        if (!active.length) return null;

        const avg = (field) => active.reduce((sum, p) => sum + (Number(p[field]) || 0), 0) / active.length;

        const avgScores = {};
        for (let i = 1; i <= 6; i++) {
            const dayKey = `D${i}`;
            avgScores[dayKey] = Math.round(active.reduce((sum, p) => sum + (p.scores?.[dayKey] ?? 0), 0) / active.length);
        }

        return {
            id: 'average-player',
            player: 'Average Player',
            power: Number(avg('power').toFixed(2)),
            castle: Math.round(avg('castle')),
            role: 'N/A',
            totalScore: Math.round(avg('totalScore')),
            scorePerPower: Number(avg('scorePerPower').toFixed(2)),
            scores: avgScores
        };
    });

    // --- Color Mapping ---
    const colorMap = computed(() => {
        const map = {};
        selected.value.forEach((p, i) => {
            map[p.id] = COMPARISON_COLORS[i % COMPARISON_COLORS.length];
        });
        return map;
    });

    // --- Chart Highlighting (stubs for ECharts integration) ---
    function highlightSeries(name) {
        // This is where you would dispatch an event to your chart component
        console.log('Highlighting series:', name);
    }
    function downplaySeries() {
        // This is where you would dispatch an event to your chart component
        console.log('Downplaying all series');
    }

    // --- Configuration for UI grids/cards ---
    const comparisonFields = [
        { label: 'Power', key: 'power' },
        { label: 'Castle', key: 'castle' },
        { label: 'Role', key: 'role' },
        { label: 'Total Score', key: 'totalScore' },
        { label: 'Score/Power', key: 'scorePerPower' }
    ];

    // --- Exported API ---
    return {
        selected,
        comparisonSearchTerm,
        filteredSearchResults,
        addPlayerToComparisonFromSearch,
        removePlayerFromComparison,
        toggle,
        averagePlayer,
        colorMap,
        comparisonFields,
        maxComparisonPlayers: max,
        highlightSeries,
        downplaySeries,
        handleComparisonSearchKeydown,
    };
}
