import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";

const useTransactionHook = () => {
  const axios = useAxiosSecure();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const res = await axios.get("/transaction", {
          params: {
            page,
            search,
            category,
            type,
            sortField,
            sortOrder,
          },
        });

        setTransactions(res.data.transactions);
        setTotalPage(res.data.totalPages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [axios, page, search, category, type, sortField, sortOrder]);

  const deleteTransaction = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/delete-transaction/${id}`);

        setTransactions((prev) => prev.filter((trans) => trans._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Transaction has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete transaction.",
          icon: "error",
        });
      }
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const res = await axios.put(`/update-transaction/${id}`, updatedData);
      setTransactions((prev) =>
        prev.map((trans) => (trans._id === id ? res.data : trans)),
      );
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    transactions,
    loading,
    error,
    page,
    setPage,
    totalPage,
    search,
    setSearch,
    category,
    setCategory,
    type,
    setType,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    deleteTransaction,
    updateTransaction,
  };
};

export default useTransactionHook;
