import { Gesture } from 'react-native-gesture-handler';
import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right';

type UseMiniPlayerGestureOptions = {
  direction: Direction;
  threshold?: number;
  onSuccess?: () => void;
  enabled?: boolean;
};

const { height, width } = Dimensions.get('window');

export const useGesture = ({
  direction,
  threshold = 0.2,
  onSuccess,
  enabled = true,
}: UseMiniPlayerGestureOptions) => {
  const shared = useSharedValue(0);

  const reset = useCallback(() => {
    shared.value = withSpring(0);
  }, [shared]);

  const animatedStyle = useAnimatedStyle(() => {
    if (direction === 'up' || direction === 'down') {
      return { transform: [{ translateY: shared.value }] };
    }
    return { transform: [{ translateX: shared.value }] };
  }, []);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onUpdate((e) => {
      if (direction === 'up') {
        shared.value = Math.min(e.translationY, 0);
      } else if (direction === 'down') {
        shared.value = Math.max(e.translationY, 0);
      } else if (direction === 'left') {
        shared.value = Math.min(e.translationX, 0);
      } else {
        shared.value = Math.max(e.translationX, 0);
      }
    })
    .onEnd((e) => {
      const threshPx =
        threshold > 1
          ? threshold
          : direction === 'up' || direction === 'down'
            ? height * threshold
            : width * threshold;
      let passed = false;

      if (direction === 'up') passed = e.translationY < -threshPx || e.velocityY < -600;
      else if (direction === 'down') passed = e.translationY > threshPx || e.velocityY > 600;
      else if (direction === 'left') passed = e.translationX < -threshPx || e.velocityX < -600;
      else if (direction === 'right') passed = e.translationX > threshPx || e.velocityX > 600;

      if (passed) {
        const outTo =
          direction === 'up'
            ? -height
            : direction === 'down'
              ? height
              : direction === 'left'
                ? -width
                : width;
        shared.value = withTiming(outTo, { duration: 400 }, () => {
          if (onSuccess) runOnJS(onSuccess)();
          shared.value = withTiming(0, { duration: 10 });
        });
      } else {
        shared.value = withSpring(0);
      }
    });

  return { gesture: pan, animatedStyle, reset };
};
