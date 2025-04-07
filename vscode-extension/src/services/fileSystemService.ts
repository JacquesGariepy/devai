import * as os from 'os';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Service pour les opérations sur le système de fichiers
 */
export class FileSystemService {
  /**
   * Lit le contenu d'un fichier
   * @param filePath Chemin du fichier à lire
   * @returns Contenu du fichier
   */
  public async readFile(filePath: string): Promise<string> {
    try {
      return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw new Error(`Failed to read file: ${filePath}`);
    }
  }

  /**
   * Écrit du contenu dans un fichier
   * @param filePath Chemin du fichier à écrire
   * @param content Contenu à écrire
   * @param append Si true, ajoute le contenu à la fin du fichier
   */
  public async writeFile(filePath: string, content: string, append: boolean = false): Promise<void> {
    try {
      // Créer le répertoire parent s'il n'existe pas
      const dir = path.dirname(filePath);
      await fs.promises.mkdir(dir, { recursive: true });

      // Écrire le fichier
      if (append) {
        await fs.promises.appendFile(filePath, content, 'utf-8');
      } else {
        await fs.promises.writeFile(filePath, content, 'utf-8');
      }
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
      throw new Error(`Failed to write file: ${filePath}`);
    }
  }

  /**
   * Vérifie si un fichier existe
   * @param filePath Chemin du fichier à vérifier
   * @returns true si le fichier existe, false sinon
   */
  public async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Supprime un fichier
   * @param filePath Chemin du fichier à supprimer
   */
  public async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      throw new Error(`Failed to delete file: ${filePath}`);
    }
  }

  /**
   * Liste les fichiers dans un répertoire
   * @param dirPath Chemin du répertoire à lister
   * @param pattern Motif de filtre (glob)
   * @returns Liste des chemins de fichiers
   */
  public async listFiles(dirPath: string, pattern?: string): Promise<string[]> {
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      const files = entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(dirPath, entry.name));

      if (pattern) {
        // Filtrer par motif glob
        return files.filter(file => this.matchGlob(file, pattern));
      }

      return files;
    } catch (error) {
      console.error(`Error listing files in ${dirPath}:`, error);
      throw new Error(`Failed to list files in directory: ${dirPath}`);
    }
  }

  /**
   * Crée un répertoire
   * @param dirPath Chemin du répertoire à créer
   */
  public async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  }

  /**
   * Copie un fichier
   * @param sourcePath Chemin du fichier source
   * @param destPath Chemin de destination
   */
  public async copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      // Créer le répertoire parent s'il n'existe pas
      const dir = path.dirname(destPath);
      await fs.promises.mkdir(dir, { recursive: true });

      // Copier le fichier
      await fs.promises.copyFile(sourcePath, destPath);
    } catch (error) {
      console.error(`Error copying file from ${sourcePath} to ${destPath}:`, error);
      throw new Error(`Failed to copy file from ${sourcePath} to ${destPath}`);
    }
  }

  /**
   * Déplace un fichier
   * @param sourcePath Chemin du fichier source
   * @param destPath Chemin de destination
   */
  public async moveFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      // Créer le répertoire parent s'il n'existe pas
      const dir = path.dirname(destPath);
      await fs.promises.mkdir(dir, { recursive: true });

      // Déplacer le fichier
      await fs.promises.rename(sourcePath, destPath);
    } catch (error) {
      console.error(`Error moving file from ${sourcePath} to ${destPath}:`, error);
      throw new Error(`Failed to move file from ${sourcePath} to ${destPath}`);
    }
  }

  /**
   * Crée un fichier temporaire
   * @param prefix Préfixe du nom de fichier
   * @param extension Extension du fichier
   * @param content Contenu initial du fichier
   * @returns Chemin du fichier temporaire
   */
  public async createTempFile(prefix: string, extension: string, content?: string): Promise<string> {
    try {
      // Créer un répertoire temporaire pour DevAI
      const tempDir = path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || os.tmpdir(), '.devai-temp');
      await fs.promises.mkdir(tempDir, { recursive: true });

      // Générer un nom de fichier unique
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const fileName = `${prefix}-${timestamp}-${randomStr}.${extension}`;
      const filePath = path.join(tempDir, fileName);

      // Écrire le contenu initial si fourni
      if (content) {
        await fs.promises.writeFile(filePath, content, 'utf-8');
      } else {
        await fs.promises.writeFile(filePath, '', 'utf-8');
      }

      return filePath;
    } catch (error) {
      console.error('Error creating temporary file:', error);
      throw new Error('Failed to create temporary file');
    }
  }

  /**
   * Vérifie si un chemin correspond à un motif glob
   * @param filePath Chemin du fichier
   * @param pattern Motif glob
   * @returns true si le chemin correspond au motif
   */
  private matchGlob(filePath: string, pattern: string): boolean {
    // Implémentation simple de correspondance glob
    const fileName = path.basename(filePath);
    
    // Convertir le motif glob en expression régulière
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(fileName);
  }
}
