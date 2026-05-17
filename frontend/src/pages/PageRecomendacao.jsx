import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { recommend } from "../services/api";

const FILMES_DEMO = [
  { titulo: "The Shawshank Redemption", review: "An absolutely masterful film. The performances are outstanding and the story is deeply moving and inspiring.", nota: 9.3 },
  { titulo: "The Godfather", review: "A landmark in cinema. Brilliant direction, incredible cast and unforgettable storytelling from start to finish.", nota: 9.2 },
  { titulo: "The Dark Knight", review: "Heath Ledger delivers a legendary performance. The film is tense, exciting and visually stunning throughout.", nota: 9.0 },
  { titulo: "Forrest Gump", review: "A heartwarming and funny journey through American history with an unforgettable lead performance by Tom Hanks.", nota: 8.8 },
  { titulo: "Inception", review: "Mind bending and original. Christopher Nolan at his finest. The dream within a dream concept is brilliantly executed.", nota: 8.8 },
  { titulo: "The Matrix", review: "Revolutionary special effects and an engaging philosophical storyline. A must watch for any sci-fi fan.", nota: 8.7 },
  { titulo: "Interstellar", review: "Visually stunning and emotionally resonant. A bit slow in places but the payoff is worth it.", nota: 8.6 },
  { titulo: "Avengers: Endgame", review: "A satisfying conclusion to a decade of films. Some scenes are epic but overall feels a bit formulaic.", nota: 8.4 },
  { titulo: "Transformers: Age of Extinction", review: "Loud, long and exhausting. The plot is incoherent and the action becomes tedious very quickly.", nota: 5.6 },
  { titulo: "Cats (2019)", review: "Disturbing and confusing from start to finish. The CGI is unsettling and the story makes no sense whatsoever.", nota: 2.7 },
];

export default function PageRecomendacao() {
  const [filmes, setFilmes] = useState(FILMES_DEMO);
  const [nRec, setNRec] = useState(5);
  const [nGen, setNGen] = useState(50);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleRun = async () => {
    setLoading(true);
    setErro("");
    setResultado(null);
    try {
      console.log("Executando recomendação com", filmes.length, "filmes, n_recomendados:", nRec, "n_geracoes:", nGen);
      const r = await recommend(filmes, nRec, nGen);
      console.log("Resultado recomendação:", r);
      setResultado(r);
    } catch (e) {
      console.error("Erro ao gerar recomendações:", e);
      setErro(`Erro ao conectar com a API: ${e.message}`);
    }
    setLoading(false);
  };

  const evolData = resultado?.evolucao_ga?.geracoes.map((g, i) => ({
    geração: g,
    "fitness máx": resultado.evolucao_ga.fitness_max[i],
    "fitness méd": resultado.evolucao_ga.fitness_avg[i],
  })) || [];

  const sentColor = { positive: "var(--positive)", negative: "var(--negative)", neutral: "var(--neutral)" };

  return (
    <div>
      <h1 style={{ marginBottom: "0.3rem" }}>Recomendação de Filmes</h1>
      <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
        Pipeline completo: PLN → Fuzzy → Algoritmo Genético
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>
              Filmes a recomendar: <span className="mono" style={{ color: "var(--accent)" }}>{nRec}</span>
            </label>
            <input type="range" min={1} max={Math.min(8, filmes.length)} step={1} value={nRec} onChange={(e) => setNRec(+e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>
              Gerações do GA: <span className="mono" style={{ color: "var(--accent)" }}>{nGen}</span>
            </label>
            <input type="range" min={10} max={200} step={10} value={nGen} onChange={(e) => setNGen(+e.target.value)} />
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: "1rem" }}>
          {filmes.length} filmes candidatos carregados (dataset de demonstração)
        </p>
        <button className="btn-primary" onClick={handleRun} disabled={loading}>
          {loading ? <><span className="loading-dot" style={{ marginRight: 8 }} />Executando pipeline IA...</> : "Executar sistema inteligente"}
        </button>
        {erro && <p style={{ marginTop: "1rem", color: "var(--negative)", fontSize: 13 }}>⚠️ {erro}</p>}
      </div>

      {resultado && (
        <>
          <h2 style={{ marginBottom: "1rem" }}>Todos os filmes avaliados</h2>
          <div className="card" style={{ marginBottom: "1.5rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Filme", "Sentimento", "P(pos)", "Nota", "Score Fuzzy", "Nível"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--text2)", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.todos_os_filmes.map((f, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", opacity: resultado.recomendados.find(r => r.titulo === f.titulo) ? 1 : 0.55 }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500 }}>
                      {resultado.recomendados.find(r => r.titulo === f.titulo) && <span style={{ color: "var(--accent)", marginRight: 6 }}>★</span>}
                      {f.titulo}
                    </td>
                    <td style={{ padding: "8px 12px" }}><span className={`badge badge-${f.sentimento}`}>{f.sentimento}</span></td>
                    <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: sentColor[f.sentimento] }}>{(f.prob_positivo * 100).toFixed(1)}%</td>
                    <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)" }}>{f.nota}</td>
                    <td style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{f.score_fuzzy}</td>
                    <td style={{ padding: "8px 12px" }}><span className={`badge badge-${f.nivel_recomendacao.toLowerCase()}`}>{f.nivel_recomendacao}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={{ marginBottom: "1rem" }}>Recomendados pelo GA</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {resultado.recomendados.map((f, i) => (
              <div key={i} className="card" style={{ borderColor: "rgba(232,184,109,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>#{i + 1}</span>
                  <span className={`badge badge-${f.nivel_recomendacao.toLowerCase()}`}>{f.nivel_recomendacao}</span>
                </div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>{f.titulo}</h3>
                <div style={{ display: "flex", gap: "1rem", fontSize: 13 }}>
                  <span style={{ color: "var(--text2)" }}>Nota: <span className="mono">{f.nota}</span></span>
                  <span style={{ color: "var(--text2)" }}>Score: <span className="mono" style={{ color: "var(--accent)" }}>{f.score_fuzzy}</span></span>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ marginBottom: "1rem" }}>Evolução do Algoritmo Genético</h2>
          <div className="card">
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: "1rem" }}>
              Fitness final: <span className="mono" style={{ color: "var(--accent)" }}>{resultado.fitness_final}</span> · {nGen} gerações
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="geração" tick={{ fontSize: 11, fill: "var(--text2)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text2)" }} />
                <Tooltip contentStyle={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="fitness máx" stroke="var(--accent)" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="fitness méd" stroke="var(--accent2)" dot={false} strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
