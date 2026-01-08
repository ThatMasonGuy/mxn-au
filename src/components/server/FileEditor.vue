<template>
  <Teleport to="body">
    <transition name="editor-modal">
      <div v-if="isOpen" class="editor-overlay" @click.self="handleClose">
        <div class="editor-container">
          <!-- Header -->
          <div class="editor-header">
            <div class="flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="h-3 w-3 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500" @click="handleClose"
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
                <span class="text-xs font-mono text-gray-500">{{ detectedLanguage }}</span>
                <span class="text-xs font-mono text-gray-500">{{ lineCount }} lines</span>
                <button @click="handleSave" class="editor-btn" :disabled="saving || !hasUnsavedChanges">
                  <span class="font-mono text-xs">SAVE (Ctrl+S)</span>
                </button>
              </div>
            </div>
          </div>

          <!-- CodeMirror Editor -->
          <div class="editor-content">
            <div ref="editorRef" class="codemirror-wrapper"></div>
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
                <span v-if="selectedText" class="text-xs font-mono text-blue-400">
                  {{ selectedText }} selected
                </span>
              </div>

              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-gray-500">
                  Ctrl+S: Save • Ctrl+F: Find • Esc: Close
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick, shallowRef } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { xml } from '@codemirror/lang-xml'
import { sql } from '@codemirror/lang-sql'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'
import { vue } from '@codemirror/lang-vue'

const props = defineProps({
  isOpen: Boolean,
  filename: String,
  filepath: String,
  initialContent: String,
  isNew: Boolean
})

const emit = defineEmits(['close', 'save'])

// State
const editorRef = ref(null)
const editorView = shallowRef(null)
const content = ref('')
const originalContent = ref('')
const saving = ref(false)
const cursorLine = ref(1)
const cursorColumn = ref(1)
const selectedText = ref('')

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

const detectedLanguage = computed(() => {
  const ext = props.filename?.split('.').pop()?.toLowerCase()
  const langMap = {
    'js': 'JavaScript',
    'mjs': 'JavaScript',
    'cjs': 'JavaScript',
    'ts': 'TypeScript',
    'jsx': 'React',
    'tsx': 'React',
    'vue': 'Vue',
    'py': 'Python',
    'html': 'HTML',
    'htm': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'sass': 'Sass',
    'json': 'JSON',
    'md': 'Markdown',
    'xml': 'XML',
    'sql': 'SQL',
    'sh': 'Shell',
    'bash': 'Bash',
    'php': 'PHP',
    'rs': 'Rust',
    'cpp': 'C++',
    'c': 'C',
    'h': 'C/C++',
    'java': 'Java',
    'yml': 'YAML',
    'yaml': 'YAML',
    'toml': 'TOML',
    'ini': 'INI',
    'env': 'ENV',
    'txt': 'Plain Text'
  }
  return langMap[ext] || 'Text'
})

// Language detection based on file extension
const getLanguageSupport = () => {
  const ext = props.filename?.split('.').pop()?.toLowerCase()

  const langMap = {
    'js': javascript,
    'mjs': javascript,
    'cjs': javascript,
    'ts': javascript,
    'jsx': javascript,
    'tsx': javascript,
    'vue': vue,
    'py': python,
    'html': html,
    'htm': html,
    'css': css,
    'scss': css,
    'sass': css,
    'json': json,
    'md': markdown,
    'xml': xml,
    'sql': sql,
    'php': php,
    'rs': rust,
    'cpp': cpp,
    'c': cpp,
    'h': cpp,
    'java': java
  }

  const langFunc = langMap[ext]
  return langFunc ? langFunc() : null
}

// Initialize CodeMirror
const initEditor = () => {
  if (!editorRef.value) return

  const languageSupport = getLanguageSupport()
  const extensions = [
    basicSetup,
    oneDark,
    keymap.of([
      indentWithTab,
      {
        key: 'Mod-s',
        run: () => {
          handleSave()
          return true
        }
      },
      {
        key: 'Escape',
        run: () => {
          handleClose()
          return true
        }
      }
    ]),
    EditorView.updateListener.of(update => {
      if (update.docChanged) {
        content.value = update.state.doc.toString()
      }
      if (update.selectionSet) {
        updateCursorInfo(update.state)
      }
    })
  ]

  if (languageSupport) {
    extensions.push(languageSupport)
  }

  const state = EditorState.create({
    doc: content.value,
    extensions
  })

  editorView.value = new EditorView({
    state,
    parent: editorRef.value
  })
}

// Update cursor info
const updateCursorInfo = (state) => {
  const cursor = state.selection.main.head
  const line = state.doc.lineAt(cursor)
  cursorLine.value = line.number
  cursorColumn.value = cursor - line.from + 1

  // Update selection info
  const { from, to } = state.selection.main
  if (from !== to) {
    const selectionLength = to - from
    selectedText.value = `${selectionLength} chars`
  } else {
    selectedText.value = ''
  }
}

// Watch for prop changes
watch(() => props.initialContent, (newContent) => {
  if (newContent !== undefined) {
    content.value = newContent
    originalContent.value = newContent

    // Update editor if it exists
    if (editorView.value) {
      const transaction = editorView.value.state.update({
        changes: {
          from: 0,
          to: editorView.value.state.doc.length,
          insert: newContent
        }
      })
      editorView.value.dispatch(transaction)
    }
  }
}, { immediate: true })

// Watch for modal open
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    if (!editorView.value) {
      initEditor()
    }
    // Focus editor
    editorView.value?.focus()
  } else {
    // Cleanup editor when closing
    if (editorView.value) {
      editorView.value.destroy()
      editorView.value = null
    }
  }
})

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

onUnmounted(() => {
  if (editorView.value) {
    editorView.value.destroy()
  }
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
  flex-shrink: 0;
}

.editor-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.codemirror-wrapper {
  height: 100%;
}

.codemirror-wrapper :deep(.cm-editor) {
  height: 100%;
  font-size: 14px;
  font-family: 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
}

.codemirror-wrapper :deep(.cm-scroller) {
  overflow: auto;
}

.codemirror-wrapper :deep(.cm-gutters) {
  background-color: #1e1e1e;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.codemirror-wrapper :deep(.cm-lineNumbers .cm-gutterElement) {
  padding: 0 12px 0 8px;
}

.editor-footer {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
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