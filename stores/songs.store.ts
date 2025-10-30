import { create } from 'zustand';
import * as MediaLibrary from 'expo-media-library';
import { Song } from 'types/song.type';

type SongsStore = {
  songs: Song[];
  filteredSongs: Song[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  currentUri: string | null;
  setCurrentSongUri: (uri: string | null) => void;
  fetchSongs: () => Promise<Song[] | undefined>;
  setSearchTerm: (term: string) => void;
  clearSongs: () => void;
};

export const useSongsStore = create<SongsStore>((set, get) => ({
  songs: [],
  filteredSongs: [],
  searchTerm: '',
  currentUri: null,
  setCurrentSongUri: (uri: string | null) => set({ currentUri: uri }),
  loading: false,
  error: null,
  fetchSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'Permission denied', loading: false });
        return undefined;
      }

      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 1000 });
      const songs: Song[] = media.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        title: asset.filename,
        artist: (asset as any).artist ?? undefined,
        duration: (asset as any).duration ?? undefined,
      }));

      const term = get().searchTerm.trim().toLowerCase();
      const filtered = term
        ? songs.filter(
            (s) =>
              s.title.toLowerCase().includes(term) || (s.artist || '').toLowerCase().includes(term)
          )
        : songs;

      set({ songs, filteredSongs: filtered, loading: false });
      return songs;
    } catch (e: any) {
      set({ error: e?.message || 'Failed to fetch songs', loading: false });
      return undefined;
    }
  },
  setSearchTerm: (term: string) => {
    const normalized = term.trim();
    const { songs } = get();
    const lower = normalized.toLowerCase();
    const filtered = lower
      ? songs.filter(
          (s) =>
            s.title.toLowerCase().includes(lower) || (s.artist || '').toLowerCase().includes(lower)
        )
      : songs;
    set({ searchTerm: normalized, filteredSongs: filtered });
  },
  clearSongs: () => set({ songs: [], filteredSongs: [] }),
}));
