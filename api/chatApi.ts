import { API_SERVICE_BASE_URLS } from './config';

/**
 * Sends the chat payload to the configured API and returns the reply text.
 * Preserves the same response parsing/fallback logic used previously in the store.
 */
export async function sendChatPayload(payload: any): Promise<string> {
  if (!API_SERVICE_BASE_URLS || !API_SERVICE_BASE_URLS.chat) {
    throw new Error('Chat API base URL not configured');
  }

  const res = await fetch(API_SERVICE_BASE_URLS.chat, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const textErr = await res.text().catch(() => '');
    throw new Error(`Chat API error: ${res.status} ${textErr}`);
  }

  const data = await res.json().catch(() => null);
  let replyText: string | undefined;
  if (data) {
    replyText =
      data.reply ??
      data.text ??
      data.message ??
      (Array.isArray(data.messages) ? data.messages[0]?.text : undefined);
  }

  if (!replyText) replyText = `Server did not return a reply.`;
  return replyText;
}
