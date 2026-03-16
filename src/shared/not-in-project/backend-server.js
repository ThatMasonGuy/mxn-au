// backend-server.js

const express = require('express')
const { WebSocketServer } = require('ws')
const { Client } = require('ssh2')
const http = require('http')
const cors = require('cors')
const admin = require('firebase-admin')
const minecraftRoutes = require('./minecraft-routes')
const minecraftSetupRoutes = require('./minecraft-setup-routes')
const { router: adminRouter, logConnection, recordLatency } = require('./backend-admin-routes')

// Load environment variables
require('dotenv').config()

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })
})

const app = express()
const server = http.createServer(app)

// Enable CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  credentials: true
}))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Initialize admin session tracking (add after other globals)
global.adminSessions = new Map()

// Add admin routes (after other app.use statements, before WebSocket setup)
app.use('/api/admin', adminRouter)

// Minecraft routes
app.use(express.json())
app.use('/api/minecraft', minecraftRoutes)
app.use('/api/minecraft', minecraftSetupRoutes)

// WebSocket server
const wss = new WebSocketServer({ server })
const sessions = new Map()

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection from:', req.socket.remoteAddress)

  let sshClient = null
  let sshStream = null
  let sessionId = null
  let authenticated = false
  let keepAliveInterval = null
  let serverConfig = null
  let terminalInfo = null
  let userId = null
  let authTimestamp = null

  // Start keepalive
  keepAliveInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping()
    }
  }, 30000)

  ws.on('pong', () => {
    // Client responded, connection alive
  })

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString())

      // Handle authentication
      if (data.type === 'auth') {
        try {
          // Verify Firebase token
          const decodedToken = await admin.auth().verifyIdToken(data.token)
          authenticated = true
          sessionId = `${decodedToken.uid}_${Date.now()}`
          userId = decodedToken.uid
          authTimestamp = Date.now()

          console.log('User authenticated:', decodedToken.email)

          global.adminSessions.set(sessionId, {
            user: decodedToken.email,
            serverId: data.serverId,
            connectedAt: Date.now(),
            lastActivity: Date.now(),
            latencyHistory: []
          })

          logConnection('auth', {
            email: decodedToken.email,
            serverId: data.serverId
          })

          userId = decodedToken.uid

          terminalInfo = data.terminalInfo || {
            term: 'xterm-256color',
            cols: 80,
            rows: 24
          }
          console.log('Terminal info:', terminalInfo)

          // Get server config from Firestore
          serverConfig = await getServerConfig(decodedToken.uid, data.serverId)

          if (!serverConfig) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Server configuration not found'
            }))
            return
          }

          // Decrypt credentials
          const credentials = decryptCredentials(serverConfig)

          // Connect to SSH
          connectSSH(credentials, sessionId)

        } catch (error) {
          console.error('Authentication failed:', error)
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Authentication failed'
          }))
          ws.close()
        }
        return
      }

      if (!authenticated) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Not authenticated'
        }))
        return
      }

      // Handle terminal input
      if (data.type === 'input' && sshStream) {
        sshStream.write(data.data)
      }

      // Handle terminal resize
      if (data.type === 'resize' && sshStream) {
        sshStream.setWindow(data.rows, data.cols)
      }

      // Handle file read request
      if (data.type === 'read-file' && sshClient) {
        console.log('Reading file:', data.filename, 'from path:', data.path)
        handleFileRead(ws, sshClient, data.filename, data.path)
      }

      // Handle file write request
      if (data.type === 'write-file' && sshClient) {
        console.log('Writing file:', data.filepath)
        handleFileWrite(ws, sshClient, data.filepath, data.content)
      }

      // Handle ping (keepalive)
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }))
      }

    } catch (error) {
      console.error('Error processing message:', error)
    }
  })

  ws.on('close', () => {
    console.log('WebSocket closed')

    if (sessionId) {
      const session = global.adminSessions.get(sessionId)
      if (session) {
        logConnection('disconnect', {
          email: session.user,
          serverId: session.serverId
        })
      }
      global.adminSessions.delete(sessionId)
    }

    if (keepAliveInterval) clearInterval(keepAliveInterval)
    if (sshClient) sshClient.end()
    if (sessionId) sessions.delete(sessionId)
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  function connectSSH(credentials, sessionId) {
    sshClient = new Client()

    const sshConfig = {
      host: serverConfig.host,
      port: serverConfig.port || 22,
      username: serverConfig.username,
    }

    if (serverConfig.authMethod === 'password') {
      sshConfig.password = credentials.password
    } else {
      sshConfig.privateKey = credentials.privateKey
    }

    sshClient.on('ready', () => {
      console.log('SSH connection established')

      if (authTimestamp && sessionId) {
        const latency = Date.now() - authTimestamp
        recordLatency(sessionId, latency)
        console.log(`[Latency] Session ${sessionId}: ${latency}ms`)
      }

      const session = global.adminSessions.get(sessionId)
      if (session) {
        logConnection('connect', {
          email: session.user,
          serverId: session.serverId
        })
      }

      ws.send(JSON.stringify({
        type: 'connected',
        message: 'SSH connection established'
      }))

      // CHANGED: Pass terminal options to shell()
      const shellOptions = {
        term: terminalInfo.term,
        cols: terminalInfo.cols,
        rows: terminalInfo.rows
      }

      console.log('Requesting shell with options:', shellOptions)

      sshClient.shell(shellOptions, (err, stream) => {
        if (err) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to start shell'
          }))
          return
        }

        sshStream = stream
        sessions.set(sessionId, { client: sshClient, stream: sshStream, ws })

        stream.on('data', (data) => {
          ws.send(JSON.stringify({
            type: 'output',
            data: data.toString('utf-8')
          }))
        })

        stream.on('close', () => {
          ws.send(JSON.stringify({
            type: 'disconnected',
            message: 'SSH connection closed'
          }))
          ws.close()
        })

        stream.stderr.on('data', (data) => {
          ws.send(JSON.stringify({
            type: 'output',
            data: data.toString('utf-8')
          }))
        })
      })
    })

    sshClient.on('error', (err) => {
      console.error('SSH error:', err)
      ws.send(JSON.stringify({
        type: 'error',
        message: `SSH error: ${err.message}`
      }))
    })

    sshClient.on('close', () => {
      console.log('SSH connection closed')
    })

    sshClient.connect(sshConfig)
  }
})

