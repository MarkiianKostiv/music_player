import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSongsStore } from 'stores/songs.store';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useCustomPlayer } from 'hooks/useCustomPlayer';

export function BottomMiniPlayer() {
  const { currentUri, isPlaying, songs, setIsPlaying, setCurrentSongUri } = useSongsStore();
  const player = useAudioPlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const { playSong } = useCustomPlayer();

  // Знаходимо поточну пісню
  const currentSong = songs.find((song) => song.uri === currentUri);

  //   console.log('Current Song:', currentSong);

  // Оновлюємо прогрес кожні 100мс
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentUri) {
      interval = setInterval(() => {
        const currentTime = player.currentTime;
        const totalDuration = player.duration;

        if (totalDuration > 0) {
          setProgress(currentTime / totalDuration);
          if (duration === 0) setDuration(totalDuration);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentUri, player, duration]);

  // Слухаємо зміни стану плеєра
  useEffect(() => {
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      if (status.isLoaded) {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
        if (status.duration) {
          setDuration(status.duration);
        }
      }
    });

    return () => subscription?.remove();
  }, [player, setIsPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Не рендеримо, якщо немає поточної пісні
  if (!currentUri || !currentSong) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutDown.duration(300)}
      className="border-main-color/20 absolute bottom-0 left-0 right-0 border-t bg-secondary-color">
      {/* Progress Bar */}
      <View className="bg-main-color/20 h-1">
        <View className="h-full bg-main-color" style={{ width: `${progress * 100}%` }} />
      </View>

      {/* Main Content */}
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Song Info */}
        <View className="mr-4 flex-1">
          <Text
            className="text-base font-medium text-background-main-color"
            numberOfLines={1}
            ellipsizeMode="tail">
            {currentSong.title.replace('.mp3', '')}
          </Text>
          <Text className="text-sm text-main-color">
            {formatTime(player.currentTime)} / {formatTime(currentSong.duration!)}
          </Text>
        </View>

        {/* Controls */}
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() => {
              playSong({
                uri: currentSong.uri,
                currentUri,
                isPlaying,
                setIsPlaying,
                setCurrentSongUri,
              });
            }}
            className="p-2"
            android_ripple={{ color: '#ffffff22', radius: 24 }}>
            <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={32} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
