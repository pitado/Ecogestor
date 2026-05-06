# EcoGestor Wireframe - Tablet Android 13

Projeto em **Next.js + React + TypeScript** para publicar na Vercel e apresentar um wireframe navegavel do app EcoGestor.

## Objetivo

O prototipo atende ao problema da atividade MAPA: um app para um empreendedor de loja de produtos sustentaveis acompanhar estoque, gerenciar pedidos e receber notificacoes de estoque baixo.

## Modulos incluidos

- **Modulo Inicial**: login e dashboard com resumo de estoque, pedidos pendentes e alertas importantes.
- **Modulo Gestao Estoque**: tabela com produtos, acoes de visualizar, editar quantidade/dados e inserir novo produto.
- **Modulo Gestao de Pedidos**: lista de pedidos ordenavel por cliente, data de solicitacao ou status, com detalhes e atualizacao de status.
- **Modulo Notificacoes**: configuracao de alertas com notificacao dentro do app, push no tablet, e-mail e resumo diario.

## Telas navegaveis

1. Login
2. Tela inicial / Dashboard
3. Gestao de estoque
4. Visualizar produto
5. Editar produto / ajustar quantidade
6. Novo produto
7. Alerta de estoque baixo
8. Lista de pedidos
9. Detalhes do pedido
10. Atualizar status do pedido
11. Configuracoes de notificacoes
12. Confirmacao

## Requisitos de usabilidade, acessibilidade e seguranca considerados

- Navegacao principal fixa por menu lateral.
- Botoes grandes para uso em tablet.
- Icones acompanhados de texto ou legenda.
- Contraste adequado e estados de foco visiveis.
- Tabelas com rolagem horizontal para responsividade.
- Mensagens claras de sucesso, alerta e confirmacao.
- Login com senha mascarada.
- Botao de sair.
- Observacao de registro de alteracoes em estoque.
- Dados de clientes acessiveis apenas apos autenticacao simulada.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

## Como subir para o GitHub

```bash
git init
git add .
git commit -m "feat: cria wireframe EcoGestor para tablet Android"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ecogestor-wireframe-vercel.git
git push -u origin main
```

## Como publicar na Vercel

1. Entre na Vercel.
2. Clique em **Add New Project**.
3. Importe o repositorio do GitHub.
4. Framework Preset: **Next.js**.
5. Build Command: `npm run build`.
6. Output Directory: deixe o padrao da Vercel para Next.js.
7. Clique em **Deploy**.

## Como gerar PDF para entrega

Depois de rodar ou publicar o projeto:

1. Abra o app no navegador.
2. Navegue por cada modulo.
3. Use o botao **Exportar PDF** ou `Ctrl + P` / `Cmd + P`.
4. Salve como PDF.
5. Coloque os prints/telas no template MAPA exigido pela disciplina, caso o professor solicite o template oficial.

## Observacao importante

A atividade original pede construcao em Miro e entrega em template DOC/PDF. Este projeto em Vercel ajuda a criar um prototipo navegavel e organizado, mas confira se a sua turma aceita link/prototipo web como complemento ou se o arquivo final precisa conter imagens das telas dentro do template oficial.
