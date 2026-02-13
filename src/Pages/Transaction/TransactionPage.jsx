import React, { useEffect, useState } from "react";
import useTransactionHook from "../../hooks/useTransactionHook";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import EditTransactionForm from "../../Component/FormComponent/EditTransactionForm";
import useGetAllCategory from "../../hooks/useGetAllCategory";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const TransactionPage = () => {
  const {
    transactions,
    loading,
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
  } = useTransactionHook();

  const { allCategory, categoryLoading } = useGetAllCategory();

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      setSearch(localSearch);
      setPage(1);
    }, 500);

    return () => clearTimeout(handleSearch);
  }, [localSearch, setSearch, setPage]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by source or note..."
          className="input input-bordered"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />

        <select
          className="select select-bordered"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {allCategory.map((cat) => (
            <option key={cat._id} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          className="select select-bordered"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        <select
          className="select select-bordered"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Source</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((trans, idx) => (
              <tr key={trans._id}>
                <td>{idx + 1}</td>
                <td>{trans.source}</td>
                <td>{trans.amount}</td>
                <td>{trans.type}</td>
                <td>{trans.category}</td>
                <td>
                  {trans.date
                    ? new Date(trans.date).toISOString().split("T")[0]
                    : new Date(trans.createdAt).toISOString().split("T")[0]}
                </td>
                <td>{trans.note}</td>

                {/* <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(trans)}
                    className="btn btn-xs btn-warning"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTransaction(trans._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td> */}

                <td className="flex gap-2">
                  <button
                    className="btn btn-xs btn-circle btn-outline btn-info"
                    onClick={() => handleEdit(trans)}
                  >
                    <CiEdit className="text-xl" />
                  </button>
                  <button
                    className="btn btn-xs btn-circle btn-outline btn-error"
                    onClick={() => deleteTransaction(trans._id)}
                  >
                    <MdDelete className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Stack spacing={2} alignItems="center" className="mt-6">
        <Pagination
          count={totalPage}
          page={page}
          onChange={(e, value) => setPage(value)}
          variant="outlined"
          color="primary"
        />
      </Stack>

      {modalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white">
            <EditTransactionForm
              transaction={selectedTransaction}
              setModalOpen={setModalOpen}
              updateTransaction={updateTransaction}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default TransactionPage;
