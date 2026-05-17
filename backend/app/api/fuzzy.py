from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.core.fuzzy_system import calcular_score_fuzzy
import traceback

router = APIRouter()


class FuzzyRequest(BaseModel):
    prob_positivo: float = Field(..., ge=0, le=1, description="Probabilidade de sentimento positivo (0 a 1)")
    nota_filme: float = Field(..., ge=0, le=10, description="Nota do filme (0 a 10)")


@router.post("/fuzzy")
def fuzzy_inference(req: FuzzyRequest):
    """Calcula o score de recomendação via inferência fuzzy Mamdani."""
    try:
        result = calcular_score_fuzzy(req.prob_positivo, req.nota_filme)
        return result
    except Exception as e:
        print(f"Erro ao processar fuzzy: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erro ao processar inferência fuzzy: {str(e)}")
