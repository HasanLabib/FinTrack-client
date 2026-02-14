import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure"; // Reuse secure axios if needed, but /tips is public
import toast from "react-hot-toast";
const useTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axios = useAxiosSecure();
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get("/tips");
        console.log(res);
        setTips(res.data);
      } catch (err) {
        toast.error(err);
        setError("Failed to load tips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, [axios]);

  return { tips, loading, error };
};

export default useTips;
