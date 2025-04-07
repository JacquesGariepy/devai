import * as vscode from 'vscode';
import { CoreAgentIntegration } from '../integration/coreAgentIntegration';
import { I18nService } from '../services/i18nService';

/**
 * Classe pour gérer la communication entre la WebView et l'extension
 */
export class WebViewCommunication {
  private _webview: vscode.Webview | undefined;
  private _coreAgentIntegration: CoreAgentIntegration;
  private _i18nService: I18nService;

  /**
   * Constructeur de la classe WebViewCommunication
   * @param coreAgentIntegration Intégration du Core Agent
   * @param i18nService Service d'internationalisation
   */
  constructor(
    coreAgentIntegration: CoreAgentIntegration,
    i18nService: I18nService
  ) {
    this._coreAgentIntegration = coreAgentIntegration;
    this._i18nService = i18nService;
  }

  /**
   * Configure la communication WebView
   * @param options Options de configuration
   */
  public configure(options: any): void {
    this._coreAgentIntegration = options.coreAgentIntegration;
    this._i18nService = options.i18nService;
  }

  /**
   * Définit la WebView à utiliser pour la communication
   * @param webview Instance WebView
   */
  public setWebview(webview: vscode.Webview): void {
    this._webview = webview;
  }

  /**
   * Envoie un message à la WebView
   * @param message Message à envoyer
   */
  public sendMessage(message: any): void {
    if (this._webview) {
      this._webview.postMessage(message);
    }
  }

  /**
   * Traite un message reçu de la WebView
   * @param message Message reçu
   */
  public async processMessage(message: any): Promise<void> {
    if (!this._coreAgentIntegration) {
      console.error('Core Agent integration not configured');
      return;
    }

    switch (message.command) {
      case 'sendMessage':
        await this._handleSendMessage(message.text);
        break;
      case 'clearConversation':
        await this._handleClearConversation();
        break;
      case 'executeAction':
        await this._handleExecuteAction(message.action, message.params);
        break;
      default:
        console.warn('Unknown command:', message.command);
    }
  }

  /**
   * Gère l'envoi d'un message
   * @param text Texte du message
   */
  private async _handleSendMessage(text: string): Promise<void> {
    try {
      const response = await this._coreAgentIntegration.processRequest(text);
      this.sendMessage({
        command: 'receiveMessage',
        message: {
          role: 'assistant',
          content: response.text,
          toolCalls: response.toolCalls
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      this.sendMessage({
        command: 'error',
        message: this._i18nService.translate('chat.sendError')
      });
    }
  }

  /**
   * Gère l'effacement de la conversation
   */
  private async _handleClearConversation(): Promise<void> {
    try {
      // Simuler l'effacement de la conversation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.sendMessage({
        command: 'conversationCleared'
      });
    } catch (error) {
      console.error('Error clearing conversation:', error);
      this.sendMessage({
        command: 'error',
        message: this._i18nService.translate('chat.clearError')
      });
    }
  }

  /**
   * Gère l'exécution d'une action
   * @param action Action à exécuter
   * @param params Paramètres de l'action
   */
  private async _handleExecuteAction(action: string, params: any): Promise<void> {
    try {
      // Simuler l'exécution d'une action
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.sendMessage({
        command: 'actionExecuted',
        action,
        result: { success: true }
      });
    } catch (error) {
      console.error('Error executing action:', error);
      this.sendMessage({
        command: 'error',
        message: this._i18nService.translate('action.executeError')
      });
    }
  }
}
