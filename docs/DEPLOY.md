# Deploy (Vercel + Supabase + n8n + IA local)

## 1) Supabase
1. Crie o projeto (Free)
2. Rode `supabase/schema.sql`
3. Crie bucket `lifeos` (privado)
4. Copie:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 2) Vercel
1. Suba este repositório (GitHub)
2. Importe no Vercel (Free)
3. Configure env vars no Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_WEBHOOK_BASE_URL` (URL pública do seu n8n)
4. Deploy

## 3) n8n (Community)
### Opção A: rodar local (dev)
Use `docs/docker-compose.local.yml`.

### Opção B: rodar em cloud grátis
É o ponto mais chato do “100% free”. Algumas opções variam e mudam com o tempo.
Recomendação prática:
- Rodar n8n em uma máquina própria (PC/mini-PC) ou em um free-tier que você já tenha.

## 4) IA local
- Ollama e PaddleOCR rodam localmente e o n8n chama via HTTP.

## Observação importante
Vercel (Free) **não** hospeda Ollama/PaddleOCR. A proposta é:
- UI+API no Vercel
- Dados no Supabase
- Automações no n8n
- IA local em máquina sua

