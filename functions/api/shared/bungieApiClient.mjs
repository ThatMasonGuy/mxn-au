// shared/bungieApiClient.mjs
import fetch from "node-fetch";
import { CacheManager } from "./cacheManager.mjs";

export class BungieApiClient {
    constructor(apiKey, tracker) {
        this.apiKey = apiKey;
        this.tracker = tracker;
        this.cacheManager = new CacheManager(tracker);
        this.baseUrl = 'https://www.bungie.net';
    }

    // Make authenticated API request
    async makeRequest(path, accessToken = null) {
        const headers = {
            'X-API-Key': this.apiKey
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
        const response = await fetch(url, { headers });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Bungie API error ${response.status}: ${text}`);
        }

        return response.json();
    }

    // Get manifest with caching
    async getManifest() {
        // Check cached version first
        const cachedVersion = await this.cacheManager.getManifestVersion();

        const manifestData = await this.makeRequest('/Platform/Destiny2/Manifest/');
        const currentVersion = manifestData.Response.version;

        // If version hasn't changed, we can skip some operations
        if (cachedVersion === currentVersion) {
            console.log('[BungieApiClient] Manifest version unchanged:', currentVersion);
        } else {
            console.log('[BungieApiClient] New manifest version:', currentVersion);
            await this.cacheManager.saveManifestVersion(currentVersion);
        }

        return manifestData.Response;
    }

    // Get definitions efficiently
    async getDefinitions(definitionTypes, manifestPaths) {
        const definitions = {};

        // Fetch definitions in parallel
        const promises = definitionTypes.map(async (type) => {
            const path = manifestPaths[type];
            if (!path) {
                console.warn(`[BungieApiClient] No path for definition type: ${type}`);
                return null;
            }

            const data = await this.makeRequest(path);
            return { type, data };
        });

        const results = await Promise.all(promises);

        results.forEach(result => {
            if (result) {
                definitions[result.type] = result.data;
            }
        });

        return definitions;
    }

    // Get player profile data
    async getProfile(membershipType, membershipId, components, accessToken) {
        const componentsStr = components.join(',');
        const path = `/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${componentsStr}`;

        return this.makeRequest(path, accessToken);
    }

    // Get current user memberships
    async getCurrentUserMemberships(accessToken) {
        return this.makeRequest('/Platform/User/GetMembershipsForCurrentUser/', accessToken);
    }

    // Exchange OAuth code for token
    async exchangeOAuthToken(code, clientId, redirectUri) {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', clientId);
        params.append('redirect_uri', redirectUri);

        const response = await fetch(`${this.baseUrl}/platform/app/oauth/token/`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = await response.json();

        if (!response.ok || !data.access_token) {
            throw new Error(`Token exchange failed: ${data.error_description || 'Unknown error'}`);
        }

        return data;
    }

    // Get current season info from definitions
    async getCurrentSeason() {
        try {
            const manifest = await this.getManifest();
            const definitions = await this.getDefinitions(
                ['DestinySeasonDefinition', 'DestinyPresentationNodeDefinition'],
                manifest.jsonWorldComponentContentPaths.en
            );

            const seasonDefs = definitions.DestinySeasonDefinition;
            const presDefs = definitions.DestinyPresentationNodeDefinition;

            // Find current active season
            const currentDate = new Date();
            let currentSeason = null;

            for (const [hash, season] of Object.entries(seasonDefs)) {
                if (!season.displayProperties?.name) continue;

                const startDate = new Date(season.startDate);
                const endDate = new Date(season.endDate);

                if (currentDate >= startDate && currentDate <= endDate) {
                    // Find seasonal challenges node
                    let challengesNodeHash = null;

                    for (const [nodeHash, node] of Object.entries(presDefs)) {
                        if (node.displayProperties?.name?.toLowerCase().includes('seasonal challenges') ||
                            (node.displayProperties?.name?.toLowerCase().includes('challenges') &&
                                node.displayProperties?.description?.toLowerCase().includes('seasonal'))) {

                            if (node.children?.records?.length > 0 ||
                                node.children?.presentationNodes?.length > 0) {
                                challengesNodeHash = nodeHash;
                                break;
                            }
                        }
                    }

                    currentSeason = {
                        seasonHash: hash,
                        seasonName: season.displayProperties.name,
                        seasonStart: season.startDate,
                        seasonEnd: season.endDate,
                        seasonActive: true,
                        challengesNodeHash: challengesNodeHash,
                        autoDetected: true,
                        createdAt: Date.now()
                    };

                    console.log(`[BungieApiClient] Found current season: ${currentSeason.seasonName}`);
                    break;
                }
            }

            if (!currentSeason) {
                // Fallback to most recent season
                const sortedSeasons = Object.entries(seasonDefs)
                    .filter(([hash, season]) => season.displayProperties?.name)
                    .sort(([, a], [, b]) => new Date(b.startDate) - new Date(a.startDate));

                if (sortedSeasons.length > 0) {
                    const [hash, season] = sortedSeasons[0];
                    currentSeason = {
                        seasonHash: hash,
                        seasonName: season.displayProperties.name,
                        seasonStart: season.startDate,
                        seasonEnd: season.endDate,
                        seasonActive: true,
                        challengesNodeHash: null,
                        autoDetected: true,
                        createdAt: Date.now()
                    };

                    console.log(`[BungieApiClient] Using latest season as fallback: ${currentSeason.seasonName}`);
                }
            }

            return currentSeason;
        } catch (err) {
            console.error(`[BungieApiClient] Error getting current season:`, err);
            throw err;
        }
    }
}