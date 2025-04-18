import React from "react";

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin"></div>
  </div>
);

export { Spinner };