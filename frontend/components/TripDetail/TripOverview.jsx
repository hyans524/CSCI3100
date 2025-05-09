import React, { useState } from "react";
import { formatDate, formatCurrency } from "../../src/utils/formatters";
import { authApi, tripApi, groupApi } from "../../src/utils/api";

const TripOverview = ({ trip, group }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current user ID
  const currentUserId = authApi.getCurrentUserId();

  const [formData, setFormData] = useState({
    title: group?.group_name || "",
    trip_summary: group?.trip_summary || "",
    destination: trip?.destination || "",
    start_date: trip?.start_date || "",
    end_date: trip?.end_date || "",
    budget: trip?.budget || "",
    activities: getUniqueActivities() || [],
    activityInput: "",
  });

  const memberCount =  group.members.length;

  // Format activities for display, removing duplicates
  function getUniqueActivities() {
    const tripActivities = Array.isArray(trip.activity) ? trip.activity : [];
    const groupActivities = (group && Array.isArray(group.activities)) ? group.activities : [];
    
    const allActivitiesSet = new Set([...tripActivities, ...groupActivities]);
    return Array.from(allActivitiesSet);
  }
  
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Activity management
  const addActivity = () => {
    if (formData.activityInput.trim()) {
      if (!formData.activities.includes(formData.activityInput.trim())) {
        setFormData({
          ...formData,
          activities: [...formData.activities, formData.activityInput.trim()],
          activityInput: ""
        });
      } else {
        setFormData({
          ...formData,
          activityInput: ""
        });
      }
    }
  };

  const removeActivity = (indexToRemove) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, index) => index !== indexToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for trip update
      const tripUpdateData = {
        destination: formData.destination,
        start_date: formData.start_date,
        end_date: formData.end_date,
        budget: Number(formData.budget),
        activity: formData.activities
      };
      
      // Prepare data for group update
      const groupUpdateData = {
        group_name: formData.title,
        trip_summary: formData.trip_summary
      };
      
      console.log('Updating trip with data:', tripUpdateData);
      console.log('Updating group with data:', groupUpdateData);
      
      try {
        // update the trip
        const tripResponse = await tripApi.update(trip._id, tripUpdateData);
        console.log('Trip updated successfully:', tripResponse.data);
        
        // update the group
        const groupResponse = await groupApi.update(group._id, groupUpdateData);
        console.log('Group updated successfully:', groupResponse.data);
        
        window.location.reload();
        setIsEditing(false);

      } catch (apiError) {
        console.error('API error:', apiError);
        throw apiError;
      }
      
    } catch (error) {
      console.error('Error updating trip info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // If canceling edit, reset the form data
      setFormData({
        title: group?.group_name || "",
        trip_summary: group?.trip_summary || "",
        destination: trip?.destination || "",
        start_date: trip?.start_date || "",
        end_date: trip?.end_date || "",
        budget: trip?.budget || "",
        activities: getUniqueActivities() || [],
        activityInput: "",
      });
    }
    setIsEditing(!isEditing);
  };

  // Render the edit form
  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-700">Edit Trip Overview</h2>
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleEditMode}
              type="button"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="title" className="block text-blue-700 font-medium mb-2">
                Trip Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                placeholder="Enter trip title"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="trip_summary" className="block text-blue-700 font-medium mb-2">
                Trip Summary
              </label>
              <textarea
                id="trip_summary"
                name="trip_summary"
                value={formData.trip_summary}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                placeholder="Enter a brief summary of your trip"
                rows="3"
              ></textarea>
            </div>
            
            <div className="mb-5">
              <label htmlFor="destination" className="block text-blue-700 font-medium mb-2">
                Destination*
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                placeholder="Where are you headed?"
              />
            </div>
            
            <div className="mb-5">
              <label className="block text-blue-700 font-medium mb-2">Travel Dates*</label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="start_date" className="block text-sm text-blue-600 mb-1">From</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="end_date" className="block text-sm text-blue-600 mb-1">To</label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-5">
              <label htmlFor="budget" className="block text-blue-700 font-medium mb-2">
                Budget*
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                placeholder="Enter budget amount"
                step="100"
                min="0"
              />
            </div>
            
            <div className="mb-5">
              <label htmlFor="activities" className="block text-blue-700 font-medium mb-2">
                Planned Activities*
              </label>
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full shadow-sm" 
                  >
                    {activity}
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove ${activity}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="activityInput"
                  name="activityInput"
                  value={formData.activityInput}
                  onChange={handleInputChange}
                  className="flex-1 p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                  placeholder="e.g., Hiking, Museums, Food Tours"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
                />
                <button
                  type="button"
                  onClick={addActivity}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md flex items-center justify-center min-w-[80px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Render the normal one
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-blue-700">Trip Overview</h2>
          <button 
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={toggleEditMode}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
        </div>
        
        <div>
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">TRIP SUMMARY</h3>
            <p className="text-lg text-gray-700 leading-relaxed mt-1">{group?.trip_summary || "Not specified"}</p>
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
    </div>
  );
};

export default TripOverview;