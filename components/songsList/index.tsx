import { FlatList, View } from 'react-native';
import { SongItem } from './songItem';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Song } from 'types/song.type';
import { useSongsStore } from 'stores/songs.store';
import { useCustomPlayer } from 'hooks/useCustomPlayer';

export function SongList({ songs }: { songs: Song[] }) {
  const { currentUri, isPlaying, setCurrentSongUri, setIsPlaying } = useSongsStore();
  const { playSong } = useCustomPlayer();

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 50).duration(400)}>
          <SongItem
            title={item.title}
            isPlaying={currentUri === item.uri && isPlaying}
            onPressPlay={() => {
              playSong({
                uri: item.uri,
                currentUri,
                isPlaying,
                setIsPlaying,
                setCurrentSongUri,
              });
            }}
          />
        </Animated.View>
      )}
    />
  );
}
