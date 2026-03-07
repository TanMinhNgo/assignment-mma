import BrandFilter from '@/components/BrandFilter';
import FloatingChatButton from '@/components/FloatingChatButton';
import HandbagCard from '@/components/HandbagCard';
import axios from '@/lib/axios';
import { Handbag } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function HomeScreen() {
  const [handbags, setHandbags] = useState<Handbag[]>([]);
  const [filteredHandbags, setFilteredHandbags] = useState<Handbag[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHandbags = async () => {
    try {
      setError(null);
      const response = await axios.get<Handbag[]>('/');
      const sortedHandbags = response.data.sort((a: Handbag, b: Handbag) => b.cost - a.cost);
      setHandbags(sortedHandbags);
      setFilteredHandbags(sortedHandbags);
    } catch (err) {
      setError('Failed to load handbags. Please try again.');
      console.error('Error fetching handbags:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHandbags();
  }, []);

  useEffect(() => {
    let filtered = handbags;

    if (selectedBrand !== 'All') {
      filtered = filtered.filter((bag) => bag.brand === selectedBrand);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bag) =>
          bag.handbagName.toLowerCase().includes(query) ||
          bag.brand.toLowerCase().includes(query) ||
          bag.category.toLowerCase().includes(query),
      );
    }

    setFilteredHandbags(filtered);
  }, [selectedBrand, searchQuery, handbags]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHandbags();
  };

  const handleClearSearch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text className="mt-4 text-gray-600">Loading handbags...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="mt-4 text-lg font-semibold text-gray-800">
          {error}
        </Text>
        <Text className="mt-2 text-gray-600 text-center">
          Pull down to refresh
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-gray-50">
        <View className="bg-white pt-16 pb-4 px-4 border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-800">Handbags</Text>
          <Text className="text-sm text-gray-500 mt-1">
            {filteredHandbags.length} items available
          </Text>

          <View className="mt-4 flex-row items-center bg-gray-100 rounded-full px-4 py-2.5">
            <Ionicons
              name="search-outline"
              size={20}
              color="#999"
            />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-800"
              placeholder="Search handbags, brands, categories..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={dismissKeyboard}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#999"
                />
              </Pressable>
            )}
          </View>
        </View>

        <View className="pt-4 pb-2 bg-gray-50">
          <BrandFilter
            selectedBrand={selectedBrand}
            onSelectBrand={setSelectedBrand}
          />
        </View>

        <FlatList
          data={filteredHandbags}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <HandbagCard handbag={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6B6B']}
              tintColor="#FF6B6B"
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="bag-outline" size={64} color="#CCC" />
              <Text className="mt-4 text-gray-500">
                {searchQuery ? 'No results found' : 'No handbags found'}
              </Text>
              {searchQuery && (
                <Text className="mt-2 text-gray-400 text-sm">
                  Try a different search term
                </Text>
              )}
            </View>
          }
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={dismissKeyboard}
        />
        <FloatingChatButton />
      </View>
    </TouchableWithoutFeedback>
  );
}
