import React from "react";
import { formatDate, formatCurrency } from "../../src/utils/formatters";

const TripOverview = ({ trip, group }) => {
  // Calculate the actual number of members
  const memberCount = group && Array.isArray(group.members) 
    ? group.members.length 
    : (group?.memberCount || trip?.memberCount || 0);

  // Format activities for display, removing duplicates
  const getUniqueActivities = () => {
    // Collect all activities from both sources
    const tripActivities = Array.isArray(trip.activity) ? trip.activity : [];
    const groupActivities = (group && Array.isArray(group.activities)) ? group.activities : [];
    
    // Combine and remove duplicates using a Set
    const allActivitiesSet = new Set([...tripActivities, ...groupActivities]);
    
    // Convert back to array
    return Array.from(allActivitiesSet);
  };
  
  const activities = getUniqueActivities();

  // Calculate duration in days if not directly provided
  const calculateDuration = () => {
    if (trip.duration) return trip.duration;
    
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    
    return "N/A";
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700">Trip Overview</h2>
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">DESTINATION</h3>
              <p className="text-lg font-bold">{trip.destination || "Not specified"}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">GROUP MEMBERS</h3>
              <p className="text-lg font-bold">{memberCount} {memberCount === 1 ? 'person' : 'people'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">ACTIVITIES</h3>
              <div className="flex flex-wrap gap-2">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {activity}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No activities planned yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">DURATION</h3>
              <p className="text-lg font-bold">{calculateDuration()} {calculateDuration() === 1 ? 'day' : 'days'}</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">BUDGET</h3>
              <p className="text-lg font-bold">{formatCurrency(trip.budget)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">DATES</h3>
              <p className="text-lg font-bold">
                {trip.start_date ? formatDate(trip.start_date) : "Start date not set"} - {trip.end_date ? formatDate(trip.end_date) : "End date not set"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripOverview;