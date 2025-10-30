import { create } from 'zustand';
import { API_SERVICE_BASE_URLS } from 'api/config';

export type IMessage = {
  _id: string;
  text: string;
  createdAt: Date;
  user: { _id: 'user' | 'bot'; name: string };
};

type Responder = (text: string, payload: any) => Promise<string>;

type ChatStore = {
  messages: IMessage[];
  loading: boolean;
  error: string | null;
  loadInitialMessages: (initial?: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
  sendMessage: (text: string, responder?: Responder) => Promise<IMessage | undefined>;
  clearMessages: () => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  loadInitialMessages: (initial = []) => {
    set({ messages: initial });
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
    })),

  sendMessage: async (text, responder) => {
    if (!text.trim()) return;

    const userMessage: IMessage = {
      _id: Math.random().toString(),
      text: text.trim(),
      createdAt: new Date(),
      user: { _id: 'user', name: 'You' },
    };

    set((state) => ({
      messages: [userMessage, ...state.messages],
    }));

    const allMessages = get().messages;

    try {
      set({ loading: true, error: null });

      const lastUserMessages = allMessages
        .filter((m) => m.user._id === 'user')
        .slice(0, 4)
        .reverse()
        .map((m) => ({
          query: m.text,
          type: 'prev_context_message' as const,
        }));

      const currentMessage = { query: text.trim(), type: 'current_message' as const };
      const payload = { messages: [...lastUserMessages, currentMessage].slice(-5) };

      let replyText: string | undefined;

      if (responder) {
        replyText = await responder(text.trim(), payload);
      } else if (API_SERVICE_BASE_URLS?.chat) {
        const res = await fetch(API_SERVICE_BASE_URLS.chat, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const textErr = await res.text();
          throw new Error(`Chat API error: ${res.status} ${textErr}`);
        }

        const data = await res.json().catch(() => null);
        replyText =
          data?.reply ??
          data?.text ??
          data?.message ??
          (Array.isArray(data?.messages) ? data.messages[0]?.text : undefined);
      }

      if (!replyText) {
        replyText = "Hmm, I didn't get any response from the server.";
      }

      const botMessage: IMessage = {
        _id: Math.random().toString(),
        text: replyText,
        createdAt: new Date(),
        user: { _id: 'bot', name: 'AI Bot' },
      };

      set((state) => ({
        messages: [botMessage, ...state.messages],
        loading: false,
      }));

      return botMessage;
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? 'Failed to get bot reply' });
      return undefined;
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
