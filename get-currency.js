const currencies = [
  {
    name: "usd",
    symbol: "$",
    icon: "./icon/usd.png",
  },
  {
    name: "eur",
    symbol: "€",
    icon: "./icon/euro.png",
  },
  {
    name: "rur",
    symbol: "₽",
    icon: "./icon/ruble.png",
  },
  {
    name: "btc",
    symbol: "₿",
    icon: "./icon/bitcoin.png",
  },
  {
    name: "uah",
    symbol: "₴",
    icon: "",
  },
];

module.exports = ({ name }) =>
  currencies.find(currency => currency.name === name);
