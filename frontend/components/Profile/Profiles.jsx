import React, { useState, useEffect } from 'react';
import { 
  FaPlane, 
  FaHotel, 
  FaMapMarkedAlt, 
  FaCamera, 
  FaHeart, 
  FaStar, 
  FaGlobeAmericas, 
  FaUserFriends 
} from 'react-icons/fa';
import { MdLocalDining, MdOutlineHiking } from 'react-icons/md';

const TravelProfile = () => {
  // State management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('trips');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data fetch with error handling
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
          name: 'Alexandra Traveler',
          location: 'New York, USA',
          bio: 'Digital nomad & adventure seeker. 54 countries visited and counting!',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          coverPhoto: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          stats: {
            countries: 54,
            trips: 128,
            followers: 1243,
            following: 562,
          },
          badges: ['Globetrotter', 'Foodie', 'Photographer', 'Adventurer'],
          upcomingTrips: [
            { destination: 'Bali, Indonesia', date: 'June 2023' },
            { destination: 'Patagonia, Chile', date: 'September 2023' },
          ],
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

  // Main component
  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div 
        className="h-72 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${user.coverPhoto})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div className="absolute top-5 right-5">
          <button 
            className={`px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2 ${
              isFollowing ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? (
              <>
                <span>Following</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Follow</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 sm:px-8 py-6 relative">
        <div className="flex flex-col sm:flex-row items-start">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-lg -mt-20 bg-white z-10 overflow-hidden">
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp';
              }}
            />
          </div>
          
          {/* Details */}
          <div className="flex-1 min-w-0 mt-4 sm:mt-0 sm:pl-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 truncate">{user.name}</h1>
            <p className="text-gray-500 flex items-center gap-2 mb-3">
              <FaMapMarkedAlt className="text-blue-500" /> 
              <span className="truncate">{user.location}</span>
            </p>
            <p className="text-gray-700 mb-4 sm:mb-6">{user.bio}</p>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="w-full flex flex-wrap justify-between border-t border-b border-gray-200 py-4 sm:py-6 mt-6">
          {Object.entries(user.stats).map(([key, value]) => (
            <div key={key} className="text-center px-2 sm:px-4 py-2 w-1/2 sm:w-auto">
              <span className="block text-xl sm:text-2xl font-bold text-blue-600">{value}</span>
              <span className="text-xs sm:text-sm text-gray-500 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 sm:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <h2 className="text-2xl sm:text-3xl text-center font-bold text-gray-800 mb-8 sm:mb-10">Travel Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Feature Cards */}
          {[
            { icon: <FaPlane className="text-3xl sm:text-4xl" />, title: "Trip Planner", desc: "Plan your perfect itinerary with our smart trip planner." },
            { icon: <MdLocalDining className="text-3xl sm:text-4xl" />, title: "Local Experiences", desc: "Discover authentic local activities and hidden gems." },
            { icon: <FaGlobeAmericas className="text-3xl sm:text-4xl" />, title: "Travel Map", desc: "Visualize all your travels on an interactive world map." },
            { icon: <FaCamera className="text-3xl sm:text-4xl" />, title: "Photo Gallery", desc: "Showcase your travel memories in a beautiful gallery." },
            { icon: <FaHeart className="text-3xl sm:text-4xl" />, title: "Bucket List", desc: "Create and manage your travel bucket list destinations." },
            { icon: <FaStar className="text-3xl sm:text-4xl" />, title: "Reviews", desc: "Share your honest reviews of hotels and attractions." },
            { icon: <MdOutlineHiking className="text-3xl sm:text-4xl" />, title: "Adventure Finder", desc: "Find thrilling activities based on your preferences." },
            { icon: <FaUserFriends className="text-3xl sm:text-4xl" />, title: "Travel Community", desc: "Connect with fellow travelers and share experiences." },
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="text-orange-500 mb-3 sm:mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 px-6 sm:px-8 hide-scrollbar">
        {['trips', 'photos', 'reviews', 'bucketlist'].map((tab) => (
          <button
            key={tab}
            className={`px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-500 whitespace-nowrap relative transition-colors ${
              activeTab === tab ? 'text-blue-600' : 'hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'trips' && 'My Trips'}
            {tab === 'photos' && 'Photos'}
            {tab === 'reviews' && 'Reviews'}
            {tab === 'bucketlist' && 'Bucket List'}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {activeTab === 'trips' && (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Upcoming Trips</h3>
            <div className="space-y-3 sm:space-y-4">
              {user.upcomingTrips.map((trip, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 sm:p-5 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-blue-600 text-lg sm:text-xl truncate">{trip.destination}</div>
                    <div className="text-gray-500 text-sm sm:text-base">{trip.date}</div>
                  </div>
                  <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'photos' && (
          <div className="text-center py-8 sm:py-10">
            <div className="text-gray-400 mb-4">
              <FaCamera className="mx-auto text-4xl sm:text-5xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-600 mb-2">Your Travel Photos</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Upload and organize your travel memories to share with the community
            </p>
            <button className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors">
              Upload Photos
            </button>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="text-center py-8 sm:py-10">
            <div className="text-gray-400 mb-4">
              <FaStar className="mx-auto text-4xl sm:text-5xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-600 mb-2">Your Travel Reviews</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Share your experiences and help other travelers make better decisions
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Write a Review
            </button>
          </div>
        )}
        
        {activeTab === 'bucketlist' && (
          <div className="text-center py-8 sm:py-10">
            <div className="text-gray-400 mb-4">
              <FaHeart className="mx-auto text-4xl sm:text-5xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-600 mb-2">Your Bucket List</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Keep track of destinations you dream of visiting
            </p>
            <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              Add Destination
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelProfile;