import React from "react";

const SavingMoneyForm = ({
  handleSubmit,
  setModalOpen,
  editingSavings,
  allCategory,
  buttonText,
  isDisable,
}) => {
  console.log(allCategory);
  return (
    <div className="max-w-md w-full  flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#201F24] font-bold text-3xl">
          {editingSavings ? "Edit Save Target" : "Add New Saving Target"}
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
            Save For:
          </label>
          <input
            type="text"
            id="source"
            name="source"
            defaultValue={editingSavings?.source || ""}
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
            defaultValue={editingSavings?.amount || ""}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="text-xs text-[#696868]">
            Target Amount
          </label>
          <input
            type="number"
            id="target"
            name="target"
            defaultValue={editingSavings?.target || ""}
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
            defaultValue={"Savings"}
            disabled
            className="input input-bordered w-full"
            required
          >
            <option defaultValue={`Savings`} value="Savings">
              Savings
            </option>
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
            defaultValue={editingSavings?.date || new Date() ||""}
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
            defaultValue={editingSavings?.note || ""}
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

export default SavingMoneyForm;
