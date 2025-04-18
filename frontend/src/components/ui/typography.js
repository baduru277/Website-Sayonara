import React from "react";

const Heading = ({ level, children, className = "" }) => {
  const Tag = `h${level}`;
  return <Tag className={`text-2xl font-bold ${className}`}>{children}</Tag>;
};

const Paragraph = ({ children, className = "" }) => {
  return <p className={`text-base ${className}`}>{children}</p>;
};

export { Heading, Paragraph };