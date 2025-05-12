import React, { useState, useEffect } from 'react';
import {
  FaPlane,
  FaHotel,
  FaMapMarkedAlt,
  FaCamera,
  FaHeart,
  FaStar,
  FaGlobeAmericas,
  FaUserFriends,
  FaTimes,
  FaPlus
} from 'react-icons/fa';
import { MdLocalDining, MdOutlineHiking } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { userApi, authApi } from '../../src/utils/api';
import user_icon2 from '../../src/assets/user_icon2.jpg';

const TravelProfile = ({ userId: propUserId}) => {
  // State management
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null)
  const [activeTab, setActiveTab] = useState('trips');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = authApi.getCurrentUserId();

  // Editing state
  const [editFields, setEditFields] = useState({
    name: false,
    email: false,
    language: false,
    age: false,
    gender: false,
    badges: false,
  });
  const navigate = useNavigate()
  
  const handleClick = () => {
      navigate('/mytrip')
    }
  const [editValues, setEditValues] = useState({
    name: '',
    email: '',
    language: '',
    age: '',
    gender: '',
    badges: [],
    addBadge: '',
  });

  // Mock data fetch with error handling
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(true);

        let id = propUserId;
        if (!id) {
          id = authApi.getCurrentUserId();
        }
        setUserId(id);

        const response = await userApi.getById(id);
        const mockUser = {
          name: response.data.username,
          email: response.data.email, // 新增email字段
          language: response.data.language,       // 新增language字段
          age: response.data.age,
          gender: response.data.gender,
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          coverPhoto: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',

        };

        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-500 text-xl font-medium mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle editing state
  const startEdit = (field) => {
    setEditFields({ ...editFields, [field]: true });
  };

  const cancelEdit = (field) => {
    setEditFields({ ...editFields, [field]: false });
    setEditValues((vals) => ({
      ...vals
    }));
  };

  const saveEdit = async(field) => {
    if (field === 'name') {
      try {
        setIsLoading(true);
        const newName = editValues.name.trim();
        // update name in backend
        await userApi.update(userId, { username: newName });
        // fetch updated user info
        const updated = await userApi.getById(userId);
        setUser(updated.data);
        setEditFields({ ...editFields, name: false });
        setIsLoading(false);
        window.location.reload();
      } catch (err) {
        setError('Failed to update name.');
        setIsLoading(false);
        console.error('Error updating name:', err);
      }
    }
    // 新增email和language的保存逻辑
    else if (field === 'email') {
      try {
        setIsLoading(true);
        const newEmail = editValues.email.trim();
        await userApi.update(userId, { email: newEmail });
        const updated = await userApi.getById(userId);
        setUser({ ...user, email: updated.data.email });
        setEditFields({ ...editFields, email: false });
        setIsLoading(false);
        window.location.reload();
      } catch (err) {
        setError('Failed to update email.');
        setIsLoading(false);
        console.error('Error updating email:', err);
      }
    }
    else if (field === 'language') {
      try {
        setIsLoading(true);
        const newLanguage = editValues.language.trim();
        await userApi.update(userId, { language: newLanguage });
        const updated = await userApi.getById(userId);
        setUser({ ...user, language: updated.data.language });
        setEditFields({ ...editFields, language: false });
        setIsLoading(false);
        window.location.reload();
      } catch (err) {
        setError('Failed to update language.');
        setIsLoading(false);
        console.error('Error updating language:', err);
      }
    }
    else if (field === 'age') {
      try {
        setIsLoading(true);
        const newAge = editValues.age.trim();
        await userApi.update(userId, { age: newAge });
        const updated = await userApi.getById(userId);
        setUser({ ...user, age: updated.data.age });
        setEditFields({ ...editFields, age: false });
        setIsLoading(false);
        window.location.reload();
      } catch (err) {
        setError('Failed to update language.');
        setIsLoading(false);
        console.error('Error updating language:', err);
      }
    }
      else if (field === 'gender') {
      try {
        setIsLoading(true);
        const newGender = editValues.gender.trim();
        await userApi.update(userId, { gender: newGender });
        const updated = await userApi.getById(userId);
        setUser({ ...user, gender: updated.data.gender });
        setEditFields({ ...editFields, gender: false });
        setIsLoading(false);
        window.location.reload();
      } catch (err) {
        setError('Failed to update language.');
        setIsLoading(false);
        console.error('Error updating language:', err);
      }
    }
    else {
      setUser((old) => ({ ...old, [field]: editValues[field].trim() || old[field] }));
      setEditFields({ ...editFields, [field]: false });
    }
  };

  // Handle badges (labels)
  // Main component
  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div
        className="h-72 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${user.coverPhoto})` }}
      >
        
      </div>

      {/* Profile Info */}
      <div className="px-6 sm:px-8 py-6 relative">
        <div className="flex flex-col sm:flex-row items-start">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full shadow-lg -mt-20 bg-white z-10 overflow-hidden">
            <img
              src={user_icon2}
              alt="Profile"
              className="w-full h-full object-contain rounded-full scale-85"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 mt-4 sm:mt-0 sm:pl-8">
            {/* Name */}
            <div className="flex items-center mb-1">
              {editFields.name ? (
                <>
                  <input
                    type="text"
                    value={editValues.name}
                    maxLength={32}
                    onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                    className="text-2xl sm:text-3xl font-bold text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ maxWidth: '220px' }}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    onClick={() => saveEdit('name')}
                  >
                    Save
                  </button>
                  <button
                    className="ml-1 px-2 py-1 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400 transition-colors"
                    onClick={() => cancelEdit('name')}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">{user.name}</h1>
                  {currentUserId === userId && (
                    <button
                      className="ml-3 px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                      onClick={() => startEdit('name')}
                      title="Edit username"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
            {/* Email */}
            <div className="flex items-center gap-2 mb-3">
              <p>Email :</p>
              <FaGlobeAmericas className="text-blue-500" /> {/* 换一个图标更适合email，可根据需求调整 */}
              {editFields.email ? (
                <>
                  <input
                    type="email"
                    value={editValues.email}
                    maxLength={40}
                    onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                    className="text-gray-500 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ maxWidth: '240px' }}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    onClick={() => saveEdit('email')}
                  >
                    Save
                  </button>
                  <button
                    className="ml-1 px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 transition-colors"
                    onClick={() => cancelEdit('email')}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-500 truncate">{user.email}</span>
                    {currentUserId === userId && (
                      <button
                      className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                      onClick={() => startEdit('email')}
                      title="Edit email"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
            {/* Language */}
            <div className="flex items-center gap-2 mb-3">
              <FaGlobeAmericas className="text-green-500" />
              <p>Language :</p>
              {editFields.language ? (
                <>
                  <input
                    type="text"
                    value={editValues.language}
                    maxLength={24}
                    onChange={e => setEditValues({ ...editValues, language: e.target.value })}
                    className="text-gray-500 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ maxWidth: '160px' }}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    onClick={() => saveEdit('language')}
                  >
                    Save
                  </button>
                  <button
                    className="ml-1 px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 transition-colors"
                    onClick={() => cancelEdit('language')}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-500 truncate">{user.language}</span>
                  {currentUserId === userId && (
                    <button
                      className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                      onClick={() => startEdit('language')}
                      title="Edit language"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
             <div className="flex items-center mb-1">
              <p>Gender :</p>
              {editFields.gender ? (
                <>
                  <input
                    type="text"
                    value={editValues.gender}
                    maxLength={24}
                    onChange={e => setEditValues({ ...editValues, gender: e.target.value })}
                    className="text-gray-500 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ maxWidth: '160px' }}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    onClick={() => saveEdit('gender')}
                  >
                    Save
                  </button>
                  <button
                    className="ml-1 px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 transition-colors"
                    onClick={() => cancelEdit('gender')}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-500 truncate">{user.gender}</span>
                  {currentUserId === userId && (
                    <button
                      className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                      onClick={() => startEdit('gender')}
                      title="Edit gender"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
             <div className="flex items-center mb-1">
              <p>age :</p>
              {editFields.age ? (
                <>
                  <input
                    type="text"
                    value={editValues.age}
                    maxLength={24}
                    onChange={e => setEditValues({ ...editValues, age: e.target.value })}
                    className="text-gray-500 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ maxWidth: '160px' }}
                  />
                  <button
                    className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    onClick={() => saveEdit('age')}
                  >
                    Save
                  </button>
                  <button
                    className="ml-1 px-2 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400 transition-colors"
                    onClick={() => cancelEdit('age')}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-500 truncate">{user.age}</span>
                  {currentUserId === userId && (
                    <button
                      className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                      onClick={() => startEdit('age')}
                      title="Edit age"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
            {/* Badges/Labels */}
          </div>
        </div>





      </div>



    </div>
  );
};

export default TravelProfile;