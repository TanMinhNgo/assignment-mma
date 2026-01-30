import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const BRANDS = [
  'All',
  'Bvlgari',
  'Michael Kors',
  'Burberry',
  'Ferragamo',
  'Fendi',
];

interface BrandFilterProps {
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
}

export default function BrandFilter({
  selectedBrand,
  onSelectBrand,
}: BrandFilterProps) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {BRANDS.map((brand) => {
          const isSelected = selectedBrand === brand;
          return (
            <Pressable
              key={brand}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectBrand(brand);
              }}
              className={`px-5 py-2.5 rounded-full ${
                isSelected ? 'bg-red-500' : 'bg-white border border-gray-200'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                className={`font-semibold ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {brand}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
