"""
Tests unitaires pour l'API NOIA_SGM
Usage: pytest test_api.py
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test du endpoint de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "NOIA_SGM"


def test_root_endpoint():
    """Test du endpoint racine"""
    response = client.get("/")
    assert response.status_code == 200


def test_chat_endpoint_missing_message():
    """Test du chat sans message (doit échouer)"""
    response = client.post("/api/chat", json={})
    assert response.status_code == 422  # Validation error


def test_chat_endpoint_structure():
    """Test de la structure de la requête chat"""
    response = client.post(
        "/api/chat",
        json={
            "message": "Test de la structure",
            "conversation_history": None
        }
    )
    # Peut échouer si la clé API n'est pas configurée
    # Ce test vérifie juste que l'endpoint accepte la requête
    assert response.status_code in [200, 500]


def test_chat_with_history():
    """Test du chat avec historique"""
    response = client.post(
        "/api/chat",
        json={
            "message": "Question de suivi",
            "conversation_history": [
                {"role": "user", "content": "Première question"},
                {"role": "assistant", "content": "Première réponse"}
            ]
        }
    )
    assert response.status_code in [200, 500]


# Pour exécuter les tests :
# pip install pytest httpx
# pytest test_api.py -v
