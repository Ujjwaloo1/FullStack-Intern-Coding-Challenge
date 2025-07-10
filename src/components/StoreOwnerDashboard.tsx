import React, { useState, useEffect } from 'react';
import { Star, Users, TrendingUp, Lock } from 'lucide-react';
import { Store, Rating, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from './StarRating';
import { validatePassword } from '../utils/validation';

export const StoreOwnerDashboard: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStores(JSON.parse(localStorage.getItem('stores') || '[]'));
    setRatings(JSON.parse(localStorage.getItem('ratings') || '[]'));
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  };

  const ownedStores = stores.filter(store => store.ownerId === user?.id);
  const ownedStoreIds = ownedStores.map(store => store.id);
  const storeRatings = ratings.filter(rating => ownedStoreIds.includes(rating.storeId));
  
  const averageRating = storeRatings.length > 0 
    ? storeRatings.reduce((sum, rating) => sum + rating.rating, 0) / storeRatings.length
    : 0;

  const getUsersWhoRated = (storeId: string) => {
    const storeRatingsList = ratings.filter(rating => rating.storeId === storeId);
    return storeRatingsList.map(rating => {
      const user = users.find(u => u.id === rating.userId);
      return {
        ...rating,
        userName: user?.name || 'Unknown User',
        userEmail: user?.email || 'Unknown Email',
      };
    });
  };

  const PasswordUpdateModal = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        setError(passwordError);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const success = await updatePassword(newPassword);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          setShowPasswordModal(false);
          setSuccess(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 2000);
      } else {
        setError('Failed to update password');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Update Password</h3>
          {success ? (
            <div className="text-green-600 text-center">
              Password updated successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Owner Dashboard</h1>
          <p className="text-gray-600">Manage your stores and view ratings</p>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          <Lock className="h-4 w-4 mr-2" />
          Update Password
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{storeRatings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stores Owned</p>
              <p className="text-2xl font-bold text-gray-900">{ownedStores.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores List */}
      <div className="space-y-6">
        {ownedStores.map((store) => {
          const usersWhoRated = getUsersWhoRated(store.id);
          
          return (
            <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.name}</h3>
                    <p className="text-gray-600 mb-2">{store.address}</p>
                    <div className="flex items-center">
                      <StarRating rating={store.averageRating} />
                      <span className="ml-2 text-sm text-gray-500">
                        ({store.totalRatings} ratings)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Reviews</h4>
                  {usersWhoRated.length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {usersWhoRated.map((review) => (
                        <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{review.userName}</p>
                            <p className="text-sm text-gray-500">{review.userEmail}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No ratings yet for this store</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ownedStores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            You don't own any stores yet. Contact an administrator to get stores assigned to your account.
          </div>
        </div>
      )}

      {showPasswordModal && <PasswordUpdateModal />}
    </div>
  );
};