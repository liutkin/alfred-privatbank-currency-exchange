const test = require("ava");
const alfy = require("alfy");

const { requestURL } = require("./config");

test("public api", async t => {
  const response = await alfy.fetch(requestURL);

  t.assert(response.length >= 4);
  t.assert(response.every(item => typeof item === "object"));
  t.assert(
    response.every(item =>
      ["ccy", "base_ccy", "buy", "sale"].every(key =>
        Object.keys(item).includes(key)
      )
    )
  );
});
