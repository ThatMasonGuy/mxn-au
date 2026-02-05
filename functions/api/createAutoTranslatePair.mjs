// Firebase Cloud Function: createAutoTranslatePair
// Creates auto-translate channel pairs with optional channel/role creation

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (getApps().length === 0) {
    initializeApp();
}

const db = getFirestore();

// Define secrets
const DISCORD_BOT_TOKEN = defineSecret("DISCORD_BOT_TOKEN");
const BOT_SERVER_URL = defineSecret("BOT_SERVER_URL");
const BOT_API_KEY = defineSecret("BOT_API_KEY");

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Permission flags
const MANAGE_CHANNELS = 0x10n; // 16
const MANAGE_ROLES = 0x10000000n; // 268435456

/**
 * Get valid access token for user
 */
async function getValidAccessToken(userId) {
    const userDoc = await db.collection("discord_users").doc(userId).get();
    if (!userDoc.exists) return null;
    return userDoc.data().accessToken;
}

/**
 * Check if user has required permissions in guild
 */
async function verifyUserPermissions(userId, guildId) {
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) return { hasAccess: false };

    const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return { hasAccess: false };

    const guilds = await response.json();
    const guild = guilds.find((g) => g.id === guildId);

    if (!guild) return { hasAccess: false };

    const permissions = BigInt(guild.permissions);
    const isAdmin = (permissions & 0x8n) === 0x8n; // ADMINISTRATOR
    const canManageChannels = (permissions & MANAGE_CHANNELS) === MANAGE_CHANNELS;
    const canManageRoles = (permissions & MANAGE_ROLES) === MANAGE_ROLES;

    return {
        hasAccess: true,
        isAdmin,
        canManageChannels: isAdmin || canManageChannels,
        canManageRoles: isAdmin || canManageRoles,
    };
}

/**
 * Get source channel info
 */
async function getChannel(channelId, botToken) {
    const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}`,
        {
            headers: { Authorization: `Bot ${botToken}` },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to get channel: ${response.status}`);
    }

    return response.json();
}

/**
 * Create a new channel in the guild
 */
async function createChannel(guildId, name, parentId, permissionOverwrites, botToken) {
    const body = {
        name,
        type: 0, // Text channel
    };

    if (parentId) {
        body.parent_id = parentId;
    }

    if (permissionOverwrites && permissionOverwrites.length > 0) {
        body.permission_overwrites = permissionOverwrites;
    }

    const response = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("[Channel] Create error:", response.status, error);
        throw new Error(`Failed to create channel: ${response.status}`);
    }

    return response.json();
}

/**
 * Create a new role in the guild
 */
async function createRole(guildId, name, botToken) {
    const response = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/roles`,
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                mentionable: true,
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("[Role] Create error:", response.status, error);
        throw new Error(`Failed to create role: ${response.status}`);
    }

    return response.json();
}

/**
 * Create a webhook for the channel
 */
async function createWebhook(channelId, name, botToken) {
    const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/webhooks`,
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name || "MXN Translate",
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("[Webhook] Create error:", response.status, error);
        throw new Error(`Failed to create webhook: ${response.status}`);
    }

    return response.json();
}

/**
 * Store the auto-translate config via Express API
 */
async function storeConfig(serverId, config, botServerUrl, apiKey) {
    const response = await fetch(
        `${botServerUrl}/api/config/${serverId}/auto-translate`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(config),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("[Config] Store error:", response.status, error);
        throw new Error(`Failed to store config: ${response.status}`);
    }

    return response.json();
}

