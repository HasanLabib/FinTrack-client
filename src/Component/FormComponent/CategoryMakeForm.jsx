import React from "react";

const CategoryMakeForm = ({ handleSubmit, setModalOpen, editingCategory }) => {
  return (
    <div className="max-w-md w-full">
      <div className="flex justify-between items-center">
        <h1>{editingCategory ? "Edit Category" : "Add New Category"}</h1>
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => setModalOpen(false)}
        >
          ✕
        </button>
      </div>
      <p>
        Create a category to have most flexibility. These can help keep you on
        track more easily.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category Name</label>
        <input
          type="text"
          id="category"
          name="category"
          defaultValue={editingCategory?.category || ""}
          className="input input-bordered w-full"
          required
        />
        <button type="submit" className="btn btn-success w-full">
          Save Genre
        </button>
      </form>
    </div>
  );
};

export default CategoryMakeForm;
