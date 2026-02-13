import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import iconOverView from "../assets/images/icon-nav-overview.svg";
import iconIncome from "../assets/images/icon-nav-budgets.svg";
import iconExpense from "../assets/images/icon-nav-recurring-bills.svg";
import iconSaving from "../assets/images/icon-nav-pots.svg";
import iconTransac from "../assets/images/icon-nav-transactions.svg";
const SideBar = () => {
  const { user, userLoading, logOut } = useAuth();

  if (userLoading) {
    return <aside className="bg-[#201F24] text-white p-4">Loading...</aside>;
  }
  if (!user) return null;

  console.log(user);
  const menuItems =
    user?.role === "admin"
      ? ["Category","Transaction"]
      : ["Overview", "Income", "Expense", "Savings", "Transaction"];
  const iconItems =
    user?.role === "admin"
      ? ["C","T"]
      : [iconOverView, iconIncome, iconExpense, iconSaving, iconTransac];
  const dashBoard = user?.role === "admin" ? "adminDashboard" : "userDashboard";
  const handleLogout = () => {
    logOut();
  };

  return (
    <>
      {" "}
      <aside className=" min-h-screen max-w-75 w-full flex flex-col justify-between bg-[#201F24] p-4 text-white">
        <div>
          {" "}
          <h1 className={` text-5xl font-bold text-white mb-5 `}>fintrack</h1>
          <p className="text-xs text-gray-500 mb-4">
            Logged in as: {user?.role}
          </p>
          {menuItems.map((item, idx) => (
            <div
              key={item}
              className="flex items-center gap-2 p-2 rounded hover:bg-[#F9F4F0] hover:border-l-4 hover:border-amber-300 group"
            >
              <img src={iconItems[idx]} alt={item} />
              <Link
                to={`/dashboard/${dashBoard}/${item.toLowerCase()}`}
                className="text-[#B3B3B3] group-hover:text-black transition-colors"
              >
                {item}
              </Link>
            </div>
          ))}
        </div>
        <button
          className="font-bold p-2 bg-[#524949] rounded-2xl cursor-pointer hover:bg-[#818181]"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
    </>
  );
};
export default SideBar;
