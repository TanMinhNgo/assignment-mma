import { FavoritesProvider } from '@/providers/FavoritesContext';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="detail/[id]"
            options={{
              headerShown: false,
              presentation: 'card',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              animation: 'slide_from_right',
              animationDuration: 300,
              fullScreenGestureEnabled: true,
            }}
          />
        </Stack>
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
