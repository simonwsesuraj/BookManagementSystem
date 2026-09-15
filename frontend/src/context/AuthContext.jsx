import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/loginServices";
import { apiAccounts } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    const [accessToken, setAccessToken] = useState(() => {
        return (
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token") ||
            null
        );
    });

    const [isLoggedIn, setIsLoggedIn] = useState(!!accessToken);
    const [loading, setLoading] = useState(true);

    // Verify token on initial load
    useEffect(() => {
        const verifyToken = async () => {
            const token =
                localStorage.getItem("access_token") ||
                sessionStorage.getItem("access_token");

            if (!token) {
                setIsLoggedIn(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await apiAccounts.get("me/", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data?.user) {
                    setUser(response.data.user);
                    setIsLoggedIn(true);
                }
            } catch (err) {
                // If token expired or invalid, clear storage
                if (err.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("access_token");
                    sessionStorage.removeItem("refresh_token");
                    sessionStorage.removeItem("user");
                    setUser(null);
                    setAccessToken(null);
                    setIsLoggedIn(false);
                }
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (phoneNumber, password, rememberMe = true) => {
        const data = await loginUser(phoneNumber, password);
        if (data && data.access) {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem("access_token", data.access);
            storage.setItem("refresh_token", data.refresh);
            storage.setItem("user", JSON.stringify(data.user));

            setAccessToken(data.access);
            setUser(data.user);
            setIsLoggedIn(true);
            return data;
        }
        return null;
    };

    const logout = async () => {
        const refreshToken =
            localStorage.getItem("refresh_token") ||
            sessionStorage.getItem("refresh_token");

        try {
            if (refreshToken) {
                await logoutUser(refreshToken);
            }
        } catch (error) {
            console.warn("Logout request failed, continuing local clear:", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            sessionStorage.removeItem("user");

            setAccessToken(null);
            setUser(null);
            setIsLoggedIn(false);
        }
        return true;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isLoggedIn,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
