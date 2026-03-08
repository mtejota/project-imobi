#!/usr/bin/env bash
set -euo pipefail

BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
RED='\033[0;31m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

step() { echo -e "\n${YELLOW}[$1/6]${NC} $2"; }
ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "\n  ${RED}✗ ERRO: $1${NC}\n"; exit 1; }

PROJECT="zeety-dashboard"

step "1" "Verificando dependências do sistema..."
command -v node >/dev/null || fail "Node.js não encontrado (18+)"
NODE_V=$(node -v | sed 's/v//' | cut -d. -f1)
[ "$NODE_V" -lt 18 ] && fail "Node.js 18+ necessário. Atual: $(node -v)"
command -v npm >/dev/null || fail "npm não encontrado"
ok "Node $(node -v) · npm $(npm -v)"

step "2" "Criando estrutura do projeto..."
if [ -d "$PROJECT" ]; then
  rm -rf "$PROJECT"
  ok "Pasta anterior removida"
fi
mkdir -p "$PROJECT/src"
cd "$PROJECT"
ok "Estrutura criada"

step "3" "Configurando package.json e instalando dependências..."
cat > package.json << 'PKG'
{
  "name": "zeety-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0"
  }
}
PKG
npm install --silent
ok "Dependências instaladas"

step "4" "Gerando arquivos do projeto..."
cat > vite.config.js << 'VITE'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
})
VITE

cat > index.html << 'HTML'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zeety Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
HTML

cat > src/index.css << 'CSS'
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Sora', system-ui, sans-serif; background: #f8fafc; color: #0f172a; }
.app { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
.sidebar { background: #fff; border-right: 1px solid #e2e8f0; padding: 20px; }
.logo { font-weight: 800; margin-bottom: 16px; }
.nav { display: grid; gap: 8px; }
.nav button { border: 1px solid #e2e8f0; background: #fff; border-radius: 10px; padding: 10px; text-align: left; cursor: pointer; }
.nav button.active { background: #eff6ff; border-color: #93c5fd; color: #1d4ed8; }
.main { padding: 28px; }
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-top: 16px; }
.kpis { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 12px; margin-top: 12px; }
.kpi { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
@media (max-width: 900px) {
  .app { grid-template-columns: 1fr; }
  .kpis { grid-template-columns: repeat(2, minmax(120px, 1fr)); }
}
CSS

cat > src/main.jsx << 'MAIN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
MAIN

cat > src/App.jsx << 'APP'
import { useState } from 'react'

const screens = [
  'Dashboard',
  'Leads',
  'Pipeline',
  'WhatsApp IA',
  'Agenda',
  'Imóveis',
  'Métricas',
  'Documentos',
]

export default function App() {
  const [active, setActive] = useState('Dashboard')

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">Zeety CRM</div>
        <div className="nav">
          {screens.map((s) => (
            <button
              key={s}
              className={active === s ? 'active' : ''}
              onClick={() => setActive(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </aside>
      <main className="main">
        <h1>{active}</h1>
        <p>Base inicial do dashboard Zeety com 8 telas navegáveis.</p>
        <div className="kpis">
          <div className="kpi"><strong>14</strong><div>Leads hoje</div></div>
          <div className="kpi"><strong>4</strong><div>Visitas</div></div>
          <div className="kpi"><strong>9</strong><div>Negociações</div></div>
          <div className="kpi"><strong>R$ 3.2M</strong><div>Fechados mês</div></div>
        </div>
        <div className="card">
          Próximo passo: integrar dados reais da API e WebSocket para atualização em tempo real.
        </div>
      </main>
    </div>
  )
}
APP

cat > .env << 'ENV'
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
VITE_ENV=development
ENV

cat > .gitignore << 'GIT'
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
GIT

cat > README.md << 'README'
# Zeety Dashboard

Projeto frontend React + Vite para CRM imobiliário com IA.

## Rodar

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Telas

- Dashboard
- Leads
- Pipeline
- WhatsApp IA
- Agenda
- Imóveis
- Métricas
- Documentos
README
ok "Arquivos gerados"

step "5" "Verificando build de produção..."
npm run build --silent
ok "Build OK"

step "6" "Concluído"
echo -e "\n${GREEN}${BOLD}Projeto criado em ./$PROJECT${NC}"
echo -e "${CYAN}Execute: cd $PROJECT && npm run dev${NC}"
