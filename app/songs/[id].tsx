import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useGesture } from 'hooks/useGesture';
import { MaterialIcons } from '@expo/vector-icons';
import { useSongsStore } from 'stores/songs.store';
import { usePlayer } from 'providers/playerProvider';
import { Routes } from 'navigation/routes';
import { BeatVisualizer } from 'components/beatVisualizer';
import { IconLink } from 'components/iconLink';
import { ErrorComponent } from 'components/error/error';

export default function SongScreen() {
  const { id } = useLocalSearchParams();
  const { songs, setCurrentSongUri, currentUri } = useSongsStore();
  const { playSong, status } = usePlayer();
  const router = useRouter();

  const currentIndex = songs.findIndex((song) => song.id === id);
  const currentSong = songs[currentIndex];

  const nextIndex = (currentIndex + 1) % songs.length;
  const prevIndex = (currentIndex - 1 + songs.length) % songs.length;

  const nextSong = songs[nextIndex];
  const prevSong = songs[prevIndex];

  if (status.didJustFinish) {
    playSong({
      uri: nextSong.uri,
      currentUri: id as string,
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
      currentUri: prevSong.id,
      isPlaying: true,
      setCurrentSongUri,
    });
    router.replace(`${Routes.SONGS}/${prevSong.id}`);
  };

  const handleNext = () => {
    playSong({
      uri: nextSong.uri,
      currentUri: nextSong.id,
      isPlaying: true,
      setCurrentSongUri,
    });
    router.replace(`${Routes.SONGS}/${nextSong.id}`);
  };

  const { gesture: downGesture, animatedStyle: downStyle } = useGesture({
    direction: 'down',
    onSuccess: () => router.push(Routes.HOME),
  });

  if (!currentSong) {
    return <ErrorComponent message="Song not found" />;
  }

  return (
    <GestureDetector gesture={downGesture}>
      <Animated.View
        style={[{ flex: 1 }, downStyle]}
        className="bg-background-main- flex-1 color-main-color">
        <IconLink
          href={Routes.HOME}
          icon={<MaterialIcons name="arrow-back" size={28} />}
          containerClassName="p-4"
        />

        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="mb-6 text-center text-xl font-semibold text-secondary-color"
            numberOfLines={2}
            ellipsizeMode="tail">
            {currentSong.title.replace('.mp3', '')}
          </Text>
          <BeatVisualizer isPlaying={status.playing} />
          <View className="bg-main-color/20 mb-2 mt-6 h-2 w-full overflow-hidden rounded-full">
            <View
              className="h-full bg-main-color"
              style={{
                width: `${status.duration ? (status.currentTime / status.duration) * 100 : 0}%`,
              }}
            />
          </View>

          <View className="mb-10 w-full flex-row justify-between">
            <Text className="text-sm text-main-color">{formatTime(status.currentTime)}</Text>
            <Text className="text-sm text-main-color">{formatTime(currentSong.duration ?? 0)}</Text>
          </View>

          <View className="flex-row items-center justify-center gap-8">
            <Pressable
              onPress={handlePrev}
              className="flex items-center justify-center rounded-full bg-main-color p-3">
              <MaterialIcons name="skip-previous" size={36} color="var(--background-main-color)" />
            </Pressable>

            <Pressable
              onPress={handlePlayPause}
              className="flex items-center justify-center rounded-full bg-main-color p-5 shadow-md">
              <MaterialIcons
                name={status.playing ? 'pause' : 'play-arrow'}
                size={56}
                color="var(--background-main-color)"
              />
            </Pressable>

            <Pressable
              onPress={handleNext}
              className="flex items-center justify-center rounded-full bg-main-color p-3">
              <MaterialIcons name="skip-next" size={36} color="var(--background-main-color)" />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
