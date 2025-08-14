import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Platforms } from '../constants/platforms';

import '../global.css';

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient());
  const marginTop = Platform.OS === Platforms.ANDROID ? StatusBar.currentHeight || 0 : 0;
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView
        className={
          colorScheme === 'dark'
            ? 'dark flex-1 bg-background-main-color p-5'
            : 'bg-background-main-color'
        }
        style={{ marginTop }}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'} />
        <Slot />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