async function getServerConfig(userId, serverId) {
  try {
    const db = admin.firestore()
    const serverDoc = await db
      .collection('users')
      .doc(userId)
      .collection('servers')
      .doc(serverId)
      .get()

    if (!serverDoc.exists) return null

    return { id: serverDoc.id, ...serverDoc.data() }
  } catch (error) {
    console.error('Error fetching server config:', error)
    return null
  }
}

function decryptCredentials(serverConfig) {
  const CryptoJS = require('crypto-js')
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

  if (serverConfig.authMethod === 'password') {
    const bytes = CryptoJS.AES.decrypt(serverConfig.encryptedPassword, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)

    return {
      password: decrypted
    }
  } else {
    const bytes = CryptoJS.AES.decrypt(serverConfig.encryptedKey, ENCRYPTION_KEY)
    return {
      privateKey: bytes.toString(CryptoJS.enc.Utf8)
    }
  }
}

// Handle file read request
function handleFileRead(ws, sshClient, filename, currentPath) {
  console.log('=== FILE READ DEBUG ===')
  console.log('Filename:', filename)
  console.log('Current Path:', currentPath)

  // Resolve the full file path
  let filepath = filename
  if (!filepath.startsWith('/') && !filepath.startsWith('~')) {
    // Relative path - prepend current directory
    filepath = `${currentPath}/${filename}`
  }

  console.log('Resolved filepath:', filepath)

  // Expand ~ to home directory
  if (filepath.startsWith('~/')) {
    // Get home directory via SSH exec
    sshClient.exec('echo $HOME', (err, stream) => {
      if (err) {
        filepath = filepath.replace('~', '/home/' + serverConfig.username)
        continueRead()
        return
      }

      let homeDir = ''
      stream.on('data', (data) => {
        homeDir += data.toString()
      })

      stream.on('close', () => {
        homeDir = homeDir.trim()
        filepath = filepath.replace('~', homeDir)
        console.log('Expanded path for read:', filename, '->', filepath)
        continueRead()
      })
    })
  } else {
    continueRead()
  }

  function continueRead() {
    // Read file via SFTP
    sshClient.sftp((err, sftp) => {
      if (err) {
        ws.send(JSON.stringify({
          type: 'file-error',
          message: `Failed to start SFTP: ${err.message}`
        }))
        return
      }

      sftp.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
          console.log('SFTP read error:', err.message)
          console.log('Error code:', err.code)

          // File doesn't exist - open empty editor (like nano does)
          if (err.code === 2 || err.message.includes('No such file')) {
            console.log('File does not exist, opening empty editor:', filepath)
            ws.send(JSON.stringify({
              type: 'file-content',
              filename: filename,
              filepath: filepath,
              content: '',
              isNew: true
            }))
          } else {
            // Other error
            console.log('Other SFTP error:', err)
            ws.send(JSON.stringify({
              type: 'file-error',
              message: `Failed to read file: ${err.message}`
            }))
          }
          sftp.end()
          return
        }

        console.log('File read successfully, size:', data.length, 'bytes')

        // File exists - send content
        ws.send(JSON.stringify({
          type: 'file-content',
          filename: filename,
          filepath: filepath,
          content: data,
          isNew: false
        }))

        sftp.end()
      })
    })
  }
}

// Handle file write request
function handleFileWrite(ws, sshClient, filepath, content) {
  // Expand ~ to home directory
  if (filepath.startsWith('~/')) {
    // Get home directory via SSH exec
    sshClient.exec('echo $HOME', (err, stream) => {
      if (err) {
        // Fallback - try to guess from filepath
        console.error('Failed to get home directory:', err)
        continueWrite(filepath)
        return
      }

      let homeDir = ''
      stream.on('data', (data) => {
        homeDir += data.toString()
      })

      stream.on('close', () => {
        homeDir = homeDir.trim()
        const expandedPath = filepath.replace('~', homeDir)
        console.log('Expanded path:', filepath, '->', expandedPath)
        continueWrite(expandedPath)
      })
    })
  } else {
    continueWrite(filepath)
  }

  function continueWrite(resolvedPath) {
    sshClient.sftp((err, sftp) => {
      if (err) {
        ws.send(JSON.stringify({
          type: 'file-error',
          message: `Failed to start SFTP: ${err.message}`
        }))
        return
      }

      console.log('Writing to path:', resolvedPath)

      sftp.writeFile(resolvedPath, content, 'utf8', (err) => {
        if (err) {
          console.error('Write error:', err)
          ws.send(JSON.stringify({
            type: 'file-error',
            message: `Failed to write file: ${err.message}`
          }))
          sftp.end()
          return
        }

        console.log('File written successfully:', resolvedPath)

        ws.send(JSON.stringify({
          type: 'file-saved',
          filepath: resolvedPath
        }))

        sftp.end()
      })
    })
  }
}

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`SSH relay server running on port ${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...')
  sessions.forEach((session) => {
    session.client.end()
    session.ws.close()
  })
  wss.close(() => {
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })
})