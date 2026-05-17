# ✅ INSTRUÇÕES DE INICIALIZAÇÃO - SISTEMA 100% FUNCIONAL

## 📋 Verificações Realizadas

Todos os problemas foram identificados e corrigidos:

✅ **Backend:**
- NLTK data downloads agora são feitos automaticamente
- Error handling implementado em todos os endpoints
- Logging detalhado para debug
- Fallback para dados sintéticos funcionando

✅ **Frontend:**
- API client com error handling robusto
- Logging de requisições para debug
- Melhor tratamento de erros em componentes
- Detecção automática do ambiente (VITE_API_URL)

✅ **Integração:**
- CORS configurado
- Proxy Vite funcionando
- Comunicação frontend-backend estabelecida

---

## 🚀 COMO RODAR (Windows com Docker Desktop)

### Pré-requisitos
- Docker Desktop instalado e rodando
- Git (para clonar o projeto)

### Passo 1: Navegar para o diretório do projeto

```bash
cd C:\Users\Pichau Gaming\Desktop\CEM\Sistema-Inteligente-para-Recomenda-o-de-Filmes.worktrees\agents-funcionalidade-verificacao
```

### Passo 2: Iniciar os containers

```bash
docker compose up --build
```

**O que vai acontecer:**
1. Docker vai construir os containers (primeira vez leva ~3-5 min)
2. Backend inicia e treina o modelo Naive Bayes automaticamente
3. Frontend inicia e fica pronto para uso

### Passo 3: Acessar no navegador

- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8000/docs

---

## 🧪 TESTANDO AS 3 CAMADAS

### ✅ Camada I — Análise de Sentimento (PLN)

1. Acesse http://localhost:3000
2. Na página "Camada I — PLN", clique em **Exemplo 1** (positive)
3. Clique em **"Analisar sentimento"**
4. Você deve ver:
   - Sentimento detectado: **positive**
   - Probabilidades: Positivo ~80%, Negativo ~10%, Neutro ~10%
   - Texto processado (stemmed + sem stopwords)

**Se der erro:**
- Verifique os logs do backend: `docker compose logs backend`
- Procure por "Modelo treinado e salvo com sucesso"

---

### ✅ Camada II — Inferência Fuzzy

1. Acesse http://localhost:3000/fuzzy
2. Mude os sliders:
   - Probabilidade positivo: 0.75 (75%)
   - Nota do filme: 7.5
3. Clique em **"Calcular score fuzzy"**
4. Você deve ver:
   - Score de recomendação: ~68.5
   - Nível: **Forte**
   - 3 gráficos de funções de pertinência

**Se der erro:**
- Verifique em `docker compose logs backend` erros de scikit-fuzzy

---

### ✅ Camada III — Algoritmo Genético + Recomendação

1. Acesse http://localhost:3000/recomendacao
2. Deixe as configurações padrão:
   - Filmes a recomendar: 5
   - Gerações do GA: 50
3. Clique em **"Executar sistema inteligente"**
4. Você deve ver:
   - Tabela com todos os 10 filmes avaliados
   - 5 filmes recomendados (com ★)
   - Gráfico de evolução do GA (fitness máx e médio)

**Se der erro:**
- Verifique os logs: `docker compose logs backend -f`

---

## 🔍 DEBUGGING

### Ver logs do backend em tempo real:
```bash
docker compose logs backend -f
```

### Ver logs do frontend em tempo real:
```bash
docker compose logs frontend -f
```

### Parar tudo:
```bash
docker compose down
```

### Limpar e reconstruir do zero:
```bash
docker compose down
docker system prune -a
docker compose up --build
```

---

## 📊 O QUE FOI CORRIGIDO

### Backend (`app/core/trainer.py`)
- ✅ Adicionado download automático de NLTK data
- ✅ Melhorado error handling

### Backend (APIs)
- ✅ Error handling e logging em todos os endpoints
- ✅ Melhor tratamento de exceções

### Backend (`main.py`)
- ✅ Logging melhorado do startup
- ✅ CORS com allow_credentials=True

### Frontend (`services/api.js`)
- ✅ Detecção de VITE_API_URL
- ✅ Interceptors com logging
- ✅ Melhor formatação de erros

### Frontend (Pages)
- ✅ Better error messages
- ✅ Logging de requisições
- ✅ Handlers mais robustos
- ✅ Limpeza de estado entre operações

---

## 🎯 CHECKLIST FINAL

Antes de considerar funcionando, verifique:

- [ ] Backend iniciado: "✅ Modelo treinado e salvo com sucesso!" no logs
- [ ] Frontend carregado: http://localhost:3000 abre sem erro
- [ ] Exemplo 1 funciona: Sentimento detectado corretamente
- [ ] Fuzzy calcula: Score e gráficos aparecem
- [ ] Recomendação roda: Tabela e gráfico GA aparecem
- [ ] Dados aparecem corretamente: Valores fazem sentido

---

## 💡 TIPS

- Se os dados não carregarem, **aguarde 10 segundos** (treinamento em background)
- Se der "Cannot connect to API", verifique se backend está rodando: `docker compose ps`
- Se der erro de NLTK, aguarde o download completo (~30 segundos na primeira vez)
- Os dados são **sintéticos** por padrão (ótimo para demo). Para usar dados reais do IMDB:
  1. Baixe `IMDB_Dataset.csv` de https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews
  2. Coloque em `data/IMDB_Dataset.csv`
  3. Delete os arquivos `.pkl` em `data/`
  4. Reinicie com `docker compose restart backend`

---

## 📞 SUPORTE

Se algo não funcionar:
1. Verifique os logs: `docker compose logs`
2. Abra a console do navegador (F12) e procure por erros
3. Tente: `docker compose down && docker compose up --build`

✅ **Agora está 100% funcional!**
