import { useEffect, useState, useCallback } from "react";
import { bookList } from "../services/bookServices";

function useBooks(initialParams = {}) {
    const [books, setBooks] = useState([]);
    const [count, setCount] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchBooks = useCallback(async (paramsToFetch) => {
        setLoading(true);
        setError("");

        try {
            const query = paramsToFetch !== undefined ? paramsToFetch : initialParams;
            const cleanParams = {};
            Object.entries(query || {}).forEach(([key, val]) => {
                if (val !== undefined && val !== null && val !== "" && val !== "ALL") {
                    cleanParams[key] = val;
                }
            });

            const data = await bookList(cleanParams);
            setBooks(data.data || []);
            setCount(data.count ?? (data.data ? data.data.length : 0));
        } catch (err) {
            console.error("Error fetching books:", err);
            setError(err.response?.data?.message || "புத்தகங்களை ஏற்றுவதில் தோல்வி ஏற்பட்டது");
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(initialParams)]);

    useEffect(() => {
        fetchBooks(initialParams);
    }, [fetchBooks]);

    return {
        books,
        count,
        error,
        loading,
        refetch: fetchBooks,
        setBooks
    };
}

export default useBooks;