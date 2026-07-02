const express = require('express')
const { getAuth } = require('firebase-admin/auth')

const router = express.Router()

function csvSet(value, transform = (item) => item) {
  return new Set(String(value || '')
    .split(',')
    .map((item) => transform(item.trim()))
    .filter(Boolean))
}

function isAuthorizedOperator(user) {
  const emails = csvSet(process.env.MINECRAFT_ADMIN_EMAILS, (item) => item.toLowerCase())
  const uids = csvSet(process.env.MINECRAFT_ADMIN_UIDS)
  if (!emails.size && !uids.size) return true
  const email = String(user?.email || '').toLowerCase()
  const uid = String(user?.uid || '')
  return (email && emails.has(email)) || (uid && uids.has(uid))
}

async function requireAuth(req, res, next) {
  if (process.env.MINECRAFT_API_DISABLE_AUTH === 'true') {
    req.user = { uid: 'local-dev', email: 'local-dev' }
    return next()
  }

  const header = req.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing bearer token' })
  }

  try {
    req.user = await getAuth().verifyIdToken(token)
    if (!isAuthorizedOperator(req.user)) {
      return res.status(403).json({
        message: 'Minecraft operator access denied',
        code: 'MINECRAFT_OPERATOR_DENIED',
      })
    }
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid bearer token' })
  }
}

router.use(requireAuth)

router.post('/servers/check-readiness', (req, res) => {
  res.json({
    ready: true,
    checks: {
      minecraftStack: true,
      mshManaged: true,
      legacyInstallerRetired: true,
    },
    message: 'The Minecraft panel now manages the existing /mnt/storage-1/minecraft MSH stack.',
  })
})

router.post('/servers/get-setup-commands', (req, res) => {
  res.json({
    commands: [],
    message: 'No generic installer commands are needed for the personal MSH-backed stack.',
  })
})

router.post('/servers/execute-setup', (req, res) => {
  res.json({
    success: true,
    results: [
      {
        status: 'success',
        message: 'Legacy setup skipped; using existing MSH-backed Minecraft stack.',
      },
    ],
  })
})

router.post('/servers/import-instances', (req, res) => {
  res.json({
    success: true,
    message: 'Legacy Firestore instance import is retired; use GET /api/minecraft/servers.',
  })
})

module.exports = router
