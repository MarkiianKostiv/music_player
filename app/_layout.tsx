import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Platforms } from '../constants/platforms';
import { PlayerProvider } from 'providers/playerProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css';

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient());
  const marginTop = Platform.OS === Platforms.ANDROID ? StatusBar.currentHeight || 0 : 0;
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          <SafeAreaView
            className={
              colorScheme === 'dark'
                ? 'dark flex-1 bg-background-main-color p-5'
                : 'bg-background-main-color'
            }
            style={{ marginTop }}>
            <StatusBar barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'} />
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              style={{ flex: 1 }}>
              <Slot />
            </Animated.View>
          </SafeAreaView>
        </PlayerProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
