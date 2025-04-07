import * as vscode from 'vscode';
import { I18nService } from '../services/i18nService';
import { CoreAgentService } from '../services/coreAgentService';

/**
 * Interface représentant un outil disponible
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  enabled: boolean;
}

/**
 * Fournisseur de vue pour les outils disponibles
 */
export class ToolsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'devai.toolsView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _i18nService: I18nService,
    private readonly _coreAgentService: CoreAgentService
  ) {}

  /**
   * Résout la vue WebView pour les outils
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
        case 'getTools':
          this._sendToolsToWebview();
          break;
        case 'toggleTool':
          await this._toggleTool(message.id, message.enabled);
          break;
        case 'executeTool':
          await this._executeTool(message.id, message.params);
          break;
      }
    });

    // Mettre à jour les outils lorsque la vue devient visible
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this._sendToolsToWebview();
      }
    });
  }

  /**
   * Envoie la liste des outils au WebView
   */
  private async _sendToolsToWebview() {
    if (!this._view) return;

    try {
      const tools = await this._coreAgentService.getAvailableTools();
      this._view.webview.postMessage({
        command: 'updateTools',
        tools
      });
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  }

  /**
   * Active ou désactive un outil
   * @param id ID de l'outil à activer/désactiver
   * @param enabled État d'activation
   */
  private async _toggleTool(id: string, enabled: boolean) {
    try {
      await this._coreAgentService.setToolEnabled(id, enabled);
      this._sendToolsToWebview();
      vscode.window.showInformationMessage(
        this._i18nService.translate(
          enabled ? 'tools.enabled' : 'tools.disabled',
          { name: id }
        )
      );
    } catch (error) {
      console.error('Error toggling tool:', error);
      vscode.window.showErrorMessage(
        this._i18nService.translate('tools.toggleError')
      );
    }
  }

  /**
   * Exécute un outil directement
   * @param id ID de l'outil à exécuter
   * @param params Paramètres pour l'exécution de l'outil
   */
  private async _executeTool(id: string, params: any) {
    try {
      const result = await this._coreAgentService.executeToolDirectly(id, params);
      vscode.window.showInformationMessage(
        this._i18nService.translate('tools.executed', { name: id })
      );
      
      // Afficher le résultat dans un panneau de sortie
      const outputChannel = vscode.window.createOutputChannel('DevAI Tool Execution');
      outputChannel.clear();
      outputChannel.appendLine(`Tool: ${id}`);
      outputChannel.appendLine(`Result: ${JSON.stringify(result, null, 2)}`);
      outputChannel.show();
    } catch (error) {
      console.error('Error executing tool:', error);
      vscode.window.showErrorMessage(
        this._i18nService.translate('tools.executeError')
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
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'tools.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'webview', 'tools.css')
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
      <title>${this._i18nService.translate('tools.title')}</title>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${this._i18nService.translate('tools.title')}</h2>
          <div class="search-container">
            <input type="text" id="search-tools" placeholder="${this._i18nService.translate('tools.searchPlaceholder')}">
            <i class="codicon codicon-search"></i>
          </div>
        </div>
        <div class="tools-list">
          <div class="loading">${this._i18nService.translate('common.loading')}</div>
          <div class="empty-state hidden">${this._i18nService.translate('tools.empty')}</div>
          <div class="tools-categories"></div>
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
