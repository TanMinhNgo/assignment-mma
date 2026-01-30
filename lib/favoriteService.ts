import AsyncStorage from "@react-native-async-storage/async-storage";

import { FavoriteItem, Handbag } from "@/types";

const FAVORITES_KEY = "@handbag_favorites";

export const getFavorites = async (): Promise<FavoriteItem[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const addToFavorites = async (handbag: Handbag): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((fav) => fav.id === handbag.id);
    if (exists) return false;

    const favoriteItem: FavoriteItem = {
      ...handbag,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, favoriteItem];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw new Error("Failed to add to favorites");
  }
};

export const removeFromFavorites = async (
  handbagId: string,
): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.id !== handbagId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw new Error("Failed to remove from favorites");
  }
};

export const clearFavorites = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing favorites:", error);
    return false;
  }
};

export const isFavorite = async (handbagId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((fav) => fav.id === handbagId);
  } catch (error) {
    return false;
  }
};

export const getFavoritesCount = async (): Promise<number> => {
  try {
    const favorites = await getFavorites();
    return favorites.length;
  } catch (error) {
    return 0;
  }
};

export const toggleFavorite = async (handbag: Handbag): Promise<boolean> => {
  const isCurrentlyFavorite = await isFavorite(handbag.id);
  if (isCurrentlyFavorite) {
    await removeFromFavorites(handbag.id);
    return false;
  } else {
    await addToFavorites(handbag);
    return true;
  }
};
