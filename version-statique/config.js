/**
 * NOIA_SGM - Fichier de configuration
 *
 * ⚠️ IMPORTANT : Configurez votre clé API OpenAI ci-dessous
 *
 * SÉCURITÉ :
 * - Créez une clé API dédiée sur https://platform.openai.com/api-keys
 * - Configurez des LIMITES DE DÉPENSE strictes dans les paramètres OpenAI
 * - Cette clé sera visible dans le code source (risque d'utilisation non autorisée)
 * - Surveillez régulièrement votre utilisation sur platform.openai.com
 */

// ============================================
// CONFIGURATION À MODIFIER
// ============================================

const NOIA_CONFIG = {
    /**
     * Clé API OpenAI
     *
     * Pour obtenir une clé :
     * 1. Aller sur https://platform.openai.com/api-keys
     * 2. Se connecter ou créer un compte
     * 3. Cliquer sur "Create new secret key"
     * 4. Copier la clé (commence par sk-...)
     * 5. Coller ci-dessous en remplacement de 'VOTRE_CLE_API_OPENAI_ICI'
     *
     * ⚠️ IMPORTANT : Configurez des limites de dépense sur OpenAI !
     */
    openaiApiKey: 'VOTRE_CLE_API_OPENAI_ICI',

    /**
     * Modèle OpenAI à utiliser
     *
     * Options :
     * - 'gpt-4' : Le plus performant (recommandé)
     * - 'gpt-3.5-turbo' : Plus rapide et moins cher
     */
    openaiModel: 'gpt-4',

    /**
     * Nombre maximum de tokens par réponse
     * (1 token ≈ 0.75 mot en français)
     */
    maxTokens: 2000,

    /**
     * Température (créativité des réponses)
     * 0.0 = très précis, 1.0 = très créatif
     * Pour NOIA_SGM : valeur basse recommandée (0.3)
     */
    temperature: 0.3,
};

// ============================================
// NE PAS MODIFIER CI-DESSOUS
// ============================================

// Exporter la configuration
window.NOIA_CONFIG = NOIA_CONFIG;
