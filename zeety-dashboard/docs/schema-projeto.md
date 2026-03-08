# Schema do Projeto Zeety Dashboard

Data: 08/03/2026  
Objetivo: visualizar a estrutura funcional e de dados antes do inicio do backend.

## 1) Arquitetura (visao geral)

- Frontend: React + Vite
- Roteamento: `react-router-dom`
- Estado atual: dados mockados no frontend
- Modelo alvo: multi-tenant (isolamento por cliente)

Fluxo alvo:
1. Usuario cria conta
2. Sistema cria tenant
3. Usuario autentica
4. Front consome APIs do tenant autenticado

## 2) Modulos de tela (frontend)

- Autenticacao
  - Login
  - Cadastro (nome, email, senha, CRECI)
- Dashboard
  - Metricas animadas
  - Alertas IA
  - Feed de prioridades do dia
  - Previsao de comissao
- Pipeline
  - Cards por etapa
  - Score de urgencia e risco
  - Drag and drop com confirmacao
  - Excluir negociacao
- Agenda
  - Calendario por periodo
  - Filtro por data selecionada
  - Agenda inteligente
- WhatsApp IA
  - Espelhamento de conversas (layout pronto)
  - Integracao via oficial e nao oficial (front)
- Relatorios
  - Geracao e exportacao PDF (fluxo de UI pronto)
- Configuracoes
  - Nome do usuario
  - Email
  - CRECI (somente leitura)
  - Foto de perfil
  - Integracao WhatsApp
- Suporte
  - Abertura de chamado
  - Anexo de imagem

## 3) Schema de dados (backend recomendado)

### 3.1 Tenancy e acesso

#### `tenants`
- `id` (uuid, pk)
- `name` (varchar)
- `slug` (varchar, unique)
- `status` (enum: active, suspended)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `users`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk -> tenants.id)
- `name` (varchar)
- `email` (varchar, unique por tenant)
- `password_hash` (varchar)
- `creci` (varchar)
- `avatar_url` (varchar, nullable)
- `role` (enum: owner, admin, broker)
- `is_active` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `auth_sessions`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `user_id` (uuid, fk -> users.id)
- `refresh_token_hash` (varchar)
- `expires_at` (timestamp)
- `created_at` (timestamp)
- `revoked_at` (timestamp, nullable)

### 3.2 CRM comercial

#### `leads`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `owner_user_id` (uuid, fk -> users.id)
- `name` (varchar)
- `phone` (varchar)
- `email` (varchar, nullable)
- `source` (varchar, nullable)
- `status` (enum: new, contacted, qualified, lost, won)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `properties`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `code` (varchar)
- `title` (varchar)
- `address` (varchar)
- `price` (numeric)
- `property_type` (varchar)
- `status` (enum: available, reserved, sold, inactive)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `negotiations`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `lead_id` (uuid, fk -> leads.id)
- `property_id` (uuid, fk -> properties.id)
- `assigned_user_id` (uuid, fk -> users.id)
- `stage` (enum: lead, visit, proposal, docs, closing, won, lost)
- `amount` (numeric)
- `close_probability` (int 0-100)
- `urgency_score` (int 0-100)
- `risk_score` (int 0-100)
- `last_movement_at` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `negotiation_events`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `negotiation_id` (uuid, fk -> negotiations.id)
- `event_type` (enum: stage_changed, note_added, deleted, restored)
- `payload_json` (jsonb)
- `created_by` (uuid, fk -> users.id)
- `created_at` (timestamp)

### 3.3 Agenda e notificacoes

#### `appointments`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `negotiation_id` (uuid, fk -> negotiations.id, nullable)
- `assigned_user_id` (uuid, fk -> users.id)
- `title` (varchar)
- `description` (text, nullable)
- `start_at` (timestamp)
- `end_at` (timestamp)
- `status` (enum: scheduled, completed, canceled, delayed)
- `travel_reminder_enabled` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `notifications`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `user_id` (uuid, fk -> users.id)
- `type` (enum: info, warning, error, success)
- `title` (varchar)
- `message` (text)
- `is_read` (boolean)
- `created_at` (timestamp)

#### `ai_alerts`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `scope` (enum: dashboard, pipeline, agenda)
- `severity` (enum: low, medium, high)
- `title` (varchar)
- `message` (text)
- `meta_json` (jsonb)
- `created_at` (timestamp)

### 3.4 Integracoes e suporte

#### `integrations_whatsapp`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `provider` (enum: official, unofficial)
- `connection_method` (enum: qrcode, token)
- `status` (enum: disconnected, connecting, connected, error)
- `instance_id` (varchar, nullable)
- `phone_number` (varchar, nullable)
- `last_sync_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `support_tickets`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `user_id` (uuid, fk -> users.id)
- `subject` (varchar)
- `description` (text)
- `status` (enum: open, in_progress, resolved, closed)
- `priority` (enum: low, medium, high)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `support_attachments`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `ticket_id` (uuid, fk -> support_tickets.id)
- `file_name` (varchar)
- `file_url` (varchar)
- `mime_type` (varchar)
- `size_bytes` (bigint)
- `created_at` (timestamp)

### 3.5 Relatorios e documentos

#### `report_exports`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `user_id` (uuid, fk -> users.id)
- `report_type` (enum: monthly, pipeline, performance)
- `period_start` (date)
- `period_end` (date)
- `format` (enum: pdf)
- `status` (enum: processing, success, failed)
- `file_url` (varchar, nullable)
- `error_message` (text, nullable)
- `created_at` (timestamp)

#### `documents`
- `id` (uuid, pk)
- `tenant_id` (uuid, fk)
- `negotiation_id` (uuid, fk -> negotiations.id, nullable)
- `uploaded_by` (uuid, fk -> users.id)
- `document_type` (varchar)
- `file_name` (varchar)
- `file_url` (varchar)
- `created_at` (timestamp)

## 4) Regras de isolamento multi-tenant

- Toda tabela de dominio deve conter `tenant_id`.
- Toda query deve filtrar por `tenant_id` do usuario autenticado.
- Chaves unicas de negocio devem considerar tenant quando aplicavel.
- Logs e auditoria devem registrar `tenant_id` e `user_id`.

## 5) APIs minimas para inicio do backend

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /me`
- `GET/POST/PATCH /negotiations`
- `GET/POST/PATCH /appointments`
- `GET /dashboard/metrics`
- `GET /dashboard/priorities`
- `GET/POST /integrations/whatsapp`
- `GET/POST /support/tickets`
- `POST /reports/export` (pdf)

## 6) Status de prontidao

- Frontend visual: avancado e validavel
- Backend real: pendente de implementacao
- Integracoes reais: pendentes
- Testes E2E completos: pendentes

Este schema pode ser usado como base para alinhamento entre frontend, backend e QA.
