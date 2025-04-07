/**
 * Module de gestion des outils pour le Core Agent
 * 
 * Ce module définit le registre d'outils et les interfaces pour
 * l'exécution d'actions dans l'environnement VS Code.
 */

/**
 * Configuration des outils
 */
export interface ToolConfig {
  /** Callbacks d'implémentation fournis par l'extension */
  callbacks?: ToolCallbacks;
  /** Outils activés/désactivés */
  enabledTools?: string[];
  /** Configuration spécifique par outil */
  toolSpecificConfig?: Record<string, any>;
}

/**
 * Interface pour les callbacks d'outils fournis par l'extension
 */
export interface ToolCallbacks {
  /** Lit le contenu d'un fichier */
  readFile?: (path: string) => Promise<string>;
  /** Écrit/écrase un fichier */
  writeFile?: (path: string, content: string) => Promise<void>;
  /** Applique un diff/patch à un fichier */
  applyPatch?: (path: string, patch: string) => Promise<void>;
  /** Exécute une commande dans le terminal */
  runInTerminal?: (command: string) => Promise<{stdout: string, stderr: string, exitCode: number}>;
  /** Recherche des fichiers par nom/pattern */
  findFile?: (pattern: string) => Promise<string[]>;
  /** Récupère le contexte de code actuel */
  getCodeContext?: () => Promise<{currentFile: string, selectedCode: string | null}>;
  /** Analyse statique du code */
  analyzeCode?: (code: string, options?: any) => Promise<any>;
  /** Détecte les bugs et vulnérabilités */
  detectBugs?: (filePath: string) => Promise<any>;
  /** Génère des tests unitaires */
  generateTests?: (filePath: string) => Promise<string>;
  /** Analyse les dépendances du projet */
  analyzeDependencies?: () => Promise<any>;
  /** Génère de la documentation */
  generateDocumentation?: (filePath: string) => Promise<string>;
}

/**
 * Interface pour la définition d'un outil
 */
export interface ToolDefinition {
  /** Nom de l'outil */
  name: string;
  /** Description de l'outil */
  description: string;
  /** Paramètres de l'outil au format JSON Schema */
  parameters: any;
  /** Indique si l'outil nécessite un sandbox */
  requiresSandbox: boolean;
  /** Fonction d'exécution de l'outil */
  execute: (params: any, callbacks: ToolCallbacks) => Promise<any>;
}

/**
 * Classe principale pour le registre d'outils
 */
