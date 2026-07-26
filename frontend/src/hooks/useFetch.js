import { useState, useEffect } from 'react';

// Generic data-fetching hook — takes an async function (an API service call)
// and manages loading/error/data state consistently across every page.
const useFetch = (fetchFn, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchFn();
                if (isMounted) setData(response.data.data);
            } catch (err) {
                if (isMounted) setError(err.response?.data?.message || 'Something went wrong');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();

        // Prevents a "setState on unmounted component" warning if the user
        // navigates away before the request finishes
        return () => { isMounted = false; };
    }, deps);

    return { data, loading, error };
};

export default useFetch;