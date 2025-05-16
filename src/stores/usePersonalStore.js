// @/stores/usePersonalStore.js
import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import {
    collection,
    doc, onSnapshot, getDoc, setDoc,
    addDoc, deleteDoc, updateDoc, increment, orderBy, query
} from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useMainStore } from './useMainStore';

export const usePersonalStore = defineStore('personalStore', () => {
    const mainStore = useMainStore();
    const uid = ref(null);
    const logs = ref([]);

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

    // Complex watcher for logs
    watchEffect(() => {
        let unsubscribe = () => { };

        if (!uid.value || !goblinCollection.value) {
            console.warn('[DEBUG] Clearing logs due to missing uid or collection');
            logs.value = [];
            return () => unsubscribe();
        }

        if (uid.value) {
            ensureGoblinTrackerDocExists(uid.value)
                .catch(error => {
                    console.error('[DEBUG] Error ensuring tracker doc exists:', error);
                });
        }

        const q = query(goblinCollection.value, orderBy('timestamp', 'desc'));
        unsubscribe = onSnapshot(
            q,
            snapshot => {
                logs.value = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate?.() ?? null
                    };
                });

            },
            error => {
                console.error('[DEBUG] Snapshot error:', error);
            }
        );

        // Return cleanup function
        return () => unsubscribe();
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

    async function addGoblinLog(log) {
        if (!uid.value) {
            console.error('[DEBUG] Cannot add log: No user ID');
            return;
        }

        const trackerRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');
        await addDoc(goblinCollection.value, log);

        if (log.item === 'Dare Double Espresso (750ml)') {
            await updateDoc(trackerRef, { dareCountBig: increment(log.quantity) });
        } else if (log.item === 'Dare Double Espresso (500ml)') {
            await updateDoc(trackerRef, { dareCountSmall: increment(log.quantity) });
        }
    }

    async function deleteGoblinLog(log) {
        if (!uid.value) {
            console.error('[DEBUG] Cannot delete log: No user ID');
            return;
        }

        const logRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker', 'logs', log.id);
        const trackerRef = doc(firestore, 'users', uid.value, 'personal', 'goblinTracker');

        await deleteDoc(logRef);

        if (log.item === 'Dare Double Espresso (750ml)') {
            await updateDoc(trackerRef, { dareCountBig: increment(-log.quantity) });
        } else if (log.item === 'Dare Double Espresso (500ml)') {
            await updateDoc(trackerRef, { dareCountSmall: increment(-log.quantity) });
        }
    }

    return {
        uid,
        logs,
        addGoblinLog,
        deleteGoblinLog
    };
});