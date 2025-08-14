import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export function InfoMessageComponent({ message }: { message: string }) {
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      className="flex-1 items-center justify-center bg-background-main-color">
      <Animated.Text
        entering={SlideInDown.delay(200).springify()}
        className="px-4 text-center text-lg font-medium text-blue-700">
        {message}
      </Animated.Text>
    </Animated.View>
  );
}
