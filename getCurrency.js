const currencies = [
  {
    name: "usd",
    symbol: "$",
  },
  {
    name: "eur",
    symbol: "€",
  },
  {
    name: "rur",
    symbol: "₽",
  },
  {
    name: "btc",
    symbol: "₿",
  },
  {
    name: "uah",
    symbol: "₴",
  },
];

module.exports = ({ name, symbol }) =>
  currencies.find(
    currency => currency.name === name || currency.symbol === symbol
  );
