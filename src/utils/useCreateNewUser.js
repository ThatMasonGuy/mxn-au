// @/utils/useCreateNewUser.js
import { doc, setDoc, writeBatch, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { generateUserProfile } from './useGenerateUserProfile'

export const useCreateNewUser = async (authUser, profileInput = {}) => {
    if (!authUser?.uid || !authUser?.email) {
        throw new Error('[useCreateNewUser] Missing required user info')
    }

    const batch = writeBatch(firestore)

    try {
        // Generate profile
        const profile = generateUserProfile({
            uid: authUser.uid,
            email: authUser.email,
            provider: authUser.providerData?.[0]?.providerId || 'password',
            ...profileInput
        })

        // Add main profile doc to batch
        const userRef = doc(firestore, `users/${authUser.uid}`)
        batch.set(userRef, profile)

        // Add initial settings for all areas
        if (profile._structure?.settings) {
            // General settings
            const generalSettingsRef = doc(firestore, `users/${authUser.uid}/settings/general`)
            batch.set(generalSettingsRef, {
                emailNotifications: true,
                pushNotifications: false,
                MFAEnabled: false,
                theme: 'system',
                privacy: {
                    showEmail: false,
                    showPhone: false,
                    publicProfile: true
                }
            })

            // Area-specific settings
            for (const area of Object.keys(profile.areas)) {
                if (profile.areas[area]) {
                    const areaSettingsRef = doc(firestore, `users/${authUser.uid}/settings/${area}`)
                    batch.set(areaSettingsRef, {
                        emailNotifications: true,
                        pushNotifications: false,
                        preferences: {}
                    })
                }
            }
        }

        // Add area meta documents
        for (const area of Object.keys(profile.areas)) {
            if (profile.areas[area]) {
                const metaRef = doc(firestore, `users/${authUser.uid}/${area}/meta`)
                batch.set(metaRef, {
                    initializedAt: serverTimestamp(),
                    onboardingComplete: false,
                    dataVersion: 1
                })
            }
        }

        // Commit all changes atomically
        await batch.commit()

        // Add signup records separately (after batch succeeds)
        // These use addDoc to auto-generate IDs
        try {
            // Add signup login record
            await addDoc(collection(firestore, `users/${authUser.uid}/logins`), {
                type: 'signup',
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                source: window.location.href.includes('source=extension') ? 'extension' : 'web',
                ipInfo: {
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: navigator.language || 'en-AU'
                }
            })

            // Add initial user event
            await addDoc(collection(firestore, `users/${authUser.uid}/userEvents`), {
                type: 'account_created',
                timestamp: serverTimestamp(),
                data: {
                    provider: profile.provider,
                    areas: Object.keys(profile.areas).filter(area => profile.areas[area]),
                    device: navigator.userAgent,
                    locale: profile.locale,
                    timezone: profile.timezone
                }
            })

            // Start tracking session
            const { startTrackingSession } = await import('./useTrackingSession')
            await startTrackingSession(authUser.uid)
        } catch (err) {
            console.warn('[useCreateNewUser] Failed to log signup tracking:', err)
            // Don't throw - these are non-critical
        }

        return profile
    } catch (error) {
        console.error('[useCreateNewUser] Failed to create user:', error)
        throw error
    }
}