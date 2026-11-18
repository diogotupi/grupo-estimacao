// Configuração PÚBLICA. Nunca coloque chaves de API, senhas ou tokens neste arquivo.
// Instruções completas: docs/doacoes.md
window.ESTIMACAO_DONATIONS = {
  campaign: {
    // Preencha somente com valores reais, em CENTAVOS, apurados pela ONG.
    // Sem esses dados, a página não mostra barra ou total de arrecadação.
    goalCents: null,
    raisedCents: null,
    updatedAt: "", // Data ISO: AAAA-MM-DD. Obrigatória para mostrar os valores.
  },
  pagarme: {
    enabled: false, // Ative apenas depois de conferir os links na sua conta.
    // Opção 1: links de pagamento de produção, um para cada valor em centavos.
    links: {
      // "2000": "https://...link de R$ 20 criado no Pagar.me...",
      // "5000": "https://...link de R$ 50 criado no Pagar.me...",
      // "10000": "https://...link de R$ 100 criado no Pagar.me...",
      // "20000": "https://...link de R$ 200 criado no Pagar.me...",
    },
    // Opção 2: se o app Doações estiver disponível e configurado na sua conta.
    // Use exatamente o slug e os valores habilitados no app (em REAIS inteiros).
    donationSlug: "",
    donationAmounts: [],
  },
};
