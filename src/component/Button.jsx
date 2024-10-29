import React from 'react';

function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full text-blue-600 border-2  border-blue-600 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out"
    >
      {children}
    </button>
  );
}

export default Button;
