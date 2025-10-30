/**
 * NOIA_SGM - Application JavaScript
 * Gestion de l'interface utilisateur et communication avec l'API
 */

// Configuration
const CONFIG = {
    apiUrl: window.location.origin + '/api',
    maxMessageLength: 2000,
    localStorageKey: 'noia_sgm_conversations',
    themeKey: 'noia_sgm_theme',
};

// État de l'application
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
        // Charger la dernière conversation
        loadConversation(state.conversations[0].id);
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
        console.error('Erreur lors du chargement des conversations:', error);
        state.conversations = [];
    }
    updateConversationList();
}

function saveConversations() {
    try {
        localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(state.conversations));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des conversations:', error);
        alert('Erreur lors de la sauvegarde de la conversation');
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

function deleteConversation(conversationId) {
    state.conversations = state.conversations.filter(c => c.id !== conversationId);
    saveConversations();
    updateConversationList();

    if (state.currentConversation?.id === conversationId) {
        if (state.conversations.length > 0) {
            loadConversation(state.conversations[0].id);
        } else {
            createNewConversation();
        }
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

    // Ajouter les événements de clic
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
        container.innerHTML = messages.map((msg, index) =>
            createMessageElement(msg, index)
        ).join('');
        scrollToBottom();
    }
}

function createMessageElement(message, index) {
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
    // Convertir les marqueurs de section en titres HTML
    content = content.replace(/1️⃣\s*(.*?)(?=\n|$)/g, '<h3>1️⃣ $1</h3>');
    content = content.replace(/2️⃣\s*(.*?)(?=\n|$)/g, '<h3>2️⃣ $1</h3>');
    content = content.replace(/3️⃣\s*(.*?)(?=\n|$)/g, '<h3>3️⃣ $1</h3>');
    content = content.replace(/4️⃣\s*(.*?)(?=\n|$)/g, '<h3>4️⃣ $1</h3>');

    // Convertir les sauts de ligne en <br>
    content = content.replace(/\n/g, '<br>');

    // Mettre en gras les références juridiques (Article, Décret, etc.)
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

    // Mettre à jour le titre avec le premier message de l'utilisateur
    if (role === 'user' && state.currentConversation.messages.length === 1) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        updateConversationTitle(state.currentConversation.id, title);
    }

    saveConversations();
    displayMessages(state.currentConversation.messages);
}

// ============================================
// COMMUNICATION AVEC L'API
// ============================================

async function sendMessage(message) {
    if (state.isLoading) return;

    state.isLoading = true;
    setLoadingState(true);

    // Ajouter le message de l'utilisateur
    addMessage('user', message);

    try {
        // Préparer l'historique pour l'API
        const conversationHistory = state.currentConversation.messages
            .slice(0, -1) // Exclure le message qu'on vient d'ajouter
            .map(msg => ({
                role: msg.role,
                content: msg.content
            }));

        // Appel à l'API
        const response = await fetch(`${CONFIG.apiUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_history: conversationHistory.length > 0 ? conversationHistory : null
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Ajouter la réponse de l'assistant
        addMessage('assistant', data.response);

    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        addMessage('assistant', '❌ Erreur lors de la communication avec le serveur. Veuillez réessayer.');
    } finally {
        state.isLoading = false;
        setLoadingState(false);
    }
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
    // Bouton d'envoi
    const sendButton = document.getElementById('send-button');
    sendButton?.addEventListener('click', handleSendMessage);

    // Input textarea
    const userInput = document.getElementById('user-input');
    userInput?.addEventListener('input', updateCharCount);
    userInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Bouton nouveau conversation
    const newConversationBtn = document.getElementById('new-conversation');
    newConversationBtn?.addEventListener('click', createNewConversation);

    // Bouton toggle thème
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', toggleTheme);

    // Bouton toggle historique
    const historyToggle = document.getElementById('history-toggle');
    historyToggle?.addEventListener('click', toggleSidebar);

    // Bouton fermer sidebar
    const closeSidebar = document.getElementById('close-sidebar');
    closeSidebar?.addEventListener('click', toggleSidebar);

    // Bouton effacer historique
    const clearHistory = document.getElementById('clear-history');
    clearHistory?.addEventListener('click', clearAllConversations);
}

function handleSendMessage() {
    const input = document.getElementById('user-input');
    const message = input?.value.trim();

    if (!message || message.length === 0) {
        return;
    }

    if (message.length > CONFIG.maxMessageLength) {
        alert(`Le message est trop long (maximum ${CONFIG.maxMessageLength} caractères)`);
        return;
    }

    // Envoyer le message
    sendMessage(message);

    // Réinitialiser l'input
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

// ============================================
// EXPORT (si besoin pour tests)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        state,
        CONFIG,
        sendMessage,
        createNewConversation,
        loadConversation,
    };
}
