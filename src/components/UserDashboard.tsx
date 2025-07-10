import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Edit2, Lock } from 'lucide-react';
import { Store, Rating } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from './StarRating';
import { validatePassword } from '../utils/validation';

export const UserDashboard: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingRating, setEditingRating] = useState<{ storeId: string; currentRating: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStores(JSON.parse(localStorage.getItem('stores') || '[]'));
    setRatings(JSON.parse(localStorage.getItem('ratings') || '[]'));
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRatingForStore = (storeId: string) => {
    return ratings.find(rating => rating.storeId === storeId && rating.userId === user?.id);
  };

  const handleRatingSubmit = (storeId: string, newRating: number) => {
    if (!user) return;

    const existingRating = getUserRatingForStore(storeId);
    let updatedRatings;

    if (existingRating) {
      // Update existing rating
      updatedRatings = ratings.map(rating =>
        rating.id === existingRating.id ? { ...rating, rating: newRating } : rating
      );
    } else {
      // Create new rating
      const newRatingObj: Rating = {
        id: Date.now().toString(),
        storeId,
        userId: user.id,
        rating: newRating,
        createdAt: new Date(),
      };
      updatedRatings = [...ratings, newRatingObj];
    }

    setRatings(updatedRatings);
    localStorage.setItem('ratings', JSON.stringify(updatedRatings));

    // Update store's average rating
    const storeRatings = updatedRatings.filter(rating => rating.storeId === storeId);
    const averageRating = storeRatings.reduce((sum, rating) => sum + rating.rating, 0) / storeRatings.length;
    
    const updatedStores = stores.map(store =>
      store.id === storeId
        ? { ...store, averageRating, totalRatings: storeRatings.length }
        : store
    );

    setStores(updatedStores);
    localStorage.setItem('stores', JSON.stringify(updatedStores));
    setEditingRating(null);
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Dashboard</h1>
          <p className="text-gray-600">Browse and rate stores</p>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Lock className="h-4 w-4 mr-2" />
          Update Password
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search stores by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => {
          const userRating = getUserRatingForStore(store.id);
          return (
            <div key={store.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{store.address}</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Rating</span>
                    <StarRating rating={store.averageRating} size="sm" />
                  </div>
                  <span className="text-xs text-gray-500">{store.totalRatings} total ratings</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Rating</span>
                    {userRating && (
                      <button
                        onClick={() => setEditingRating({ storeId: store.id, currentRating: userRating.rating })}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {editingRating?.storeId === store.id ? (
                    <div className="flex items-center space-x-2">
                      <StarRating
                        rating={editingRating.currentRating}
                        interactive={true}
                        onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                      />
                      <button
                        onClick={() => setEditingRating(null)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : userRating ? (
                    <div className="flex items-center justify-between">
                      <StarRating rating={userRating.rating} size="sm" />
                      <span className="text-xs text-gray-500">
                        Rated on {new Date(userRating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <StarRating
                      rating={0}
                      interactive={true}
                      onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {searchTerm ? `No stores found matching "${searchTerm}"` : 'No stores available'}
          </div>
        </div>
      )}

      {showPasswordModal && <PasswordUpdateModal />}
    </div>
  );
};