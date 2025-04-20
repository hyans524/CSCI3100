import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";

const Trip = ({ heading = "Interested Trips to Join", headingStyle = "border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold" }) => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Mock data
    const mockTrips = [
      {
        _id: '1',
        user_id: 'user1',
        text: "Experience the majestic Mount Fuji with breathtaking views. Perfect for hiking enthusiasts and nature lovers.",
        image: null,
        location: "Mount Fuji, Japan",
        budget: "1001-2000",
        activities: ["Hiking", "Photography", "Sightseeing"],
        start_date: new Date("2025-06-10"),
        end_date: new Date("2025-06-20")
      },
      {
        _id: '2',
        user_id: 'user2',
        text: "Relax on Bali's beautiful beaches and experience the unique culture and cuisine of this Indonesian paradise.",
        image: null,
        location: "Bali, Indonesia",
        budget: "2001-3000",
        activities: ["Swimming", "Snorkeling", "Cultural Tour"],
        start_date: new Date("2025-07-05"),
        end_date: new Date("2025-07-15")
      },
      {
        _id: '3',
        user_id: 'user3',
        text: "Explore the ancient temples and beautiful gardens of Kyoto, Japan's historic cultural capital.",
        image: null,
        location: "Kyoto, Japan",
        budget: "0-1000",
        activities: ["Temple Visit", "Cultural Experience", "Traditional Food"],
        start_date: new Date("2025-05-12"),
        end_date: new Date("2025-05-18")
      },
      {
        _id: '4',
        user_id: 'user1',
        text: "Hit the slopes in the beautiful Swiss Alps. Perfect for skiing enthusiasts of all levels.",
        image: null,
        location: "Swiss Alps, Switzerland",
        budget: "3001+",
        activities: ["Skiing", "Snowboarding", "Winter Sports"],
        start_date: new Date("2025-12-15"),
        end_date: new Date("2025-12-25")
      },
      {
        _id: '5',
        user_id: 'user4',
        text: "Discover the architectural wonders and vibrant culture of Barcelona. From Gaudi to tapas, this city has it all.",
        image: null,
        location: "Barcelona, Spain",
        budget: "1001-2000",
        activities: ["City Tour", "Food Tasting", "Architecture"],
        start_date: new Date("2025-09-05"),
        end_date: new Date("2025-09-12")
      },
      {
        _id: '6',
        user_id: 'user2',
        text: "Embark on a safari adventure in Kenya's Maasai Mara. Witness the incredible wildlife in their natural habitat.",
        image: null,
        location: "Maasai Mara, Kenya",
        budget: "3001+",
        activities: ["Safari", "Wildlife Photography", "Nature"],
        start_date: new Date("2025-08-10"),
        end_date: new Date("2025-08-20")
      }
    ];
    
    setTrips(mockTrips);
    
    // In a real app:
    // const fetchTrips = async () => {
    //   try {
    //     const response = await fetch('/api/posts');
    //     const data = await response.json();
    //     setTrips(data);
    //   } catch (error) {
    //     console.error('Error fetching trips:', error);
    //   }
    // };
    // fetchTrips();
  }, []);

  return (
    <div>
      <div className="container">
        <h1 className={`my-8 ${headingStyle}`}>
          {heading}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip._id} {...trip} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trip;