import { View, Animated } from 'react-native';
import { useBeatVisualizer } from 'hooks/useBeatVisualizer';

const COLORS = ['#ff6b6b', '#51cf66', '#4dabf7', '#ffd43b', '#a855f7', '#ff9f43', '#ff7ab6'];

interface BeatVisualizerProps {
  isPlaying: boolean;
  numBars?: number;
}

export const BeatVisualizer = ({ isPlaying, numBars = 5 }: BeatVisualizerProps) => {
  const scales = useBeatVisualizer(isPlaying, numBars);

  return (
    <View className="h-[300px] w-full flex-row items-end justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
      {scales.map((scale, i) => (
        <Animated.View
          key={i}
          style={{
            width: 16,
            height: 100,
            marginHorizontal: 6,
            backgroundColor: '#4f46e5',
            borderRadius: 12,
            transform: [{ scaleY: scales[i] }],
            alignSelf: 'center',
          }}
        />
      ))}
    </View>
  );
};
