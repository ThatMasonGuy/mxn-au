// stores/useDatasetStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
  where
} from 'firebase/firestore'

import {
  createEmptyDataset,
  createEmptyGuild,
  normalizeGuildData,
  calculateDatasetStats,
  validateDataset,
  generateId,
  generateGuildId,
  removeUndefined
} from '@/lib/datasetHelpers'

import {
  createEventConfig,
  createEventInstance,
  createEmptyEventData
} from '@/lib/eventTemplates'

/**
 * Firestore Structure:
 * 
 * /topheroes/guilds-v2 (document)
 *   - totalDatasets: number
 *   - lastUpdated: timestamp
 * 
 * /topheroes/guilds-v2/datasets/{datasetId} (document)
 *   - name: string
 *   - status: 'draft' | 'active' | 'archived'
 *   - eventConfigs: EventConfig[]
 *   - metadata: {}
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *   - latestVersionId: string
 *   - versionCount: number
 * 
 * /topheroes/guilds-v2/datasets/{datasetId}/versions/{versionId} (document)
 *   - guilds: Guild[]
 *   - stats: {}
 *   - createdAt: timestamp
 *   - changeLog: string
 * 
 * /topheroes/guilds-v2/published/{publishId} (document)
 *   - datasetId: string
 *   - versionId: string
 *   - rankings: computed rankings
 *   - weights: weight config used
 *   - publishedAt: timestamp
 *   - viewCount: number
 */

