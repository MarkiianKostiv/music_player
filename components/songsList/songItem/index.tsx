import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FC } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

type SongItemProps = {
  title: string;
  artist?: string;
  isPlaying?: boolean;
  onPressPlay?: () => void;
};

export const SongItem: FC<SongItemProps> = ({ title, artist, isPlaying = false, onPressPlay }) => {
  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Pressable
        onPress={onPressPlay}
        android_ripple={{ color: '#ffffff22' }}
        className="flex-row items-center justify-between rounded-xl bg-secondary-color px-4 py-3 active:opacity-80"
        style={{ overflow: 'hidden' }}>
        <View className="w-[70%]">
          <Text
            className="mr-2 flex-1 text-lg font-medium text-background-main-color"
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>
          {!!artist && <Text className="text-sm text-main-color">{artist}</Text>}
        </View>
        <View>
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={28}
            className="text-background-main-color"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};
