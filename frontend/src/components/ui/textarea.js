import React from "react";

const Textarea = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border px-4 py-2 rounded-lg ${className}`}
    />
  );
};

export { Textarea };