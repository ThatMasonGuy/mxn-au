// @/composables/useAliases.js
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { useFirestore } from '@/composables/useFirestore'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

/**
 * Aliases management composable
 * Manages custom bash aliases that sync across servers
 */
export const useAliases = () => {
  const { user } = useAuth()
  const db = useFirestore()
  
  const aliases = ref([])
  const loading = ref(false)
  
  /**
   * Get user's aliases document reference
   */
  const getAliasesRef = () => {
    return doc(db, 'users', user.value.uid, 'settings', 'aliases')
  }
  
  /**
   * Load all aliases for current user
   */
  const loadAliases = async () => {
    loading.value = true
    try {
      const aliasesDoc = await getDoc(getAliasesRef())
      
      if (aliasesDoc.exists()) {
        aliases.value = aliasesDoc.data().list || []
      } else {
        // Initialize with some common defaults
        aliases.value = getDefaultAliases()
      }
      
      return aliases.value
    } catch (error) {
      console.error('Error loading aliases:', error)
      return []
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Add a new alias
   */
  const addAlias = async (alias) => {
    try {
      const aliasObj = {
        id: Date.now().toString(),
        name: alias.name,
        command: alias.command,
        description: alias.description || '',
        createdAt: new Date(),
        ...alias
      }
      
      await setDoc(getAliasesRef(), {
        list: arrayUnion(aliasObj),
        updatedAt: new Date()
      }, { merge: true })
      
      aliases.value.push(aliasObj)
      return aliasObj
    } catch (error) {
      console.error('Error adding alias:', error)
      throw error
    }
  }
  
  /**
   * Update an existing alias
   */
  const updateAlias = async (aliasId, updates) => {
    try {
      const index = aliases.value.findIndex(a => a.id === aliasId)
      if (index === -1) throw new Error('Alias not found')
      
      // Remove old version
      const oldAlias = aliases.value[index]
      await setDoc(getAliasesRef(), {
        list: arrayRemove(oldAlias)
      }, { merge: true })
      
      // Add updated version
      const updatedAlias = {
        ...oldAlias,
        ...updates,
        updatedAt: new Date()
      }
      
      await setDoc(getAliasesRef(), {
        list: arrayUnion(updatedAlias),
        updatedAt: new Date()
      }, { merge: true })
      
      aliases.value[index] = updatedAlias
      return updatedAlias
    } catch (error) {
      console.error('Error updating alias:', error)
      throw error
    }
  }
  
  /**
   * Delete an alias
   */
  const deleteAlias = async (aliasId) => {
    try {
      const alias = aliases.value.find(a => a.id === aliasId)
      if (!alias) throw new Error('Alias not found')
      
      await setDoc(getAliasesRef(), {
        list: arrayRemove(alias),
        updatedAt: new Date()
      }, { merge: true })
      
      aliases.value = aliases.value.filter(a => a.id !== aliasId)
    } catch (error) {
      console.error('Error deleting alias:', error)
      throw error
    }
  }
  
  /**
   * Generate bash script to set up all aliases
   */
  const generateAliasScript = () => {
    const lines = [
      '# Custom aliases from MXN.AU SSH Portal',
      '# Generated: ' + new Date().toISOString(),
      ''
    ]
    
    aliases.value.forEach(alias => {
      if (alias.description) {
        lines.push(`# ${alias.description}`)
      }
      lines.push(`alias ${alias.name}='${alias.command}'`)
      lines.push('')
    })
    
    return lines.join('\n')
  }
  
  /**
   * Get setup command to append aliases to .bashrc
   */
  const getSetupCommand = () => {
    const script = generateAliasScript()
    return `cat << 'EOF' >> ~/.bashrc\n${script}EOF\nsource ~/.bashrc`
  }
  
  /**
   * Default aliases for new users
   */
  const getDefaultAliases = () => {
    return [
      {
        id: '1',
        name: 'll',
        command: 'ls -lah',
        description: 'List all files in long format',
        category: 'navigation'
      },
      {
        id: '2',
        name: 'la',
        command: 'ls -A',
        description: 'List all files including hidden',
        category: 'navigation'
      },
      {
        id: '3',
        name: 'home',
        command: 'cd ~',
        description: 'Go to home directory',
        category: 'navigation'
      },
      {
        id: '4',
        name: 'reload',
        command: 'source ~/.bashrc',
        description: 'Reload bash configuration',
        category: 'system'
      },
      {
        id: '5',
        name: 'ports',
        command: 'netstat -tulanp',
        description: 'Show all open ports',
        category: 'network'
      },
      {
        id: '6',
        name: 'myip',
        command: 'curl -s ifconfig.me',
        description: 'Get public IP address',
        category: 'network'
      }
    ]
  }
  
  return {
    aliases,
    loading,
    loadAliases,
    addAlias,
    updateAlias,
    deleteAlias,
    generateAliasScript,
    getSetupCommand,
    getDefaultAliases
  }
}
