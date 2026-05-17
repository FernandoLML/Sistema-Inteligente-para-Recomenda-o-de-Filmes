from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.trainer import train_and_save_model
from app.api import nlp, fuzzy, genetic
import traceback

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Treina e salva o modelo Naive Bayes no startup do container."""
    print("=" * 50)
    print("Iniciando treinamento do modelo Naive Bayes...")
    print("=" * 50)
    try:
        train_and_save_model()
        print("=" * 50)
        print("✅ Modelo treinado e salvo com sucesso!")
        print("=" * 50)
    except Exception as e:
        print("=" * 50)
        print(f"❌ ERRO ao treinar modelo: {str(e)}")
        print(traceback.format_exc())
        print("=" * 50)
    yield

app = FastAPI(
    title="N2 - Sistema Inteligente IMDB",
    description="API para análise de sentimentos, inferência fuzzy e recomendação de filmes.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(nlp.router, prefix="/api", tags=["Camada I - PLN"])
app.include_router(fuzzy.router, prefix="/api", tags=["Camada II - Fuzzy"])
app.include_router(genetic.router, prefix="/api", tags=["Camada III - GA"])

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok", "message": "Backend is running"}
