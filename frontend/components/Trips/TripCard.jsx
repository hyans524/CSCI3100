import React from "react";
import { Link } from "react-router-dom";
import Travel_animation from "../../src/assets/travel_animation.jpg";

const TripCard = ({_id, user_id, text, image, location, budget, activities, start_date, end_date}) => {

  // Convert buffer to image URL or use Travel_animation image if no image provided
  const getImageUrl = () => {
    if (!image) return Travel_animation;
    
    try {
      return `data:image/jpeg;base64,${Buffer.from(image).toString('base64')}`;
    } catch (error) {
      return Travel_animation;
    }
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
    
    const formatOptions = { month: 'short', day: 'numeric' };
    const startFormatted = start.toLocaleDateString(undefined, formatOptions);
    const endFormatted = end.toLocaleDateString(undefined, formatOptions);
    
    return `${startFormatted} - ${endFormatted}, ${start.getFullYear()}`;
  };

  return (
    <Link
      to={`/trip/${_id}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      state={{_id, user_id, text, image, location, budget, activities, start_date, end_date}}
    >
      <div className="shadow-lg transition-all duration-500 hover:shadow-xl cursor-pointer">
        <div className="overflow-hidden relative">
          <img
            src={getImageUrl()}
            alt={location}
            className={`mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110 ${
              isDefaultImage ? 'opacity-70 saturate-80 brightness-80' : ''
            }`}
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
            {activities && activities.slice(0, 3).map((activity, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {activity}
              </span>
            ))}
            {activities && activities.length > 3 && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                +{activities.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center justify-end border-t-2 py-3 !mt-3">
            <p className="text-xl font-bold">{formatBudget(budget)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TripCard;