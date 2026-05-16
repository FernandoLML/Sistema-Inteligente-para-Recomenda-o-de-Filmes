import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";
import { fuzzyInference } from "../services/api";

function FuzzyChart({ titulo, universo, conjuntos, inputVal, cor1, cor2, cor3 }) {
  const data = universo.map((x, i) => {
    const entry = { x: parseFloat(x.toFixed(2)) };
    Object.entries(conjuntos).forEach(([k, vals]) => {
      if (Array.isArray(vals)) entry[k] = parseFloat(vals[i].toFixed(3));
    });
    return entry;
  });

  const colors = { baixo: "#e05c6a", ruim: "#e05c6a", fraca: "#e05c6a",
                   medio: "#7c6fcd", regular: "#7c6fcd", moderada: "#7c6fcd",
                   alto: "#4caf82", boa: "#4caf82", forte: "#4caf82" };

  const keys = Object.keys(conjuntos).filter(k => Array.isArray(conjuntos[k]));

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1rem" }}>{titulo}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="x" tick={{ fontSize: 11, fill: "var(--text2)" }} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: "var(--text2)" }} />
          <Tooltip
            contentStyle={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "var(--text2)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {inputVal !== undefined && (
            <ReferenceLine x={parseFloat(inputVal.toFixed(2))} stroke="var(--accent)" strokeDasharray="4 4" label={{ value: "input", fill: "var(--accent)", fontSize: 11 }} />
          )}
          {keys.map((k) => (
            <Line key={k} type="monotone" dataKey={k} stroke={colors[k] || "#fff"} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PageFuzzy() {
  const [probPos, setProbPos] = useState(0.75);
  const [nota, setNota] = useState(7.5);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleCalc = async () => {
    setLoading(true);
    setErro("");
    try {
      const r = await fuzzyInference(probPos, nota);
      setResultado(r);
    } catch {
      setErro("Erro ao conectar com a API.");
    }
    setLoading(false);
  };

  const nivelColor = { Forte: "var(--positive)", Moderada: "var(--accent2)", Fraca: "var(--negative)" };

  return (
    <div>
      <h1 style={{ marginBottom: "0.3rem" }}>Inferência Fuzzy</h1>
      <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
        Camada II — Sistema Mamdani com 9 regras SE-ENTÃO
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 8 }}>
              Probabilidade positivo (Naive Bayes): <span className="mono" style={{ color: "var(--accent)" }}>{(probPos * 100).toFixed(0)}%</span>
            </label>
            <input type="range" min={0} max={1} step={0.01} value={probPos} onChange={(e) => setProbPos(parseFloat(e.target.value))} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 8 }}>
              Nota do filme (0–10): <span className="mono" style={{ color: "var(--accent)" }}>{nota.toFixed(1)}</span>
            </label>
            <input type="range" min={0} max={10} step={0.1} value={nota} onChange={(e) => setNota(parseFloat(e.target.value))} />
          </div>
        </div>
        <button className="btn-primary" style={{ marginTop: "1.5rem" }} onClick={handleCalc} disabled={loading}>
          {loading ? "Calculando..." : "Calcular score fuzzy"}
        </button>
        {erro && <p style={{ marginTop: "1rem", color: "var(--negative)", fontSize: 13 }}>{erro}</p>}
      </div>

      {resultado && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Entrada 1</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", color: "var(--positive)" }}>{(probPos * 100).toFixed(0)}%</p>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>sentimento positivo</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Entrada 2</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", color: "var(--accent2)" }}>{nota.toFixed(1)}</p>
              <p style={{ fontSize: 12, color: "var(--text2)" }}>nota do filme</p>
            </div>
            <div className="card" style={{ textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>Score de recomendação</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", color: nivelColor[resultado.nivel] }}>
                {resultado.score.toFixed(1)}
              </p>
              <span className={`badge badge-${resultado.nivel.toLowerCase()}`}>{resultado.nivel}</span>
            </div>
          </div>

          <FuzzyChart
            titulo="Sentimento positivo — funções de pertinência"
            universo={resultado.graficos.sentimento.universo}
            conjuntos={{ baixo: resultado.graficos.sentimento.baixo, medio: resultado.graficos.sentimento.medio, alto: resultado.graficos.sentimento.alto }}
            inputVal={resultado.graficos.sentimento.input}
          />
          <FuzzyChart
            titulo="Nota do filme — funções de pertinência"
            universo={resultado.graficos.nota.universo}
            conjuntos={{ ruim: resultado.graficos.nota.ruim, regular: resultado.graficos.nota.regular, boa: resultado.graficos.nota.boa }}
            inputVal={resultado.graficos.nota.input}
          />
          <FuzzyChart
            titulo="Recomendação — saída fuzzy"
            universo={resultado.graficos.recomendacao.universo}
            conjuntos={{ fraca: resultado.graficos.recomendacao.fraca, moderada: resultado.graficos.recomendacao.moderada, forte: resultado.graficos.recomendacao.forte }}
            inputVal={resultado.graficos.recomendacao.output}
          />
        </>
      )}
    </div>
  );
}
