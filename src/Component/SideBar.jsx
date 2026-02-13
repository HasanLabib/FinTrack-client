import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

const SideBar = () => {
  const { user, userLoading, logOut } = useAuth();

  if (userLoading) {
    return <aside className="bg-[#201F24] text-white p-4">Loading...</aside>;
  }
  if (!user) return null;

  console.log(user);
  const menuItems =
    user?.role === "admin"
      ? ["Category"]
      : ["Overview", "Income", "Expense", "Savings", "Transaction"];
  const dashBoard = user?.role === "admin" ? "adminDashboard" : "userDashboard";
  const handleLogout = () => {
    logOut();
  };

  return (
    <aside className="min-h-screen max-w-75 w-full flex flex-col justify-between bg-[#201F24] p-4 text-white">
      <div>
        {" "}
        <p className="text-xs text-gray-500 mb-4">Logged in as: {user?.role}</p>
        {menuItems.map((item) => (
          <Link
            key={item}
            to={`/dashboard/${dashBoard}/${item.toLowerCase()}`} // Adding leading slash makes it an absolute path
            className="block text-white mb-2 hover:bg-gray-700 p-2 rounded transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>
      <button
        className="font-bold p-2 bg-[#524949] rounded-2xl cursor-pointer hover:bg-[#818181]"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};
export default SideBar;
