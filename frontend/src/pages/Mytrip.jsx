import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { tripApi, authApi } from "../utils/api";
import travelAnimation from "../assets/travel_animation.jpg";
import { formatDate, formatCurrency } from "../utils/formatters";
import constantCheckLoggedIn from "../../components/CheckLoggedIn/CheckLoggedIn";

const MyTrip = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "completed", "upcoming"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  constantCheckLoggedIn()


  // Get current user ID
  const currentUserId = authApi.getCurrentUserId();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        
        const response = await tripApi.getAll();
        const beforeFilterTripsData = response.data;

        const tripsData = Array.isArray(beforeFilterTripsData)
          ? beforeFilterTripsData.filter(trip => {
              return trip.member.includes(currentUserId);
            })
          : [];
        
        const processedTrips = tripsData.map(trip => {
          const today = new Date();
          const endDate = new Date(trip.end_date);
          const status = endDate < today ? "completed" : "upcoming";
          
          const groupName = trip.groupName || "Unnamed Group";
          const memberCount = trip.memberCount || 0;

          // add image handling
          let image;
          if (trip.image && trip.image.startsWith('/uploads/')) {
            image = `http://localhost:5000${trip.image}`;
          } else if (trip.image && trip.image.startsWith('http')) {
            image = trip.image;
          } else {
            image = travelAnimation; // default image
          }
          

          const tripId = trip._id || trip.id || trip.tripId;
          // console.log(`Processed trip: ${trip.destination}, using ID: ${tripId}`);
          
          return {
            ...trip,
            _id: tripId,
            image,
            status,
            groupName,
            memberCount
          };
        });

        const sortedTrips = processedTrips.sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === "upcoming" ? -1 : 1;
          }
          return new Date(a.start_date) - new Date(b.start_date);
        });
        setTrips(sortedTrips);
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError("Failed to load trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = trips.filter(trip => {
    if (filter === "all") return true;
    return trip.status === filter;
  });

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Unknown';
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'Unknown';
      }
      
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (err) {
      return 'Unknown';
    }
  };

  const handleTripClick = (tripId) => {
    console.log("Trip click handler called with ID:", tripId);
    
    if (!tripId) {
      console.error("ERROR: Attempted to navigate to trip detail with undefined ID");
      alert("Sorry, can't view this trip. Missing trip ID.");
      return;
    }
    
    console.log("Navigating to trip with ID:", tripId);
    navigate(`/mytrip/${tripId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mt-4">Loading trips...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">My Trips</h1>
      
      {/* Filter Toggle */}
      <div className="bg-white rounded-full shadow-md p-1 flex justify-between mb-8 max-w-md mx-auto">
        <button 
          className={`py-2 px-6 rounded-full font-medium transition-all ${
            filter === "all" 
              ? "bg-blue-500 text-white shadow-md" 
              : "text-gray-600 hover:bg-blue-50"
          }`}
          onClick={() => setFilter("all")}
        >
          All Trips
        </button>
        <button 
          className={`py-2 px-6 rounded-full font-medium transition-all ${
            filter === "upcoming" 
              ? "bg-blue-500 text-white shadow-md" 
              : "text-gray-600 hover:bg-blue-50"
          }`}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </button>
        <button 
          className={`py-2 px-6 rounded-full font-medium transition-all ${
            filter === "completed" 
              ? "bg-blue-500 text-white shadow-md" 
              : "text-gray-600 hover:bg-blue-50"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Trip List */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h3 className="text-xl font-medium text-blue-700 mb-2">No trips found</h3>
          <p className="text-blue-600">You don't have any {filter !== "all" ? filter : ""} trips yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTrips.map(trip => {
            return (
              <div 
                key={trip._id || `trip-${Math.random()}`} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  console.log("Clicked on trip card:", trip);
                  handleTripClick(trip._id);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="h-64 md:h-72 overflow-hidden">
                    <img 
                      src={trip.image} 
                      alt={trip.destination} 
                      className="w-full h-full object-cover object-center"
                      style={{ 
                        objectPosition: "center 30%" 
                      }}
                    />
                  </div>
                  <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-blue-700 mb-2">
                        {trip.groupName || 'Unnamed Group'}
                      </h2>
                      <span 
                        className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
                          trip.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{trip.destination || "Unknown destination"}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">DATE</div>
                        <div className="font-medium">
                          {trip.start_date && !isNaN(new Date(trip.start_date).getTime()) 
                            ? formatDate(trip.start_date) 
                            : 'Unknown'} - 
                          {trip.end_date && !isNaN(new Date(trip.end_date).getTime()) 
                            ? formatDate(trip.end_date) 
                            : 'Unknown'}
                        </div>
                        <div className="text-sm text-blue-600">
                          {typeof calculateDuration(trip.start_date, trip.end_date) === 'number' 
                            ? `${calculateDuration(trip.start_date, trip.end_date)} days` 
                            : calculateDuration(trip.start_date, trip.end_date)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">GROUP MEMBERS</div>
                        <div className="font-medium flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {trip.memberCount || 0} people
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">BUDGET</div>
                        <div className="font-medium">
                          {!isNaN(trip.budget) ? formatCurrency(trip.budget) : 'Budget not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      {trip.activities && trip.activities.map((activity, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTrip;