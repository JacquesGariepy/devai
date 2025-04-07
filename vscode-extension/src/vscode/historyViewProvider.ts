import * as vscode from 'vscode';
import { I18nService } from '../services/i18nService';
import { CoreAgentService } from '../services/coreAgentService';

/**
 * Interface représentant un élément d'historique
 */
export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
}

/**
 * Fournisseur de vue pour l'historique des conversations et des actions
 */
export class HistoryViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'devai.historyView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _i18nService: I18nService,
    private readonly _coreAgentService: CoreAgentService
  ) {}

  /**
   * Résout la vue WebView pour l'historique
   * @param webviewView Vue WebView à résoudre
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Écouter les messages du WebView
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'getHistory':
          this._sendHistoryToWebview();
          break;
        case 'clearHistory':
          await this._clearHistory();
          break;
        case 'restoreConversation':
          await this._restoreConversation(message.id);
          break;
      }
    });

    // Mettre à jour l'historique lorsque la vue devient visible
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this._sendHistoryToWebview();
      }
    });
  }

  /**
   * Envoie l'historique au WebView
   */
  private async _sendHistoryToWebview() {
    if (!this._view) return;

    try {
      const history = await this._coreAgentService.getConversationHistory();
      this._view.webview.postMessage({
        command: 'updateHistory',
        history
      });
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }

  /**
   * Efface l'historique des conversations
   */
  private async _clearHistory() {
    try {
      await this._coreAgentService.clearConversationHistory();
      this._sendHistoryToWebview();
      vscode.window.showInformationMessage(
        this._i18nService.translate('history.cleared')
      );
    } catch (error) {
      console.error('Error clearing history:', error);
      vscode.window.showErrorMessage(
        this._i18nService.translate('history.clearError')
      );
    }
  }

  /**
   * Restaure une conversation à partir de son ID
   * @param id ID de la conversation à restaurer
   */
  private async _restoreConversation(id: string) {
    try {
      await this._coreAgentService.restoreConversation(id);
      vscode.commands.executeCommand('devai.openPanel');
      vscode.window.showInformationMessage(
        this._i18nService.translate('history.restored')
      );
    } catch (error) {
      console.error('Error restoring conversation:', error);
      vscode.window.showErrorMessage(
        this._i18nService.translate('history.restoreError')
      );
    }
  }

  /**
   * Génère le HTML pour le WebView
   * @param webview Instance WebView
   * @returns HTML pour le WebView
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'history.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'history.css')
    );
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        'node_modules',
        '@vscode/codicons',
        'dist',
        'codicon.css'
      )
    );

    const nonce = this._getNonce();

    return `<!DOCTYPE html>
    <html lang="${this._i18nService.getCurrentLanguage()}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">
      <link href="${styleUri}" rel="stylesheet">
      <link href="${codiconsUri}" rel="stylesheet">
      <title>${this._i18nService.translate('history.title')}</title>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${this._i18nService.translate('history.title')}</h2>
          <button class="clear-button" title="${this._i18nService.translate('history.clearTooltip')}">
            <i class="codicon codicon-trash"></i>
          </button>
        </div>
        <div class="history-list">
          <div class="loading">${this._i18nService.translate('common.loading')}</div>
          <div class="empty-state hidden">${this._i18nService.translate('history.empty')}</div>
          <div class="history-items"></div>
        </div>
      </div>
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
