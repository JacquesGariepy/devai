/**
 * Tests d'intégration pour le projet DevAI
 * 
 * Ce fichier contient les tests d'intégration qui vérifient l'interaction
 * entre le Core Agent et l'extension VS Code.
 */

import { DevAICore } from '../../core-agent/src/index';
import { CoreAgentIntegration } from '../src/integration/coreAgentIntegration';
import { WebViewCommunication } from '../src/integration/webViewCommunication';
import { SecurityIntegration } from '../src/security/securityIntegration';
import { ConfigurationService } from '../src/services/configurationService';
import { I18nService } from '../src/services/i18nService';
import { CoreAgentService } from '../src/services/coreAgentService';
import { WorkspaceService } from '../src/services/workspaceService';
import { TerminalService } from '../src/services/terminalService';
import { FileSystemService } from '../src/services/fileSystemService';
import { SecurityManager } from '../src/security/securityManager';
import { DockerSandboxManager } from '../src/security/dockerSandboxManager';

// Mock pour vscode
jest.mock('vscode');

// Mock pour le Core Agent
jest.mock('../../core-agent/src/index');

describe('Intégration Core Agent - Extension VS Code', () => {
  let coreAgentIntegration: CoreAgentIntegration;
  let coreAgentService: CoreAgentService;
  let configService: ConfigurationService;
  let i18nService: I18nService;
  let workspaceService: WorkspaceService;
  let terminalService: TerminalService;
  let fileSystemService: FileSystemService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer les services nécessaires
    configService = new ConfigurationService();
    i18nService = new I18nService('fr');
    workspaceService = new WorkspaceService();
    terminalService = new TerminalService();
    fileSystemService = new FileSystemService();
    
    // Mock pour getLLMConfig
    configService.getLLMConfig = jest.fn().mockReturnValue({
      provider: 'openai',
      model: 'gpt-4',
      apiKey: 'test-api-key'
    });
    
    // Mock pour le Core Agent
    const mockDevAICore = DevAICore as jest.Mock;
    mockDevAICore.mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(undefined),
      processRequest: jest.fn().mockResolvedValue({
        text: 'Réponse de test'
      }),
      isInitialized: jest.fn().mockReturnValue(true),
      registerToolHandler: jest.fn()
    }));
    
    // Créer le service Core Agent
    coreAgentService = new CoreAgentService(configService);
    
    // Créer l'intégration Core Agent
    coreAgentIntegration = new CoreAgentIntegration(
      coreAgentService,
      configService,
      workspaceService,
      terminalService,
      fileSystemService,
      i18nService
    );
  });
  
  test('devrait initialiser le Core Agent', async () => {
    // Initialiser l'intégration
    await coreAgentIntegration.initialize();
    
    // Vérifier que le Core Agent a été initialisé
    expect(coreAgentService.isInitialized()).toBe(true);
  });
  
  test('devrait traiter une requête', async () => {
    // Initialiser l'intégration
    await coreAgentIntegration.initialize();
    
    // Traiter une requête
    const response = await coreAgentIntegration.processRequest('Requête de test');
    
    // Vérifier la réponse
    expect(response).toBeDefined();
    expect(response.text).toBe('Réponse de test');
  });
  
  test('devrait exécuter une commande spécifique', async () => {
    // Initialiser l'intégration
    await coreAgentIntegration.initialize();
    
    // Exécuter une commande
    const response = await coreAgentIntegration.executeCommand('analyzeCode', {
      code: 'function test() { return true; }'
    });
    
    // Vérifier la réponse
    expect(response).toBeDefined();
    expect(response.text).toBe('Réponse de test');
  });
});

