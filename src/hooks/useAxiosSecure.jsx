import axios from "axios";
import React, { useEffect } from "react";
import { auth } from "../Firebase/firebase.config";
const axiosSecure = axios.create({
  //baseURL: "http://localhost:5001",
  baseURL: "https://fintrack-server-production-1f62.up.railway.app/",
  withCredentials: true,
});
const useAxiosSecure = () => {
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(async (config) => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${idToken}`;
      }
      return config;
    });
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, []);
  return axiosSecure;
};

export default useAxiosSecure;
