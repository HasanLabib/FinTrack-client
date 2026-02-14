import React, { useEffect, useState } from "react";

import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useSavingsHook from "../../hooks/useSavingsHook";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PaginationComp from "../PaginationComp";
import useGetAllCategory from "../../hooks/useGetAllCategory";
import SavingDetailCard from "../Card/SavingDetailCard";
import SavingMoneyForm from "../FormComponent/SavingMoneyForm";
import Loading from "../../utils/Loading";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Savings = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [editingSaving, setEditingSaving] = useState(null);
  const [moneyModified, setmoneyModified] = useState(false);

  const {
    allSavings,
    setAllSavings,
    savingsLoading,
    savingsError,
    page,
    setPage,
    totalPage,
  } = useSavingsHook();

  const { allCategory, categoryLoading } = useGetAllCategory();

  const axios = useAxiosSecure();

  const handleEdit = (savingItem) => {
    setEditingSaving(savingItem);
    setModalOpen(true);
  };


  const handleDelete = async (savingItem) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this saving!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const resDelete = await axios.delete(
          `/delete-saving/${savingItem._id}`,
        );

        if (resDelete.data?.deletedCount > 0) {
          setAllSavings(
            allSavings.filter((item) => item._id !== savingItem._id),
          );

          Swal.fire({
            title: "Deleted!",
            text: "Saving has been deleted successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Submitting...");
    setIsDisabled(true);

    const form = e.target;
    const savingData = {
      source: form.source.value,
      amount: parseFloat(form.amount.value),
      target: parseFloat(form.target.value),
      type: form.type.value,
      date: form.date.value,
      note: form.note.value || "",
    };
    if (editingSaving) {
      try {
        const resEdit = await axios.put(
          `/update-saving/${editingSaving._id}`,
          savingData,
        );

        if (resEdit.data?.modifiedCount > 0) {
          setAllSavings((prev) =>
            prev.map((item) =>
              item._id === editingSaving._id
                ? { ...item, ...savingData }
                : item,
            ),
          );
          setModalOpen(false);
        }
        setEditingSaving(null);
      } catch (err) {
        toast.error("Edit error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    } else {
      try {
        const res = await axios.post("/saving", savingData);
        if (res.data?.insertedId) {
          setAllSavings((prev) => [
            ...prev,
            { _id: res.data.insertedId, ...savingData },
          ]);
          setModalOpen(false);

          await axios.post("/transaction", savingData);
        }
      } catch (err) {
        toast.error("Add saving error:", err.response?.data || err.message);
      } finally {
        setButtonText("Submit");
        setIsDisabled(false);
      }
    }

    form.reset();
  };

  useEffect(() => {
    const fetchSavings = async () => {
      const res = await axios.get(`/saving?page=${page}`);
      setAllSavings(res.data.savings);
    };
    fetchSavings();
  }, [axios, moneyModified, page]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] w-full mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#201F24] font-bold text-3xl">Savings</h1>
        <button
          className="btn bg-[#201F24] max-w-32 min-h-13.25 w-full p-4 rounded-xl text-white"
          onClick={() => {
            setEditingSaving(null);
            setModalOpen(true);
          }}
        >
          +Add Savings
        </button>
      </div>

      <div className="grow">
        {savingsLoading && !allCategory && <Loading />}
        {/* {savingsError && <p className="text-red-500">Something went wrong</p>} */}

        <div className="flex flex-wrap gap-4">
          {allSavings.map((savingItem) => (
            <SavingDetailCard
              key={savingItem._id}
              savingItem={savingItem}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              moneyModified={moneyModified}
              setmoneyModified={setmoneyModified}
              onSavingUpdated={(updatedItem) => {
                setAllSavings((prev) =>
                  prev.map((item) =>
                    item._id === updatedItem._id
                      ? { ...item, ...updatedItem }
                      : item,
                  ),
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className="py-6 mt-auto">
        <PaginationComp countPage={totalPage} page={page} setPage={setPage} />
      </div>

      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <SavingMoneyForm
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              editingSavings={editingSaving}
              allCategory={allCategory}
              isDisable={isDisable}
              buttonText={buttonText}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Savings;
