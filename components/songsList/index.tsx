import { View } from 'react-native';
import { SongItem } from './songItem';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Song } from 'types/song.type';
import { useSongsStore } from 'stores/songs.store';
import { usePlayer } from 'providers/playerProvider';
import { FlashList } from '@shopify/flash-list';

export function SongList({ songs }: { songs: Song[] }) {
  const { currentUri, setCurrentSongUri } = useSongsStore();
  const { playSong, status } = usePlayer();

  // const ITEM_HEIGHT = 64 + 12;

  return (
    <FlashList<Song>
      data={songs}
      //estimatedItemSize={ITEM_HEIGHT as any}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 40).duration(300)}>
          <SongItem
            title={item.title}
            isPlaying={currentUri === item.uri && status.playing}
            onPressPlay={() => {
              playSong({
                uri: item.uri,
                currentUri,
                isPlaying: status.playing,
                setCurrentSongUri,
              });
            }}
            isSelected={currentUri === item.uri}
          />
        </Animated.View>
      )}
    />
  );
}
