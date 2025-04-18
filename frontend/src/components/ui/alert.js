import React from "react";

const Alert = ({ message, type = "info" }) => {
  const colorClasses = {
    info: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[type]}`}>
      {message}
    </div>
  );
};

export { Alert };