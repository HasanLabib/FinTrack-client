import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import AddMoneyForm from "../FormComponent/AddMoneyForm";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const IncomeDetailCard = ({
  incomeItem,
  handleDelete,
  handleEdit,
  setmoneyModified,
  onIncomeUpdated,
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
    let amountAdd = parseFloat(e.target.amount.value);
    let newBalance = parseFloat(incomeItem.amount) + amountAdd;
    if (onIncomeUpdated) {
      onIncomeUpdated({ _id: incomeItem._id, amount: newBalance });
    }
    const data = {
      id: incomeItem._id,
      amount: newBalance,
      updatedAt: new Date(),
    };

    try {
      const res = await axios.patch("/patch-amount", data);
      if (res?.data?.modifiedCount > 0) {
        await axios.post("/transaction", {
          targetID:incomeItem._id,
          source: incomeItem.source,
          amount: amountAdd,
          type: "Income",
          category: incomeItem.category,
          date: new Date().toISOString().split("T")[0],
          note: "Added money",
        });

        setmoneyModified(true);
        setModalOpen(false);
      } else {
        if (onIncomeUpdated) {
          onIncomeUpdated({ _id: incomeItem._id, amount: incomeItem.amount });
        }
      }
    } catch (err) {
      toast.error(err);
      if (onIncomeUpdated) {
        onIncomeUpdated({ _id: incomeItem._id, amount: incomeItem.amount });
      }
    } finally {
      setButtonText("Submit");
      setIsDisabled(false);
    }
  };
  if (!incomeItem) return null;
  return (
    <div className="w-full max-w-md bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {incomeItem.source}
          </h2>
          <p className="text-xs text-gray-500">{incomeItem.category}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleEdit(incomeItem)}
          >
            <CiEdit className="text-lg text-blue-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleDelete(incomeItem)}
          >
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm text-gray-500">Amount</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          ${parseFloat(incomeItem.amount || 0).toFixed(2)}
        </p>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          <p className="text-xs uppercase text-gray-400">Date</p>
          <p>{incomeItem.date}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-gray-400">Note</p>
          <p className="truncate max-w-30">{incomeItem.note || "N/A"}</p>
        </div>
      </div>

      <div>
        <button
          className="text-white hover:text-slate-300 mt-2 bg-gray-400 py-2 px-4 rounded-xl "
          onClick={() => setModalOpen(true)}
        >
          Add Money
        </button>
      </div>
      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <AddMoneyForm
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

export default IncomeDetailCard;
