import { useAudioPlayer } from 'expo-audio';

export function useCustomPlayer() {
  const player = useAudioPlayer();

  interface PlaySongParams {
    uri: string;
    currentUri: string | null;
    isPlaying: boolean;
    setIsPlaying: (status: boolean) => void;
    setCurrentSongUri: (uri: string) => void;
  }
  const playSong = ({
    uri,
    currentUri,
    isPlaying,
    setIsPlaying,
    setCurrentSongUri,
  }: PlaySongParams) => {
    if (currentUri === uri && isPlaying) {
      player.pause();
      setIsPlaying(false);
      return;
    }

    if (currentUri === uri && !isPlaying) {
      player.play();
      setIsPlaying(true);
      return;
    }

    player.replace({ uri });
    setCurrentSongUri(uri);
    player.play();
    setIsPlaying(true);
  };

  return { playSong };
}
