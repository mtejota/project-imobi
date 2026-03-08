# Zeety Dashboard

Frontend do CRM imobiliario Zeety, construido com React + Vite.

## Estado atual

O front-end esta funcional para demo/comercial visual e homologacao de interface.

- Roteamento multi-tenant ativo com `react-router-dom`
- Login/cadastro visual com sessao local
- Dashboard com metricas animadas e alertas dinamicos (mock em tempo real)
- Pipeline com drag-and-drop, confirmacao de mudanca, score de urgencia e exclusao de negociacao
- Agenda com filtros por periodo, agenda inteligente e lembretes de deslocamento
- Modulo de suporte com abertura de chamado e anexo de imagem
- Tela de relatorios com selecao de periodo e fluxo de exportacao PDF (UI pronta)

## Stack tecnica

- React 18
- Vite 7
- React Router DOM 6
- JavaScript (ES Modules)
- CSS global + estilos inline nos componentes

## Como rodar

Pre-requisitos:

- Node.js `20+`
- npm `10+`

Instalacao e execucao:

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
npm run preview
```

## Rotas principais

- `/login`
- `/:tenant/dashboard`
- `/:tenant/leads`
- `/:tenant/pipeline`
- `/:tenant/whatsapp`
- `/:tenant/calendar`
- `/:tenant/properties`
- `/:tenant/metrics`
- `/:tenant/metrics/report`
- `/:tenant/documents`
- `/:tenant/support`
- `/:tenant/settings`

## Funcionalidades implementadas (front)

### Dashboard

- Cards de metricas com animacao numerica
- Feed de prioridades do dia (Top 5 acoes automaticas)
- Alertas da IA com atualizacao periodica (mock) e rolagem interna
- Notificacoes no topo com remover individual e limpar tudo

### Pipeline

- Colunas por etapa com drag-and-drop
- Confirmacao antes de mover card
- Score de urgencia por card (risco, chance de fechamento, tempo parado)
- Acao para apagar negociacao
- Contador e valor em carteira dinamicos

### Agenda

- Visoes Dia/Semana/Mes
- Dados e graficos variam por periodo
- Filtro por dia selecionado
- Agenda inteligente (prioriza por probabilidade de fechamento)
- Lembretes de deslocamento com toggle ON/OFF

### Relatorios

- KPIs e graficos variam por periodo
- Formato fixo em PDF
- Estados de geracao/exportacao e estado visual de erro

### Configuracoes

- Edicao de nome de usuario
- Upload de foto de perfil
- Campo CRECI exibido e bloqueado para edicao
- Integracoes de WhatsApp (mock visual)

## Estrutura do projeto

```text
.
├── src/
│   ├── components/
│   ├── constants/
│   ├── data/
│   ├── screens/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── package-lock.json
```

## Pendencias para producao real

- Integrar autenticacao com backend real (JWT/refresh/tenant isolation no servidor)
- Implementar exportacao PDF real no `pdfExportService`
- Trocar fluxos mockados por API real (pipeline, agenda, suporte, integracoes)
- Adicionar lint/testes automatizados (unit + smoke/e2e)

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
