<template>
    <ImportWizardPage>
        <component :is="CurrentStepComponent" @next="nextStep" @prev="prevStep" />
    </ImportWizardPage>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImportWizardStore } from '@/features/everhomes/stores/useImportWizardStore'
import ImportWizardPage from '@/features/everhomes/components/ImportWizardPage.vue'

import ImportUploadStep from '@/features/everhomes/components/importSteps/ImportUploadStep.vue'
import ImportSheetSelectStep from '@/features/everhomes/components/importSteps/ImportSheetSelectStep.vue'
import ImportTableReviewStep from '@/features/everhomes/components/importSteps/ImportTableReviewStep.vue'
import ImportNormaliseStep from '@/features/everhomes/components/importSteps/ImportNormaliseStep.vue'
import ImportFirestoreStep from '@/features/everhomes/components/importSteps/ImportFirestoreStep.vue'

// All steps in order
const stepComponents = [
    ImportUploadStep,
    ImportSheetSelectStep,
    ImportTableReviewStep,
    ImportNormaliseStep,
    ImportFirestoreStep
]

const currentStep = ref(1)
const store = useImportWizardStore()

function nextStep() { store.nextStep() }
function prevStep() { store.prevStep() }
const CurrentStepComponent = computed(() => stepComponents[store.currentStep - 1])
</script>