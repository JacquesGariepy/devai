import * as vscode from 'vscode';

/**
 * Service d'internationalisation pour l'extension
 */
export class I18nService {
  private _currentLanguage: string;
  private _translations: Record<string, Record<string, string>> = {
    'fr': {
      'extension.activated': 'Extension DevAI activée avec succès !',
      'extension.deactivated': 'Extension DevAI désactivée.',
      'chat.sendError': 'Erreur lors de l\'envoi du message.',
      'chat.clearError': 'Erreur lors de l\'effacement de la conversation.',
      'coreAgent.initError': 'Erreur lors de l\'initialisation du Core Agent.',
      'coreAgent.processError': 'Erreur lors du traitement de la requête.',
      'docker.notAvailable': 'Docker n\'est pas disponible sur ce système.',
      'docker.sandboxDisabled': 'Le sandbox Docker est désactivé.',
      'commands.noActiveEditor': 'Aucun éditeur actif.',
      'commands.analyzeCode': 'Analyser ce code',
      'commands.generateTests': 'Générer des tests pour ce code',
      'commands.fixBugs': 'Corriger les bugs dans ce code',
      'commands.optimizeCode': 'Optimiser ce code',
      'commands.documentCode': 'Documenter ce code',
      'commands.explainCode': 'Expliquer ce code',
      'history.title': 'Historique',
      'history.clearTooltip': 'Effacer l\'historique',
      'history.empty': 'Aucune conversation dans l\'historique',
      'history.cleared': 'Historique effacé avec succès',
      'history.clearError': 'Erreur lors de l\'effacement de l\'historique',
      'history.restored': 'Conversation restaurée avec succès',
      'history.restoreError': 'Erreur lors de la restauration de la conversation',
      'tools.title': 'Outils',
      'tools.searchPlaceholder': 'Rechercher des outils...',
      'tools.empty': 'Aucun outil disponible',
      'tools.enabled': 'Outil {name} activé',
      'tools.disabled': 'Outil {name} désactivé',
      'tools.toggleError': 'Erreur lors de la modification de l\'état de l\'outil',
      'tools.executed': 'Outil {name} exécuté avec succès',
      'tools.executeError': 'Erreur lors de l\'exécution de l\'outil',
      'statusBar.processing': 'DevAI en cours de traitement...',
      'statusBar.processingTooltip': 'DevAI est en train de traiter votre requête',
      'statusBar.readyTooltip': 'DevAI est prêt à vous aider',
      'common.loading': 'Chargement...'
    },
    'en': {
      'extension.activated': 'DevAI extension successfully activated!',
      'extension.deactivated': 'DevAI extension deactivated.',
      'chat.sendError': 'Error sending message.',
      'chat.clearError': 'Error clearing conversation.',
      'coreAgent.initError': 'Error initializing Core Agent.',
      'coreAgent.processError': 'Error processing request.',
      'docker.notAvailable': 'Docker is not available on this system.',
      'docker.sandboxDisabled': 'Docker sandbox is disabled.',
      'commands.noActiveEditor': 'No active editor.',
      'commands.analyzeCode': 'Analyze this code',
      'commands.generateTests': 'Generate tests for this code',
      'commands.fixBugs': 'Fix bugs in this code',
      'commands.optimizeCode': 'Optimize this code',
      'commands.documentCode': 'Document this code',
      'commands.explainCode': 'Explain this code',
      'history.title': 'History',
      'history.clearTooltip': 'Clear history',
      'history.empty': 'No conversations in history',
      'history.cleared': 'History cleared successfully',
      'history.clearError': 'Error clearing history',
      'history.restored': 'Conversation restored successfully',
      'history.restoreError': 'Error restoring conversation',
      'tools.title': 'Tools',
      'tools.searchPlaceholder': 'Search tools...',
      'tools.empty': 'No tools available',
      'tools.enabled': 'Tool {name} enabled',
      'tools.disabled': 'Tool {name} disabled',
      'tools.toggleError': 'Error toggling tool state',
      'tools.executed': 'Tool {name} executed successfully',
      'tools.executeError': 'Error executing tool',
      'statusBar.processing': 'DevAI processing...',
      'statusBar.processingTooltip': 'DevAI is processing your request',
      'statusBar.readyTooltip': 'DevAI is ready to help you',
      'common.loading': 'Loading...'
    }
  };

  /**
   * Constructeur du service d'internationalisation
   * @param language Langue initiale
   */
  constructor(language: string) {
    this._currentLanguage = this._normalizeLanguage(language);
  }

  /**
   * Récupère la langue actuelle
   * @returns Code de langue actuel
   */
  public getCurrentLanguage(): string {
    return this._currentLanguage;
  }

  /**
   * Définit la langue actuelle
   * @param language Nouvelle langue
   */
  public setLanguage(language: string): void {
    this._currentLanguage = this._normalizeLanguage(language);
  }

  /**
   * Traduit une clé dans la langue actuelle
   * @param key Clé de traduction
   * @param params Paramètres de remplacement
   * @returns Texte traduit
   */
  public translate(key: string, params?: Record<string, any>): string {
    // Récupérer les traductions pour la langue actuelle
    const translations = this._translations[this._currentLanguage] || this._translations['en'];
    
    // Récupérer la traduction pour la clé
    let translation = translations[key] || key;
    
    // Remplacer les paramètres
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      }
    }
    
    return translation;
  }

  /**
   * Normalise le code de langue
   * @param language Code de langue
   * @returns Code de langue normalisé
   */
  private _normalizeLanguage(language: string): string {
    // Extraire le code de langue principal (avant le tiret)
    const mainLanguage = language.split('-')[0].toLowerCase();
    
    // Vérifier si la langue est supportée
    if (this._translations[mainLanguage]) {
      return mainLanguage;
    }
    
    // Langue par défaut
    return 'en';
  }
}
