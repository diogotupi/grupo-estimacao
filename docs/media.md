# Mídias hospedadas no GitHub Pages

Em 10/10/2026, todas as mídias do Cloudinary utilizadas pelo site foram copiadas
para `assets/media/`: 7 vídeos e 9 imagens (foto, miniaturas e pôster do topo).
Foram preservadas as mesmas versões que o site usava, sem recompressão local.

O site usa apenas caminhos relativos para essas mídias. Não precisa da conta
Cloudinary para exibir o topo, a galeria ou as histórias dos animais.

`assets/media/manifest.json` registra a URL de origem, tamanho, tipo e SHA-256 de
cada arquivo. As URLs nesse manifesto são somente documentação de origem:
nenhum código do site carrega o manifesto nem faz requisições a elas.

Validação local: `node scripts/verify-media.mjs`.
Validação da publicação: `node scripts/verify-media.mjs https://ongestimacao.org/`.
O teste remoto compara integralmente o conteúdo publicado com os hashes locais.

`scripts/migrate-cloudinary.mjs` é o utilitário usado para baixar as mídias;
não é executado durante o funcionamento ou a publicação do site. Após a exclusão
do Cloudinary, os arquivos versionados no Git são a fonte de recuperação.

Esta migração cobre todas as mídias referenciadas pelo site, não arquivos
adicionais que possam existir na biblioteca da conta Cloudinary.
