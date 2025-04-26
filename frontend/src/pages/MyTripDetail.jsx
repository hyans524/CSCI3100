// MyTripDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const MyTripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    // For demo, using mock data
    const mockTrip = {
      id: parseInt(id),
      title: "Beach Vacation in Bali",
      location: "Bali, Indonesia",
      startDate: "2025-06-15",
      endDate: "2025-06-25",
      status: "upcoming",
      image: "https://placekitten.com/1200/600", // Just a placeholder image
      participants: 4,
      budget: "$3000-$5000",
      activities: ["Surfing", "Snorkeling", "Temple Visit", "Beach Relaxation", "Local Cuisine Tour"],
      itinerary: [
        {
          day: 1,
          date: "2025-06-15",
          activities: [
            { time: "09:00", description: "Arrival and hotel check-in" },
            { time: "12:00", description: "Welcome lunch at beachfront restaurant" },
            { time: "15:00", description: "Beach relaxation and swimming" },
            { time: "19:00", description: "Dinner and trip orientation" }
          ]
        },
        {
          day: 2,
          date: "2025-06-16",
          activities: [
            { time: "08:00", description: "Breakfast at hotel" },
            { time: "10:00", description: "Surfing lessons with local instructors" },
            { time: "13:00", description: "Lunch at local warung" },
            { time: "15:00", description: "Visit to Uluwatu Temple" },
            { time: "18:30", description: "Seafood dinner at Jimbaran Bay" }
          ]
        },
        {
          day: 3,
          date: "2025-06-17",
          activities: [
            { time: "07:30", description: "Breakfast at hotel" },
            { time: "09:00", description: "Full day snorkeling trip to Nusa Penida" },
            { time: "16:00", description: "Return to hotel and free time" },
            { time: "19:00", description: "Dinner and cultural performance" }
          ]
        }
      ],
      accommodation: {
        name: "Bali Paradise Resort & Spa",
        address: "Jl. Beach Road No. 123, Kuta, Bali",
        checkIn: "2025-06-15",
        checkOut: "2025-06-25",
        amenities: ["Pool", "Spa", "Restaurant", "Beach Access", "Free WiFi"]
      },
      transportation: [
        {
          type: "Flight",
          from: "San Francisco International Airport",
          to: "Ngurah Rai International Airport",
          departureDate: "2025-06-15",
          departureTime: "01:30",
          arrivalDate: "2025-06-15",
          arrivalTime: "08:45",
          provider: "Singapore Airlines",
          bookingReference: "SQ12345"
        },
        {
          type: "Airport Transfer",
          from: "Ngurah Rai International Airport",
          to: "Bali Paradise Resort & Spa",
          date: "2025-06-15",
          time: "09:30",
          provider: "Resort Shuttle Service"
        },
        {
          type: "Flight",
          from: "Ngurah Rai International Airport",
          to: "San Francisco International Airport",
          departureDate: "2025-06-25",
          departureTime: "10:15",
          arrivalDate: "2025-06-25",
          arrivalTime: "23:30",
          provider: "Singapore Airlines",
          bookingReference: "SQ12346"
        }
      ],
      notes: "Don't forget to bring sunscreen, beach attire, and comfortable walking shoes. Currency exchange is available at the airport. Local SIM cards can be purchased for better connectivity.",
      organizer: {
        name: "Travel Buddies Inc.",
        contactPerson: "Sarah Johnson",
        email: "sarah@travelbuddies.com",
        phone: "+1-234-567-8901"
      },
      emergencyContact: {
        name: "Bali Tourist Assistance Center",
        phone: "+62-361-759-687"
      }
    };
    
    // Set trip data immediately without setTimeout
    setTrip(mockTrip);
    
  }, [id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateDaysToTrip = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 p-8 rounded-lg max-w-2xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Trip Not Found</h2>
          <p className="text-blue-600 mb-6">We couldn't find the trip you're looking for.</p>
          <Link to="/mytrips" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilTrip = calculateDaysToTrip(trip.startDate);
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
          alt={trip.title} 
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{trip.title}</h1>
              <div className="flex items-center text-white/90 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {trip.location}
              </div>
              <div className="flex items-center text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                <span className="ml-2 text-white/80">
                  ({calculateDuration(trip.startDate, trip.endDate)} days)
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
                Your trip starts on {formatDate(trip.startDate)}
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
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="font-bold text-xl text-blue-700 mb-4">Trip Overview</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
              <div>
                <div className="text-sm text-gray-500">LOCATION</div>
                <div className="font-medium">{trip.location}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">DURATION</div>
                <div className="font-medium">{calculateDuration(trip.startDate, trip.endDate)} days</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">PARTICIPANTS</div>
                <div className="font-medium">{trip.participants} people</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">BUDGET</div>
                <div className="font-medium">{trip.budget}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">ACTIVITIES</div>
              <div className="flex flex-wrap gap-2">
                {trip.activities.map((activity, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {activity}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-2">IMPORTANT NOTES</div>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-md">
                {trip.notes}
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="font-bold text-xl text-blue-700 mb-4">Itinerary</h2>
            <div className="space-y-6">
              {trip.itinerary.map((day) => (
                <div key={day.day} className="relative pl-8 border-l-2 border-blue-100">
                  <div className="absolute left-[-10px] top-0 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {day.day}
                  </div>
                  <div className="mb-2">
                    <div className="font-semibold text-lg">Day {day.day}</div>
                    <div className="text-gray-600 text-sm">{formatDate(day.date)}</div>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex">
                        <div className="w-16 text-blue-600 font-medium">{activity.time}</div>
                        <div>{activity.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div>
          {/* Accommodation */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="font-bold text-xl text-blue-700 mb-4">Accommodation</h2>
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">{trip.accommodation.name}</div>
              <div className="text-gray-600 mb-2">{trip.accommodation.address}</div>
              <div className="text-sm">
                <span className="text-gray-500">Check-in:</span> {formatDate(trip.accommodation.checkIn)}
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Check-out:</span> {formatDate(trip.accommodation.checkOut)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">AMENITIES</div>
              <div className="flex flex-wrap gap-2">
                {trip.accommodation.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Transportation */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="font-bold text-xl text-blue-700 mb-4">Transportation</h2>
            <div className="space-y-5">
              {trip.transportation.map((transport, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-2">
                    <div className="font-semibold">{transport.type}</div>
                    {transport.bookingReference && (
                      <div className="text-sm text-blue-600">Ref: {transport.bookingReference}</div>
                    )}
                  </div>
                  
                  <div className="flex items-baseline mb-2">
                    <div className="w-1/2">
                      <div className="text-sm text-gray-500">FROM</div>
                      <div>{transport.from}</div>
                    </div>
                    <div className="w-1/2">
                      <div className="text-sm text-gray-500">TO</div>
                      <div>{transport.to}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline">
                    <div className="w-1/2">
                      <div className="text-sm text-gray-500">DEPARTURE</div>
                      <div>
                        {transport.departureDate ? formatDate(transport.departureDate) : formatDate(transport.date)}
                        {transport.departureTime ? ` at ${transport.departureTime}` : transport.time ? ` at ${transport.time}` : ''}
                      </div>
                    </div>
                    {transport.arrivalDate && (
                      <div className="w-1/2">
                        <div className="text-sm text-gray-500">ARRIVAL</div>
                        <div>
                          {formatDate(transport.arrivalDate)}
                          {transport.arrivalTime ? ` at ${transport.arrivalTime}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {transport.provider && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Provider:</span> {transport.provider}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl text-blue-700 mb-4">Contact Information</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">TRIP ORGANIZER</div>
              <div className="font-semibold">{trip.organizer.name}</div>
              <div className="text-gray-700 mb-1">{trip.organizer.contactPerson}</div>
              <div className="text-blue-600 hover:underline">{trip.organizer.email}</div>
              <div>{trip.organizer.phone}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">EMERGENCY CONTACT</div>
              <div className="font-semibold">{trip.emergencyContact.name}</div>
              <div>{trip.emergencyContact.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTripDetail;