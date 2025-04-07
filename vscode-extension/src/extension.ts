import * as vscode from 'vscode';
import { ViewProvider } from './webview/viewProvider';
import { ConfigurationService } from './services/configurationService';
import { I18nService } from './services/i18nService';
import { CoreAgentService } from './services/coreAgentService';
import { WorkspaceService } from './services/workspaceService';
import { TerminalService } from './services/terminalService';
import { FileSystemService } from './services/fileSystemService';
import { CoreAgentIntegration } from './integration/coreAgentIntegration';
import { WebViewCommunication } from './integration/webViewCommunication';
import { CommandManager } from './vscode/commandManager';
import { SecurityManager } from './security/securityManager';
import { DockerSandboxManager } from './security/dockerSandboxManager';
import { SecurityIntegration } from './security/securityIntegration';
import { HistoryViewProvider } from './vscode/historyViewProvider';
import { ToolsViewProvider } from './vscode/toolsViewProvider';
import { StatusBarManager } from './vscode/statusBarManager';

// Activation de l'extension
export async function activate(context: vscode.ExtensionContext) {
  console.log('DevAI extension is now active!');

  try {
    // Initialiser les services
    const i18nService = new I18nService(vscode.env.language || 'en');
    const configService = new ConfigurationService(context);
    const coreAgentService = new CoreAgentService(i18nService);
    const workspaceService = new WorkspaceService();
    const terminalService = new TerminalService();
    const fileSystemService = new FileSystemService();
    const securityManager = new SecurityManager(i18nService, configService);
    const dockerSandboxManager = new DockerSandboxManager(terminalService, i18nService, configService);

    // Initialiser l'intégration de sécurité
    const securityIntegration = new SecurityIntegration(
      securityManager,
      dockerSandboxManager,
      coreAgentService,
      i18nService
    );
    await securityIntegration.initialize();

    // Initialiser l'intégration du Core Agent
    const coreAgentIntegration = new CoreAgentIntegration(
      coreAgentService,
      configService,
      workspaceService,
      terminalService,
      fileSystemService,
      i18nService
    );
    await coreAgentIntegration.initialize();

    // Initialiser la communication WebView
    const webViewCommunication = new WebViewCommunication(
      coreAgentIntegration,
      i18nService
    );

    // Initialiser le gestionnaire de commandes
    const commandManager = new CommandManager(
      context,
      coreAgentIntegration,
      workspaceService,
      i18nService
    );
    commandManager.registerCommands();

    // Initialiser les fournisseurs de vue
    const viewProvider = new ViewProvider(context.extensionUri, webViewCommunication);
    viewProvider.configure({
      coreAgentService,
      i18nService
    });
    
    const historyViewProvider = new HistoryViewProvider(context.extensionUri, i18nService, coreAgentService);
    const toolsViewProvider = new ToolsViewProvider(context.extensionUri, i18nService, coreAgentService);

    // Initialiser le gestionnaire de barre d'état
    const statusBarManager = new StatusBarManager(i18nService, coreAgentService);

    // Enregistrer les fournisseurs de vue avec les identifiants corrects
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        'devaiView', // ID de la vue défini dans package.json
        viewProvider
      ),
      vscode.window.registerWebviewViewProvider(
        HistoryViewProvider.viewType,
        historyViewProvider
      ),
      vscode.window.registerWebviewViewProvider(
        ToolsViewProvider.viewType,
        toolsViewProvider
      )
    );

    // Initialiser le gestionnaire de barre d'état
    statusBarManager.initialize();

    // Afficher un message de bienvenue
    vscode.window.showInformationMessage(
      i18nService.translate('extension.activated')
    );

  } catch (error) {
    console.error('Error activating DevAI extension:', error);
    vscode.window.showErrorMessage(
      'Failed to activate DevAI extension. See console for details.'
    );
  }
}

// Désactivation de l'extension
export function deactivate() {
  console.log('DevAI extension is now deactivated!');
}