export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();
  private callbacks: ToolCallbacks = {};
  private enabledTools: Set<string> = new Set();
  
  /**
   * Constructeur du registre d'outils
   * @param config Configuration des outils
   */
  constructor(config?: ToolConfig) {
    // Enregistrer les outils par défaut
    this.registerDefaultTools();
    
    // Appliquer la configuration si fournie
    if (config) {
      if (config.callbacks) {
        this.callbacks = config.callbacks;
      }
      
      if (config.enabledTools) {
        this.enabledTools = new Set(config.enabledTools);
      } else {
        // Par défaut, activer tous les outils
        this.tools.forEach((_, name) => this.enabledTools.add(name));
      }
    } else {
      // Par défaut, activer tous les outils
      this.tools.forEach((_, name) => this.enabledTools.add(name));
    }
  }
  
  /**
   * Enregistre les outils par défaut
   */
  private registerDefaultTools(): void {
    // Outils de système de fichiers
    this.registerTool({
      name: 'readFile',
      description: 'Lit le contenu d\'un fichier',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Chemin du fichier à lire'
          }
        },
        required: ['path']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.readFile) {
          throw new Error('Callback readFile non fourni');
        }
        return await callbacks.readFile(params.path);
      }
    });
    
    this.registerTool({
      name: 'writeFile',
      description: 'Écrit/écrase un fichier',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Chemin du fichier à écrire'
          },
          content: {
            type: 'string',
            description: 'Contenu à écrire dans le fichier'
          }
        },
        required: ['path', 'content']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.writeFile) {
          throw new Error('Callback writeFile non fourni');
        }
        await callbacks.writeFile(params.path, params.content);
        return { success: true, message: `Fichier ${params.path} écrit avec succès` };
      }
    });
    
    this.registerTool({
      name: 'applyPatch',
      description: 'Applique un diff/patch à un fichier',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Chemin du fichier à modifier'
          },
          patch: {
            type: 'string',
            description: 'Contenu du patch au format diff'
          }
        },
        required: ['path', 'patch']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.applyPatch) {
          throw new Error('Callback applyPatch non fourni');
        }
        await callbacks.applyPatch(params.path, params.patch);
        return { success: true, message: `Patch appliqué au fichier ${params.path} avec succès` };
      }
    });
    
    // Outils de terminal
    this.registerTool({
      name: 'runInTerminal',
      description: 'Exécute une commande dans le terminal',
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'Commande à exécuter'
          }
        },
        required: ['command']
      },
      requiresSandbox: true, // Nécessite un sandbox pour la sécurité
      execute: async (params, callbacks) => {
        if (!callbacks.runInTerminal) {
          throw new Error('Callback runInTerminal non fourni');
        }
        return await callbacks.runInTerminal(params.command);
      }
    });
    
    // Outils de recherche
    this.registerTool({
      name: 'findFile',
      description: 'Recherche des fichiers par nom/pattern',
      parameters: {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Pattern de recherche (glob)'
          }
        },
        required: ['pattern']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.findFile) {
          throw new Error('Callback findFile non fourni');
        }
        return await callbacks.findFile(params.pattern);
      }
    });
    
    // Outils de contexte de code
    this.registerTool({
      name: 'getCodeContext',
      description: 'Récupère le contexte de code actuel',
      parameters: {
        type: 'object',
        properties: {}
      },
      requiresSandbox: false,
      execute: async (_, callbacks) => {
        if (!callbacks.getCodeContext) {
          throw new Error('Callback getCodeContext non fourni');
        }
        return await callbacks.getCodeContext();
      }
    });
    
    // Outils d'analyse de code
    this.registerTool({
      name: 'analyzeCode',
      description: 'Analyse statique du code',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'Code à analyser'
          },
          options: {
            type: 'object',
            description: 'Options d\'analyse'
          }
        },
        required: ['code']
      },
      requiresSandbox: true,
      execute: async (params, callbacks) => {
        if (!callbacks.analyzeCode) {
          throw new Error('Callback analyzeCode non fourni');
        }
        return await callbacks.analyzeCode(params.code, params.options);
      }
    });
    
    // Outils de détection de bugs
    this.registerTool({
      name: 'detectBugs',
      description: 'Détecte les bugs et vulnérabilités',
      parameters: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Chemin du fichier à analyser'
          }
        },
        required: ['filePath']
      },
      requiresSandbox: true,
      execute: async (params, callbacks) => {
        if (!callbacks.detectBugs) {
          throw new Error('Callback detectBugs non fourni');
        }
        return await callbacks.detectBugs(params.filePath);
      }
    });
    
    // Outils de génération de tests
    this.registerTool({
      name: 'generateTests',
      description: 'Génère des tests unitaires',
      parameters: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Chemin du fichier pour lequel générer des tests'
          }
        },
        required: ['filePath']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.generateTests) {
          throw new Error('Callback generateTests non fourni');
        }
        return await callbacks.generateTests(params.filePath);
      }
    });
    
    // Outils de projet
    this.registerTool({
      name: 'analyzeDependencies',
      description: 'Analyse les dépendances du projet',
      parameters: {
        type: 'object',
        properties: {}
      },
      requiresSandbox: false,
      execute: async (_, callbacks) => {
        if (!callbacks.analyzeDependencies) {
          throw new Error('Callback analyzeDependencies non fourni');
        }
        return await callbacks.analyzeDependencies();
      }
    });
    
    this.registerTool({
      name: 'generateDocumentation',
      description: 'Génère de la documentation',
      parameters: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Chemin du fichier pour lequel générer de la documentation'
          }
        },
        required: ['filePath']
      },
      requiresSandbox: false,
      execute: async (params, callbacks) => {
        if (!callbacks.generateDocumentation) {
          throw new Error('Callback generateDocumentation non fourni');
        }
        return await callbacks.generateDocumentation(params.filePath);
      }
    });
  }
  
  /**
   * Enregistre un nouvel outil
   * @param tool Définition de l'outil
   */
  public registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
    // Par défaut, activer le nouvel outil
    this.enabledTools.add(tool.name);
  }
  
  /**
   * Vérifie si un outil existe
   * @param toolName Nom de l'outil
   * @returns true si l'outil existe, false sinon
   */
  public hasTool(toolName: string): boolean {
    return this.tools.has(toolName) && this.enabledTools.has(toolName);
  }
  
  /**
   * Vérifie si un outil nécessite un sandbox
   * @param toolName Nom de l'outil
   * @returns true si l'outil nécessite un sandbox, false sinon
   */
  public requiresSandbox(toolName: string): boolean {
    const tool = this.tools.get(toolName);
    return tool ? tool.requiresSandbox : false;
  }
  
  /**
   * Exécute un outil
   * @param toolName Nom de l'outil
   * @param params Paramètres de l'outil
   * @returns Résultat de l'exécution
   */
  public async executeTool(toolName: string, params: any): Promise<any> {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      throw new Error(`Outil "${toolName}" non trouvé`);
    }
    
    if (!this.enabledTools.has(toolName)) {
      throw new Error(`Outil "${toolName}" désactivé`);
    }
    
    try {
      return await tool.execute(params, this.callbacks);
    } catch (error) {
      console.error(`Erreur lors de l'exécution de l'outil "${toolName}":`, error);
      throw error;
    }
  }
  
  /**
   * Obtient la liste des outils disponibles
   * @returns Liste des outils disponibles
   */
  public getAvailableTools(): ToolDefinition[] {
    const availableTools: ToolDefinition[] = [];
    
    this.tools.forEach((tool, name) => {
      if (this.enabledTools.has(name)) {
        availableTools.push(tool);
      }
    });
    
    return availableTools;
  }
  
  /**
   * Définit les callbacks d'outils
   * @param callbacks Callbacks d'outils
   */
  public setCallbacks(callbacks: ToolCallbacks): void {
    this.callbacks = callbacks;
  }
  
  /**
   * Active ou désactive un outil
   * @param toolName Nom de l'outil
   * @param enabled true pour activer, false pour désactiver
   */
  public setToolEnabled(toolName: string, enabled: boolean): void {
    if (!this.tools.has(toolName)) {
      throw new Error(`Outil "${toolName}" non trouvé`);
    }
    
    if (enabled) {
      this.enabledTools.add(toolName);
    } else {
      this.enabledTools.delete(toolName);
    }
  }
}

// Exporter uniquement la classe ToolRegistry
