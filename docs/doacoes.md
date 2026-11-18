# Página de doações /ajuda

Endereço: https://ongestimacao.org/ajuda/

A página é estática e publicada no mesmo GitHub Pages do site. Usa as fotos já hospedadas no repositório. O Pix por chave CNPJ funciona desde o início; não é um QR Code nem um Pix Copia e Cola com valor embutido. O doador informa o valor no banco e confere o recebedor.

## Ativar o Pagar.me

Edite **`ajuda/config.js`**. Esse arquivo é público: **nunca insira chave secreta de API, senha, token, CPF de doador ou dados de cartão**. Não é necessário inserir uma chave pública de API nesta integração.

A página encaminha o doador para um checkout hospedado no Pagar.me. Nenhum dado de cartão é coletado no GitHub Pages. Antes de ativar, conclua a aprovação/cadastro da ONG na sua conta e confira quais produtos e meios de pagamento estão disponíveis no seu contrato. A página não cria a conta, links, pedidos ou transações automaticamente.

### Opção 1 — links de pagamento por valor

1. Crie **links de pagamento de produção para doações avulsas**, com o nome da ONG e os valores que deseja oferecer (os botões iniciais são R$ 20, R$ 50, R$ 100 e R$ 200). Habilite os meios de pagamento disponíveis na sua conta. Não use links de assinatura para essas doações.
2. Confira se cada link permite receber várias doações, seu vencimento e eventual limite de pagamentos. Links expirados/esgotados devem ser substituídos. A página não consulta seu status.
3. Copie a URL completa do checkout para `pagarme.links`. As chaves do objeto são valores **em centavos**, e devem corresponder ao valor efetivo do checkout.
4. Depois de validar no Pagar.me, troque `enabled` para `true`, aumente a versão no `src="config.js?v=3"` de `ajuda/index.html` (ex.: `v=4`) para renovar o cache, e publique a alteração. Aumente essa versão a cada edição da configuração.

Exemplo de estrutura (substitua os marcadores por links reais antes de ativar):

```js
pagarme: {
  enabled: true,
  links: {
    "2000": "URL_REAL_DO_CHECKOUT_DE_20_REAIS",
    "5000": "URL_REAL_DO_CHECKOUT_DE_50_REAIS",
    "10000": "URL_REAL_DO_CHECKOUT_DE_100_REAIS",
    "20000": "URL_REAL_DO_CHECKOUT_DE_200_REAIS",
  },
  donationSlug: "",
  donationAmounts: [],
},
```

Por segurança, são aceitas apenas URLs HTTPS sem credenciais dos hosts `payment-link.pagar.me`, `checkout.pagar.me` e `doacoes.pagar.me`. Não use encurtadores nem links do painel administrativo. Se a sua conta fornecer um domínio diferente, valide-o com o suporte/documentação oficial antes de atualizar a lista em `ajuda/payments.js`.

**A correspondência entre valor e link é manual.** A página não consegue verificar o valor, o favorecido, a expiração ou a aprovação de um checkout externo. Confira isso na sua conta e no checkout antes de publicar.

### Opção 2 — app Doações do Pagar.me

Se estiver disponível para sua conta, a documentação oficial descreve um app Doações para contas Stone v5 com Checkout habilitado. Configure o app no painel/Hub do Pagar.me antes de usar esta opção.

1. Ative/configure o app, incluindo nome para a URL, valores permitidos, descrição, validade e parcelas conforme sua operação.
2. Copie o nome para URL (slug) e liste **somente os valores efetivamente habilitados no app**, em reais inteiros.
3. Confira as URLs geradas e ative a configuração no site.

```js
pagarme: {
  enabled: true,
  links: {},
  donationSlug: "SEU-SLUG-REAL", // substituir: letras minúsculas, números e hífens
  donationAmounts: [20, 50, 100, 200], // reais, não centavos
},
```

O formato documentado é `https://doacoes.pagar.me/{slug}/doe-{valor}`. Um link explícito em `links` tem prioridade sobre o slug. Um link explícito inválido falha de forma fechada: não é substituído silenciosamente por outro checkout.

Documentação oficial: [App Doações](https://docs.pagar.me/docs/doa%C3%A7%C3%B5es), [Checkout / Link](https://docs.pagar.me/reference/checkout-link), [Criar link via API](https://docs.pagar.me/reference/criar-link), [Chaves de acesso](https://docs.pagar.me/docs/chaves-de-acesso).

## Comportamento da página

- Sem configuração ou sem link válido para o valor escolhido: o modal oferece Pix e acesso ao Apoia.se. Não simula uma cobrança nem mostra um botão de checkout sem destino.
- Com link válido e `enabled: true`: o modal oferece também “Continuar no Pagar.me”. As formas de pagamento efetivas são as do checkout. O Pix direto continua disponível.
- “Outro valor” aceita reais com vírgula ou ponto decimal, sem separador de milhar, entre R$ 1 e R$ 100.000. Valores sem checkout correspondente usam o Pix direto.
- Doação mensal permanece no Apoia.se, em um fluxo separado e identificado.
- Sem JavaScript, a chave Pix e a identificação da ONG continuam visíveis.

Se o checkout aceitar URL de sucesso, configure **`https://ongestimacao.org/ajuda/obrigado/`**. Essa página agradece o apoio e orienta a consultar a confirmação do provedor. Abrir essa URL **não confirma pagamento** e não dispara evento de compra/doação concluída.

## Meta e arrecadação

Nenhuma estatística de arrecadação é inventada. Por padrão, `campaign.goalCents` e `campaign.raisedCents` são `null`, e a página não mostra uma barra de progresso. Para ativá-la, preencha ambos com os valores apurados **em centavos** e `updatedAt` com a data real da apuração (`AAAA-MM-DD`). O site informa que a atualização foi feita pela ONG. É uma atualização manual, não um contador em tempo real.

## Medição

A página reutiliza o GA4 e o consentimento existentes do site. Somente após autorização são enviados eventos `pix_copy` (cópia bem-sucedida), `donation_options_open`, `donation_checkout_click`, `campaign_share` e `monthly_donor_click`. Nenhum deles significa pagamento aprovado. Nenhum nome, e-mail, cartão ou valor pessoal é enviado por esses eventos. A página de retorno não carrega Analytics.

## Conferência e publicação

1. Execute `node --test scripts/donations.test.cjs`.
2. Sirva a raiz do projeto com um servidor estático e abra `/ajuda/` em desktop e celular.
3. Confira os valores dos botões, o valor personalizado, a cópia da chave, compartilhamento e abertura/fechamento do modal pelo teclado.
4. Quando configurar Pagar.me: confira manualmente favorecido, valor, disponibilidade das formas de pagamento, validade/reutilização dos links e retorno. Um teste de pagamento real deve ser feito pelo responsável pela conta. Não publique links de sandbox/teste.
5. Faça commit e push em `main`. O GitHub Pages publica a pasta `/ajuda/` junto ao site.

## Quando será necessário um backend

Gerar pedidos/checkout para qualquer valor dinamicamente, confirmar pagamentos por webhook e atualizar o arrecadado automaticamente exigem um serviço backend fora do GitHub Pages, com segredos em variáveis de ambiente. Não basta adicionar uma chave de API ao JavaScript. Se futuramente implementar isso, valide o valor e o status no servidor, valide/autentique o webhook conforme o provedor e trate eventos repetidos com idempotência.
