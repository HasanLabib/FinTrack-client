import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useAdminAnalytics = (year = new Date().getFullYear()) => {
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axiosSecure.get(`/admin/analytics?year=${year}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [year]);

  return { ...data, isLoading };
};

export default useAdminAnalytics;