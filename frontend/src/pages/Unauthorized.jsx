import React, { Fragment, useState, useEffect } from "react";
import Lottie from "lottie-react";
import unauthorizedLottie from "../assets/lottie/unauthorizedLottie.json";
import { Transition } from "@headlessui/react";

const Unauthorized = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger the animation after mount
    setShow(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Transition
        as={Fragment}
        show={show}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 mb-8 text-center drop-shadow-lg">
          Sorry, You're an outsider.
        </h1>
      </Transition>
      <Transition
        as={Fragment}
        show={show}
        enter="transition-all duration-700 delay-200"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
      >
        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg flex justify-center">
          <Lottie
            animationData={unauthorizedLottie}
            loop
            style={{ width: "100%", maxWidth: 400, minWidth: 200 }}
            aria-label="Unauthorized animation"
          />
        </div>
      </Transition>
    </div>
  );
};

export default Unauthorized;
