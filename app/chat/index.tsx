import { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from 'components/appHeader';
import { IconLink } from 'components/iconLink';
import { Routes } from 'navigation/routes';
import { useChatStore } from 'stores/chat.store';
import { useQueryClient } from '@tanstack/react-query';
import { sendChatPayload } from 'api/chatApi';
import { TypingIndicator } from 'components/typingIndicator';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useGesture } from 'hooks/useGesture';
import { useRouter } from 'expo-router';

export default function ChatPage() {
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const loadInitialMessages = useChatStore((s) => s.loadInitialMessages);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (messages.length === 0) {
      loadInitialMessages([
        {
          _id: '1',
          text: 'Hi there! I am your AI chat. Write me something what you want to talk about music.',
          createdAt: new Date(),
          user: { _id: 'bot', name: 'AI Bot' },
        },
      ]);
    }
  }, [loadInitialMessages, messages.length]);

  const queryClient = useQueryClient();

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');

    const userMessage = {
      _id: Math.random().toString(),
      text,
      createdAt: new Date(),
      user: { _id: 'user', name: 'You' },
    } as any;

    useChatStore.getState().addMessage(userMessage);

    try {
      useChatStore.setState({ loading: true, error: null });

      const currentMessages = [...useChatStore.getState().messages];

      const lastUserMessages = currentMessages
        .filter((m) => m.user._id === 'user')
        .slice(0, 4)
        .reverse()
        .map((m) => ({
          query: m.text,
          type: 'prev_context_message' as const,
        }));

      const currentMessage = { query: text, type: 'current_message' as const };
      const payload = { messages: [...lastUserMessages, currentMessage].slice(-5) };

      const replyText = await queryClient.fetchQuery({
        queryKey: ['chat', payload],
        queryFn: () => sendChatPayload(payload),
      });

      const botMessage = {
        _id: Math.random().toString(),
        text: replyText,
        createdAt: new Date(),
        user: { _id: 'bot', name: 'AI Bot' },
      } as any;

      useChatStore.getState().addMessage(botMessage);
      useChatStore.setState({ loading: false });
    } catch (err: any) {
      useChatStore.setState({ loading: false, error: err?.message });
    }
  };

  const router = useRouter();
  const { gesture: leftGesture, animatedStyle: leftStyle } = useGesture({
    direction: 'left',
    onSuccess: () => router.push(Routes.HOME),
  });

  return (
    <GestureDetector gesture={leftGesture}>
      <Animated.View style={[{ flex: 1 }, leftStyle]}>
        <KeyboardAvoidingView
          className="flex-1 bg-background-main-color"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <AppHeader />

          <IconLink href={Routes.HOME} icon={<MaterialIcons name="arrow-back" size={28} />} />

          <FlatList
            inverted
            data={messages}
            keyExtractor={(item) => item._id}
            contentContainerClassName="p-4"
            renderItem={({ item }) => (
              <View
                className={`my-1 max-w-[80%] rounded-2xl px-3 py-2 ${
                  item.user._id === 'user' ? 'self-end bg-indigo-600' : 'self-start bg-gray-300'
                }`}>
                <Text className={`${item.user._id === 'user' ? 'text-white' : 'text-black'}`}>
                  {item.text}
                </Text>
                <Text
                  className={`mt-1 text-xs ${item.user._id === 'user' ? 'text-white' : 'text-black'}`}>
                  {item.user.name} • {item.createdAt.toLocaleTimeString()}
                </Text>
              </View>
            )}
            ListHeaderComponent={loading ? <TypingIndicator /> : null}
          />

          <View className="mb-4 flex-row items-center gap-3 border-t border-gray-300 p-2">
            <TextInput
              className="mr-2 mt-3 flex-1 rounded-full border border-gray-300 px-4 py-4"
              style={{ color: '#fff' }}
              placeholder="Write a message..."
              placeholderTextColor="#aaa"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity onPress={sendMessage}>
              <MaterialIcons name="send" size={28} color="#4f46e5" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </GestureDetector>
  );
}
