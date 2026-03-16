// @/features/professional/stores/useProfessionalStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  doc,
  collection,
  setDoc,
  getDoc,
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
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getStorage
} from 'firebase/storage'
import { firestore } from '@/firebase'

export const useProfessionalStore = defineStore('professional', () => {

  // ═══════════════════════════════════════════
  //  STATE
  // ═══════════════════════════════════════════

  const companyInfo = ref(null)
  const contacts = ref([])
  const invoices = ref([])
  const expenses = ref([])
  const catalogue = ref([])
  const jobs = ref([])
  const paymentLinks = ref([])

  const stats = ref({
    totalContacts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    outstandingBalance: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    totalExpenses: 0,
    activeJobs: 0
  })

  const settings = ref({
    theme: 'classic',
    darkMode: false,
    // Currency
    currency: 'AUD',
    currencySymbol: '$',
    // Tax
    taxEnabled: true,
    taxLabel: 'GST',
    taxRate: 10,
    // Invoice numbering
    invoicePrefix: 'INV-',
    invoiceNextNumber: 1,
    // Payment terms
    defaultPaymentTermsDays: 14,
    // Email config
    emailFromName: '',
    emailReplyTo: '',
    emailEnabled: false,
    // Stripe
    stripeAccountId: '',
    stripeConnected: false,
    // Bank details
    bankName: '',
    bankAccountName: '',
    bankBSB: '',
    bankAccountNumber: '',
    // Default notes
    defaultInvoiceNotes: '',
    defaultPaymentInstructions: '',
    // Reminders
    reminderEnabled: false,
    reminderDays: [7, 14, 30] // days after due date
  })

  // ═══════════════════════════════════════════
  //  COMPUTED
  // ═══════════════════════════════════════════

  const hasCompanyInfo = computed(() => !!companyInfo.value)

  const sortedContacts = computed(() =>
    [...contacts.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  )

  const clientContacts = computed(() =>
    sortedContacts.value.filter(c => c.type === 'client')
  )

  const vendorContacts = computed(() =>
    sortedContacts.value.filter(c => c.type === 'vendor')
  )

  const sortedInvoices = computed(() =>
    [...invoices.value].sort((a, b) =>
      (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    )
  )

  const sortedExpenses = computed(() =>
    [...expenses.value].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    )
  )

  const sortedJobs = computed(() =>
    [...jobs.value].sort((a, b) =>
      (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    )
  )

  const activeJobs = computed(() =>
    jobs.value.filter(j => j.status === 'active' || j.status === 'in_progress')
  )

  const sortedCatalogue = computed(() =>
    [...catalogue.value].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  )

  const themeClass = computed(() => `theme-professional-${settings.value.theme}`)

  // ═══════════════════════════════════════════
  //  HELPERS — Firestore paths
  // ═══════════════════════════════════════════

  const basePath = (userId) => `users/${userId}/professional`

  function collectionPath(userId, module) {
    return `${basePath(userId)}/${module}/items`
  }

  // ═══════════════════════════════════════════
  //  HELPERS — File uploads
  // ═══════════════════════════════════════════

  async function uploadFile(userId, folder, file) {
    try {
      const storage = getStorage()
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileRef = storageRef(storage, `users/${userId}/professional/${folder}/${timestamp}_${safeName}`)

      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        name: file.name,
        type: file.type,
        size: file.size
      }
    } catch (error) {
      console.error(`Error uploading file to ${folder}:`, error)
      throw error
    }
  }

  async function deleteFile(filePath) {
    try {
      const storage = getStorage()
      const fileRef = storageRef(storage, filePath)
      await deleteObject(fileRef)
    } catch (error) {
      console.warn('Error deleting file (may not exist):', error)
    }
  }

  async function uploadCompanyLogo(userId, file) {
    // Delete old logo if exists
    if (companyInfo.value?.logoPath) {
      await deleteFile(companyInfo.value.logoPath)
    }
    const result = await uploadFile(userId, 'logo', file)
    return { logoUrl: result.url, logoPath: result.path }
  }

  async function uploadInvoiceAttachment(userId, file) {
    return uploadFile(userId, 'invoices/attachments', file)
  }

  async function uploadExpenseReceipt(userId, file) {
    return uploadFile(userId, 'expenses/receipts', file)
  }

  async function uploadCatalogueImage(userId, file) {
    return uploadFile(userId, 'catalogue/images', file)
  }

  // ═══════════════════════════════════════════
  //  HELPERS — Invoice numbering
  // ═══════════════════════════════════════════

  function generateInvoiceNumber() {
    const prefix = settings.value.invoicePrefix || 'INV-'
    const num = settings.value.invoiceNextNumber || 1
    const padded = String(num).padStart(4, '0')
    return `${prefix}${padded}`
  }

  async function incrementInvoiceNumber(userId) {
    const next = (settings.value.invoiceNextNumber || 1) + 1
    settings.value.invoiceNextNumber = next
    await saveSettings(userId, { invoiceNextNumber: next })
  }

  // ═══════════════════════════════════════════
  //  COMPANY INFO
  // ═══════════════════════════════════════════

  async function fetchCompanyInfo(userId) {
    try {
      const docRef = doc(firestore, `${basePath(userId)}/company`)
      const docSnap = await getDoc(docRef)
      companyInfo.value = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
      return companyInfo.value
    } catch (error) {
      console.error('Error fetching company info:', error)
      throw error
    }
  }

  async function saveCompanyInfo(userId, data) {
    try {
      const docRef = doc(firestore, `${basePath(userId)}/company`)
      const saveData = { ...data, updatedAt: serverTimestamp() }
      if (!data.createdAt) saveData.createdAt = serverTimestamp()

      await setDoc(docRef, saveData, { merge: true })
      companyInfo.value = { id: 'info', ...data }
      return companyInfo.value
    } catch (error) {
      console.error('Error saving company info:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  CONTACTS
  // ═══════════════════════════════════════════

  async function fetchContacts(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'contacts'))
      const q = query(ref, orderBy('name'))
      const snapshot = await getDocs(q)
      contacts.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return contacts.value
    } catch (error) {
      console.error('Error fetching contacts:', error)
      throw error
    }
  }

  async function addContact(userId, contactData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'contacts'))
      const newRef = doc(ref)
      const data = { ...contactData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      await setDoc(newRef, data)
      const newContact = { id: newRef.id, ...contactData }
      contacts.value.push(newContact)
      return newContact
    } catch (error) {
      console.error('Error adding contact:', error)
      throw error
    }
  }

  async function updateContact(userId, contactId, updates) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'contacts')}/${contactId}`)
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
      const index = contacts.value.findIndex(c => c.id === contactId)
      if (index !== -1) contacts.value[index] = { ...contacts.value[index], ...updates }
      return contacts.value[index]
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  }

  async function deleteContact(userId, contactId) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'contacts')}/${contactId}`)
      await deleteDoc(ref)
      contacts.value = contacts.value.filter(c => c.id !== contactId)
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  INVOICES
  // ═══════════════════════════════════════════

  async function fetchInvoices(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'invoices'))
      const q = query(ref, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      invoices.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return invoices.value
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }
  }

  async function addInvoice(userId, invoiceData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'invoices'))
      const newRef = doc(ref)
      const data = { ...invoiceData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      await setDoc(newRef, data)

      const newInvoice = { id: newRef.id, ...invoiceData }
      invoices.value.unshift(newInvoice)

      // Increment invoice number
      await incrementInvoiceNumber(userId)
      await recalculateStats(userId)

      return newInvoice
    } catch (error) {
      console.error('Error adding invoice:', error)
      throw error
    }
  }

  async function updateInvoice(userId, invoiceId, updates) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'invoices')}/${invoiceId}`)
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
      const index = invoices.value.findIndex(inv => inv.id === invoiceId)
      if (index !== -1) invoices.value[index] = { ...invoices.value[index], ...updates }
      await recalculateStats(userId)
      return invoices.value[index]
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  async function deleteInvoice(userId, invoiceId) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'invoices')}/${invoiceId}`)
      // Delete any attachments
      const invoice = invoices.value.find(inv => inv.id === invoiceId)
      if (invoice?.attachments?.length) {
        for (const att of invoice.attachments) {
          if (att.path) await deleteFile(att.path)
        }
      }
      await deleteDoc(ref)
      invoices.value = invoices.value.filter(inv => inv.id !== invoiceId)
      await recalculateStats(userId)
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  EXPENSES
  // ═══════════════════════════════════════════

  async function fetchExpenses(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'expenses'))
      const q = query(ref, orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      expenses.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return expenses.value
    } catch (error) {
      console.error('Error fetching expenses:', error)
      throw error
    }
  }

  async function addExpense(userId, expenseData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'expenses'))
      const newRef = doc(ref)
      const data = { ...expenseData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      await setDoc(newRef, data)
      const newExpense = { id: newRef.id, ...expenseData }
      expenses.value.unshift(newExpense)
      await recalculateStats(userId)
      return newExpense
    } catch (error) {
      console.error('Error adding expense:', error)
      throw error
    }
  }

  async function updateExpense(userId, expenseId, updates) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'expenses')}/${expenseId}`)
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
      const index = expenses.value.findIndex(e => e.id === expenseId)
      if (index !== -1) expenses.value[index] = { ...expenses.value[index], ...updates }
      await recalculateStats(userId)
      return expenses.value[index]
    } catch (error) {
      console.error('Error updating expense:', error)
      throw error
    }
  }

  async function deleteExpense(userId, expenseId) {
    try {
      const expense = expenses.value.find(e => e.id === expenseId)
      if (expense?.receiptPath) await deleteFile(expense.receiptPath)

      const ref = doc(firestore, `${collectionPath(userId, 'expenses')}/${expenseId}`)
      await deleteDoc(ref)
      expenses.value = expenses.value.filter(e => e.id !== expenseId)
      await recalculateStats(userId)
    } catch (error) {
      console.error('Error deleting expense:', error)
      throw error
    }
  }

  function getExpensesForJob(jobId) {
    return expenses.value.filter(e => e.jobId === jobId)
  }

  function getBillableExpensesForJob(jobId) {
    return expenses.value.filter(e => e.jobId === jobId && e.billable)
  }

  // ═══════════════════════════════════════════
  //  CATALOGUE
  // ═══════════════════════════════════════════

  async function fetchCatalogue(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'catalogue'))
      const q = query(ref, orderBy('name'))
      const snapshot = await getDocs(q)
      catalogue.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return catalogue.value
    } catch (error) {
      console.error('Error fetching catalogue:', error)
      throw error
    }
  }

  async function addCatalogueItem(userId, itemData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'catalogue'))
      const newRef = doc(ref)
      const data = { ...itemData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      await setDoc(newRef, data)
      const newItem = { id: newRef.id, ...itemData }
      catalogue.value.push(newItem)
      return newItem
    } catch (error) {
      console.error('Error adding catalogue item:', error)
      throw error
    }
  }

  async function updateCatalogueItem(userId, itemId, updates) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'catalogue')}/${itemId}`)
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
      const index = catalogue.value.findIndex(item => item.id === itemId)
      if (index !== -1) catalogue.value[index] = { ...catalogue.value[index], ...updates }
      return catalogue.value[index]
    } catch (error) {
      console.error('Error updating catalogue item:', error)
      throw error
    }
  }

  async function deleteCatalogueItem(userId, itemId) {
    try {
      const item = catalogue.value.find(i => i.id === itemId)
      if (item?.imagePath) await deleteFile(item.imagePath)

      const ref = doc(firestore, `${collectionPath(userId, 'catalogue')}/${itemId}`)
      await deleteDoc(ref)
      catalogue.value = catalogue.value.filter(i => i.id !== itemId)
    } catch (error) {
      console.error('Error deleting catalogue item:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  JOBS / PROJECTS
  // ═══════════════════════════════════════════

  async function fetchJobs(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'jobs'))
      const q = query(ref, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      jobs.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return jobs.value
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  }

  async function addJob(userId, jobData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'jobs'))
      const newRef = doc(ref)
      const data = { ...jobData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
      await setDoc(newRef, data)
      const newJob = { id: newRef.id, ...jobData }
      jobs.value.unshift(newJob)
      await recalculateStats(userId)
      return newJob
    } catch (error) {
      console.error('Error adding job:', error)
      throw error
    }
  }

  async function updateJob(userId, jobId, updates) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'jobs')}/${jobId}`)
      await updateDoc(ref, { ...updates, updatedAt: serverTimestamp() })
      const index = jobs.value.findIndex(j => j.id === jobId)
      if (index !== -1) jobs.value[index] = { ...jobs.value[index], ...updates }
      await recalculateStats(userId)
      return jobs.value[index]
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  }

  async function deleteJob(userId, jobId) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'jobs')}/${jobId}`)
      await deleteDoc(ref)
      jobs.value = jobs.value.filter(j => j.id !== jobId)
      await recalculateStats(userId)
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    }
  }

  function getJobExpenseTotal(jobId) {
    return getExpensesForJob(jobId).reduce((sum, e) => sum + (e.amount || 0), 0)
  }

  function getJobBillableTotal(jobId) {
    return getBillableExpensesForJob(jobId).reduce((sum, e) => {
      const base = e.amount || 0
      const markup = e.markupPercent || 0
      return sum + base + (base * markup / 100)
    }, 0)
  }

  function getInvoicesForJob(jobId) {
    return invoices.value.filter(inv => inv.jobId === jobId)
  }

  // ═══════════════════════════════════════════
  //  PAYMENT LINKS
  // ═══════════════════════════════════════════

  async function fetchPaymentLinks(userId) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'payments'))
      const q = query(ref, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      paymentLinks.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      return paymentLinks.value
    } catch (error) {
      console.error('Error fetching payment links:', error)
      throw error
    }
  }

  async function createPaymentLink(userId, linkData) {
    try {
      const ref = collection(firestore, collectionPath(userId, 'payments'))
      const newRef = doc(ref)
      const data = {
        ...linkData,
        status: 'pending_creation', // Cloud Function picks this up
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      await setDoc(newRef, data)
      const newLink = { id: newRef.id, ...linkData, status: 'pending_creation' }
      paymentLinks.value.unshift(newLink)
      return newLink
    } catch (error) {
      console.error('Error creating payment link:', error)
      throw error
    }
  }

  async function deletePaymentLink(userId, linkId) {
    try {
      const ref = doc(firestore, `${collectionPath(userId, 'payments')}/${linkId}`)
      await deleteDoc(ref)
      paymentLinks.value = paymentLinks.value.filter(l => l.id !== linkId)
    } catch (error) {
      console.error('Error deleting payment link:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  EMAIL OUTBOX
  //  (Cloud Function watches this collection to send emails)
  // ═══════════════════════════════════════════

  async function sendInvoiceEmail(userId, invoiceId, recipientEmail, subject, body) {
    try {
      const ref = collection(firestore, `${basePath(userId)}/emails/outbox`)
      const newRef = doc(ref)
      const emailData = {
        type: 'invoice',
        invoiceId,
        to: recipientEmail,
        subject,
        body,
        fromName: settings.value.emailFromName || companyInfo.value?.companyName || '',
        replyTo: settings.value.emailReplyTo || '',
        status: 'pending',
        createdAt: serverTimestamp()
      }
      await setDoc(newRef, emailData)
      return { id: newRef.id, ...emailData }
    } catch (error) {
      console.error('Error queuing email:', error)
      throw error
    }
  }

  async function sendReminderEmail(userId, invoiceId, recipientEmail, subject, body) {
    try {
      const ref = collection(firestore, `${basePath(userId)}/emails/outbox`)
      const newRef = doc(ref)
      const emailData = {
        type: 'reminder',
        invoiceId,
        to: recipientEmail,
        subject,
        body,
        fromName: settings.value.emailFromName || companyInfo.value?.companyName || '',
        replyTo: settings.value.emailReplyTo || '',
        status: 'pending',
        createdAt: serverTimestamp()
      }
      await setDoc(newRef, emailData)
      return { id: newRef.id, ...emailData }
    } catch (error) {
      console.error('Error queuing reminder email:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  STATS
  // ═══════════════════════════════════════════

  async function recalculateStats(userId) {
    const totalRevenue = invoices.value
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0)

    const outstandingBalance = invoices.value
      .filter(inv => ['pending', 'sent', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => sum + (inv.total || 0), 0)

    const pendingInvoices = invoices.value
      .filter(inv => inv.status === 'pending' || inv.status === 'sent').length

    const overdueInvoices = invoices.value
      .filter(inv => inv.status === 'overdue').length

    const totalExpenses = expenses.value
      .reduce((sum, e) => sum + (e.amount || 0), 0)

    const activeJobCount = jobs.value
      .filter(j => ['active', 'in_progress'].includes(j.status)).length

    const newStats = {
      totalContacts: contacts.value.length,
      totalInvoices: invoices.value.length,
      totalRevenue,
      outstandingBalance,
      pendingInvoices,
      overdueInvoices,
      totalExpenses,
      activeJobs: activeJobCount
    }

    stats.value = newStats

    // Persist to Firestore
    try {
      const statsRef = doc(firestore, `${basePath(userId)}/stats`)
      await setDoc(statsRef, { ...newStats, updatedAt: serverTimestamp() }, { merge: true })
    } catch (error) {
      console.error('Error persisting stats:', error)
    }
  }

  async function fetchStats(userId) {
    try {
      const statsRef = doc(firestore, `${basePath(userId)}/stats`)
      const docSnap = await getDoc(statsRef)
      if (docSnap.exists()) stats.value = { ...stats.value, ...docSnap.data() }
      return stats.value
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }

  // ═══════════════════════════════════════════
  //  SETTINGS
  // ═══════════════════════════════════════════

  async function fetchSettings(userId) {
    try {
      const settingsRef = doc(firestore, `${basePath(userId)}/settings`)
      const docSnap = await getDoc(settingsRef)
      if (docSnap.exists()) {
        settings.value = { ...settings.value, ...docSnap.data() }
      }
      applyTheme()
      return settings.value
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }

  async function saveSettings(userId, newSettings) {
    try {
      const settingsRef = doc(firestore, `${basePath(userId)}/settings`)
      await setDoc(settingsRef, { ...newSettings, updatedAt: serverTimestamp() }, { merge: true })
      settings.value = { ...settings.value, ...newSettings }
      applyTheme()
      return settings.value
    } catch (error) {
      console.error('Error saving settings:', error)
      throw error
    }
  }

  function applyTheme() {
    const root = document.documentElement
    root.classList.remove(
      'theme-professional-classic',
      'theme-professional-modern',
      'theme-professional-slate',
      'theme-professional-emerald',
      'theme-professional-coral',
      'theme-professional-navy'
    )
    root.classList.add(`theme-professional-${settings.value.theme}`)
    if (settings.value.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // ═══════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════

  async function initializeProfessional(userId) {
    try {
      await Promise.all([
        fetchCompanyInfo(userId),
        fetchContacts(userId),
        fetchInvoices(userId),
        fetchExpenses(userId),
        fetchCatalogue(userId),
        fetchJobs(userId),
        fetchPaymentLinks(userId),
        fetchStats(userId),
        fetchSettings(userId)
      ])
      // Recalculate stats from live data
      await recalculateStats(userId)
    } catch (error) {
      console.error('Error initializing professional data:', error)
      throw error
    }
  }

  function clearProfessional() {
    companyInfo.value = null
    contacts.value = []
    invoices.value = []
    expenses.value = []
    catalogue.value = []
    jobs.value = []
    paymentLinks.value = []
    stats.value = {
      totalContacts: 0,
      totalInvoices: 0,
      totalRevenue: 0,
      outstandingBalance: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      totalExpenses: 0,
      activeJobs: 0
    }
    settings.value = {
      theme: 'classic',
      darkMode: false,
      currency: 'AUD',
      currencySymbol: '$',
      taxEnabled: true,
      taxLabel: 'GST',
      taxRate: 10,
      invoicePrefix: 'INV-',
      invoiceNextNumber: 1,
      defaultPaymentTermsDays: 14,
      emailFromName: '',
      emailReplyTo: '',
      emailEnabled: false,
      stripeAccountId: '',
      stripeConnected: false,
      bankName: '',
      bankAccountName: '',
      bankBSB: '',
      bankAccountNumber: '',
      defaultInvoiceNotes: '',
      defaultPaymentInstructions: '',
      reminderEnabled: false,
      reminderDays: [7, 14, 30]
    }

    const root = document.documentElement
    root.classList.remove(
      'theme-professional-classic',
      'theme-professional-modern',
      'theme-professional-slate',
      'theme-professional-emerald',
      'theme-professional-coral',
      'theme-professional-navy',
      'dark'
    )
  }

  // ═══════════════════════════════════════════
  //  RETURN
  // ═══════════════════════════════════════════

  return {
    // State
    companyInfo,
    contacts,
    invoices,
    expenses,
    catalogue,
    jobs,
    paymentLinks,
    stats,
    settings,

    // Computed
    hasCompanyInfo,
    sortedContacts,
    clientContacts,
    vendorContacts,
    sortedInvoices,
    sortedExpenses,
    sortedJobs,
    activeJobs,
    sortedCatalogue,
    themeClass,

    // File Uploads
    uploadFile,
    deleteFile,
    uploadCompanyLogo,
    uploadInvoiceAttachment,
    uploadExpenseReceipt,
    uploadCatalogueImage,

    // Invoice Numbering
    generateInvoiceNumber,
    incrementInvoiceNumber,

    // Company
    fetchCompanyInfo,
    saveCompanyInfo,

    // Contacts
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,

    // Invoices
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,

    // Expenses
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesForJob,
    getBillableExpensesForJob,

    // Catalogue
    fetchCatalogue,
    addCatalogueItem,
    updateCatalogueItem,
    deleteCatalogueItem,

    // Jobs
    fetchJobs,
    addJob,
    updateJob,
    deleteJob,
    getJobExpenseTotal,
    getJobBillableTotal,
    getInvoicesForJob,

    // Payment Links
    fetchPaymentLinks,
    createPaymentLink,
    deletePaymentLink,

    // Email
    sendInvoiceEmail,
    sendReminderEmail,

    // Stats
    fetchStats,
    recalculateStats,

    // Settings
    fetchSettings,
    saveSettings,
    applyTheme,

    // General
    initializeProfessional,
    clearProfessional
  }
})