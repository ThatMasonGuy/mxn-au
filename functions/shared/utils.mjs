// shared/utils.mjs
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin once
let app;
export function getApp() {
    if (!app) {
        app = initializeApp({ credential: applicationDefault() });
    }
    return app;
}

// Get Firestore instance
export function getDb() {
    return getFirestore(getApp());
}

// Shared Infrastructure Tracker
export class InfrastructureTracker {
    constructor() {
        this.startTime = Date.now();
        this.firestoreReads = 0;
        this.firestoreWrites = 0;
        this.functionInvocations = 1;
        this.memoryUsed = process.memoryUsage();
        this.operationLog = [];
    }

    trackRead(count = 1, operation = 'unknown') {
        this.firestoreReads += count;
        this.operationLog.push(`READ(${count}): ${operation}`);
    }

    trackWrite(count = 1, operation = 'unknown') {
        this.firestoreWrites += count;
        this.operationLog.push(`WRITE(${count}): ${operation}`);
    }

    trackBatchWrite(operations, operation = 'batch') {
        this.firestoreWrites += operations;
        this.operationLog.push(`BATCH_WRITE(${operations}): ${operation}`);
    }

    getExecutionTime() {
        return Date.now() - this.startTime;
    }

    calculateRealCosts() {
        const executionTimeMs = this.getExecutionTime();

        // Real Google Cloud pricing (as of 2024)
        const FIRESTORE_READ_COST = 0.0000006;  // $0.06 per 100K
        const FIRESTORE_WRITE_COST = 0.0000018; // $0.18 per 100K
        const FUNCTION_INVOCATION_COST = 0.0000004; // $0.40 per 1M
        const FUNCTION_COMPUTE_COST_PER_100MS = 0.0000025; // $0.0000025 per 100ms at 256MB

        const firestoreCost = (this.firestoreReads * FIRESTORE_READ_COST) + (this.firestoreWrites * FIRESTORE_WRITE_COST);
        const invocationCost = this.functionInvocations * FUNCTION_INVOCATION_COST;
        const computeTime100ms = Math.ceil(executionTimeMs / 100);
        const computeCost = computeTime100ms * FUNCTION_COMPUTE_COST_PER_100MS;
        const infrastructureCost = firestoreCost + invocationCost + computeCost;

        return {
            firestoreReads: this.firestoreReads,
            firestoreWrites: this.firestoreWrites,
            executionTimeMs,
            computeTime100ms,
            firestoreCost,
            invocationCost,
            computeCost,
            infrastructureCost,
            operationLog: this.operationLog
        };
    }
}

// Pricing constants
export const PRICING = {
    OPENAI: {
        GPT4O_PROMPT_PER_1K: 0.005,
        GPT4O_COMPLETION_PER_1K: 0.015
    },
    FIRESTORE: {
        READ_COST: 0.0000006,
        WRITE_COST: 0.0000018
    },
    FUNCTIONS: {
        INVOCATION_COST: 0.0000004,
        COMPUTE_COST_PER_100MS: 0.0000025
    }
};

// Calculate token costs
export function calculateTokenCosts(tokenUsage) {
    const promptCost = (tokenUsage.prompt || 0) * PRICING.OPENAI.GPT4O_PROMPT_PER_1K / 1000;
    const completionCost = (tokenUsage.completion || 0) * PRICING.OPENAI.GPT4O_COMPLETION_PER_1K / 1000;
    return {
        promptCost,
        completionCost,
        totalCost: promptCost + completionCost
    };
}

// Verify Firebase Auth token
export async function verifyAuthToken(authHeader) {
    const match = authHeader?.match(/^Bearer (.+)$/);
    if (!match) {
        throw new Error('No Authorization header');
    }

    const idToken = match[1];
    const { getAuth } = await import('firebase-admin/auth');
    const decoded = await getAuth(getApp()).verifyIdToken(idToken);
    return decoded;
}

// Get current week for seasonal challenges
export function getCurrentWeek(seasonStartISO, maxWeeks = 20) {
    if (!seasonStartISO) {
        console.log('[getCurrentWeek] No season start date provided - defaulting to week 1');
        return 1;
    }

    try {
        const seasonStart = new Date(seasonStartISO);
        const now = new Date();

        if (isNaN(seasonStart.getTime())) {
            console.log(`[getCurrentWeek] Invalid date format: "${seasonStartISO}"`);
            return 1;
        }

        const deltaMs = now.getTime() - seasonStart.getTime();
        const deltaDays = Math.floor(deltaMs / (1000 * 60 * 60 * 24));
        let calculatedWeek = Math.floor(deltaDays / 7) + 1;

        if (deltaMs < 0) {
            console.log('[getCurrentWeek] Season hasn\'t started yet! Using week 1');
            return 1;
        }

        if (calculatedWeek > maxWeeks) {
            console.log(`[getCurrentWeek] Week ${calculatedWeek} exceeds max weeks (${maxWeeks}) - capping at ${maxWeeks}`);
            calculatedWeek = maxWeeks;
        }

        return Math.max(1, calculatedWeek);
    } catch (err) {
        console.error(`[getCurrentWeek] Error parsing date "${seasonStartISO}":`, err);
        return 1;
    }
}

// Batch Firestore operations helper
export class FirestoreBatch {
    constructor(db, tracker) {
        this.db = db;
        this.batch = db.batch();
        this.tracker = tracker;
        this.operationCount = 0;
        this.maxBatchSize = 500; // Firestore limit
    }

    set(ref, data, options) {
        this.batch.set(ref, data, options);
        this.operationCount++;
        this._checkBatchSize();
    }

    update(ref, data) {
        this.batch.update(ref, data);
        this.operationCount++;
        this._checkBatchSize();
    }

    delete(ref) {
        this.batch.delete(ref);
        this.operationCount++;
        this._checkBatchSize();
    }

    async _checkBatchSize() {
        if (this.operationCount >= this.maxBatchSize) {
            await this.commit();
            this.batch = this.db.batch();
            this.operationCount = 0;
        }
    }

    async commit(operation = 'batch operation') {
        if (this.operationCount > 0) {
            await this.batch.commit();
            this.tracker.trackBatchWrite(this.operationCount, operation);
        }
    }
}