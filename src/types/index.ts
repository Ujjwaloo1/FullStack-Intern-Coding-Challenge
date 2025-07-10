export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  password: string;
  role: 'admin' | 'user' | 'store_owner';
  createdAt: Date;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface Rating {
  id: string;
  storeId: string;
  userId: string;
  rating: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}