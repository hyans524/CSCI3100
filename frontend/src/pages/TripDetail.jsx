import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Trip from "../../components/Trips/Trip";

const TripDetail = () => {
const location = useLocation();
const { id } = useParams();
const [trip, setTrip] = useState(null);
const [organizer, setOrganizer] = useState(null);

useEffect(() => {
    // If we have state from navigation, use it
    if (location.state) {
        setTrip(location.state);
        
        // In a real app:
        // const fetchUser = async () => {
        //   try {
        //     const response = await fetch(`/api/users/${location.state.user_id}`);
        //     const data = await response.json();
        //     setOrganizer(data);
        //   } catch (error) {
        //     console.error('Error fetching user:', error);
        //   }
        // };
        // fetchUser();
        
        // Mock data
        setOrganizer({
            _id: location.state.user_id,
            name: "John Peterson",
            initials: "JP"
        });
    } else {
        // If no state (direct URL access), fetch the trip data
        // In a real app:
        // const fetchTrip = async () => {
        //   try {
        //     const response = await fetch(`/api/posts/${id}`);
        //     const data = await response.json();
        //     setTrip(data);
        //     
        //     // And then fetch user data
        //     const userResponse = await fetch(`/api/users/${data.user_id}`);
        //     const userData = await userResponse.json();
        //     setOrganizer(userData);
        //   } catch (error) {
        //     console.error('Error fetching trip:', error);
        //   }
        // };
        // fetchTrip();
        
        // mock data
        const mockTrip = {
            _id: id,
            user_id: 'user1',
            text: "Experience the majestic Mount Fuji with breathtaking views. Perfect for hiking enthusiasts and nature lovers. The climb offers spectacular views, especially at sunrise. We'll be taking the most scenic route and staying at a traditional mountain hut overnight.",
            image: null,
            location: "Mount Fuji, Japan",
            budget: "1001-2000",
            activities: ["Hiking", "Photography", "Sightseeing", "Cultural Experience"],
            start_date: new Date("2025-06-10"),
            end_date: new Date("2025-06-20")
        };
    
        setTrip(mockTrip);
        setOrganizer({
            _id: 'user1',
            name: "John Peterson",
            initials: "JP"
        });
    }
}, [id, location.state]);

if (!trip) {
    return <div className="container py-10 text-center">Loading trip details...</div>;
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
    return new Date(date).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
    });
};

// Calculate trip duration in days
const calculateDuration = () => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// Get image URL
const imageUrl = trip.image 
    ? `data:image/jpeg;base64,${Buffer.from(trip.image).toString('base64')}` 
    : "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1470&auto=format&fit=crop";

return (
    <div>
    <div className="h-[300px] overflow-hidden">
        <img
            src={imageUrl}
            alt={trip.location}
            className="mx-auto w-full h-full object-cover transition duration-700 hover:scale-110"
        />
    </div>

    <div className="px-15 py-10">
        {/* Trip information section */}
        <div className="container pb-14">
            <div className="flex flex-wrap items-center gap-2 text-sm py-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{trip.location}</span>
                {trip.activities.map((activity, index) => (
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
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
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
                                <li>Activities: {trip.activities.join(', ')}</li>
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
                <button className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-medium rounded-md transition">
                    Join This Trip
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