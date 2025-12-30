// @/stores/useImportWizardStore.js
import { defineStore } from 'pinia'

export const useImportWizardStore = defineStore('importWizard', {
    state: () => ({
        // Current wizard step (1-based, so first step is 1)
        currentStep: 1,

        // The uploaded file (object or null)
        file: null,

        // All parsed sheets from file upload
        // Each sheet: { name, rawData, rowCount, columnCount, tables, hasTables, selected }
        parsedSheets: []
    }),
    actions: {
        // Wizard Step Logic
        setStep(step) {
            this.currentStep = step
        },
        nextStep() {
            if (this.currentStep < 5) this.currentStep++
        },
        prevStep() {
            if (this.currentStep > 1) this.currentStep--
        },
        // File Handling
        setFile(file) {
            this.file = file
        },
        resetFile() {
            this.file = null
        },
        // Parsed Sheets
        setParsedSheets(sheets) {
            this.parsedSheets = sheets
        },
        resetParsedSheets() {
            this.parsedSheets = []
        },
        // Update tables for a specific sheet
        updateSheetTables(sheetIndex, tables) {
            if (this.parsedSheets[sheetIndex]) {
                this.parsedSheets[sheetIndex].tables = tables
                this.parsedSheets[sheetIndex].hasTables = tables.length > 0
            }
        },
        // Get all tables across all selected sheets
        getAllTables() {
            return this.parsedSheets
                .filter(s => s.selected)
                .flatMap(s => s.tables || [])
                .filter(t => !t.excluded)
        },
        // Wizard Reset
        resetWizard() {
            this.currentStep = 1
            this.file = null
            this.parsedSheets = []
        }
    },
    persist: true
})
