import * as vscode from 'vscode';

/**
 * Service pour les opérations sur le workspace
 */
export class WorkspaceService {
  /**
   * Récupère les dossiers du workspace
   * @returns Liste des dossiers du workspace
   */
  public getWorkspaceFolders(): readonly vscode.WorkspaceFolder[] {
    return vscode.workspace.workspaceFolders || [];
  }

  /**
   * Récupère le dossier actif du workspace
   * @returns Dossier actif du workspace
   */
  public getActiveWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
      return undefined;
    }

    // Si l'éditeur actif est ouvert, utiliser son dossier
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const activeDocumentUri = activeEditor.document.uri;
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeDocumentUri);
      if (workspaceFolder) {
        return workspaceFolder;
      }
    }

    // Sinon, utiliser le premier dossier du workspace
    return vscode.workspace.workspaceFolders[0];
  }

  /**
   * Récupère les fichiers du workspace correspondant à un motif
   * @param pattern Motif de recherche (glob)
   * @returns Liste des URI des fichiers correspondants
   */
  public async findFiles(pattern: string): Promise<vscode.Uri[]> {
    return await vscode.workspace.findFiles(pattern);
  }

  /**
   * Récupère le contenu d'un fichier du workspace
   * @param uri URI du fichier
   * @returns Contenu du fichier
   */
  public async readFile(uri: vscode.Uri): Promise<string> {
    const content = await vscode.workspace.fs.readFile(uri);
    return Buffer.from(content).toString('utf-8');
  }

  /**
   * Écrit dans un fichier du workspace
   * @param uri URI du fichier
   * @param content Contenu à écrire
   */
  public async writeFile(uri: vscode.Uri, content: string): Promise<void> {
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf-8'));
  }

  /**
   * Crée un fichier temporaire dans le workspace
   * @param content Contenu du fichier
   * @param extension Extension du fichier
   * @returns URI du fichier temporaire
   */
  public async createTempFile(content: string, extension: string = 'txt'): Promise<vscode.Uri> {
    // Créer un nom de fichier unique
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const fileName = `devai-temp-${timestamp}-${randomStr}.${extension}`;

    // Utiliser le dossier actif du workspace
    const workspaceFolder = this.getActiveWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error('No workspace folder available');
    }

    // Créer le fichier
    const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, '.devai-temp', fileName);
    
    // Créer le dossier parent s'il n'existe pas
    const parentUri = vscode.Uri.joinPath(fileUri, '..');
    try {
      await vscode.workspace.fs.createDirectory(parentUri);
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // Écrire le contenu
    await this.writeFile(fileUri, content);

    return fileUri;
  }

  /**
   * Ouvre un fichier dans l'éditeur
   * @param uri URI du fichier à ouvrir
   * @returns Document ouvert
   */
  public async openFile(uri: vscode.Uri): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument(uri);
  }

  /**
   * Vérifie si le workspace est de confiance
   * @returns true si le workspace est de confiance
   */
  public isWorkspaceTrusted(): boolean {
    return vscode.workspace.isTrusted;
  }
}
