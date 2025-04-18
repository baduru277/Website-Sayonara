import React from "react";

const Modal = ({ children, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <button onClick={onClose} className="text-red-500">Close</button>
        {children}
      </div>
    </div>
  );
};

export { Modal };