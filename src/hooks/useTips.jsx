import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTips = () => {
  const axiosSecure = useAxiosSecure();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
      .get("/tips")
      .then((res) => {
        setTips(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { tips, loading };
};

export default useTips;
