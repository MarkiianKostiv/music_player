import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from 'react-native';

export function AppHeader() {
  return (
    <Animated.View entering={FadeInDown.duration(500)} className="px-4 pb-4 pt-8">
      <Text className="text-2xl font-bold text-main-color">Music Player</Text>
      {/* Search input here */}
    </Animated.View>
  );
}
