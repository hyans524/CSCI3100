// MyTrip.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Temple from "../assets/Temple_background.png";
import Fuji from "../assets/Fuji_background.jpg";
import GreatWall from "../assets/great_wall.jpg";

const MyTrip = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "completed", "upcoming"
  const navigate = useNavigate();

  useEffect(() => {
    // For demo, using mock data
    const mockTrips = [
      {
        id: 1,
        title: "Beach Vacation in Bali",
        location: "Bali, Indonesia",
        startDate: "2025-06-15",
        endDate: "2025-06-25",
        status: "upcoming",
        image: Temple,
        participants: 4,
        activities: ["Surfing", "Snorkeling", "Temple Visit"]
      },
      {
        id: 2,
        title: "Mountain Trek in the Alps",
        location: "Swiss Alps, Switzerland",
        startDate: "2025-01-10",
        endDate: "2025-01-20",
        status: "completed",
        image: Fuji,
        participants: 6,
        activities: ["Hiking", "Skiing", "Photography"]
      },
      {
        id: 3,
        title: "Cultural Tour in Japan",
        location: "Tokyo & Kyoto, Japan",
        startDate: "2025-09-05",
        endDate: "2025-09-15",
        status: "upcoming",
        image: GreatWall,
        participants: 2,
        activities: ["Temple Visit", "Food Tour", "Shopping"]
      }
    ];
    
    // Set trips immediately without setTimeout
    setTrips(mockTrips);
    
  }, []);

  const filteredTrips = trips.filter(trip => {
    if (filter === "all") return true;
    return trip.status === filter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTripClick = (tripId) => {
    navigate(`/mytrip/${tripId}`);
  };

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
          {filteredTrips.map(trip => (
            <div 
              key={trip.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTripClick(trip.id)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-64 overflow-hidden">
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-blue-700 mb-2">{trip.title}</h2>
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
                    <span>{trip.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">DATE</div>
                      <div className="font-medium">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </div>
                      <div className="text-sm text-blue-600">
                        {calculateDuration(trip.startDate, trip.endDate)} days
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">PARTICIPANTS</div>
                      <div className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {trip.participants} people
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {trip.activities.slice(0, 3).map((activity, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {activity}
                      </span>
                    ))}
                    {trip.activities.length > 3 && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        +{trip.activities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrip;