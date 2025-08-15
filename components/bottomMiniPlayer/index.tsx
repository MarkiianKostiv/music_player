import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSongsStore } from 'stores/songs.store';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { usePlayer } from 'providers/playerProvider';
import { Song } from 'types/song.type';
import { Link } from 'expo-router';
import { Routes } from 'navigation/routes';

export function BottomMiniPlayer({ songs }: { songs: Song[] }) {
  const { currentUri, setCurrentSongUri } = useSongsStore();
  const { playSong, status } = usePlayer();

  const currentIndex = songs.findIndex((song) => song.uri === currentUri);
  const currentSong = songs[currentIndex];

  if (!currentSong) return null;

  const nextIndex = (currentIndex + 1) % songs.length;
  const prevIndex = (currentIndex - 1 + songs.length) % songs.length;

  const nextSong = songs[nextIndex];
  const prevSong = songs[prevIndex];

  if (status.didJustFinish) {
    playSong({
      uri: nextSong.uri,
      currentUri,
      isPlaying: false,
      setCurrentSongUri,
    });
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    playSong({
      uri: currentSong.uri,
      currentUri,
      isPlaying: status.playing,
      setCurrentSongUri,
    });
  };

  const handlePrev = () => {
    playSong({
      uri: prevSong.uri,
      currentUri,
      isPlaying: false,
      setCurrentSongUri,
    });
  };

  const handleNext = () => {
    playSong({
      uri: nextSong.uri,
      currentUri,
      isPlaying: false,
      setCurrentSongUri,
    });
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutDown.duration(300)}
      className="border-main-color/20 absolute bottom-0 left-0 right-0 border-t bg-secondary-color">
      <View className="bg-main-color/20 h-1">
        <View
          className="h-full bg-red-700"
          style={{
            width: `${status.duration ? (status.currentTime / status.duration) * 100 : 0}%`,
          }}
        />
      </View>

      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="mr-4 flex-1">
          <Link className="flex w-full flex-col" href={`${Routes.SONGS}/${currentSong.id}`}>
            <View>
              <Text
                className="flex text-base font-medium text-background-main-color"
                numberOfLines={1}
                ellipsizeMode="tail">
                {currentSong.title.replace('.mp3', '')}
              </Text>
            </View>

            <View>
              <Text className="mt-1 flex flex-1 text-sm text-main-color">
                {formatTime(status.currentTime)} / {formatTime(currentSong.duration ?? 0)}
              </Text>
            </View>
          </Link>
        </View>

        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={handlePrev}
            className="p-2"
            android_ripple={{ color: '#ffffff22', radius: 24 }}>
            <MaterialIcons name="skip-previous" size={32} color="#fff" />
          </Pressable>
          <Pressable
            onPress={handlePlayPause}
            className="p-2"
            android_ripple={{ color: '#ffffff22', radius: 24 }}>
            <MaterialIcons name={status.playing ? 'pause' : 'play-arrow'} size={32} color="#fff" />
          </Pressable>
          <Pressable
            onPress={handleNext}
            className="p-2"
            android_ripple={{ color: '#ffffff22', radius: 24 }}>
            <MaterialIcons name="skip-next" size={32} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
