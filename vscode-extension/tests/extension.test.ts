/**
 * Tests unitaires pour l'extension VS Code
 * 
 * Ce fichier contient les tests unitaires pour les composants principaux
 * de l'extension VS Code, utilisant Jest comme framework de test.
 */

import * as vscode from 'vscode';
import { ConfigurationService } from '../src/services/configurationService';
import { I18nService } from '../src/services/i18nService';
import { CoreAgentService } from '../src/services/coreAgentService';
import { SecurityManager, SecurityLevel } from '../src/security/securityManager';
import { DockerSandboxManager } from '../src/security/dockerSandboxManager';

// Mock pour vscode
jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: jest.fn(),
    onDidChangeConfiguration: jest.fn().mockReturnValue({ dispose: jest.fn() }),
    isTrusted: true
  },
  window: {
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    activeColorTheme: {
      kind: 1 // Dark
    }
  },
  commands: {
    executeCommand: jest.fn()
  },
  env: {
    language: 'fr'
  },
  EventEmitter: jest.fn().mockImplementation(() => ({
    event: jest.fn(),
    fire: jest.fn()
  }))
}));

describe('Configuration Service', () => {
  let configService: ConfigurationService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Mock pour getConfiguration
    const mockGetConfiguration = vscode.workspace.getConfiguration as jest.Mock;
    mockGetConfiguration.mockImplementation((section) => {
      if (section === 'devai') {
        return {
          get: (key: string) => {
            switch (key) {
              case 'llm.provider':
                return 'openai';
              case 'llm.model':
                return 'gpt-4';
              case 'llm.apiKey':
                return 'test-api-key';
              case 'ui.theme':
                return 'system';
              case 'ui.language':
                return 'auto';
              default:
                return undefined;
            }
          }
        };
      }
      return {
        get: () => undefined
      };
    });
    
    // Créer une instance du service de configuration
    configService = new ConfigurationService();
  });
  
  test('devrait charger la configuration LLM', () => {
    // Récupérer la configuration LLM
    const llmConfig = configService.getLLMConfig();
    
    // Vérifier la configuration
    expect(llmConfig).toBeDefined();
    expect(llmConfig.provider).toBe('openai');
    expect(llmConfig.model).toBe('gpt-4');
    expect(llmConfig.apiKey).toBe('test-api-key');
  });
  
  test('devrait charger la configuration UI', () => {
    // Récupérer la configuration UI
    const uiConfig = configService.getUIConfig();
    
    // Vérifier la configuration
    expect(uiConfig).toBeDefined();
    expect(uiConfig.theme).toBe('system');
    expect(uiConfig.language).toBe('auto');
  });
  
  test('devrait écouter les changements de configuration', () => {
    // Vérifier que onDidChangeConfiguration a été appelé
    expect(vscode.workspace.onDidChangeConfiguration).toHaveBeenCalled();
  });
});

describe('I18n Service', () => {
  let i18nService: I18nService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer une instance du service d'internationalisation
    i18nService = new I18nService('fr');
  });
  
  test('devrait traduire une clé simple', () => {
    // Définir les traductions
    i18nService['translations'] = {
      fr: {
        'test.key': 'Texte de test'
      },
      en: {
        'test.key': 'Test text'
      }
    };
    
    // Traduire une clé
    const translation = i18nService.translate('test.key');
    
    // Vérifier la traduction
    expect(translation).toBe('Texte de test');
  });
  
  test('devrait traduire une clé avec paramètres', () => {
    // Définir les traductions
    i18nService['translations'] = {
      fr: {
        'test.params': 'Bonjour, {name}!'
      },
      en: {
        'test.params': 'Hello, {name}!'
      }
    };
    
    // Traduire une clé avec paramètres
    const translation = i18nService.translate('test.params', { name: 'John' });
    
    // Vérifier la traduction
    expect(translation).toBe('Bonjour, John!');
  });
  
  test('devrait retourner la clé si la traduction n\'existe pas', () => {
    // Traduire une clé inexistante
    const translation = i18nService.translate('nonexistent.key');
    
    // Vérifier que la clé est retournée
    expect(translation).toBe('nonexistent.key');
  });
  
  test('devrait changer la langue', () => {
    // Définir les traductions
    i18nService['translations'] = {
      fr: {
        'test.key': 'Texte de test'
      },
      en: {
        'test.key': 'Test text'
      }
    };
    
    // Changer la langue
    i18nService.setLanguage('en');
    
    // Traduire une clé
    const translation = i18nService.translate('test.key');
    
    // Vérifier la traduction
    expect(translation).toBe('Test text');
  });
});