describe('Intégration WebView - Extension VS Code', () => {
  let webViewCommunication: WebViewCommunication;
  let coreAgentIntegration: CoreAgentIntegration;
  let i18nService: I18nService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer les services nécessaires
    i18nService = new I18nService('fr');
    
    // Mock pour le Core Agent Integration
    coreAgentIntegration = {
      processRequest: jest.fn().mockResolvedValue({
        text: 'Réponse de test'
      })
    } as any;
    
    // Créer la communication WebView
    webViewCommunication = new WebViewCommunication(
      coreAgentIntegration,
      i18nService
    );
    
    // Mock pour webviewView
    const mockWebviewView = {
      webview: {
        postMessage: jest.fn(),
        onDidReceiveMessage: jest.fn()
      }
    };
    
    // Définir la vue WebView
    webViewCommunication.setWebviewView(mockWebviewView as any);
  });
  
  test('devrait envoyer un message à la WebView', () => {
    // Envoyer un message
    webViewCommunication.sendMessageToWebView({
      type: 'test',
      data: 'test'
    });
    
    // Vérifier que postMessage a été appelé
    expect(webViewCommunication['webviewView']?.webview.postMessage).toHaveBeenCalledWith({
      type: 'test',
      data: 'test'
    });
  });
  
  test('devrait envoyer un message de bienvenue', () => {
    // Envoyer un message de bienvenue
    webViewCommunication.sendWelcomeMessage();
    
    // Vérifier que postMessage a été appelé
    expect(webViewCommunication['webviewView']?.webview.postMessage).toHaveBeenCalled();
  });
});

describe('Intégration Sécurité', () => {
  let securityIntegration: SecurityIntegration;
  let securityManager: SecurityManager;
  let dockerSandboxManager: DockerSandboxManager;
  let coreAgentService: CoreAgentService;
  let terminalService: TerminalService;
  let fileSystemService: FileSystemService;
  let i18nService: I18nService;
  let configService: ConfigurationService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer les services nécessaires
    i18nService = new I18nService('fr');
    configService = new ConfigurationService();
    terminalService = new TerminalService();
    fileSystemService = new FileSystemService();
    
    // Mock pour les services
    securityManager = {
      isWorkspaceTrusted: jest.fn().mockReturnValue(true),
      canExecuteInTerminal: jest.fn().mockResolvedValue(true),
      canModifyFile: jest.fn().mockResolvedValue(true),
      canExecuteInDockerSandbox: jest.fn().mockResolvedValue(true),
      isActionAllowed: jest.fn().mockResolvedValue(true)
    } as any;
    
    dockerSandboxManager = {
      isDockerAvailable: jest.fn().mockResolvedValue(true),
      executeInDocker: jest.fn().mockResolvedValue({
        stdout: 'Résultat de la commande',
        stderr: '',
        exitCode: 0
      })
    } as any;
    
    coreAgentService = {
      registerToolHandler: jest.fn(),
      updateStatus: jest.fn()
    } as any;
    
    // Créer l'intégration de sécurité
    securityIntegration = new SecurityIntegration(
      securityManager,
      dockerSandboxManager,
      coreAgentService,
      terminalService,
      fileSystemService
    );
  });
  
  test('devrait initialiser l\'intégration de sécurité', () => {
    // Initialiser l'intégration
    securityIntegration.initialize();
    
    // Vérifier que les gestionnaires d'outils ont été enregistrés
    expect(coreAgentService.registerToolHandler).toHaveBeenCalledTimes(3);
  });
  
  test('devrait vérifier la disponibilité de Docker', async () => {
    // Initialiser l'intégration
    securityIntegration.initialize();
    
    // Attendre que la vérification soit terminée
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Vérifier que isDockerAvailable a été appelé
    expect(dockerSandboxManager.isDockerAvailable).toHaveBeenCalled();
    
    // Vérifier que updateStatus a été appelé
    expect(coreAgentService.updateStatus).toHaveBeenCalledWith({
      dockerAvailable: true
    });
  });
  
  test('devrait vérifier si le workspace est de confiance', () => {
    // Vérifier si le workspace est de confiance
    const isTrusted = securityIntegration.isWorkspaceTrusted();
    
    // Vérifier que isWorkspaceTrusted a été appelé
    expect(securityManager.isWorkspaceTrusted).toHaveBeenCalled();
    
    // Vérifier le résultat
    expect(isTrusted).toBe(true);
  });
});
