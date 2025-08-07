import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { Song } from 'types/song.type';

type SongsStore = {
  songs: Song[];
  loading: boolean;
  error: string | null;
  currentIndex: number | null;
  preloadedAudio: Record<string, Audio.Sound>;
  fetchSongs: () => Promise<void>;
  preloadSongsAround: (index: number) => Promise<void>;
  setCurrentIndex: (index: number) => Promise<void>;
  clearSongs: () => void;
};

export const useSongsStore = create<SongsStore>((set, get) => ({
  songs: [],
  loading: false,
  error: null,
  currentIndex: null,
  preloadedAudio: {},

  fetchSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission denied', loading: false });
        return;
      }
      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
      const songs: Song[] = media.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        title: asset.filename,
        duration: asset.duration,
      }));
      set({ songs, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch songs', loading: false });
    }
  },

  setCurrentIndex: async (index) => {
    const { songs, preloadSongsAround } = get();
    if (index < 0 || index >= songs.length) return;
    set({ currentIndex: index });
    await preloadSongsAround(index);
  },

  preloadSongsAround: async (index) => {
    const { songs, preloadedAudio } = get();
    const indicesToPreload = [index - 2, index - 1, index, index + 1, index + 2];
    const validIndices = indicesToPreload.filter((i) => i >= 0 && i < songs.length);

    const newPreloaded: Record<string, Audio.Sound> = { ...preloadedAudio };

    for (const i of validIndices) {
      const song = songs[i];
      if (!newPreloaded[song.id]) {
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: song.uri });
          newPreloaded[song.id] = sound;
        } catch (e) {
          console.warn('Failed to preload', song.title);
        }
      }
    }

    // Optional: Remove unused sounds from memory
    const keepIds = validIndices.map((i) => songs[i].id);
    for (const [id, sound] of Object.entries(newPreloaded)) {
      if (!keepIds.includes(id)) {
        await sound.unloadAsync();
        delete newPreloaded[id];
      }
    }

    set({ preloadedAudio: newPreloaded });
  },

  clearSongs: () => {
    const { preloadedAudio } = get();
    Object.values(preloadedAudio).forEach((sound) => sound.unloadAsync());
    set({ songs: [], preloadedAudio: {}, currentIndex: null });
  },
}));
