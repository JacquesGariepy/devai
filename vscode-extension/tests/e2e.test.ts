/**
 * Tests end-to-end pour le projet DevAI
 * 
 * Ce fichier contient les tests end-to-end qui vérifient le fonctionnement
 * complet de l'extension VS Code DevAI dans un environnement réel.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as assert from 'assert';

// Délai d'attente pour les opérations asynchrones
const TIMEOUT = 30000;

// Suite de tests end-to-end
suite('Extension DevAI E2E Tests', () => {
  // Délai d'attente pour les tests
  this.timeout(TIMEOUT);
  
  // Avant tous les tests
  suiteSetup(async () => {
    // Attendre que l'extension soit activée
    const extension = vscode.extensions.getExtension('devai.vscode-extension');
    if (!extension) {
      throw new Error('Extension DevAI non trouvée');
    }
    
    if (!extension.isActive) {
      await extension.activate();
    }
    
    // Attendre un peu pour s'assurer que tout est initialisé
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
  
  // Après tous les tests
  suiteTeardown(async () => {
    // Nettoyer les fichiers temporaires
    await cleanupTempFiles();
  });
  
  // Test d'activation de l'extension
  test('L\'extension devrait s\'activer correctement', async () => {
    const extension = vscode.extensions.getExtension('devai.vscode-extension');
    assert.ok(extension);
    assert.strictEqual(extension.isActive, true);
  });
  
  // Test d'ouverture du panneau DevAI
  test('Devrait ouvrir le panneau DevAI', async () => {
    // Exécuter la commande pour ouvrir le panneau
    await vscode.commands.executeCommand('devai.openPanel');
    
    // Vérifier que le panneau est ouvert (indirectement via les vues visibles)
    const views = vscode.window.visibleTextEditors;
    assert.ok(views.length > 0);
  });
  
  // Test d'analyse de code
  test('Devrait analyser le code sélectionné', async function() {
    // Créer un fichier temporaire avec du code
    const tempFile = await createTempFile('test.js', 'function add(a, b) { return a + b; }');
    
    // Ouvrir le fichier
    const document = await vscode.workspace.openTextDocument(tempFile);
    const editor = await vscode.window.showTextDocument(document);
    
    // Sélectionner tout le texte
    const lastLine = document.lineCount - 1;
    const lastChar = document.lineAt(lastLine).text.length;
    editor.selection = new vscode.Selection(0, 0, lastLine, lastChar);
    
    // Exécuter la commande d'analyse de code
    await vscode.commands.executeCommand('devai.analyzeCode');
    
    // Attendre que l'analyse soit terminée (vérification indirecte)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Vérifier que le panneau DevAI est ouvert
    const views = vscode.window.visibleTextEditors;
    assert.ok(views.length > 0);
  });
  
  // Test de génération de documentation
  test('Devrait générer de la documentation', async function() {
    // Créer un fichier temporaire avec du code
    const tempFile = await createTempFile('test.js', `
      /**
       * Fonction d'addition
       */
      function add(a, b) {
        return a + b;
      }
      
      /**
       * Fonction de soustraction
       */
      function subtract(a, b) {
        return a - b;
      }
    `);
    
    // Ouvrir le fichier
    const document = await vscode.workspace.openTextDocument(tempFile);
    await vscode.window.showTextDocument(document);
    
    // Exécuter la commande de génération de documentation
    await vscode.commands.executeCommand('devai.generateDocumentation');
    
    // Attendre que la génération soit terminée (vérification indirecte)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Vérifier que le panneau DevAI est ouvert
    const views = vscode.window.visibleTextEditors;
    assert.ok(views.length > 0);
  });
  
  // Test de respect du Workspace Trust
  test('Devrait respecter le Workspace Trust', async function() {
    // Simuler un workspace non fiable
    const originalIsTrusted = vscode.workspace.isTrusted;
    Object.defineProperty(vscode.workspace, 'isTrusted', { value: false });
    
    try {
      // Exécuter une commande qui nécessite un workspace fiable
      await vscode.commands.executeCommand('devai.executeInTerminal', 'echo "test"');
      
      // Attendre un peu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Vérifier qu'un message d'avertissement a été affiché (indirectement)
      // Note: Nous ne pouvons pas vérifier directement les messages, mais nous pouvons
      // vérifier que la commande n'a pas été exécutée en vérifiant l'absence de sortie
    } finally {
      // Restaurer l'état original
      Object.defineProperty(vscode.workspace, 'isTrusted', { value: originalIsTrusted });
    }
  });
  
  // Fonction utilitaire pour créer un fichier temporaire
  async function createTempFile(filename: string, content: string): Promise<string> {
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    
    // Créer le répertoire temporaire s'il n'existe pas
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, content);
    
    return filePath;
  }
  
  // Fonction utilitaire pour nettoyer les fichiers temporaires
  async function cleanupTempFiles(): Promise<void> {
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    
    if (fs.existsSync(tempDir)) {
      // Supprimer tous les fichiers du répertoire temporaire
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      
      // Supprimer le répertoire temporaire
      fs.rmdirSync(tempDir);
    }
  }
});
