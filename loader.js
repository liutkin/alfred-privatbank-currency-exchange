const alfy = require("alfy");
const numeral = require("numeral");

const getCurrency = require("./getCurrency");
const reportFetchRateError = require("./reportFetchRateError");

numeral.defaultFormat("0.00");

module.exports = async operation => {
  const [amount, currency] = alfy.input.toLowerCase().split(" ");

  const userAmount = numeral(amount);
  const userValidCurrency = getCurrency({ name: currency });
  const actionName = operation === "buy" ? "Buying" : "Selling";

  if (userAmount.value() > 0 && userValidCurrency) {
    const response = await alfy.fetch(
      "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
    );

    if (response.length < 4) {
      reportFetchRateError();
      return;
    }

    const userCurrency = response.find(
      ({ ccy }) => ccy.toLowerCase() === currency
    );

    const total = userAmount.clone().multiply(userCurrency[operation]);

    const targetSymbol =
      userCurrency.ccy.toLowerCase() === "btc"
        ? getCurrency({ name: "usd" }).symbol
        : getCurrency({ name: "uah" }).symbol;

    const baseAmount = numeral(userCurrency[operation]).format();
    const arg = (title = `${targetSymbol} ${total.format()}`);
    const subtitle = `${actionName} ${
      userValidCurrency.symbol
    } ${userAmount.format()} for ${targetSymbol} ${total.format()} ・ ${
      userValidCurrency.symbol
    } 1 for ${targetSymbol} ${baseAmount}`;
    const icon = {
      path: operation === "buy" ? "./icon/buy.png" : "./icon/sale.png",
    };

    alfy.output([{ title, subtitle, arg, icon }]);
  } else {
    alfy.output([
      {
        title: `${actionName} ${
          userAmount.format() || "how much"
        } of which currency?`,
        subtitle: "The format is <amount> <currency>",
        icon: {
          path: "./icon/wait.png",
        },
      },
    ]);
  }
};
