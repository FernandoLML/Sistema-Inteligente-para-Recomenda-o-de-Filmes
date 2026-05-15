from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List
from app.core.genetic_algorithm import executar_ga
from app.core.trainer import analisar_texto
from app.core.fuzzy_system import calcular_score_fuzzy

router = APIRouter()


class Filme(BaseModel):
    titulo: str
    review: str
    nota: float = Field(..., ge=0, le=10)


class RecommendRequest(BaseModel):
    filmes: List[Filme]
    n_recomendados: int = Field(default=5, ge=1)
    n_geracoes: int = Field(default=50, ge=10, le=200)


@router.post("/recommend")
def recommend(req: RecommendRequest):
    """
    Pipeline completo: para cada filme, analisa o sentimento da review (Camada I),
    calcula o score fuzzy (Camada II) e otimiza a seleção com GA (Camada III).
    """
    filmes_processados = []

    for filme in req.filmes:
        # Camada I
        resultado_nlp = analisar_texto(filme.review)
        prob_pos = resultado_nlp["prob_positivo"]

        # Camada II
        resultado_fuzzy = calcular_score_fuzzy(prob_pos, filme.nota)
        score = resultado_fuzzy["score"]

        filmes_processados.append({
            "titulo": filme.titulo,
            "nota": filme.nota,
            "sentimento": resultado_nlp["sentimento"],
            "prob_positivo": round(prob_pos, 4),
            "score_fuzzy": round(score, 2),
            "nivel_recomendacao": resultado_fuzzy["nivel"],
        })

    # Camada III
    resultado_ga = executar_ga(
        filmes_processados,
        n_recomendados=req.n_recomendados,
        n_geracoes=req.n_geracoes,
    )

    return {
        "todos_os_filmes": filmes_processados,
        "recomendados": resultado_ga["filmes_recomendados"],
        "evolucao_ga": resultado_ga["evolucao"],
        "fitness_final": resultado_ga["fitness_final"],
    }
