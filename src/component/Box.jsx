// Box.js
import React from 'react';
import Button1 from './Button1';

function Box({ text,children, amount, buttonLabel, onButtonClick }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full  text-center border border-gray-200">
      <h2 className="text-xl  font-bold text-gray-700 mb-2">{text}</h2>
      <p className="text-lg text-blue-500 font-bold mb-4">RS.{amount}</p>
      <Button1 children={children} label={buttonLabel} onClick={onButtonClick} />
    </div>
  );
}

export default Box;
