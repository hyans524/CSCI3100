import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import { postApi } from "../../src/utils/api";

const Trip = ({ 
  searchCriteria = null,
  heading = "Interested Trips to Join", 
  headingStyle = "border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold" 
}) => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        
        // Use location from search criteria if available
        const queryParams = searchCriteria?.location ? 
          `?location=${encodeURIComponent(searchCriteria.location)}` : '';
        
        const response = await postApi.getAll(queryParams);
        
        if (response && response.data) {
          setTrips(response.data);
          setError(null);
        } else {
          throw new Error("Failed to fetch trips");
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [searchCriteria?.location]); // Re-fetch when location changes


  useEffect(() => {
    if (!trips || trips.length === 0) return;
    
    if (!searchCriteria) {
      setFilteredTrips(trips);
      return;
    }
    
    let filtered = [...trips];
    
    if (searchCriteria.fromDate || searchCriteria.toDate) {
      filtered = filtered.filter(trip => {
        const tripStart = new Date(trip.start_date);
        const tripEnd = new Date(trip.end_date);
        
        if (searchCriteria.fromDate && searchCriteria.toDate) {
          const fromDate = new Date(searchCriteria.fromDate);
          const toDate = new Date(searchCriteria.toDate);
          
          return (fromDate <= tripStart && tripEnd <= toDate);
          
        } else if (searchCriteria.fromDate) {
          const fromDate = new Date(searchCriteria.fromDate);
          return tripStart >= fromDate;

        } else if (searchCriteria.toDate) {
          const toDate = new Date(searchCriteria.toDate);
          return tripEnd <= toDate;
        }
        
        return true;
      });
    }
    
    if (searchCriteria.budget) {
      filtered = filtered.filter(trip => {
        const maxBudgetValue = parseInt(searchCriteria.budget);
        
        if (typeof trip.budget === 'string') {
          if (trip.budget.includes('+')) {
            const minValue = parseInt(trip.budget.replace('+', ''));
            return minValue <= maxBudgetValue;
          } else if (trip.budget.includes('-')) {
            const [, maxValue] = trip.budget.split('-').map(val => parseInt(val));
            return maxValue <= maxBudgetValue;
          }
        } else if (typeof trip.budget === 'number') {
          return trip.budget <= maxBudgetValue;
        }
        
        return true;
      });
    }
    
    setFilteredTrips(filtered);
  }, [trips, searchCriteria]);

  const tripsToDisplay = filteredTrips;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className={headingStyle}>{heading}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Display search results summary if filtered */}
        {searchCriteria && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              <span className="font-medium">Search results:</span> {tripsToDisplay.length} trip{tripsToDisplay.length !== 1 ? 's' : ''} found
              {searchCriteria.location && ` for "${searchCriteria.location}"`}
              {searchCriteria.fromDate && ` from ${new Date(searchCriteria.fromDate).toLocaleDateString()}`}
              {searchCriteria.toDate && ` to ${new Date(searchCriteria.toDate).toLocaleDateString()}`}
              {searchCriteria.budget && ` with budget under $${searchCriteria.budget}`}
            </p>
          </div>
        )}
        
        {tripsToDisplay.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">
              {searchCriteria 
                ? "No trips match your search criteria. Try adjusting your filters."
                : "No trips available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {tripsToDisplay.map((trip) => (
              <TripCard 
                key={trip._id} 
                {...trip} 
                likeCount={trip.likes?.length || 0}
                commentCount={trip.comments?.length || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;