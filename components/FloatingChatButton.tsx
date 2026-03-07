import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FloatingChatButton() {
  const insets = useSafeAreaInsets();
  
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/chatbot');
  };

  // Calculate bottom position: tab bar height (60) + insets.bottom + spacing (8)
  const bottomPosition = 60 + (insets.bottom > 0 ? insets.bottom : 8) - 80;

  return (
    <View 
      className="absolute right-6 z-50"
      style={{ bottom: bottomPosition }}
    >
      <Pressable
        onPress={handlePress}
        className="bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg active:scale-95"
        style={{
          shadowColor: '#007AFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </Pressable>
    </View>
  );
}
