import React, { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useIncomeHook = () => {
  const [allIncome, setAllIncome] = useState([]);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const axios = useAxiosSecure();

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        setIncomeLoading(true);
        const res = await axios.get(`/income?page=${page}`);
        setAllIncome(res.data.income);
        setTotalPage(res.data.totalPages);
      } catch (err) {
        setIncomeError(err);
      } finally {
        setIncomeLoading(false);
      }
    };
    fetchIncome();
  }, [axios, page]);

  return {
    allIncome,
    setAllIncome,
    incomeLoading,
    setIncomeLoading,
    incomeError,
    setIncomeError,
    page,
    setPage,
    totalPage,
    setTotalPage,
  };
};

export default useIncomeHook;
