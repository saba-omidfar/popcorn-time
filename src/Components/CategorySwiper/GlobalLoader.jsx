// components/GlobalLoader.js
import React from "react";
import Lottie from "react-lottie";
import animationLoaderData from "../../lotties/Loader.json";

const GlobalLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationLoaderData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="global-loader">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default GlobalLoader;
