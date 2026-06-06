-- LifeOS / Supabase Postgres Schema
-- Target: Supabase (PostgreSQL)
-- Execute this script in the Supabase SQL editor.

begin;

-- Extensions
create extension if not exists pgcrypto;

-- Helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------
-- Core
-- ----------

-- User profile (optional, but useful for preferences)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text default 'America/Sao_Paulo',
  theme text default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = user_id);
create policy "profiles_upsert_own" on public.profiles
for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Tags (global system tags per user)
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);
create index if not exists tags_user_id_idx on public.tags(user_id);
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

alter table public.tags enable row level security;
create policy "tags_crud_own" on public.tags
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Favorites (mark any entity as favorite)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null, -- e.g. 'recipe', 'media', 'goal'
  entity_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_id)
);
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_entity_idx on public.favorites(entity_type, entity_id);

alter table public.favorites enable row level security;
create policy "favorites_crud_own" on public.favorites
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Attachments / Files metadata (Storage path lives here)
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null default 'lifeos',
  path text not null,
  mime_type text,
  size_bytes bigint,
  title text,
  created_at timestamptz not null default now(),
  unique (user_id, bucket, path)
);
create index if not exists attachments_user_id_idx on public.attachments(user_id);

alter table public.attachments enable row level security;
create policy "attachments_crud_own" on public.attachments
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Central tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo', -- todo|doing|done|blocked
  priority text default 'medium', -- low|medium|high
  due_at timestamptz,
  module text, -- faculdade|casa|metas|...
  source_entity_type text,
  source_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_due_at_idx on public.tasks(user_id, due_at);
create index if not exists tasks_status_idx on public.tasks(user_id, status);
create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;
create policy "tasks_crud_own" on public.tasks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Central events (agenda)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  module text,
  source_entity_type text,
  source_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_starts_at_idx on public.events(user_id, starts_at);
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;
create policy "events_crud_own" on public.events
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Notes (generic)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  module text,
  source_entity_type text,
  source_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_id_idx on public.notes(user_id);
create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();

alter table public.notes enable row level security;
create policy "notes_crud_own" on public.notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Faculdade
-- ----------
create table if not exists public.faculdade_materias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  professor text,
  semestre text,
  cor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faculdade_materias_user_id_idx on public.faculdade_materias(user_id);
create trigger faculdade_materias_set_updated_at
before update on public.faculdade_materias
for each row execute function public.set_updated_at();

alter table public.faculdade_materias enable row level security;
create policy "faculdade_materias_crud_own" on public.faculdade_materias
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.faculdade_trabalhos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  materia_id uuid not null references public.faculdade_materias(id) on delete cascade,
  titulo text not null,
  descricao text,
  status text not null default 'todo',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faculdade_trabalhos_user_id_idx on public.faculdade_trabalhos(user_id);
create index if not exists faculdade_trabalhos_materia_idx on public.faculdade_trabalhos(materia_id);
create trigger faculdade_trabalhos_set_updated_at
before update on public.faculdade_trabalhos
for each row execute function public.set_updated_at();

alter table public.faculdade_trabalhos enable row level security;
create policy "faculdade_trabalhos_crud_own" on public.faculdade_trabalhos
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.faculdade_provas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  materia_id uuid not null references public.faculdade_materias(id) on delete cascade,
  titulo text not null,
  descricao text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  local text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faculdade_provas_user_id_idx on public.faculdade_provas(user_id);
create index if not exists faculdade_provas_materia_idx on public.faculdade_provas(materia_id);
create index if not exists faculdade_provas_starts_idx on public.faculdade_provas(user_id, starts_at);
create trigger faculdade_provas_set_updated_at
before update on public.faculdade_provas
for each row execute function public.set_updated_at();

alter table public.faculdade_provas enable row level security;
create policy "faculdade_provas_crud_own" on public.faculdade_provas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.faculdade_materiais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  materia_id uuid references public.faculdade_materias(id) on delete set null,
  titulo text not null,
  tipo text, -- pdf|link|arquivo|nota
  url text,
  attachment_id uuid references public.attachments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faculdade_materiais_user_id_idx on public.faculdade_materiais(user_id);
create index if not exists faculdade_materiais_materia_idx on public.faculdade_materiais(materia_id);
create trigger faculdade_materiais_set_updated_at
before update on public.faculdade_materiais
for each row execute function public.set_updated_at();

alter table public.faculdade_materiais enable row level security;
create policy "faculdade_materiais_crud_own" on public.faculdade_materiais
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Casa / Compras
-- ----------

-- Shopping list items (one list per user, but supports multiple lists)
create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Principal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shopping_lists_user_id_idx on public.shopping_lists(user_id);
create trigger shopping_lists_set_updated_at
before update on public.shopping_lists
for each row execute function public.set_updated_at();

alter table public.shopping_lists enable row level security;
create policy "shopping_lists_crud_own" on public.shopping_lists
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_id uuid not null references public.shopping_lists(id) on delete cascade,
  name text not null,
  quantity text,
  category text,
  is_urgent boolean not null default false,
  is_done boolean not null default false,
  source_entity_type text,
  source_entity_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shopping_items_user_id_idx on public.shopping_items(user_id);
create index if not exists shopping_items_list_idx on public.shopping_items(list_id);
create index if not exists shopping_items_urgent_idx on public.shopping_items(user_id, is_urgent, is_done);
create trigger shopping_items_set_updated_at
before update on public.shopping_items
for each row execute function public.set_updated_at();

alter table public.shopping_items enable row level security;
create policy "shopping_items_crud_own" on public.shopping_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Domestic inventory
create table if not exists public.casa_estoque_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity text,
  location text,
  min_quantity text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists casa_estoque_user_id_idx on public.casa_estoque_itens(user_id);
create trigger casa_estoque_set_updated_at
before update on public.casa_estoque_itens
for each row execute function public.set_updated_at();

alter table public.casa_estoque_itens enable row level security;
create policy "casa_estoque_crud_own" on public.casa_estoque_itens
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Cleaning schedule
create table if not exists public.casa_limpeza_tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  frequency text, -- daily|weekly|monthly|custom
  next_due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists casa_limpeza_user_id_idx on public.casa_limpeza_tarefas(user_id);
create index if not exists casa_limpeza_next_due_idx on public.casa_limpeza_tarefas(user_id, next_due_at);
create trigger casa_limpeza_set_updated_at
before update on public.casa_limpeza_tarefas
for each row execute function public.set_updated_at();

alter table public.casa_limpeza_tarefas enable row level security;
create policy "casa_limpeza_crud_own" on public.casa_limpeza_tarefas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Cardápio
-- ----------
create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  categoria text,
  tempo_preparo_min integer,
  foto_attachment_id uuid references public.attachments(id) on delete set null,
  instrucoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists receitas_user_id_idx on public.receitas(user_id);
create trigger receitas_set_updated_at
before update on public.receitas
for each row execute function public.set_updated_at();

alter table public.receitas enable row level security;
create policy "receitas_crud_own" on public.receitas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.receita_ingredientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  receita_id uuid not null references public.receitas(id) on delete cascade,
  ingrediente text not null,
  quantidade text,
  created_at timestamptz not null default now()
);
create index if not exists receita_ingredientes_user_id_idx on public.receita_ingredientes(user_id);
create index if not exists receita_ingredientes_receita_idx on public.receita_ingredientes(receita_id);

alter table public.receita_ingredientes enable row level security;
create policy "receita_ingredientes_crud_own" on public.receita_ingredientes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Weekly meal plan
create table if not exists public.cardapio_semana (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, week_start)
);
create index if not exists cardapio_semana_user_id_idx on public.cardapio_semana(user_id);
create trigger cardapio_semana_set_updated_at
before update on public.cardapio_semana
for each row execute function public.set_updated_at();

