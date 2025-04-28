import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <img src="/logo.svg" alt="Loading..." className="w-20 h-20 animate-pulse" />
    </div>
  );
};

export default Loader;
