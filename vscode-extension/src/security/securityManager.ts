import * as vscode from 'vscode';

/**
 * Interface pour la configuration de sécurité
 */
export interface SecurityConfig {
  level: SecurityLevel;
  confirmActions: boolean;
  sandboxEnabled: boolean;
  sandboxConfig: SandboxConfig;
}

/**
 * Interface pour la configuration du sandbox
 */
export interface SandboxConfig {
  enabled: boolean;
  image: string;
  defaultMemoryLimit: number;
  defaultCpuLimit: number;
  defaultTimeout: number;
}

/**
 * Niveaux de sécurité
 */
export enum SecurityLevel {
  SAFE = 'safe',
  MODERATE = 'moderate',
  HIGH = 'high'
}

/**
 * Interface pour une action de sécurité
 */
export interface SecurityAction {
  type: string;
  level: SecurityLevel;
  details?: any;
}

/**
 * Gestionnaire de sécurité pour l'extension
 */
export class SecurityManager {
  constructor(
    private readonly i18nService: any,
    private readonly configService: any
  ) {}

  /**
   * Vérifie si le workspace est de confiance
   * @returns true si le workspace est de confiance
   */
  public isWorkspaceTrusted(): boolean {
    return vscode.workspace.isTrusted;
  }

  /**
   * Vérifie si une action est autorisée
   * @param action Action à vérifier
   * @returns true si l'action est autorisée
   */
  public async isActionAllowed(action: SecurityAction): Promise<boolean> {
    // Vérifier si le workspace est de confiance
    if (!vscode.workspace.isTrusted) {
      // Pour les actions à risque modéré ou élevé, refuser si le workspace n'est pas de confiance
      if (action.level !== SecurityLevel.SAFE) {
        await this.showWorkspaceNotTrustedWarning();
        return false;
      }
    }

    // Récupérer la configuration de sécurité
    const securityConfig = {
      level: SecurityLevel.MODERATE,
      confirmActions: true,
      sandboxEnabled: true,
      sandboxConfig: {
        enabled: true,
        image: 'ubuntu:22.04',
        defaultMemoryLimit: 512,
        defaultCpuLimit: 1,
        defaultTimeout: 30
      }
    };

    // Vérifier le niveau de sécurité
    if (this.getSecurityLevelValue(action.level) > this.getSecurityLevelValue(securityConfig.level)) {
      await this.showSecurityLevelWarning(action);
      return false;
    }

    // Pour les actions à risque élevé, demander confirmation
    if (action.level === SecurityLevel.HIGH && securityConfig.confirmActions) {
      return await this.confirmAction(action);
    }

    return true;
  }

  /**
   * Convertit un niveau de sécurité en valeur numérique
   * @param level Niveau de sécurité
   * @returns Valeur numérique
   */
  private getSecurityLevelValue(level: SecurityLevel): number {
    switch (level) {
      case SecurityLevel.SAFE:
        return 0;
      case SecurityLevel.MODERATE:
        return 1;
      case SecurityLevel.HIGH:
        return 2;
      default:
        return 0;
    }
  }

  /**
   * Affiche un avertissement de workspace non de confiance
   */
  private async showWorkspaceNotTrustedWarning(): Promise<void> {
    const message = 'Cette action nécessite un workspace de confiance. Veuillez activer la confiance pour ce workspace.';
    const trustButton = 'Activer la confiance';
    
    const result = await vscode.window.showWarningMessage(
      message,
      trustButton
    );

    if (result === trustButton) {
      await vscode.commands.executeCommand('workbench.action.manageTrustedDomain');
    }
  }

  /**
   * Affiche un avertissement de niveau de sécurité
   * @param action Action concernée
   */
  private async showSecurityLevelWarning(action: SecurityAction): Promise<void> {
    const message = `L'action "${action.type}" est bloquée par les paramètres de sécurité actuels.`;
    const settingsButton = 'Paramètres de sécurité';
    
    const result = await vscode.window.showWarningMessage(
      message,
      settingsButton
    );

    if (result === settingsButton) {
      await vscode.commands.executeCommand('workbench.action.openSettings', 'devai.security');
    }
  }

  /**
   * Demande confirmation pour une action
   * @param action Action à confirmer
   * @returns true si l'action est confirmée
   */
  private async confirmAction(action: SecurityAction): Promise<boolean> {
    const message = `Voulez-vous autoriser l'action "${action.type}" ?`;
    const detailsMessage = action.details ? `Détails : ${JSON.stringify(action.details)}` : '';
    const confirmButton = 'Autoriser';
    const denyButton = 'Refuser';
    
    const result = await vscode.window.showWarningMessage(
      `${message}\n${detailsMessage}`,
      { modal: true },
      confirmButton,
      denyButton
    );

    return result === confirmButton;
  }
}
