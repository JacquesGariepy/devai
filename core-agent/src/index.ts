/**
 * DevAI Core Agent - Point d'entrée principal
 * 
 * Ce module exporte les fonctionnalités principales du Core Agent DevAI,
 * permettant à l'extension VS Code d'interagir avec l'agent intelligent.
 */

import { Agent, AgentConfig } from './agent';
import { LLMConfig, LLMInterface } from './llm';
import { ToolRegistry, ToolConfig } from './tools';
import { MemorySystem, MemoryConfig } from './memory';
import { SandboxManager, SandboxConfig } from './sandbox';

// Exports des modules principaux
export * from './agent';
export * from './llm';
export * from './tools';
export * from './memory';
export * from './sandbox';

/**
 * Configuration complète du Core Agent
 */
export interface CoreConfig {
  /** Configuration du modèle de langage */
  llm: LLMConfig;
  /** Configuration de la mémoire */
  memory?: MemoryConfig;
  /** Configuration des outils */
  tools?: ToolConfig;
  /** Configuration du sandbox */
  sandbox?: SandboxConfig;
  /** Langue par défaut (fr, en, etc.) */
  defaultLanguage?: string;
}

// Classe principale du Core Agent
export class DevAICore {
  private static instance: DevAICore;
  private agent: Agent | null = null;
  private initialized: boolean = false;

  // Singleton pattern
  public static getInstance(): DevAICore {
    if (!DevAICore.instance) {
      DevAICore.instance = new DevAICore();
    }
    return DevAICore.instance;
  }

  private constructor() {
    // Constructeur privé pour le singleton
  }

  /**
   * Initialise le Core Agent avec la configuration fournie
   * @param config Configuration du Core Agent
   */
  public initialize(config: CoreConfig): void {
    if (this.initialized) {
      throw new Error('DevAICore est déjà initialisé');
    }

    // Créer la configuration de l'agent
    const agentConfig: AgentConfig = {
      llmConfig: config.llm,
      memoryConfig: config.memory,
      toolsConfig: config.tools,
      sandboxConfig: config.sandbox,
      defaultLanguage: config.defaultLanguage || 'fr'
    };

    // Initialiser l'agent
    this.agent = new Agent(agentConfig);
    this.initialized = true;
    
    console.log('DevAI Core Agent initialisé avec succès');
  }

  /**
   * Traite une requête utilisateur et retourne une réponse
   * @param request Requête utilisateur
   * @returns Promesse contenant la réponse de l'agent
   */
  public async processRequest(request: string): Promise<string> {
    if (!this.initialized || !this.agent) {
      throw new Error('DevAICore n\'est pas initialisé. Appelez initialize() d\'abord.');
    }
    
    try {
      // Utiliser l'agent pour traiter la requête
      return await this.agent.processRequest(request);
    } catch (error) {
      console.error('Erreur lors du traitement de la requête:', error);
      return `Une erreur est survenue lors du traitement de votre requête: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  
  /**
   * Vérifie si le Core Agent est initialisé
   * @returns true si le Core Agent est initialisé, false sinon
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Réinitialise le Core Agent (utile pour les tests)
   */
  public reset(): void {
    this.agent = null;
    this.initialized = false;
  }
}
