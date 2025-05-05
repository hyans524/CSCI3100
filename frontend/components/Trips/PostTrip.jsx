import React, { useState } from "react";

const PostTrip = ({ onClose, onTripPosted }) => {
    const [location, setLocation] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [duration, setDuration] = useState("");
    const [numPeople, setNumPeople] = useState("1-4");
    const [budget, setBudget] = useState("0-1000");
    const [activities, setActivities] = useState([]);
    const [activityInput, setActivityInput] = useState("");
    const [details, setDetails] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock user ID (replace with actual user ID from auth context later)
    const mockUserId = "67fba7d7cc439d8b22e006c9";

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
            setActivityInput("");
        }
    };

    const removeActivity = (indexToRemove) => {
        setActivities(activities.filter((_, index) => index !== indexToRemove));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const validateForm = () => {
        if (!location) {
            alert("Please enter a location");
            return false;
        }
        if (!fromDate || !toDate) {
            alert("Please select travel dates");
            return false;
        }
        if (new Date(fromDate) > new Date(toDate)) {
            alert("Start date cannot be after end date");
            return false;
        }
        if (!details) {
            alert("Please provide trip details");
            return false;
        }
        if (activities.length === 0) {
            alert("Please add at least one activity");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        
        try {
            // Map budget values to match backend schema format
            const budgetMapping = {
                "0-1000": "0-1000",
                "1001-3000": "1001-2000", 
                "3001-5000": "2001-3000",
                "5001-10000": "3001+",
                "10001+": "3001+"
            };

            // Create form data for multipart/form-data (for image upload)
            const formData = new FormData();
            formData.append("user_id", mockUserId);
            formData.append("text", details);
            formData.append("location", location);
            formData.append("budget", budgetMapping[budget] || budget);
            formData.append("activities", activities.join(","));
            formData.append("start_date", fromDate);
            formData.append("end_date", toDate);
            
            if (image) {
                formData.append("image", image);
            }
            
            // Send post request using fetch
            const response = await fetch("/api/posts", {
                method: 'POST',
                body: formData
                // No need to set Content-Type header, browser sets it with boundary for FormData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to post trip");
            }
            
            const data = await response.json();
            
            alert("Trip posted successfully!");
            
            // If there's a callback function provided, call it with the new trip data
            if (onTripPosted) {
                onTripPosted(response.data);
            }
            
            // Close the modal
            onClose();
            
        } catch (error) {
            console.error("Error posting trip:", error);
            alert(error.response?.data?.error || "Failed to post trip. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white shadow-xl relative w-full">
            {/* Header with title and close button in same line */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-700">Add Your Journey</h2>
                
                <button 
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="mb-5">
                    <label htmlFor="location" className="block text-blue-700 font-medium mb-2">
                        Location*
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                        placeholder="Where are you headed?"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-blue-700 font-medium mb-2">Travel Dates*</label>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="fromDate" className="block text-sm text-blue-600 mb-1">From</label>
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                    calculateDuration(e.target.value, toDate);
                                }}
                                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                            />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="toDate" className="block text-sm text-blue-600 mb-1">To</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                    calculateDuration(fromDate, e.target.value);
                                }}
                                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                            />
                        </div>
                    </div>
                    {duration && (
                        <div className="mt-2 bg-blue-100 text-blue-700 p-2 rounded-lg inline-block">
                            <span className="font-medium">Duration:</span> {duration} day{duration !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                <div className="flex gap-x-4 col-span-2 mb-5">
                    <div className="w-[50%]">
                        <label htmlFor="numPeople" className="block text-blue-700 font-medium mb-2">
                            Number of People*
                        </label>
                        <select
                            id="numPeople"
                            value={numPeople}
                            onChange={(e) => setNumPeople(e.target.value)}
                            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50 appearance-none"
                            style={{ 
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="1-4">1-4</option>
                            <option value="5-7">5-7</option>
                            <option value="8-10">8-10</option>
                            <option value="11+">11+</option>
                        </select>
                    </div>

                    <div className="w-[50%]">
                        <label htmlFor="budget" className="block text-blue-700 font-medium mb-2">
                            Budget Range*
                        </label>
                        <select
                            id="budget"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50 appearance-none"
                            style={{ 
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            <option value="0-1000">0-1000</option>
                            <option value="1001-3000">1001-3000</option>
                            <option value="3001-5000">3001-5000</option>
                            <option value="5001-10000">5001-10000</option>
                            <option value="10001+">10001+</option>
                        </select>
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="image" className="block text-blue-700 font-medium mb-2">
                        Trip Image (Optional)
                    </label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                    />
                    <p className="text-sm text-blue-600 mt-1">Add a featured image for your trip</p>
                </div>

                <div className="mb-5">
                    <label htmlFor="activities" className="block text-blue-700 font-medium mb-2">
                        Planned Activities*
                    </label>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {activities.map((activity, index) => (
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
                            id="activities"
                            value={activityInput}
                            onChange={(e) => setActivityInput(e.target.value)}
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

                <div className="mb-6">
                    <label htmlFor="details" className="block text-blue-700 font-medium mb-2">
                        Trip Details*
                    </label>
                    <textarea
                        id="details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50"
                        placeholder="Share more details about your trip plans, preferences, or any special requirements..."
                        rows="5"
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Submit Trip
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostTrip;