import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FC } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

type SongItemProps = {
  title: string;
  artist?: string;
  isPlaying?: boolean;
  onPressPlay?: () => void;
  isSelected?: boolean;
};

export const SongItem: FC<SongItemProps> = ({
  title,
  artist,
  isPlaying = false,
  onPressPlay,
  isSelected,
}) => {
  return (
    <Animated.View entering={FadeInUp.duration(500)}>
      <Pressable
        onPress={onPressPlay}
        android_ripple={{ color: '#ffffff22' }}
        className={`flex h-16 flex-row items-center justify-between rounded-xl px-4 active:opacity-80
        ${isSelected ? 'border-2 border-main-color' : 'border border-transparent'}
        bg-secondary-color
      `}
        style={{ overflow: 'hidden' }}>
        <View className="w-[70%]">
          <Text
            className="mr-2 text-lg font-medium text-background-main-color"
            numberOfLines={1}
            ellipsizeMode="tail">
            {title.replace('.mp3', '')}
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
