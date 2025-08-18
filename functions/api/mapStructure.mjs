import { onRequest } from "firebase-functions/v2/https";
import { getFirestore, FieldPath } from "firebase-admin/firestore";

/**
 * Analyzes Firestore schema by sampling documents intelligently
 */
export const analyzeFirestoreSchema = onRequest(
    { 
        region: 'australia-southeast1',
        maxInstances: 1,
    },
    async (req, res) => {
        try {
            console.log('[Schema Analyzer] Starting Firestore schema analysis...');

            // Enable CORS
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET, POST');
            res.set('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                return res.status(204).send('');
            }

            const schema = await analyzeDatabase();

            console.log('[Schema Analyzer] Analysis completed successfully');
            res.status(200).json({
                success: true,
                timestamp: new Date().toISOString(),
                schema: schema
            });

        } catch (error) {
            console.error('[Schema Analyzer] Error analyzing schema:', error);
            res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
);

/**
 * Main function to analyze the entire database
 */
async function analyzeDatabase() {
    const db = getFirestore();
    const collections = await db.listCollections();
    
    const schema = {
        collections: {},
        summary: {
            totalCollections: collections.length,
            analyzedAt: new Date().toISOString()
        }
    };

    console.log(`[Schema Analyzer] Found ${collections.length} collections to analyze`);

    for (const collection of collections) {
        console.log(`[Schema Analyzer] Analyzing collection: ${collection.id}`);
        schema.collections[collection.id] = await analyzeCollection(collection);
    }

    return schema;
}

/**
 * Analyzes a single collection with smart sampling
 */
async function analyzeCollection(collectionRef) {
    const collectionId = collectionRef.id;

    // Get collection size first
    const countSnapshot = await collectionRef.count().get();
    const totalDocs = countSnapshot.data().count;

    console.log(`[Schema Analyzer] Collection ${collectionId} has ${totalDocs} documents`);

    const collectionSchema = {
        id: collectionId,
        totalDocuments: totalDocs,
        documentSchemas: {},
        examples: {},
        subcollections: {},
        samplingStrategy: getSamplingStrategy(collectionId, totalDocs)
    };

    if (totalDocs === 0) {
        console.log(`[Schema Analyzer] Collection ${collectionId} is empty, skipping`);
        return collectionSchema;
    }

    // Smart sampling based on collection size and type
    const samplingConfig = getSamplingConfig(collectionId, totalDocs);
    const sampleDocs = await sampleDocuments(collectionRef, samplingConfig);

    console.log(`[Schema Analyzer] Sampled ${sampleDocs.length} documents from ${collectionId}`);

    // Analyze sampled documents
    for (const doc of sampleDocs) {
        const docData = doc.data();
        if (docData) {
            // Generate schema for this document
            const docSchema = generateSchema(docData);
            const schemaKey = generateSchemaKey(docSchema);

            // Store unique schemas
            if (!collectionSchema.documentSchemas[schemaKey]) {
                collectionSchema.documentSchemas[schemaKey] = {
                    schema: docSchema,
                    count: 1,
                    exampleDocId: doc.id
                };
                // Store example data (sanitized)
                collectionSchema.examples[schemaKey] = sanitizeExample(docData);
            } else {
                collectionSchema.documentSchemas[schemaKey].count++;
            }

            // Check for subcollections on this document (but limit to prevent deep recursion)
            try {
                const subcollections = await doc.ref.listCollections();
                for (const subcollection of subcollections) {
                    if (!collectionSchema.subcollections[subcollection.id]) {
                        console.log(`[Schema Analyzer] Found subcollection: ${collectionId}/${doc.id}/${subcollection.id}`);
                        collectionSchema.subcollections[subcollection.id] = await analyzeCollection(subcollection);
                    }
                }
            } catch (error) {
                console.warn(`[Schema Analyzer] Error checking subcollections for ${doc.id}:`, error.message);
            }
        }
    }

    return collectionSchema;
}

/**
 * Determines sampling strategy based on collection name and size
 */
function getSamplingStrategy(collectionId, totalDocs) {
    // Special handling for known large collections
    const largeCollections = ['translations', 'logs', 'analytics', 'events', 'activities'];
    const isLargeCollection = largeCollections.some(name =>
        collectionId.toLowerCase().includes(name.toLowerCase())
    );

    if (totalDocs === 0) return 'empty';
    if (totalDocs <= 10) return 'all';
    if (totalDocs <= 100) return 'majority';
    if (isLargeCollection || totalDocs > 1000) return 'strategic';
    return 'sample';
}

/**
 * Gets sampling configuration for a collection
 */
function getSamplingConfig(collectionId, totalDocs) {
    const strategy = getSamplingStrategy(collectionId, totalDocs);

    switch (strategy) {
        case 'empty':
            return { limit: 0, method: 'none' };
        case 'all':
            return { limit: totalDocs, method: 'all' };
        case 'majority':
            return { limit: Math.min(50, totalDocs), method: 'random' };
        case 'strategic':
            // For large collections, sample strategically
            return {
                limit: 20,
                method: 'strategic',
                includeFirst: 3,
                includeLast: 3,
                includeRandom: 14
            };
        default:
            return { limit: 25, method: 'random' };
    }
}

/**
 * Samples documents from a collection based on configuration
 */
async function sampleDocuments(collectionRef, config) {
    if (config.limit === 0) return [];

    const samples = [];

    if (config.method === 'all') {
        const snapshot = await collectionRef.limit(config.limit).get();
        return snapshot.docs;
    }

    if (config.method === 'strategic') {
        try {
            // Get first few documents
            if (config.includeFirst > 0) {
                const firstDocs = await collectionRef
                    .orderBy(FieldPath.documentId())
                    .limit(config.includeFirst)
                    .get();
                samples.push(...firstDocs.docs);
            }

            // Get last few documents
            if (config.includeLast > 0) {
                const lastDocs = await collectionRef
                    .orderBy(FieldPath.documentId(), 'desc')
                    .limit(config.includeLast)
                    .get();
                samples.push(...lastDocs.docs);
            }

            // Get random samples from middle
            if (config.includeRandom > 0) {
                const randomDocs = await getRandomDocuments(collectionRef, config.includeRandom);
                samples.push(...randomDocs);
            }

            return samples;
        } catch (error) {
            console.warn(`[Schema Analyzer] Strategic sampling failed, falling back to random:`, error.message);
            return await getRandomDocuments(collectionRef, config.limit);
        }
    }

    // Default random sampling
    return await getRandomDocuments(collectionRef, config.limit);
}

/**
 * Gets random documents from a collection
 */
async function getRandomDocuments(collectionRef, limit) {
    try {
        // Try to get random documents by getting more than needed and shuffling
        const sampleSize = Math.min(limit * 3, 100); // Don't go crazy with the sample size
        const allDocs = await collectionRef.limit(sampleSize).get();
        const docs = allDocs.docs;

        if (docs.length <= limit) return docs;

        // Shuffle and take random sample
        const shuffled = docs.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    } catch (error) {
        console.warn('[Schema Analyzer] Random sampling failed, using sequential:', error.message);
        const snapshot = await collectionRef.limit(limit).get();
        return snapshot.docs;
    }
}

/**
 * Generates schema from document data
 */
function generateSchema(data, path = '') {
    if (data === null) return { type: 'null' };
    if (data === undefined) return { type: 'undefined' };

    const type = Array.isArray(data) ? 'array' : typeof data;

    switch (type) {
        case 'object':
            // Handle Firestore-specific types
            if (data.constructor?.name === 'Timestamp') {
                return { type: 'timestamp' };
            }
            if (data.constructor?.name === 'GeoPoint') {
                return { type: 'geopoint' };
            }
            if (data.constructor?.name === 'DocumentReference') {
                return { type: 'reference', path: data.path };
            }

            const schema = { type: 'object', properties: {} };
            for (const [key, value] of Object.entries(data)) {
                schema.properties[key] = generateSchema(value, `${path}.${key}`);
            }
            return schema;

        case 'array':
            const arraySchema = { type: 'array', items: [] };
            // Analyze first few items to understand array structure
            const itemsToAnalyze = Math.min(3, data.length);
            for (let i = 0; i < itemsToAnalyze; i++) {
                arraySchema.items.push(generateSchema(data[i], `${path}[${i}]`));
            }
            if (data.length > itemsToAnalyze) {
                arraySchema.totalItems = data.length;
            }
            return arraySchema;

        default:
            return { type };
    }
}

/**
 * Generates a unique key for a schema for deduplication
 */
function generateSchemaKey(schema) {
    return JSON.stringify(schema, Object.keys(schema).sort());
}

/**
 * Sanitizes example data by removing sensitive information
 */
function sanitizeExample(data, maxDepth = 3, currentDepth = 0) {
    if (currentDepth > maxDepth) return '[Object too deep]';

    if (data === null || data === undefined) return data;

    // Handle Firestore-specific types
    if (data.constructor?.name === 'Timestamp') {
        return { _type: 'timestamp', _value: data.toDate().toISOString() };
    }

    if (data.constructor?.name === 'GeoPoint') {
        return { _type: 'geopoint', latitude: data.latitude, longitude: data.longitude };
    }

    if (data.constructor?.name === 'DocumentReference') {
        return { _type: 'reference', _path: data.path };
    }

    if (Array.isArray(data)) {
        return data.slice(0, 3).map(item => sanitizeExample(item, maxDepth, currentDepth + 1));
    }

    if (typeof data === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            // Sanitize potentially sensitive fields
            if (key.toLowerCase().includes('password') ||
                key.toLowerCase().includes('secret') ||
                key.toLowerCase().includes('token') ||
                key.toLowerCase().includes('key')) {
                sanitized[key] = '[REDACTED]';
            } else if (typeof value === 'string' && value.length > 100) {
                sanitized[key] = value.substring(0, 100) + '...[truncated]';
            } else {
                sanitized[key] = sanitizeExample(value, maxDepth, currentDepth + 1);
            }
        }
        return sanitized;
    }

    return data;
}