# Arquitetura do LifeOS

## Visão geral
O LifeOS é um app **Next.js** (App Router) com:
- **Supabase** como backend (Auth + Postgres + Storage + RLS)
- **n8n** como orquestrador de automações (OCR/classificação/notificações)
- **Ollama (Qwen 3)** e **PaddleOCR** como serviços locais que o n8n chama

A arquitetura separa claramente:
- **UI** (páginas e componentes)
- **Domínio/dados** (schema no Postgres)
- **Ingestão** (upload → OCR → LLM → normalização → persistência)
- **Notificações** (jobs e lembretes)

## Princípios
1. **Single source of truth**: o Postgres do Supabase é a fonte primária.
2. **RLS first**: toda tabela “do usuário” tem RLS por `auth.uid()`.
3. **Eventos e itens normalizados**: tudo que vira agenda/tarefa entra em tabelas centrais.
4. **Ingestão rastreável**: todo upload gera um `ingestion_job` com logs e resultado.
5. **UI por módulo, dados compartilhados**: módulos diferentes leem as mesmas tabelas centrais quando aplicável.

## Componentes principais
### 1) App Next.js
- Rotas em `src/app/(app)` (área logada)
- Camada de dados via `@supabase/supabase-js`
- UI com shadcn/ui

### 2) Supabase
- Auth (email/password ou OAuth)
- Storage (bucket para uploads e anexos)
- Postgres com:
  - tabelas por módulo
  - tabelas centrais (tarefas, eventos, tags, anexos)
  - busca global (FTS)
  - histórico (audit log)

### 3) n8n
Responsável por:
- receber webhooks do app (novo upload)
- chamar OCR + LLM
- transformar resultado em payloads de “ações” (criar prova, criar compra etc.)
- gravar no Supabase (via REST ou PostgREST)
- disparar notificações (ex.: e-mail) e atualizar itens do dashboard

### 4) Serviços locais
- **Ollama** expõe API HTTP local (LLM)
- **PaddleOCR** roda como microserviço HTTP simples (container) ou via node/python

## Fluxo: Assistente (ingestão)
1. Usuário envia **imagem/pdf/texto/link**
2. App cria registro `ingestion_job` (status=pending) e salva arquivo no Storage
3. App chama webhook do n8n com `{job_id, storage_path, mime_type, user_id}`
4. n8n:
   - baixa arquivo do Storage
   - OCR (se necessário)
   - LLM (Qwen3 via Ollama) para **extrair entidades** + **classificar**
   - gera lista de ações (ex.: `create_exam`, `add_to_shopping_list`, ...)
   - executa ações no Postgres
   - atualiza `ingestion_job` (status=done/failed) + salva `extracted_json`

## Pastas importantes
- `docs/` documentação
- `supabase/` SQL/RLS
- `n8n/` exports de fluxos
- `src/components/lifeos/` componentes do produto (shell, widgets, cards)

## Convenções de dados
- IDs: `uuid`
- Timestamps: `timestamptz`
- Toda tabela com dados por usuário inclui `user_id uuid not null references auth.users(id)`
- `created_at`, `updated_at`

## Segurança
- RLS obrigatório
- `service_role` somente em server-side (API Routes / Server Actions)
- Storage com policies por usuário

