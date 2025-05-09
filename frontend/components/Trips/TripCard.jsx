import React from "react";
import { Link } from "react-router-dom";
import Travel_animation from "../../src/assets/travel_animation.jpg";

const TripCard = ({
  _id, 
  user_id, 
  text, 
  image, 
  location, 
  budget, 
  activities, 
  start_date, 
  end_date, 
  likeCount, 
  commentCount,
  trip_oid
}) => {

  // Get the image URL - handles both URL paths and base64 encoded images
  const getImageUrl = () => {
    if (!image) return Travel_animation;
    
    // If image is a path (from backend uploads folder)
    if (typeof image === 'string') {
      if (image.startsWith('/uploads/')) {
        // Use absolute URL for server-side images
        return `${window.location.origin}${image}`;
      }
      if (image.startsWith('http')) {
        return image;
      }
    }
    
    // Fallback to default image
    return Travel_animation;
  };
  
  const isDefaultImage = !image || getImageUrl() === Travel_animation;
  
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
  const formatDateRange = () => {
    if (!start_date || !end_date) return "";
    
    const start = new Date(start_date);
    const end = new Date(end_date);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";
    
    const formatOptions = { month: 'short', day: 'numeric' };
    const startFormatted = start.toLocaleDateString(undefined, formatOptions);
    const endFormatted = end.toLocaleDateString(undefined, formatOptions);
    
    return `${startFormatted} - ${endFormatted}, ${start.getFullYear()}`;
  };

  // Handle activities properly - they might come as an array or a string
  const processedActivities = Array.isArray(activities) 
    ? activities 
    : (typeof activities === 'string' ? activities.split(',').map(act => act.trim()) : []);

  return (
    <Link
      to={`/trip/${_id}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      state={{
        _id, 
        user_id, 
        text, 
        image, 
        location, 
        budget, 
        activities: processedActivities, 
        start_date, 
        end_date,
        trip_oid // Pass along the trip_oid for joining functionality
      }}
    >
      <div className="shadow-lg transition-all duration-500 hover:shadow-xl cursor-pointer">
        <div className="overflow-hidden relative">
          <img
            src={getImageUrl()}
            alt={location}
            className={`mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110 ${
              isDefaultImage ? 'opacity-70 saturate-80 brightness-80' : ''
            }`}
            onError={(e) => {
              e.target.src = Travel_animation;
              e.target.classList.add('opacity-70', 'saturate-80', 'brightness-80');
            }}
          />
          
          {isDefaultImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          )}
          
          {isDefaultImage && (
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white font-bold text-xl">
              <span className="bg-black/50 px-2 py-1 rounded">{location}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 p-3">
          <h1 className="line-clamp-1 font-bold text-xl">{location}</h1>
          <div className="flex items-center gap-2 opacity-70">
            <span>{formatDateRange()}</span>
          </div>
          <p className="line-clamp-2">{text}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {processedActivities.slice(0, 3).map((activity, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {activity}
              </span>
            ))}
            {processedActivities.length > 3 && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                +{processedActivities.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-between border-t-2 py-3 !mt-3">
            {(likeCount !== undefined || commentCount !== undefined) && (
              <div className="flex items-center gap-3">
                {likeCount !== undefined && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likeCount}
                  </span>
                )}
                {commentCount !== undefined && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {commentCount}
                  </span>
                )}
              </div>
            )}
            <p className="text-xl font-bold ml-auto">{formatBudget(budget)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;