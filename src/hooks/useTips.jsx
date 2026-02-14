import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure"; // Reuse secure axios if needed, but /tips is public
const useTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxiosSecure();
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios("/tips");
        if (!response.ok) throw new Error("Failed to fetch tips");
        const data = await response.json();
        setTips(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);

  return { tips, loading, error };
};

export default useTips;
