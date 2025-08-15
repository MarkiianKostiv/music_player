import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSongsStore } from 'stores/songs.store';
import { usePlayer } from 'providers/playerProvider';
import { Routes } from 'navigation/routes';

export default function SongScreen() {
  const { id } = useLocalSearchParams();
  const { songs, setCurrentSongUri } = useSongsStore();
  const { playSong, status } = usePlayer();
  const router = useRouter();

  const currentIndex = songs.findIndex((song) => song.id === id);
  const currentSong = songs[currentIndex];

  if (!currentSong) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-main-color">Song not found</Text>
      </View>
    );
  }

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
      currentUri: currentSong.id,
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

  return (
    <View className="flex-1 bg-secondary-color">
      <View className="flex-row items-center p-4">
        <Link href={Routes.HOME} asChild>
          <Pressable className="p-2" android_ripple={{ color: '#ffffff22', radius: 24 }}>
            <MaterialIcons name="arrow-back" size={28} color="#fff" />
          </Pressable>
        </Link>
        <Text
          className="ml-2 flex-1 text-lg font-semibold text-background-main-color"
          numberOfLines={1}
          ellipsizeMode="tail">
          {currentSong.title.replace('.mp3', '')}
        </Text>
      </View>
      <View className="bg-main-color/20 mx-4 h-2 overflow-hidden rounded-full">
        <View
          className="h-full bg-red-700"
          style={{
            width: `${status.duration ? (status.currentTime / status.duration) * 100 : 0}%`,
          }}
        />
      </View>
      <View className="mt-2 flex-row justify-between px-4">
        <Text className="text-main-color">{formatTime(status.currentTime)}</Text>
        <Text className="text-main-color">{formatTime(currentSong.duration ?? 0)}</Text>
      </View>
      <View className="mt-12 flex-row items-center justify-center gap-6">
        <Pressable onPress={handlePrev} className="p-2">
          <MaterialIcons name="skip-previous" size={48} color="#fff" />
        </Pressable>

        <Pressable onPress={handlePlayPause} className="rounded-full bg-main-color p-4">
          <MaterialIcons name={status.playing ? 'pause' : 'play-arrow'} size={56} color="#fff" />
        </Pressable>

        <Pressable onPress={handleNext} className="p-2">
          <MaterialIcons name="skip-next" size={48} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
