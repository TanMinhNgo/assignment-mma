import { formatCurrency } from '@/constants/format';
import * as favoriteService from '@/lib/favoriteService';
import { useFavorites } from '@/providers/FavoritesContext';
import { FavoriteItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshFavorites } = useFavorites();

  const loadFavorites = async () => {
    setLoading(true);
    const favs = await favoriteService.getFavorites();
    setFavorites(favs);
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadFavorites();
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const handleRemove = async (handbagId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );
            await favoriteService.removeFromFavorites(handbagId);
            await refreshFavorites();
            loadFavorites();
          },
        },
      ],
    );
  };

  const handleClearAll = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );
            await favoriteService.clearFavorites();
            await refreshFavorites();
            loadFavorites();
          },
        },
      ],
    );
  };

  const renderItem = ({ item }: { item: FavoriteItem }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/detail/[id]', params: { id: item.id } })
      }
      className="bg-white rounded-xl mb-3 mx-4 p-3 flex-row shadow-sm"
    >
      <Image
        source={{ uri: item.uri }}
        className="w-24 h-24 rounded-lg"
        resizeMode="cover"
      />

      <View className="flex-1 ml-3 justify-between">
        <View>
          <Text className="text-xs text-gray-500 mb-1">{item.brand}</Text>
          <Text
            className="text-sm font-semibold text-gray-800"
            numberOfLines={2}
          >
            {item.handbagName}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-base font-bold text-red-500">
            {formatCurrency(item.cost)}
          </Text>

          <Pressable onPress={() => handleRemove(item.id)} className="p-2">
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-16 pb-4 px-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              My Favorites
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {favorites.length} items saved
            </Text>
          </View>

          {favorites.length > 0 && (
            <Pressable onPress={handleClearAll} className="px-3 py-2">
              <Text className="text-red-500 font-semibold">Clear All</Text>
            </Pressable>
          )}
        </View>
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-gray-100 rounded-full p-6 mb-4">
            <Ionicons name="heart-outline" size={64} color="#CCC" />
          </View>
          <Text className="text-xl font-semibold text-gray-800 mb-2">
            No Favorites Yet
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            Start adding handbags to your favorites to see them here
          </Text>
          <Pressable
            onPress={() => router.push('/' as any)}
            className="bg-red-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Start Shopping</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B6B']}
              tintColor="#FF6B6B"
            />
          }
        />
      )}
    </View>
  );
}
