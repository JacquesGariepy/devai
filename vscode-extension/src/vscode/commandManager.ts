import * as vscode from 'vscode';
import { CoreAgentService } from '../services/coreAgentService';
import { I18nService } from '../services/i18nService';
import { WorkspaceService } from '../services/workspaceService';

/**
 * Gestionnaire de commandes pour l'extension
 */
export class CommandManager {
  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly coreAgentIntegration: any,
    private readonly workspaceService: WorkspaceService,
    private readonly i18nService: I18nService
  ) {}

  /**
   * Enregistre toutes les commandes de l'extension
   */
  public registerCommands(): void {
    // Commande pour démarrer l'assistant
    this._registerCommand('devai.start', this._openChatView.bind(this));
    
    // Commande pour ouvrir le panneau
    this._registerCommand('devai.openPanel', this._openChatView.bind(this));

    // Commande pour analyser le code
    this._registerCommand('devai.analyzeCode', this._analyzeCode.bind(this));

    // Commande pour générer des tests
    this._registerCommand('devai.generateTests', this._generateTests.bind(this));

    // Commande pour corriger les bugs
    this._registerCommand('devai.fixBugs', this._fixBugs.bind(this));

    // Commande pour optimiser le code
    this._registerCommand('devai.optimizeCode', this._optimizeCode.bind(this));

    // Commande pour générer de la documentation
    this._registerCommand('devai.generateDocumentation', this._documentCode.bind(this));

    // Commande pour expliquer le code
    this._registerCommand('devai.explainCode', this._explainCode.bind(this));

    // Commande pour ouvrir les paramètres
    this._registerCommand('devai.openSettings', this._openSettings.bind(this));
    
    // Alias pour la compatibilité interne
    this._registerCommand('devai.openChatView', this._openChatView.bind(this));
  }

  /**
   * Enregistre une commande
   * @param commandId ID de la commande
   * @param callback Fonction de rappel
   */
  private _registerCommand(commandId: string, callback: (...args: any[]) => any): void {
    const disposable = vscode.commands.registerCommand(commandId, callback);
    this.context.subscriptions.push(disposable);
  }

  /**
   * Ouvre la vue de chat
   */
  private async _openChatView(): Promise<void> {
    try {
      // D'abord ouvrir le conteneur de vues
      await vscode.commands.executeCommand('workbench.view.devai');
      // Puis se concentrer spécifiquement sur la vue devaiView
      await vscode.commands.executeCommand('devaiView.focus');
    } catch (error) {
      console.error('Error opening DevAI view:', error);
      vscode.window.showErrorMessage(
        this.i18nService.translate('commands.errorOpeningView')
      );
    }
  }

  /**
   * Analyse le code sélectionné ou le fichier actif
   */
  private async _analyzeCode(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.analyzeCode'),
      { code }
    );
  }

  /**
   * Génère des tests pour le code sélectionné ou le fichier actif
   */
  private async _generateTests(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.generateTests'),
      { code }
    );
  }

  /**
   * Corrige les bugs dans le code sélectionné ou le fichier actif
   */
  private async _fixBugs(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.fixBugs'),
      { code }
    );
  }

  /**
   * Optimise le code sélectionné ou le fichier actif
   */
  private async _optimizeCode(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.optimizeCode'),
      { code }
    );
  }

  /**
   * Documente le code sélectionné ou le fichier actif
   */
  private async _documentCode(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.documentCode'),
      { code }
    );
  }

  /**
   * Explique le code sélectionné ou le fichier actif
   */
  private async _explainCode(): Promise<void> {
    const code = await this._getSelectedOrActiveCode();
    if (!code) {
      return;
    }

    // Ouvrir la vue de chat
    await this._openChatView();

    // Envoyer la requête à l'agent
    await this.coreAgentIntegration.processRequest(
      this.i18nService.translate('commands.explainCode'),
      { code }
    );
  }

  /**
   * Ouvre les paramètres de l'extension
   */
  private async _openSettings(): Promise<void> {
    await vscode.commands.executeCommand('workbench.action.openSettings', 'devai');
  }

  /**
   * Récupère le code sélectionné ou le contenu du fichier actif
   * @returns Code sélectionné ou contenu du fichier actif
   */
  private async _getSelectedOrActiveCode(): Promise<string | undefined> {
    // Récupérer l'éditeur actif
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage(
        this.i18nService.translate('commands.noActiveEditor')
      );
      return undefined;
    }

    // Récupérer la sélection
    const selection = editor.selection;
    if (!selection.isEmpty) {
      return editor.document.getText(selection);
    }

    // Récupérer le contenu du fichier entier
    return editor.document.getText();
  }
}
