import { Slot, useLocalSearchParams } from 'expo-router';
import Animated, {
  SlideInRight,
  SlideOutLeft,
  SlideInUp,
  SlideOutDown,
  SlideInDown,
  SlideOutUp,
} from 'react-native-reanimated';

export default function SongsLayout() {
  const params = useLocalSearchParams();
  const t = (params as any).transition as string | undefined;

  const entering =
    t === 'down'
      ? SlideInUp.duration(400)
      : t === 'up'
        ? SlideInDown.duration(400)
        : SlideInRight.duration(300);
  const exiting =
    t === 'up'
      ? SlideOutDown.duration(400)
      : t === 'down'
        ? SlideOutUp.duration(400)
        : SlideOutLeft.duration(300);

  return (
    <Animated.View entering={entering} exiting={exiting} style={{ flex: 1 }}>
      <Slot />
    </Animated.View>
  );
}
