import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import SideBar from "../../Component/SideBar";

const DashBoardLayout = () => {
  

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-5 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashBoardLayout;
