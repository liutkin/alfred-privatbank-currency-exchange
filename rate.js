/* eslint-disable camelcase */

const alfy = require("alfy");
const numeral = require("numeral");
const moment = require("moment");

const getCurrency = require("./get-currency");
const reportFetchRateError = require("./report-fetch-rate-error");
const {
  requestURL,
  buySymbol,
  saleSymbol,
  dividerSymbol,
} = require("./config");

numeral.defaultFormat("0.00");

(async () => {
  const response = await alfy.fetch(requestURL);
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

  const items = state.rates.map(({ ccy, base_ccy, buy, sale }) => {
    const title = `${ccy} ・ ${
      getCurrency({ name: base_ccy.toLowerCase() }).symbol
    } ${numeral(buy).format()} ${buySymbol} ${dividerSymbol} ${
      getCurrency({ name: base_ccy.toLowerCase() }).symbol
    } ${numeral(sale).format()} ${saleSymbol}`;
    const arg = title;
    const subtitle = state.cached
      ? `From cache ${moment(state.cachedTime).fromNow()}`
      : "Updated just now";
    const icon = {
      path: getCurrency({ name: ccy.toLowerCase() }).icon,
    };
    return {
      title,
      subtitle,
      arg,
      icon,
    };
  });

  alfy.output(items);
})();
