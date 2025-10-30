import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export const useBeatVisualizer = (isPlaying: boolean, numBars = 9) => {
  const scalesRef = useRef<Animated.Value[]>([]);

  if (scalesRef.current.length !== numBars) {
    scalesRef.current = Array.from({ length: numBars }, () => new Animated.Value(1));
  }

  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const startAnimation = () => {
    const amplitude = 0.6;
    const base = 1;

    animationsRef.current.forEach((a) => a.stop && a.stop());
    animationsRef.current = [];

    scalesRef.current.forEach((s, i) => {
      const up = Animated.timing(s, {
        toValue: base + amplitude,
        duration: 600 + (i % 3) * 100,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      });

      const down = Animated.timing(s, {
        toValue: base - amplitude / 1.5,
        duration: 600 + (i % 3) * 100,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      });

      const seq = Animated.sequence([up, down]);
      const loop = Animated.loop(seq);
      animationsRef.current.push(loop);

      // stagger start time for wave effect
      setTimeout(() => loop.start(), i * 100);
    });
  };

  const stopAnimation = () => {
    animationsRef.current.forEach((a) => a.stop && a.stop());
    animationsRef.current = [];

    scalesRef.current.forEach((s) => {
      Animated.timing(s, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    if (isPlaying) startAnimation();
    else stopAnimation();

    return () => stopAnimation();
  }, [isPlaying, numBars]);

  return scalesRef.current;
};
