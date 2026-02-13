import React from "react";

const AddMoneyForm = ({
  handleSubmit,
  setModalOpen,
  buttonText,
  isDisable,
}) => {
  return (
    <div className="max-w-md w-full  flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#201F24] font-bold text-3xl">Add Money</h1>
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
          <label htmlFor="amount" className="text-xs text-[#696868]">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className="input input-bordered w-full"
            required
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

export default AddMoneyForm;
