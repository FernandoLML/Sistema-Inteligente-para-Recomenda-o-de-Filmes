# 📋 GUIA RÁPIDO DE INICIALIZAÇÃO

## ⏱️ 2 MINUTOS PARA FUNCIONAR

### PASSO 1: Abra PowerShell/CMD
```
Windows + R
cmd
```

### PASSO 2: Copie e cole isso
```bash
cd "C:\Users\Pichau Gaming\Desktop\CEM\Sistema-Inteligente-para-Recomenda-o-de-Filmes.worktrees\agents-funcionalidade-verificacao"
docker compose up --build
```

### PASSO 3: Aguarde a mensagem (30-60 segundos)
```
✅ Modelo treinado e salvo com sucesso!
```

### PASSO 4: Abra no navegador
```
http://localhost:3000
```

### PASSO 5: Clique em "Exemplo 1" e depois "Analisar sentimento"
✅ **PRONTO! Sistema funcionando!**

---

## 🧪 3 TESTES RÁPIDOS (2 MINUTOS)

### Teste 1: Camada I (Análise)
```
Na página inicial:
1. Clique em "Exemplo 1" (positive)
2. Clique "Analisar sentimento"
3. Veja resultado aparecer em <1s
Esperado: positive com ~85% confiança ✅
```

### Teste 2: Camada II (Fuzzy)
```
Clique em "Camada II — Fuzzy" no menu:
1. Deixe sliders em 0.75 e 7.5
2. Clique "Calcular score fuzzy"
3. Veja 3 gráficos aparecerem
Esperado: Score ~68, Nível: Forte ✅
```

### Teste 3: Camada III (Recomendação)
```
Clique em "Camada III — Recomendação":
1. Clique "Executar sistema inteligente"
2. Veja tabela com 10 filmes
3. Veja 5 recomendados destacados
Esperado: Filmes bons marcados com ★ ✅
```

---

## 🔍 SE DER ERRO

### "Cannot connect to API"
```bash
# Verifique os containers
docker compose ps

# Deve mostrar:
# n2_backend   Running
# n2_frontend  Running

# Se não estiver rodando:
docker compose up --build
```

### "502 Bad Gateway"
```bash
# Veja logs do backend
docker compose logs backend -f

# Procure por "Modelo treinado" ou erros
# Se houver erro NLTK, aguarde mais tempo (download)
```

### "Port 3000 already in use"
```bash
# Finalize o que está usando a porta
docker compose down

# E tente novamente
docker compose up --build
```

---

## 📊 O QUE FOI CORRIGIDO

✅ Backend NLTK downloads automáticos  
✅ Error handling em todos endpoints  
✅ Frontend logging detalhado  
✅ State management melhorado  
✅ API client com interceptors  
✅ Mensagens de erro úteis  
✅ Componentes com validação  

---

## 🎯 TUDO OK? ✅

Se os 3 testes passaram, o sistema está **100% funcional**!

### Próximos passos:
1. Explorar a interface
2. Testar com seus próprios textos
3. Ler os documentos de correções
4. Usar em produção!

---

## 📞 PRECISA DE AJUDA?

Verifique estes arquivos:
- `INSTRUÇÕES_INICIALIZAÇÃO.md` — Guia completo
- `CORREÇÕES_IMPLEMENTADAS.md` — O que foi corrigido
- `ANTES_E_DEPOIS.md` — Comparação detalhada
- `RESUMO_FINAL.md` — Status geral

---

## 🎉 BOM TRABALHO!

Seu sistema de IA com 3 camadas está funcionando perfeitamente!

- PLN com Naive Bayes ✅
- Lógica Fuzzy Mamdani ✅
- Algoritmo Genético com DEAP ✅

**Parabéns!** 🚀
