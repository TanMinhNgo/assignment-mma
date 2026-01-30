import { MOCK_REVIEWS } from '@/constants/data';
import React, { JSX, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface ReviewSectionProps {
  feedbackSectionY: React.MutableRefObject<number>;
  renderStars: (rating: number, size: number) => JSX.Element;
  calculateAverageRating: () => string;
}

const ReviewSection = ({
  feedbackSectionY,
  renderStars,
  calculateAverageRating,
}: ReviewSectionProps) => {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<
    number | 'all'
  >('all');

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    MOCK_REVIEWS.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const getFilteredReviews = () => {
    if (selectedRatingFilter === 'all') return MOCK_REVIEWS;
    return MOCK_REVIEWS.filter(
      (review) => review.rating === selectedRatingFilter,
    );
  };

  return (
    <View
      onLayout={(event) => {
        feedbackSectionY.current = event.nativeEvent.layout.y;
      }}
    >
      <Text className="text-2xl font-bold mb-6">Ratings & Reviews</Text>

      {/* Rating Overview */}
      <View className="bg-gray-50 rounded-2xl p-6 mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="items-center">
            <Text className="text-5xl font-bold text-gray-800 mb-2">
              {calculateAverageRating()}
            </Text>
            {renderStars(Math.round(Number(calculateAverageRating())), 24)}
            <Text className="text-sm text-gray-600 mt-2">
              {MOCK_REVIEWS.length} reviews
            </Text>
          </View>

          <View className="flex-1 ml-6">
            {[5, 4, 3, 2, 1].map((rating) => {
              const distribution = getRatingDistribution();
              const count = distribution[rating as keyof typeof distribution];
              const percentage = (count / MOCK_REVIEWS.length) * 100;

              return (
                <View key={rating} className="flex-row items-center mb-2">
                  <Text className="text-sm text-gray-600 w-8">{rating}★</Text>
                  <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                    <View
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="text-sm text-gray-600 w-8 text-right">
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-base font-semibold mb-3">Filter by rating:</Text>
        <View className="flex-row flex-wrap gap-2">
          <Pressable
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedRatingFilter('all');
            }}
            className={`px-4 py-2 rounded-full ${
              selectedRatingFilter === 'all' ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedRatingFilter === 'all' ? 'text-white' : 'text-gray-700'
              }`}
            >
              All
            </Text>
          </Pressable>

          {[5, 4, 3, 2, 1].map((rating) => (
            <Pressable
              key={rating}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedRatingFilter(rating);
              }}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                selectedRatingFilter === rating ? 'bg-red-500' : 'bg-gray-200'
              }`}
            >
              <Ionicons
                name="star"
                size={14}
                color={selectedRatingFilter === rating ? '#FFF' : '#FFC107'}
              />
              <Text
                className={`font-semibold ml-1 ${
                  selectedRatingFilter === rating
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {rating}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-base font-semibold mb-4">
          {selectedRatingFilter === 'all'
            ? `All Reviews (${MOCK_REVIEWS.length})`
            : `${selectedRatingFilter} Star Reviews (${getFilteredReviews().length})`}
        </Text>

        {getFilteredReviews().length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="chatbubbles-outline" size={48} color="#CCC" />
            <Text className="text-gray-500 mt-2">No reviews found</Text>
          </View>
        ) : (
          getFilteredReviews().map((review) => (
            <View
              key={review.id}
              className="mb-6 pb-4 border-b border-gray-100"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mr-3">
                    <Text className="text-red-500 font-bold text-lg">
                      {review.userName.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {review.userName}
                    </Text>
                    <Text className="text-xs text-gray-500">{review.date}</Text>
                  </View>
                </View>
                {renderStars(review.rating, 16)}
              </View>

              <Text className="text-gray-700 mb-3 leading-5">
                {review.comment}
              </Text>

              <Pressable
                className="flex-row items-center"
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <Ionicons name="thumbs-up-outline" size={16} color="#666" />
                <Text className="ml-1.5 text-sm text-gray-600">
                  Helpful ({review.helpful})
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default ReviewSection;
