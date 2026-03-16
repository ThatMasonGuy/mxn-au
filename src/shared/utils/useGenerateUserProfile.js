export const generateUserProfile = ({
    uid,
    email,
    provider = 'password',

    // Profile fields
    firstName = '',
    lastName = '',
    userName = '',
    phoneNumber = '',
    countryCode = '',
    country = '',
    dateOfBirth = '',

    // Access
    roles = ['user'],
    areas = { personal: true, topheroes: true },
    permissions = {
        canUseAI: true,
        canAccessBeta: false,
        canEditProfile: true
    },

    // System metadata
    referrer = null
} = {}) => {
    const now = new Date().toISOString()

    const termsAccepted = Object.keys(areas).reduce((acc, area) => {
        acc[area] = 'v1.0'
        return acc
    }, {})

    const profileComplete = !!(firstName && lastName && userName && dateOfBirth)

    return {
        // 🧾 Identity
        uid,
        email,
        provider,
        createdAt: now,
        updatedAt: now,
        avatarUrl: '',

        // 🙍 Profile
        firstName,
        lastName,
        userName,
        phoneNumber,
        countryCode,
        country,
        dateOfBirth,

        // 🔐 Auth & Permissions
        roles,
        areas,
        permissions,

        // 🏁 Status
        flags: {
            profileComplete,
            onboardingComplete: false,
            termsAccepted
        },

        // 📊 Usage context
        lastLogin: now,
        loginCount: 1,
        referrer,
        locale: navigator.language || 'en-AU',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

        // 🧠 System control & lifecycle
        dataVersion: 1,
        archived: false,
        markedForDeletion: false,
        tags: [],

        // 📦 Structural contract for subcollections
        _structure: {
            settings: true,
            logins: true,
            tracking: true,
            userEvents: true,
            moderatorActions: false
        }
    }
}
