import React from 'react';

const Recommend = () => {
    const [priceValue, setPriceValue] = React.useState(150);
    const [duration, setDuration] = React.useState(1);
    const [recommendation, setRecommendation] = React.useState("Your personalized travel recommendations will appear here after you submit your preferences.");

    const handleSubmit = () => {
        setRecommendation("Based on your preferences, we recommend exploring Tokyo's cultural districts like Asakusa and Shinjuku. Consider day trips to nearby Mt. Fuji for hiking. With your budget, you can enjoy local cuisine at izakayas and mid-range restaurants. Stay in central Tokyo for easy access to attractions.");
    };

    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl relative z-10">
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
                                    <p className="font-medium">{duration} {duration === 1 ? 'Day' : 'Days'}</p>
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
                                        min="150"
                                        max="1000"
                                        value={priceValue}
                                        step="10"
                                        onChange={(e) => setPriceValue(e.target.value)}
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>$150</span>
                                        <span>$500</span>
                                        <span>$1000</span>
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
                                    placeholder="What would you like to do? e.g., Hiking, Museums, Local Food, Shopping"
                                    className="w-full bg-blue-50/50 border border-blue-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-4">
                            <button 
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center shadow-md"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Recommendations
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
                        <p className="text-gray-700 leading-relaxed">
                            {recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommend;