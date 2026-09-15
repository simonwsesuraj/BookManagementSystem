import { useState,useEffect } from "react";
import { bookDetails } from "../services/bookServices";
function useBookDetails(bookId){
    const [book,setBook] = useState(null);
    const [loading,setloading] = useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
        const fetchBookDetails = async()=>{
            try{
                const data = await bookDetails(bookId)
                setBook(data.data);
            }
            catch(err){
                setError(err)
            }
            finally{
                setloading(false);
            }
        }
        if(bookId){
            fetchBookDetails();
        }
    },[bookId]);

    return{
        book,
        loading,
        error
    }
}

export default useBookDetails;