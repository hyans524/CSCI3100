import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";

const Trip = ({ heading = "Interested Trips to Join", headingStyle = "border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold" }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/posts");
        
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        
        const data = await response.json();
        setTrips(data);
        setError(null);

      } catch (error) {
        console.error("Error fetching trips:", error);
        setError("Failed to load trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <h1 className={`my-8 ${headingStyle}`}>
          {heading}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {trips.length === 0 && !error ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">No trips available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard key={trip._id} {...trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trip;