alter table public.cardapio_semana enable row level security;
create policy "cardapio_semana_crud_own" on public.cardapio_semana
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.cardapio_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cardapio_id uuid not null references public.cardapio_semana(id) on delete cascade,
  day date not null,
  meal text not null, -- cafe|almoco|jantar|lanche
  receita_id uuid references public.receitas(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists cardapio_itens_user_id_idx on public.cardapio_itens(user_id);
create index if not exists cardapio_itens_cardapio_idx on public.cardapio_itens(cardapio_id);
create index if not exists cardapio_itens_day_idx on public.cardapio_itens(user_id, day);
create trigger cardapio_itens_set_updated_at
before update on public.cardapio_itens
for each row execute function public.set_updated_at();

alter table public.cardapio_itens enable row level security;
create policy "cardapio_itens_crud_own" on public.cardapio_itens
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Filmes / Séries / Docs (mídia)
-- ----------
create table if not exists public.midia_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null, -- filme|serie|documentario
  nome text not null,
  plataforma text,
  categoria text,
  nota numeric(3,1),
  status text default 'pendente', -- pendente|andamento|concluido
  minutes_watched integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists midia_itens_user_id_idx on public.midia_itens(user_id);
create index if not exists midia_itens_status_idx on public.midia_itens(user_id, status);
create trigger midia_itens_set_updated_at
before update on public.midia_itens
for each row execute function public.set_updated_at();

alter table public.midia_itens enable row level security;
create policy "midia_itens_crud_own" on public.midia_itens
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Estudos
-- ----------
create table if not exists public.estudos_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null, -- curso|video|livro|artigo|podcast
  titulo text not null,
  link text,
  categoria text,
  prioridade text default 'medium',
  status text default 'pendente',
  progresso integer default 0, -- 0..100
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists estudos_itens_user_id_idx on public.estudos_itens(user_id);
create index if not exists estudos_itens_status_idx on public.estudos_itens(user_id, status);
create trigger estudos_itens_set_updated_at
before update on public.estudos_itens
for each row execute function public.set_updated_at();

alter table public.estudos_itens enable row level security;
create policy "estudos_itens_crud_own" on public.estudos_itens
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Ideias
-- ----------
create table if not exists public.ideias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text,
  conteudo text not null,
  categoria text,
  prioridade text default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ideias_user_id_idx on public.ideias(user_id);
create trigger ideias_set_updated_at
before update on public.ideias
for each row execute function public.set_updated_at();

alter table public.ideias enable row level security;
create policy "ideias_crud_own" on public.ideias
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Metas
-- ----------
create table if not exists public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  periodo text not null, -- anual|trimestral|mensal|semanal
  starts_on date,
  ends_on date,
  progresso integer default 0,
  status text default 'ativa', -- ativa|concluida|pausada
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists metas_user_id_idx on public.metas(user_id);
create index if not exists metas_periodo_idx on public.metas(user_id, periodo);
create trigger metas_set_updated_at
before update on public.metas
for each row execute function public.set_updated_at();

alter table public.metas enable row level security;
create policy "metas_crud_own" on public.metas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Biblioteca
-- ----------
create table if not exists public.biblioteca_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null, -- livro|artigo|pdf|video|link
  titulo text not null,
  fonte text,
  categoria text,
  status text default 'pendente', -- pendente|lendo|concluido
  tags text[],
  url text,
  attachment_id uuid references public.attachments(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists biblioteca_itens_user_id_idx on public.biblioteca_itens(user_id);
create index if not exists biblioteca_itens_status_idx on public.biblioteca_itens(user_id, status);
create trigger biblioteca_itens_set_updated_at
before update on public.biblioteca_itens
for each row execute function public.set_updated_at();

alter table public.biblioteca_itens enable row level security;
create policy "biblioteca_itens_crud_own" on public.biblioteca_itens
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Assistente / Ingestão
-- ----------
create table if not exists public.ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, -- image|pdf|text|link
  input_text text,
  attachment_id uuid references public.attachments(id) on delete set null,
  status text not null default 'pending', -- pending|processing|done|failed
  department text, -- faculdade|casa|compras|...
  extracted_json jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ingestion_jobs_user_id_idx on public.ingestion_jobs(user_id);
create index if not exists ingestion_jobs_status_idx on public.ingestion_jobs(user_id, status);
create trigger ingestion_jobs_set_updated_at
before update on public.ingestion_jobs
for each row execute function public.set_updated_at();

alter table public.ingestion_jobs enable row level security;
create policy "ingestion_jobs_crud_own" on public.ingestion_jobs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------
-- Busca global (FTS)
-- ----------

-- A estratégia aqui é simples e transparente:
-- 1) Cada tabela importante ganha uma coluna `search_text` virtual via view (em vez de duplicar dados)
-- 2) Um VIEW `global_search` unifica tudo, e você busca nele com `plainto_tsquery`.

