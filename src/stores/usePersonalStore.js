// @/stores/usePersonalStore.js
import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import {
    collection,
    doc, onSnapshot, getDoc, setDoc,
    addDoc, deleteDoc, updateDoc, increment, orderBy, query,
    where, limit, getDocs
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useMainStore } from './useMainStore';

export const usePersonalStore = defineStore('personalStore', () => {
    const mainStore = useMainStore();
    const uid = ref(null);
    const logs = ref([]);
    const foodDatabase = ref([]);
    const loadedDates = ref(new Set());
    const hasMoreLogs = ref(true);
    const isLoadingMore = ref(false);
    const userGoals = ref(null);

    watchEffect(() => {
        uid.value = mainStore.user?.uid ?? null;
    });

    const goblinCollection = computed(() => {
        if (!uid.value) return null;

        try {
            const collectionRef = collection(firestore, 'users', uid.value, 'personal', 'goblinTracker', 'logs');
            return collectionRef;
        } catch (error) {
            console.error('[DEBUG] Error creating collection:', error);
            return null;
        }
    });

    // Load global food database on mount
    watchEffect(async () => {
        if (uid.value) {
            await loadFoodDatabase();
            await loadGoals();
        }
    });

    // Initial load - just today and last logged day
    watchEffect(() => {
        if (!uid.value || !goblinCollection.value) {
            console.warn('[DEBUG] Clearing logs due to missing uid or collection');
            logs.value = [];
            loadedDates.value = new Set();
            return;
        }

        if (uid.value) {
            ensureGoblinTrackerDocExists(uid.value)
                .catch(error => {
                    console.error('[DEBUG] Error ensuring tracker doc exists:', error);
                });
        }

        loadInitialLogs();
    });

    async function loadInitialLogs() {
        if (!goblinCollection.value) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Load today's logs
        const q = query(
            goblinCollection.value,
            where('timestamp', '>=', today),
            orderBy('timestamp', 'desc')
        );

        onSnapshot(
            q,
            async snapshot => {
                const todayLogs = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate?.() ?? null
                    };
                });

                logs.value = todayLogs;

                const todayStr = today.toISOString().split('T')[0];
                loadedDates.value.add(todayStr);

                // If no logs today, load the most recent day
                if (todayLogs.length === 0) {
                    await loadLastLoggedDay();
                }
            },
            error => {
                console.error('[DEBUG] Snapshot error:', error);
            }
        );
    }

    async function loadLastLoggedDay() {
        if (!goblinCollection.value) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get the most recent log before today
        const q = query(
            goblinCollection.value,
            where('timestamp', '<', today),
            orderBy('timestamp', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const lastLog = snapshot.docs[0].data();
            const lastDate = lastLog.timestamp?.toDate?.();

            if (lastDate) {
                const dateStart = new Date(lastDate);
                dateStart.setHours(0, 0, 0, 0);
                const dateEnd = new Date(dateStart);
                dateEnd.setDate(dateEnd.getDate() + 1);

                // Load that day's logs
                const dayQuery = query(
                    goblinCollection.value,
                    where('timestamp', '>=', dateStart),
                    where('timestamp', '<', dateEnd),
                    orderBy('timestamp', 'desc')
                );

                const daySnapshot = await getDocs(dayQuery);
                const dayLogs = daySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate?.() ?? null
                    };
                });

                logs.value = [...logs.value, ...dayLogs];
                loadedDates.value.add(dateStart.toISOString().split('T')[0]);
            }
        } else {
            hasMoreLogs.value = false;
        }
    }

    async function loadMoreLogs() {
        if (!goblinCollection.value || isLoadingMore.value || !hasMoreLogs.value) return;

        isLoadingMore.value = true;

        try {
            // Get the oldest loaded date
            const sortedDates = Array.from(loadedDates.value).sort().reverse();
            const oldestLoadedDate = sortedDates[sortedDates.length - 1];

            const oldestDate = new Date(oldestLoadedDate);
            oldestDate.setHours(0, 0, 0, 0);

            // Load 7 days before that
            const weekBefore = new Date(oldestDate);
            weekBefore.setDate(weekBefore.getDate() - 7);

            const q = query(
                goblinCollection.value,
                where('timestamp', '>=', weekBefore),
                where('timestamp', '<', oldestDate),
                orderBy('timestamp', 'desc')
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                hasMoreLogs.value = false;
            } else {
                const newLogs = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate?.() ?? null
                    };
                });

                logs.value = [...logs.value, ...newLogs];

                // Track loaded dates
                newLogs.forEach(log => {
                    if (log.timestamp) {
                        const dateStr = log.timestamp.toISOString().split('T')[0];
                        loadedDates.value.add(dateStr);
                    }
                });
            }
        } catch (error) {
            console.error('[DEBUG] Error loading more logs:', error);
        } finally {
            isLoadingMore.value = false;
        }
    }

    // Group logs by date for daily summaries
    const logsByDate = computed(() => {
        const grouped = new Map();

        logs.value.forEach(log => {
            if (!log.timestamp) return;

            const dateKey = log.timestamp.toISOString().split('T')[0];

            if (!grouped.has(dateKey)) {
                grouped.set(dateKey, []);
            }
            grouped.get(dateKey).push(log);
        });

        return grouped;
    });

    // Calculate daily summaries with macros
    const dailySummaries = computed(() => {
        const summaries = [];

        logsByDate.value.forEach((dayLogs, dateKey) => {
            const summary = {
                date: dateKey,
                dateObj: new Date(dateKey),
                logs: dayLogs,
                totals: {
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    water: 0,
                    sodium: 0,
                    sugar: 0,
                    items: dayLogs.length
                },
                byType: {
                    food: 0,
                    drink: 0,
                    snack: 0,
                    treat: 0,
                    water: 0
                }
            };

            dayLogs.forEach(log => {
                const qty = log.servings || log.quantity || 1;

                // Add up macros (accounting for servings)
                summary.totals.calories += (log.calories || 0) * qty;
                summary.totals.protein += (log.protein || 0) * qty;
                summary.totals.carbs += (log.carbs || 0) * qty;
                summary.totals.fat += (log.fat || 0) * qty;
                summary.totals.sodium += (log.sodium || 0) * qty;
                summary.totals.sugar += (log.sugar || 0) * qty;

                // Water tracking
                if (log.type === 'water') {
                    summary.totals.water += log.waterAmount || 0;
                    summary.byType.water += 1;
                } else if (log.type) {
                    summary.byType[log.type] = (summary.byType[log.type] || 0) + 1;
                }
            });

            summaries.push(summary);
        });

        // Sort by date descending
        return summaries.sort((a, b) => b.dateObj - a.dateObj);
    });

    // Get last 7 days of summaries
    const weekSummary = computed(() => {
        return dailySummaries.value.slice(0, 7);
    });

    // Today's summary
    const todaySummary = computed(() => {
        const today = new Date().toISOString().split('T')[0];
        return dailySummaries.value.find(s => s.date === today) || {
            date: today,
            dateObj: new Date(),
            logs: [],
            totals: { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0, sodium: 0, sugar: 0, items: 0 },
            byType: { food: 0, drink: 0, snack: 0, treat: 0, water: 0 }
        };
    });

    // Progress vs goals for today
    const todayProgress = computed(() => {
        if (!userGoals.value) return null;

        const today = todaySummary.value.totals;
        const goals = userGoals.value;

        return {
            calories: {
                consumed: Math.round(today.calories),
                goal: goals.calories || 0,
                remaining: Math.round((goals.calories || 0) - today.calories),
                percentage: goals.calories ? Math.round((today.calories / goals.calories) * 100) : 0,
                isOver: today.calories > (goals.calories || 0)
            },
            protein: {
                consumed: Math.round(today.protein * 10) / 10,
                goal: goals.protein || 0,
                remaining: Math.round(((goals.protein || 0) - today.protein) * 10) / 10,
                percentage: goals.protein ? Math.round((today.protein / goals.protein) * 100) : 0,
                isOver: today.protein > (goals.protein || 0)
            },
            carbs: {
                consumed: Math.round(today.carbs * 10) / 10,
                goal: goals.carbs || 0,
                remaining: Math.round(((goals.carbs || 0) - today.carbs) * 10) / 10,
                percentage: goals.carbs ? Math.round((today.carbs / goals.carbs) * 100) : 0,
                isOver: today.carbs > (goals.carbs || 0)
            },
            fat: {
                consumed: Math.round(today.fat * 10) / 10,
                goal: goals.fat || 0,
                remaining: Math.round(((goals.fat || 0) - today.fat) * 10) / 10,
                percentage: goals.fat ? Math.round((today.fat / goals.fat) * 100) : 0,
                isOver: today.fat > (goals.fat || 0)
            },
            water: {
                consumed: Math.round(today.water * 10) / 10,
                goal: goals.water || 0,
                remaining: Math.round(((goals.water || 0) - today.water) * 10) / 10,
                percentage: goals.water ? Math.round((today.water / goals.water) * 100) : 0,
                isOver: today.water > (goals.water || 0)
            },
            sodium: {
                consumed: Math.round(today.sodium),
                goal: goals.sodium || 0,
                remaining: Math.round((goals.sodium || 0) - today.sodium),
                percentage: goals.sodium ? Math.round((today.sodium / goals.sodium) * 100) : 0,
                isOver: today.sodium > (goals.sodium || 0)
            }
        };
    });

    async function ensureGoblinTrackerDocExists(currentUid) {
        const trackerRef = doc(firestore, 'users', currentUid, 'personal', 'goblinTracker');
        const snapshot = await getDoc(trackerRef);

        if (!snapshot.exists()) {
            await setDoc(trackerRef, {
                dareCountBig: 0,
                dareCountSmall: 0,
                initializedAt: new Date().toISOString(),
            });
        }
    }

    // Load goals from Firestore
    async function loadGoals() {
        if (!uid.value) return;

        try {
            const goalsRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');
            const snapshot = await getDoc(goalsRef);

            if (snapshot.exists() && snapshot.data().goals) {
                userGoals.value = snapshot.data().goals;
            } else {
                // Set defaults
                userGoals.value = {
                    calories: 2000,
                    protein: 150,
                    carbs: 200,
                    fat: 65,
                    water: 3,
                    sodium: 2300
                };
            }
        } catch (error) {
            console.error('[DEBUG] Error loading goals:', error);
        }
    }

    // Save goals to Firestore
    async function saveGoals(goals) {
        if (!uid.value) return;

        try {
            const trackerRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');
            await setDoc(trackerRef, {
                goals: goals
            }, { merge: true });

            userGoals.value = goals;
        } catch (error) {
            console.error('[DEBUG] Error saving goals:', error);
        }
    }

    // Load global food database for autocomplete
    async function loadFoodDatabase() {
        try {
            const foodRef = collection(firestore, 'foodDatabase');
            const q = query(foodRef, orderBy('timesUsed', 'desc'), limit(200));
            const snapshot = await getDocs(q);

            foodDatabase.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('[DEBUG] Error loading food database:', error);
        }
    }

    // Get food item from global database
    async function getFoodItem(itemName) {
        try {
            const sanitizedName = sanitizeFoodName(itemName);
            const foodRef = doc(firestore, 'foodDatabase', sanitizedName);
            const snapshot = await getDoc(foodRef);

            if (snapshot.exists()) {
                return { id: snapshot.id, ...snapshot.data() };
            }
            return null;
        } catch (error) {
            console.error('[DEBUG] Error getting food item:', error);
            return null;
        }
    }

    // Save or update food item in global database
    async function saveFoodToDatabase(foodData) {
        try {
            const sanitizedName = sanitizeFoodName(foodData.name);
            const foodRef = doc(firestore, 'foodDatabase', sanitizedName);
            const existing = await getDoc(foodRef);

            if (existing.exists()) {
                // Update existing - increment usage
                await updateDoc(foodRef, {
                    timesUsed: increment(1),
                    lastUsed: new Date()
                });

                // If they added a new variant, update variants array
                if (foodData.variant && foodData.calories) {
                    const existingData = existing.data();
                    const variants = existingData.variants || [];

                    // Check if this variant exists
                    const variantIndex = variants.findIndex(v => v.size === foodData.variant);

                    if (variantIndex === -1) {
                        // New variant - add it
                        variants.push({
                            size: foodData.variant,
                            label: foodData.variant,
                            calories: foodData.calories || 0,
                            protein: foodData.protein || 0,
                            carbs: foodData.carbs || 0,
                            fat: foodData.fat || 0,
                            sodium: foodData.sodium || 0,
                            sugar: foodData.sugar || 0
                        });

                        await updateDoc(foodRef, { variants });
                    }
                }
            } else {
                // Create new entry
                const newFood = {
                    name: foodData.name,
                    type: foodData.type || 'food',
                    timesUsed: 1,
                    createdBy: uid.value,
                    createdAt: new Date(),
                    lastUsed: new Date()
                };

                // If has variant data, save as variants
                if (foodData.variant && foodData.calories) {
                    newFood.variants = [{
                        size: foodData.variant,
                        label: foodData.variant,
                        calories: foodData.calories || 0,
                        protein: foodData.protein || 0,
                        carbs: foodData.carbs || 0,
                        fat: foodData.fat || 0,
                        sodium: foodData.sodium || 0,
                        sugar: foodData.sugar || 0
                    }];
                } else if (foodData.calories) {
                    // Simple item without variants
                    newFood.calories = foodData.calories || 0;
                    newFood.protein = foodData.protein || 0;
                    newFood.carbs = foodData.carbs || 0;
                    newFood.fat = foodData.fat || 0;
                    newFood.sodium = foodData.sodium || 0;
                    newFood.sugar = foodData.sugar || 0;
                }

                await setDoc(foodRef, newFood);
            }

            // Reload food database to include new item
            await loadFoodDatabase();
        } catch (error) {
            console.error('[DEBUG] Error saving food to database:', error);
        }
    }

    // Sanitize food name for use as document ID
    function sanitizeFoodName(name) {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async function addGoblinLog(log) {
        if (!uid.value) {
            console.error('[DEBUG] Cannot add log: No user ID');
            return;
        }

        // If the item has macros, save to global food database
        if (log.calories || log.protein || log.carbs || log.fat || log.sodium || log.sugar) {
            await saveFoodToDatabase({
                name: log.item,
                type: log.type,
                variant: log.variant,
                calories: log.calories,
                protein: log.protein,
                carbs: log.carbs,
                fat: log.fat,
                sodium: log.sodium,
                sugar: log.sugar
            });
        }

        const trackerRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');
        await addDoc(goblinCollection.value, log);

        // Keep Dare counter for legacy support
        if (log.item === 'Dare Double Espresso' || log.item === 'Dare Intense Espresso') {
            if (log.variant === '750ml') {
                await updateDoc(trackerRef, { dareCountBig: increment(log.servings || 1) });
            } else if (log.variant === '500ml') {
                await updateDoc(trackerRef, { dareCountSmall: increment(log.servings || 1) });
            }
        }
    }

    async function updateGoblinLog(log) {
        if (!uid.value || !log.id) {
            console.error('[DEBUG] Cannot update log: No user ID or log ID');
            return;
        }

        const logRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker', 'logs', log.id);

        // Create update object without the id field
        const { id, ...updateData } = log;

        await updateDoc(logRef, updateData);
    }

    async function addWaterLog(waterAmount) {
        if (!uid.value) {
            console.error('[DEBUG] Cannot add water log: No user ID');
            return;
        }

        const waterLog = {
            item: 'Water',
            type: 'water',
            waterAmount: waterAmount / 1000, // Convert ml to L
            servings: 1,
            timestamp: new Date(),
            mood: 'neutral',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            sodium: 0,
            sugar: 0
        };

        await addDoc(goblinCollection.value, waterLog);
    }

    async function deleteGoblinLog(log) {
        if (!uid.value) {
            console.error('[DEBUG] Cannot delete log: No user ID');
            return;
        }

        const logRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker', 'logs', log.id);
        const trackerRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');

        await deleteDoc(logRef);

        // Keep Dare counter for legacy support
        if (log.item === 'Dare Double Espresso' || log.item === 'Dare Intense Espresso') {
            if (log.variant === '750ml') {
                await updateDoc(trackerRef, { dareCountBig: increment(-(log.servings || 1)) });
            } else if (log.variant === '500ml') {
                await updateDoc(trackerRef, { dareCountSmall: increment(-(log.servings || 1)) });
            }
        }
    }

    // Search food database
    function searchFoodDatabase(query) {
        if (!query) return foodDatabase.value;
        const lowerQuery = query.toLowerCase();
        return foodDatabase.value.filter(food =>
            food.name.toLowerCase().includes(lowerQuery)
        );
    }

    return {
        uid,
        logs,
        foodDatabase,
        logsByDate,
        dailySummaries,
        weekSummary,
        todaySummary,
        todayProgress,
        hasMoreLogs,
        isLoadingMore,
        userGoals,
        addGoblinLog,
        updateGoblinLog,
        addWaterLog,
        deleteGoblinLog,
        getFoodItem,
        searchFoodDatabase,
        loadFoodDatabase,
        loadMoreLogs,
        loadGoals,
        saveGoals
    };
});