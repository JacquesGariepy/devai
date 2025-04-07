import * as vscode from 'vscode';
import { WebViewCommunication } from '../integration/webViewCommunication';

/**
 * Interface pour la réponse de l'agent
 */
export interface AgentResponse {
  text: string;
  toolCalls?: any[];
}

/**
 * Fournisseur de vue pour l'interface principale
 */
export class ViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _coreAgentService: any;
  private _i18nService: any;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _webViewCommunication: WebViewCommunication
  ) {}

  /**
   * Configure le fournisseur de vue avec les services nécessaires
   * @param services Services pour la vue
   */
  public configure(services: any): void {
    this._coreAgentService = services.coreAgentService;
    this._i18nService = services.i18nService;

    // S'abonner aux événements
    this._subscribeToEvents();
  }

  /**
   * S'abonne aux événements des services
   */
  private _subscribeToEvents(): void {
    if (!this._coreAgentService) {
      return;
    }

    // S'abonner aux changements d'état
    this._coreAgentService.onStatusChange((status: any) => {
      this._updateStatusInWebview(status);
    });

    // Simuler l'abonnement aux réponses
    console.log('Subscribed to core agent events');
  }

  /**
   * Met à jour le statut dans la vue WebView
   * @param status Statut à mettre à jour
   */
  private _updateStatusInWebview(status: any): void {
    if (!this._view) {
      console.warn('WebView is not initialized. Cannot update status.');
      return;
    }

    try {
      // Log the status being sent
      console.log('Updating WebView status:', status);

      // Ensure status is iterable or properly structured
      if (Array.isArray(status) || typeof status === 'object') {
        this._view.webview.postMessage({
          command: 'updateStatus',
          status
        });
      } else {
        console.warn('Status is not iterable or valid:', status);
      }
    } catch (error) {
      console.error('Error updating status in WebView:', error);
    }
  }

  /**
   * Résout la vue WebView
   * @param webviewView Vue WebView à résoudre
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    // Configurer les options de la WebView
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    // Définir le HTML de la WebView
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Configurer la communication WebView
    this._webViewCommunication.setWebview(webviewView.webview);

    // Écouter les messages de la WebView
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'sendMessage':
          await this._handleSendMessage(message.text);
          break;
        case 'clearConversation':
          await this._handleClearConversation();
          break;
        case 'getSettings':
          this._handleGetSettings();
          break;
      }
    });
  }

  /**
   * Gère l'envoi d'un message
   * @param text Texte du message
   */
  private async _handleSendMessage(text: string): Promise<void> {
    if (!this._coreAgentService) {
      return;
    }

    try {
      // Envoyer le message à l'agent
      const response = await this._coreAgentService.processRequest(text);

      // Envoyer la réponse à la WebView
      if (this._view) {
        this._view.webview.postMessage({
          command: 'receiveMessage',
          message: {
            role: 'assistant',
            content: response.text,
            toolCalls: response.toolCalls
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      vscode.window.showErrorMessage(
        this._i18nService?.translate('chat.sendError') || 'Error sending message'
      );
    }
  }

  /**
   * Gère l'effacement de la conversation
   */
  private async _handleClearConversation(): Promise<void> {
    if (!this._coreAgentService) {
      return;
    }

    try {
      // Effacer l'historique de conversation
      await this._coreAgentService.clearConversationHistory();

      // Notifier la WebView
      if (this._view) {
        this._view.webview.postMessage({
          command: 'conversationCleared'
        });
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
      vscode.window.showErrorMessage(
        this._i18nService?.translate('chat.clearError') || 'Error clearing conversation'
      );
    }
  }

  /**
   * Gère la récupération des paramètres
   */
  private _handleGetSettings(): void {
    // Envoyer les paramètres à la WebView
    if (this._view) {
      this._view.webview.postMessage({
        command: 'updateSettings',
        settings: {
          theme: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light',
          language: this._i18nService?.getCurrentLanguage() || 'en'
        }
      });
    }
  }

  /**
   * Génère le HTML pour la WebView
   * @param webview Instance WebView
   * @returns HTML pour la WebView
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Récupérer les URI des ressources
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'main.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'main.css')
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css')
    );

    // Générer un nonce pour la sécurité CSP
    const nonce = this._getNonce();

    // Retourner le HTML
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">
      <link href="${styleUri}" rel="stylesheet">
      <link href="${codiconsUri}" rel="stylesheet">
      <title>DevAI</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  /**
   * Génère un nonce aléatoire pour la sécurité CSP
   * @returns Nonce aléatoire
   */
  private _getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
