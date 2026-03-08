# Zeety Dashboard

Frontend do CRM imobiliario Zeety, construido com React + Vite.

## Visao geral

Este projeto e um dashboard single-page com navegacao interna por estado (sem roteador), com telas de:

- Dashboard
- Leads
- Pipeline
- WhatsApp
- Agenda
- Imoveis
- Metricas
- Documentos

Atualmente, os dados sao mockados em `src/data/index.js` e nao ha integracao ativa com backend.

## Stack tecnica

- React 18
- Vite 7
- JavaScript (ES Modules)
- CSS (global + estilos inline nos componentes)

## Pre-requisitos obrigatorios

- Node.js `20+` (recomendado LTS atual)
- npm `10+`

Para conferir versoes:

```bash
node -v
npm -v
```

## Instalacao

No diretorio do projeto:

```bash
npm install
```

## Configuracao de ambiente

As variaveis ficam em `.env` (arquivo ignorado pelo Git).

Exemplo:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_ENV=development
```

Variaveis definidas:

- `VITE_API_URL`: URL base de API.
- `VITE_WS_URL`: URL de WebSocket.
- `VITE_ENV`: ambiente da aplicacao.

Observacao: no estado atual do codigo, essas variaveis ainda nao sao consumidas em tempo de execucao.

## Como rodar localmente

1. Instale dependencias com `npm install`.
2. Configure o `.env` (se necessario).
3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrao, o Vite sobe em `http://localhost:5173`.

## Scripts disponiveis

- `npm run dev`: sobe ambiente de desenvolvimento com hot reload.
- `npm run build`: gera build de producao em `dist/`.
- `npm run preview`: serve localmente o build de producao.

## Build de producao

```bash
npm run build
npm run preview
```

## Estrutura de pastas

```text
.
├── src/
│   ├── components/    # Componentes reutilizaveis
│   ├── constants/     # Constantes de navegacao e icones
│   ├── data/          # Dados mockados
│   ├── screens/       # Telas do dashboard
│   ├── App.jsx        # Shell da aplicacao e controle de telas
│   ├── main.jsx       # Entry point React
│   └── index.css      # Estilos globais
├── index.html
├── vite.config.js
└── package.json
```

## Qualidade e validacao recomendada

Antes de abrir PR ou publicar:

1. Rodar `npm run build` para validar compilacao.
2. Testar navegacao principal no `npm run dev`.
3. Confirmar que nao ha segredos em arquivos versionados.

## Troubleshooting

- Porta `5173` ocupada:
  - Rode com outra porta: `npm run dev -- --port 4173`.
- Dependencias quebradas ou lock inconsistente:
  - Remova `node_modules` e rode `npm install` novamente.
- Build falha por versao de Node:
  - Atualize para Node `20+`.

## Roadmap tecnico sugerido

- Adicionar ESLint + Prettier.
- Criar `.env.example` para onboarding.
- Substituir dados mock por integracao real com API.
- Adicionar testes (unitarios e/ou de interface).
