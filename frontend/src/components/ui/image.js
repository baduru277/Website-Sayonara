import React from "react";

const Image = ({ src, alt, className = "" }) => {
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
};

export { Image };