import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import SideBar from "../../Component/SideBar";
import Navbar from "../../Component/Navbar";
import useWindowSIze from "../../hooks/useWindowSIze";

const DashBoardLayout = () => {
  const width = useWindowSIze();
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-5 bg-gray-100 min-h-screen">
        <div className="flex  justify-between items-start">
          <Outlet />
          <Navbar className="mb-5" />
        </div>
      </main>
    </div>
  );
};

export default DashBoardLayout;
