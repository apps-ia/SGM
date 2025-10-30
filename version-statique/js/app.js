/**
 * NOIA_SGM - Version Statique (sans backend)
 * Appel direct à l'API OpenAI depuis le navigateur
 *
 * ⚠️ ATTENTION SÉCURITÉ :
 * Cette version expose la clé API dans le code JavaScript.
 * Utilisez une clé dédiée avec des limites strictes sur OpenAI.
 */

// ============================================
// CONFIGURATION
// ============================================

// La configuration est chargée depuis config.js
// Pour modifier la clé API et les paramètres, éditer le fichier config.js

const CONFIG = {
    // Configuration OpenAI (depuis config.js)
    openaiApiKey: window.NOIA_CONFIG?.openaiApiKey || 'VOTRE_CLE_API_OPENAI_ICI',
    openaiModel: window.NOIA_CONFIG?.openaiModel || 'gpt-4',
    maxTokens: window.NOIA_CONFIG?.maxTokens || 2000,
    temperature: window.NOIA_CONFIG?.temperature || 0.3,

    // Stockage local
    localStorageKey: 'noia_sgm_conversations',
    themeKey: 'noia_sgm_theme',
    maxMessageLength: 2000,
};

// ============================================
// PROMPT SYSTÈME NOIA_SGM
// ============================================

const SYSTEM_PROMPT = `Tu es NOIA_SGM, la Secrétaire Générale de Mairie numérique, conçue pour assister les petites collectivités dans la gestion administrative, juridique, financière, RH et numérique.

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
- Transition numérique : outils bureautiques, automatisations locales, RGPD, organisation documentaire`;

// ============================================
// ÉTAT DE L'APPLICATION
// ============================================

const state = {
    currentConversation: null,
    conversations: [],
    isLoading: false,
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Vérifier la clé API
    if (CONFIG.openaiApiKey === 'VOTRE_CLE_API_OPENAI_ICI') {
        showApiKeyWarning();
        return;
    }

    // Charger le thème
    loadTheme();

    // Charger les conversations
    loadConversations();

    // Initialiser les événements
    initializeEventListeners();

    // Créer une nouvelle conversation par défaut
    if (state.conversations.length === 0) {
        createNewConversation();
    } else {
        loadConversation(state.conversations[0].id);
    }
}

function showApiKeyWarning() {
    const container = document.getElementById('messages-container');
    const welcomeMessage = document.getElementById('welcome-message');

    welcomeMessage.style.display = 'none';

    container.innerHTML = `
        <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
            <div style="background-color: var(--error); color: white; padding: 2rem; border-radius: 0.75rem; margin-bottom: 2rem;">
                <h2 style="margin-top: 0; color: white;">⚠️ Configuration requise</h2>
                <p style="font-size: 1.125rem; margin-bottom: 1rem;">
                    Vous devez configurer votre clé API OpenAI pour utiliser NOIA_SGM.
                </p>
            </div>

            <div style="background-color: var(--bg-secondary); padding: 2rem; border-radius: 0.75rem; border-left: 4px solid var(--accent-primary);">
                <h3 style="margin-top: 0;">📝 Instructions :</h3>
                <ol style="line-height: 1.8;">
                    <li>Ouvrir le fichier <code>js/app.js</code> avec un éditeur de texte</li>
                    <li>Trouver la ligne : <code>openaiApiKey: 'VOTRE_CLE_API_OPENAI_ICI'</code></li>
                    <li>Remplacer <code>VOTRE_CLE_API_OPENAI_ICI</code> par votre vraie clé API</li>
                    <li>Sauvegarder le fichier</li>
                    <li>Rafraîchir cette page (F5)</li>
                </ol>

                <h3>🔑 Obtenir une clé API OpenAI :</h3>
                <ol style="line-height: 1.8;">
                    <li>Aller sur <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--accent-primary);">platform.openai.com/api-keys</a></li>
                    <li>Se connecter ou créer un compte</li>
                    <li>Cliquer sur "Create new secret key"</li>
                    <li>Copier la clé (commence par sk-...)</li>
                    <li>⚠️ <strong>Configurer des limites de dépense strictes</strong> dans les paramètres OpenAI</li>
                </ol>

                <div style="background-color: var(--warning); color: #000; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem;">
                    <strong>⚠️ SÉCURITÉ :</strong> La clé API sera visible dans le code JavaScript.
                    Créez une clé dédiée et configurez des limites strictes sur OpenAI !
                </div>
            </div>
        </div>
    `;
}

