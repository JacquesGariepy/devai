import * as vscode from 'vscode';
import { CoreAgentService } from '../services/coreAgentService';
import { I18nService } from '../services/i18nService';
import { WorkspaceService } from '../services/workspaceService';
import { FileSystemService } from '../services/fileSystemService';
import { TerminalService } from '../services/terminalService';

/**
 * Interface pour les options d'intégration
 */
export interface IntegrationOptions {
  context?: any;
}

/**
 * Intégration du Core Agent avec l'extension VS Code
 */
export class CoreAgentIntegration {
  constructor(
    private readonly coreAgentService: CoreAgentService,
    private readonly configService: any,
    private readonly workspaceService: WorkspaceService,
    private readonly terminalService: TerminalService,
    private readonly fileSystemService: FileSystemService,
    private readonly i18nService: I18nService
  ) {}

  /**
   * Initialise l'intégration
   */
  public async initialize(): Promise<void> {
    try {
      // Récupérer la configuration
      const config = this.configService.getConfig();

      // Initialiser le Core Agent
      await this.coreAgentService.initialize({
        llm: {
          provider: config.llm.provider,
          model: config.llm.model,
          apiKey: config.llm.apiKey,
          endpoint: config.llm.endpoint
        },
        tools: {
          enabledTools: config.tools.enabledTools
        },
        memory: {
          conversationHistorySize: config.memory.conversationHistorySize
        },
        security: {
          sandboxEnabled: config.security.sandboxEnabled
        },
        i18n: {
          language: this.i18nService.getCurrentLanguage()
        }
      });

      // Enregistrer les gestionnaires d'outils
      this._registerToolHandlers();

      console.log('Core Agent integration initialized');
    } catch (error) {
      console.error('Error initializing Core Agent integration:', error);
      vscode.window.showErrorMessage(
        this.i18nService.translate('coreAgent.initError')
      );
      throw error;
    }
  }

  /**
   * Traite une requête utilisateur
   * @param request Requête de l'utilisateur
   * @param options Options supplémentaires
   * @returns Réponse du Core Agent
   */
  public async processRequest(request: string, options?: IntegrationOptions): Promise<any> {
    try {
      // Préparer le contexte
      const context = await this._prepareContext(options);

      // Traiter la requête
      return await this.coreAgentService.processRequest(request, context);
    } catch (error) {
      console.error('Error processing request:', error);
      vscode.window.showErrorMessage(
        this.i18nService.translate('coreAgent.processError')
      );
      throw error;
    }
  }

  /**
   * Prépare le contexte pour la requête
   * @param options Options supplémentaires
   * @returns Contexte préparé
   */
  private async _prepareContext(options?: IntegrationOptions): Promise<any> {
    // Contexte de base
    const context: any = {
      workspace: await this._getWorkspaceContext(),
      editor: await this._getEditorContext(),
      ...options?.context
    };

    return context;
  }

  /**
   * Récupère le contexte du workspace
   * @returns Contexte du workspace
   */
  private async _getWorkspaceContext(): Promise<any> {
    return {
      folders: this.workspaceService.getWorkspaceFolders(),
      activeFolder: this.workspaceService.getActiveWorkspaceFolder()
    };
  }

  /**
   * Récupère le contexte de l'éditeur
   * @returns Contexte de l'éditeur
   */
  private async _getEditorContext(): Promise<any> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return null;
    }

    return {
      fileName: editor.document.fileName,
      languageId: editor.document.languageId,
      selection: editor.selection ? {
        start: editor.selection.start,
        end: editor.selection.end,
        text: editor.document.getText(editor.selection)
      } : null
    };
  }

  /**
   * Enregistre les gestionnaires d'outils
   */
  private _registerToolHandlers(): void {
    // Gestionnaire pour la lecture de fichiers
    this.coreAgentService.registerToolHandler('file.read', async (params: any) => {
      return await this.fileSystemService.readFile(params.path);
    });

    // Gestionnaire pour l'écriture de fichiers
    this.coreAgentService.registerToolHandler('file.write', async (params: any) => {
      await this.fileSystemService.writeFile(params.path, params.content, params.append);
      return { success: true };
    });

    // Gestionnaire pour l'exécution de commandes dans le terminal
    this.coreAgentService.registerToolHandler('terminal.execute', async (params: any) => {
      return await this.terminalService.executeCommand(params.command, params.cwd);
    });

    // Autres gestionnaires d'outils...
  }
}
