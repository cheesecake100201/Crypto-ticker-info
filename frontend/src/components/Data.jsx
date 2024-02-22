import React from "react";

const Data = ({ socials, quotes }) => {
  return (
    <div className="flex justify-around mt-8 space-x-8">
      <div className="w-1/2 scrollbar">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">Socials</h2>
        <hr className="mb-4" />
        <ul>
          {Object.keys(socials).map((key, index) => (
            <li key={index} className="mb-4">
              <div className="bg-white p-4 rounded-md shadow-md">
                <p className="text-lg font-mono text-gray-800 overflow-auto word-wrap: break-word">
                  {socials[key].length > 0
                    ? `${key}:${socials[key][0]}`
                    : `${key}: Not Available`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">
          Latest Quotes
        </h2>
        <hr className="mb-4" />
        <ul>
          {Object.keys(quotes).map((key, index) => (
            <li key={index} className="mb-4">
              <div className="bg-white p-4 rounded-md shadow-md">
                <p className="text-lg font-mono text-gray-800">{`${key}: ${quotes[key]}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Data;
