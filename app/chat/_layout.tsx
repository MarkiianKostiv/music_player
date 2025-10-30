import { Slot, useLocalSearchParams } from 'expo-router';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from 'react-native-reanimated';

export default function ChatLayout() {
  const params = useLocalSearchParams();
  const t = (params as any).transition as string | undefined;

  const entering =
    t === 'right'
      ? SlideInRight.duration(400)
      : t === 'left'
        ? SlideInLeft.duration(400)
        : SlideInRight.duration(300);
  const exiting =
    t === 'right'
      ? SlideOutLeft.duration(400)
      : t === 'left'
        ? SlideOutRight.duration(400)
        : SlideOutLeft.duration(300);

  return (
    <Animated.View entering={entering} exiting={exiting} style={{ flex: 1 }}>
      <Slot />
    </Animated.View>
  );
}
