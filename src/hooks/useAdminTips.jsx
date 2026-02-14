import { useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useAdminTips = () => {
  const axiosSecure = useAxiosSecure();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/admin/tips");
      setTips(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tips:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const addTip = async (tipData) => {
    const res = await axiosSecure.post("/admin/tips", tipData);
    const created = res.data;
    if (created && created._id) {
      setTips([created, ...tips]);
    } else {
      await fetchTips();
    }
    return created;
  };

  const updateTip = async (id, tipData) => {
    const res = await axiosSecure.put(`/admin/tips/${id}`, tipData);
    const updated = res.data;
    if (updated && updated._id) {
      setTips(tips.map((t) => (t._id === id ? updated : t)));
    } else {
      setTips(tips.map((t) => (t._id === id ? { ...t, ...tipData } : t)));
    }
  };

  const deleteTip = async (id) => {
    await axiosSecure.delete(`/admin/tips/${id}`);
    setTips(tips.filter((t) => t._id !== id));
  };

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
