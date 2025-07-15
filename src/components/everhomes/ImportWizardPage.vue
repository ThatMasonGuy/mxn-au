<template>
    <div class="relative min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 overflow-hidden">
        <!-- Blurry SVG Background -->
        <svg class="pointer-events-none fixed -top-40 -left-64 w-[900px] h-[700px] opacity-30 blur-2xl z-0" width="900"
            height="700" viewBox="0 0 900 700" fill="none">
            <ellipse cx="400" cy="320" rx="340" ry="160" fill="#14b8a6" />
            <ellipse cx="700" cy="200" rx="200" ry="100" fill="#0e7490" opacity="0.7" />
            <ellipse cx="550" cy="600" rx="220" ry="100" fill="#f59e42" opacity="0.09" />
        </svg>
        <svg class="pointer-events-none fixed -bottom-48 right-0 w-[700px] h-[400px] opacity-20 blur-2xl z-0"
            width="700" height="400" viewBox="0 0 700 400" fill="none">
            <ellipse cx="400" cy="300" rx="320" ry="130" fill="#0891b2" />
            <ellipse cx="180" cy="120" rx="120" ry="80" fill="#fbbf24" opacity="0.13" />
        </svg>
        <!-- Main Layout -->
        <LayoutComponent :header="true" :footer="true" :background="false">
            <!-- Stepper -->
            <div class="max-w-4xl mx-auto pt-24 -mb-12">
                <Stepper>
                    <StepperItem v-for="item in steps" :key="item.step" class="basis-1/5" :step="item.step"
                        :active="item.step === store.currentStep">
                        <StepperTrigger @click="onStepClick(item.step)">
                            <StepperIndicator>
                                <component :is="item.icon" class="w-5 h-5" />
                            </StepperIndicator>
                            <div class="flex flex-col">
                                <StepperTitle>
                                    {{ item.title }}
                                </StepperTitle>
                                <StepperDescription>
                                    {{ item.description }}
                                </StepperDescription>
                            </div>
                        </StepperTrigger>
                        <StepperSeparator v-if="item.step !== steps[steps.length - 1].step" class="w-full h-px" />
                    </StepperItem>
                </Stepper>
            </div>
            <!-- Main Step Slot (renders active step component from parent) -->
            <div class="max-w-4xl mx-auto px-4 pb-10 relative z-10">
                <slot />
            </div>
        </LayoutComponent>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutComponent from './layouts/LayoutComponent.vue'
import { ArrowUpTrayIcon, TableCellsIcon, DocumentMagnifyingGlassIcon, CodeBracketSquareIcon, CloudArrowUpIcon } from '@heroicons/vue/24/solid'
import { useImportWizardStore } from '@/stores/useImportWizardStore'

// Stepper components from shadcn/vue
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperSeparator
} from '@/components/ui/stepper'

const store = useImportWizardStore()

function onStepClick(stepNum) {
    // Only allow navigation to previous or current steps (not "future")
    if (stepNum <= store.currentStep) {
        store.setStep(stepNum)
    }
}

// Step metadata
const steps = [
    {
        step: 1,
        title: 'Upload',
        description: 'Select your spreadsheet file',
        icon: ArrowUpTrayIcon,
    },
    {
        step: 2,
        title: 'Sheet',
        description: 'Pick which sheets to include',
        icon: TableCellsIcon,
    },
    {
        step: 3,
        title: 'Tables',
        description: 'Review and select detected tables',
        icon: DocumentMagnifyingGlassIcon,
    },
    {
        step: 4,
        title: 'Normalize',
        description: 'Clean headers and set data types',
        icon: CodeBracketSquareIcon,
    },
    {
        step: 5,
        title: 'Import',
        description: 'Push data to Firestore',
        icon: CloudArrowUpIcon,
    }
]
</script>