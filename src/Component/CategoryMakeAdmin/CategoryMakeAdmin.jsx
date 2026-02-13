import React, { useState } from "react";
import CategoryMakeForm from "../FormComponent/CategoryMakeForm";
import useCategoryHook from "../../hooks/useCategoryHook";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaginationComp from "../PaginationComp";
const CategoryMakeAdmin = () => {
  const [modalOpen, setModalOpen] = useState(false);
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
    const category = e.target.category.value;
    if (editingCatgory) {
      console.log(editingCatgory);
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
      }
      e.target.reset();
      setModalOpen(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-[#201F24] font-bold text-3xl">Category</h1>
        <button
          className="btn"
          onClick={() => {
            setEditingCatgory(null);
            setModalOpen(true);
          }}
        >
          Create Category
        </button>
      </div>
      <div>
        {categoryLoading && <p>Loading...</p>}
        {categoryError && <p className="text-red-500">Something went wrong</p>}
        {allCategory.map((categoryItem) => {
          return (
            <div key={categoryItem._id} className="card bg-base-100 w-fit">
              <p>{categoryItem.category}</p>
              <div className="flex gap-2">
                <button
                  className="btn btn-md rounded-full w-12 h-12 btn-outline btn-info"
                  onClick={() => handleEdit(categoryItem)}
                >
                  <CiEdit className="text-2xl" />
                </button>
                <button
                  className="btn btn-md rounded-full w-12 h-12 btn-outline btn-error"
                  onClick={() => handleDelete(categoryItem)}
                >
                  <MdDelete className="text-2xl" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <PaginationComp countPage={totalPage} page={page} setPage={setPage} />
      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <CategoryMakeForm
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              editingCategory={editingCatgory}
            />
          </div>
        </dialog>
      )}
    </>
  );
};

export default CategoryMakeAdmin;
