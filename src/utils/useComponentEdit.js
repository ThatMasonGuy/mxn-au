// @/utils/useComponentEdit.js
// To Edit Personalised Widgets
import { ref, nextTick } from 'vue';

export function useComponentEdit() {
    const editingTitle = ref(null);
    const showEditIcon = ref(null);
    const titleInput = ref(null);

    function startEditingTitle(componentId) {
        editingTitle.value = componentId;

        // Focus the input field after rendering
        nextTick(() => {
            if (titleInput.value) {
                titleInput.value.focus();
            }
        });
    }

    function finishEditingTitle() {
        editingTitle.value = null;
    }

    return {
        editingTitle,
        showEditIcon,
        titleInput,
        startEditingTitle,
        finishEditingTitle
    };
}