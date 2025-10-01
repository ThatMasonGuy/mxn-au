// composables/useFirestoreSync.js
import { ref } from 'vue'
import { 
  doc, 
  collection, 
  writeBatch, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { firestore } from '@/firebase'

export const useFirestoreSync = () => {
  const isLoading = ref(false)
  const progress = ref(0)
  const error = ref(null)
  const successMessage = ref('')

  const syncToFirestore = async (heroData) => {
    isLoading.value = true
    error.value = null
    progress.value = 0
    
    try {
      // Create batches (Firestore has a 500 document limit per batch)
      const batches = []
      let currentBatch = writeBatch(firestore)
      let operationCount = 0
      const maxBatchSize = 450 // Leave some room for safety

      const addToBatch = (docRef, data) => {
        if (operationCount >= maxBatchSize) {
          batches.push(currentBatch)
          currentBatch = writeBatch(firestore)
          operationCount = 0
        }
        currentBatch.set(docRef, data)
        operationCount++
      }

      // 1. Sync general metadata
      console.log('📝 Syncing general metadata...')
      const generalMetaRef = doc(firestore, 'topheroes', 'general')
      const generalMetadata = {
        factions: heroData.factions,
        rarities: heroData.rarities,
        tags: heroData.tags,
        hero_bonds: heroData.hero_bonds,
        lastUpdated: serverTimestamp(),
        version: '1.0.0',
        totalHeroes: heroData.heroes.length
      }
      addToBatch(generalMetaRef, generalMetadata)
      progress.value = 10

      // 2. Sync individual factions as separate documents for easier querying
      console.log('🏛️ Syncing faction documents...')
      heroData.factions.forEach(faction => {
        const factionRef = doc(firestore, 'topheroes', 'general', 'factions', faction.id)
        const factionData = {
          ...faction,
          heroCount: heroData.heroes.filter(hero => hero.faction === faction.id).length,
          lastUpdated: serverTimestamp()
        }
        addToBatch(factionRef, factionData)
      })
      progress.value = 20

      // 3. Sync individual rarities
      console.log('💎 Syncing rarity documents...')
      heroData.rarities.forEach(rarity => {
        const rarityRef = doc(firestore, 'topheroes', 'general', 'rarities', rarity.id)
        const rarityData = {
          ...rarity,
          heroCount: heroData.heroes.filter(hero => hero.rarity === rarity.id).length,
          lastUpdated: serverTimestamp()
        }
        addToBatch(rarityRef, rarityData)
      })
      progress.value = 30

      // 4. Sync individual tags
      console.log('🏷️ Syncing tag documents...')
      heroData.tags.forEach(tag => {
        const tagRef = doc(firestore, 'topheroes', 'general', 'tags', tag.id)
        const tagData = {
          ...tag,
          heroCount: heroData.heroes.filter(hero => hero.tags.includes(tag.id)).length,
          lastUpdated: serverTimestamp()
        }
        addToBatch(tagRef, tagData)
      })
      progress.value = 40

      // 5. Sync hero bonds
      console.log('🔗 Syncing hero bond documents...')
      heroData.hero_bonds.forEach((bond, index) => {
        const bondRef = doc(firestore, 'topheroes', 'general', 'bonds', `bond_${index}`)
        const bondData = {
          ...bond,
          id: `bond_${index}`,
          heroIds: bond.heroes.map(heroName => 
            heroData.heroes.find(h => h.name === heroName)?.id
          ).filter(Boolean),
          lastUpdated: serverTimestamp()
        }
        addToBatch(bondRef, bondData)
      })
      progress.value = 50

      // 6. Sync individual heroes
      console.log('🦸 Syncing hero documents...')
      const heroProgressStep = 40 / heroData.heroes.length
      heroData.heroes.forEach((hero, index) => {
        const heroRef = doc(firestore, 'topheroes', 'general', 'heroes', hero.id)
        
        // Calculate hero stats for easier querying
        const factionData = heroData.factions.find(f => f.id === hero.faction)
        const rarityData = heroData.rarities.find(r => r.id === hero.rarity)
        const tagData = hero.tags.map(tagId => 
          heroData.tags.find(t => t.id === tagId)
        ).filter(Boolean)

        // Find bonds this hero participates in
        const participatingBonds = heroData.hero_bonds
          .map((bond, bondIndex) => ({
            ...bond,
            bondId: `bond_${bondIndex}`
          }))
          .filter(bond => bond.heroes.includes(hero.name))

        const heroDocument = {
          ...hero,
          // Denormalized data for easier querying
          factionName: factionData?.name,
          rarityName: rarityData?.name,
          tagNames: tagData.map(tag => tag.name),
          tagDescriptions: tagData.map(tag => ({ id: tag.id, name: tag.name, desc: tag.desc })),
          
          // Bond information
          bonds: participatingBonds.map(bond => ({
            bondId: bond.bondId,
            heroes: bond.heroes,
            buffs: bond.buffs
          })),
          bondCount: participatingBonds.length,
          
          // Metadata
          searchTerms: [
            hero.name.toLowerCase(),
            ...hero.name.toLowerCase().split(' '),
            factionData?.name.toLowerCase(),
            rarityData?.name.toLowerCase(),
            ...tagData.map(tag => tag.name.toLowerCase()),
            ...hero.tags
          ].filter(Boolean),
          
          lastUpdated: serverTimestamp(),
          createdAt: serverTimestamp()
        }
        
        addToBatch(heroRef, heroDocument)
        progress.value = 50 + (index * heroProgressStep)
      })

      // 7. Create initial queues collection setup
      console.log('📋 Setting up queues collection...')
      const queuesMetaRef = doc(firestore, 'topheroes', 'general', 'queues', '_metadata')
      const queuesMetadata = {
        description: 'Admin-created hero queues and team compositions',
        totalQueues: 0,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp()
      }
      addToBatch(queuesMetaRef, queuesMetadata)
      progress.value = 95

      // Add the final batch if it has operations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }

      // 8. Execute all batches
      console.log(`🚀 Executing ${batches.length} batch(es)...`)
      for (let i = 0; i < batches.length; i++) {
        await batches[i].commit()
        console.log(`✅ Batch ${i + 1}/${batches.length} committed`)
      }

      progress.value = 100
      successMessage.value = `Successfully synced ${heroData.heroes.length} heroes and metadata to Firestore!`
      
      console.log('🎉 Firestore sync completed successfully!')
      console.log(`📊 Statistics:`)
      console.log(`   • Heroes: ${heroData.heroes.length}`)
      console.log(`   • Factions: ${heroData.factions.length}`)
      console.log(`   • Rarities: ${heroData.rarities.length}`)
      console.log(`   • Tags: ${heroData.tags.length}`)
      console.log(`   • Bonds: ${heroData.hero_bonds.length}`)
      console.log(`   • Batches executed: ${batches.length}`)

    } catch (err) {
      console.error('❌ Firestore sync failed:', err)
      error.value = `Sync failed: ${err.message}`
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Helper function to verify the sync worked
  const verifySync = async () => {
    try {
      const generalRef = doc(firestore, 'topheroes', 'general')
      const heroesCollection = collection(firestore, 'topheroes', 'general', 'heroes')
      
      console.log('🔍 Verifying Firestore sync...')
      console.log('General doc path:', generalRef.path)
      console.log('Heroes collection path:', heroesCollection.path)
      
      return true
    } catch (err) {
      console.error('❌ Verification failed:', err)
      return false
    }
  }

  // Function to create sample queue for testing
  const createSampleQueue = async () => {
    try {
      const sampleQueueRef = doc(firestore, 'topheroes', 'general', 'queues', 'sample_pvp_meta')
      const sampleQueue = {
        id: 'sample_pvp_meta',
        name: 'PvP Meta Teams',
        description: 'Current meta team compositions for PvP',
        teams: [
          {
            name: 'Nature Control',
            heroes: ['tidecaller', 'monk', 'treeguard', 'sage', 'forest_maiden', 'pixie'],
            strategy: 'Focus on crowd control and sustained damage'
          },
          {
            name: 'Horde Burst',
            heroes: ['wukong', 'storm_maiden', 'desert_prince', 'witch', 'beastmaster', 'wilderness_hunter'],
            strategy: 'High burst damage with strong front line'
          }
        ],
        isActive: true,
        createdBy: 'admin',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      }
      
      await setDoc(sampleQueueRef, sampleQueue)
      console.log('✅ Sample queue created')
      
      // Update queues metadata
      const queuesMetaRef = doc(firestore, 'topheroes', 'general', 'queues', '_metadata')
      await setDoc(queuesMetaRef, {
        description: 'Admin-created hero queues and team compositions',
        totalQueues: 1,
        lastUpdated: serverTimestamp()
      }, { merge: true })
      
      return true
    } catch (err) {
      console.error('❌ Failed to create sample queue:', err)
      return false
    }
  }

  return {
    isLoading,
    progress,
    error,
    successMessage,
    syncToFirestore,
    verifySync,
    createSampleQueue
  }
}