import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../utils/Loading";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxiosSecure();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/users");
      setUsers(response.data);
      console.log("Fetched users:", response.data);
    } catch (err) {
      toast.error("Failed to fetch users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (email) => {
    try {
      await axios.patch(`/admin/make-admin/${email}`);
      toast.success(`${email} is now a admin`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to make admin:", err);
    }
  };

  const makeNormalUser = async (email) => {
    try {
      await axios.patch(`/admin/make-normal/${email}`);
      toast(`${email} is now a user`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to make user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user?.role !== "admin" ? (
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => makeAdmin(user.email)}
                  >
                    Make Admin
                  </button>
                ) : (
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => makeNormalUser(user.email)}
                  >
                    Make Normal
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
