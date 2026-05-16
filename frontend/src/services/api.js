import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

export const analyzeText = (texto) =>
  api.post("/analyze", { texto }).then((r) => r.data);

export const analyzeBatch = (textos) =>
  api.post("/analyze/batch", { textos }).then((r) => r.data);

export const getMetrics = () =>
  api.get("/metrics").then((r) => r.data);

export const fuzzyInference = (prob_positivo, nota_filme) =>
  api.post("/fuzzy", { prob_positivo, nota_filme }).then((r) => r.data);

export const recommend = (filmes, n_recomendados = 5, n_geracoes = 50) =>
  api.post("/recommend", { filmes, n_recomendados, n_geracoes }).then((r) => r.data);
