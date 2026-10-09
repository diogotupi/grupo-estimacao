# Google Analytics

- Conta: Grupo Estimação
- Propriedade: Site Grupo Estimação
- Fluxo web: https://ongestimacao.org (16096039086)
- ID de medição público: `G-V1K9QDGH6T`
- Fuso: America/Sao_Paulo; moeda: BRL

`js/analytics.js` carrega a tag apenas nos domínios de produção e depois de aceitar estatísticas. Sem consentimento, não carrega a tag nem envia eventos ao Analytics. Publicidade e Google Signals ficam desativados na configuração do site. Compartilhamentos opcionais da conta foram desmarcados na criação.

A escolha fica no localStorage por até 180 dias. O botão “Privacidade e cookies” no rodapé permite alterar a escolha. Recusar após aceitar desativa a medição, apaga cookies `_ga` e recarrega a página para descarregar a tag. Cookies de medição têm validade configurada de 60 dias.

Eventos próprios:

| Evento | Quando ocorre |
| --- | --- |
| `pix_copy` | Após copiar o PIX com sucesso |
| `monthly_donor_click` | Ao clicar em um link para o Apoia-se |

Ambos incluem `button_location` e `site_language`. Para relatórios detalhados por esses parâmetros, registre dimensões personalizadas de escopo Evento no GA4. Os eventos medem intenção, não doações confirmadas. A medição otimizada do fluxo também está ativada.

Validação: abra o site de produção, aceite estatísticas e confira Relatórios → Tempo real na propriedade da ONG. Bloqueadores de anúncios podem impedir a tag. As visitas locais de desenvolvimento não são enviadas ao Analytics.
