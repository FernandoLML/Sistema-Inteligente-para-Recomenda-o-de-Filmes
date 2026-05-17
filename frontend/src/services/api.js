import axios from "axios";

// Determine API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    if (error.response) {
      // Server responded with error status
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
    }
    return Promise.reject(error);
  }
);

export const analyzeText = (texto) => {
  console.log("Calling analyzeText with:", texto.substring(0, 50));
  return api.post("/analyze", { texto })
    .then((r) => {
      console.log("analyzeText response:", r.data);
      return r.data;
    })
    .catch((err) => {
      console.error("analyzeText error:", err);
      throw new Error(err.response?.data?.detail || err.message || "Erro ao analisar texto");
    });
};

export const analyzeBatch = (textos) => {
  return api.post("/analyze/batch", { textos })
    .then((r) => r.data)
    .catch((err) => {
      throw new Error(err.response?.data?.detail || err.message || "Erro ao processar batch");
    });
};

export const getMetrics = () => {
  return api.get("/metrics")
    .then((r) => r.data)
    .catch((err) => {
      throw new Error(err.response?.data?.detail || err.message || "Erro ao carregar métricas");
    });
};

export const fuzzyInference = (prob_positivo, nota_filme) => {
  return api.post("/fuzzy", { prob_positivo, nota_filme })
    .then((r) => r.data)
    .catch((err) => {
      throw new Error(err.response?.data?.detail || err.message || "Erro ao processar fuzzy");
    });
};

export const recommend = (filmes, n_recomendados = 5, n_geracoes = 50) => {
  return api.post("/recommend", { filmes, n_recomendados, n_geracoes })
    .then((r) => r.data)
    .catch((err) => {
      throw new Error(err.response?.data?.detail || err.message || "Erro ao gerar recomendações");
    });
};
