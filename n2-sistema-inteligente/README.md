# N2 — Sistema Inteligente para Recomendação de Filmes (IMDB)

> Inteligência Artificial — Prof. Claudinei Dias (Ney)

Sistema inteligente em três camadas: PLN com Naive Bayes, Inferência Fuzzy Mamdani e Algoritmo Genético (DEAP).

---

## Como rodar com Docker (recomendado)

### Pré-requisitos
- Docker Desktop instalado (Windows/Mac) ou Docker Engine (Linux)
- Docker Compose v2+

### 1. Clone o projeto

```bash
git clone <url-do-repositorio>
cd n2-sistema-inteligente
```

### 2. (Opcional, mas recomendado) Adicione o dataset real do IMDB

Baixe o arquivo `IMDB Dataset.csv` em:
https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews

Renomeie para `IMDB_Dataset.csv` e coloque na pasta `data/`:

```
n2-sistema-inteligente/
└── data/
    └── IMDB_Dataset.csv   ← aqui
```

Sem o dataset, o sistema usa dados sintéticos automaticamente para demonstração.

### 3. Suba os containers

```bash
docker compose up --build
```

O backend treina o modelo automaticamente no primeiro start (pode levar 1-2 min com o dataset real).

### 4. Acesse no navegador

| Serviço | URL |
|---------|-----|
| Interface Web | http://localhost:3000 |
| API REST (docs) | http://localhost:8000/docs |

---

## Estrutura do projeto

```
n2-sistema-inteligente/
├── docker-compose.yml
├── data/                        # Dataset e modelos treinados (volume compartilhado)
│   ├── IMDB_Dataset.csv         # (adicionar manualmente)
│   ├── modelo_nb.pkl            # gerado automaticamente
│   ├── vectorizer.pkl           # gerado automaticamente
│   └── metricas.pkl             # gerado automaticamente
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py              # FastAPI + startup de treinamento
│       ├── api/
│       │   ├── nlp.py           # POST /api/analyze — Camada I
│       │   ├── fuzzy.py         # POST /api/fuzzy — Camada II
│       │   └── genetic.py       # POST /api/recommend — Camada III
│       └── core/
│           ├── trainer.py       # Pré-processamento + Naive Bayes
│           ├── fuzzy_system.py  # Sistema Mamdani com scikit-fuzzy
│           └── genetic_algorithm.py  # GA com DEAP
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── components/Layout.jsx
        ├── pages/
        │   ├── PageAnalise.jsx      # Camada I — análise de texto
        │   ├── PageFuzzy.jsx        # Camada II — gráficos de pertinência
        │   └── PageRecomendacao.jsx # Camada III — pipeline completo
        └── services/api.js
```

---

## Divisão sugerida entre integrantes

| Integrante | Responsabilidade |
|------------|-----------------|
| 1 | `backend/app/core/trainer.py` — pré-processamento e Naive Bayes |
| 2 | `backend/app/core/fuzzy_system.py` — modelagem fuzzy |
| 3 | `backend/app/core/genetic_algorithm.py` — algoritmo genético |
| 4 | `frontend/src/pages/` — interface web e gráficos |
| 5 | `docker-compose.yml`, integração e apresentação |

---

## Endpoints da API

### `POST /api/analyze`
Analisa sentimento de um texto.
```json
{ "texto": "This movie was amazing!" }
```

### `POST /api/fuzzy`
Calcula score fuzzy.
```json
{ "prob_positivo": 0.85, "nota_filme": 8.5 }
```

### `POST /api/recommend`
Pipeline completo com GA.
```json
{
  "filmes": [{ "titulo": "Film A", "review": "Great film!", "nota": 8.5 }],
  "n_recomendados": 5,
  "n_geracoes": 50
}
```

---

## Comandos úteis

```bash
# Ver logs do backend
docker compose logs backend -f

# Forçar retreinamento (apaga modelo salvo)
rm data/modelo_nb.pkl data/vectorizer.pkl data/metricas.pkl
docker compose restart backend

# Parar tudo
docker compose down
```
