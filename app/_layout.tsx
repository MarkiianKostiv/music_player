import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, useColorScheme } from 'react-native';
import { Platforms } from '../constants/platforms';

import '../global.css';

export default function Layout() {
  const marginTop = Platform.OS === Platforms.ANDROID ? StatusBar.currentHeight || 0 : 0;
  const colorScheme = useColorScheme();

  return (
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
  );
}
