import * as favoriteService from '@/lib/favoriteService';
import { Handbag } from '@/types';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface FavoritesContextType {
  favorites: string[];
  favoritesCount: number;
  isFavorite: (handbagId: string) => boolean;
  toggleFavorite: (handbag: Handbag) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    const favs = await favoriteService.getFavorites();
    setFavorites(favs.map((f) => f.id));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const isFavorite = (handbagId: string) => {
    return favorites.includes(handbagId);
  };

  const toggleFavorite = async (handbag: Handbag) => {
    await favoriteService.toggleFavorite(handbag);
    await loadFavorites();
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
