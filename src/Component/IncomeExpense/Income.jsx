import React, { useEffect, useState } from "react";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useIncomeHook from "../../hooks/useIncomeHook";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaginationComp from "../PaginationComp";
import IncomeExpenseForm from "../FormComponent/IncomeExpenseForm";
import useGetAllCategory from "../../hooks/useGetAllCategory";
import IncomeDetailCard from "../Card/IncomeDetailCard";

const Income = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [moneyModified, setmoneyModified] = useState(false);

  const {
    allIncome,
    setAllIncome,
    incomeLoading,
    incomeError,
    page,
    setPage,
    totalPage,
  } = useIncomeHook();
  const { allCategory, categoryLoading } = useGetAllCategory();

  const axios = useAxiosSecure();

  const handleEdit = (incomeItem) => {
    setEditingIncome(incomeItem);
    setModalOpen(true);
  };

  const handleDelete = async (incomeItem) => {
    try {
      const resDelete = await axios.delete(`/delete-income/${incomeItem._id}`);
      if (resDelete.data?.deletedCount > 0) {
        setAllIncome(allIncome.filter((item) => item._id !== incomeItem._id));
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
    const incomeData = {
      source: form.source.value,
      amount: parseFloat(form.amount.value),
      type: form.type.value,
      category: form.category.value,
      date: form.date.value,
      note: form.note.value || "",
    };

    if (editingIncome) {
      try {
        const resEdit = await axios.put(
          `/update-income/${editingIncome._id}`,
          incomeData,
        );

        if (resEdit.data?.modifiedCount > 0) {
          setAllIncome((prev) =>
            prev.map((item) =>
              item._id === editingIncome._id
                ? { ...item, ...incomeData }
                : item,
            ),
          );
          setModalOpen(false);
        }
        setEditingIncome(null);
      } catch (err) {
        console.error("Edit error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    } else {
      try {
        const res = await axios.post("/income", incomeData);
        if (res.data?.insertedId) {
          setAllIncome((prev) => [
            ...prev,
            { _id: res.data.insertedId, ...incomeData },
          ]);
          setModalOpen(false);

          await axios.post("/transaction", incomeData);
        }
      } catch (err) {
        console.error("Add income error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    }

    form.reset();
  };

  useEffect(() => {
    const fetchIncome = async () => {
      const res = await axios.get(`/income?page=${page}`);
      setAllIncome(res.data.income);
    };
    fetchIncome();
  }, [axios, moneyModified, page]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] w-full mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#201F24] font-bold text-3xl">Income</h1>
        <button
          className="btn bg-[#201F24] max-w-32 min-h-13.25 w-full p-4 rounded-xl text-white"
          onClick={() => {
            setEditingIncome(null);
            setModalOpen(true);
          }}
        >
          +Add Income
        </button>
      </div>

      <div className="grow">
        {incomeLoading && !allCategory && <p>Loading...</p>}
        {/* {incomeError && <p className="text-red-500">Something went wrong</p>} */}

        <div className="flex flex-wrap gap-4">
          {allIncome.map((incomeItem) => (
            <IncomeDetailCard
              key={incomeItem._id}
              incomeItem={incomeItem}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              setmoneyModified={setmoneyModified}
              onIncomeUpdated={(updatedItem) => {
                setAllIncome((prev) =>
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
              editingIncome={editingIncome}
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

export default Income;
