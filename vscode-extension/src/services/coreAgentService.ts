import * as vscode from 'vscode';
import { DevAICore, CoreConfig } from './core-agent-stub';
import { I18nService } from './i18nService';

/**
 * Interface pour les événements de changement d'état
 */
export interface StatusChangeEvent {
  isProcessing: boolean;
  currentModel: string;
}

/**
 * Service pour l'interaction avec le Core Agent
 */
export class CoreAgentService {
  private _core: DevAICore | null = null;
  private _statusChangeEmitter = new vscode.EventEmitter<StatusChangeEvent>();
  
  constructor(
    private readonly _i18nService: I18nService
  ) {}

  /**
   * Initialise le Core Agent
   * @param config Configuration du Core Agent
   */
  public async initialize(config: CoreConfig): Promise<void> {
    try {
      this._core = new DevAICore(config);
      await this._core.initialize();
      this._updateStatus(false, config.llm?.model || '');
    } catch (error) {
      console.error('Error initializing Core Agent:', error);
      vscode.window.showErrorMessage(
        this._i18nService.translate('coreAgent.initError')
      );
      throw error;
    }
  }

  /**
   * Traite une requête utilisateur
   * @param request Requête de l'utilisateur
   * @param context Contexte supplémentaire
   * @returns Réponse du Core Agent
   */
  public async processRequest(request: string, context?: any): Promise<any> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    try {
      this._updateStatus(true, '');
      const response = await this._core.processRequest(request, context);
      this._updateStatus(false, this._core.getCurrentModel());
      return response;
    } catch (error) {
      console.error('Error processing request:', error);
      this._updateStatus(false, this._core.getCurrentModel());
      throw error;
    }
  }

  /**
   * Récupère l'historique des conversations
   * @returns Historique des conversations
   */
  public async getConversationHistory(): Promise<any[]> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    return this._core.getConversationHistory();
  }

  /**
   * Efface l'historique des conversations
   */
  public async clearConversationHistory(): Promise<void> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    await this._core.clearConversationHistory();
  }

  /**
   * Restaure une conversation à partir de son ID
   * @param id ID de la conversation à restaurer
   */
  public async restoreConversation(id: string): Promise<void> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    await this._core.restoreConversation(id);
  }

  /**
   * Récupère les outils disponibles
   * @returns Liste des outils disponibles
   */
  public async getAvailableTools(): Promise<any[]> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    return this._core.getAvailableTools();
  }

  /**
   * Active ou désactive un outil
   * @param id ID de l'outil
   * @param enabled État d'activation
   */
  public async setToolEnabled(id: string, enabled: boolean): Promise<void> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    await this._core.setToolEnabled(id, enabled);
  }

  /**
   * Exécute un outil directement
   * @param id ID de l'outil
   * @param params Paramètres pour l'exécution
   * @returns Résultat de l'exécution
   */
  public async executeToolDirectly(id: string, params: any): Promise<any> {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    return this._core.executeToolDirectly(id, params);
  }

  /**
   * Enregistre un gestionnaire d'outil
   * @param toolName Nom de l'outil
   * @param handler Fonction de gestion
   */
  public registerToolHandler(toolName: string, handler: (params: any) => Promise<any>): void {
    if (!this._core) {
      throw new Error('Core Agent not initialized');
    }

    this._core.registerToolHandler(toolName, handler);
  }

  /**
   * Met à jour l'état du Core Agent
   * @param status Nouvel état
   */
  public updateStatus(status: Partial<StatusChangeEvent>): void {
    if (!this._core) {
      return;
    }

    const currentStatus = {
      isProcessing: false,
      currentModel: this._core.getCurrentModel()
    };

    this._updateStatus(
      status.isProcessing !== undefined ? status.isProcessing : currentStatus.isProcessing,
      status.currentModel !== undefined ? status.currentModel : currentStatus.currentModel
    );
  }

  /**
   * Événement déclenché lors d'un changement d'état
   */
  public get onStatusChange(): vscode.Event<StatusChangeEvent> {
    return this._statusChangeEmitter.event;
  }

  /**
   * Met à jour l'état et émet un événement
   * @param isProcessing Indique si l'agent est en train de traiter une requête
   * @param currentModel Modèle LLM actuellement utilisé
   */
  private _updateStatus(isProcessing: boolean, currentModel: string): void {
    this._statusChangeEmitter.fire({
      isProcessing,
      currentModel
    });
  }
}
