# Supabase setup (LifeOS)

## 1) SQL
Rode: `supabase/schema.sql` no SQL Editor do Supabase.

## 2) Storage
Crie um bucket chamado `lifeos` (privado).

### Suggested folder paths
- `uploads/{user_id}/{yyyy}/{mm}/{filename}`
- `library/{user_id}/{...}`
- `recipes/{user_id}/{...}`

## 3) Auth
Habilite Email/Password (mínimo). OAuth é opcional.

## 4) Policies (Storage)
A política exata depende do bucket e do padrão de path.
Recomendação prática (MVP): manter bucket `lifeos` privado e só acessar via signed URLs.

## 5) Busca global
Use a view `public.global_search`.
Exemplo:
```sql
select entity_type, entity_id, title
from public.global_search
where user_id = auth.uid()
  and document @@ plainto_tsquery('portuguese', 'prova cálculo')
order by ts_rank(document, plainto_tsquery('portuguese', 'prova cálculo')) desc
limit 20;
```
