import { View, TextInput } from 'react-native';
import { Loader } from 'components/loader';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGesture } from 'hooks/useGesture';
import { useFirstLaunch } from '../hooks/useFirstLaunch';
import { useState } from 'react';
import { AppHeader } from 'components/appHeader';
import { SongList } from 'components/songsList';
import { useQuery } from '@tanstack/react-query';
import { useSongsStore } from 'stores/songs.store';
import { ErrorComponent } from 'components/error/error';
import { InfoMessageComponent } from 'components/message';
import { IntroScreen } from 'components/intro';
import { Song } from 'types/song.type';
import { BottomMiniPlayer } from 'components/bottomMiniPlayer';
import { IconLink } from 'components/iconLink';
import { Routes } from 'navigation/routes';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  const isFirstLaunch = useFirstLaunch();
  const [showIntro, setShowIntro] = useState(true);
  const { fetchSongs } = useSongsStore();

  const { isLoading, isError } = useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: async () => {
      const data = await fetchSongs();
      const result: Song[] = data ?? [];
      useSongsStore.setState({ songs: result });
      return result;
    },
  });

  const filteredSongs = useSongsStore((s) => s.filteredSongs);
  const searchTerm = useSongsStore((s) => s.searchTerm);
  const setSearchTerm = useSongsStore((s) => s.setSearchTerm);
  const router = useRouter();
  const currentUri = useSongsStore((s) => s.currentUri);
  const currentSong = filteredSongs.find((s) => s.uri === currentUri);

  const { gesture: swipeUpGesture, animatedStyle: upStyle } = useGesture({
    direction: 'up',
    onSuccess: () => {
      if (currentSong) router.push(`${Routes.SONGS}/${currentSong.id}?transition=up`);
    },
  });

  const { gesture: swipeRightGesture, animatedStyle: rightStyle } = useGesture({
    direction: 'right',
    onSuccess: () => router.push(`${Routes.CHAT}?transition=right`),
  });

  const combinedGesture = Gesture.Race(swipeUpGesture, swipeRightGesture);

  if (isFirstLaunch === null) return null;

  if (isFirstLaunch && showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (isLoading) {
    return (
      <Loader
        text="Loading songs..."
        containerClassName="flex-1 items-center justify-center bg-background-main-color"
        textClassName="text-main-color"
      />
    );
  }

  if (isError) {
    return <ErrorComponent message="Fail to load songs" />;
  }

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[{ flex: 1 }, upStyle, rightStyle]}
        className="bg-background-main-color">
        <AppHeader />
        <View className="mt-3">
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search by title or author"
            placeholderTextColor="#9ca3af"
            className="rounded-xl bg-main-color px-4 py-3 text-secondary-color shadow-sm"
          />
        </View>
        {filteredSongs && filteredSongs.length > 0 ? (
          <>
            <SongList songs={filteredSongs} />
            <BottomMiniPlayer songs={filteredSongs} />
          </>
        ) : (
          <InfoMessageComponent message="No songs found" />
        )}
        <View className="absolute bottom-20 right-0 z-50">
          <IconLink
            href={Routes.CHAT}
            icon={<MaterialIcons name="chat" size={28} />}
            containerClassName="p-4"
          />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
