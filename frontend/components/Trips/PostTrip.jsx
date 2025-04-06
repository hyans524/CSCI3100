import React, { useState } from "react";

const PostTrip = ({ onClose }) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [duration, setDuration] = useState("");
    const [numPeople, setNumPeople] = useState("1-4");
    const [budget, setBudget] = useState("1-1000");
    const [activities, setActivities] = useState([]);
    const [activityInput, setActivityInput] = useState("");
    const [details, setDetails] = useState("");

    const calculateDuration = (from, to) => {
        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const diffTime = Math.abs(toDate - fromDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDuration(diffDays);
        } else {
            setDuration("");
        }
    };

    const addActivity = () => {
        if (activityInput.trim()) {
            if (!activities.includes(activityInput.trim())) setActivities([...activities, activityInput.trim()]);
            setActivityInput(""); // Clear the input field
        }
    };

    const removeActivity = (indexToRemove) => {
        setActivities(activities.filter((_, index) => index !== indexToRemove));
    };

return (
    <div className="p-6 bg-white shadow-lg rounded-lg relative max-w-6xl">
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl" onClick={onClose}>
            ✕
        </button>

        <h2 className="text-3xl font-bold mb-4">Add Trip</h2>

        {/* Form Fields */}
        <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 mb-2">
                Location
            </label>
            <input
                type="text"
                id="location"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter location"
            />
        </div>

        <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date</label>
            <div className="flex gap-4">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                        setFromDate(e.target.value);
                        calculateDuration(e.target.value, toDate);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                        setToDate(e.target.value);
                        calculateDuration(fromDate, e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            {duration && (
                <p className="text-sm text-gray-600 mt-2">
                    Duration: {duration} day(s)
                </p>
            )}
        </div>

        <div className="flex gap-x-4 col-span-2 mb-4">
            <div className="w-[50%]">
                <label htmlFor="numPeople" className="block text-gray-700 mb-2">
                    Number of People
                </label>
                <select
                    id="numPeople"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="1-4">1-4</option>
                    <option value="5-7">5-7</option>
                    <option value="8-10">8-10</option>
                    <option value="11+">11+</option>
                </select>
            </div>

            <div className="w-[50%]">
                <label htmlFor="budget" className="block text-gray-700 mb-2">
                    Budget
                </label>
                <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="1-1000">1-1000</option>
                    <option value="1001-3000">1001-3000</option>
                    <option value="3001-5000">3001-5000</option>
                    <option value="5001-10000">5001-10000</option>
                    <option value="10001+">10001+</option>
                </select>
            </div>
        </div>

        <div className="mb-4">
            <label htmlFor="activities" className="block text-gray-700 mb-2">
                Type of Activities
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                {activities.map((activity, index) => (
                    <span
                        key={index}
                        className="flex items-center bg-orange-300 text-black px-3 py-1 rounded-full" 
                    >
                        {activity}
                        <button
                            onClick={() => removeActivity(index)}
                            className="ml-2 text-black font-bold"
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    id="activities"
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="Enter activity"
                />
                <button
                    onClick={addActivity}
                    className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500"
                >
                    Add
                </button>
            </div>
        </div>

        <div className="mb-4">
            <label htmlFor="details" className="block text-gray-700 mb-2">
                Longer Detail
            </label>
                <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Write your detailed description here..."
                rows="5"
                ></textarea>
        </div>

        <div className="flex justify-end">
            <button className="px-6 py-2 bg-orange-400 text-white rounded hover:bg-orange-600">
                Submit
            </button>
        </div>
    </div>
);
};

export default PostTrip;