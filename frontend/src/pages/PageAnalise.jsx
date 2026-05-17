import { useState } from "react";
import { analyzeText, getMetrics } from "../services/api";

const EXEMPLOS = [
  "This movie was absolutely fantastic! The acting was superb and the story kept me engaged throughout.",
  "Terrible film. Boring plot, bad acting, complete waste of two hours.",
  "It was okay, nothing special. Some good moments but overall average.",
];

function ProbBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3 }}>
        <div style={{ height: 6, width: `${value * 100}%`, background: color, borderRadius: 3, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function ConfusionMatrix({ matrix, classes }) {
  if (!matrix) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--font-mono)" }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 12px", color: "var(--text2)", textAlign: "left" }}>Real ↓ Pred →</th>
            {classes.map((c) => <th key={c} style={{ padding: "6px 12px", color: "var(--accent)" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td style={{ padding: "6px 12px", color: "var(--accent2)" }}>{classes[i]}</td>
              {row.map((val, j) => (
                <td key={j} style={{
                  padding: "6px 16px", textAlign: "center",
                  background: i === j ? "rgba(76,175,130,0.12)" : "transparent",
                  color: i === j ? "var(--positive)" : "var(--text2)",
                  borderRadius: 4,
                }}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PageAnalise() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [erro, setErro] = useState("");

  const handleAnalyze = async () => {
    if (!texto.trim()) {
      setErro("Por favor, digite ou selecione um exemplo de texto.");
      return;
    }
    setLoading(true);
    setErro("");
    setResultado(null);
    try {
      console.log("Enviando análise:", texto.substring(0, 50) + "...");
      const r = await analyzeText(texto);
      console.log("Resposta recebida:", r);
      setResultado(r);
    } catch (e) {
      console.error("Erro completo:", e);
      setErro(`Erro ao conectar com a API: ${e.message || "Verifique se o backend está rodando."}`);
    }
    setLoading(false);
  };

  const handleMetrics = async () => {
    setLoadingMetrics(true);
    setErro("");
    try {
      const m = await getMetrics();
      setMetricas(m);
    } catch (e) {
      console.error("Erro ao carregar métricas:", e);
      setErro(`Erro ao carregar métricas: ${e.message}`);
    }
    setLoadingMetrics(false);
  };

  const handleSelectExample = (ex) => {
    setTexto(ex);
    setResultado(null);
    setErro("");
  };

  const sentColor = { positive: "var(--positive)", negative: "var(--negative)", neutral: "var(--neutral)" };

  return (
    <div>
      <h1 style={{ marginBottom: "0.3rem" }}>Análise de Sentimento</h1>
      <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
        Camada I — PLN com Naive Bayes treinado no dataset IMDB
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 8 }}>
          Review em inglês
        </label>
        <textarea
          rows={5}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite ou cole uma review de filme em inglês..."
          style={{ resize: "vertical", marginBottom: "1rem" }}
        />
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button className="btn-primary" onClick={handleAnalyze} disabled={loading || !texto.trim()}>
            {loading ? <><span className="loading-dot" style={{ marginRight: 8 }} />Analisando...</> : "Analisar sentimento"}
          </button>
          <span style={{ fontSize: 13, color: "var(--text2)" }}>ou use um exemplo:</span>
          {EXEMPLOS.map((ex, i) => (
            <button 
              key={i} 
              className="btn-secondary" 
              style={{ fontSize: 12 }} 
              onClick={() => handleSelectExample(ex)}
              disabled={loading}
            >
              Exemplo {i + 1}
            </button>
          ))}
        </div>
        {erro && <p style={{ marginTop: "1rem", color: "var(--negative)", fontSize: 13 }}>⚠️ {erro}</p>}
      </div>

      {resultado && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.2rem" }}>Resultado</h2>
            <span className={`badge badge-${resultado.sentimento}`}>{resultado.sentimento}</span>
          </div>
          <ProbBar label="Positivo" value={resultado.probabilidades.positive || 0} color="var(--positive)" />
          <ProbBar label="Negativo" value={resultado.probabilidades.negative || 0} color="var(--negative)" />
          <ProbBar label="Neutro"   value={resultado.probabilidades.neutral || 0} color="var(--neutral)" />
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--bg3)", borderRadius: "var(--radius-sm)" }}>
            <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Texto após pré-processamento:</p>
            <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--accent2)", wordBreak: "break-all" }}>
              {resultado.texto_processado.slice(0, 200)}{resultado.texto_processado.length > 200 ? "..." : ""}
            </p>
          </div>
          <p style={{ marginTop: "1rem", fontSize: 13, color: "var(--text2)" }}>
            Prob. positivo para Camada II:{" "}
            <span className="mono" style={{ color: "var(--accent)" }}>
              {(resultado.prob_positivo * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.1rem" }}>Métricas do Classificador</h2>
        <button className="btn-secondary" style={{ fontSize: 12 }} onClick={handleMetrics} disabled={loadingMetrics}>
          {loadingMetrics ? "Carregando..." : "Carregar métricas"}
        </button>
      </div>

      {metricas && (
        <div className="card">
          {metricas.sintetico && (
            <p style={{ fontSize: 12, color: "var(--accent)", marginBottom: "1rem" }}>
              ℹ️ Modelo treinado com dados sintéticos (coloque IMDB_Dataset.csv em /data para usar o dataset real)
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {["negative", "neutral", "positive"].map((cls) => {
              const m = metricas.report?.[cls];
              if (!m) return null;
              return (
                <div key={cls} style={{ background: "var(--bg3)", borderRadius: "var(--radius-sm)", padding: "1rem", textAlign: "center" }}>
                  <span className={`badge badge-${cls}`} style={{ marginBottom: 8, display: "block" }}>{cls}</span>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>F1-score</div>
                  <div style={{ fontSize: "1.5rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                    {(m["f1-score"] * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: "1rem" }}>Matriz de confusão:</p>
          <ConfusionMatrix matrix={metricas.confusion_matrix} classes={metricas.classes || []} />
        </div>
      )}
    </div>
  );
}
