import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.config";
import useAxios from "../../hooks/useAxios";

export const AuthContext = createContext();
const axios = useAxios();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const creatUser = async (userData) => {
    setUserLoading(true);
    // return createUserWithEmailAndPassword(auth, email, password);
    try {
      const res = await axios.post("/register", userData);

      const { firebaseToken } = res.data;
      const userCredential = await signInWithCustomToken(auth, firebaseToken);
      const firebaseUser = auth.currentUser;
      setUser({
        ...firebaseUser,
        role: userCredential.data.user.role,
        photo: userCredential.data.user.photo,
        id: userCredential.data.user.id,
      });
      return userCredential;
    } finally {
      console.log("hello");
    }
  };
  const signInUser = async ({ email, password }) => {
    //return signInWithEmailAndPassword(auth, email, password);

    const res = await axios.post("/login", { email, password });
    const { firebaseToken, user: backendUser } = res.data;
    const userCredential = await signInWithCustomToken(auth, firebaseToken);
    const firebaseUser = auth.currentUser;

    setUser({
      ...firebaseUser,
      ...backendUser,
    });
    return userCredential;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const logOut = () => {
    setUserLoading(true);
    return signOut(auth);
  };

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
