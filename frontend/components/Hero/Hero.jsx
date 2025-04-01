import React from 'react';

const Hero = () => {
  const [priceValue, setPriceValue] = React.useState(150);

  return (
    <div className="bg-black/30 h-full">
      <div className="h-full flex justify-center items-center p-4">
        <div className="container grid grid-cols-1 gap-4">
          {/* text content section */}
          <div className="text-white">
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="font-bold text-3xl"
            >
              Search Your Trip
            </p>
          </div>

          {/* form section */}
          <div
            data-aos="fade-up"
            data-aos-delay="600"
            className="space-y-4 bg-white rounded-md p-4 relative"
          >
            <div className="flex gap-4 py-3 px-5">
              <div className="w-[31%]">
                <label htmlFor="destination" className="opacity-70">
                  Search your Trip
                </label>
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  placeholder="Bangkok"
                  className="w-full bg-gray-100 my-2 range accent-red-500 focus:outline-red-500 focus:outline outline-1 rounded-full p-2"
                />
              </div>

              <div className="w-[23%]">
                <label htmlFor="destination" className="opacity-70">
                  From
                </label>
                <input
                  type="Date"
                  name="destination"
                  id="destination"
                  className="w-full !placeholder-slate-400 bg-gray-100 my-2 rounded-full focus:outline-red-500 focus:outline outline-1 p-2"
                />
              </div>
              <div className="w-[23%]">
                <label htmlFor="destination" className="opacity-70">
                  To
                </label>
                <input
                  type="Date"
                  name="destination"
                  id="destination"
                  className="w-full !placeholder-slate-400 bg-gray-100 my-2 rounded-full focus:outline-red-500 focus:outline outline-1 p-2"
                />
              </div>

              <div className="w-[23%]">
                <label htmlFor="destination" className="opacity-70 block">
                  <div className="w-full flex justify-between items-center">
                    <p className="font-bold text-xl">{priceValue} Hkd</p>
                  </div>
                </label>
                <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
                  <input
                    type="range"
                    name="destination"
                    id="destination"
                    className="appearance-none w-full h-2 bg-gray-300 rounded-full my-2 accent-red-800"
                    min="150"
                    max="1000"
                    value={priceValue}
                    step="10"
                    onChange={(e) => setPriceValue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* button search */}
            <div className="flex justify-center">
                <button className="text-black text-center bg-orange-300 px-4 py-2 rounded-full hover:scale-105 transition duration-300">
                    Search
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;