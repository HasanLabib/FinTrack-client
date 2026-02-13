import React from "react";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, userLoading } = useAuth();
  if (userLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img alt="Profile pic" title={user?.name} src={user?.photoURL} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
