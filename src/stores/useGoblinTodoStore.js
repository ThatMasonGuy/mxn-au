// stores/useGoblinTodoStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { firestore } from '@/firebase'
import { useMainStore } from '@/stores/useMainStore'
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, limit
} from 'firebase/firestore'

export const useGoblinTodoStore = defineStore('goblinTodo', () => {
  const mainStore = useMainStore()

  // ─── Path helpers ────────────────────────────────────────────────────────────
  const uid = () => mainStore.user?.uid
  const base = () => `users/${uid()}/personal/goblin-todo`

  const paths = {
    tasks: () => `${base()}/tasks`,
    task: (id) => `${base()}/tasks/${id}`,
    events: (taskId) => `${base()}/tasks/${taskId}/events`,
    days: () => `${base()}/days`,
    day: (id) => `${base()}/days/${id}`,
    blocks: (dayId) => `${base()}/days/${dayId}/blocks`,
    block: (dayId, id) => `${base()}/days/${dayId}/blocks/${id}`,
    dayTasks: () => `${base()}/dayTasks`,
    dayTask: (id) => `${base()}/dayTasks/${id}`,
    settingsDoc: () => base(), // settings live as fields on the goblin-todo doc itself
  }

  const col = (path) => collection(firestore, path)
  const dref = (path) => doc(firestore, path)

  // ─── State ───────────────────────────────────────────────────────────────────
  const tasks = ref({})   // { [taskId]: task }
  const todayId = ref(null)
  const today = ref(null)
  const todayBlocks = ref([])
  const todayDayTasks = ref([])   // raw dayTask docs for today
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // ─── Settings state ─────────────────────────────────────────────────────────
  const customStatuses = ref([]) // [{ id, label, color }]
  const permanentTags = ref([]) // string[]

  const DEFAULT_STATUSES = [
    { id: 'unstarted', label: 'Not started', color: 'zinc' },
    { id: 'in-progress', label: 'In progress', color: 'blue' },
    { id: 'done', label: 'Done', color: 'emerald' },
  ]

  const allStatuses = computed(() => [...DEFAULT_STATUSES, ...customStatuses.value])

  let unsubTasks = null
  let unsubTodayDayTasks = null
  let unsubTodayBlocks = null

  // ─── Computed ────────────────────────────────────────────────────────────────
  const priorityOrder = { high: 0, medium: 1, low: 2 }

  const queue = computed(() =>
    Object.values(tasks.value)
      .filter(t => t.status === 'queue')
      .sort((a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1))
  )

  const todayActiveTasks = computed(() =>
    todayDayTasks.value
      .map(dt => ({ ...dt, task: tasks.value[dt.taskId] || null }))
      .filter(dt => dt.task)
      .sort((a, b) => (a.addedAt?.seconds ?? 0) - (b.addedAt?.seconds ?? 0))
  )

  const allTags = computed(() => {
    const tagSet = new Set()
    Object.values(tasks.value).forEach(t => t.tags?.forEach(tag => tagSet.add(tag)))
    return [...tagSet].sort()
  })

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getTodayStr = () => new Date().toISOString().split('T')[0]

  // ─── Init / Cleanup ──────────────────────────────────────────────────────────
  async function init() {
    if (!uid()) return
    isLoading.value = true
    todayId.value = getTodayStr()

    await getOrCreateToday()
    await loadSettings()
    setupListeners()

    isLoading.value = false
    isInitialized.value = true
  }

  async function getOrCreateToday() {
    const dayRef = dref(paths.day(todayId.value))
    const daySnap = await getDoc(dayRef)

    if (!daySnap.exists()) {
      // Find any open previous day and roll it
      const openQ = query(col(paths.days()), where('closed', '==', false), orderBy('date', 'desc'), limit(1))
      const openSnap = await getDocs(openQ)

      if (!openSnap.empty) {
        const prevDay = openSnap.docs[0]
        if (prevDay.id !== todayId.value) {
          await rollDay(prevDay.id)
        }
      }

      await setDoc(dayRef, {
        date: todayId.value,
        closed: false,
        createdAt: serverTimestamp()
      })
    }

    const fresh = await getDoc(dayRef)
    today.value = { id: fresh.id, ...fresh.data() }
  }

  async function rollDay(dayId) {
    const q = query(col(paths.dayTasks()), where('dayId', '==', dayId), where('status', '==', 'active'))
    const snap = await getDocs(q)

    for (const dtDoc of snap.docs) {
      const { taskId } = dtDoc.data()

      await updateDoc(dtDoc.ref, { status: 'rolled' })
      await updateDoc(dref(paths.task(taskId)), { status: 'queue' })
      await addDoc(col(paths.events(taskId)), {
        type: 'rolled_back',
        dayId,
        timestamp: serverTimestamp()
      })
    }

    await updateDoc(dref(paths.day(dayId)), {
      closed: true,
      closedAt: serverTimestamp()
    })
  }

  function setupListeners() {
    // All tasks
    unsubTasks = onSnapshot(col(paths.tasks()), snap => {
      const map = {}
      snap.forEach(d => { map[d.id] = { id: d.id, ...d.data() } })
      tasks.value = map
    })

    // Today's dayTasks
    const dtQ = query(col(paths.dayTasks()), where('dayId', '==', todayId.value))
    unsubTodayDayTasks = onSnapshot(dtQ, snap => {
      todayDayTasks.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    })

    // Today's blocks
    const bQ = query(col(paths.blocks(todayId.value)), orderBy('order', 'asc'))
    unsubTodayBlocks = onSnapshot(bQ, snap => {
      todayBlocks.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    })
  }

  function cleanup() {
    unsubTasks?.()
    unsubTodayDayTasks?.()
    unsubTodayBlocks?.()
    tasks.value = {}
    todayDayTasks.value = []
    todayBlocks.value = []
    today.value = null
    isInitialized.value = false
  }

  // ─── Task CRUD ───────────────────────────────────────────────────────────────
  async function addTask({ title, description = '', priority = 'medium', tags = [] }) {
    const ref = await addDoc(col(paths.tasks()), {
      title, description, priority, tags,
      status: 'queue',
      createdAt: serverTimestamp(),
      completedAt: null
    })

    await addDoc(col(paths.events(ref.id)), {
      type: 'created',
      timestamp: serverTimestamp()
    })

    return ref.id
  }

  async function updateTask(taskId, updates) {
    await updateDoc(dref(paths.task(taskId)), updates)
  }

  async function deleteTask(taskId) {
    // Remove any active dayTasks
    const q = query(col(paths.dayTasks()), where('taskId', '==', taskId))
    const snap = await getDocs(q)
    for (const dt of snap.docs) await deleteDoc(dt.ref)
    await deleteDoc(dref(paths.task(taskId)))
  }

  // ─── Day task operations ─────────────────────────────────────────────────────
  async function addTaskToDay(taskId) {
    await updateDoc(dref(paths.task(taskId)), { status: 'active' })

    const dtId = `${todayId.value}_${taskId}`
    await setDoc(dref(paths.dayTask(dtId)), {
      taskId,
      dayId: todayId.value,
      status: 'active',
      taskStatus: 'unstarted',
      addedAt: serverTimestamp(),
      completedAt: null
    })

    await addDoc(col(paths.events(taskId)), {
      type: 'added_to_day',
      dayId: todayId.value,
      timestamp: serverTimestamp()
    })
  }

  async function removeTaskFromDay(taskId) {
    const dtId = `${todayId.value}_${taskId}`
    await deleteDoc(dref(paths.dayTask(dtId)))
    await updateDoc(dref(paths.task(taskId)), { status: 'queue' })

    await addDoc(col(paths.events(taskId)), {
      type: 'removed_from_day',
      dayId: todayId.value,
      timestamp: serverTimestamp()
    })
  }

  async function completeTask(taskId) {
    const dtId = `${todayId.value}_${taskId}`
    await updateDoc(dref(paths.dayTask(dtId)), { status: 'completed', completedAt: serverTimestamp() })
    await updateDoc(dref(paths.task(taskId)), { status: 'completed', completedAt: serverTimestamp() })

    await addDoc(col(paths.events(taskId)), {
      type: 'completed',
      dayId: todayId.value,
      timestamp: serverTimestamp()
    })
  }

  async function uncompleteTask(taskId) {
    const dtId = `${todayId.value}_${taskId}`
    await updateDoc(dref(paths.dayTask(dtId)), { status: 'active', completedAt: null })
    await updateDoc(dref(paths.task(taskId)), { status: 'active', completedAt: null })

    await addDoc(col(paths.events(taskId)), {
      type: 'uncompleted',
      dayId: todayId.value,
      timestamp: serverTimestamp()
    })
  }

  async function updateDayTaskStatus(taskId, taskStatus) {
    const dtId = `${todayId.value}_${taskId}`
    await updateDoc(dref(paths.dayTask(dtId)), { taskStatus })
    // If set to 'done', also complete the task
    if (taskStatus === 'done') {
      await updateDoc(dref(paths.task(taskId)), { status: 'completed', completedAt: serverTimestamp() })
      await updateDoc(dref(paths.dayTask(dtId)), { status: 'completed', completedAt: serverTimestamp() })
      await addDoc(col(paths.events(taskId)), { type: 'completed', dayId: todayId.value, timestamp: serverTimestamp() })
    } else {
      // If changing away from done, uncomplete
      const taskSnap = await getDoc(dref(paths.task(taskId)))
      if (taskSnap.data()?.status === 'completed') {
        await updateDoc(dref(paths.task(taskId)), { status: 'active', completedAt: null })
        await updateDoc(dref(paths.dayTask(dtId)), { status: 'active', completedAt: null })
        await addDoc(col(paths.events(taskId)), { type: 'uncompleted', dayId: todayId.value, timestamp: serverTimestamp() })
      }
    }
  }

  // ─── Block operations ─────────────────────────────────────────────────────────
  const nextBlockOrder = (blocks) =>
    blocks.length ? Math.max(...blocks.map(b => b.order)) + 1000 : 1000

  async function addBlock({ type = 'paragraph', content = '', order, taskRef = null, parentId = null, childrenIds = [], indent, checkedLines, language, tableData }, dayId = null) {
    const dId = dayId ?? todayId.value
    const currentBlocks = dayId ? [] : todayBlocks.value // if past day, caller provides order
    const blockData = {
      type,
      content,
      order: order ?? nextBlockOrder(currentBlocks),
      taskRef,
      parentId,
      childrenIds,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    if (indent !== undefined) blockData.indent = indent
    if (checkedLines !== undefined) blockData.checkedLines = checkedLines
    if (language !== undefined) blockData.language = language
    if (tableData !== undefined) blockData.tableData = tableData
    const ref = await addDoc(col(paths.blocks(dId)), blockData)
    return ref.id
  }

  async function updateBlock(blockId, updates, dayId = null) {
    const dId = dayId ?? todayId.value
    try {
      await updateDoc(dref(paths.block(dId, blockId)), {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      if (err.code === 'not-found' || err.message?.includes('No document to update')) {
        console.warn(`[GoblinTodo] Skipped update for deleted block ${blockId}`)
      } else {
        throw err
      }
    }
  }

  async function deleteBlock(blockId, dayId = null) {
    const dId = dayId ?? todayId.value
    try {
      await deleteDoc(dref(paths.block(dId, blockId)))
    } catch (err) {
      if (err.code === 'not-found' || err.message?.includes('No document to update')) {
        console.warn(`[GoblinTodo] Block ${blockId} already deleted`)
      } else {
        throw err
      }
    }
  }

  // ─── Past day loading ─────────────────────────────────────────────────────────
  async function loadDay(dateStr) {
    const daySnap = await getDoc(dref(paths.day(dateStr)))
    if (!daySnap.exists()) return null

    const [blocksSnap, dtSnap] = await Promise.all([
      getDocs(query(col(paths.blocks(dateStr)), orderBy('order', 'asc'))),
      getDocs(query(col(paths.dayTasks()), where('dayId', '==', dateStr)))
    ])

    const blocks = blocksSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    const rawDayTasks = dtSnap.docs.map(d => ({ id: d.id, ...d.data() }))

    const enrichedDayTasks = await Promise.all(rawDayTasks.map(async dt => {
      // Use cached task if available
      const cached = tasks.value[dt.taskId]
      if (cached) return { ...dt, task: cached }
      const snap = await getDoc(dref(paths.task(dt.taskId)))
      return { ...dt, task: snap.exists() ? { id: snap.id, ...snap.data() } : null }
    }))

    return {
      day: { id: daySnap.id, ...daySnap.data() },
      blocks,
      dayTasks: enrichedDayTasks
    }
  }

  // ─── Task lifetime ────────────────────────────────────────────────────────────
  async function loadTaskLifetime(taskId) {
    const taskSnap = await getDoc(dref(paths.task(taskId)))
    if (!taskSnap.exists()) return null

    const task = { id: taskSnap.id, ...taskSnap.data() }

    const [eventsSnap, dtSnap] = await Promise.all([
      getDocs(query(col(paths.events(taskId)), orderBy('timestamp', 'asc'))),
      getDocs(query(col(paths.dayTasks()), where('taskId', '==', taskId)))
    ])

    const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    const dayTaskList = dtSnap.docs.map(d => ({ id: d.id, ...d.data() }))

    // Load linked blocks from each day this task appeared on
    const linkedBlocks = (
      await Promise.all(
        [...new Set(dayTaskList.map(dt => dt.dayId))].map(async dayId => {
          const q = query(col(paths.blocks(dayId)), where('taskRef', '==', taskId))
          const snap = await getDocs(q)
          return snap.docs.map(d => ({ id: d.id, dayId, ...d.data() }))
        })
      )
    ).flat()

    return { task, events, dayTasks: dayTaskList, linkedBlocks }
  }

  // ─── Settings ────────────────────────────────────────────────────────────────
  async function loadSettings() {
    const snap = await getDoc(dref(paths.settingsDoc()))
    if (snap.exists()) {
      const data = snap.data()
      customStatuses.value = data.customStatuses ?? []
      permanentTags.value = data.permanentTags ?? []
    }
  }

  async function saveSettings({ newCustomStatuses, newPermanentTags } = {}) {
    if (newCustomStatuses !== undefined) customStatuses.value = newCustomStatuses
    if (newPermanentTags !== undefined) permanentTags.value = newPermanentTags
    await setDoc(dref(paths.settingsDoc()), {
      customStatuses: customStatuses.value,
      permanentTags: permanentTags.value,
    }, { merge: true })
  }

  // ─── Day list ─────────────────────────────────────────────────────────────────
  async function loadDaysList() {
    const snap = await getDocs(query(col(paths.days()), orderBy('date', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  // ─── All day tasks (for timeline stats) ───────────────────────────────────────
  async function loadAllDayTasks() {
    const snap = await getDocs(col(paths.dayTasks()))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  return {
    // State
    tasks, todayId, today, todayBlocks, todayDayTasks,
    isLoading, isInitialized,
    // Computed
    queue, todayActiveTasks, allTags,
    // Helpers
    getTodayStr,
    // Actions
    init, cleanup,
    addTask, updateTask, deleteTask,
    addTaskToDay, removeTaskFromDay, completeTask, uncompleteTask,
    addBlock, updateBlock, deleteBlock,
    loadDay, loadTaskLifetime, loadDaysList, loadAllDayTasks,
    // Settings
    customStatuses, permanentTags, DEFAULT_STATUSES, allStatuses,
    loadSettings, saveSettings,
    // Day task status
    updateDayTaskStatus,
  }
})