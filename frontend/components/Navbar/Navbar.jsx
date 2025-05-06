import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PostTrip from "../Trips/PostTrip";

function Navigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLogin, setLoginState] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="Container py-3 sm:py-0 shadow-md">
        <div className="flex items-center">
            {/* Left Box: Navigation Section */}
            <div className="flex-grow flex justify-end mr-[5%]">
                <ul className="flex items-center gap-6">
                    {/* Navigation Links */}
                    <li className="my-1">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="my-1">
                        <NavLink
                            to="/browse"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Browse
                        </NavLink>
                    </li>
                    <li className="my-1">
                        <NavLink
                            to="/AIrecommendation"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            AI Recommendation
                        </NavLink>
                    </li>
                    <li className="my-1">
                        <NavLink
                            to="/mytrip"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            My Trip
                        </NavLink>
                    </li>
                    <li className="my-1">
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            About
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Right Box: Add section and Profile Section */}
            <div className="flex items-center justify-center space-x-4 mr-3">
                {/* Add Button */}
                <button
                    className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    onClick={handleOpenModal}
                    title="Create new trip"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    > 
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </button>

                {/* Profile Link */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                    `flex items-center justify-center h-10 w-10 rounded-full overflow-hidden hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                        isActive ? "ring-2 ring-blue-500 ring-offset-1" : "hover:ring-1 hover:ring-blue-300 hover:ring-offset-1"
                    }`
                    }
                    onClick={() => window.scrollTo(0, 0)}
                    title="Your profile"
                >
                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                        <svg
                            className="absolute w-12 h-12 text-gray-400 -left-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </NavLink>
                
                <NavLink
                            to="/LoginSignup"
                            className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                            }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            Login & Sign Up
                        </NavLink>

            </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseModal}>
            <div className="bg-white shadow-lg relative w-[80%] max-h-[90%] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <PostTrip onClose={handleCloseModal} />
            </div>
        </div>
        )}
    </div>
  );
}

export default Navigation;