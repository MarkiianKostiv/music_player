import { FlatList, View } from 'react-native';
import { SongItem } from './songItem';
import Animated, { FadeInUp } from 'react-native-reanimated';

const mockSongs = [
  { id: 1, title: 'Song One', artist: 'Artist A' },
  { id: 2, title: 'Song Two', artist: 'Artist B' },
  { id: 3, title: 'Song Three', artist: 'Artist C' },
  { id: 4, title: 'Song Four', artist: 'Artist D' },
  { id: 5, title: 'Song Five', artist: 'Artist E' },
  { id: 6, title: 'Song Five', artist: 'Artist E' },
  { id: 7, title: 'Song Five', artist: 'Artist E' },
  { id: 8, title: 'Song Five', artist: 'Artist E' },
  { id: 9, title: 'Song Five', artist: 'Artist E' },
  { id: 10, title: 'Song Five', artist: 'Artist E' },
  { id: 11, title: 'Song Five', artist: 'Artist E' },
  { id: 12, title: 'Song Five', artist: 'Artist E' },
  { id: 13, title: 'Song Five', artist: 'Artist E' },
  { id: 14, title: 'Song Five', artist: 'Artist E' },
  { id: 15, title: 'Song Five', artist: 'Artist E' },
  { id: 16, title: 'Song Five', artist: 'Artist E' },
  { id: 17, title: 'Song Five', artist: 'Artist E' },
  { id: 18, title: 'Song Five', artist: 'Artist E' },
];

export function SongList() {
  return (
    <FlatList
      data={mockSongs}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 16 }}
      ItemSeparatorComponent={() => <View className="h-3" />}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
          <SongItem
            title={item.title}
            artist={item.artist}
            isPlaying={index === 0}
            onPressPlay={() => {
              console.log(`Playing ${item.title}`);
            }}
          />
        </Animated.View>
      )}
    />
  );
}
