import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import AddMoneyForm from "../FormComponent/AddMoneyForm";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SavingDetailCard = ({
  savingItem,
  handleDelete,
  handleEdit,
  setmoneyModified,
  moneyModified,
  onSavingUpdated,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState([]);
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const axios = useAxiosSecure();
  const { user } = useAuth();

  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const year = savingItem.date
        ? new Date(savingItem.date).getFullYear()
        : new Date().getFullYear();
      const res = await axios.get(
        `/saving-progress/${savingItem._id}?year=${year}`,
      );
      setMonthlySavings(res.data);
    };
    fetchProgress();
  }, [savingItem._id, moneyModified]);

  const currentAmount = parseFloat(savingItem.amount || 0);
  const targetAmount = parseFloat(savingItem.target || 0);
  const progressPercent =
    targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
  const isGoalReached = currentAmount >= targetAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting....!");
    setIsDisabled(true);
    let amountAdd = parseFloat(e.target.amount.value);
    let newBalance = parseFloat(savingItem.amount) + amountAdd;
    if (onSavingUpdated) {
      onSavingUpdated({ _id: savingItem._id, amount: newBalance });
    }
    const data = {
      id: savingItem._id,
      amount: newBalance,
      updatedAt: new Date(),
    };

    try {
      const res = await axios.patch("/patch-saving-amount", data);
      if (res?.data?.modifiedCount > 0) {
        await axios.post("/transaction", {
          targetID: savingItem._id,
          source: savingItem.source,
          amount: amountAdd,
          type: "Savings",
          category: savingItem.category,
          date: new Date().toISOString().split("T")[0],
          note: "Deposit Saving",
        });

        setmoneyModified(true);
        setModalOpen(false);
      } else {
        if (onSavingUpdated) {
          onSavingUpdated({ _id: savingItem._id, amount: savingItem.amount });
        }
      }
    } catch (err) {
      console.error(err);
      if (onSavingUpdated) {
        onSavingUpdated({ _id: savingItem._id, amount: savingItem.amount });
      }
    } finally {
      setButtonText("Submit");
      setIsDisabled(false);
    }
  };
  if (!savingItem) return null;
  return (
    <div className="w-full max-w-md bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {savingItem.source}
          </h2>
          <p className="text-xs text-gray-500">{savingItem.category}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleEdit(savingItem)}
          >
            <CiEdit className="text-lg text-blue-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => handleDelete(savingItem)}
          >
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1 dark:text-gray-400">
          <span>Overall Progress</span>
          <span className={isGoalReached ? "text-green-500 font-bold" : ""}>
            {progressPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${isGoalReached ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-1">
          ${currentAmount} / ${targetAmount}
        </p>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <div>
          <p className="text-xs uppercase text-gray-400">Date</p>
          <p>{savingItem.date}</p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-gray-400">Note</p>
          <p className="truncate max-w-30">{savingItem.note || "N/A"}</p>
        </div>
      </div>

      <div>
        <button
          disabled={isGoalReached}
          onClick={() => setModalOpen(true)}
          className={`w-full py-2 rounded-xl text-sm font-semibold transition ${
            isGoalReached
              ? "bg-green-100 text-green-600 cursor-not-allowed"
              : "text-white hover:text-slate-300 mt-2 bg-gray-400 py-2 px-4 rounded-xl"
          }`}
        >
          {isGoalReached ? "Goal Completed!" : "Deposit Money"}
        </button>
        <button
          onClick={() => setChartModalOpen(true)}
          className="px-4 py-2 text-white hover:text-slate-300 mt-2 bg-gray-400 rounded-xl transition text-sm font-semibold"
        >
          History
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

export default SavingDetailCard;
