import React from "react";

export const Tabs = ({ children }) => (
  <div className="border-b border-gray-200">{children}</div>
);

export const TabsList = ({ children }) => (
  <div className="flex space-x-2">{children}</div>
);

export const TabsTrigger = ({ value, children, onClick }) => (
  <button
    className="px-4 py-2 text-gray-600 hover:text-black border-b-2 border-transparent hover:border-black"
    onClick={() => onClick(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => (
  activeTab === value ? <div className="p-4">{children}</div> : null
);