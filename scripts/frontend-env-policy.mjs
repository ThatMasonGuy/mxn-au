// These values are deliberately delivered to every browser. Provider credentials
// and encryption material must be configured on backend secret bindings instead.
const publicVariables = new Set([
  'VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID', 'VITE_FIREBASE_MEASUREMENT_ID', 'VITE_FUNCTIONS_URL',
  'VITE_MINECRAFT_AU_SERVER_API', 'VITE_MINECRAFT_SERVERS_JSON', 'VITE_SSH_WS_URL',
  'VITE_DISCORD_CLIENT_ID', 'VITE_DISCORD_REDIRECT_URI',
  'VITE_BUNGIE_CLIENT_ID', 'VITE_BUNGIE_REDIRECT_URI',
  // Owner-approved no-scope GitHub token for public feeds; never grant it scopes.
  'VITE_GITHUB_TOKEN',
])

export function assertPublicFrontendEnv(env) {
  const unexpected = Object.keys(env).filter(name => name.startsWith('VITE_') && !publicVariables.has(name))
  if (unexpected.length) {
    throw new Error(`Unapproved browser environment variables: ${unexpected.join(', ')}. Move secrets to the backend; only explicitly public configuration belongs in Vite.`)
  }
}
