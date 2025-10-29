// @/stores/useProfessionalStore.js
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
  orderBy
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
  const companyInfo = ref(null)
  const contacts = ref([])
  const invoices = ref([])
  const stats = ref({
    totalContacts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  })
  const settings = ref({
    theme: 'classic', // classic, modern, slate, emerald, coral, navy
    darkMode: false
  })

  // Computed
  const hasCompanyInfo = computed(() => !!companyInfo.value)
  const sortedContacts = computed(() =>
    [...contacts.value].sort((a, b) => a.name.localeCompare(b.name))
  )
  const sortedInvoices = computed(() =>
    [...invoices.value].sort((a, b) =>
      (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    )
  )
  const themeClass = computed(() => `theme-professional-${settings.value.theme}`)

  // Company Info Methods
  async function fetchCompanyInfo(userId) {
    try {
      const docRef = doc(firestore, `users/${userId}/professional/company/info`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        companyInfo.value = { id: docSnap.id, ...docSnap.data() }
      } else {
        companyInfo.value = null
      }
      return companyInfo.value
    } catch (error) {
      console.error('Error fetching company info:', error)
      throw error
    }
  }

  async function saveCompanyInfo(userId, data) {
    try {
      const docRef = doc(firestore, `users/${userId}/professional/company/info`)
      const saveData = {
        ...data,
        updatedAt: serverTimestamp()
      }

      if (!data.createdAt) {
        saveData.createdAt = serverTimestamp()
      }

      await setDoc(docRef, saveData, { merge: true })
      companyInfo.value = { id: 'info', ...data }
      return companyInfo.value
    } catch (error) {
      console.error('Error saving company info:', error)
      throw error
    }
  }

  async function uploadCompanyLogo(userId, file) {
    try {
      const storage = getStorage()
      const logoRef = storageRef(storage, `users/${userId}/professional/logo/${file.name}`)

      // Delete old logo if exists
      if (companyInfo.value?.logoUrl) {
        try {
          const oldLogoRef = storageRef(storage, companyInfo.value.logoPath)
          await deleteObject(oldLogoRef)
        } catch (e) {
          // Old logo might not exist, continue
        }
      }

      const snapshot = await uploadBytes(logoRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        logoUrl: downloadURL,
        logoPath: snapshot.ref.fullPath
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      throw error
    }
  }

  // Contacts Methods
  async function fetchContacts(userId) {
    try {
      const contactsRef = collection(firestore, `users/${userId}/professional/contacts/items`)
      const q = query(contactsRef, orderBy('name'))
      const querySnapshot = await getDocs(q)

      contacts.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Update stats
      await updateStats(userId, { totalContacts: contacts.value.length })

      return contacts.value
    } catch (error) {
      console.error('Error fetching contacts:', error)
      throw error
    }
  }

  async function addContact(userId, contactData) {
    try {
      const contactsRef = collection(firestore, `users/${userId}/professional/contacts/items`)
      const newDocRef = doc(contactsRef)

      const contact = {
        ...contactData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(newDocRef, contact)

      const newContact = { id: newDocRef.id, ...contactData }
      contacts.value.push(newContact)

      await updateStats(userId, { totalContacts: contacts.value.length })

      return newContact
    } catch (error) {
      console.error('Error adding contact:', error)
      throw error
    }
  }

  async function updateContact(userId, contactId, updates) {
    try {
      const contactRef = doc(firestore, `users/${userId}/professional/contacts/items/${contactId}`)

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      await updateDoc(contactRef, updateData)

      const index = contacts.value.findIndex(c => c.id === contactId)
      if (index !== -1) {
        contacts.value[index] = { ...contacts.value[index], ...updates }
      }

      return contacts.value[index]
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  }

  async function deleteContact(userId, contactId) {
    try {
      const contactRef = doc(firestore, `users/${userId}/professional/contacts/items/${contactId}`)
      await deleteDoc(contactRef)

      contacts.value = contacts.value.filter(c => c.id !== contactId)
      await updateStats(userId, { totalContacts: contacts.value.length })
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }

  // Invoice Methods
  async function fetchInvoices(userId) {
    try {
      const invoicesRef = collection(firestore, `users/${userId}/professional/invoices/items`)
      const q = query(invoicesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      invoices.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculate stats
      const totalRevenue = invoices.value
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)

      const pendingInvoices = invoices.value.filter(inv => inv.status === 'pending').length

      await updateStats(userId, {
        totalInvoices: invoices.value.length,
        totalRevenue,
        pendingInvoices
      })

      return invoices.value
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    }
  }

  async function addInvoice(userId, invoiceData) {
    try {
      const invoicesRef = collection(firestore, `users/${userId}/professional/invoices/items`)
      const newDocRef = doc(invoicesRef)

      const invoice = {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(newDocRef, invoice)

      const newInvoice = { id: newDocRef.id, ...invoiceData }
      invoices.value.unshift(newInvoice)

      // Update stats
      const totalRevenue = invoices.value
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)

      const pendingInvoices = invoices.value.filter(inv => inv.status === 'pending').length

      await updateStats(userId, {
        totalInvoices: invoices.value.length,
        totalRevenue,
        pendingInvoices
      })

      return newInvoice
    } catch (error) {
      console.error('Error adding invoice:', error)
      throw error
    }
  }

  async function updateInvoice(userId, invoiceId, updates) {
    try {
      const invoiceRef = doc(firestore, `users/${userId}/professional/invoices/items/${invoiceId}`)

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      }

      await updateDoc(invoiceRef, updateData)

      const index = invoices.value.findIndex(inv => inv.id === invoiceId)
      if (index !== -1) {
        invoices.value[index] = { ...invoices.value[index], ...updates }
      }

      // Recalculate stats
      const totalRevenue = invoices.value
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)

      const pendingInvoices = invoices.value.filter(inv => inv.status === 'pending').length

      await updateStats(userId, {
        totalRevenue,
        pendingInvoices
      })

      return invoices.value[index]
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  }

  async function deleteInvoice(userId, invoiceId) {
    try {
      const invoiceRef = doc(firestore, `users/${userId}/professional/invoices/items/${invoiceId}`)
      await deleteDoc(invoiceRef)

      invoices.value = invoices.value.filter(inv => inv.id !== invoiceId)

      // Recalculate stats
      const totalRevenue = invoices.value
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0)

      const pendingInvoices = invoices.value.filter(inv => inv.status === 'pending').length

      await updateStats(userId, {
        totalInvoices: invoices.value.length,
        totalRevenue,
        pendingInvoices
      })
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  }

  // Stats Methods
  async function updateStats(userId, updates) {
    try {
      const statsRef = doc(firestore, `users/${userId}/professional/stats/overview`)
      await setDoc(statsRef, {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true })

      stats.value = { ...stats.value, ...updates }
    } catch (error) {
      console.error('Error updating stats:', error)
    }
  }

  async function fetchStats(userId) {
    try {
      const statsRef = doc(firestore, `users/${userId}/professional/stats/overview`)
      const docSnap = await getDoc(statsRef)

      if (docSnap.exists()) {
        stats.value = docSnap.data()
      }
      return stats.value
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }

  // Settings Methods
  async function fetchSettings(userId) {
    try {
      const settingsRef = doc(firestore, `users/${userId}/professional/settings/preferences`)
      const docSnap = await getDoc(settingsRef)

      if (docSnap.exists()) {
        settings.value = { ...settings.value, ...docSnap.data() }
      }

      // Apply theme and dark mode to document
      applyTheme()

      return settings.value
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }

  async function saveSettings(userId, newSettings) {
    try {
      const settingsRef = doc(firestore, `users/${userId}/professional/settings/preferences`)

      await setDoc(settingsRef, {
        ...newSettings,
        updatedAt: serverTimestamp()
      }, { merge: true })

      settings.value = { ...settings.value, ...newSettings }

      // Apply theme and dark mode to document
      applyTheme()

      return settings.value
    } catch (error) {
      console.error('Error saving settings:', error)
      throw error
    }
  }

  function applyTheme() {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove(
      'theme-professional-classic',
      'theme-professional-modern',
      'theme-professional-slate',
      'theme-professional-emerald',
      'theme-professional-coral',
      'theme-professional-navy'
    )

    // Add current theme class
    root.classList.add(`theme-professional-${settings.value.theme}`)

    // Apply dark mode
    if (settings.value.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // Initialize all professional data
  async function initializeProfessional(userId) {
    try {
      await Promise.all([
        fetchCompanyInfo(userId),
        fetchContacts(userId),
        fetchInvoices(userId),
        fetchStats(userId),
        fetchSettings(userId)
      ])
    } catch (error) {
      console.error('Error initializing professional data:', error)
      throw error
    }
  }

  function clearProfessional() {
    companyInfo.value = null
    contacts.value = []
    invoices.value = []
    stats.value = {
      totalContacts: 0,
      totalInvoices: 0,
      totalRevenue: 0,
      pendingInvoices: 0
    }
    settings.value = {
      theme: 'classic',
      darkMode: false
    }

    // Remove theme classes
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

  return {
    // State
    companyInfo,
    contacts,
    invoices,
    stats,
    settings,
    // Computed
    hasCompanyInfo,
    sortedContacts,
    sortedInvoices,
    themeClass,
    // Company Methods
    fetchCompanyInfo,
    saveCompanyInfo,
    uploadCompanyLogo,
    // Contact Methods
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    // Invoice Methods
    fetchInvoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    // Stats Methods
    fetchStats,
    updateStats,
    // Settings Methods
    fetchSettings,
    saveSettings,
    applyTheme,
    // General
    initializeProfessional,
    clearProfessional
  }
})