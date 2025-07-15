<template>
    <ImportWizardPage>
        <component :is="CurrentStepComponent" @next="nextStep" @prev="prevStep" />
    </ImportWizardPage>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImportWizardStore } from '@/stores/useImportWizardStore'
import ImportWizardPage from '@/components/everhomes/ImportWizardPage.vue'

import ImportUploadStep from '@/components/everhomes/importSteps/ImportUploadStep.vue'
import ImportSheetSelectStep from '@/components/everhomes/importSteps/ImportSheetSelectStep.vue'
import ImportTableReviewStep from '@/components/everhomes/importSteps/ImportTableReviewStep.vue'
import ImportNormaliseStep from '@/components/everhomes/importSteps/ImportNormaliseStep.vue'
import ImportFirestoreStep from '@/components/everhomes/importSteps/ImportFirestoreStep.vue'

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