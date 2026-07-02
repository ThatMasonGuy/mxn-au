# Minecraft API Bridge Deployment

The panel becomes live when `https://api.mxn.au` reaches the Node bridge in this repo. If Cloudflare returns `530` with error `1033`, the hostname has no healthy tunnel or origin route.

## Local repo checks

Run these before copying the build to the Minecraft host:

```bash
npm install
npm run minecraft-api:check
npm run build
```

## Required environment

Create the runtime `.env` on the host that can access `/mnt/storage-1/minecraft`:

```bash
PORT=3001
ALLOWED_ORIGIN=https://mxn.au
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

MINECRAFT_ROOT=/mnt/storage-1/minecraft
MINECRAFT_SCRIPT_ROOT=/mnt/storage-1/minecraft/scripts
MINECRAFT_BACKUP_ROOT=/mnt/storage-1/minecraft/backups/snapshots
MINECRAFT_RCON_HOST=127.0.0.1
MINECRAFT_API_DISABLE_AUTH=false
MINECRAFT_ADMIN_EMAILS=mason@example.com
MINECRAFT_ADMIN_UIDS=
```

For a private smoke test only, set `MINECRAFT_API_DISABLE_AUTH=true`. Do not leave that enabled on the public tunnel.

## Start the bridge

From the repo directory on the Minecraft host:

```bash
npm install --omit=dev
PORT=3001 npm run minecraft-api
```

For systemd:

```ini
[Unit]
Description=MXN Minecraft API Bridge
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/opt/mxn-au
EnvironmentFile=/opt/mxn-au/.env
ExecStart=/usr/bin/npm run minecraft-api
Restart=always
RestartSec=5
User=mason
Group=mason

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now mxn-minecraft-api
sudo systemctl status mxn-minecraft-api
curl -i http://127.0.0.1:3001/health
curl -i http://127.0.0.1:3001/api/minecraft/health
```

## Cloudflare tunnel

Add or repair the tunnel ingress for the API hostname:

```yaml
ingress:
  - hostname: api.mxn.au
    service: http://127.0.0.1:3001
  - service: http_status:404
```

Restart the tunnel:

```bash
sudo systemctl restart cloudflared
cloudflared tunnel ingress validate
cloudflared tunnel ingress rule https://api.mxn.au/api/minecraft/health
curl -i https://api.mxn.au/health
curl -i https://api.mxn.au/api/minecraft/health
```

## Frontend endpoint

Set the frontend build env to the same hostname:

```bash
VITE_MINECRAFT_AU_SERVER_API=https://api.mxn.au
```

After redeploying the frontend, the banner should change from `API bridge unavailable: Failed to fetch` to a live authenticated status. If it still fails, check the browser network tab first: `530/1033` is tunnel routing, `401/403` is Firebase auth or the Minecraft admin allowlist, and `5xx` is the Node bridge or host filesystem/RCON access.
