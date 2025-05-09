import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import TripOverview from "../../components/TripDetail/TripOverview";
import GroupMembers from "../../components/TripDetail/GroupMembers";
import ExpensesSection from "../../components/TripDetail/ExpensesSection";
import GroupMessages from "../../components/TripDetail/GroupMessages";
import { formatDate, formatCurrency, calculateDuration } from "../utils/formatters";
import { tripApi, groupApi, expenseApi, authApi } from "../utils/api";

const MyTripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching trip with ID:", id);
        
        // Fetch trip details
        const tripResponse = await tripApi.getById(id);
        console.log("Trip API Response:", tripResponse);
        
        const tripData = tripResponse.data;
        console.log("Trip Data:", tripData);
        
        if (!tripData) {
          setError("Trip not found");
          setLoading(false);
          return;
        }
        
        // Add image for UI display based on destination
        let image = "https://placekitten.com/1200/600"; // Default placeholder
        if (tripData.destination && tripData.destination.toLowerCase().includes('japan')) {
          image = 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80';
        } else if (tripData.destination && tripData.destination.toLowerCase().includes('france')) {
          image = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=600&q=80';
        }
        
        // Preserve all original trip data fields and add image
        const tripWithImage = {
          ...tripData,
          image,
          status: new Date(tripData.end_date) < new Date() ? "completed" : "upcoming"
        };
        
        setTrip(tripWithImage);
        
        // Fetch associated group
        if (tripData.group_id) {
          console.log("Fetching group with ID:", tripData.group_id);
          
          try {
            // Try to get the group by group_id directly
            const groupResponse = await groupApi.getByGroupId(tripData.group_id);
            console.log("Group response:", groupResponse);
            
            if (groupResponse.data) {
              const groupData = groupResponse.data;
              
              // Members should now be populated with real user data from our updated API
              const members = groupData.members || [];
              console.log("Members from API:", members);
              
              // Create complete group object with all required fields
              const processedGroup = {
                ...groupData,
                memberCount: members.length,
                members,
                messages: groupData.messages || [],
                activities: groupData.activities || tripData.activity || []
              };
              
              setGroup(processedGroup);
              
              // Fetch expenses for this group
              try {
                const expensesResponse = await expenseApi.getByGroupId(groupData._id);
                if (expensesResponse.data) {
                  setExpenses(expensesResponse.data);
                }
              } catch (e) {
                console.log("No expenses found or error fetching expenses:", e);
                setExpenses([]);
              }
            } else {
              console.warn("No group data returned from API");
              setGroup(null);
            }
          } catch (e) {
            console.error("Error fetching group:", e);
            setGroup(null);
          }
        } else {
          console.log("No group_id in trip data");
          setGroup(null);
        }
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch trip details:", err);
        setError("Failed to load trip details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripDetails();
  }, [id]);

  const calculateDaysToTrip = (startDate) => {
    if (!startDate) return 0;
    
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mt-4">Loading trip details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">{error}</h2>
          <p className="text-blue-600 mb-6">There was a problem loading this trip.</p>
          <Link to="/mytrip" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Trip Not Found</h2>
          <p className="text-blue-600 mb-6">We couldn't find the trip you're looking for.</p>
          <Link to="/mytrip" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilTrip = calculateDaysToTrip(trip.start_date);
  const isTripUpcoming = daysUntilTrip > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link 
        to="/mytrip" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to My Trips
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
        <img 
          src={trip.image} 
          alt={group?.group_name || trip.destination} 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{group?.group_name || trip.destination}</h1>
              <div className="flex items-center text-white/90 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {trip.destination || "Unknown destination"}
              </div>
              <div className="flex items-center text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {trip.start_date ? formatDate(trip.start_date) : "Unknown"} - {trip.end_date ? formatDate(trip.end_date) : "Unknown"}
                <span className="ml-2 text-white/80">
                  {trip.start_date && trip.end_date ? `(${calculateDuration(trip.start_date, trip.end_date)} days)` : ""}
                </span>
              </div>
            </div>
            <span 
              className={`text-sm font-semibold px-4 py-2 rounded-full uppercase ${
                trip.status === "upcoming" 
                  ? "bg-green-500 text-white" 
                  : "bg-blue-500 text-white"
              }`}
            >
              {trip.status}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Countdown - Show only for upcoming trips */}
      {isTripUpcoming && (
        <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="font-bold text-xl text-blue-700 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Trip Countdown
          </h2>
          <div className="flex items-center">
            <div className="text-4xl font-bold text-blue-600">{daysUntilTrip}</div>
            <div className="ml-3">
              <div className="text-lg font-semibold text-blue-800">
                {daysUntilTrip === 1 ? 'day' : 'days'} to go!
              </div>
              <div className="text-blue-600">
                Your trip starts on {formatDate(trip.start_date)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2">
          {/* Trip Overview */}
          <TripOverview trip={trip} group={group} />
          
          {/* Group Messages */}
          <GroupMessages 
            messages={group?.messages || []} 
            members={group?.members || []} 
            groupId={group?._id}
          />
        </div>
        
        {/* Right Column */}
        <div>
          {/* Group Members */}
          <GroupMembers members={group?.members || []} />
          
          {/* Expenses */}
          <ExpensesSection 
            expenses={expenses} 
            members={group?.members || []} 
            groupId={group?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default MyTripDetail;