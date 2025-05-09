import React, { useState, useEffect } from 'react';
import { recommendationApi, authApi } from '../../src/utils/api';
import { useNavigate } from 'react-router-dom';

const Recommend = () => {
    const [priceValue, setPriceValue] = useState(150);
    const [duration, setDuration] = useState(1);
    const [location, setLocation] = useState('');
    const [activities, setActivities] = useState('');
    const [recommendation, setRecommendation] = useState("Your personalized travel recommendations will appear here after you submit your preferences.");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [budgetRange, setBudgetRange] = useState(150);
    const navigate = useNavigate();

    // Get current user ID
    const currentUserId = authApi.getCurrentUserId() || "681dfd051340e5a171818dea";

    // Set budget range based on price value
    useEffect(() => {
        setBudgetRange(priceValue);
    }, [priceValue]);

    const handleSubmit = async () => {
        // Input validation
        if (!location.trim()) {
            setError("Please enter a destination");
            return;
        }

        if (!activities.trim()) {
            setError("Please enter some activities you're interested in");
            return;
        }

        // Check if user is logged in
        if (!currentUserId) {
            setError("You need to be logged in to receive recommendations");
            setTimeout(() => {
                navigate('/LoginSignup');
            }, 2000);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            
            // Format activities as array
            const activitiesArray = activities.split(',').map(act => act.trim()).filter(act => act.length > 0);

            if (activitiesArray.length === 0) {
                setError("Please enter at least one activity");
                setIsLoading(false);
                return;
            }

            // Prepare data for API
            const data = {
                location: location,
                budget: budgetRange,
                duration: parseInt(duration, 10),
                activities: activitiesArray,
                userId: currentUserId
            };

            console.log("Data to send:", data);

            // Call API to get recommendation
            const response = await recommendationApi.create(data);
            
            console.log("API response:", response.data);

            // Format suggestions for display
            if (response.data && response.data.suggestions) {
                const suggestions = response.data.suggestions;
                
                // Format as daily itinerary
                let formattedRecommendation = '';
                
                // If we have enough suggestions, group them by day
                if (suggestions.length >= duration) {
                    // Group suggestions by day
                    const suggestionsPerDay = Math.ceil(suggestions.length / duration);
                    
                    for (let day = 0; day < duration; day++) {
                        const startIdx = day * suggestionsPerDay;
                        const endIdx = Math.min(startIdx + suggestionsPerDay, suggestions.length);
                        const dayActivities = suggestions.slice(startIdx, endIdx);
                        
                        formattedRecommendation += `Day ${day + 1}: ${dayActivities.join(', ')}\n\n`;
                    }
                } else {
                    // Not enough suggestions for full itinerary, just show them all
                    formattedRecommendation = suggestions.join('\n\n');
                }
                
                setRecommendation(formattedRecommendation);
            }
        } catch (err) {
            console.error("Error getting recommendation:", err);
            setError("Failed to generate recommendation. Please try again later.");
            setRecommendation("Unable to generate recommendations at this time. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-4xl relative z-10">
            <div 
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-blue-100 overflow-hidden"
                data-aos="fade-up"
                data-aos-delay="300"
            >
                <div className="bg-blue-600 py-5 px-6">
                    <h1 className="text-white font-bold text-2xl md:text-3xl">
                        AI Travel Recommendation
                    </h1>
                    <p className="text-blue-100 mt-1 text-sm md:text-base">
                        Tell us your preferences and we'll create the perfect itinerary for you
                    </p>
                </div>
                
                <div className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="space-y-6">
                        {/* Location Field */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <label htmlFor="location" className="text-gray-700 font-medium md:w-1/5">
                                Destination
                            </label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    placeholder="e.g., Tokyo, Japan"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-blue-50/50 border border-blue-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Duration Field */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <label htmlFor="duration" className="text-gray-700 font-medium md:w-1/5">
                                Duration
                            </label>
                            <div className="flex-1">
                                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                                    <input
                                        type="range"
                                        name="duration"
                                        id="duration"
                                        className="appearance-none w-full h-2 bg-blue-200 rounded-full accent-blue-600"
                                        min="1"
                                        max="15"
                                        value={duration}
                                        step="1"
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>1 day</span>
                                        <span>1 week</span>
                                        <span>2 weeks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/5 flex justify-end">
                                <div className="bg-blue-600 text-white py-1 px-3 rounded-lg text-center min-w-[80px]">
                                    <p className="font-medium">{duration} {duration === '1' ? 'Day' : 'Days'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Budget Field */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <label htmlFor="budget" className="text-gray-700 font-medium md:w-1/5">
                                Budget
                            </label>
                            <div className="flex-1">
                                <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                                    <input
                                        type="range"
                                        name="budget"
                                        id="budget"
                                        className="appearance-none w-full h-2 bg-blue-200 rounded-full accent-blue-600"
                                        min="500"
                                        max="10000"
                                        value={priceValue}
                                        step="500"
                                        onChange={(e) => setPriceValue(e.target.value)}
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>$500</span>
                                        <span>$10000</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/5 flex justify-end">
                                <div className="bg-blue-600 text-white py-1 px-3 rounded-lg text-center min-w-[80px]">
                                    <p className="font-medium">{priceValue} HKD</p>
                                </div>
                            </div>
                        </div>

                        {/* Activities Field */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <label htmlFor="activity" className="text-gray-700 font-medium md:w-1/5 pt-2">
                                Activities
                            </label>
                            <div className="flex-1">
                                <textarea
                                    rows="3"
                                    name="activity"
                                    id="activity"
                                    value={activities}
                                    onChange={(e) => setActivities(e.target.value)}
                                    placeholder="What would you like to do? e.g., Hiking, Museums, Local Food, Shopping"
                                    className="w-full bg-blue-50/50 border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`${
                                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center shadow-md`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate Recommendations
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Recommendation Section */}
                <div className="bg-blue-50/70 p-6 border-t border-blue-100">
                    <h2 className="text-blue-800 font-semibold text-xl mb-3">
                        Your Travel Recommendations
                    </h2>
                    <div className="bg-white p-5 rounded-lg border border-blue-200 shadow-sm">
                        <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                            {recommendation}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommend;