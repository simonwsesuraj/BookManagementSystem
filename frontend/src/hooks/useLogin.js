import { useState } from "react";
import { loginUser } from "../services/loginServices";

const useLogin = () =>{
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");
    const login = async(phone_number,password,rememberMe)=>{
        setLoading(true);
        setError("");
        try{
            const data = await loginUser(
                phone_number,password
            )
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem("access_token",data.access)
            storage.setItem("refresh_token",data.refresh)
            storage.setItem("user",JSON.stringify(data.user))

            return data
        }
        catch(err){
            const message =
                err.response?.data?.message ||
                "உள்நுழைவு தோல்வியடைந்தது";

            setError(message);

            return null;
        }
        finally{
            setLoading(false)
        }
    }

    return{
        login,loading,error
    }

}


export default useLogin