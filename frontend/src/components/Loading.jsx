import React from "react";
import Lottie from "lottie-react";
import loadingLottie from "../assets/lottie/loading.json";

const Loading = ({ className = "" }) => (
  <div
    className={`flex flex-col items-center justify-center w-full py-10 ${className}`}
    aria-label="Loading"
  >
    <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 max-w-full">
      <Lottie
        animationData={loadingLottie}
        loop
        style={{ width: "100%", height: "100%" }}
        aria-label="Loading animation"
      />
    </div>
  </div>
);

export default Loading;
