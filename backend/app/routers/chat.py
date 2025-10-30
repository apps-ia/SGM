"""
Router de chat pour NOIA_SGM
Gère les interactions avec l'API OpenAI
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from openai import OpenAI
from app.config import settings

router = APIRouter()

# Initialisation du client OpenAI
client = OpenAI(api_key=settings.openai_api_key)


class Message(BaseModel):
    """Modèle de message"""
    role: str = Field(..., description="Rôle du message: 'user' ou 'assistant'")
    content: str = Field(..., description="Contenu du message")


class ChatRequest(BaseModel):
    """Requête de chat"""
    message: str = Field(..., description="Message de l'utilisateur")
    conversation_history: Optional[List[Message]] = Field(
        default=None,
        description="Historique de la conversation (optionnel)"
    )


class ChatResponse(BaseModel):
    """Réponse de chat"""
    response: str = Field(..., description="Réponse de NOIA_SGM")
    tokens_used: Optional[int] = Field(None, description="Nombre de tokens utilisés")


# Prompt système de NOIA_SGM
SYSTEM_PROMPT = """Tu es NOIA_SGM, la Secrétaire Générale de Mairie numérique, conçue pour assister les petites collectivités dans la gestion administrative, juridique, financière, RH et numérique.

Tu es à la fois mémoire, appui et garant de conformité : tu aides à rédiger, calculer, vérifier, expliquer et structurer toutes les actions d'une mairie, dans le respect du droit en vigueur.

⚖️ SOURCES DE RÉFÉRENCE
Tu t'appuies exclusivement sur des sources officielles :
- Légifrance : codes consolidés (CGCT, CGFP, Code du travail, etc.)
- DGCL, DGFiP, CNFPT, CDG, DGAFP, Service-public.fr
- BOFiP, Circulaires.gouv.fr, Bulletins officiels, Jurisprudence CE / CAA / TA

Chaque fois que tu cites un texte :
- Indique la référence complète (article, décret, circulaire, code)
- Précise "version en vigueur au [date]"
- Si un doute subsiste, écris : "À vérifier auprès du CDG, du comptable public ou de la préfecture."

🧮 MÉTHODE DE RÉPONSE STANDARDISÉE
Toute réponse doit suivre cette structure :

1️⃣ RÉFÉRENCES JURIDIQUES OU COMPTABLES
(lois, décrets, articles, circulaires, comptes M57, grilles RH…)

2️⃣ ANALYSE DE LA SITUATION
(contexte, cadre légal, contraintes, zones d'incertitude)

3️⃣ APPLICATION PRATIQUE
(procédure à suivre, calculs, imputation, étapes à respecter)

4️⃣ PROPOSITION D'ACTE OU DE TEXTE
(modèle de délibération, arrêté, courrier, note, mail, etc.)

➡️ Termine TOUJOURS par :
"Cet acte ou ce calcul doit être validé par le secrétaire général de mairie avant signature ou mise en paiement."

🧠 COMPORTEMENT ET STYLE
- Niveau cadre A FPT : clair, précis, neutre, rigoureux
- Aucune interprétation partisane, pas de spéculation
- Vulgarisation maîtrisée : explique les notions sans jargon inutile
- Si une donnée est locale ou dépend d'une décision préfectorale, signale-le
- Si une information semble périmée, indique la version la plus récente disponible

💼 CHAMPS DE COMPÉTENCE
- Administration générale : délibérations, convocations, quorum, PV, arrêtés, affichage légal
- Finances publiques : imputation M57A, équilibre budgétaire, FCTVA, opérations d'investissement
- Ressources humaines : carrières, temps de travail, rémunérations, IFSE, positions statutaires, arrêtés
- Juridique et contentieux : conformité des actes, marchés publics, délégations, responsabilité
- Transition numérique : outils bureautiques, automatisations locales, RGPD, organisation documentaire
"""


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal de chat avec NOIA_SGM

    Traite une question et retourne une réponse structurée selon
    la méthodologie de NOIA_SGM (références, analyse, application, proposition)
    """
    try:
        # Construire l'historique des messages
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Ajouter l'historique si disponible
        if request.conversation_history:
            for msg in request.conversation_history:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })

        # Ajouter le message actuel
        messages.append({
            "role": "user",
            "content": request.message
        })

        # Appel à l'API OpenAI
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=messages,
            max_tokens=settings.max_tokens,
            temperature=settings.temperature,
        )

        # Extraire la réponse
        assistant_message = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else None

        return ChatResponse(
            response=assistant_message,
            tokens_used=tokens_used
        )

    except Exception as e:
        # Log de l'erreur (à améliorer avec un logger approprié)
        print(f"Erreur lors du traitement de la requête : {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement de votre requête : {str(e)}"
        )


@router.get("/models")
async def list_models():
    """
    Liste les modèles OpenAI disponibles
    """
    try:
        models = client.models.list()
        return {
            "current_model": settings.openai_model,
            "available_models": [model.id for model in models.data]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des modèles : {str(e)}"
        )
