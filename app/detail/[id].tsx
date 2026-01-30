import ReviewSection from '@/components/ReviewSection';
import { MOCK_REVIEWS } from '@/constants/data';
import { formatCurrency, formatPercentage } from '@/constants/format';
import axios from '@/lib/axios';
import { useFavorites } from '@/providers/FavoritesContext';
import { Handbag } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

export default function DetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [handbag, setHandbag] = useState<Handbag | null>(null);
    const [loading, setLoading] = useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();
    const isInFavorites = handbag ? isFavorite(handbag.id) : false;
    const scrollViewRef = useRef<ScrollView>(null);
    const feedbackSectionY = useRef(0);

    useEffect(() => {
        fetchHandbagDetail();
    }, [id]);

    const fetchHandbagDetail = async () => {
        try {
            const response = await axios.get<Handbag>(`/${id}`);
            setHandbag(response.data);
        } catch (error) {
            console.error('Error fetching handbag detail:', error);
            Alert.alert('Error', 'Failed to load handbag details');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoritePress = async () => {
        if (handbag) {
            try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                await toggleFavorite(handbag);
                await Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
            } catch (error) {
                Alert.alert('Error', 'Failed to update favorites');
            }
        }
    };

    const calculateAverageRating = () => {
        const sum = MOCK_REVIEWS.reduce((acc, review) => acc + review.rating, 0);
        return (sum / MOCK_REVIEWS.length).toFixed(1);
    };

    const scrollToFeedback = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        scrollViewRef.current?.scrollTo({
            y: feedbackSectionY.current,
            animated: true,
        });
    };

    const renderStars = (rating: number, size: number = 16) => {
        return (
            <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={size}
                        color="#FFC107"
                    />
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    if (!handbag) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-gray-600">Handbag not found</Text>
            </View>
        );
    }

    return (
        <ScrollView ref={scrollViewRef} className="flex-1 bg-white">
            <View className="relative">
                <Image
                    source={{ uri: handbag.uri }}
                    className="w-full aspect-square"
                    resizeMode="cover"
                />

                <Pressable
                    onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    className="absolute top-12 left-4 bg-white/90 rounded-full p-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>

                <Pressable
                    onPress={handleFavoritePress}
                    className="absolute top-12 right-4 bg-white/90 rounded-full p-2"
                >
                    <Ionicons
                        name={isInFavorites ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isInFavorites ? '#FF6B6B' : '#000'}
                    />
                </Pressable>

                {handbag.percentOff > 0 && (
                    <View className="absolute bottom-4 left-4 bg-red-500 rounded-full px-3 py-1.5">
                        <Text className="text-white font-bold">
                            -{formatPercentage(handbag.percentOff)}
                        </Text>
                    </View>
                )}
            </View>

            <View className="p-6">
                <View className="flex-row items-center mb-2">
                    <View className="bg-gray-100 px-3 py-1 rounded-full mr-2">
                        <Text className="text-xs font-semibold text-gray-700">
                            {handbag.brand}
                        </Text>
                    </View>
                    <View className="bg-gray-100 px-3 py-1 rounded-full">
                        <Ionicons
                            name={handbag.gender ? 'female' : 'male'}
                            size={14}
                            color={handbag.gender ? '#FF6B9D' : '#4A90E2'}
                        />
                    </View>
                </View>

                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    {handbag.handbagName}
                </Text>

                <View className="flex-row items-center mb-4">
                    {renderStars(Number(calculateAverageRating()), 18)}
                    <Text className="ml-2 text-gray-600">
                        {calculateAverageRating()} ({MOCK_REVIEWS.length} reviews)
                    </Text>
                </View>

                <View className="flex-row items-center mb-6">
                    <Text className="text-3xl font-bold text-red-500 mr-3">
                        {formatCurrency(handbag.cost * (1 - handbag.percentOff))}
                    </Text>
                    {handbag.percentOff > 0 && (
                        <Text className="text-lg text-gray-400 line-through">
                            {formatCurrency(handbag.cost)}
                        </Text>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-3">Details</Text>

                    <View className="flex-row items-center mb-2">
                        <Ionicons name="pricetag-outline" size={20} color="#666" />
                        <Text className="ml-2 text-gray-700">Category: {handbag.category}</Text>
                    </View>

                    <View className="flex-row items-center mb-2">
                        <Ionicons name="color-palette-outline" size={20} color="#666" />
                        <Text className="ml-2 text-gray-700">
                            Color: {Array.isArray(handbag.color) ? handbag.color.join(', ') : handbag.color}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons
                            name={handbag.gender ? 'female' : 'male'}
                            size={20}
                            color={handbag.gender ? '#FF6B9D' : '#4A90E2'}
                        />
                        <Text className="ml-2 text-gray-700">
                            For {handbag.gender ? 'Women' : 'Men'}
                        </Text>
                    </View>
                </View>

                <View className="mb-6">
                    <Pressable
                        onPress={handleFavoritePress}
                        className={`rounded-full py-4 items-center mb-3 ${isInFavorites ? 'bg-gray-200' : 'bg-red-500'
                            }`}
                    >
                        <Text className={`font-bold text-lg ${isInFavorites ? 'text-gray-700' : 'text-white'
                            }`}>
                            {isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={scrollToFeedback}
                        className="rounded-full py-4 items-center border-2 border-red-500"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="chatbubbles-outline" size={20} color="#FF6B6B" />
                            <Text className="font-bold text-lg text-red-500 ml-2">
                                See Reviews ({MOCK_REVIEWS.length})
                            </Text>
                        </View>
                    </Pressable>
                </View>

                <ReviewSection feedbackSectionY={feedbackSectionY} renderStars={renderStars} calculateAverageRating={calculateAverageRating} />
            </View>
        </ScrollView>
    );
}
