"""
Camada II — Sistema de Inferência Fuzzy (Mamdani)
Entradas: probabilidade de positividade + nota do filme (0-10)
Saída: score de recomendação (0-100)
"""
import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


def criar_sistema_fuzzy():
    """Cria e retorna o sistema de controle fuzzy Mamdani."""

    # --- Universos de discurso ---
    sentimento = ctrl.Antecedent(np.arange(0, 1.01, 0.01), "sentimento")
    nota = ctrl.Antecedent(np.arange(0, 10.1, 0.1), "nota")
    recomendacao = ctrl.Consequent(np.arange(0, 101, 1), "recomendacao")

    # --- Funções de pertinência: sentimento ---
    sentimento["baixo"] = fuzz.trimf(sentimento.universe, [0, 0, 0.5])
    sentimento["medio"] = fuzz.trimf(sentimento.universe, [0.25, 0.5, 0.75])
    sentimento["alto"] = fuzz.trimf(sentimento.universe, [0.5, 1, 1])

    # --- Funções de pertinência: nota do filme ---
    nota["ruim"] = fuzz.trimf(nota.universe, [0, 0, 5])
    nota["regular"] = fuzz.trimf(nota.universe, [3, 5, 7])
    nota["boa"] = fuzz.trimf(nota.universe, [5, 10, 10])

    # --- Funções de pertinência: recomendação ---
    recomendacao["fraca"] = fuzz.trimf(recomendacao.universe, [0, 0, 40])
    recomendacao["moderada"] = fuzz.trimf(recomendacao.universe, [20, 50, 80])
    recomendacao["forte"] = fuzz.trimf(recomendacao.universe, [60, 100, 100])

    # --- Regras Fuzzy (base de conhecimento) ---
    regras = [
        ctrl.Rule(sentimento["alto"] & nota["boa"], recomendacao["forte"]),
        ctrl.Rule(sentimento["alto"] & nota["regular"], recomendacao["forte"]),
        ctrl.Rule(sentimento["medio"] & nota["boa"], recomendacao["forte"]),
        ctrl.Rule(sentimento["medio"] & nota["regular"], recomendacao["moderada"]),
        ctrl.Rule(sentimento["medio"] & nota["ruim"], recomendacao["moderada"]),
        ctrl.Rule(sentimento["alto"] & nota["ruim"], recomendacao["moderada"]),
        ctrl.Rule(sentimento["baixo"] & nota["boa"], recomendacao["moderada"]),
        ctrl.Rule(sentimento["baixo"] & nota["regular"], recomendacao["fraca"]),
        ctrl.Rule(sentimento["baixo"] & nota["ruim"], recomendacao["fraca"]),
    ]

    sistema = ctrl.ControlSystem(regras)
    return sistema


def calcular_score_fuzzy(prob_positivo: float, nota_filme: float) -> dict:
    """
    Recebe a probabilidade de positividade e a nota do filme,
    retorna o score de recomendação e dados para visualização.
    """
    sistema = criar_sistema_fuzzy()
    simulacao = ctrl.ControlSystemSimulation(sistema)

    simulacao.input["sentimento"] = float(np.clip(prob_positivo, 0, 1))
    simulacao.input["nota"] = float(np.clip(nota_filme, 0, 10))
    simulacao.compute()

    score = float(simulacao.output["recomendacao"])

    nivel = "Fraca"
    if score >= 60:
        nivel = "Forte"
    elif score >= 35:
        nivel = "Moderada"

    # Dados para o gráfico de pertinência no frontend
    universo_sent = np.arange(0, 1.01, 0.01).tolist()
    universo_nota = np.arange(0, 10.1, 0.1).tolist()
    universo_rec = np.arange(0, 101, 1).tolist()

    return {
        "score": round(score, 2),
        "nivel": nivel,
        "graficos": {
            "sentimento": {
                "universo": universo_sent,
                "baixo": fuzz.trimf(np.array(universo_sent), [0, 0, 0.5]).tolist(),
                "medio": fuzz.trimf(np.array(universo_sent), [0.25, 0.5, 0.75]).tolist(),
                "alto": fuzz.trimf(np.array(universo_sent), [0.5, 1, 1]).tolist(),
                "input": prob_positivo,
            },
            "nota": {
                "universo": universo_nota,
                "ruim": fuzz.trimf(np.array(universo_nota), [0, 0, 5]).tolist(),
                "regular": fuzz.trimf(np.array(universo_nota), [3, 5, 7]).tolist(),
                "boa": fuzz.trimf(np.array(universo_nota), [5, 10, 10]).tolist(),
                "input": nota_filme,
            },
            "recomendacao": {
                "universo": universo_rec,
                "fraca": fuzz.trimf(np.array(universo_rec), [0, 0, 40]).tolist(),
                "moderada": fuzz.trimf(np.array(universo_rec), [20, 50, 80]).tolist(),
                "forte": fuzz.trimf(np.array(universo_rec), [60, 100, 100]).tolist(),
                "output": score,
            },
        },
    }
