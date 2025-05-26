export async function getUserProfile() { /* from Firestore */ }
export async function getUserNickname() { /* from Firestore or custom claims */ }
export async function getUserTimezone() { return 'Australia/Brisbane' } // static fallback
export async function getLastJournalSummaries() { /* Firestore fetch */ }
export async function getRecentChunkSummaries() { /* Redis/Firestore */ }
