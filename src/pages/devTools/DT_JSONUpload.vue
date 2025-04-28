<template>
    <div class="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-0 m-0">
        <div class="max-w-full p-8">
            <div class="mb-10 text-center">
                <h1
                    class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 mb-2">
                    Firestore JSON Uploader
                </h1>
                <p class="text-gray-300 max-w-2xl mx-auto">Upload JSON data to your Firestore database with path
                    autocompletion and overwrite protection</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- File Input Section -->
                <div
                    class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
                    <div class="flex items-center mb-6">
                        <div class="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white font-bold">1</span>
                        </div>
                        <h2 class="text-xl font-semibold text-white">Select JSON File</h2>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <Label for="json-file" class="text-gray-300 font-medium block mb-2">Choose File</Label>
                            <div class="relative">
                                <Input ref="fileInputRef" id="json-file" type="file" accept=".json"
                                    @change="handleFileChange"
                                    class="bg-gray-900 border-gray-600 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>

                        <div v-if="jsonFile" class="p-3 bg-gray-900/50 border border-indigo-500/30 rounded-lg">
                            <p class="text-indigo-400 text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                                {{ jsonFile.name }} ({{ (jsonFile.size / 1024).toFixed(2) }} KB)
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Path Entry Section -->
                <div
                    class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
                    <div class="flex items-center mb-6">
                        <div class="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white font-bold">2</span>
                        </div>
                        <h2 class="text-xl font-semibold text-white">Firestore Path</h2>
                    </div>

                    <div class="space-y-4">
                        <Label for="manual-path" class="text-gray-300 font-medium block mb-2">Enter Firestore
                            Path</Label>
                        <Input id="manual-path" v-model="firestorePath" placeholder="e.g. users/userId"
                            class="bg-gray-900 border-gray-600 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        <p class="text-gray-400 text-xs mt-2">Path must be a full document path: collection/document</p>
                    </div>
                </div>

                <!-- Upload Button Section -->
                <div
                    class="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
                    <div class="flex items-center mb-6">
                        <div class="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white font-bold">3</span>
                        </div>
                        <h2 class="text-xl font-semibold text-white">Upload</h2>
                    </div>

                    <div class="flex items-center justify-center">
                        <Button @click="uploadJson" :disabled="!jsonFile || !firestorePath || isUploading"
                            class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg transition-all duration-300 w-full flex items-center justify-center"
                            :class="{ 'opacity-60 cursor-not-allowed': !jsonFile || !firestorePath || isUploading }">
                            <svg v-if="isUploading" class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            {{ isUploading ? 'Uploading...' : 'Upload to Firestore' }}
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Status & Information Panel -->
            <div class="mt-12 bg-gray-800/60 p-6 rounded-xl border border-gray-700 shadow-lg">
                <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-indigo-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Information
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <p class="text-gray-300">
                            <span class="font-semibold text-indigo-400">Document Paths:</span>
                            Must have an even number of segments (e.g., <code
                                class="bg-gray-900 px-1 py-0.5 rounded">collection/document</code>)
                        </p>
                        <p class="text-gray-300">
                            <span class="font-semibold text-indigo-400">Large Files:</span>
                            For best performance, keep JSON files under 10MB
                        </p>
                    </div>
                    <div class="space-y-2">
                        <p class="text-gray-300">
                            <span class="font-semibold text-indigo-400">Path Format:</span>
                            Follow the pattern collection/document or collection/document/subcollection/document
                        </p>
                        <p class="text-gray-300">
                            <span class="font-semibold text-indigo-400">Overwrite Protection:</span>
                            A confirmation will appear when uploading to existing documents
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Overwrite Confirmation Dialog -->
        <Dialog :open="showOverwriteDialog" @update:open="showOverwriteDialog = $event">
            <DialogContent class="bg-gray-900 text-white border-gray-700 shadow-xl">
                <DialogHeader>
                    <DialogTitle class="text-2xl font-bold text-white flex items-center">
                        Confirm Overwrite
                    </DialogTitle>
                    <DialogDescription class="text-gray-300 mt-4">
                        <div class="p-4 bg-gray-800 rounded-lg border border-yellow-600/30 mb-4">
                            A document already exists at:<br />
                            <span
                                class="font-mono text-yellow-400 bg-gray-900/50 px-2 py-1 rounded mt-1 inline-block">{{
                                firestorePath }}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="mergeCheckbox" v-model="mergeDocuments"
                                class="accent-indigo-500" />
                            <label for="mergeCheckbox" class="text-sm text-gray-300">Merge with existing document
                                (instead of replacing it)</label>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter class="flex space-x-3 mt-6">
                    <Button variant="destructive" @click="confirmOverwrite"
                        class="bg-red-600 hover:bg-red-500 text-white px-4 py-2">
                        Yes, Overwrite Data
                    </Button>
                    <Button variant="outline" @click="cancelOverwrite"
                        class="bg-transparent hover:bg-gray-700 border border-gray-600 text-gray-300">
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { toast } from 'vue-sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const jsonFile = ref(null)
const isUploading = ref(false)
const firestorePath = ref('')
const showOverwriteDialog = ref(false)
const uploadAttemptData = ref(null)
const fileInputRef = ref(null)
const mergeDocuments = ref(false)

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/json') {
        jsonFile.value = file
    } else {
        toast.error("Invalid File. Please select a valid JSON file")
        
        if (fileInputRef.value) fileInputRef.value.value = ''
        jsonFile.value = null
    }
}

const uploadJson = async () => {
    if (!jsonFile.value || !firestorePath.value) {
        toast.error("Missing Information. Please provide both a JSON file and a Firestore path")
        
        return
    }

    isUploading.value = true
    try {
        const reader = new FileReader()
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result)
                const pathParts = firestorePath.value.split('/')

                if (pathParts.length % 2 === 0) {
                    const docRef = doc(firestore, firestorePath.value)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        uploadAttemptData.value = data
                        showOverwriteDialog.value = true
                    } else {
                        await performUpload(data)
                    }
                } else {
                    toast.error("Invalid Path. Path must point to a document (collection/document)")
                    
                    isUploading.value = false
                }
            } catch (err) {
                toast.error("JSON Parse Error. Failed to parse JSON")

                isUploading.value = false
            }
        }
        reader.readAsText(jsonFile.value)
    } catch (err) {
        toast.error(`Upload Failed ${err.message}`)
        isUploading.value = false
    }
}

const performUpload = async (data) => {
    try {
        const docRef = doc(firestore, firestorePath.value)
        await setDoc(docRef, data, { merge: mergeDocuments.value })
        toast.success(`Upload Successful. Data uploaded to ${firestorePath.value}`)

        jsonFile.value = null
        if (fileInputRef.value) fileInputRef.value.value = ''
    } catch (err) {
        toast.error(`Upload Failed ${err.message}`)

    } finally {
        isUploading.value = false
        uploadAttemptData.value = null
        showOverwriteDialog.value = false
        mergeDocuments.value = false
    }
}

const confirmOverwrite = () => {
    if (uploadAttemptData.value) performUpload(uploadAttemptData.value)
}

const cancelOverwrite = () => {
    showOverwriteDialog.value = false
    uploadAttemptData.value = null
    mergeDocuments.value = false
    toast.warning("Upload Cancelled. Document overwrite was cancelled")
}
</script>