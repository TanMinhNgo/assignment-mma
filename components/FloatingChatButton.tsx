import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

export default function FloatingChatButton() {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/chatbot');
  };

  return (
    <View className="absolute bottom-20 right-6 z-50">
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
