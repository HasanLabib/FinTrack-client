import React from "react";

const AdminTipForm = ({
  handleSubmit,
  setModalOpen,
  editingTip,
  buttonText,
  isDisable,
}) => {
  return (
    <div className="max-w-md w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-[#201F24] font-bold text-3xl">
          {editingTip ? "Edit Financial Tip" : "Add New Tip"}
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
          <label htmlFor="title" className="text-xs text-[#696868]">
            Tip Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={editingTip?.title || ""}
            className="input input-bordered w-full"
            placeholder="e.g. The 50/30/20 Rule"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="text-xs text-[#696868]">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={editingTip?.description || ""}
            className="textarea textarea-bordered w-full h-32"
            placeholder="Explain the tip in detail..."
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="text-xs text-[#696868]">
            Category (optional)
          </label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={editingTip?.category || ""}
            className="input input-bordered w-full"
            placeholder="e.g. Savings, Budgeting, Investing"
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

export default AdminTipForm;