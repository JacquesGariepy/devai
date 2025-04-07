import * as vscode from 'vscode';
import { I18nService } from '../services/i18nService';
import { CoreAgentService } from '../services/coreAgentService';

/**
 * Gestionnaire de la barre d'état pour l'extension DevAI
 */
export class StatusBarManager {
  private _statusBarItem: vscode.StatusBarItem;
  private _isProcessing: boolean = false;
  private _currentModel: string = '';

  constructor(
    private readonly _i18nService: I18nService,
    private readonly _coreAgentService: CoreAgentService
  ) {
    // Créer l'élément de barre d'état
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this._statusBarItem.command = 'devai.openSettings';
    this._updateStatusBar();
    this._statusBarItem.show();

    // S'abonner aux événements de changement d'état
    this._coreAgentService.onStatusChange((status) => {
      this._isProcessing = status.isProcessing;
      this._currentModel = status.currentModel;
      this._updateStatusBar();
    });
  }

  /**
   * Met à jour l'affichage de la barre d'état
   */
  private _updateStatusBar(): void {
    if (this._isProcessing) {
      this._statusBarItem.text = `$(sync~spin) ${this._i18nService.translate('statusBar.processing')}`;
      this._statusBarItem.tooltip = this._i18nService.translate('statusBar.processingTooltip');
    } else {
      this._statusBarItem.text = `$(robot) DevAI${this._currentModel ? ` [${this._currentModel}]` : ''}`;
      this._statusBarItem.tooltip = this._i18nService.translate('statusBar.readyTooltip');
    }
  }

  /**
   * Indique que l'agent est en train de traiter une requête
   */
  public setProcessing(isProcessing: boolean): void {
    this._isProcessing = isProcessing;
    this._updateStatusBar();
  }

  /**
   * Définit le modèle LLM actuellement utilisé
   */
  public setCurrentModel(model: string): void {
    this._currentModel = model;
    this._updateStatusBar();
  }

  /**
   * Affiche un message temporaire dans la barre d'état
   * @param message Message à afficher
   * @param duration Durée d'affichage en millisecondes
   */
  public showTemporaryMessage(message: string, duration: number = 3000): void {
    const originalText = this._statusBarItem.text;
    const originalTooltip = this._statusBarItem.tooltip;

    this._statusBarItem.text = `$(info) ${message}`;
    this._statusBarItem.tooltip = message;

    setTimeout(() => {
      this._updateStatusBar();
    }, duration);
  }

  /**
   * Dispose des ressources
   */
  public dispose(): void {
    this._statusBarItem.dispose();
  }
}
