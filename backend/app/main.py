"""
Application principale NOIA_SGM
FastAPI backend avec intégration OpenAI
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pathlib import Path

from app.config import settings
from app.routers import chat

# Initialisation de l'application
app = FastAPI(
    title="NOIA_SGM API",
    description="Secrétaire Générale de Mairie numérique - API d'assistance administrative",
    version="1.0.0",
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Montage des fichiers statiques (frontend)
frontend_path = Path(__file__).parent.parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")

    @app.get("/")
    async def root():
        """Serve the main HTML page"""
        index_path = frontend_path / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"message": "NOIA_SGM API is running"}
else:
    @app.get("/")
    async def root():
        """API root endpoint"""
        return {
            "message": "NOIA_SGM API",
            "version": "1.0.0",
            "status": "operational"
        }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "NOIA_SGM",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
