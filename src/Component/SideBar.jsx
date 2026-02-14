import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import iconOverView from "../assets/images/icon-nav-overview.svg";
import iconIncome from "../assets/images/icon-nav-budgets.svg";
import iconExpense from "../assets/images/icon-nav-recurring-bills.svg";
import iconSaving from "../assets/images/icon-nav-pots.svg";
import iconTransac from "../assets/images/icon-nav-transactions.svg";
import { CiLogin } from "react-icons/ci";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
const SideBar = () => {
  const { user, userLoading, logOut } = useAuth();

  if (userLoading) {
    return <aside className="bg-[#201F24] text-white p-4">Loading...</aside>;
  }
  if (!user) return null;

  //console.log(user);
  const menuItems =
    user?.role === "admin"
      ? ["Overview", "Tips", "Category", "Manage User", "Transaction"]
      : ["Overview", "Income", "Expense", "Savings", "Transaction"];
  const iconItems =
    user?.role === "admin"
      ? [iconOverView, "", "", "", iconTransac]
      : [iconOverView, iconIncome, iconExpense, iconSaving, iconTransac];
  const dashBoard = user?.role === "admin" ? "adminDashboard" : "userDashboard";
  const handleLogout = () => {
    logOut();
  };

  return (
    <>
      {" "}
      <aside className="hidden lg:flex min-h-screen max-w-75 w-full  flex-col justify-between bg-[#201F24] p-4 text-white">
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
      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50           
          lg:hidden                                 
          bg-[#201F24] border-t border-gray-700
          flex items-center justify-around py-2 px-4
          shadow-lg
        "
      >
        {menuItems.map((item, idx) => (
          <Link
            key={item}
            to={`/dashboard/${dashBoard}/${item.toLowerCase()}`}
            className="
              flex flex-col items-center gap-1 p-2 
              text-[#B3B3B3] hover:text-amber-300 
              transition-colors active:scale-95
            "
          >
            <img
              src={iconItems[idx]}
              alt={item}
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs font-medium">{item}</span>
          </Link>
        ))}
        <button
          className="font-black text-3xl text-[#B3B3B3]  cursor-pointer"
          onClick={handleLogout}
        >
          <CiLogin />
        </button>
      </nav>
      <div className="lg:hidden h-16" />
    </>
  );
};
export default SideBar;