export const useDatasetStore = defineStore('dataset', () => {
  // ============ STATE ============
  
  // Current working state
  const currentDataset = ref(null)
  const currentVersionId = ref(null)
  const guilds = ref([])
  
  // Lists
  const datasets = ref([])
  
  // UI State
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref(null)
  const lastSaved = ref(null)
  
  // Draft tracking
  const isDirty = ref(false)
  
  // ============ COMPUTED ============
  
  const hasDataset = computed(() => currentDataset.value !== null)
  
  const eventConfigs = computed(() => currentDataset.value?.eventConfigs || [])
  
  const enabledEventConfigs = computed(() => 
    eventConfigs.value.filter(ec => ec.enabled)
  )
  
  const allEventInstances = computed(() => {
    const instances = []
    enabledEventConfigs.value.forEach(ec => {
      ec.instances.forEach(inst => {
        instances.push({
          ...inst,
          eventConfig: ec
        })
      })
    })
    return instances
  })
  
  const validation = computed(() => {
    if (!currentDataset.value) {
      return { valid: false, errors: ['No dataset loaded'], warnings: [] }
    }
    return validateDataset(currentDataset.value, guilds.value)
  })
  
  const stats = computed(() => {
    if (!currentDataset.value || guilds.value.length === 0) {
      return null
    }
    return calculateDatasetStats(guilds.value, eventConfigs.value)
  })
  
  // ============ DATASET MANAGEMENT ============
  
  /**
   * Load all available datasets
   */
  async function loadDatasets() {
    isLoading.value = true
    error.value = null
    
    try {
      const datasetsRef = collection(firestore, 'topheroes', 'guilds-v2', 'datasets')
      const q = query(datasetsRef, orderBy('updatedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      datasets.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return datasets.value
    } catch (err) {
      console.error('Error loading datasets:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Create a new dataset
   */
  async function createDataset(name, options = {}) {
    isLoading.value = true
    error.value = null
    
    try {
      const dataset = createEmptyDataset(name)
      
      // Apply any initial options
      if (options.description) {
        dataset.metadata.description = options.description
      }
      if (options.eventConfigs) {
        dataset.eventConfigs = options.eventConfigs
      }
      
      // Clean undefined values before saving
      const cleanedDataset = removeUndefined(dataset)
      
      // Save to Firestore
      const datasetRef = doc(firestore, 'topheroes', 'guilds-v2', 'datasets', dataset.id)
      await setDoc(datasetRef, {
        ...cleanedDataset,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        latestVersionId: null,
        versionCount: 0
      })
      
      // Update aggregates
      const aggregateRef = doc(firestore, 'topheroes', 'guilds-v2')
      const aggregateSnap = await getDoc(aggregateRef)
      
      if (aggregateSnap.exists()) {
        await updateDoc(aggregateRef, {
          totalDatasets: (aggregateSnap.data().totalDatasets || 0) + 1,
          lastUpdated: serverTimestamp()
        })
      } else {
        await setDoc(aggregateRef, {
          totalDatasets: 1,
          lastUpdated: serverTimestamp()
        })
      }
      
      // Refresh dataset list
      await loadDatasets()
      
      return dataset
    } catch (err) {
      console.error('Error creating dataset:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Load a dataset and its latest version (including guild data with power)
   */
  async function loadDataset(datasetId) {
    isLoading.value = true
    error.value = null
    
    try {
      const datasetRef = doc(firestore, 'topheroes', 'guilds-v2', 'datasets', datasetId)
      const datasetSnap = await getDoc(datasetRef)
      
      if (!datasetSnap.exists()) {
        throw new Error('Dataset not found')
      }
      
      currentDataset.value = {
        id: datasetSnap.id,
        ...datasetSnap.data()
      }
      
      // Reset working state
      guilds.value = []
      currentVersionId.value = null
      isDirty.value = false
      
      // Automatically load the latest version if it exists
      if (currentDataset.value.latestVersionId) {
        await loadVersion(datasetId, currentDataset.value.latestVersionId)
      } else {
        // No versions yet - start with empty guilds
        guilds.value = [createEmptyGuild(), createEmptyGuild(), createEmptyGuild()]
      }
      
      return currentDataset.value
    } catch (err) {
      console.error('Error loading dataset:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Load a specific version's guild data
   */
  async function loadVersion(datasetId, versionId = null) {
    isLoading.value = true
    error.value = null
    
    try {
      // Ensure dataset is loaded
      if (!currentDataset.value || currentDataset.value.id !== datasetId) {
        await loadDataset(datasetId)
      }
      
      // Use latest version if not specified
      const targetVersionId = versionId || currentDataset.value.latestVersionId
      
      if (!targetVersionId) {
        // No versions yet - start with empty guilds
        guilds.value = [createEmptyGuild(), createEmptyGuild(), createEmptyGuild()]
        currentVersionId.value = null
        isDirty.value = false
        return { guilds: guilds.value, version: null }
      }
      
      // Load version data
      const versionRef = doc(
        firestore, 
        'topheroes', 'guilds-v2', 'datasets', datasetId, 'versions', targetVersionId
      )
      const versionSnap = await getDoc(versionRef)
      
      if (!versionSnap.exists()) {
        throw new Error('Version not found')
      }
      
      const versionData = versionSnap.data()
      
      // Normalize guild data to current event config
      guilds.value = (versionData.guilds || []).map(g => 
        normalizeGuildData(g, currentDataset.value.eventConfigs)
      )
      
      currentVersionId.value = targetVersionId
      isDirty.value = false
      
      return {
        guilds: guilds.value,
        version: {
          id: targetVersionId,
          ...versionData
        }
      }
    } catch (err) {
      console.error('Error loading version:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Update dataset configuration (name, status, event configs, etc.)
   */
  async function updateDatasetConfig(updates) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    isSaving.value = true
    error.value = null
    
    try {
      const datasetRef = doc(
        firestore, 
        'topheroes', 'guilds-v2', 'datasets', currentDataset.value.id
      )
      
      // Clean undefined values before saving
      const cleanedUpdates = removeUndefined(updates)
      
      const updateData = {
        ...cleanedUpdates,
        updatedAt: serverTimestamp()
      }
      
      await updateDoc(datasetRef, updateData)
      
      // Update local state
      currentDataset.value = {
        ...currentDataset.value,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      return currentDataset.value
    } catch (err) {
      console.error('Error updating dataset config:', err)
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }
  
  /**
   * Save current guild data as a new version
   */
  async function saveVersion(changeLog = '') {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    isSaving.value = true
    error.value = null
    
    try {
      const versionId = `v${Date.now()}`
      const timestamp = new Date().toISOString()
      
      // Filter out empty guilds
      const guildsToSave = guilds.value.filter(g => g.shorthand?.trim())
      
      // Normalize all guilds
      const normalizedGuilds = guildsToSave.map(g => 
        normalizeGuildData(g, currentDataset.value.eventConfigs)
      )
      
      // Generate IDs for guilds without them
      normalizedGuilds.forEach(g => {
        if (!g.id && g.shorthand) {
          g.id = generateGuildId(g.shorthand)
        }
      })
      
      // Calculate stats
      const versionStats = calculateDatasetStats(normalizedGuilds, currentDataset.value.eventConfigs)
      
      // Clean undefined values
      const cleanedGuilds = removeUndefined(normalizedGuilds)
      const cleanedStats = removeUndefined(versionStats)
      
      const batch = writeBatch(firestore)
      
      // Create version document
      const versionRef = doc(
        firestore,
        'topheroes', 'guilds-v2', 'datasets', currentDataset.value.id, 'versions', versionId
      )
      
      batch.set(versionRef, {
        guilds: cleanedGuilds,
        stats: cleanedStats,
        createdAt: timestamp,
        changeLog: changeLog || `Version ${versionId}`
      })
      
      // Update dataset metadata
      const datasetRef = doc(
        firestore,
        'topheroes', 'guilds-v2', 'datasets', currentDataset.value.id
      )
      
      batch.update(datasetRef, {
        latestVersionId: versionId,
        versionCount: (currentDataset.value.versionCount || 0) + 1,
        updatedAt: serverTimestamp()
      })
      
      await batch.commit()
      
      // Update local state
      currentVersionId.value = versionId
      currentDataset.value.latestVersionId = versionId
      currentDataset.value.versionCount = (currentDataset.value.versionCount || 0) + 1
      lastSaved.value = timestamp
      isDirty.value = false
      
      return {
        versionId,
        stats: versionStats
      }
    } catch (err) {
      console.error('Error saving version:', err)
      error.value = err.message
      throw err
    } finally {
      isSaving.value = false
    }
  }
  
  /**
   * Delete a dataset
   */
  async function deleteDataset(datasetId) {
    isLoading.value = true
    error.value = null
    
    try {
      // Delete all versions first
      const versionsRef = collection(
        firestore,
        'topheroes', 'guilds-v2', 'datasets', datasetId, 'versions'
      )
      const versionsSnap = await getDocs(versionsRef)
      
      const batch = writeBatch(firestore)
      
      versionsSnap.docs.forEach(versionDoc => {
        batch.delete(versionDoc.ref)
      })
      
      // Delete dataset document
      const datasetRef = doc(firestore, 'topheroes', 'guilds-v2', 'datasets', datasetId)
      batch.delete(datasetRef)
      
      await batch.commit()
      
      // Clear current if it was the deleted one
      if (currentDataset.value?.id === datasetId) {
        currentDataset.value = null
        currentVersionId.value = null
        guilds.value = []
      }
      
      // Refresh list
      await loadDatasets()
      
      return true
    } catch (err) {
      console.error('Error deleting dataset:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // ============ EVENT CONFIGURATION ============
  
  /**
   * Add an event config to the current dataset
   */
  async function addEventConfig(templateId, options = {}) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const eventConfig = createEventConfig(templateId, options)
    
    const newConfigs = [...currentDataset.value.eventConfigs, eventConfig]
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
    
    return eventConfig
  }
  
  /**
   * Update an event config
   */
  async function updateEventConfig(templateId, updates) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const newConfigs = currentDataset.value.eventConfigs.map(ec => {
      if (ec.templateId === templateId) {
        return { ...ec, ...updates }
      }
      return ec
    })
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
  }
  
  /**
   * Remove an event config
   */
  async function removeEventConfig(templateId) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const newConfigs = currentDataset.value.eventConfigs.filter(
      ec => ec.templateId !== templateId
    )
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
  }
  
  /**
   * Add an event instance to an event config
   */
  async function addEventInstance(templateId, instanceData = {}) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const eventConfig = currentDataset.value.eventConfigs.find(
      ec => ec.templateId === templateId
    )
    
    if (!eventConfig) {
      throw new Error('Event config not found')
    }
    
    const instance = createEventInstance(eventConfig, instanceData)
    
    const newConfigs = currentDataset.value.eventConfigs.map(ec => {
      if (ec.templateId === templateId) {
        return {
          ...ec,
          instances: [...ec.instances, instance]
        }
      }
      return ec
    })
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
    
    // Initialize event data for all guilds
    guilds.value = guilds.value.map(g => ({
      ...g,
      events: {
        ...g.events,
        [instance.id]: createEmptyEventData(eventConfig, instance)
      }
    }))
    
    isDirty.value = true
    
    return instance
  }
  
  /**
   * Update an event instance
   */
  async function updateEventInstance(templateId, instanceId, updates) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const newConfigs = currentDataset.value.eventConfigs.map(ec => {
      if (ec.templateId === templateId) {
        return {
          ...ec,
          instances: ec.instances.map(inst => {
            if (inst.id === instanceId) {
              return { ...inst, ...updates }
            }
            return inst
          })
        }
      }
      return ec
    })
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
  }
  
  /**
   * Remove an event instance
   */
  async function removeEventInstance(templateId, instanceId) {
    if (!currentDataset.value) {
      throw new Error('No dataset loaded')
    }
    
    const newConfigs = currentDataset.value.eventConfigs.map(ec => {
      if (ec.templateId === templateId) {
        return {
          ...ec,
          instances: ec.instances.filter(inst => inst.id !== instanceId)
        }
      }
      return ec
    })
    
    await updateDatasetConfig({ eventConfigs: newConfigs })
    
    // Remove event data from guilds
    guilds.value = guilds.value.map(g => {
      const { [instanceId]: removed, ...remainingEvents } = g.events || {}
      return { ...g, events: remainingEvents }
    })
    
    isDirty.value = true
  }
  
  // ============ GUILD MANAGEMENT ============
  
  /**
   * Add a new empty guild
   */
  function addGuild() {
    const guild = createEmptyGuild()
    
    // Initialize events for all configured event instances
    currentDataset.value?.eventConfigs?.forEach(ec => {
      if (!ec.enabled) return
      ec.instances.forEach(inst => {
        guild.events[inst.id] = createEmptyEventData(ec, inst)
      })
    })
    
    guilds.value.push(guild)
    isDirty.value = true
    
    return guild
  }
  
  /**
   * Remove a guild by index
   */
  function removeGuild(index) {
    guilds.value.splice(index, 1)
    isDirty.value = true
  }
  
  /**
   * Update a guild's basic info
   */
  function updateGuild(index, updates) {
    if (guilds.value[index]) {
      guilds.value[index] = { ...guilds.value[index], ...updates }
      
      // Generate ID if shorthand changed and no ID
      if (updates.shorthand && !guilds.value[index].id) {
        guilds.value[index].id = generateGuildId(updates.shorthand)
      }
      
      isDirty.value = true
    }
  }
  
  /**
   * Update a guild's event data
   */
  function updateGuildEventData(guildIndex, eventInstanceId, eventData) {
    if (guilds.value[guildIndex]) {
      guilds.value[guildIndex].events = {
        ...guilds.value[guildIndex].events,
        [eventInstanceId]: eventData
      }
      isDirty.value = true
    }
  }
  
  /**
   * Bulk update guilds (for import)
   */
  function setGuilds(newGuilds) {
    guilds.value = newGuilds.map(g => 
      normalizeGuildData(g, currentDataset.value?.eventConfigs)
    )
    isDirty.value = true
  }
  
  // ============ IMPORT/EXPORT ============
  
  /**
   * Export current data as JSON
   */
  function exportJSON() {
    return {
      dataset: currentDataset.value,
      versionId: currentVersionId.value,
      guilds: guilds.value,
      exportedAt: new Date().toISOString()
    }
  }
  
  /**
   * Import data from JSON
   */
  function importJSON(data) {
    if (data.guilds && Array.isArray(data.guilds)) {
      guilds.value = data.guilds.map(g => 
        normalizeGuildData(g, currentDataset.value?.eventConfigs)
      )
      isDirty.value = true
    }
  }
  
  // ============ LOCAL STORAGE DRAFT ============
  
  const DRAFT_KEY = 'dataset-draft-v2'
  
  /**
   * Save current state to localStorage
   */
  function saveDraft() {
    if (!currentDataset.value) return
    
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        datasetId: currentDataset.value.id,
        guilds: guilds.value,
        savedAt: new Date().toISOString()
      }))
    } catch (err) {
      console.error('Error saving draft:', err)
    }
  }
  
  /**
   * Load draft from localStorage
   */
  function loadDraft() {
    try {
      const data = localStorage.getItem(DRAFT_KEY)
      if (!data) return null
      
      const parsed = JSON.parse(data)
      
      // Only load if it matches current dataset
      if (currentDataset.value && parsed.datasetId === currentDataset.value.id) {
        guilds.value = parsed.guilds.map(g => 
          normalizeGuildData(g, currentDataset.value.eventConfigs)
        )
        return parsed
      }
      
      return null
    } catch (err) {
      console.error('Error loading draft:', err)
      return null
    }
  }
  
  /**
   * Clear draft
   */
  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  }
  
  // ============ RESET ============
  
  function reset() {
    currentDataset.value = null
    currentVersionId.value = null
    guilds.value = []
    isDirty.value = false
    error.value = null
  }
  
  return {
    // State
    currentDataset,
    currentVersionId,
    guilds,
    datasets,
    isLoading,
    isSaving,
    error,
    lastSaved,
    isDirty,
    
    // Computed
    hasDataset,
    eventConfigs,
    enabledEventConfigs,
    allEventInstances,
    validation,
    stats,
    
    // Dataset management
    loadDatasets,
    createDataset,
    loadDataset,
    loadVersion,
    updateDatasetConfig,
    saveVersion,
    deleteDataset,
    
    // Event configuration
    addEventConfig,
    updateEventConfig,
    removeEventConfig,
    addEventInstance,
    updateEventInstance,
    removeEventInstance,
    
    // Guild management
    addGuild,
    removeGuild,
    updateGuild,
    updateGuildEventData,
    setGuilds,
    
    // Import/Export
    exportJSON,
    importJSON,
    
    // Draft management
    saveDraft,
    loadDraft,
    clearDraft,
    
    // Utils
    reset
  }
})
