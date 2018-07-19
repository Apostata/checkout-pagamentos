# Checkout Pagamentos

## Requisitos
* instalar node.js (utilizar as versões LTS).
* Caso não tenha instalado o Nodemon: npm install -g nodemon,
* Caso esteja rodando no windows: npm install -g win-node-env

## Instruções
* Clone o projeto.
* para ambos os ambientes abaixo, para executar os comandos é necessário navegar até a pasta raiz no terminal.

### Ambiente de desenvolvimento
* no termimal execute: npm run dev.
* No navegador digitar: localhost:8989 ou usar porta caso tenha customizada.

### Ambiente de Produção
* no termimal execute: npm run build, para gerar os arquivos já com compressão gzip.
* Após termino do bundle, ainda no terminal, executar npm run prod
* No navegador digitar: localhost:8989 ou usar porta caso tenha customizada.