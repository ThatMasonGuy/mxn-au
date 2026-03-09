// Firebase Cloud Function: getServerRoles
// Fetches roles from Discord API for a specific server

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

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Get valid access token for user
 */
async function getValidAccessToken(userId) {
    const userDoc = await db.collection("discord_users").doc(userId).get();
    if (!userDoc.exists) return null;
    return userDoc.data().accessToken;
}

/**
 * Check if user has access to this guild
 */
async function verifyUserGuildAccess(userId, guildId) {
    const accessToken = await getValidAccessToken(userId);
    if (!accessToken) return false;

    const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return false;
    const guilds = await response.json();
    return guilds.some((g) => g.id === guildId);
}

/**
 * Fetch roles from Discord API using bot token
 */
async function fetchGuildRoles(guildId, botToken) {
    const response = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/roles`,
        {
            headers: { Authorization: `Bot ${botToken}` },
        }
    );

    if (!response.ok) {
        const error = await response.text();
        console.error("[Roles] Discord API error:", response.status, error);
        throw new Error(`Discord API error: ${response.status}`);
    }

    return response.json();
}

export const getServerRoles = onRequest(
    {
        secrets: [DISCORD_BOT_TOKEN],
        region: "australia-southeast1",
        cors: true,
    },
    async (req, res) => {
        if (req.method === "OPTIONS") {
            res.set(corsHeaders);
            return res.status(204).send("");
        }

        res.set(corsHeaders);

        if (req.method !== "GET") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Missing authorization" });
            }

            const userId = authHeader.substring(7);
            const serverId = req.query.serverId;

            if (!serverId) {
                return res.status(400).json({ error: "serverId is required" });
            }

            // Verify user has access
            const hasAccess = await verifyUserGuildAccess(userId, serverId);
            if (!hasAccess) {
                return res.status(403).json({ error: "You don't have access to this server" });
            }

            // Fetch roles
            const botToken = DISCORD_BOT_TOKEN.value();
            const roles = await fetchGuildRoles(serverId, botToken);

            // Format and filter roles
            const formattedRoles = roles
                .filter((r) => r.name !== "@everyone")
                .map((r) => ({
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    position: r.position,
                    managed: r.managed || false,
                    mentionable: r.mentionable || false,
                }))
                .sort((a, b) => b.position - a.position);

            console.log(`[Roles] Returning ${formattedRoles.length} roles for guild ${serverId}`);

            return res.json({ roles: formattedRoles });
        } catch (error) {
            console.error("[Roles] Error:", error);
            return res.status(500).json({
                error: "Failed to fetch roles",
                details: error.message,
            });
        }
    }
);
