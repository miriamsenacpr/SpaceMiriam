# n8n (LifeOS)

## Visão
O n8n recebe eventos do app (webhook) e executa o pipeline:
1. Marcar job como `processing`
2. OCR (se tiver arquivo) via PaddleOCR
3. LLM (Qwen3 via Ollama) para:
   - classificar departamento
   - extrair entidades (datas/horários/pessoas/valores/tarefas/eventos/compras/receitas/links)
   - gerar uma lista de **ações**
4. Executar ações no Supabase (insert/update em tabelas do módulo)
5. Marcar job como `done` + salvar `extracted_json`

## Webhooks esperados
### `POST /webhook/lifeos-ingest`
Payload (MVP):
```json
{
  "job_id": "uuid",
  "user_id": "uuid",
  "kind": "text"|"link"|"image"|"pdf",
  "input_text": "...",
  "storage": {"bucket":"lifeos","path":"..."}
}
```

## Arquivos
- `workflow_lifeos_ingest.sample.json`: *modelo* (não é export oficial, mas serve como blueprint)

> Quando você importar no n8n, crie um Workflow com o webhook `lifeos-ingest` e replique os passos.
