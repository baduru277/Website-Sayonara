import React from "react";

const Input = ({ value, onChange, placeholder, type = "text", className = "" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border px-4 py-2 rounded-lg ${className}`}
    />
  );
};

export { Input };