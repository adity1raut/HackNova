// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../utils/AuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
    const [user, setUser] = useState(AuthService.getUserDetails());

    useEffect(() => {
        const handleAuthChange = () => {
            setIsAuthenticated(AuthService.isAuthenticated());
            setUser(AuthService.getUserDetails());
        };

        window.addEventListener("authChange", handleAuthChange);
        return () => window.removeEventListener("authChange", handleAuthChange);
    }, []);

    const loginStudent = async (email, rollno, password) => {
        const success = await AuthService.login(email, rollno, password);
        if (success) {
            setIsAuthenticated(true);
            setUser(AuthService.getUserDetails());
        }
        return success;
    };

    const loginFaculty = async (email, type, password) => {
        const success = await AuthService.facultylogin(email, type, password);
        if (success) {
            setIsAuthenticated(true);
            setUser(AuthService.getUserDetails());
        }
        return success;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            loginStudent,
            loginFaculty,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
