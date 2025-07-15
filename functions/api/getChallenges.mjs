import { onRequest } from "firebase-functions/v2/https";
import fetch from "node-fetch";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";

const SEASONAL_PARENT_NODE_HASH = "3443694067"; // Heresy (Episode 1, July 2025)
const bungieApiKey = defineSecret('BUNGIE_API_KEY');

// --- Recursive node traversal ---
function collectAllRecordHashes(nodeHash, presDefs, nodeLogs = [], depth = 0, visited = new Set()) {
    if (!nodeHash || visited.has(nodeHash)) return [];
    visited.add(nodeHash);
    const node = presDefs[nodeHash];
    if (!node) {
        nodeLogs.push(`[${' '.repeat(depth)}] MISSING NODE: ${nodeHash}`);
        return [];
    }
    let hashes = [];
    if (node.children?.records?.length) {
        nodeLogs.push(`[${' '.repeat(depth)}] Found ${node.children.records.length} records at ${node.displayProperties?.name || nodeHash}`);
        hashes.push(...node.children.records.map(rec => String(rec.recordHash)));
    }
    if (node.children?.presentationNodes?.length) {
        for (const sub of node.children.presentationNodes) {
            const subNode = presDefs[sub.presentationNodeHash];
            nodeLogs.push(`[${' '.repeat(depth)}] ${node.displayProperties?.name || nodeHash} → ${subNode?.displayProperties?.name || sub.presentationNodeHash}`);
            hashes.push(...collectAllRecordHashes(sub.presentationNodeHash, presDefs, nodeLogs, depth + 1, visited));
        }
    }
    return hashes;
}

