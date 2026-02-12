import React, { useEffect, useState } from "react";

const useWindowSIze = () => {
  const [windowSize, setWindowSize] = useState(null);

  useEffect(() => {
    const handleWindowSize = () => {
      const width = window.innerWidth;
      if (width >= 768) setWindowSize("lg");
      else if (width > 640 || width <= 768) setWindowSize("md");
      else if (width <= 640) setWindowSize("sm");
    };
    window.addEventListener("resize", handleWindowSize);
    handleWindowSize();

    return () => window.removeEventListener("resize", handleWindowSize);
  }, []);
  return windowSize;
};

export default useWindowSIze;
