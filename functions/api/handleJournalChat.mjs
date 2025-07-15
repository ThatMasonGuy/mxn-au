// /functions/api/handleJournalChat.mjs
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { OpenAI } from 'openai'
import { defineSecret } from 'firebase-functions/params'

const openaiKey = defineSecret('OPENAI_API_KEY')

export const handleJournalChat = onCall(
    { region: 'australia-southeast1', secrets: [openaiKey] },
    async (request) => {
        if (!request.auth) {
            console.warn('🔒 [Auth] Authentication context is missing from request.auth.');
            throw new HttpsError('unauthenticated', 'User must be signed in.');
        }

        const { uid } = request.auth;
        const { packageCode, messages, profile, userName } = request.data || {};

        if (!packageCode) {
            throw new HttpsError('invalid-argument', '`packageCode` must be provided.');
        }

        try {
            const openai = new OpenAI({
                apiKey: openaiKey.value()
            });

            // --- SUMMARY ---
            if (packageCode === 'summary') {
                if (!Array.isArray(messages) || messages.length === 0) {
                    throw new HttpsError('invalid-argument', '`messages` must be a non-empty array for summary.');
                }
                const resp = await openai.chat.completions.create({
                    model: 'gpt-4.1-mini',
                    messages: [
                        { role: 'system', content: 'You are a warm, reflective journaling companion that helps users summarize their thoughts.' },
                        ...messages,
                        { role: 'user', content: 'Summarize this conversation into a journal entry.' }
                    ],
                    temperature: 0.8
                });
                const summary = resp.choices?.[0]?.message?.content || '';
                return {
                    summary,
                    tokenUsage: resp.usage
                };
            }

            // --- FULL CHAT SUMMARY ---
            if (packageCode === 'summaryFull') {
                const { messages, metadata = {} } = request.data || {}

                if (!Array.isArray(messages) || messages.length === 0) {
                    throw new HttpsError('invalid-argument', '`messages` must be a non-empty array for summaryFull.')
                }

                const {
                    chatId = 'unknown',
                    totalMessages = messages.length,
                    chatName = '',
                    createdAt = '',
                    summaryPromptVersion = 'v1'
                } = metadata

                console.log(`🧠 [summaryFull] Summarising chatId: ${chatId} (${totalMessages} messages)`)

                const summaryPrompt = `
You are a reflective journaling assistant. A user has shared a complete journal conversation.

Your job is to summarise **the user's experience**, not the AI's responses.

- Focus only on messages written by the user (role: "user")
- Ignore assistant replies unless they influenced how the user responded
- Respond ONLY in this JSON format:
{
  "summary": "Concise summary of what this chat was about...",
  "moods": ["up to 3 mood keywords"],
  "topics": ["up to 5 topic tags"],
  "tone": "overall emotional tone (e.g., raw and hopeful)",
  "keywords": ["up to 10 recurring words or concepts"],
  "memories": ["notable direct quotes or moments worth remembering"],
  "insights": ["reflections or emotional breakthroughs the user had"]
}
`.trim()

                const chatMessages = [
                    { role: 'system', content: summaryPrompt },
                    ...messages
                ]

                let raw = ''
                let parsed = null
                let resp

                try {
                    resp = await openai.chat.completions.create({
                        model: 'gpt-4.1-mini',
                        messages: chatMessages,
                        temperature: 0.7
                    })

                    raw = resp.choices?.[0]?.message?.content || ''
                    console.log('🧠 [summaryFull] Raw response:', raw)

                    // Try full parse
                    parsed = JSON.parse(raw)

                } catch (e) {
                    console.warn('⚠️ [summaryFull] Primary JSON parse failed, attempting fallback...')
                    const match = raw.match(/{[\s\S]*}/)
                    if (match) {
                        try {
                            parsed = JSON.parse(match[0])
                            console.warn('✅ [summaryFull] Fallback match used:', match[0])
                        } catch (fallbackErr) {
                            console.error('❌ [summaryFull] Fallback JSON parse failed:', fallbackErr)
                            throw new HttpsError('internal', 'Failed to parse fallback JSON for summaryFull.')
                        }
                    } else {
                        console.error('❌ [summaryFull] No valid JSON block found in OpenAI response.')
                        throw new HttpsError('internal', 'Failed to parse summaryFull response from OpenAI.')
                    }
                }

                // Validate required fields
                const requiredFields = ['summary', 'moods', 'topics', 'tone', 'keywords', 'memories', 'insights']
                const missing = requiredFields.filter(f => !parsed[f] || parsed[f].length === 0)

                if (missing.length) {
                    console.warn('⚠️ [summaryFull] Missing fields in response:', missing)
                    throw new HttpsError('internal', `SummaryFull result missing required fields: ${missing.join(', ')}`)
                }

                return {
                    summary: parsed.summary,
                    moods: parsed.moods,
                    topics: parsed.topics,
                    tone: parsed.tone,
                    keywords: parsed.keywords,
                    memories: parsed.memories,
                    insights: parsed.insights,
                    tokenUsage: resp.usage
                }
            }

            // --- NEW CHAT ---
            if (packageCode === 'newChat') {
                const { summaries = [] } = request.data || {}

                if (!profile || !userName) {
                    throw new HttpsError('invalid-argument', '`profile` (user instructions) and `userName` must be provided for newChat.');
                }

                const priorContext = summaries.map((s, i) =>
                    `Previous Chat #${i + 1}: "${s.summary}"\n• Moods: ${s.moods?.join(', ') || 'unknown'}\n• Topics: ${s.topics?.join(', ') || 'none'}`
                ).join('\n\n');

                const systemMsg = `
        You are an engaging, friendly journaling AI assistant for a user named ${userName}.
        Here are their journaling preferences and personal context: ${profile}
        
        Here are some summaries of their recent journal entries:
        ${priorContext}
        `.trim();

                const userPrompt = [
                    { role: 'user', content: "Generate a short but warm 'welcome to your journal' message that prompts the user to reflect or share, based on their profile. Also, suggest a creative, relevant chat title as JSON: { \"title\": \"...\", \"welcome\": \"...\" }" }
                ];

                const resp = await openai.chat.completions.create({
                    model: 'gpt-4.1-mini',
                    messages: [
                        { role: 'system', content: systemMsg },
                        ...userPrompt
                    ],
                    temperature: 0.85
                });

                let jsonOut = null;
                try {
                    // Try to parse the response as JSON (the LLM will almost always return a block)
                    jsonOut = JSON.parse(resp.choices?.[0]?.message?.content);
                } catch (e) {
                    // Fallback: Try to extract JSON using regex if LLM adds text around it
                    const match = resp.choices?.[0]?.message?.content.match(/{[\s\S]*}/);
                    if (match) jsonOut = JSON.parse(match[0]);
                }

                if (!jsonOut || !jsonOut.title || !jsonOut.welcome) {
                    throw new HttpsError('internal', 'AI response did not return both a title and welcome message.');
                }
                return {
                    chatTitle: jsonOut.title,
                    welcomeMessage: jsonOut.welcome,
                    tokenUsage: resp.usage
                };
            }

            // --- STANDARD MESSAGE (Chat Continuation) ---
            if (packageCode === 'message') {
                const {
                    messages,
                    chunks = [],
                    summaries = [],
                    profile = '',
                    userName = 'User',
                    timezone = 'UTC',
                    localTime = '',
                    lastAImessage = ''
                } = request.data || {}

                if (!Array.isArray(messages) || messages.length === 0) {
                    throw new HttpsError('invalid-argument', '`messages` must be a non-empty array for chat message.')
                }

                const structuredIntro = `
      You are a supportive, friendly AI journaling assistant for ${userName}.
      Their preferences: ${profile || 'unspecified'}.
      Current local time: ${localTime} (${timezone}).
      
      Your job is to help the user reflect and continue their journaling conversation naturally.
      Avoid summarizing, stay conversational and emotionally attuned.
      `.trim()

                // 🧠 Memory from prior summaries
                const summaryContext = summaries.map((s, i) => ({
                    role: 'system',
                    content: `Prior summary [${i + 1}]: "${s.summary}" (moods: ${s.moods?.join(', ')}, topics: ${s.topics?.join(', ')})`
                }))

                // 🔁 Memory from chunked in-chat summaries
                const chunkContext = chunks.map((chunk, i) => ({
                    role: 'system',
                    content: `Chunk memory [${i + 1}]: "${chunk.summary}" (moods: ${chunk.moods?.join(', ')}, topics: ${chunk.topics?.join(', ')})`
                }))

                const lastReplyContext = lastAImessage
                    ? [{ role: 'assistant', content: lastAImessage }]
                    : []

                const promptMessages = [
                    { role: 'system', content: structuredIntro },
                    ...summaryContext,
                    ...chunkContext,
                    ...lastReplyContext,
                    ...messages
                ]

                const resp = await openai.chat.completions.create({
                    model: 'gpt-4.1-mini',
                    messages: promptMessages,
                    temperature: 0.85
                })

                const aiMessage = resp.choices?.[0]?.message?.content || ''
                return {
                    aiMessage,
                    tokenUsage: resp.usage
                }
            }

            // --- CHUNK SUMMARY ---
            if (packageCode === 'summaryChunk') {
                if (!Array.isArray(messages) || messages.length === 0) {
                    throw new HttpsError('invalid-argument', '`messages` must be a non-empty array for summaryChunk.');
                }

                const prompt = `
      You are a journaling AI assistant summarising a short slice of user conversation.
      
      Write:
      1. A concise summary of the user’s experience or emotional reflection.
      2. A list of 1–3 mood keywords that best describe the user's emotional state in this moment.
      3. A list of 1–3 topics discussed (e.g., productivity, sleep, motivation, relationships, burnout).
      
      Respond **only** in the following JSON format:
      {
        "summary": "...",
        "moods": ["..."],
        "topics": ["..."]
      }
        `.trim();

                const chatMessages = [
                    { role: 'system', content: prompt },
                    ...messages
                ];

                console.log('🧠 [summaryChunk] Requesting OpenAI with', JSON.stringify(chatMessages, null, 2));

                const resp = await openai.chat.completions.create({
                    model: 'gpt-4.1-mini',
                    messages: chatMessages,
                    temperature: 0.7
                });

                const raw = resp.choices?.[0]?.message?.content || '';
                console.log('🧠 [summaryChunk] Raw OpenAI response:', raw);

                let parsed = null;

                try {
                    parsed = JSON.parse(raw);
                } catch (e) {
                    const match = raw.match(/{[\s\S]*}/);
                    if (match) {
                        try {
                            parsed = JSON.parse(match[0]);
                            console.warn('⚠️ [summaryChunk] Used fallback JSON parser from match:', match[0]);
                        } catch (_) {
                            console.error('❌ [summaryChunk] Failed to parse fallback match:', match[0]);
                            throw new HttpsError('internal', 'Failed to parse fallback JSON for summaryChunk.');
                        }
                    } else {
                        console.error('❌ [summaryChunk] No valid JSON found in response:', raw);
                        throw new HttpsError('internal', 'Failed to parse JSON response for summaryChunk.');
                    }
                }

                if (!parsed.summary || !Array.isArray(parsed.moods) || !Array.isArray(parsed.topics)) {
                    console.error('❌ [summaryChunk] Parsed JSON missing required fields:', parsed);
                    throw new HttpsError('internal', 'Chunk summary response is missing required fields.');
                }

                console.log('✅ [summaryChunk] Final parsed chunk:', parsed);

                return {
                    summary: parsed.summary,
                    moods: parsed.moods,
                    topics: parsed.topics,
                    tokenUsage: resp.usage
                }
            }

            // --- Unknown packageCode ---
            throw new HttpsError('invalid-argument', `Unknown packageCode: ${packageCode}`);

        } catch (err) {
            if (err.response) {
                console.error('🔥 [OpenAI Error Response]', err.response.data);
                console.error('🔥 [OpenAI Error Status]', err.response.status);
                console.error('🔥 [OpenAI Error Headers]', err.response.headers);
            } else {
                console.error('🔥 [OpenAI/Other Error Message]', err.message);
            }
            throw new HttpsError('internal', 'Failed to complete OpenAI journal request.');
        }
    }
)