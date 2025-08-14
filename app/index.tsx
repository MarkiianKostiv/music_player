import { View, Text } from 'react-native';
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

export default function Home() {
  const isFirstLaunch = useFirstLaunch();
  const [showIntro, setShowIntro] = useState(true);
  const { fetchSongs } = useSongsStore();

  const {
    data: songs = [],
    isLoading,
    isError,
  } = useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: async () => {
      const data = await fetchSongs();
      useSongsStore.setState({ songs: data || [] });
      return data;
    },
  });

  if (isFirstLaunch === null) return null;

  if (isFirstLaunch && showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-main-color">
        <Text className="text-main-color">Loading songs...</Text>
      </View>
    );
  }

  if (isError) {
    return <ErrorComponent message="Fail to load songs" />;
  }

  return (
    <View className="flex-1 bg-background-main-color">
      <AppHeader />
      {songs && songs.length > 0 ? (
        <>
          <SongList songs={songs} />
          <BottomMiniPlayer />
        </>
      ) : (
        <InfoMessageComponent message="No songs found. Please add some music to your device." />
      )}
    </View>
  );
}
