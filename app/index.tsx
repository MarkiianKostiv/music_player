import { View, Text, Pressable } from 'react-native';
import { useFirstLaunch } from '../hooks/useFirstLaunch';
import { useState } from 'react';
import { IntroComponent } from 'components/intro';
import { AppHeader } from 'components/appHeader';
import { SongList } from 'components/songsList';

export default function Home() {
  const isFirstLaunch = useFirstLaunch();
  const [introDone, setIntroDone] = useState(false);

  if (isFirstLaunch === null) return null;

  if (isFirstLaunch && !introDone) {
    return (
      <Pressable
        className="flex-1 items-center justify-center bg-background-main-color"
        onPress={() => setIntroDone(true)}>
        <IntroComponent />
        <Text className="mt-6 text-base font-semibold text-main-color">
          Tap anywhere to continue
        </Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-1 bg-background-main-color">
      <AppHeader />
      <SongList />
    </View>
  );
}
