import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
    doc, onSnapshot, setDoc, increment, serverTimestamp, collection,
    query, orderBy, limit, deleteDoc, getDocs, writeBatch
} from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

export const useTranslateStore = defineStore('translate', () => {
    // --- Stores ---
    const mainStore = useMainStore()

    // --- Core State ---
    const settingsOpen = ref(false)
    const showApiKey = ref(false)
    const isTranslating = ref(false)
    const accuracy = ref(null)
    const accuracyRating = ref(null)
    const lastOriginalText = ref('')
    const lastTranslationDirection = ref('left')
    const leftText = ref('')
    const rightText = ref('')
    const retranslatedText = ref('')
    const appStats = ref(null)
    const unsubscribeStats = ref(null)
    const unsubscribeUserHistory = ref(null)

    // --- Persisted Settings ---
    const apiKey = ref('')
    const selectedLanguage = ref('es')
    const fromLanguage = ref('en')
    const autoCopy = ref(false)
    const syncHistory = ref(true)

    // --- History State ---
    const recentTranslations = ref([]) // Local storage history for anonymous/offline users
    const userHistory = ref([]) // Firestore-synced history for authenticated users

    // --- Constants ---
    const MAX_HISTORY_SIZE = 20
    const languages = [
        { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' }, { code: 'it', name: 'Italian' }, { code: 'pt', name: 'Portuguese' },
        { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'zh', name: 'Chinese (Simplified)' },
        { code: 'ru', name: 'Russian' }, { code: 'ar', name: 'Arabic' }, { code: 'hi', name: 'Hindi' },
        { code: 'tr', name: 'Turkish' }, { code: 'nl', name: 'Dutch' }, { code: 'sv', name: 'Swedish' },
        { code: 'no', name: 'Norwegian' }, { code: 'da', name: 'Danish' }, { code: 'fi', name: 'Finnish' },
        { code: 'pl', name: 'Polish' }, { code: 'cs', name: 'Czech' }, { code: 'hu', name: 'Hungarian' },
        { code: 'th', name: 'Thai' }, { code: 'vi', name: 'Vietnamese' }
    ]
    const langFlagMap = {
        English: 'gb', Spanish: 'es', French: 'fr', German: 'de', Italian: 'it',
        Portuguese: 'pt', Japanese: 'jp', Korean: 'kr', 'Chinese (Simplified)': 'cn',
        Russian: 'ru', Arabic: 'sa', Hindi: 'in', Turkish: 'tr', Dutch: 'nl',
        Swedish: 'se', Norwegian: 'no', Danish: 'dk', Finnish: 'fi', Polish: 'pl',
        Czech: 'cz', Hungarian: 'hu', Thai: 'th', Vietnamese: 'vn'
    }

    // --- Computed Properties ---
    const isSyncing = computed(() => mainStore.user && syncHistory.value)
    const history = computed(() => isSyncing.value ? userHistory.value : recentTranslations.value)
    const hasApiKey = computed(() => apiKey.value.trim() !== '')
    const canTranslateLeft = computed(() => leftText.value.trim() && !isTranslating.value)
    const canTranslateRight = computed(() => rightText.value.trim() && !isTranslating.value)
    const leftLanguageName = computed(() => languages.find(l => l.code === fromLanguage.value)?.name || fromLanguage.value)
    const rightLanguageName = computed(() => languages.find(l => l.code === selectedLanguage.value)?.name || selectedLanguage.value)
    const retranslationTargetLanguageName = computed(() => lastTranslationDirection.value === 'left' ? leftLanguageName.value : rightLanguageName.value)
    const formattedTranslations = computed(() => appStats.value?.totalTranslations?.toLocaleString() || '0')
    const formattedWords = computed(() => appStats.value?.totalWords?.toLocaleString() || '0')
    const formattedApiCost = computed(() => {
        if (!appStats.value) return '$0.00'
        const GPT4O_INPUT_COST_PER_MILLION = 2.5
        const GPT4O_OUTPUT_COST_PER_MILLION = 10
        const promptTokens = appStats.value.totalPromptTokens || 0
        const completionTokens = appStats.value.totalCompletionTokens || 0
        const inputCost = (promptTokens / 1000000) * GPT4O_INPUT_COST_PER_MILLION
        const outputCost = (completionTokens / 1000000) * GPT4O_OUTPUT_COST_PER_MILLION
        const totalCost = (inputCost + outputCost)
        return `$${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`
    })
    const accuracyPercentage = computed(() => accuracy.value !== null ? Math.round(accuracy.value) : null)
    const accuracyBarClass = computed(() => {
        if (accuracy.value > 80) return 'bg-green-500'
        if (accuracy.value > 60) return 'bg-yellow-500'
        if (accuracy.value > 40) return 'bg-orange-500'
        return 'bg-red-500'
    })
    const retranslationWithDiff = computed(() => highlightDifferences(lastOriginalText.value, retranslatedText.value))

    // --- Methods ---
    const _saveUserTranslation = async (userId, translationData, docRef) => {
        if (!userId || !translationData || !docRef) return;
        try {
            // We only need to store the codes in the DB, not the full names
            const { fromLangName, toLangName, ...dataToSave } = translationData;
            await setDoc(docRef, { ...dataToSave, timestamp: serverTimestamp() });

            const metaDocRef = doc(firestore, `users/${userId}/translations`, 'meta');
            const wordCount = translationData.originalText.trim().split(/\s+/).length;
            await setDoc(metaDocRef, {
                totalTranslations: increment(1),
                totalWords: increment(wordCount),
                lastTranslated: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error("Failed to save user translation history:", error);
        }
    };

    const translate = async (fromSide = 'left', showMessage) => {
        const isLeftToRight = fromSide === 'left'
        const inputText = isLeftToRight ? leftText.value : rightText.value
        const fromLang = isLeftToRight ? fromLanguage.value : selectedLanguage.value
        const toLang = isLeftToRight ? selectedLanguage.value : fromLanguage.value
        const finalKey = apiKey.value?.trim() || import.meta.env.VITE_OPENAI_API_KEY_TRANSLATION_GENERIC

        if (!inputText.trim() || !finalKey) return

        isTranslating.value = true
        lastOriginalText.value = inputText
        lastTranslationDirection.value = fromSide

        try {
            const headers = { 'Content-Type': 'application/json', 'x-openai-key': finalKey };
            if (mainStore.token) { headers['Authorization'] = `Bearer ${mainStore.token}`; }

            const response = await fetch('/translate/post', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ content: inputText, fromLang, targetLang: toLang, retranslate: true })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData?.error || `HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const outputText = data.outputText || ''
            accuracy.value = typeof data.accuracy === 'number' ? Math.ceil(data.accuracy * 100) : null
            accuracyRating.value = data.accuracyRating || null

            if (isLeftToRight) { rightText.value = outputText } else { leftText.value = outputText }
            retranslatedText.value = data.retranslated || ''

            const translationResult = {
                fromLangCode: fromLang, toLangCode: toLang, originalText: inputText,
                translatedText: outputText, accuracy: accuracy.value, accuracyRating: accuracyRating.value,
            };

            if (isSyncing.value) {
                const userId = mainStore.user.uid;
                const translationDocRef = doc(collection(firestore, `users/${userId}/translations`));
                _saveUserTranslation(userId, translationResult, translationDocRef);
                addTranslationToHistory(translationResult, translationDocRef.id);
            } else {
                addTranslationToHistory(translationResult);
            }

            if (autoCopy.value && outputText) { await copyToClipboard(outputText, showMessage) }
            showMessage('success', 'Translation completed successfully!')
        } catch (error) {
            console.error('Translation error:', error)
            showMessage('error', `Translation failed: ${error.message}`)
            retranslatedText.value = ''; lastOriginalText.value = ''; accuracy.value = null; accuracyRating.value = null;
        } finally {
            isTranslating.value = false
        }
    }

    const addTranslationToHistory = (translation, docId = null) => {
        // Correctly choose which array to update for an immediate UI response
        const historyArray = isSyncing.value ? userHistory.value : recentTranslations.value;

        const newEntry = {
            id: docId || crypto.randomUUID(),
            fromLangCode: translation.fromLangCode,
            fromLangName: languages.find(l => l.code === translation.fromLangCode)?.name,
            toLangCode: translation.toLangCode,
            toLangName: languages.find(l => l.code === translation.toLangCode)?.name,
            originalText: translation.originalText,
            translatedText: translation.translatedText,
            timestamp: new Date().toISOString()
        };

        // Prevent duplicate optimistic updates from clashing with the listener
        if (isSyncing.value && historyArray.some(item => item.id === newEntry.id)) {
            return;
        }

        historyArray.unshift(newEntry)
        if (historyArray.length > MAX_HISTORY_SIZE) {
            historyArray.pop()
        }
    }

    const deleteHistoryItem = async (id, showMessage) => {
        if (isSyncing.value) {
            try {
                const docRef = doc(firestore, `users/${mainStore.user.uid}/translations`, id);
                await deleteDoc(docRef);
                showMessage('success', 'History item removed from cloud.');
            } catch (error) {
                console.error("Failed to delete cloud history item:", error);
                showMessage('error', 'Could not remove item from cloud.');
            }
        } else {
            const idx = recentTranslations.value.findIndex((t) => t.id === id)
            if (idx !== -1) {
                recentTranslations.value.splice(idx, 1)
                showMessage('success', 'History item removed.')
            }
        }
    }

    const clearHistory = async (showMessage) => {
        if (isSyncing.value) {
            showMessage('default', 'Clearing cloud history...', 2000);
            try {
                const userId = mainStore.user.uid;
                const translationsRef = collection(firestore, `users/${userId}/translations`);
                const q = query(translationsRef);
                const querySnapshot = await getDocs(q);
                const batch = writeBatch(firestore);
                querySnapshot.forEach((doc) => {
                    if (doc.id !== 'meta') { // Do not delete the meta document
                        batch.delete(doc.ref);
                    }
                });
                await batch.commit();
                showMessage('success', 'Cloud history cleared.');
            } catch (error) {
                console.error("Failed to clear cloud history:", error);
                showMessage('error', 'Could not clear cloud history.');
            }
        } else {
            recentTranslations.value = [];
            showMessage('success', 'Local history cleared.');
        }
    }

    const initializeUserHistoryListener = (userId, showMessage) => {
        cleanupUserHistoryListener();
        try {
            const translationsRef = collection(firestore, `users/${userId}/translations`);
            const q = query(translationsRef, orderBy('timestamp', 'desc'), limit(MAX_HISTORY_SIZE));

            unsubscribeUserHistory.value = onSnapshot(q, (snapshot) => {
                userHistory.value = snapshot.docs
                    .filter(doc => doc.id !== 'meta') // Ensure we don't process the meta document
                    .map(doc => {
                        const data = doc.data();
                        // **FIX**: Add language names, as they are not stored in the DB
                        const fromLangName = languages.find(l => l.code === data.fromLangCode)?.name;
                        const toLangName = languages.find(l => l.code === data.toLangCode)?.name;
                        return {
                            id: doc.id,
                            ...data,
                            fromLangName: fromLangName || data.fromLangCode,
                            toLangName: toLangName || data.toLangCode,
                            timestamp: data.timestamp?.toDate?.().toISOString() || new Date().toISOString()
                        };
                    });
            }, (error) => {
                console.error("Error listening to user history:", error);
                showMessage('error', 'Failed to load cloud history.');
            });
        } catch (error) {
            console.error("User history listener setup failed:", error);
            showMessage('error', 'Could not connect to your history.');
        }
    };

    const cleanupUserHistoryListener = () => {
        if (unsubscribeUserHistory.value) {
            unsubscribeUserHistory.value();
            unsubscribeUserHistory.value = null;
        }
        userHistory.value = [];
    };

    watch(isSyncing, (newIsSyncing) => {
        if (newIsSyncing) {
            initializeUserHistoryListener(mainStore.user.uid);
        } else {
            cleanupUserHistoryListener();
        }
    }, { immediate: true });

    const initializeFirestoreListener = (showMessage) => {
        try {
            const statsDocRef = doc(firestore, 'translations', 'meta')
            unsubscribeStats.value = onSnapshot(statsDocRef, (doc) => {
                if (doc.exists()) { appStats.value = doc.data() }
                else { console.log("No stats document found!"); appStats.value = {} }
            }, (error) => {
                console.error("Error fetching stats:", error)
                showMessage('error', 'Could not load live statistics.')
            })
        } catch (error) {
            console.error("Firestore listener setup failed:", error)
            showMessage('error', 'Could not connect to statistics service.')
        }
    }

    const cleanup = () => {
        if (unsubscribeStats.value) { unsubscribeStats.value() }
        cleanupUserHistoryListener();
    }

    const flagClass = (langName) => { if (!langName) return ''; const code = langFlagMap[langName]; if (code) return `fi fi-${code}`; return '' }
    const highlightDifferences = (originalText, modifiedText) => { if (!originalText || !modifiedText) return modifiedText.replace(/</g, "&lt;").replace(/>/g, "&gt;"); const splitRegex = /(\s+)/; const originalWords = originalText.split(splitRegex); const modifiedWords = modifiedText.split(splitRegex); const lcsMatrix = Array(originalWords.length + 1).fill(null).map(() => Array(modifiedWords.length + 1).fill(0)); for (let i = 1; i <= originalWords.length; i++) { for (let j = 1; j <= modifiedWords.length; j++) { if (originalWords[i - 1] === modifiedWords[j - 1]) { lcsMatrix[i][j] = 1 + lcsMatrix[i - 1][j - 1] } else { lcsMatrix[i][j] = Math.max(lcsMatrix[i - 1][j], lcsMatrix[i][j - 1]) } } } let i = originalWords.length, j = modifiedWords.length; const result = []; while (i > 0 || j > 0) { if (i > 0 && j > 0 && originalWords[i - 1] === modifiedWords[j - 1]) { result.unshift({ text: modifiedWords[j - 1], type: 'common' }); i--; j-- } else if (j > 0 && (i === 0 || lcsMatrix[i][j - 1] >= lcsMatrix[i - 1][j])) { result.unshift({ text: modifiedWords[j - 1], type: 'added' }); j-- } else if (i > 0 && (j === 0 || lcsMatrix[i][j - 1] < lcsMatrix[i - 1][j])) { i-- } else { break } } return result.map(part => { const cleanText = part.text.replace(/</g, "&lt;").replace(/>/g, "&gt;"); if (part.type === 'added' && part.text.trim() !== '') { const underlineColor = accuracy.value > 80 ? 'decoration-green-400' : accuracy.value > 60 ? 'decoration-yellow-400' : accuracy.value > 40 ? 'decoration-orange-400' : 'decoration-red-400'; const textColor = accuracy.value > 80 ? 'text-green-50' : accuracy.value > 60 ? 'text-yellow-50' : accuracy.value > 40 ? 'text-orange-50' : 'text-red-50'; return `<u class="${underlineColor} decoration-2 underline ${textColor}">${cleanText}</u>` } return cleanText }).join('') }
    const copyToClipboard = async (text, showMessage) => { if (!text) return; try { await navigator.clipboard.writeText(text); showMessage('success', 'Copied to clipboard!') } catch (error) { console.error('Copy failed:', error); try { const textArea = document.createElement('textarea'); textArea.value = text; document.body.appendChild(textArea); textArea.focus(); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea); showMessage('success', 'Copied to clipboard!') } catch (err) { showMessage('error', 'Failed to copy to clipboard') } } }
    const formatTimeAgo = (timestamp) => { const now = new Date(), past = new Date(timestamp), seconds = Math.floor((now - past) / 1000); let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y ago"; interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "m ago"; interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d ago"; interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h ago"; interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m ago"; return "just now" }
    const toggleSettings = () => { settingsOpen.value = !settingsOpen.value }
    const toggleShowApiKey = () => { showApiKey.value = !showApiKey.value }

    return {
        // State
        settingsOpen, showApiKey, isTranslating, accuracy, accuracyRating,
        lastOriginalText, lastTranslationDirection, leftText, rightText, retranslatedText,
        appStats, unsubscribeStats, apiKey, selectedLanguage, fromLanguage, autoCopy,
        recentTranslations, syncHistory, userHistory, history,

        // Constants
        languages, langFlagMap,

        // Computed
        hasApiKey, canTranslateLeft, canTranslateRight, leftLanguageName, rightLanguageName,
        retranslationTargetLanguageName, formattedTranslations, formattedWords,
        formattedApiCost, accuracyPercentage, accuracyBarClass, retranslationWithDiff,

        // Methods
        flagClass, highlightDifferences, translate, copyToClipboard, addTranslationToHistory,
        clearHistory, deleteHistoryItem, formatTimeAgo, initializeFirestoreListener,
        cleanup, toggleSettings, toggleShowApiKey
    }
}, {
    persist: {
        paths: ['apiKey', 'selectedLanguage', 'fromLanguage', 'autoCopy', 'recentTranslations', 'syncHistory']
    }
})

