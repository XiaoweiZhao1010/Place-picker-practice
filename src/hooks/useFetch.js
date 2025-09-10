import { useState, useEffect } from "react";

export default function useFetch(fetchFn, initialValue) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState(initialValue);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFn();
        setFetchedData(data);
      } catch (error) {
        setError({ message: error.message || "Something went wrong!" });
        setFetchedData([]);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [fetchFn]);
  return { isLoading, error, fetchedData, setFetchedData };
}
