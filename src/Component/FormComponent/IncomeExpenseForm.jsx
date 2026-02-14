import React from "react";

const IncomeExpenseForm = ({
  handleSubmit,
  setModalOpen,
  editingIncome,
  allCategory,
  buttonText,
  isDisable,
}) => {
  //console.log(allCategory);
  return (
    <div className="max-w-md w-full  flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#201F24] font-bold text-3xl">
          {editingIncome ? "Edit Income" : "Add New Income"}
        </h1>
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="source" className="text-xs text-[#696868]">
            Income Source
          </label>
          <input
            type="text"
            id="source"
            name="source"
            defaultValue={editingIncome?.source || ""}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="text-xs text-[#696868]">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            defaultValue={editingIncome?.amount || ""}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="text-xs text-[#696868]">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={editingIncome?.type || "Income"}
            className="input input-bordered w-full"
          >
            <option defaultValue={`Income`} value="Income">
              Income
            </option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="text-xs text-[#696868]">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={editingIncome?.category || ""}
            className="input input-bordered w-full"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {allCategory.map((cat) => (
              <option key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="text-xs text-[#696868]">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={editingIncome?.date || ""}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="note" className="text-xs text-[#696868]">
            Note (optional)
          </label>
          <textarea
            id="note"
            name="note"
            defaultValue={editingIncome?.note || ""}
            className="input input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isDisable}
          className="btn btn-success w-full"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default IncomeExpenseForm;
