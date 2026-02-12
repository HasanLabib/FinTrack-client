import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
const LoginForm = () => {
  const { signInUser } = useAuth();
  const [passwordError, setPasswordError] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [isDisable, setIsDisabled] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 6+ chars with uppercase & lowercase letters",
      );
      return;
    }

    const response = await signInUser({
      email,
      password,
    });

    console.log(response);
  };
  const handleClick = () => {
    setButtonText("Logging In...!");
    setIsDisabled(true);
  };
  return (
    <div className="w-full max-w-md p-6 bg-[#f1efef] rounded-2xl border">
      {" "}
      <h1 className="font-bold text-[2rem] mb-8 text-Black">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

        <div className="mt-4">
          <button
            type="submit"
            onClick={handleClick}
            className="w-full bg-[#FF7E6D] text-white py-3 rounded-md hover:bg-[#fb604b] transition"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
