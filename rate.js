const alfy = require("alfy");
const numeral = require("numeral");
const moment = require("moment");

const getCurrency = require("./getCurrency");
const reportFetchRateError = require("./reportFetchRateError");

numeral.defaultFormat("0.00");

const response = await alfy.fetch(
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
);
const state = {
  rates: null,
  cached: null,
  cachedTime: null,
};

if (response.length >= 4) {
  state.rates = response;
  state.cached = false;
  alfy.cache.set("rates", { rates: response, cachedTime: moment() });
} else if (alfy.cache.get("rates")) {
  const { rates, cachedTime } = alfy.cache.get("rates");
  state.rates = rates;
  state.cached = true;
  state.cachedTime = cachedTime;
} else {
  reportFetchRateError();
  return;
}

const items = state.rates.map(({ ccy, base_ccy, buy, sale }) => ({
  title: `${ccy} ・ ${
    getCurrency({ name: base_ccy.toLowerCase() }).symbol
  } ${numeral(buy).format()} ⇣ ・ ${
    getCurrency({ name: base_ccy.toLowerCase() }).symbol
  } ${numeral(sale).format()} ⇡`,
  subtitle: state.cached
    ? `From cache ${moment(state.cachedTime).fromNow()}`
    : "Updated just now",
}));

alfy.output(items);
