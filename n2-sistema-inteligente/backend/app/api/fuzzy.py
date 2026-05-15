from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.core.fuzzy_system import calcular_score_fuzzy

router = APIRouter()


class FuzzyRequest(BaseModel):
    prob_positivo: float = Field(..., ge=0, le=1, description="Probabilidade de sentimento positivo (0 a 1)")
    nota_filme: float = Field(..., ge=0, le=10, description="Nota do filme (0 a 10)")


@router.post("/fuzzy")
def fuzzy_inference(req: FuzzyRequest):
    """Calcula o score de recomendação via inferência fuzzy Mamdani."""
    return calcular_score_fuzzy(req.prob_positivo, req.nota_filme)
