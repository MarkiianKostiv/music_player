import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_LAUNCHED = 'hasLaunched';

export async function checkFirstLaunch(): Promise<boolean> {
  const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
  if (hasLaunched === null) {
    await AsyncStorage.setItem(HAS_LAUNCHED, 'true');
    return true;
  }
  return false;
}
