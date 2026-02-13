import React from "react";

const CategoryMakeForm = ({
  handleSubmit,
  setModalOpen,
  editingCategory,
  buttonText,
  isDisable,
}) => {
  return (
    <div className="max-w-md  w-full flex flex-col gap-5">
      <div className="flex justify-between items-center ">
        <h1 className="text-[#201F24] font-bold text-3xl">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h1>
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
      </div>
      <p className="text-[#696868] text-xs">
        Create a category to have most flexibility. These can help keep you on
        track more easily.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="category" className="text-xs text-[#696868]">
            Category Name
          </label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={editingCategory?.category || ""}
            className="input input-bordered w-full "
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

export default CategoryMakeForm;
