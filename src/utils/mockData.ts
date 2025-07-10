import { User, Store, Rating } from '../types';

export const initializeMockData = () => {
  // Initialize users if not exist
  const existingUsers = localStorage.getItem('users');
  if (!existingUsers) {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'System Administrator Account',
        email: 'admin@example.com',
        address: '123 Admin Street, Admin City, AC 12345',
        password: 'Admin123!',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        name: 'John Doe Regular User Account',
        email: 'john@example.com',
        address: '456 User Avenue, User City, UC 67890',
        password: 'User123!',
        role: 'user',
        createdAt: new Date('2024-01-02'),
      },
      {
        id: '3',
        name: 'Jane Smith Store Owner Account',
        email: 'jane@example.com',
        address: '789 Store Boulevard, Store City, SC 11111',
        password: 'Store123!',
        role: 'store_owner',
        createdAt: new Date('2024-01-03'),
      },
    ];
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }

  // Initialize stores if not exist
  const existingStores = localStorage.getItem('stores');
  if (!existingStores) {
    const mockStores: Store[] = [
      {
        id: '1',
        name: 'Tech Solutions Store Downtown',
        email: 'contact@techsolutions.com',
        address: '100 Tech Park, Downtown, DT 22222',
        ownerId: '3',
        averageRating: 4.5,
        totalRatings: 120,
        createdAt: new Date('2024-01-04'),
      },
      {
        id: '2',
        name: 'Fashion Forward Boutique Center',
        email: 'info@fashionforward.com',
        address: '200 Fashion Plaza, Center City, CC 33333',
        ownerId: '3',
        averageRating: 3.8,
        totalRatings: 89,
        createdAt: new Date('2024-01-05'),
      },
      {
        id: '3',
        name: 'Gourmet Food Market Express',
        email: 'hello@gourmetmarket.com',
        address: '300 Food Street, Market District, MD 44444',
        ownerId: '3',
        averageRating: 4.2,
        totalRatings: 203,
        createdAt: new Date('2024-01-06'),
      },
    ];
    localStorage.setItem('stores', JSON.stringify(mockStores));
  }

  // Initialize ratings if not exist
  const existingRatings = localStorage.getItem('ratings');
  if (!existingRatings) {
    const mockRatings: Rating[] = [
      {
        id: '1',
        storeId: '1',
        userId: '2',
        rating: 5,
        createdAt: new Date('2024-01-07'),
      },
      {
        id: '2',
        storeId: '2',
        userId: '2',
        rating: 4,
        createdAt: new Date('2024-01-08'),
      },
    ];
    localStorage.setItem('ratings', JSON.stringify(mockRatings));
  }
};