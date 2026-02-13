import React from "react";
import AuthBanner from "../../../Component/AuthBanner";
import useWindowSIze from "../../../hooks/useWindowSIze";
import RegisterForm from "../../../Component/RegisterForm";

const Register = () => {
  const width = useWindowSIze();
  console.log(width);
  return (
    <>
      <section className="grid grid-cols-3  max-md:flex max-md:flex-col bg-[#201F24]">
        {width === "lg" && (
          <section>
            <AuthBanner />
          </section>
        )}
        <h1
          className={`text-center  text-5xl font-bold text-white ${width === "lg" ? "hidden" : " "}`}
        >
          fintrack
        </h1>

        <section
          className={`${width === "lg" ? "col-span-2" : ""} min-h-screen flex justify-center items-center`}
        >
          <RegisterForm />
        </section>
      </section>
    </>
  );
};

export default Register;
