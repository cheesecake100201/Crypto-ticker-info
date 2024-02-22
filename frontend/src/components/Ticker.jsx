import React from "react";
import { useState } from "react";
import Data from "./Data";

const Ticker = () => {
  const [input, setInput] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [socials, setSocials] = useState({});
  const [quotes, setQuotes] = useState({});

  const handleChange = async (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newSocials = {};
    let newQuotes = {};
    try {
      const response = await fetch(
        `http://localhost:8000/metadata?slug=${input}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-CMC_PRO_API_KEY": "5bce303c-9458-438f-87c3-407ac14694f8",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        newSocials["Website"] = data["data"]["website"];
        newSocials["Documentation"] = data["data"]["technical_doc"];
        newSocials["Twitter"] = data["data"]["twitter"];
        console.log(newSocials);
        setSocials(newSocials);
      } else {
        console.error(`Error fetching data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching socials: ${error}`);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/latestQuotes?slug=${input}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-CMC_PRO_API_KEY": "5bce303c-9458-438f-87c3-407ac14694f8",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        newQuotes["Circulating Supply"] = data["data"]["circulating_supply"];
        newQuotes["Current Price"] = data["data"]["quote"]["USD"]["price"];
        newQuotes["Market Cap"] = data["data"]["quote"]["USD"]["market_cap"];
        newQuotes["24 Hr Volume"] = data["data"]["quote"]["USD"]["volume_24h"];
        newQuotes["24 Hr Volume Change"] =
          data["data"]["quote"]["USD"]["volume_change_24h"];
        setQuotes(newQuotes);
      } else {
        console.error(`Error fetching latest quotes: ${response.status}`);
      }
    } catch (error) {}

    setFormSubmitted(true);
    console.log(formSubmitted)
  };

  return (
    <div
      className={`flex flex-col items-center justify-center px-5 py-5 rounded-lg bg-gray-100`}
    >
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          CryptoCurrency Ticker
        </h2>
      </div>
      <div className="mt-10">
        <form
          onSubmit={handleSubmit}
          className={`w-full max-w-md flex items-center justify-center ${
            formSubmitted ? "mr-4" : ""
          }`}
        >
          <div className="flex items-center justify-center border-b border-b-2 border-teal-500 py-2">
            <input
              type="text"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              placeholder="Enter cryptocurrency..."
              onChange={handleChange}
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
        {Object.keys(socials).length > 0 && Object.keys(quotes).length > 0 && (
          <>
            <Data socials={socials} quotes={quotes} />
          </>
        )}
      </div>
    </div>
  );
};

export default Ticker;
