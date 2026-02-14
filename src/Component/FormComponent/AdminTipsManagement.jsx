import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useAdminTips from "../../hooks/useAdminTips";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../../utils/Loading";
import AdminTipForm from "../../components/FormComponent/AdminTipForm";

const AdminTipsManagement = () => {
  const { tips, loading, addTip, updateTip, deleteTip, fetchTips } = useAdminTips();

  const [modalOpen, setModalOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Submit");
  const [isDisable, setIsDisabled] = useState(false);
  const [editingTip, setEditingTip] = useState(null);

  const axios = useAxiosSecure();

  const handleEdit = (tip) => {
    setEditingTip(tip);
    setModalOpen(true);
  };

  const handleDelete = async (tip) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This tip will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteTip(tip._id); 
        await Swal.fire({
          title: "Deleted!",
          text: "Tip deleted successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete tip.",
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
    const tipData = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value || "General",
    };

    try {
      if (editingTip) {
        await updateTip(editingTip._id, tipData);
        toast.success("Tip updated successfully!");
      } else {
        await addTip(tipData);
        toast.success("Tip added successfully!");
      }
      setModalOpen(false);
      setEditingTip(null);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setButtonText("Submit");
      setIsDisabled(false);
      form.reset();
    }
  };

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3rem)] w-full mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#201F24] font-bold text-3xl">Financial Tips Management</h1>
        <button
          className="btn bg-[#201F24] max-w-32 min-h-13.25 w-full p-4 rounded-xl text-white"
          onClick={() => {
            setEditingTip(null);
            setModalOpen(true);
          }}
        >
          + Add New Tip
        </button>
      </div>

      <div className="grow">
        <div className="flex flex-wrap gap-4">
          {tips.map((tip) => (
            <div
              key={tip._id}
              className="bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-[#201F24] dark:text-white">{tip.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {tip.category || "General"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(tip)}
                    className="text-[#201F24] hover:text-blue-600"
                  >
                    <CiEdit size={24} />
                  </button>
                  <button
                    onClick={() => handleDelete(tip)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>

              <p className="text-[#696868] mt-4 leading-relaxed line-clamp-4">
                {tip.description}
              </p>

              <p className="text-xs text-gray-400 mt-6">
                Added: {new Date(tip.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {tips.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            No tips yet. Click "Add New Tip" to get started.
          </div>
        )}
      </div>

      {modalOpen && (
        <dialog id="my_modal_3" className="modal modal-open">
          <div className="modal-box">
            <AdminTipForm
              handleSubmit={handleSubmit}
              setModalOpen={setModalOpen}
              editingTip={editingTip}
              buttonText={buttonText}
              isDisable={isDisable}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminTipsManagement;