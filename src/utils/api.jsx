import { useState, useEffect } from "react";

const API_BASE = "https://692376893ad095fb84709f35.mockapi.io/";

export function useFetchEntity(entity) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/${entity}`);
        if (!res.ok) throw new Error(`Failed to fetch ${entity}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [entity]);

  return { data, setData, loading, error };
}

export async function addEntity(entity, payload) {
  const res = await fetch(`${API_BASE}/${entity}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to add ${entity}`);
  return await res.json();
}

export async function updateEntity(entity, id, payload) {
  const res = await fetch(`${API_BASE}/${entity}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update ${entity}`);
  return await res.json();
}

export async function deleteEntity(entity, id) {
  const res = await fetch(`${API_BASE}/${entity}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete ${entity}`);
  return true;
}
