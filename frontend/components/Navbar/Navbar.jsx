import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <div className="Container py-3 sm:py-0 shadow-md">
                <div className="flex items-center">
                    {/* Left Box: Navigation Section */}
                    <div className="flex-grow flex justify-end mr-[5%]">
                        <ul className="flex items-center gap-6">
                            {/* navigation links */}
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
                                    to="/airec"
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

                    {/* Right Box: Profile Section */}
                    <div className="flex items-center justify-center w-16">
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `block py-3 px-4 rounded-lg hover:shadow-lg ${
                                    isActive ? "text-blue-800 font-medium" : "text-gray-700 hover:text-blue-500"
                                }`
                            }
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
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
                                    ></path>
                                </svg>
                            </div>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;