describe('Security Manager', () => {
  let securityManager: SecurityManager;
  let i18nService: I18nService;
  let configService: ConfigurationService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Mock pour showWarningMessage
    const mockShowWarningMessage = vscode.window.showWarningMessage as jest.Mock;
    mockShowWarningMessage.mockResolvedValue({ title: 'Confirm' });
    
    // Créer les services nécessaires
    i18nService = new I18nService('fr');
    configService = new ConfigurationService();
    
    // Mock pour getSecurityConfig
    configService.getSecurityConfig = jest.fn().mockReturnValue({
      autoConfirmModerate: false,
      autoConfirmHigh: false
    });
    
    // Créer une instance du gestionnaire de sécurité
    securityManager = new SecurityManager(i18nService, configService);
  });
  
  test('devrait vérifier si le workspace est de confiance', () => {
    // Vérifier si le workspace est de confiance
    const isTrusted = securityManager.isWorkspaceTrusted();
    
    // Vérifier le résultat
    expect(isTrusted).toBe(true);
  });
  
  test('devrait autoriser les actions de niveau SAFE', async () => {
    // Vérifier si une action de niveau SAFE est autorisée
    const isAllowed = await securityManager.isActionAllowed({
      type: 'test',
      level: SecurityLevel.SAFE
    });
    
    // Vérifier le résultat
    expect(isAllowed).toBe(true);
  });
  
  test('devrait demander confirmation pour les actions de niveau MODERATE', async () => {
    // Vérifier si une action de niveau MODERATE est autorisée
    const isAllowed = await securityManager.isActionAllowed({
      type: 'test',
      level: SecurityLevel.MODERATE
    });
    
    // Vérifier que showWarningMessage a été appelé
    expect(vscode.window.showWarningMessage).toHaveBeenCalled();
    
    // Vérifier le résultat
    expect(isAllowed).toBe(true);
  });
  
  test('devrait demander confirmation pour les actions de niveau HIGH', async () => {
    // Vérifier si une action de niveau HIGH est autorisée
    const isAllowed = await securityManager.isActionAllowed({
      type: 'test',
      level: SecurityLevel.HIGH
    });
    
    // Vérifier que showWarningMessage a été appelé
    expect(vscode.window.showWarningMessage).toHaveBeenCalled();
    
    // Vérifier le résultat
    expect(isAllowed).toBe(true);
  });
});

describe('Docker Sandbox Manager', () => {
  let dockerSandboxManager: DockerSandboxManager;
  let terminalService: any;
  let i18nService: I18nService;
  let configService: ConfigurationService;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer les services nécessaires
    i18nService = new I18nService('fr');
    configService = new ConfigurationService();
    
    // Mock pour getSandboxConfig
    configService.getSandboxConfig = jest.fn().mockReturnValue({
      image: 'ubuntu:22.04',
      defaultMemoryLimit: 512,
      defaultCpuLimit: 1,
      defaultTimeout: 30
    });
    
    // Mock pour le service de terminal
    terminalService = {
      executeCommand: jest.fn()
    };
    
    // Créer une instance du gestionnaire de sandboxing Docker
    dockerSandboxManager = new DockerSandboxManager(
      terminalService as any,
      i18nService,
      configService
    );
  });
  
  test('devrait vérifier si Docker est disponible', async () => {
    // Mock pour executeCommand
    terminalService.executeCommand.mockResolvedValue({
      stdout: 'Docker version 20.10.12',
      stderr: '',
      exitCode: 0
    });
    
    // Vérifier si Docker est disponible
    const isAvailable = await dockerSandboxManager.isDockerAvailable();
    
    // Vérifier que executeCommand a été appelé
    expect(terminalService.executeCommand).toHaveBeenCalledWith('docker --version');
    
    // Vérifier le résultat
    expect(isAvailable).toBe(true);
  });
  
  test('devrait exécuter une commande dans Docker', async () => {
    // Mock pour executeCommand
    terminalService.executeCommand.mockResolvedValue({
      stdout: 'Résultat de la commande',
      stderr: '',
      exitCode: 0
    });
    
    // Exécuter une commande dans Docker
    const result = await dockerSandboxManager.executeInDocker({
      command: 'echo "test"',
      workingDir: '/test'
    });
    
    // Vérifier que executeCommand a été appelé
    expect(terminalService.executeCommand).toHaveBeenCalled();
    
    // Vérifier le résultat
    expect(result).toBeDefined();
    expect(result.stdout).toBe('Résultat de la commande');
    expect(result.exitCode).toBe(0);
  });
  
  test('devrait créer un conteneur interactif', async () => {
    // Mock pour executeCommand
    terminalService.executeCommand.mockResolvedValue({
      stdout: 'container-id',
      stderr: '',
      exitCode: 0
    });
    
    // Créer un conteneur interactif
    const containerId = await dockerSandboxManager.createInteractiveContainer({
      command: 'bash',
      workingDir: '/test'
    });
    
    // Vérifier que executeCommand a été appelé
    expect(terminalService.executeCommand).toHaveBeenCalled();
    
    // Vérifier le résultat
    expect(containerId).toBe('container-id');
  });
});
