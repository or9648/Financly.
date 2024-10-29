import React from 'react';

function Input({ label, icon, type, value, setstate, placeholder }) {
  return (
    <div className="flex items-center border-b border-gray-300 py-2">
      <span className="text-gray-500 pr-2">{icon}</span>
      <input
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setstate(e.target.value)}
      />
    </div>
  );
}

export default Input;
