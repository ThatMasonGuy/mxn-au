<template>
    <Teleport to="body">
      <transition name="editor-modal">
        <div v-if="isOpen" class="editor-overlay" @click.self="handleClose">
          <div class="editor-container">
            <!-- Header -->
            <div class="editor-header">
              <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500" 
                       @click="handleClose" 
                       title="Close (Esc)"></div>
                  <div class="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                  <div class="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
                
                <div class="flex-1">
                  <span class="font-mono text-sm text-emerald-400">{{ filename }}</span>
                  <span v-if="props.isNew" class="ml-2 text-xs text-yellow-400">[New File]</span>
                  <span v-if="hasUnsavedChanges" class="ml-2 text-xs text-yellow-400">● Modified</span>
                  <span v-if="saving" class="ml-2 text-xs text-blue-400">Saving...</span>
                </div>
  
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-gray-500">{{ lineCount }} lines</span>
                  <button @click="handleSave" 
                          class="editor-btn"
                          :disabled="saving || !hasUnsavedChanges">
                    <span class="font-mono text-xs">SAVE (Ctrl+S)</span>
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Simple Textarea Editor -->
            <div class="editor-content">
              <textarea
                ref="textareaRef"
                v-model="content"
                class="simple-editor"
                spellcheck="false"
                @keydown="handleKeydown"
              ></textarea>
            </div>
  
            <!-- Footer -->
            <div class="editor-footer">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <span class="text-xs font-mono text-gray-500">
                    Ln {{ cursorLine }}, Col {{ cursorColumn }}
                  </span>
                  <span class="text-xs font-mono text-gray-500">
                    {{ fileSize }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-gray-500">
                    Press Esc to close • Ctrl+S to save
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
  
  const props = defineProps({
    isOpen: Boolean,
    filename: String,
    filepath: String,
    initialContent: String,
    isNew: Boolean
  })
  
  const emit = defineEmits(['close', 'save'])
  
  // State
  const content = ref('')
  const originalContent = ref('')
  const saving = ref(false)
  const textareaRef = ref(null)
  const cursorLine = ref(1)
  const cursorColumn = ref(1)
  
  // Computed
  const hasUnsavedChanges = computed(() => {
    return content.value !== originalContent.value
  })
  
  const lineCount = computed(() => {
    return content.value.split('\n').length
  })
  
  const fileSize = computed(() => {
    const bytes = new Blob([content.value]).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  })
  
  // Watch for prop changes
  watch(() => props.initialContent, (newContent) => {
    if (newContent !== undefined) {
      content.value = newContent
      originalContent.value = newContent
    }
  }, { immediate: true })
  
  // Watch for modal open
  watch(() => props.isOpen, async (isOpen) => {
    if (isOpen) {
      await nextTick()
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
      // Add global handler when opening
      window.addEventListener('keydown', globalKeyHandler, { capture: true })
    } else {
      // Remove global handler when closing
      window.removeEventListener('keydown', globalKeyHandler, { capture: true })
    }
  })
  
  // Track cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.value) return
    
    const textarea = textareaRef.value
    const cursorPos = textarea.selectionStart
    const textBeforeCursor = content.value.substring(0, cursorPos)
    const lines = textBeforeCursor.split('\n')
    
    cursorLine.value = lines.length
    cursorColumn.value = lines[lines.length - 1].length + 1
  }
  
  // Handlers
  const handleSave = async () => {
    if (saving.value || !hasUnsavedChanges.value) return
    
    saving.value = true
    try {
      await emit('save', {
        filepath: props.filepath,
        content: content.value
      })
      originalContent.value = content.value
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      saving.value = false
    }
  }
  
  const handleClose = () => {
    if (hasUnsavedChanges.value) {
      const confirmed = confirm('You have unsaved changes. Close anyway?')
      if (!confirmed) return
    }
    
    emit('close')
  }
  
  const handleKeydown = (e) => {
    // Update cursor position on any key
    setTimeout(() => updateCursorPosition(), 0)
    
    // Ctrl+S to save - PREVENT BROWSER DEFAULT GLOBALLY
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      e.stopPropagation()
      handleSave()
      return
    }
    
    // Esc to close
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
      return
    }
    
    // Tab key - insert spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.value
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      // Insert 2 spaces
      content.value = content.value.substring(0, start) + '  ' + content.value.substring(end)
      
      // Move cursor
      nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }
  
  // Global keydown handler to prevent browser shortcuts
  const globalKeyHandler = (e) => {
    if (!props.isOpen) return
    
    // Prevent Ctrl+S browser save when editor is open
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      e.stopPropagation()
    }
  }
  
  onMounted(() => {
    // Focus on open (if already open on mount)
    if (props.isOpen) {
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
      // Add handler if modal is already open on mount
      window.addEventListener('keydown', globalKeyHandler, { capture: true })
    }
  })
  
  onUnmounted(() => {
    window.removeEventListener('keydown', globalKeyHandler, { capture: true })
  })
  </script>
  
  <style scoped>
  .editor-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);
  }
  
  .editor-container {
    width: 100%;
    max-width: 1400px;
    height: 90vh;
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .editor-header {
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .editor-content {
    flex: 1;
    overflow: hidden;
    min-height: 0;
    padding: 0;
  }
  
  .simple-editor {
    width: 100%;
    height: 100%;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
    font-size: 14px;
    line-height: 1.6;
    padding: 20px;
    border: none;
    outline: none;
    resize: none;
    tab-size: 2;
  }
  
  .simple-editor::selection {
    background: #264f78;
  }
  
  .editor-footer {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .editor-btn {
    padding: 6px 12px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 6px;
    color: #10b981;
    transition: all 0.2s;
  }
  
  .editor-btn:hover:not(:disabled) {
    background: rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.5);
  }
  
  .editor-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Modal transitions */
  .editor-modal-enter-active,
  .editor-modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .editor-modal-enter-from,
  .editor-modal-leave-to {
    opacity: 0;
  }
  
  .editor-modal-enter-active .editor-container,
  .editor-modal-leave-active .editor-container {
    transition: transform 0.3s ease;
  }
  
  .editor-modal-enter-from .editor-container,
  .editor-modal-leave-to .editor-container {
    transform: scale(0.9) translateY(20px);
  }
  </style>