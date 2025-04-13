import React from "react";
import Fuji from "../../src/assets/Fuji_background.jpg";
import TripCard from "./TripCard";

const TripsData = [
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
  {
    img: Fuji,
    title: "Fuji Mountain",
    location: "Japan",
    description: "Wow wow wowowwoowowowowowowowowowowowowowowowowow",
    price: 100,
    type: "Natural",
  },
];

const Trip = ({ heading = "Interested Trips to Join", headingStyle = "border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold" }) => {
  return (
    <div>
      <div className="container">
        <h1 className={`my-8 ${headingStyle}`}>
          {heading}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {TripsData.map((item, index) => (
            <TripCard key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trip;