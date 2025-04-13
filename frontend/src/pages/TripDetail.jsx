import React from "react";
import { useLocation } from "react-router-dom";
import Trip from "../../components/Trips/Trip";

const TripDetail = () => {
  const loc = useLocation();
  console.log(loc, "useLocation");
  const { img, title, location, description, price, type } = loc.state;

  return (
    <div>
    
        <div className="h-[200px] overflow-hidden">
            <img
            src={img}
            alt=""
            className="mx-auto w-full h-full object-cover transition duration-700 hover:scale-110"
            />
        </div>


        <div className="px-15 py-10">
            {/* Trip information section */}
            <div className="container pb-14">
                <div className="flex items-center space-x-2 text-sm py-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{location}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{type}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">${price} per person</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-6 mt-2">{title}</h1>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    {/* Trip organizer info */}
                    <div className="flex items-center mb-6 pb-4 border-b">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
                            JP
                        </div>
                        <h2 className="text-xl pl-3 font-semibold">John Peterson</h2>
                    </div>
                    
                    {/* Trip details */}
                    <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Trip Details</h2>
                    <p className="text-lg leading-relaxed mb-4">{description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                        <h3 className="font-medium text-lg mb-2">What to expect</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Group size: 5-8 people</li>
                            <li>Guided tour of iconic sites</li>
                            <li>Local food experience included</li>
                            <li>Transportation from Tokyo included</li>
                        </ul>
                        </div>
                        <div>
                        <h3 className="font-medium text-lg mb-2">Trip Overview</h3>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Duration: 3 days, 2 nights</li>
                            <li>Departure: July 15, 2025</li>
                            <li>Difficulty level: Moderate</li>
                            <li>4 spots remaining</li>
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