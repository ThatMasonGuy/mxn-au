import crypto from "crypto";
import { db } from "../config/firebase.mjs";
import { FieldValue } from "firebase-admin/firestore";

export class TranslationCache {
    constructor(version = "v1") {
        this.collection = db.collection("translations");
        this.version = version;
    }

    generateId(content, fromLang, targetLang, model = 'openai') {
        const hash = crypto.createHash("sha256").update(content).digest("hex");
        return `${model}-${fromLang}-${targetLang}-${hash}`;
    }

    async get(content, fromLang, targetLang, model = 'openai') {
        try {
            const docId = this.generateId(content, fromLang, targetLang, model);
            const doc = await this.collection.doc(docId).get();

            if (doc.exists) {
                const data = doc.data();

                // Skip entries marked as bad
                if (data.markedBad) {
                    console.log(`Cache hit but marked as bad: ${docId}`);
                    return null;
                }

                // Version check - null or matching version are valid
                const docVersion = data.version || "v1";
                if (docVersion === this.version) {
                    return { id: docId, ...data };
                }

                console.log(
                    `Cache version mismatch: doc=${docVersion}, current=${this.version}`
                );
                return null;
            }
            return null;
        } catch (error) {
            console.error("Cache get error:", error);
            return null;
        }
    }

    async save(translationData, model = 'openai') {
        try {
            const docId = this.generateId(
                translationData.inputText,
                translationData.sourceLang,
                translationData.targetLang,
                model
            );

            // Clean up redundant fields
            const {
                outputText,
                promptTokens,
                completionTokens,
                totalTokens,
                ...cleanData
            } = translationData;

            const docData = {
                ...cleanData,
                id: docId,
                version: this.version,
                timesTranslated: 1,
                firstTranslated: FieldValue.serverTimestamp(),
                lastTranslated: FieldValue.serverTimestamp(),
            };

            await this.collection.doc(docId).set(docData);
            return docId;
        } catch (error) {
            console.error("Cache save error:", error);
            throw error;
        }
    }

    async updateHitCount(docId) {
        try {
            await this.collection.doc(docId).update({
                timesTranslated: FieldValue.increment(1),
                lastTranslated: FieldValue.serverTimestamp(),
                lastAccessedVersion: this.version,
            });
        } catch (error) {
            console.error("Cache update error:", error);
        }
    }

    /**
     * Mark a cached translation as bad
     * This will cause it to be skipped on future cache lookups
     * @param {string} docId - The cache document ID
     * @returns {Promise<void>}
     */
    async markAsBad(docId) {
        try {
            await this.collection.doc(docId).update({
                markedBad: true,
                markedBadAt: FieldValue.serverTimestamp(),
            });
            console.log(`Marked cache entry ${docId} as bad`);
        } catch (error) {
            console.error("Error marking translation as bad:", error);
            throw error;
        }
    }
}