export const createAutoTranslatePair = onRequest(
    {
        secrets: [DISCORD_BOT_TOKEN, BOT_SERVER_URL, BOT_API_KEY],
        region: "australia-southeast1",
        cors: true,
    },
    async (req, res) => {
        if (req.method === "OPTIONS") {
            res.set(corsHeaders);
            return res.status(204).send("");
        }

        res.set(corsHeaders);

        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            // Auth check
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Missing authorization" });
            }

            const userId = authHeader.substring(7);

            // Parse body
            const {
                serverId,
                sourceChannelId,
                targetLanguage,
                reverseLanguage,
                createChannel: shouldCreateChannel,
                channelName,
                existingChannelId,
                useRole,
                createRole: shouldCreateRole,
                roleName,
                existingRoleId,
            } = req.body;

            // Validate required fields
            if (!serverId || !sourceChannelId || !targetLanguage) {
                return res.status(400).json({
                    error: "Missing required fields",
                    details: "serverId, sourceChannelId, and targetLanguage are required",
                });
            }

            // Check permissions
            const perms = await verifyUserPermissions(userId, serverId);
            if (!perms.hasAccess) {
                return res.status(403).json({ error: "You don't have access to this server" });
            }

            if (shouldCreateChannel && !perms.canManageChannels) {
                return res.status(403).json({ error: "You don't have permission to create channels" });
            }

            if (shouldCreateRole && !perms.canManageRoles) {
                return res.status(403).json({ error: "You don't have permission to create roles" });
            }

            const botToken = DISCORD_BOT_TOKEN.value();
            const botServerUrl = BOT_SERVER_URL.value();
            const apiKey = BOT_API_KEY.value();

            // Get source channel info (for parent category)
            const sourceChannel = await getChannel(sourceChannelId, botToken);
            const parentId = sourceChannel.parent_id;

            let targetChannelId = existingChannelId;
            let targetChannelName = channelName;
            let roleId = existingRoleId;
            let createdChannel = null;
            let createdRole = null;

            // Create role if needed
            if (useRole && shouldCreateRole && roleName) {
                console.log(`[AutoTranslate] Creating role: ${roleName}`);
                createdRole = await createRole(serverId, roleName, botToken);
                roleId = createdRole.id;
                console.log(`[AutoTranslate] Created role: ${roleId}`);
            }

            // Build permission overwrites if using role
            let permissionOverwrites = [];
            if (useRole && roleId) {
                permissionOverwrites = [
                    {
                        id: serverId, // @everyone
                        type: 0, // role
                        deny: "1024", // VIEW_CHANNEL
                    },
                    {
                        id: roleId,
                        type: 0, // role
                        allow: "1024", // VIEW_CHANNEL
                    },
                ];
            }

            // Create channel if needed
            if (shouldCreateChannel) {
                const newChannelName = channelName || `${sourceChannel.name}-${targetLanguage}`;
                console.log(`[AutoTranslate] Creating channel: ${newChannelName}`);
                createdChannel = await createChannel(
                    serverId,
                    newChannelName,
                    parentId,
                    permissionOverwrites,
                    botToken
                );
                targetChannelId = createdChannel.id;
                targetChannelName = createdChannel.name;
                console.log(`[AutoTranslate] Created channel: ${targetChannelId}`);
            }

            // Create webhook for the target channel
            console.log(`[AutoTranslate] Creating webhook for channel: ${targetChannelId}`);
            const webhook = await createWebhook(
                targetChannelId,
                `MXN Translate (${targetLanguage.toUpperCase()})`,
                botToken
            );
            console.log(`[AutoTranslate] Created webhook: ${webhook.id}`);

            // Store config in database
            const config = {
                channelId: targetChannelId,
                sourceChannelId,
                targetLanguage,
                reverseLanguage: reverseLanguage || "en",
                webhookId: webhook.id,
                webhookToken: webhook.token,
                roleId: roleId || null,
                isActive: true,
            };

            console.log(`[AutoTranslate] Storing config...`);
            const result = await storeConfig(serverId, config, botServerUrl, apiKey);
            console.log(`[AutoTranslate] Config stored successfully`);

            return res.json({
                success: true,
                id: result.id,
                channelId: targetChannelId,
                channelName: targetChannelName || (createdChannel ? createdChannel.name : null),
                roleId: roleId,
                webhookId: webhook.id,
            });
        } catch (error) {
            console.error("[AutoTranslate] Error:", error);
            return res.status(500).json({
                error: "Failed to create auto-translate pair",
                details: error.message,
            });
        }
    }
);
