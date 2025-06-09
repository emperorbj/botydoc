



import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';

export default function RootLayout() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
      }}>
        <Image source={require('../assets/images/ai.png')} style={{ width: 100, height: 100 }} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}