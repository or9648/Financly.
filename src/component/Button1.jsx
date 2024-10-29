import React from 'react';

function Button1({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 text-white border-2  border-blue-600 py-2 rounded-md hover:text-blue-600 hover:bg-white transition-all duration-200 ease-in-out"
    >
      {children}
    </button>
  );
}

export default Button1;
