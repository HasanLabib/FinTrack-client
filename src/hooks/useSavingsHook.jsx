import React, { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useSavingsHook = () => {
  const [allSavings, setAllSavings] = useState([]);
  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsError, setSavingsError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  
  const axios = useAxiosSecure();

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        setSavingsLoading(true);
        const res = await axios.get(`/savings?page=${page}`);
        setAllSavings(res.data.savings);
        setTotalPage(res.data.totalPages);
      } catch (err) {
        setSavingsError(err);
      } finally {
        setSavingsLoading(false);
      }
    };

    fetchSavings();
  }, [axios, page]);

  return {
    allSavings,
    setAllSavings,
    savingsLoading,
    setSavingsLoading,
    savingsError,
    setSavingsError,
    page,
    setPage,
    totalPage,
    setTotalPage,
  };
};

export default useSavingsHook;