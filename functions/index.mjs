// functions/index.mjs
import { setGlobalOptions } from 'firebase-functions/v2'
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { OpenAI } from 'openai'
import { defineSecret } from 'firebase-functions/params'

setGlobalOptions({ region: 'australia-southeast1', timeoutSeconds: 120, memory: '1GiB' })

const openaiKey = defineSecret('OPENAI_API_KEY')

export const generateJournalSummary = onCall(
  { secrets: [openaiKey] },
  async (request) => {

    if (!request.auth) {
      console.warn('🔒 [Auth] Authentication context is missing from request.auth.');
      throw new HttpsError('unauthenticated', 'User must be signed in to generate a journal summary.');
    }

    const { uid } = request.auth;
    const clientData = request.data;

    if (!clientData || !Array.isArray(clientData.messages) || clientData.messages.length === 0) {
      console.error('❌ [Input] Missing or invalid `messages` array in request.data');
      throw new HttpsError('invalid-argument', '`messages` must be a non-empty array of chat messages passed in request.data.');
    }

    try {
      const openai = new OpenAI({
        apiKey: openaiKey.value()
      });

      const resp = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are a warm, reflective journaling companion that helps users summarize their thoughts.' },
          ...clientData.messages,
          { role: 'user', content: 'Summarize this conversation into a journal entry.' }
        ],
        temperature: 0.8
      });

      const summary = resp.choices?.[0]?.message?.content || '';
      const usage = resp.usage;

      if (usage) {
        console.log(`📊 [OpenAI Usage] Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens}, Total: ${usage.total_tokens}`);
      }

      return { summary };

    } catch (err) {

      if (err.response) {
        console.error('🔥 [OpenAI Error Response]', err.response.data);
        console.error('🔥 [OpenAI Error Status]', err.response.status);
        console.error('🔥 [OpenAI Error Headers]', err.response.headers);
      } else {
        console.error('🔥 [OpenAI/Other Error Message]', err.message);
      }
      throw new HttpsError('internal', 'Failed to generate summary. Please try again later.');
    }
  }
);