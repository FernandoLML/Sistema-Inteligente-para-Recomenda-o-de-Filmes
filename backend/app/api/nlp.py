from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.trainer import analisar_texto
import joblib

router = APIRouter()


class AnalyzeRequest(BaseModel):
    texto: str


class BatchAnalyzeRequest(BaseModel):
    textos: list[str]


@router.post("/analyze")
def analyze(req: AnalyzeRequest):
    """Analisa o sentimento de um texto usando Naive Bayes."""
    if not req.texto.strip():
        raise HTTPException(status_code=400, detail="Texto não pode ser vazio.")
    return analisar_texto(req.texto)


@router.post("/analyze/batch")
def analyze_batch(req: BatchAnalyzeRequest):
    """Analisa uma lista de textos."""
    if not req.textos:
        raise HTTPException(status_code=400, detail="Lista de textos vazia.")
    resultados = [analisar_texto(t) for t in req.textos]
    return {"resultados": resultados}


@router.get("/metrics")
def get_metrics():
    """Retorna as métricas de avaliação do classificador."""
    try:
        metricas = joblib.load("/app/data/metricas.pkl")
        return metricas
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Métricas não encontradas. Treine o modelo primeiro.")
