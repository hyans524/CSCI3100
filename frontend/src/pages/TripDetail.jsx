import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { userApi, groupApi } from "../utils/api";
import Trip from "../../components/Trips/Trip";
import Travel_animation from "../assets/travel_animation.jpg";

const TripDetail = () => {
  const location = useLocation();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinStatus, setJoinStatus] = useState("not-joined"); // "not-joined", "joining", "joined", "error"

  useEffect(() => {
    const fetchTripAndUserDetails = async () => {
        try {
          setLoading(true);
          let tripData;

          if (location.state) {
            tripData = location.state;

          } else {
            try {
              const response = await fetch(`/api/posts/${id}`);
              
              if (!response.ok) {
                throw new Error("Failed to fetch trip details");
              }
              
              tripData = await response.json();
            } catch (fetchError) {
              console.error("Error fetching trip:", fetchError);
            }
          }
          
          setTrip(tripData);

          if (tripData.user_id) {
            setOrganizer({
              _id: tripData.user_id._id || 'unknown',
              name: tripData.user_id.username || "Trip Organizer",
              initials: getInitials(tripData.user_id.username || "Trip Organizer")
            });
            
          } else {
            setOrganizer({
                _id: tripData.user_id || 'unknown',
                name: "Trip Organizer",
                initials: "TO"
            });
          }
          
          setError(null);
        } catch (err) {
          console.error("Error fetching trip details:", err);
          setError("Failed to load trip details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

    fetchTripAndUserDetails();
  }, [id, location.state]);


  const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  // Handle joining a trip
  const handleJoinTrip = async () => {
    if (!trip || !trip._id) {
      alert("Cannot join trip: trip information is missing");
      return;
    }
    
    try {
      setJoinStatus("joining");
      
      // Use the right ID - post ID for joining
      const postId = trip._id;
      const response = await groupApi.joinGroup(postId);
      
      console.log("Join response:", response.data);
      setJoinStatus("joined");
      
      alert("You've successfully joined this trip!");
    } catch (error) {
      console.error("Failed to join trip:", error);
      setJoinStatus("error");
      alert("Failed to join trip. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trip details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-lg">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <div className="container py-10 text-center">No trip information available</div>;
  }

  // Format the budget for display
  const formatBudget = (budget) => {
    switch(budget) {
      case "0-1000": return "$0-$1000";
      case "1001-2000": return "$1001-$2000";
      case "2001-3000": return "$2001-$3000";
      case "3001+": return "$3001+";
      default: return budget;
    }
  };

  // Format date range
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return "Date not specified";
    }
  };

  // Calculate trip duration in days
  const calculateDuration = () => {
    try {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Duration not available";
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return "Duration not available";
    }
  };

  // Ensure activities is an array
  const activities = Array.isArray(trip.activities) 
    ? trip.activities 
    : (typeof trip.activities === 'string' ? trip.activities.split(',').map(act => act.trim()) : []);

  // Get image URL
  const getImageUrl = () => {
    if (!trip.image) {
      return Travel_animation;
    }
    
    if (typeof trip.image === 'string') {
      if (trip.image.startsWith('/uploads/')) {
        return `${window.location.origin}${trip.image}`;
      }
      if (trip.image.startsWith('http')) {
        return trip.image;
      }
    }
    
    return Travel_animation;
  };

  // Join button state
  const getJoinButtonContent = () => {
    switch(joinStatus) {
      case "joining":
        return (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Joining...
          </div>
        );
      case "joined":
        return (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Joined Trip
          </div>
        );
      case "error":
        return "Try Again";
      default:
        return "Join This Trip";
    }
  };

  return (
    <div>
      <div className="h-[300px] overflow-hidden">
        <img
          src={getImageUrl()}
          alt={trip.location}
          className="mx-auto w-full h-full object-cover transition duration-700 hover:scale-110"
          onError={(e) => {
            e.target.src = Travel_animation;
          }}
        />
      </div>

      <div className="px-4 md:px-8 py-10">
        {/* Trip information section */}
        <div className="container mx-auto max-w-4xl pb-14">
          <div className="flex flex-wrap items-center gap-2 text-sm py-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{trip.location}</span>
            {activities.map((activity, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {activity}
              </span>
            ))}
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {formatBudget(trip.budget)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-6 mt-2">{trip.location}</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Trip organizer info */}
            {organizer && (
              <div className="flex items-center mb-6 pb-4 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {organizer.initials}
                </div>
                <h2 className="text-xl pl-3 font-semibold">{organizer.name}</h2>
              </div>
            )}
            
            {/* Trip details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Trip Details</h2>
              <p className="text-lg leading-relaxed mb-4">{trip.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">What to expect</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Activities: {activities.join(', ')}</li>
                    <li>Budget range: {formatBudget(trip.budget)}</li>
                    <li>Full trip experience with like-minded travelers</li>
                    <li>Local insights and authentic experiences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">Trip Overview</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Duration: {calculateDuration()} days</li>
                    <li>Start date: {formatDate(trip.start_date)}</li>
                    <li>End date: {formatDate(trip.end_date)}</li>
                    <li>Location: {trip.location}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">Interested in joining this trip?</p>
                <p className="text-sm text-blue-600">Secure your spot before it's filled!</p>
              </div>
              <button 
                className={`mt-3 sm:mt-0 px-6 py-2 font-medium rounded-md transition ${
                  joinStatus === "joined" 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                onClick={handleJoinTrip}
                disabled={joinStatus === "joining" || joinStatus === "joined"}
              >
                {getJoinButtonContent()}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 py-4 px-2 rounded-lg border border-gray-200">
          <div className="w-[95%] mx-auto">
            <Trip 
              heading="Other trips you might be interested in" 
              headingStyle="border-l-5 border-primary/50 py-2 pl-2 text-2xl font-bold" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;