// ============================================
// APPEL À L'API OPENAI
// ============================================

async function callOpenAI(messages) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.openaiApiKey}`
            },
            body: JSON.stringify({
                model: CONFIG.openaiModel,
                messages: messages,
                max_tokens: CONFIG.maxTokens,
                temperature: CONFIG.temperature,
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('Erreur API OpenAI:', error);
        throw error;
    }
}

async function sendMessage(message) {
    if (state.isLoading) return;

    state.isLoading = true;
    setLoadingState(true);

    // Ajouter le message de l'utilisateur
    addMessage('user', message);

    try {
        // Construire l'historique des messages pour OpenAI
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }];

        // Ajouter l'historique de la conversation
        for (const msg of state.currentConversation.messages.slice(0, -1)) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }

        // Ajouter le message actuel
        messages.push({
            role: 'user',
            content: message
        });

        // Appeler OpenAI
        const response = await callOpenAI(messages);

        // Ajouter la réponse
        addMessage('assistant', response);

    } catch (error) {
        let errorMessage = '❌ Erreur lors de la communication avec OpenAI.';

        if (error.message.includes('API key')) {
            errorMessage += '\n\n🔑 Erreur de clé API : Vérifiez que votre clé OpenAI est correcte dans le fichier js/app.js';
        } else if (error.message.includes('quota')) {
            errorMessage += '\n\n💰 Quota dépassé : Vérifiez vos crédits OpenAI sur platform.openai.com';
        } else if (error.message.includes('rate_limit')) {
            errorMessage += '\n\n⏱️ Limite de taux atteinte : Attendez quelques instants avant de réessayer.';
        } else {
            errorMessage += `\n\nDétails : ${error.message}`;
        }

        addMessage('assistant', errorMessage);
    } finally {
        state.isLoading = false;
        setLoadingState(false);
    }
}

// ============================================
// GESTION DU THÈME
// ============================================

function loadTheme() {
    const savedTheme = localStorage.getItem(CONFIG.themeKey) || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.themeKey, theme);

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ============================================
// GESTION DES CONVERSATIONS
// ============================================

function loadConversations() {
    try {
        const saved = localStorage.getItem(CONFIG.localStorageKey);
        state.conversations = saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Erreur chargement conversations:', error);
        state.conversations = [];
    }
    updateConversationList();
}

function saveConversations() {
    try {
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(state.conversations));
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
    }
}

function createNewConversation() {
    const conversation = {
        id: generateId(),
        title: 'Nouvelle conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    state.conversations.unshift(conversation);
    saveConversations();
    loadConversation(conversation.id);
    updateConversationList();
}

function loadConversation(conversationId) {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    state.currentConversation = conversation;
    displayMessages(conversation.messages);
    updateConversationList();
}

function updateConversationTitle(conversationId, title) {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.title = title.substring(0, 100);
        conversation.updatedAt = new Date().toISOString();
        saveConversations();
        updateConversationList();
    }
}

function clearAllConversations() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        state.conversations = [];
        saveConversations();
        createNewConversation();
        updateConversationList();
    }
}

function updateConversationList() {
    const listElement = document.getElementById('conversation-list');
    if (!listElement) return;

    if (state.conversations.length === 0) {
        listElement.innerHTML = '<p style="padding: 1rem; color: var(--text-tertiary); text-align: center;">Aucune conversation</p>';
        return;
    }

    listElement.innerHTML = state.conversations.map(conv => `
        <div class="conversation-item ${conv.id === state.currentConversation?.id ? 'active' : ''}"
             data-id="${conv.id}">
            <div class="conversation-title">${escapeHtml(conv.title)}</div>
            <div class="conversation-date">${formatDate(conv.updatedAt)}</div>
        </div>
    `).join('');

    listElement.querySelectorAll('.conversation-item').forEach(item => {
        item.addEventListener('click', () => {
            loadConversation(item.dataset.id);
            if (window.innerWidth <= 768) {
                toggleSidebar();
            }
        });
    });
}

// ============================================
// GESTION DES MESSAGES
// ============================================

function displayMessages(messages) {
    const container = document.getElementById('messages-container');
    const welcomeMessage = document.getElementById('welcome-message');

    if (messages.length === 0) {
        welcomeMessage?.classList.remove('hidden');
        container.innerHTML = '';
    } else {
        welcomeMessage?.classList.add('hidden');
        container.innerHTML = messages.map(msg => createMessageElement(msg)).join('');
        scrollToBottom();
    }
}

function createMessageElement(message) {
    const time = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const avatar = message.role === 'user' ? '👤' : '🏛️';

    return `
        <div class="message ${message.role}">
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${formatMessageContent(message.content)}
                <div class="message-time">${time}</div>
            </div>
        </div>
    `;
}

function formatMessageContent(content) {
    content = content.replace(/1️⃣\s*(.*?)(?=\n|$)/g, '<h3>1️⃣ $1</h3>');
    content = content.replace(/2️⃣\s*(.*?)(?=\n|$)/g, '<h3>2️⃣ $1</h3>');
    content = content.replace(/3️⃣\s*(.*?)(?=\n|$)/g, '<h3>3️⃣ $1</h3>');
    content = content.replace(/4️⃣\s*(.*?)(?=\n|$)/g, '<h3>4️⃣ $1</h3>');
    content = content.replace(/\n/g, '<br>');
    content = content.replace(/\b(Article|Décret|Loi|Code|Circulaire)\s+([^\s<]+)/gi, '<strong>$1 $2</strong>');
    return content;
}

function addMessage(role, content) {
    if (!state.currentConversation) {
        createNewConversation();
    }

    const message = {
        role,
        content,
        timestamp: new Date().toISOString(),
    };

    state.currentConversation.messages.push(message);
    state.currentConversation.updatedAt = new Date().toISOString();

    if (role === 'user' && state.currentConversation.messages.length === 1) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        updateConversationTitle(state.currentConversation.id, title);
    }

    saveConversations();
    displayMessages(state.currentConversation.messages);
}

// ============================================
// UI HELPERS
// ============================================

function setLoadingState(isLoading) {
    const loading = document.getElementById('loading');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    if (isLoading) {
        loading?.classList.remove('hidden');
        sendButton.disabled = true;
        userInput.disabled = true;
    } else {
        loading?.classList.add('hidden');
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('hidden');
}

function updateCharCount() {
    const input = document.getElementById('user-input');
    const charCount = document.getElementById('char-count');
    if (input && charCount) {
        charCount.textContent = input.value.length;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    const sendButton = document.getElementById('send-button');
    sendButton?.addEventListener('click', handleSendMessage);

    const userInput = document.getElementById('user-input');
    userInput?.addEventListener('input', updateCharCount);
    userInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    const newConversationBtn = document.getElementById('new-conversation');
    newConversationBtn?.addEventListener('click', createNewConversation);

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', toggleTheme);

    const historyToggle = document.getElementById('history-toggle');
    historyToggle?.addEventListener('click', toggleSidebar);

    const closeSidebar = document.getElementById('close-sidebar');
    closeSidebar?.addEventListener('click', toggleSidebar);

    const clearHistory = document.getElementById('clear-history');
    clearHistory?.addEventListener('click', clearAllConversations);
}

function handleSendMessage() {
    const input = document.getElementById('user-input');
    const message = input?.value.trim();

    if (!message || message.length === 0) return;

    if (message.length > CONFIG.maxMessageLength) {
        alert(`Le message est trop long (maximum ${CONFIG.maxMessageLength} caractères)`);
        return;
    }

    sendMessage(message);
    input.value = '';
    updateCharCount();
}

// ============================================
// UTILITAIRES
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}
