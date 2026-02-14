import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useAdminAnalytics = (year = new Date().getFullYear()) => {
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get(`/admin/analytics?year=${year}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load analytics data. Please check your connection and try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year, axiosSecure]);

  return { ...data, isLoading, error };
};

export default useAdminAnalytics;
