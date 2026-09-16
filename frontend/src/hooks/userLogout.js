import { useState } from "react";
import { logoutUser } from "../services/loginServices";

const userLogout = () =>{
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    

    const logout = async () => {
    setLoading(true);
    setError("");

    const refresh_token = localStorage.getItem("refresh_token");

    // console.log("Refresh Token:", refresh_token);

    try {
        if (refresh_token) {
            await logoutUser(refresh_token);
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        sessionStorage.removeItem("user");

        return true;
    }

    catch (err) {
        // console.log("Logout Status:", err.response?.status);
        // console.log("Logout Response:", err.response?.data);

        const message =
            err.response?.data?.message ||
            "வெளியேறுதல் தோல்வியடைந்தது";

        setError(message);

        return false;
    }

    finally {
        setLoading(false);
    }
};

    return{
        logout,error,loading
    }
}

export default userLogout