from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.trainer import analisar_texto
import joblib
import traceback

router = APIRouter()


class AnalyzeRequest(BaseModel):
    texto: str


class BatchAnalyzeRequest(BaseModel):
    textos: list[str]


@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Analisa o sentimento de um texto usando Naive Bayes."""
    try:
        if not req.texto.strip():
            raise HTTPException(status_code=400, detail="Texto não pode ser vazio.")
        result = analisar_texto(req.texto)
        return result
    except Exception as e:
        print(f"Erro ao analisar texto: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erro ao processar texto: {str(e)}")


@router.post("/analyze/batch")
def analyze_batch(req: BatchAnalyzeRequest):
    """Analisa uma lista de textos."""
    try:
        if not req.textos:
            raise HTTPException(status_code=400, detail="Lista de textos vazia.")
        resultados = [analisar_texto(t) for t in req.textos]
        return {"resultados": resultados}
    except Exception as e:
        print(f"Erro ao analisar batch: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erro ao processar batch: {str(e)}")


@router.get("/metrics")
def get_metrics():
    """Retorna as métricas de avaliação do classificador."""
    try:
        metricas = joblib.load("/app/data/metricas.pkl")
        return metricas
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Métricas não encontradas. Treine o modelo primeiro.")
    except Exception as e:
        print(f"Erro ao carregar métricas: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erro ao carregar métricas: {str(e)}")
