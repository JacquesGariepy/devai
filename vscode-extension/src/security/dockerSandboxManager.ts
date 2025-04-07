import * as vscode from 'vscode';
import { I18nService } from '../services/i18nService';
import { CoreAgentService } from '../services/coreAgentService';
import { SecurityManager, SecurityLevel } from './securityManager';

/**
 * Interface pour les options du sandbox Docker
 */
export interface DockerSandboxOptions {
  command: string;
  workingDir?: string;
  extraMounts?: string[];
  resourceLimits?: {
    memory?: number;
    cpu?: number;
  };
  timeout?: number;
}

/**
 * Gestionnaire de sandbox Docker
 */
export class DockerSandboxManager {
  constructor(
    private readonly terminalService: any,
    private readonly i18nService: I18nService,
    private readonly configService: any
  ) {}

  /**
   * Vérifie si Docker est disponible
   * @returns true si Docker est disponible
   */
  public async isDockerAvailable(): Promise<boolean> {
    try {
      const result = await this.terminalService.executeCommand('docker --version');
      return result.success && result.stdout.includes('Docker version');
    } catch (error) {
      console.error('Error checking Docker availability:', error);
      return false;
    }
  }

  /**
   * Exécute une commande dans un conteneur Docker
   * @param options Options pour l'exécution
   * @returns Résultat de l'exécution
   */
  public async executeInDocker(options: DockerSandboxOptions): Promise<any> {
    // Vérifier si Docker est disponible
    const dockerAvailable = await this.isDockerAvailable();
    if (!dockerAvailable) {
      throw new Error(this.i18nService.translate('docker.notAvailable'));
    }

    // Récupérer la configuration du sandbox
    const sandboxConfig = {
      enabled: true,
      image: 'ubuntu:22.04',
      defaultMemoryLimit: 512,
      defaultCpuLimit: 1,
      defaultTimeout: 30
    };

    // Vérifier si le sandbox est activé
    if (!sandboxConfig.enabled) {
      throw new Error(this.i18nService.translate('docker.sandboxDisabled'));
    }

    // Exécuter la commande dans Docker
    try {
      return await this._executeCommandInDocker(options, sandboxConfig);
    } catch (error) {
      console.error('Error executing command in Docker:', error);
      throw error;
    }
  }

  /**
   * Exécute une commande interactive dans un conteneur Docker
   * @param options Options pour l'exécution
   * @returns Terminal VS Code
   */
  public async executeInteractiveInDocker(options: DockerSandboxOptions): Promise<vscode.Terminal> {
    // Vérifier si Docker est disponible
    const dockerAvailable = await this.isDockerAvailable();
    if (!dockerAvailable) {
      throw new Error(this.i18nService.translate('docker.notAvailable'));
    }

    // Récupérer la configuration du sandbox
    const sandboxConfig = {
      enabled: true,
      image: 'ubuntu:22.04',
      defaultMemoryLimit: 512,
      defaultCpuLimit: 1,
      defaultTimeout: 30
    };

    // Vérifier si le sandbox est activé
    if (!sandboxConfig.enabled) {
      throw new Error(this.i18nService.translate('docker.sandboxDisabled'));
    }

    // Construire la commande Docker
    const dockerCommand = this._buildDockerCommand(options, sandboxConfig);

    // Créer un terminal et exécuter la commande
    const terminal = vscode.window.createTerminal('DevAI Docker Sandbox');
    terminal.sendText(dockerCommand);
    terminal.show();

    return terminal;
  }

  /**
   * Exécute une commande dans un conteneur Docker
   * @param options Options pour l'exécution
   * @param sandboxConfig Configuration du sandbox
   * @returns Résultat de l'exécution
   */
  private async _executeCommandInDocker(
    options: DockerSandboxOptions,
    sandboxConfig: any
  ): Promise<any> {
    // Construire la commande Docker
    const dockerCommand = this._buildDockerCommand(options, sandboxConfig);

    // Exécuter la commande
    const result = await this.terminalService.executeCommand(
      dockerCommand,
      options.workingDir || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
      {
        timeout: (options.timeout || sandboxConfig.defaultTimeout || 30) * 1000
      }
    );

    return {
      success: result.success,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode
    };
  }

  /**
   * Construit la commande Docker
   * @param options Options pour l'exécution
   * @param sandboxConfig Configuration du sandbox
   * @returns Commande Docker
   */
  private _buildDockerCommand(
    options: DockerSandboxOptions,
    sandboxConfig: any
  ): string {
    // Préparer les montages
    const mounts = [];

    // Monter le répertoire de travail
    const workingDir = options.workingDir || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (workingDir) {
      mounts.push(`-v "${workingDir}:/workspace"`);
    }

    // Ajouter les montages supplémentaires
    if (options.extraMounts) {
      for (const mount of options.extraMounts) {
        mounts.push(`-v "${mount}"`);
      }
    }

    // Préparer les limites de ressources
    const resourceLimits = [];

    // Limite de mémoire
    if (options.resourceLimits?.memory) {
      resourceLimits.push(`--memory=${options.resourceLimits.memory}m`);
    } else if (sandboxConfig.defaultMemoryLimit) {
      resourceLimits.push(`--memory=${sandboxConfig.defaultMemoryLimit}m`);
    }

    // Limite de CPU
    if (options.resourceLimits?.cpu) {
      resourceLimits.push(`--cpus=${options.resourceLimits.cpu}`);
    } else if (sandboxConfig.defaultCpuLimit) {
      resourceLimits.push(`--cpus=${sandboxConfig.defaultCpuLimit}`);
    }

    // Construire la commande Docker
    return [
      'docker run --rm -i',
      ...mounts,
      ...resourceLimits,
      '-w /workspace',
      '--network=none',
      sandboxConfig.image || 'ubuntu:22.04',
      `bash -c "${options.command.replace(/"/g, '\\"')}"`
    ].join(' ');
  }
}
