// @/stores/useMinecraftStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'

export const useMinecraftStore = defineStore('minecraft', () => {
  const mainStore = useMainStore()

  // State
  const instances = ref([])
  const jobs = ref([])
  const activeInstance = ref(null)
  const unsubscribers = ref([])

  // Computed
  const runningInstances = computed(() =>
    instances.value.filter(i => i.status === 'running')
  )

  const stoppedInstances = computed(() =>
    instances.value.filter(i => i.status === 'stopped')
  )

  const activeJobs = computed(() =>
    jobs.value.filter(j => j.status === 'running' || j.status === 'pending')
  )

  const getInstanceById = computed(() => (id) =>
    instances.value.find(i => i.id === id)
  )

  // Helper to get user's Minecraft collection reference
  const getMinecraftRef = () => {
    if (!mainStore.user?.uid) {
      throw new Error('User not authenticated')
    }
    return collection(firestore, 'users', mainStore.user.uid, 'minecraft')
  }

  const getJobsRef = (instanceId) => {
    if (!mainStore.user?.uid) {
      throw new Error('User not authenticated')
    }
    return collection(firestore, 'users', mainStore.user.uid, 'minecraft', instanceId, 'jobs')
  }

  // Actions - Instance Management
  const createInstance = async (instanceData) => {
    const minecraftRef = getMinecraftRef()

    const instance = {
      ...instanceData,
      status: 'installing',
      eulaAccepted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      worlds: [],
      activeWorld: null,
      vitals: {
        cpu: 0,
        memory: 0,
        disk: 0,
        uptime: 0,
        playersOnline: 0,
        maxPlayers: 20
      }
    }

    const docRef = await addDoc(minecraftRef, instance)
    return { id: docRef.id, ...instance }
  }

  const updateInstance = async (instanceId, updates) => {
    if (!mainStore.user?.uid) throw new Error('User not authenticated')

    const instanceRef = doc(firestore, 'users', mainStore.user.uid, 'minecraft', instanceId)
    await updateDoc(instanceRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })

    // Update local state
    const index = instances.value.findIndex(i => i.id === instanceId)
    if (index !== -1) {
      instances.value[index] = { ...instances.value[index], ...updates }
    }
  }

  const deleteInstance = async (instanceId) => {
    if (!mainStore.user?.uid) throw new Error('User not authenticated')

    const instanceRef = doc(firestore, 'users', mainStore.user.uid, 'minecraft', instanceId)
    await deleteDoc(instanceRef)

    instances.value = instances.value.filter(i => i.id !== instanceId)
  }

  const acceptEula = async (instanceId) => {
    await updateInstance(instanceId, {
      eulaAccepted: true,
      eulaAcceptedAt: new Date().toISOString(),
      eulaAcceptedBy: mainStore.user.email
    })
  }

  // Actions - World Management
  const createWorld = async (instanceId, worldData) => {
    const instance = instances.value.find(i => i.id === instanceId)
    if (!instance) throw new Error('Instance not found')

    const world = {
      id: crypto.randomUUID(),
      ...worldData,
      createdAt: new Date().toISOString(),
      lastPlayed: null,
      size: 0,
      status: 'generating'
    }

    const worlds = [...(instance.worlds || []), world]
    await updateInstance(instanceId, { worlds })

    return world
  }

  const switchWorld = async (instanceId, worldId) => {
    const instance = instances.value.find(i => i.id === instanceId)
    if (!instance) throw new Error('Instance not found')

    const world = instance.worlds.find(w => w.id === worldId)
    if (!world) throw new Error('World not found')

    await updateInstance(instanceId, { activeWorld: worldId })
  }

  const deleteWorld = async (instanceId, worldId) => {
    const instance = instances.value.find(i => i.id === instanceId)
    if (!instance) throw new Error('Instance not found')

    const worlds = instance.worlds.filter(w => w.id !== worldId)
    await updateInstance(instanceId, { worlds })
  }

  const updateWorld = async (instanceId, worldId, updates) => {
    const instance = instances.value.find(i => i.id === instanceId)
    if (!instance) throw new Error('Instance not found')

    const worlds = instance.worlds.map(w =>
      w.id === worldId ? { ...w, ...updates } : w
    )
    await updateInstance(instanceId, { worlds })
  }

  // Actions - Job Management
  const createJob = async (instanceId, jobData) => {
    const jobsRef = getJobsRef(instanceId)

    const job = {
      ...jobData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      progress: 0,
      stages: jobData.stages || [],
      currentStage: 0,
      logs: [],
      error: null
    }

    const docRef = await addDoc(jobsRef, job)
    return { id: docRef.id, ...job }
  }

  const updateJob = async (instanceId, jobId, updates) => {
    if (!mainStore.user?.uid) throw new Error('User not authenticated')

    const jobRef = doc(firestore, 'users', mainStore.user.uid, 'minecraft', instanceId, 'jobs', jobId)
    await updateDoc(jobRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  }

  const addJobLog = async (instanceId, jobId, logEntry) => {
    const job = jobs.value.find(j => j.id === jobId)
    if (!job) return

    const logs = [...(job.logs || []), {
      timestamp: new Date().toISOString(),
      ...logEntry
    }]

    await updateJob(instanceId, jobId, { logs })
  }

  const completeJob = async (instanceId, jobId, result = {}) => {
    await updateJob(instanceId, jobId, {
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
      result
    })
  }

  const failJob = async (instanceId, jobId, error) => {
    await updateJob(instanceId, jobId, {
      status: 'failed',
      error: error.message || error,
      failedAt: new Date().toISOString()
    })
  }

  // Real-time Listeners
  const subscribeToInstances = () => {
    if (!mainStore.user?.uid) return

    const minecraftRef = getMinecraftRef()
    const unsubscribe = onSnapshot(minecraftRef, (snapshot) => {
      instances.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    })

    unsubscribers.value.push(unsubscribe)
  }

  const subscribeToJobs = (instanceId) => {
    if (!mainStore.user?.uid) return

    const jobsRef = getJobsRef(instanceId)
    const unsubscribe = onSnapshot(jobsRef, (snapshot) => {
      const instanceJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        instanceId,
        ...doc.data()
      }))

      // Merge with existing jobs from other instances
      jobs.value = [
        ...jobs.value.filter(j => j.instanceId !== instanceId),
        ...instanceJobs
      ]
    })

    unsubscribers.value.push(unsubscribe)
  }

  const unsubscribeAll = () => {
    unsubscribers.value.forEach(unsubscribe => unsubscribe())
    unsubscribers.value = []
  }

  // Fetch functions (one-time reads)
  const fetchInstances = async () => {
    const minecraftRef = getMinecraftRef()
    const snapshot = await getDocs(minecraftRef)
    instances.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  const fetchJobs = async (instanceId) => {
    const jobsRef = getJobsRef(instanceId)
    const snapshot = await getDocs(jobsRef)
    const instanceJobs = snapshot.docs.map(doc => ({
      id: doc.id,
      instanceId,
      ...doc.data()
    }))

    jobs.value = [
      ...jobs.value.filter(j => j.instanceId !== instanceId),
      ...instanceJobs
    ]
  }

  return {
    // State
    instances,
    jobs,
    activeInstance,

    // Computed
    runningInstances,
    stoppedInstances,
    activeJobs,
    getInstanceById,

    // Actions
    createInstance,
    updateInstance,
    deleteInstance,
    acceptEula,
    createWorld,
    switchWorld,
    deleteWorld,
    updateWorld,
    createJob,
    updateJob,
    addJobLog,
    completeJob,
    failJob,
    fetchInstances,
    fetchJobs,
    subscribeToInstances,
    subscribeToJobs,
    unsubscribeAll
  }
})