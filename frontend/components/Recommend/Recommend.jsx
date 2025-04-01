import React from 'react';

const Recommend = () => {
    const [priceValue, setPriceValue] = React.useState(150);
    const [duration, setDuration] = React.useState(1);

  return (
    <div className="bg-black/20 h-full">
        <div className="h-full flex justify-center items-center p-40">
            <div className="container grid grid-cols-1 h-[950px] gap-4 opacity-93">
                <div
                    data-aos="fade-up"
                    data-aos-delay="600"
                    className="space-y-4 bg-white rounded-md p-4 relative"
                >
                    <div className="p-[5%] space-y-5">
                        <div className="text-black pb-10 pt-2 pl-5">
                            <p
                            data-aos="fade-up"
                            data-aos-delay="300"
                            className="font-semibold text-4xl"
                            >
                                AI Recommendation System
                            </p>
                        </div>

                        <div className="flex gap-3 items-center pl-5">
                            <div className="w-[15%]">
                                <label htmlFor="location" className="text-grey-100 font-medium text-xl opacity-80">
                                    Location
                                </label>
                            </div>
                            <div className="w-[30%]">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    placeholder="Bangkok"
                                    className="w-full bg-gray-100 my-2 range accent-red-300 focus:outline-pink-400 focus:outline outline-1 p-2 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 items-center pl-5">
                            <div className="w-[15%]">
                                <label htmlFor="duration" className="text-grey-100 font-medium text-xl opacity-80">
                                    Duration
                                </label>
                            </div>
                            <div className="w-[30%]">
                                <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
                                    <input
                                        type="range"
                                        name="duration"
                                        id="duration"
                                        className="appearance-none w-full h-2 bg-gray-300 rounded-full my-2 accent-red-800"
                                        min="1"
                                        max="15"
                                        value={duration}
                                        step="1"
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-[20%]">
                                <label htmlFor="duration" className="opacity-70 block">
                                    <div className="w-full flex justify-between items-center">
                                        <p className="font-semibold text-lg">{duration} Days</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center pl-5">
                            <div className="w-[15%]">
                                <label htmlFor="budget" className="text-grey-100 font-medium text-xl opacity-80">
                                    Budget
                                </label>
                            </div>
                            <div className="w-[30%]">
                                <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
                                    <input
                                        type="range"
                                        name="budget"
                                        id="budget"
                                        className="appearance-none w-full h-2 bg-gray-300 rounded-full my-2 accent-red-800"
                                        min="150"
                                        max="1000"
                                        value={priceValue}
                                        step="10"
                                        onChange={(e) => setPriceValue(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="w-[20%]">
                                <label htmlFor="budget" className="opacity-70 block">
                                    <div className="w-full flex justify-between items-center">
                                        <p className="font-semibold text-lg">{priceValue} Hkd</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 items-center pl-5">
                            <div className="w-[15%]">
                                <label htmlFor="activity" className="text-grey-100 font-medium text-xl opacity-80">
                                    Activities
                                </label>
                            </div>
                            <div className="w-[70%]">
                                <textarea
                                    rows="4"
                                    type="text"
                                    name="activity"
                                    id="activity"
                                    placeholder="Hiking, Sightseeing, Food"
                                    className="w-full bg-gray-100 my-2 range accent-red-300 focus:outline-pink-400 focus:outline outline-1 p-2 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="flex items-right">
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mt-5 ml-[80%]">
                                AI generate
                            </button>
                        </div>

                        <div className="pt-5 pl-5 text-grey-100 font-medium text-xl opacity-80">
                            Recommendation
                        </div>
                        <div className="pl-5 pt-2 text-grey-100 font-small text-base opacity-80">
                            Dont come here, go away
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Recommend;