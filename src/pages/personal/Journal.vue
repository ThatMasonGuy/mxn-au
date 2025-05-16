<!--
<template>
    <div class="p-6 max-w-2xl mx-auto text-white space-y-6">
        <h1 class="text-3xl font-bold">📝 Journal Summarizer</h1>

        <textarea v-model="input" rows="6" class="w-full p-4 bg-gray-800 rounded border border-gray-600"
            placeholder="Write your journal entry here..."></textarea>

        <button :disabled="loading" @click="generate"
            class="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded text-white font-semibold disabled:opacity-50">
            {{ loading ? 'Generating...' : 'Generate Summary' }}
        </button>

        <div v-if="summary" class="bg-gray-900 p-4 rounded border border-gray-700">
            <h2 class="text-xl font-semibold mb-2">✨ Summary:</h2>
            <p class="whitespace-pre-line">{{ summary }}</p>
        </div>

        <div v-if="error" class="text-red-400">
            ❌ {{ error }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { httpsCallable } from 'firebase/functions'
import { functions, auth } from '@/firebase'

const input = ref('')
const summary = ref('')
const error = ref('')
const loading = ref(false)

const generateJournalSummary = httpsCallable(functions, 'generateJournalSummary')

async function generate() {
    summary.value = ''
    error.value = ''
    loading.value = true

    try {
        const user = auth.currentUser
        if (!user) throw new Error('User not signed in')

        const payload = {
            messages: [
                { role: 'user', content: input.value }
            ]
        }

        const res = await generateJournalSummary(payload)

        summary.value = res.data.summary || '(No summary returned)'
    } catch (err) {
        console.error('🔥 [FUNCTION ERROR]', {
            message: err?.message,
            stack: err?.stack,
            name: err?.name,
            ...(err?.code && { code: err.code }),
            ...(err?.details && { details: err.details }),
        })

        error.value = err?.message || 'Something went wrong.'
    } finally {
        loading.value = false
    }
}
</script>


<style scoped>
textarea {
    font-family: 'Courier New', monospace;
    resize: vertical;
}
</style>
-->

<template>
    <div class="flex h-screen bg-amber-50 text-stone-800 font-sans">
        <!-- Sidebar -->
        <div :class="[
            'transition-all duration-300 ease-in-out bg-amber-100 border-r border-amber-200 flex flex-col overflow-hidden',
            sidebarOpen ? 'w-64' : 'w-16'
        ]">
            <!-- Journal Title -->
            <div class="p-4 h-14 border-b border-amber-200 flex items-center justify-between">
                <h1 class="text-xl font-serif font-medium text-primary" :class="{ 'hidden': !sidebarOpen }">My
                    Journal</h1>
                <button @click="toggleSidebar"
                    class="p-1 text-primary rounded-full hover:bg-amber-200/70 transition duration-200 ease-in-out w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path :d="sidebarIconPath" />
                    </svg>
                </button>
            </div>

            <!-- New Entry Button -->
            <div>
                <button @click="openNewEntryModal"
                    class="w-12 bg-amber-700 hover:bg-amber-800 text-amber-50 m-2 rounded-lg flex items-center justify-center gap-2 transition h-10"
                    :class="{ 'w-60': sidebarOpen }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd" />
                    </svg>
                    <span :class="{ 'hidden': !sidebarOpen }">New Entry</span>
                </button>
            </div>

            <!-- Month Groups -->
            <div class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
                <div v-for="(month, index) in months" :key="index" class="mb-2">
                    <h3 
                        class="text-sm font-medium text-primary px-3 py-2 mb-2 flex items-center cursor-pointer hover:bg-amber-200/70 rounded-lg transition-colors h-10"
                        @click="toggleMonthCollapse(month)" 
                        :class="{ 'justify-center': !sidebarOpen }">
                        <span :class="{ 'hidden': !sidebarOpen }">{{ month.name }}</span>
                        <span v-if="!sidebarOpen" class="text-base font-medium">{{ month.name.split(' ')[0].substring(0, 3)
                            }}</span>
                        <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 ml-1 transition-transform duration-200"
                            :class="{ 'rotate-180': month.collapsed }" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </h3>

                    <div v-if="isMonthVisible(month)" class="border-b border-amber-200 pb-2 mb-4">
                        <div v-for="day in month.days" :key="day.id" @click="selectEntry(day.id)" :class="[
                            'px-3 py-2 rounded-lg mb-1 cursor-pointer flex items-center transition-all',
                            selectedEntry === day.id ? 'bg-amber-200 text-amber-900' : 'hover:bg-amber-200/50'
                        ]">
                            <div :class="[
                                'text-center shrink-0 flex flex-col items-center justify-center',
                                sidebarOpen ? 'w-8 mr-3' : 'w-full'
                            ]">
                                <div class="text-sm font-medium">{{ day.date }}</div>
                                <div class="text-xs text-amber-700">{{ day.day }}</div>
                            </div>
                            <div class="flex-1 overflow-hidden transition-opacity duration-300"
                                :class="!sidebarOpen ? 'hidden' : 'block'">
                                <div class="text-sm font-medium truncate whitespace-nowrap">{{ day.title }}</div>
                                <div class="text-xs text-amber-700/80 truncate whitespace-nowrap">
                                    <span v-if="day.type === 'chat'" class="mr-1">💬</span>
                                    <span v-else class="mr-1">📝</span>
                                    {{ day.preview }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <div class="bg-amber-100/70 border-b border-amber-200 py-3 px-6 h-14 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <div class="text-amber-900 text-sm">{{ currentDate }}</div>
                    <div class="flex gap-1">
                        <span class="px-2 py-1 text-xs bg-amber-200 text-amber-800 rounded-full">Journal</span>
                        <span v-if="currentEntryType === 'diary'" class="px-2 py-1 text-xs bg-amber-200/70 text-amber-800 rounded-full">Personal</span>
                        <span v-else class="px-2 py-1 text-xs bg-amber-200/70 text-amber-800 rounded-full">Chat</span>
                    </div>
                </div>
                <div class="flex gap-3">
                    <button class="p-2 text-amber-700 hover:text-amber-900 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                    <button class="p-2 text-amber-700 hover:text-amber-900 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Title Input -->
            <div class="px-8 pt-6">
                <input type="text" placeholder="Entry Title" v-model="entryTitle"
                    class="w-full text-2xl font-serif font-medium text-amber-900 bg-transparent border-none outline-none placeholder-amber-400" />
            </div>

            <!-- Diary Entry Content Area -->
            <div v-if="currentEntryType === 'diary'" class="flex-1 px-8 py-4 overflow-y-auto">
                <textarea v-model="entryContent" placeholder="Start writing your thoughts here..."
                    class="w-full h-full text-lg bg-transparent border-none outline-none resize-none text-stone-700 placeholder-amber-400/70 leading-relaxed" />
            </div>

            <!-- Chat Content Area -->
            <div v-else class="flex-1 px-8 py-4 overflow-y-auto flex flex-col">
                <div class="flex-1 space-y-4 pb-4">
                    <!-- Sample messages - These would be populated dynamically -->
                    <div v-for="message in chatMessages" :key="message.id" :class="[
                        'p-3 rounded-lg max-w-3/4',
                        message.sender === 'user' ? 'bg-amber-200 ml-auto' : 'bg-white border border-amber-200',
                    ]">
                        <div class="text-sm">{{ message.content }}</div>
                        <div class="text-xs text-amber-700/80 text-right mt-1">{{ message.time }}</div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="border-t border-amber-200 pt-4">
                    <div class="relative">
                        <textarea v-model="chatInput" placeholder="Type your message here..."
                            class="w-full border border-amber-200 rounded-lg py-2 pl-4 pr-10 resize-none h-12 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-700 placeholder-amber-400/70"></textarea>
                        <button @click="sendChatMessage" class="absolute right-2 top-2 text-amber-700 hover:text-amber-900 p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-amber-100/70 border-t border-amber-200 py-3 px-6 flex items-center justify-between">
                <div class="text-sm text-amber-700">
                    <span v-if="currentEntryType === 'diary'">{{ wordCount }} words</span>
                    <span v-else>{{ chatMessages.length }} messages</span>
                </div>
                <div class="flex gap-2">
                    <button
                        class="py-2 px-3 text-amber-700 hover:bg-amber-200/70 rounded-lg transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Save</span>
                    </button>
                    <button
                        class="py-2 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        <span>Done</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- New Entry Modal -->
        <div v-if="showNewEntryModal" class="fixed inset-0 bg-stone-900/50 flex items-center justify-center z-50">
            <div class="bg-amber-50 rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
                <h2 class="text-xl font-serif font-medium text-amber-900 mb-4">Create New Entry</h2>
                <p class="text-stone-700 mb-6">Select the type of entry you would like to create:</p>
                
                <div class="flex gap-4 mb-6">
                    <button @click="createNewEntry('diary')" class="flex-1 py-3 px-4 bg-amber-100 hover:bg-amber-200 rounded-lg transition flex flex-col items-center gap-2 border border-amber-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                        </svg>
                        <span class="font-medium text-amber-900">Diary Entry</span>
                    </button>
                    <button @click="createNewEntry('chat')" class="flex-1 py-3 px-4 bg-amber-100 hover:bg-amber-200 rounded-lg transition flex flex-col items-center gap-2 border border-amber-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-amber-700" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        <span class="font-medium text-amber-900">Chat Entry</span>
                    </button>
                </div>
                
                <button @click="closeNewEntryModal" class="w-full py-2 text-amber-700 hover:bg-amber-200/70 rounded-lg transition">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

// Sample entries data with timestamps
const entriesData = [
    { 
        id: 1, 
        timestamp: new Date(2025, 4, 11, 15, 30), // May 11, 2025
        title: 'A peaceful Sunday', 
        preview: 'Today I decided to take some time for myself...', 
        type: 'diary',
        content: 'Today I decided to take some time for myself and reflect on the past week. The weather was perfect - not too hot, with a gentle breeze that rustled through the trees outside my window. I made my favorite tea and sat by the window, watching people walk by and enjoying the simple moment.\n\nI\'ve been thinking about starting a new project, something creative that would allow me to express myself more. Perhaps a photography series capturing everyday moments that often go unnoticed. There\'s something beautiful about finding meaning in the mundane.\n\nTomorrow I plan to organize my workspace and prepare for the week ahead. I want to approach it with intention and clarity.'
    },
    { 
        id: 2, 
        timestamp: new Date(2025, 4, 10, 9, 15), // May 10, 2025
        title: 'Morning thoughts', 
        preview: 'Woke up early and went for a walk around the...', 
        type: 'diary',
        content: 'Woke up early and went for a walk around the neighborhood. The morning air was crisp and refreshing. I noticed so many small details I usually miss when I\'m rushing to work. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    { 
        id: 3, 
        timestamp: new Date(2025, 4, 8, 10, 15), // May 8, 2025
        title: 'Chat with AI Assistant', 
        preview: 'I need some advice about my project...', 
        type: 'chat',
        messages: [
            { id: 1, sender: 'ai', content: 'Hello! How can I help you with your project today?', time: '10:15 AM' },
            { id: 2, sender: 'user', content: 'I need some advice about my project. I\'m not sure which direction to take.', time: '10:16 AM' },
            { id: 3, sender: 'ai', content: 'I\'d be happy to help. What kind of project are you working on?', time: '10:16 AM' },
            { id: 4, sender: 'user', content: 'It\'s a web application for personal productivity. I\'m debating between focusing on task management or habit tracking.', time: '10:17 AM' },
            { id: 5, sender: 'ai', content: 'Those are both valuable areas. What problem are you most passionate about solving for your users?', time: '10:18 AM' },
        ]
    },
    { 
        id: 4, 
        timestamp: new Date(2025, 4, 5, 14, 20), // May 5, 2025
        title: 'New beginnings', 
        preview: 'Started a new project today that I\'m really...', 
        type: 'diary',
        content: 'Started a new project today that I\'m really excited about. It\'s been a while since I felt this inspired and motivated. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    { 
        id: 5, 
        timestamp: new Date(2025, 3, 29, 21, 45), // April 29, 2025
        title: 'Birthday reflections', 
        preview: 'Another year older, another year wiser...', 
        type: 'diary',
        content: 'Another year older, another year wiser. Spent the day with family and close friends. It\'s amazing how time flies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    { 
        id: 6, 
        timestamp: new Date(2025, 3, 25, 18, 30), // April 25, 2025
        title: 'Weekend plans', 
        preview: 'Looking forward to the weekend. I\'m planning to...', 
        type: 'diary',
        content: 'Looking forward to the weekend. I\'m planning to visit the new art exhibition downtown and maybe catch up with some old friends over coffee. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    { 
        id: 7, 
        timestamp: new Date(2025, 3, 18, 14, 45), // April 18, 2025
        title: 'Writing Assistant Chat', 
        preview: 'Help me brainstorm some ideas for my novel...', 
        type: 'chat',
        messages: [
            { id: 1, sender: 'ai', content: 'Hi there! I understand you\'re looking for help with your novel. What would you like to brainstorm today?', time: '2:45 PM' },
            { id: 2, sender: 'user', content: 'I need help brainstorming some ideas for my novel. I\'m working on a mystery set in a small coastal town.', time: '2:46 PM' },
            { id: 3, sender: 'ai', content: 'That sounds intriguing! A coastal setting has great potential for atmosphere. What elements of your story have you developed so far?', time: '2:47 PM' },
            { id: 4, sender: 'user', content: 'I have a main character who\'s a former detective who moved to the town for a quiet life, but gets pulled into investigating when something washes up on shore.', time: '2:48 PM' },
            { id: 5, sender: 'ai', content: 'I love that setup! The "retired professional pulled back in" is a compelling trope. For coastal mysteries, the item washing ashore creates instant intrigue. What if it\'s something unusual like an antique locked box with mysterious markings? Or perhaps something more personal that connects to your detective\'s past?', time: '2:49 PM' },
        ]
    },
    { 
        id: 8, 
        timestamp: new Date(2025, 3, 10, 11, 0), // April 10, 2025
        title: 'Work breakthrough', 
        preview: 'Finally solved that problem I\'ve been stuck on...', 
        type: 'diary',
        content: 'Finally solved that problem I\'ve been stuck on for weeks. Sometimes the answer is so simple once you see it. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
];

// Function to group entries by month
function groupEntriesByMonth(entries) {
    const groups = {};
    
    entries.forEach(entry => {
        const date = entry.timestamp;
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (!groups[monthYear]) {
            groups[monthYear] = {
                name: monthYear,
                collapsed: false,
                days: []
            };
        }
        
        groups[monthYear].days.push({
            id: entry.id,
            date: date.getDate().toString(), // Day of month
            day: date.toLocaleDateString('en-US', { weekday: 'short' }), // Short day name
            title: entry.title,
            preview: entry.preview,
            type: entry.type
        });
    });
    
    // Sort days within each month in descending order (newest first)
    Object.values(groups).forEach(month => {
        month.days.sort((a, b) => parseInt(b.date) - parseInt(a.date));
    });
    
    // Convert to array and sort months (newest first)
    return Object.values(groups).sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateB - dateA;
    });
}

// Create reactive months data
const months = reactive(groupEntriesByMonth(entriesData));

const showNewEntryModal = ref(false);
const sidebarOpen = ref(true);
const selectedEntry = ref(1);
const entryTitle = ref('A peaceful Sunday');
const entryContent = ref('Today I decided to take some time for myself and reflect on the past week. The weather was perfect - not too hot, with a gentle breeze that rustled through the trees outside my window. I made my favorite tea and sat by the window, watching people walk by and enjoying the simple moment.\n\nI\'ve been thinking about starting a new project, something creative that would allow me to express myself more. Perhaps a photography series capturing everyday moments that often go unnoticed. There\'s something beautiful about finding meaning in the mundane.\n\nTomorrow I plan to organize my workspace and prepare for the week ahead. I want to approach it with intention and clarity.');
const currentEntryType = ref('diary');
const chatInput = ref('');

// Sample chat messages
const chatMessages = ref([
    { id: 1, sender: 'ai', content: 'Hello! How can I help you today?', time: '9:30 AM' },
    { id: 2, sender: 'user', content: 'I\'ve been thinking about starting a new creative project.', time: '9:31 AM' },
    { id: 3, sender: 'ai', content: 'That sounds exciting! What kind of creative project are you considering?', time: '9:31 AM' },
    { id: 4, sender: 'user', content: 'Maybe a photography series about everyday moments that people often miss.', time: '9:32 AM' },
    { id: 5, sender: 'ai', content: 'I love that idea! Finding beauty in the ordinary can be really powerful. What sorts of moments are you thinking about capturing?', time: '9:33 AM' },
]);

function openNewEntryModal() {
    showNewEntryModal.value = true;
}

function closeNewEntryModal() {
    showNewEntryModal.value = false;
}

function createNewEntry(type) {
    currentEntryType.value = type;
    
    // Get the current date and time
    const now = new Date();
    const newId = Math.max(...entriesData.map(e => e.id)) + 1;
    
    if (type === 'diary') {
        entryTitle.value = 'New Diary Entry';
        entryContent.value = '';
        
        // Create a new entry in the data store
        const newEntry = {
            id: newId,
            timestamp: now,
            title: 'New Diary Entry',
            preview: '',
            type: 'diary',
            content: ''
        };
        
        entriesData.push(newEntry);
    } else {
        entryTitle.value = 'New Chat Session';
        // Reset chat messages to just an initial greeting
        const initialMessages = [
            { id: 1, sender: 'ai', content: 'Hello! How can I help you today?', time: getCurrentTime() }
        ];
        
        chatMessages.value = initialMessages;
        chatInput.value = '';
        
        // Create a new entry in the data store
        const newEntry = {
            id: newId,
            timestamp: now,
            title: 'New Chat Session',
            preview: 'Hello! How can I help you today?',
            type: 'chat',
            messages: initialMessages
        };
        
        entriesData.push(newEntry);
    }
    
    // Update the months structure with the new entry
    const updatedMonths = groupEntriesByMonth(entriesData);
    
    // Update each month in the reactive months array
    while (months.length > 0) {
        months.pop();
    }
    
    updatedMonths.forEach(month => {
        months.push(month);
    });
    
    // Select the new entry
    selectedEntry.value = newId;
    
    closeNewEntryModal();
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function sendChatMessage() {
    if (!chatInput.value.trim()) return;
    
    // Add user message
    const userMessage = {
        id: chatMessages.value.length + 1,
        sender: 'user',
        content: chatInput.value,
        time: getCurrentTime()
    };
    
    chatMessages.value.push(userMessage);
    
    const messageContent = chatInput.value;
    chatInput.value = '';
    
    // Simulate AI response (in a real app, you would call your AI service here)
    setTimeout(() => {
        const aiResponse = {
            id: chatMessages.value.length + 1,
            sender: 'ai',
            content: `This is where your AI integration will respond to: "${messageContent}"`,
            time: getCurrentTime()
        };
        
        chatMessages.value.push(aiResponse);
        
        // Update the entry in the data store
        if (selectedEntry.value) {
            const entry = entriesData.find(e => e.id === selectedEntry.value);
            if (entry) {
                // Update the messages array
                entry.messages = [...chatMessages.value];
                
                // Update the preview with the latest message
                entry.preview = messageContent.length > 30 ? 
                    messageContent.substring(0, 30) + '...' : 
                    messageContent;
                
                // Update the months structure
                const updatedMonths = groupEntriesByMonth(entriesData);
                
                // Update each month in the reactive months array
                while (months.length > 0) {
                    months.pop();
                }
                
                updatedMonths.forEach(month => {
                    months.push(month);
                });
            }
        }
    }, 1000);
}

function toggleMonthCollapse(month) {
    month.collapsed = !month.collapsed
}

const isMonthVisible = (month) => !month.collapsed || !sidebarOpen.value

// Sidebar toggle icon logic
const sidebarIconPath = computed(() =>
    sidebarOpen.value
        ? 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
        : 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
)

const currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const wordCount = computed(() => {
    return entryContent.value.trim().split(/\s+/).filter(Boolean).length;
});

const selectEntry = (id) => {
    selectedEntry.value = id;
    
    // Find the entry in the original data source
    const entry = entriesData.find(e => e.id === id);
    if (entry) {
        entryTitle.value = entry.title;
        currentEntryType.value = entry.type;
        
        if (entry.type === 'diary') {
            entryContent.value = entry.content;
        } else {
            // Load chat messages from the entry data
            chatMessages.value = entry.messages || [];
        }
    }
};

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
}
</script>