export const getChallenges = onRequest(
    { region: 'australia-southeast1', secrets: [bungieApiKey] },
    async (req, res) => {
        const fail = (status, message, detail = {}) => {
            console.error(`[getChallenges][FAIL] ${message}`, detail);
            return res.status(status).json({ ok: false, error: message, ...detail });
        };

        // --- 1. Auth ---
        let userId;
        try {
            const authHeader = req.headers.authorization || '';
            const match = authHeader.match(/^Bearer (.+)$/);
            if (!match) return fail(401, 'No Authorization header');
            const idToken = match[1];
            const { getAuth } = await import('firebase-admin/auth');
            const decoded = await getAuth().verifyIdToken(idToken);
            userId = decoded.uid;
        } catch (err) {
            return fail(401, "Invalid Firebase token", { errorDetail: err?.message, stack: err?.stack });
        }

        // --- 2. Get User Bungie Meta ---
        let meta;
        try {
            const metaDoc = await getFirestore().doc(`users/${userId}/destiny/meta`).get();
            if (!metaDoc.exists) return fail(404, "No Destiny account linked");
            meta = metaDoc.data();
            if (!meta.accessToken || !meta.platformType || !meta.bungieMembershipId)
                return fail(400, "Destiny account metadata is incomplete", { meta });
            if (meta.tokenExpires < Date.now())
                return fail(401, "Access token expired. Please re-link your Bungie account.");
        } catch (err) {
            return fail(500, "Firestore error fetching Destiny meta", { errorDetail: err?.message, stack: err?.stack });
        }

        // --- 3. Fetch Player Records (profile + character records) ---
        let allRecords;
        try {
            const url = `https://www.bungie.net/Platform/Destiny2/${meta.platformType}/Profile/${meta.bungieMembershipId}/?components=900,100`;
            const bungieRes = await fetch(url, {
                headers: { "Authorization": `Bearer ${meta.accessToken}`, "X-API-Key": bungieApiKey.value() }
            });
            if (!bungieRes.ok) {
                const text = await bungieRes.text();
                return fail(bungieRes.status, "Bungie API /Profile fetch failed", { response: text });
            }
            const bungieJson = await bungieRes.json();
            allRecords = bungieJson?.Response?.profileRecords?.data?.records || {};
            const charRecords = bungieJson?.Response?.characterRecords?.data || {};
            for (const charId in charRecords) {
                const recs = charRecords[charId].records || {};
                for (const [hash, value] of Object.entries(recs)) {
                    if (!allRecords[hash]) {
                        allRecords[hash] = value;
                    }
                }
            }
            // DEBUG: show sample hashes and keys
            console.log("Sample challenge hashes:", Object.keys(allRecords).slice(0, 5));
        } catch (err) {
            return fail(500, "Error fetching Destiny2 profile records", { errorDetail: err?.message, stack: err?.stack });
        }

        // --- 4. Download Manifest and Definitions ---
        let manifest, presPath, recordPath, presDefs, recordsDef, parentNode, objectiveDefs = {};
        try {
            const manifestRes = await fetch("https://www.bungie.net/Platform/Destiny2/Manifest/", {
                headers: { "X-API-Key": bungieApiKey.value() }
            });
            if (!manifestRes.ok) {
                const text = await manifestRes.text();
                return fail(manifestRes.status, "Failed to fetch Bungie manifest", { response: text });
            }
            manifest = await manifestRes.json();

            presPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyPresentationNodeDefinition;
            recordPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyRecordDefinition;
            const objectivePath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyObjectiveDefinition;

            const presDefRes = await fetch(`https://www.bungie.net${presPath}`, {
                headers: { "X-API-Key": bungieApiKey.value() }
            });
            if (!presDefRes.ok) {
                const text = await presDefRes.text();
                return fail(presDefRes.status, "Failed to fetch DestinyPresentationNodeDefinition", { response: text });
            }
            presDefs = await presDefRes.json();

            const recordsDefRes = await fetch(`https://www.bungie.net${recordPath}`, {
                headers: { "X-API-Key": bungieApiKey.value() }
            });
            if (!recordsDefRes.ok) {
                const text = await recordsDefRes.text();
                return fail(recordsDefRes.status, "Failed to fetch DestinyRecordDefinition", { response: text });
            }
            recordsDef = await recordsDefRes.json();

            const objDefRes = await fetch(`https://www.bungie.net${objectivePath}`, {
                headers: { "X-API-Key": bungieApiKey.value() }
            });
            if (!objDefRes.ok) {
                const text = await objDefRes.text();
                return fail(objDefRes.status, "Failed to fetch DestinyObjectiveDefinition", { response: text });
            }
            objectiveDefs = await objDefRes.json();

            parentNode = presDefs[SEASONAL_PARENT_NODE_HASH];
            if (!parentNode) {
                return fail(500, "Parent presentation node not found in manifest", { SEASONAL_PARENT_NODE_HASH });
            }
        } catch (err) {
            return fail(500, "Error during manifest download or parsing", { errorDetail: err?.message, stack: err?.stack });
        }

        // --- 5. Recursively Find All Challenge Hashes ---
        let challengeHashes = [];
        let nodeLogs = [];
        try {
            challengeHashes = collectAllRecordHashes(SEASONAL_PARENT_NODE_HASH, presDefs, nodeLogs, 0, new Set());
            if (!challengeHashes.length) {
                return fail(500, "No child challenge hashes found after traversal", { parentNode, nodeLogs });
            }
            console.log("[getChallenges] Node traversal logs:\n", nodeLogs.join('\n'));
        } catch (err) {
            return fail(500, "Error collecting nested challenge hashes", { errorDetail: err?.message, stack: err?.stack, nodeLogs });
        }

        // --- 6. Build Enriched Challenge Data (with full objectives) ---
        let challengeDocs = [];
        let errorHashes = [];
        for (const hash of challengeHashes) {
            try {
                const record = allRecords[hash];
                if (!record) {
                    console.log(`[DEBUG] No record found for hash ${hash}`);
                    continue;
                }
                if (record.state === undefined) continue;
                const def = recordsDef[hash];
                if (!def) {
                    errorHashes.push(hash);
                    continue;
                }
                // Parse objectives and progress
                let objectives = [];
                const recObjectives = record.objectives;
                if (recObjectives && typeof recObjectives === 'object') {
                    if (Array.isArray(recObjectives)) {
                        for (const obj of recObjectives) {
                            const objDef = objectiveDefs[obj.objectiveHash] || {};
                            objectives.push({
                                objectiveHash: obj.objectiveHash,
                                description: objDef.progressDescription || objDef.displayProperties?.description || '',
                                progress: obj.progress,
                                completionValue: objDef.completionValue,
                                complete: obj.complete,
                            });
                        }
                    } else {
                        for (const [objectiveHash, obj] of Object.entries(recObjectives)) {
                            const objDef = objectiveDefs[objectiveHash] || {};
                            objectives.push({
                                objectiveHash,
                                description: objDef.progressDescription || objDef.displayProperties?.description || '',
                                progress: obj.progress,
                                completionValue: objDef.completionValue,
                                complete: obj.complete,
                            });
                        }
                    }
                }
                // XP reward parsing
                let xp = null, xpTier = null;
                const rewardItems = def.rewardItems || [];
                for (const r of rewardItems) {
                    const desc = r.rewardedLabel || r.displayProperties?.name || '';
                    const match = desc.match(/XP(\+{1,5})/);
                    if (match) {
                        xpTier = match[1].length;
                        xp = ['Large', 'XL', 'XXL', '4XL', '8XL'][xpTier - 1] || 'Unknown';
                        break;
                    }
                }
                if (!xp && def.displayProperties?.description) {
                    const match = def.displayProperties.description.match(/XP(\+{1,5})/);
                    if (match) {
                        xpTier = match[1].length;
                        xp = ['Large', 'XL', 'XXL', '4XL', '8XL'][xpTier - 1] || 'Unknown';
                    }
                }
                challengeDocs.push({
                    hash,
                    name: def.displayProperties?.name || '',
                    description: def.displayProperties?.description || '',
                    xp,
                    xpTier,
                    completed: !!(record.state & 1),
                    claimed: !!(record.state & 2),
                    visible: !(record.state & 4),
                    objectives,
                    updatedAt: Date.now()
                });
            } catch (err) {
                errorHashes.push(hash + ": " + (err?.message || err));
            }
        }

        // --- 7. Save to Firestore ---
        try {
            if (challengeDocs.length === 0) {
                return res.json({
                    ok: true,
                    count: 0,
                    errorHashes,
                    updatedAt: Date.now(),
                    nodeLogs,
                    hashes: challengeHashes,
                    sampleAllRecordsKeys: Object.keys(allRecords).slice(0, 5),
                });
            }
            const batch = getFirestore().batch();
            const collRef = getFirestore().collection(`users/${userId}/destiny/challenges/seasonal_challenges`);
            for (const doc of challengeDocs) {
                batch.set(collRef.doc(doc.hash), doc);
            }
            await batch.commit();

            return res.json({
                ok: true,
                count: challengeDocs.length,
                errorHashes,
                updatedAt: Date.now(),
                nodeLogs,
                sample: challengeDocs[0],
            });
        } catch (err) {
            return fail(500, "Firestore write failed", { errorDetail: err?.message, stack: err?.stack, challengeDocsLength: challengeDocs.length });
        }
    }
);
