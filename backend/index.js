const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

let mapping = {};

const nameToIdMapping = async () => {
  const result = await fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map",
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
        Accept: "application/json",
      },
    }
  );

  const response = await result.json();
  for (let i = 0; i < response["data"].length; i++) {
    const element = response["data"][i];
    mapping[element["symbol"].toLowerCase()] = element["id"];
  }
  console.log(mapping["btc"]);
  return mapping;
};

app.get("/metadata", async (req, res) => {
  try {
    let symbol = req.query.symbol;
    symbol = symbol.toLowerCase().replace(/\s+/g, "-");
    if (Object.keys(mapping).length === 0) {
      mapping = await nameToIdMapping();
    }

    const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?symbol=${symbol}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
    });
    const data = await response.json();
    res.status(200).json({ success: true, data: data["data"][symbol.toUpperCase()][0]["urls"] });
  } catch (error) {
    console.error("error", error);
  }
});

app.get("/latestQuotes", async (req, res) => {
  try {
    let symbol = req.query.symbol;
    if (Object.keys(mapping).length === 0) {
      mapping = await nameToIdMapping();
    }
    symbol = symbol.toLowerCase().replace(/\s+/g, "-");
    const apiUrl = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
    });
    const data = await response.json();
    res
      .status(200)
      .json({ success: true, data: data["data"][symbol.toUpperCase()] });
  } catch (error) {
    console.error("error", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
