import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import useAxios from "../hooks/useAxios";
import useAuth from "../hooks/useAuth";
import Register from "../Pages/Authentication/Register/Register";
const RegisterForm = () => {
  const axios = useAxios();
  const [photoValueState, setPhotoValueState] = useState({
    profile_photo: null,
  });
  const [passwordError, setPasswordError] = useState("");
  const [buttonText, setButtonText] = useState("Register");
  const [isDisable, setIsDisabled] = useState(false);
  const { creatUser } = useAuth();
  const handlePhotoChange = (e) => {
    const { name, files } = e.target;

    setPhotoValueState((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const photo = photoValueState.profile_photo;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 6+ chars with uppercase & lowercase letters",
      );
      return;
    }

    const userData = new FormData();
    userData.append("name", name);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("profile_photo", photo);

    const response = await creatUser(userData);

    console.log(response);
  };
  const handleClick = () => {
    setButtonText("Registering...!");
    setIsDisabled(true);
  };
  return (
    <div className="w-full max-w-md p-6 bg-[#f1efef] rounded-2xl border">
      {" "}
      <h1 className="font-bold text-[2rem] mb-8 text-Black">Sign Up</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="full-name" className="text-[#696868]">
            Full Name:
          </label>
          <input
            type="text"
            id="full-name"
            className="h-12 w-full border bg-white px-3 rounded-xl"
            name="name"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-[#696868]">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="h-12 w-full border bg-white px-3 rounded-xl"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-[#696868]">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="h-12 w-full border bg-white px-3 rounded-xl relative"
            required
          />
          <div className="absolute"></div>
          <p className="text-xs flex justify-end items-end">
            Password must be 6 character
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="profile-photo" className="text-[#696868]">
            {" "}
            Profile Photo:
          </label>
          <input
            type="file"
            id="profile-photo"
            name="profile_photo"
            accept="image/*"
            className="h-12 w-full border bg-white px-3 rounded-xl"
            onChange={handlePhotoChange}
            required
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            onClick={handleClick}
            className="w-full bg-[#FF7E6D] text-white py-3 rounded-md hover:bg-[#fb604b] transition"
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};
export default RegisterForm;
