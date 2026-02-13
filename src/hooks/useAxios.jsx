import axios from "axios";
import React from "react";
const axiosNormal = axios.create({
  baseURL: "https://fintrack-server-production-1f62.up.railway.app/",
  //baseURL: "http://localhost:5001",
  withCredentials: true,
});

const useAxios = () => {
  return axiosNormal;
};

export default useAxios;
