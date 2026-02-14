import React, { useState } from "react";

const EditTransactionFormAdmin = ({
  transaction,
  setModalOpen,
  updateTransaction,
}) => {
  const [isDisable, setIsDisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisable(true);

    const form = e.target;
    const source = form.source.value;
    const amount = parseFloat(form.amount.value);
    const category = form.category.value;
    const type = form.type.value;
    const date = form.date.value;
    const note = form.note.value;

    const updatedData = {
      source,
      amount,
      category,
      type,
      date,
      note,
    };

    const result = await updateTransaction(transaction._id, updatedData);
   // console.log(result);
    setIsDisable(false);
    setModalOpen(false);
  };

  return (
    <div className="max-w-md w-full flex flex-col gap-5 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-[#201F24] font-bold text-3xl">Edit Transaction</h1>

        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <p className="text-[#696868] text-xs">
        Update your transaction details below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-[#696868]">Title</label>
          <input
            type="text"
            name="source"
            defaultValue={transaction?.source}
            className="input input-bordered w-full"
            disabled={true}
            readOnly
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#696868]">Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            defaultValue={transaction?.amount}
            className="input input-bordered w-full"
            disabled={true}
            readOnly
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#696868]">Category</label>
          <input
            type="text"
            name="category"
            defaultValue={transaction?.category}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[#696868]">Type</label>
          <select
            name="type"
            defaultValue={transaction?.type}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-[#696868]">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={
              transaction?.date
                ? new Date(transaction.date).toISOString().split("T")[0]
                : ""
            }
            className="input input-bordered w-full"
            disabled={true}
            required
            readOnly
          />
        </div>

        <div>
          <label className="text-xs text-[#696868]">Note</label>
          <textarea
            name="note"
            defaultValue={transaction?.note}
            className="textarea textarea-bordered w-full"
            rows="3"
            disabled={true}
            readOnly={true}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isDisable}
          className="btn btn-success w-full"
        >
          {isDisable ? "Updating..." : "Update Transaction"}
        </button>
      </form>
    </div>
  );
};

export default EditTransactionFormAdmin;
