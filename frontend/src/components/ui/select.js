import React from "react";

const Select = ({ value, onValueChange, children, className = "" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border px-4 py-2 rounded-lg ${className}`}
    >
      {children}
    </select>
  );
};

const SelectItem = ({ children, value }) => {
  return <option value={value}>{children}</option>;
};

export { Select, SelectItem };