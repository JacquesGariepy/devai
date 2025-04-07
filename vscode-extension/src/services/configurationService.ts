import * as vscode from 'vscode';

/**
 * Service de configuration pour l'extension
 */
export class ConfigurationService {
  private _context: vscode.ExtensionContext;

  /**
   * Constructeur du service de configuration
   * @param context Contexte de l'extension
   */
  constructor(context: vscode.ExtensionContext) {
    this._context = context;
  }

  /**
   * Récupère la configuration complète
   * @returns Configuration complète
   */
  public getConfig(): any {
    const config = vscode.workspace.getConfiguration('devai');
    
    return {
      llm: this.getLLMConfig(),
      tools: this.getToolsConfig(),
      memory: this.getMemoryConfig(),
      security: this.getSecurityConfig(),
      ui: this.getUIConfig()
    };
  }

  /**
   * Récupère la configuration LLM
   * @returns Configuration LLM
   */
  public getLLMConfig(): any {
    const config = vscode.workspace.getConfiguration('devai.llm');
    
    return {
      provider: config.get<string>('provider') || 'openai',
      model: config.get<string>('model') || 'gpt-4',
      apiKey: config.get<string>('apiKey') || '',
      endpoint: config.get<string>('endpoint') || ''
    };
  }

  /**
   * Récupère la configuration des outils
   * @returns Configuration des outils
   */
  public getToolsConfig(): any {
    const config = vscode.workspace.getConfiguration('devai.tools');
    
    return {
      enabledTools: config.get<string[]>('enabledTools') || [
        'file.read',
        'file.write',
        'terminal.execute',
        'code.analyze',
        'code.fix',
        'code.document'
      ]
    };
  }

  /**
   * Récupère la configuration de la mémoire
   * @returns Configuration de la mémoire
   */
  public getMemoryConfig(): any {
    const config = vscode.workspace.getConfiguration('devai.memory');
    
    return {
      conversationHistorySize: config.get<number>('conversationHistorySize') || 10
    };
  }

  /**
   * Récupère la configuration de sécurité
   * @returns Configuration de sécurité
   */
  public getSecurityConfig(): any {
    const config = vscode.workspace.getConfiguration('devai.security');
    
    return {
      level: config.get<string>('level') || 'moderate',
      confirmActions: config.get<boolean>('confirmActions') || true,
      sandboxEnabled: config.get<boolean>('sandboxEnabled') || true,
      sandboxConfig: {
        enabled: config.get<boolean>('sandbox.enabled') || true,
        image: config.get<string>('sandbox.image') || 'ubuntu:22.04',
        defaultMemoryLimit: config.get<number>('sandbox.defaultMemoryLimit') || 512,
        defaultCpuLimit: config.get<number>('sandbox.defaultCpuLimit') || 1,
        defaultTimeout: config.get<number>('sandbox.defaultTimeout') || 30
      }
    };
  }

  /**
   * Récupère la configuration de l'interface utilisateur
   * @returns Configuration de l'interface utilisateur
   */
  public getUIConfig(): any {
    const config = vscode.workspace.getConfiguration('devai.ui');
    
    return {
      theme: config.get<string>('theme') || 'auto',
      fontSize: config.get<number>('fontSize') || 14,
      showToolbar: config.get<boolean>('showToolbar') || true
    };
  }

  /**
   * Met à jour une configuration
   * @param section Section de la configuration
   * @param value Nouvelle valeur
   * @param configurationTarget Cible de la configuration
   */
  public async updateConfig(
    section: string,
    value: any,
    configurationTarget: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global
  ): Promise<void> {
    await vscode.workspace.getConfiguration().update(
      `devai.${section}`,
      value,
      configurationTarget
    );
  }
}
