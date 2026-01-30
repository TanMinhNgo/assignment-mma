import { useFavorites } from '@/providers/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { favoritesCount } = useFavorites();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', color: '#FF6B6B' },
    {
      icon: 'heart-outline',
      label: `My Favorites (${favoritesCount})`,
      color: '#FF6B6B',
    },
    { icon: 'notifications-outline', label: 'Notifications', color: '#4ECDC4' },
    { icon: 'settings-outline', label: 'Settings', color: '#95A5A6' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#3498DB' },
    { icon: 'information-circle-outline', label: 'About', color: '#9B59B6' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white pt-16 pb-6 px-6 items-center border-b border-gray-100">
        <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-3">
          <Ionicons name="person" size={48} color="#FF6B6B" />
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          Ngô Minh Tân
        </Text>
        <Text className="text-gray-500">tannmse182434@fpt.edu.vn</Text>
      </View>

      <View className="bg-white mx-4 mt-4 rounded-xl p-4 flex-row justify-around shadow-sm">
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800">
            {favoritesCount}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">Favorites</Text>
        </View>
        <View className="w-px bg-gray-200" />
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800">0</Text>
          <Text className="text-xs text-gray-500 mt-1">Orders</Text>
        </View>
        <View className="w-px bg-gray-200" />
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800">0</Text>
          <Text className="text-xs text-gray-500 mt-1">Reviews</Text>
        </View>
      </View>

      <View className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            className={`flex-row items-center p-4 ${
              index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text className="flex-1 text-base text-gray-800">{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </Pressable>
        ))}
      </View>

      <Pressable className="bg-white mx-4 mt-4 mb-8 rounded-xl p-4 flex-row items-center justify-center shadow-sm">
        <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
        <Text className="ml-2 text-base font-semibold text-red-500">
          Logout
        </Text>
      </Pressable>
    </ScrollView>
  );
}
