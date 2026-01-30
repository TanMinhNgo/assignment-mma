export interface Handbag {
  id: string;
  handbagName: string;
  cost: number;
  category: string;
  color: string[];
  gender: boolean;
  uri: string;
  brand: string;
  percentOff: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  images?: string[];
}

export interface FavoriteItem extends Handbag {
  addedAt: string;
}
