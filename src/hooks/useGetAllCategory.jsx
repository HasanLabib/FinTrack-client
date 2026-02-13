import React, { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useGetAllCategory = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const axios = useAxiosSecure();
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setCategoryLoading(true);
        const result = await axios.get(`/all-category`);
        setAllCategory(result.data);
      } catch (err) {
        setCategoryError(err);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategory();
  }, [axios, page]);
  return {
    allCategory,
    setAllCategory,
    categoryLoading,
    setCategoryLoading,
    categoryError,
    setCategoryError,
    page,
    setPage,
    totalPage,
    setTotalPage,
  };
};

export default useGetAllCategory;
