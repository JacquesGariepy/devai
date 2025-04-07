/**
 * Service de gestion du terminal pour l'extension VS Code DevAI
 * 
 * Ce service gère les interactions avec le terminal VS Code,
 * y compris l'exécution de commandes et la gestion des terminaux.
 */

import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as util from 'util';

/**
 * Interface pour le résultat d'exécution d'une commande
 */
export interface CommandResult {
  /** Sortie standard */
  stdout: string;
  /** Sortie d'erreur */
  stderr: string;
  /** Code de sortie */
  exitCode: number;
}

/**
 * Classe principale pour le service de gestion du terminal
 */
export class TerminalService {
  private terminal: vscode.Terminal | null = null;
  private execPromise = util.promisify(child_process.exec);
  
  /**
   * Constructeur du service de gestion du terminal
   */
  constructor() {
    // Écouter les événements de fermeture de terminal
    vscode.window.onDidCloseTerminal(terminal => {
      if (this.terminal === terminal) {
        this.terminal = null;
      }
    });
  }
  
  /**
   * Obtient ou crée un terminal
   * @returns Terminal VS Code
   */
  public getOrCreateTerminal(): vscode.Terminal {
    if (!this.terminal) {
      this.terminal = vscode.window.createTerminal('DevAI');
    }
    
    return this.terminal;
  }
  
  /**
   * Exécute une commande dans le terminal
   * @param command Commande à exécuter
   * @param show Afficher le terminal
   */
  public executeInTerminal(command: string, show: boolean = true): void {
    const terminal = this.getOrCreateTerminal();
    
    if (show) {
      terminal.show();
    }
    
    terminal.sendText(command);
  }
  
  /**
   * Exécute une commande et retourne le résultat
   * @param command Commande à exécuter
   * @param options Options d'exécution
   * @returns Résultat de la commande
   */
  public async executeCommand(
    command: string,
    options: { cwd?: string; timeout?: number } = {}
  ): Promise<CommandResult> {
    try {
      // Définir les options par défaut
      const execOptions = {
        cwd: options.cwd || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
        timeout: options.timeout || 30000,
        maxBuffer: 1024 * 1024 * 10 // 10 MB
      };
      
      // Exécuter la commande
      const { stdout, stderr } = await this.execPromise(command, execOptions);
      
      return {
        stdout: stdout.toString(),
        stderr: stderr.toString(),
        exitCode: 0
      };
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la commande "${command}":`, error);
      
      // Extraire les informations d'erreur
      const execError = error as any;
      
      return {
        stdout: execError.stdout ? execError.stdout.toString() : '',
        stderr: execError.stderr ? execError.stderr.toString() : String(error),
        exitCode: execError.code || 1
      };
    }
  }
  
  /**
   * Exécute une commande de manière interactive
   * @param command Commande à exécuter
   * @param inputs Entrées à fournir
   */
  public async executeInteractiveCommand(command: string, inputs: string[]): Promise<void> {
    const terminal = this.getOrCreateTerminal();
    terminal.show();
    
    // Envoyer la commande
    terminal.sendText(command, false);
    
    // Envoyer les entrées avec un délai
    for (const input of inputs) {
      await new Promise(resolve => setTimeout(resolve, 500));
      terminal.sendText(input);
    }
  }
  
  /**
   * Ferme le terminal
   */
  public closeTerminal(): void {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = null;
    }
  }
  
  /**
   * Vérifie si une commande est disponible
   * @param command Commande à vérifier
   * @returns true si la commande est disponible, false sinon
   */
  public async isCommandAvailable(command: string): Promise<boolean> {
    try {
      const checkCommand = process.platform === 'win32'
        ? `where ${command}`
        : `which ${command}`;
      
      const result = await this.executeCommand(checkCommand);
      return result.exitCode === 0;
    } catch (error) {
      return false;
    }
  }
}
