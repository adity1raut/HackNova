import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthService from "../../utils/AuthService";
import logo from "../../assets/logo.jpg";

const FacultyNavbar = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState("/");

    useEffect(() => {
        setActiveRoute(location.pathname);
        // Close mobile menu when route changes
        setMenuOpen(false);
    }, [location]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuOpen]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        navigate("/login");
        window.dispatchEvent(new Event("authChange"));
    };

    const NavButton = ({ path, children, className = "", isLogout = false }) => {
        const isActive = activeRoute === path;
        const baseClasses = "font-medium transition-all duration-300 relative w-full md:w-auto";
        const defaultClasses = `${baseClasses} ${className} ${isActive
                ? "text-blue-600"
                : isLogout
                    ? "text-red-500 hover:text-red-700"
                    : "text-gray-700 hover:text-blue-500"
            }`;

        return (
            <button
                onClick={() => isLogout ? handleLogout() : handleNavigation(path)}
                className={`${defaultClasses} group px-4 py-2 rounded-lg hover:bg-gray-100/50`}
            >
                {children}
                <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-green-500 transform transition-all duration-300 
                    ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                />
            </button>
        );
    };

    return (
        <div className="fixed top-0 z-50 w-full bg-gradient-to-r  to-blue-600 to-blue-600 shadow-lg">
            <nav className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div class="flex flex-shrink-0 items-center">
                        <button
                            onClick={() => handleNavigation("/")}
                            class="transition-transform duration-300 transform hover:scale-105"
                        >
                            <img src={logo} alt="Logo" class="h-10 w-auto" />
                        </button>
                        <h1 class="text-2xl ml-4 font-bold">Hamane Kiya College</h1>

                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {!isAuthenticated ? (
                            <>
                                {/* <NavButton path="/">Dashboard</NavButton> */}
                                <NavButton path="/login">Login</NavButton>
                                <NavButton path="/signin">Signup</NavButton>
                                <NavButton path="/forgot-password">Forgot Password</NavButton>
                            </>
                        ) : (
                            <>
                                <NavButton path="/dashboard">Home</NavButton>
                                <NavButton path="/faculty/profile">Profile</NavButton>
                                <NavButton path="/election">Election</NavButton>
                                <NavButton path="/bookings">Booking</NavButton>
                                <NavButton path="/logout" isLogout={true}>Logout</NavButton>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden menu-button p-2 rounded-lg hover:bg-gray-100/50 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <div className="w-6 h-6 relative transform transition-all duration-300">
                            <span className={`absolute h-0.5 w-full bg-gray-600 transform transition-all duration-300 
                                ${menuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-1'}`} />
                            <span className={`absolute h-0.5 w-full bg-gray-600 transform transition-all duration-300 
                                ${menuOpen ? 'opacity-0' : 'translate-y-3'}`} />
                            <span className={`absolute h-0.5 w-full bg-gray-600 transform transition-all duration-300 
                                ${menuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-5'}`} />
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="py-2 space-y-1 px-2">
                        {!isAuthenticated ? (
                            <>
                                {/* <NavButton path="/">Dashboard</NavButton> */}
                                <NavButton path="/login">Login</NavButton>
                                <NavButton path="/signin">Signup</NavButton>
                                <NavButton path="/forgot-password">Forgot Password</NavButton>
                            </>
                        ) : (
                            <>
                                <NavButton path="/dashboard">Home</NavButton>
                                <NavButton path="/faculty/profile">Profile</NavButton>
                                <NavButton path="/election">Election</NavButton>
                                <NavButton path="/bookings">Booking</NavButton>
                                <NavButton path="/logout" isLogout={true}>Logout</NavButton>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default FacultyNavbar;