create or replace view public.global_search as
select
  'task'::text as entity_type,
  t.id as entity_id,
  t.user_id,
  t.title as title,
  t.description as snippet,
  to_tsvector('portuguese', coalesce(t.title,'') || ' ' || coalesce(t.description,'')) as document
from public.tasks t
union all
select
  'event', e.id, e.user_id, e.title, e.description,
  to_tsvector('portuguese', coalesce(e.title,'') || ' ' || coalesce(e.description,''))
from public.events e
union all
select
  'idea', i.id, i.user_id, coalesce(i.titulo,''), i.conteudo,
  to_tsvector('portuguese', coalesce(i.titulo,'') || ' ' || coalesce(i.conteudo,''))
from public.ideias i
union all
select
  'library', b.id, b.user_id, b.titulo, coalesce(b.fonte,'') || ' ' || coalesce(b.url,''),
  to_tsvector('portuguese', coalesce(b.titulo,'') || ' ' || coalesce(b.fonte,'') || ' ' || coalesce(b.url,''))
from public.biblioteca_itens b
union all
select
  'study', s.id, s.user_id, s.titulo, coalesce(s.link,''),
  to_tsvector('portuguese', coalesce(s.titulo,'') || ' ' || coalesce(s.link,''))
from public.estudos_itens s
union all
select
  'media', m.id, m.user_id, m.nome, coalesce(m.plataforma,'') || ' ' || coalesce(m.categoria,''),
  to_tsvector('portuguese', coalesce(m.nome,'') || ' ' || coalesce(m.plataforma,'') || ' ' || coalesce(m.categoria,''))
from public.midia_itens m
union all
select
  'recipe', r.id, r.user_id, r.titulo, coalesce(r.instrucoes,''),
  to_tsvector('portuguese', coalesce(r.titulo,'') || ' ' || coalesce(r.instrucoes,''))
from public.receitas r;

-- Indexing a view directly isn't possible; for performance, materialize later if needed.
-- For MVP, this view is fine.

-- ----------
-- Audit log (histórico de alterações)
-- ----------

create table if not exists public.audit_log (
  id bigserial primary key,
  user_id uuid,
  table_name text not null,
  action text not null, -- INSERT|UPDATE|DELETE
  row_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_log_user_id_idx on public.audit_log(user_id);
create index if not exists audit_log_table_idx on public.audit_log(table_name);

alter table public.audit_log enable row level security;
create policy "audit_log_select_own" on public.audit_log
for select using (auth.uid() = user_id);

create or replace function public.audit_trigger()
returns trigger
language plpgsql
as $$
declare
  v_user uuid;
  v_row uuid;
begin
  v_user := auth.uid();

  if (tg_op = 'INSERT') then
    v_row := (to_jsonb(new)->>'id')::uuid;
    insert into public.audit_log(user_id, table_name, action, row_id, new_data)
    values (v_user, tg_table_name, tg_op, v_row, to_jsonb(new));
    return new;
  elsif (tg_op = 'UPDATE') then
    v_row := (to_jsonb(new)->>'id')::uuid;
    insert into public.audit_log(user_id, table_name, action, row_id, old_data, new_data)
    values (v_user, tg_table_name, tg_op, v_row, to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    v_row := (to_jsonb(old)->>'id')::uuid;
    insert into public.audit_log(user_id, table_name, action, row_id, old_data)
    values (v_user, tg_table_name, tg_op, v_row, to_jsonb(old));
    return old;
  end if;

  return null;
end;
$$;

-- Attach audit triggers to core tables (add more as you expand)
-- Note: In Supabase, triggers run with the caller role; auth.uid() is available.

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'audit_tasks') then
    create trigger audit_tasks after insert or update or delete on public.tasks
    for each row execute function public.audit_trigger();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'audit_events') then
    create trigger audit_events after insert or update or delete on public.events
    for each row execute function public.audit_trigger();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'audit_shopping_items') then
    create trigger audit_shopping_items after insert or update or delete on public.shopping_items
    for each row execute function public.audit_trigger();
  end if;
end
$$;

commit;
