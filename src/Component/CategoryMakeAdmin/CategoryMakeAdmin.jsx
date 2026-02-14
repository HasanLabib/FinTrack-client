import React, { useState } from "react";
import CategoryMakeForm from "../FormComponent/CategoryMakeForm";
import useCategoryHook from "../../hooks/useCategoryHook";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaginationComp from "../PaginationComp";
const CategoryMakeAdmin = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [editingCatgory, setEditingCatgory] = useState(null);
  const {
    allCategory,
    setAllCategory,
    categoryLoading,
    categoryError,
    totalPage,
    page,
    setPage,
  } = useCategoryHook();
  const axios = useAxiosSecure();
  const handleEdit = (categoryItem) => {
    setEditingCatgory(categoryItem);

    setModalOpen(true);
  };
  const handleDelete = async (categoryItem) => {
    try {
      const resDelete = await axios.delete(
        `/delete-category/${categoryItem._id}`,
      );

      if (resDelete.data?.deletedCount > 0) {
        const afterDelete = allCategory.filter(
          (category) => category._id !== categoryItem._id,
        );

        setAllCategory(afterDelete);
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting...!");
    setIsDisabled(true);
    const category = e.target.category.value;
    if (editingCatgory) {
      //console.log(editingCatgory);
      const resEdit = await axios.put(
        `/update-category/${editingCatgory._id}`,
        { category },
      );
      if (resEdit.data?.modifiedCount > 0) {
        setAllCategory((prev) =>
          prev.map((item) =>
            item._id === editingCatgory._id ? { ...item, category } : item,
          ),
        );
        setButtonText("Submit");
        setIsDisabled(false);
      }
      setEditingCatgory(null);
      e.target.reset();
      setModalOpen(false);
    } else {
      const category = e.target.category.value;
      const res = await axios.post("/category", { category });
      if (res.data?.insertedId) {
        setAllCategory((prev) => [
          ...prev,
          { _id: res.data.insertedId, category },
        ]);
        setButtonText("Submit");
        setIsDisabled(false);
      }
      e.target.reset();
      setModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] w-full mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#201F24] font-bold text-3xl">Category</h1>
        <button
          className="btn bg-[#201F24] max-w-32 min-h-13.25 w-full p-4 rounded-xl text-white"
          onClick={() => {
            setEditingCatgory(null);
            setModalOpen(true);
          }}
        >
          +Create Category
        </button>
      </div>

      <div className="grow">
        {categoryLoading && <p>Loading...</p>}
        {categoryError && <p className="text-red-500">Something went wrong</p>}

        <div className="flex flex-wrap gap-4">
          {allCategory.map((categoryItem) => (
            <div
              key={categoryItem._id}
              className="card hover:bg-slate-100 flex-row justify-center items-center bg-base-100 shadow-sm p-4 border w-fit"
            >
              <p className="font-medium p-5 select-none">
                {categoryItem.category}
              </p>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-circle btn-outline btn-info"
                  onClick={() => handleEdit(categoryItem)}
                >
                  <CiEdit className="text-xl" />
                </button>
                <button
                  className="btn btn-sm btn-circle btn-outline btn-error"
                  onClick={() => handleDelete(categoryItem)}
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-6 mt-auto">
        <PaginationComp countPage={totalPage} page={page} setPage={setPage} />
      </div>

      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <CategoryMakeForm
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              editingCategory={editingCatgory}
              isDisable={isDisable}
              buttonText={buttonText}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CategoryMakeAdmin;
