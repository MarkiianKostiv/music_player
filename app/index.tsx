import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Routes } from '../navigation/routes';

import '../global.css';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className="">
      <View>
        <Text className="text-main-color">Music Player</Text>
        <Text className="text-red-600">Listen your favorite songs</Text>
        <Text className="text-red-600">
          Try advanced fetuses of searching your favorite music
          <Link href={Routes.CHAT}>Use Our Chat</Link>
        </Text>
      </View>
    </View>
  );
}
