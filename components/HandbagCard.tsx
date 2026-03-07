import { formatCurrency, formatPercentage } from '@/constants/format';
import { useFavorites } from '@/providers/FavoritesContext';
import { Handbag } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';

interface HandbagCardProps {
  handbag: Handbag;
}

export default function HandbagCard({ handbag }: HandbagCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isInFavorites = isFavorite(handbag.id);

  const handleFavoritePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await toggleFavorite(handbag);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const handleCardPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/detail/[id]',
      params: { id: handbag.id },
    });
  };

  return (
    <Pressable
      onPress={handleCardPress}
      className="bg-white rounded-2xl m-2 shadow-sm overflow-hidden flex-1"
      style={{ maxWidth: '47%' }}
    >
      <View className="relative">
        <Image
          source={{ uri: handbag.uri }}
          className="w-full aspect-square"
          resizeMode="cover"
        />

        {handbag.percentOff > 0 && (
          <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-1">
            <Text className="text-white text-xs font-bold">
              -{formatPercentage(handbag.percentOff)}
            </Text>
          </View>
        )}

        <View className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5">
          <Ionicons
            name={handbag.gender ? 'female' : 'male'}
            size={16}
            color={handbag.gender ? '#FF6B9D' : '#4A90E2'}
          />
        </View>

        <Pressable
          onPress={handleFavoritePress}
          className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md"
        >
          <Ionicons
            name={isInFavorites ? 'heart' : 'heart-outline'}
            size={20}
            color={isInFavorites ? '#FF6B6B' : '#666'}
          />
        </Pressable>
      </View>

      <View className="p-3">
        <Text className="text-xs text-gray-500 mb-1">{handbag.brand}</Text>

        <Text
          className="text-sm font-semibold text-gray-800 mb-2"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {handbag.handbagName}
        </Text>

        <View className="flex-col gap-1">
          {handbag.percentOff > 0 ? (
            <>
              <Text className="text-xs text-gray-400 line-through">
                {formatCurrency(handbag.cost / (1 - handbag.percentOff))}
              </Text>
              <Text className="text-base font-bold text-red-500">
                {formatCurrency(handbag.cost)}
              </Text>
            </>
          ) : (
            <Text className="text-base font-bold text-gray-800">
              {formatCurrency(handbag.cost)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
