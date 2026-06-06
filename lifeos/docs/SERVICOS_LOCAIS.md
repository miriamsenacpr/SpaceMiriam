# Serviços locais (Ollama + PaddleOCR) — blueprint

## Ollama
- Porta padrão: `11434`
- Modelo: `qwen3`

Teste:
```bash
curl http://localhost:11434/api/generate \
  -H 'content-type: application/json' \
  -d '{"model":"qwen3","prompt":"retorne {\"ok\":true} em JSON","stream":false}'
```

## PaddleOCR
A forma mais simples é expor um microserviço HTTP local (python) com endpoint `/ocr`:
- Input: imagem/PDF (binário) ou caminho local
- Output: JSON com texto + caixas (opcional)

Blueprint de contrato:
```json
{
  "text": "...",
  "blocks": [
    {"text":"...","bbox":[0,0,10,10],"confidence":0.98}
  ]
}
```

## Docker compose (opcional)
Se você quiser orquestrar localmente (n8n + ollama + ocr), crie um compose.
Eu deixei um arquivo pronto em `docs/docker-compose.local.yml`.
