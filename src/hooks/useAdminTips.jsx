import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useAdminTips = () => {
  const axiosSecure = useAxiosSecure();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/tips");
      setTips(res.data);
    } catch (err) {
      console.error("Failed to fetch tips:", err);
    }
    setLoading(false);
  };
  const addTip = async (tipData) => {
    const res = await axiosSecure.post("/admin/tips", tipData);
    setTips([res.data, ...tips]); 
    return res.data;
  };

  const updateTip = async (id, tipData) => {
    await axiosSecure.put(`/admin/tips/${id}`, tipData);
    setTips(tips.map((tip) => (tip._id === id ? { ...tip, ...tipData } : tip)));
  };

  const deleteTip = async (id) => {
    if (!window.confirm("Delete this tip permanently?")) return;
    await axiosSecure.delete(`/admin/tips/${id}`);
    setTips(tips.filter((tip) => tip._id !== id));
  };

  useEffect(() => {
    fetchTips();
  }, []);

  return {
    tips,
    loading,
    fetchTips,
    addTip,
    updateTip,
    deleteTip,
  };
};

export default useAdminTips;