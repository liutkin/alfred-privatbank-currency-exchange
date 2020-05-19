module.exports = items =>
  items.map(item => ({ ...item, ccy: item.ccy === "RUR" ? "RUB" : item.ccy }));
