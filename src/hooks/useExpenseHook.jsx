import React, { useState, useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";


const useExpenseHook = () => {
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const axios = useAxiosSecure();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setExpenseLoading(true);
        const res = await axios.get(`/expense?page=${page}`);
        setAllExpenses(res.data.expenses);
        setTotalPage(res.data.totalPages);
      } catch (err) {
        setExpenseError(err);
      } finally {
        setExpenseLoading(false);
      }
    };
    fetchExpenses();
  }, [axios, page]);

  return {
    allExpenses,
    setAllExpenses,
    expenseLoading,
    setExpenseLoading,
    expenseError,
    setExpenseError,
    page,
    setPage,
    totalPage,
    setTotalPage,
  };
};

export default useExpenseHook;
