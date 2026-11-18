const test = require("node:test");
const assert = require("node:assert/strict");
const { parseAmount, safeCheckoutUrl, checkoutFor, campaignProgress } = require("../ajuda/payments.js");

test("valores monetários não sofrem arredondamento nem aceitam entradas ambíguas", () => {
  for (const [input, cents] of [["20",2000],[" 25,50 ",2550],["1.01",101],["100000",10000000],["5,5",550]]) {
    assert.equal(parseAmount(input), cents);
  }
  for (const input of ["", "0", "0,99", "-20", "1e3", "NaN", "1.000", "1.000,50", "25,555", "100001", "2 0", "R$20"]) {
    assert.equal(parseAmount(input), null, input);
  }
});
test("checkout aceita somente hosts confiáveis e HTTPS, sem credenciais ou portas", () => {
  assert.equal(safeCheckoutUrl("https://payment-link.pagar.me/example"), "https://payment-link.pagar.me/example");
  for (const url of ["javascript:alert(1)", "http://checkout.pagar.me/pay", "https://pagar.me.evil.test/pay", "https://evil.test/?next=checkout.pagar.me", "https://checkout.pagar.me@evil.test/pay", "https://user:secret@checkout.pagar.me/pay", "https://checkout.pagar.me:444/pay", "https://checkout.pagar.me/", "", null]) {
    assert.equal(safeCheckoutUrl(url), null, String(url));
  }
});
test("checkout desligado e valores sem link não criam cobrança", () => {
  assert.equal(checkoutFor({}, 5000), null);
  assert.equal(checkoutFor({pagarme:{enabled:false,links:{5000:"https://checkout.pagar.me/pay"}}},5000), null);
  const config = {pagarme:{enabled:true,links:{5000:"https://checkout.pagar.me/pay"}}};
  assert.equal(checkoutFor(config,5000), "https://checkout.pagar.me/pay");
  assert.equal(checkoutFor(config,2000), null);
  assert.equal(checkoutFor(config,50.1), null);
});
test("app Doações usa apenas slug válido e valores explicitamente habilitados", () => {
  const config = {pagarme:{enabled:true,donationSlug:"grupo-exemplo",donationAmounts:[20,50]}};
  assert.equal(checkoutFor(config,5000),"https://doacoes.pagar.me/grupo-exemplo/doe-50");
  for(const cents of [2050,10000,0,NaN,null]) assert.equal(checkoutFor(config,cents),null);
  assert.equal(checkoutFor({pagarme:{...config.pagarme,donationSlug:"../outra-conta"}},5000),null);
  assert.equal(checkoutFor({pagarme:{...config.pagarme,donationAmounts:["50"]}},5000),null);
  assert.equal(checkoutFor({pagarme:{...config.pagarme,links:{5000:"https://evil.test"}}},5000),null);
});
test("estatísticas dependem de números e data reais configurados; barra limitada a 100%", () => {
  for(const campaign of [{},{goalCents:null,raisedCents:null},{goalCents:100,raisedCents:-1,updatedAt:"2026-11-18"},{goalCents:100,raisedCents:0,updatedAt:"2026-02-30"},{goalCents:0,raisedCents:0,updatedAt:"2026-11-18"}]) {
    assert.equal(campaignProgress({campaign}),null);
  }
  assert.equal(campaignProgress({campaign:{goalCents:10000,raisedCents:2500,updatedAt:"2026-11-18"}}).percent,25);
  assert.equal(campaignProgress({campaign:{goalCents:10000,raisedCents:12000,updatedAt:"2026-11-18"}}).percent,100);
});
