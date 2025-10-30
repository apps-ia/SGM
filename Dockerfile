# Dockerfile pour NOIA_SGM (optionnel)
# Usage: docker build -t noia-sgm .
#        docker run -p 8000:8000 --env-file backend/.env noia-sgm

FROM python:3.11-slim

# Métadonnées
LABEL maintainer="NOIA_SGM"
LABEL description="Secrétaire Générale de Mairie numérique"

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY backend/requirements.txt .

# Installer les dépendances
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copier l'application
COPY backend/app ./app
COPY frontend ./frontend

# Créer un utilisateur non-root
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Exposer le port
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
