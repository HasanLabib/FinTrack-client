import React from "react";
import { ClimbingBoxLoader } from "react-spinners";
const Loading = () => {
  return (
      <div className="h-[97vh] flex items-center justify-center">
        <ClimbingBoxLoader color="#e74c3c" />
      </div>
  );
};

export default Loading;
