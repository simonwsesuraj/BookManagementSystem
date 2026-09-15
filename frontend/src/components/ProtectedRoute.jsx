import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./spiner";

export default function ProtectedRoute({ children }) {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <Spinner />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location, message: "நூல் தகவல் திருத்த நீங்கள் உள்நுழைய வேண்டும்." }} replace />;
    }

    return children;
}
