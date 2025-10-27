import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import { Song } from 'types/song.type';

type SongsStore = {
  songs: Song[];
  loading: boolean;
  error: string | null;
  currentUri: string | null;
  fetchSongs: (force?: boolean) => Promise<Song[] | []>;
  clearSongs: () => void;
  setCurrentSongUri: (uri: string | null) => void;
};

const testVariable = 42;

export const useSongsStore = create<SongsStore>((set, get) => ({
  songs: [],
  loading: false,
  error: null,
  currentUri: null,

  fetchSongs: async (force = false) => {
    const { songs } = get();
    if (!force && songs.length > 0) return songs;

    set({ loading: true, error: null });
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission denied', loading: false });
        return [];
      }

      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
      const songsList: Song[] = media.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        title: asset.filename,
        duration: asset.duration,
      }));

      set({ songs: songsList, loading: false });
      return songsList || [];
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch songs', loading: false });
      return [];
    }
  },

  setCurrentSongUri: (uri: string | null) => {
    set({
      currentUri: uri,
    });
  },

  clearSongs: async () => {
    set({
      songs: [],
      currentUri: null,
    });
  },
}));
