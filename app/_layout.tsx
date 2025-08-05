import { Slot } from 'expo-router';
import { SafeAreaView, Platform, StatusBar, useColorScheme } from 'react-native';
import { Platforms } from '../constants/platforms';

export default function Layout() {
  const marginTop = Platform.OS === Platforms.ANDROID ? StatusBar.currentHeight || 0 : 0;
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView
      className={
        colorScheme === 'dark'
          ? 'bg-background-main-color dark flex-1 p-5'
          : 'bg-background-main-color'
      }
      style={{ marginTop }}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'dark-content' : 'dark-content'} />

      <Slot />
    </SafeAreaView>
  );
}
