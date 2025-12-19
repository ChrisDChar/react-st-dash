import { useState, useEffect } from 'react';

const BASE_URL = 'https://692376893ad095fb84709f35.mockapi.io';

export function useFetch(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${endpoint}`);
        }
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, setData, loading, error };
}
