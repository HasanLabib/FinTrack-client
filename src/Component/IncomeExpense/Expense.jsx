import React, { useEffect, useState } from "react";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useExpenseHook from "../../hooks/useExpenseHook";
import useGetAllCategory from "../../hooks/useGetAllCategory";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaginationComp from "../PaginationComp";
import IncomeExpenseForm from "../FormComponent/IncomeExpenseForm";
import ExpenseDetailCard from "../Card/ExpenseDetailCard";

const Expense = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [moneyModified, setMoneyModified] = useState(false);

  const {
    allExpenses,
    setAllExpenses,
    expenseLoading,
    expenseError,
    page,
    setPage,
    totalPage,
  } = useExpenseHook();
  const { allCategory, categoryLoading } = useGetAllCategory();

  const axios = useAxiosSecure();

  const handleEdit = (expenseItem) => {
    setEditingExpense(expenseItem);
    setModalOpen(true);
  };

  const handleDelete = async (expenseItem) => {
    try {
      const resDelete = await axios.delete(
        `/delete-expense/${expenseItem._id}`,
      );
      if (resDelete.data?.deletedCount > 0) {
        setAllExpenses(
          allExpenses.filter((item) => item._id !== expenseItem._id),
        );
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting...");
    setIsDisabled(true);

    const form = e.target;
    const expenseData = {
      source: form.source.value,
      amount: parseFloat(form.amount.value),
      type: form.type.value,
      category: form.category.value,
      date: form.date.value,
      note: form.note.value || "",
    };

    if (editingExpense) {
      try {
        const resEdit = await axios.put(
          `/update-expense/${editingExpense._id}`,
          expenseData,
        );

        if (resEdit.data?.modifiedCount > 0) {
          setAllExpenses((prev) =>
            prev.map((item) =>
              item._id === editingExpense._id
                ? { ...item, ...expenseData }
                : item,
            ),
          );
          setModalOpen(false);
        }
        setEditingExpense(null);
      } catch (err) {
        console.error("Edit error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    } else {
      try {
        const res = await axios.post("/expense", expenseData);
        if (res.data?.insertedId) {
          setAllExpenses((prev) => [
            ...prev,
            { _id: res.data.insertedId, ...expenseData },
          ]);
          setModalOpen(false);

          await axios.post("/transaction", expenseData);
        }
      } catch (err) {
        console.error("Add expense error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    }

    form.reset();
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      const res = await axios.get(`/expense?page=${page}`);
      setAllExpenses(res.data.expenses);
    };
    fetchExpenses();
  }, [axios, moneyModified, page]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] w-full mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#201F24] font-bold text-3xl">Expenses</h1>
        <button
          className="btn bg-[#201F24] max-w-32 min-h-13.25 w-full p-4 rounded-xl text-white"
          onClick={() => {
            setEditingExpense(null);
            setModalOpen(true);
          }}
        >
          +Add Expense
        </button>
      </div>

      <div className="grow">
        {expenseLoading && !allCategory && <p>Loading...</p>}

        <div className="flex flex-wrap gap-4">
          {allExpenses.map((expenseItem) => (
            <ExpenseDetailCard
              key={expenseItem._id}
              expenseItem={expenseItem}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setMoneyModified={setMoneyModified}
              onExpenseUpdated={(updatedItem) => {
                setAllExpenses((prev) =>
                  prev.map((item) =>
                    item._id === updatedItem._id
                      ? { ...item, ...updatedItem }
                      : item,
                  ),
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className="py-6 mt-auto">
        <PaginationComp countPage={totalPage} page={page} setPage={setPage} />
      </div>

      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <IncomeExpenseForm
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              editingIncome={editingExpense}
              allCategory={allCategory}
              isDisable={isDisable}
              buttonText={buttonText}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Expense;
