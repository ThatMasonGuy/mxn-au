// Firebase Cloud Function: getServerRoles
// Fetches roles from Discord API for a specific server

import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { requireManagedDiscordGuild } from './discordSession.mjs';

// Define secrets
const DISCORD_BOT_TOKEN = defineSecret("DISCORD_BOT_TOKEN");

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
            const serverId = req.query.serverId;

            if (!serverId) {
                return res.status(400).json({ error: "serverId is required" });
            }

            await requireManagedDiscordGuild(req, serverId);

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
            const status = Number(error?.status) || 500;
            return res.status(status).json({
                error: status === 500 ? "Failed to fetch roles" : error.message,
                details: status === 500 ? undefined : error.message,
            });
        }
    }
);
