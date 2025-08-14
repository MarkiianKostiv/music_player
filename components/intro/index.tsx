import { Text, Pressable } from 'react-native';
import { IntroComponent } from './info';

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const handlePress = () => {
    onComplete();
  };

  return (
    <Pressable
      className="flex-1 items-center justify-center bg-background-main-color"
      onPress={handlePress}>
      <IntroComponent />
      <Text className="mt-6 text-base font-semibold text-main-color">Tap anywhere to continue</Text>
    </Pressable>
  );
}
