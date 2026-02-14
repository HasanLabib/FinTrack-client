import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.config";
import useAxios from "../../hooks/useAxios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const axios = useAxios();
  const creatUser = async (userData) => {
    setUserLoading(true);
    // return createUserWithEmailAndPassword(auth, email, password);
    try {
      const res = await axios.post("/register", userData);

      const { firebaseToken, user: backendUser } = res.data;
      const userCredential = await signInWithCustomToken(auth, firebaseToken);

      const firebaseUser = auth.currentUser;
      setUser({
        ...firebaseUser,
        ...backendUser,
      });
      setUserLoading(false);
      return userCredential;
    } finally {
      console.log("hello");
    }
  };
  const signInUser = async ({ email, password }) => {
    //return signInWithEmailAndPassword(auth, email, password);

    const res = await axios.post("/login", { email, password });
    const { firebaseToken, user: backendUser } = res.data;
   // console.log(backendUser);
    const userCredential = await signInWithCustomToken(auth, firebaseToken);
    const firebaseUser = auth.currentUser;

    setUser({
      ...firebaseUser,
      ...backendUser,
    });
    setUserLoading(false);

    return userCredential;
  };

  const logOut = async () => {
    try {
      setUserLoading(true);
      await signOut(auth);
      await axios.post("/logout");
      setUser(null);
      setUserLoading(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setUserLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const res = await axios(`/users/${firebaseUser.email}`);
        const backendUser = res.data;

        setUser({
          ...firebaseUser,
          ...backendUser,
        });
        setUserLoading(false);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [axios]);

  const authData = {
    creatUser,
    signInUser,
    logOut,
    user,
    userLoading,
    setUser,
    setUserLoading,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
