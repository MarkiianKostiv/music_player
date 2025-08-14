import { Text } from 'react-native';
import { Routes } from 'navigation/routes';
import { Link } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export function IntroComponent() {
  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="bg-secondary-color/20 w-full max-w-md space-y-6 rounded-2xl p-8 shadow-lg">
      <Text className="mb-2 text-4xl font-extrabold tracking-tight text-main-color">
        Music Player
      </Text>
      <Text className="mb-4 text-lg font-medium text-secondary-color">
        Listen your favorite songs
      </Text>
      <Text className="text-base text-main-color">
        Try advanced features of searching your favorite music.
        <Link
          href={Routes.CHAT}
          className="ml-2 font-semibold text-blue-500 underline dark:text-blue-400">
          Use Our Chat
        </Link>
      </Text>
    </Animated.View>
  );
}
