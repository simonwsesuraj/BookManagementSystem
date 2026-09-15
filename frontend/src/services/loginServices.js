import { apiAccounts } from "../api/api";
export const loginUser = async(phone_number,password)=>{
    const response = await apiAccounts.post(
        "login/",
    {
        phone_number:phone_number,
        password:password
    });
    return response.data;

}

export const logoutUser = async(refresh_token)=>{
    const response = await apiAccounts.post(
        "logout/",
        {
            refresh_token
        }
    )
    return response.data;
}