import React, { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
