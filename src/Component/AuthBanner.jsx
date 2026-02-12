import React from "react";
import bannerImg from "../assets/images/illustration-authentication.svg";
const AuthBanner = () => {
  return (
    <section className="relative z-0 min-h-screen h-full border border-none rounded-2xl p-5  ">
      <h1 className="absolute z-10 text-5xl text-white p-10">fintrack</h1>
      <img
        src={bannerImg}
        loading="lazy"
        className="w-full h-full object-cover rounded-2xl"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-end p-10 text-white gap-6">
        <p className="font-bold text-4xl">
          Keep track of your money and save for your future
        </p>
        <p className="text-xs">
          Personal finance app puts you in control of your spending. Track
          transactions, set budgets, and add to savings pots easily.
        </p>
      </div>
    </section>
  );
};

export default AuthBanner;
