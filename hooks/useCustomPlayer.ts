import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

export function useCustomPlayer() {
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  interface PlaySongParams {
    uri: string;
    currentUri: string | null;
    isPlaying: boolean;
    setCurrentSongUri: (uri: string) => void;
  }

  const playSong = ({ uri, currentUri, isPlaying, setCurrentSongUri }: PlaySongParams) => {
    if (currentUri === uri && isPlaying) {
      player.pause();
      return;
    }

    if (currentUri === uri && !isPlaying) {
      player.play();
      return;
    }

    player.replace({ uri });
    setCurrentSongUri(uri);
    player.play();
  };

  return { playSong, player, status };
}
