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
    <View>
      <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 mb-3">
        Filter by Brand
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ paddingRight: 16 }}
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
              android_ripple={{ color: 'transparent' }}
              style={({ pressed }) => [
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.15 : 0.08,
                  shadowRadius: isSelected ? 4 : 2,
                  elevation: isSelected ? 3 : 1,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              className={`px-6 py-3 rounded-full mr-2 ${
                isSelected ? 'bg-red-500' : 'bg-white border border-gray-200'
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
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
