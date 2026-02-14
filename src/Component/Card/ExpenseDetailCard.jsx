import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import DeductMoneyForm from "../FormComponent/DeductMoneyForm";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ExpenseDetailCard = ({
  expenseItem,
  handleDelete,
  handleEdit,
  setMoneyModified,
  onExpenseUpdated,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const axios = useAxiosSecure();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting....!");
    setIsDisabled(true);
    let amountDeduct = parseFloat(e.target.amount.value);
    let newBalance = parseFloat(expenseItem.amount) + amountDeduct;
    if (onExpenseUpdated) {
      onExpenseUpdated({ _id: expenseItem._id, amount: newBalance });
    }
    const data = {
      id: expenseItem._id,
      amount: newBalance,
      updatedAt: new Date(),
    };

    try {
      const res = await axios.patch("/patch-expense-amount", data);
      if (res?.data?.modifiedCount > 0) {
        await axios.post("/transaction", {
          targetID: expenseItem._id,
          source: expenseItem.source,
          amount: amountDeduct,
          type: "Expense",
          category: expenseItem.category,
          date: new Date().toISOString().split("T")[0],
          note: "Deducted money",
        });

        setMoneyModified(true);
        setModalOpen(false);
      } else {
        if (onExpenseUpdated) {
          onExpenseUpdated({
            _id: expenseItem._id,
            amount: expenseItem.amount,
          });
        }
      }
    } catch (err) {
      console.error(err);
      if (onExpenseUpdated) {
        onExpenseUpdated({ _id: expenseItem._id, amount: expenseItem.amount });
      }
    } finally {
      setButtonText("Submit");
      setIsDisabled(false);
    }
  };

  if (!expenseItem) return null;

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {expenseItem.source}
          </h2>
          <p className="text-xs text-gray-500">{expenseItem.category}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleEdit(expenseItem)}
          >
            <CiEdit className="text-lg text-blue-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleDelete(expenseItem)}
          >
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm text-gray-500">Amount</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ${parseFloat(expenseItem.amount || 0).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          <p className="text-xs uppercase text-gray-400">Date</p>
          <p>{expenseItem.date}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-gray-400">Note</p>
          <p className="truncate max-w-30">{expenseItem.note || "N/A"}</p>
        </div>
      </div>

      <div>
        <button
          className="text-white hover:text-slate-300 mt-2 bg-gray-400 py-2 px-4 rounded-xl"
          onClick={() => setModalOpen(true)}
        >
          Deduct Money
        </button>
      </div>
      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <DeductMoneyForm
              setModalOpen={setModalOpen}
              handleSubmit={handleSubmit}
              isDisable={isDisable}
              buttonText={buttonText}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ExpenseDetailCard;
