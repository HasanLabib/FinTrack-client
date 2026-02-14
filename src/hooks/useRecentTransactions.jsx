// hooks/useRecentTransactions.js
import { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure"; // assuming you already have this

const useRecentTransactions = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentTransactionsLoading, setRecentTransactionsLoading] =
    useState(true);
  const [recentTransactionserror, setRecentTransactionsError] = useState(null);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setRecentTransactionsLoading(true);
        setRecentTransactionsError(null);

        const res = await axiosSecure.get("/recent-transactions");
        const recentTransactions = res.data;
        setRecentTransactions(recentTransactions);
      } catch (err) {
        console.error("Failed to fetch recent transactions:", err);
        setRecentTransactionsError(
          err?.response?.data?.error || "Failed to load recent transactions",
        );
        setRecentTransactions([]);
      } finally {
        setRecentTransactionsLoading(false);
      }
    };

    fetchRecentTransactions();
  }, [axiosSecure]);

  return {
    recentTransactions,
    setRecentTransactions,
    recentTransactionsLoading,
    recentTransactionserror,
  };
};

export default useRecentTransactions;
