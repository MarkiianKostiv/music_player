import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    };

    animate(dot1, 0);
    setTimeout(() => animate(dot2, 0), 200);
    setTimeout(() => animate(dot3, 0), 400);
  }, [dot1, dot2, dot3]);

  const t1 = dot1.interpolate({ inputRange: [0.3, 1], outputRange: [2, 0] });
  const s1 = dot1.interpolate({ inputRange: [0.3, 1], outputRange: [0.85, 1.2] });
  const t2 = dot2.interpolate({ inputRange: [0.3, 1], outputRange: [2, 0] });
  const s2 = dot2.interpolate({ inputRange: [0.3, 1], outputRange: [0.85, 1.2] });
  const t3 = dot3.interpolate({ inputRange: [0.3, 1], outputRange: [2, 0] });
  const s3 = dot3.interpolate({ inputRange: [0.3, 1], outputRange: [0.85, 1.2] });

  return (
    <View style={styles.typingContainer}>
      <Animated.View
        style={[styles.circle, { opacity: dot1, transform: [{ translateY: t1 }, { scale: s1 }] }]}
      />
      <Animated.View
        style={[styles.circle, { opacity: dot2, transform: [{ translateY: t2 }, { scale: s2 }] }]}
      />
      <Animated.View
        style={[styles.circle, { opacity: dot3, transform: [{ translateY: t3 }, { scale: s3 }] }]}
      />
    </View>
  );
};

const DOT_SIZE = 8;
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  typingContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    width: 90,
  },
  circle: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#6b7280',
    marginHorizontal: 6,
  },
});
