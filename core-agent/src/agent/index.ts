/**
 * Module principal pour la logique de l'agent DevAI
 * 
 * Ce module contient l'implémentation du système ReAct (Raisonnement et Action)
 * et la logique principale de l'agent intelligent.
 */

import { LLMInterface } from '../llm';
import { ToolRegistry } from '../tools';
import { MemorySystem } from '../memory';
import { SandboxManager } from '../sandbox';

/**
 * Interface pour la configuration de l'agent
 */
export interface AgentConfig {
  /** Configuration du modèle de langage */
  llmConfig: any;
  /** Configuration de la mémoire */
  memoryConfig?: any;
  /** Configuration des outils */
  toolsConfig?: any;
  /** Configuration du sandbox */
  sandboxConfig?: any;
  /** Langue par défaut (fr, en, etc.) */
  defaultLanguage?: string;
}

/**
 * Interface pour une observation résultant d'une action
 */
export interface Observation {
  /** Résultat de l'action */
  result: any;
  /** Statut de l'action (succès, échec, etc.) */
  status: 'success' | 'error' | 'partial';
  /** Message d'erreur éventuel */
  error?: string;
}

/**
 * Interface pour une action à exécuter
 */
export interface Action {
  /** Nom de l'outil à utiliser */
  tool: string;
  /** Paramètres pour l'outil */
  parameters: Record<string, any>;
}

/**
 * Classe principale de l'agent DevAI
 * Implémente la logique ReAct (Raisonnement et Action)
 */
export class DevAIAgent {
  private llmInterface: LLMInterface;
  private toolRegistry: ToolRegistry;
  private memorySystem: MemorySystem;
  private sandboxManager: SandboxManager;
  private config: AgentConfig;

  /**
   * Constructeur de l'agent DevAI
   * @param config Configuration de l'agent
   */
  constructor(config: AgentConfig) {
    this.config = config;
    
    // TODO: Initialiser les composants avec la configuration
    this.llmInterface = new LLMInterface(config.llmConfig);
    this.toolRegistry = new ToolRegistry(config.toolsConfig);
    this.memorySystem = new MemorySystem(config.memoryConfig);
    this.sandboxManager = new SandboxManager(config.sandboxConfig);
  }

  /**
   * Traite une requête utilisateur en utilisant le cycle ReAct
   * @param userRequest Requête de l'utilisateur
   * @returns Réponse finale de l'agent
   */
  public async processRequest(userRequest: string): Promise<string> {
    // Enregistrer la requête dans la mémoire
    await this.memorySystem.addUserMessage(userRequest);
    
    // Récupérer le contexte actuel
    const context = await this.memorySystem.getCurrentContext();
    
    // Boucle ReAct (Raisonnement -> Action -> Observation)
    let isComplete = false;
    let iterations = 0;
    const maxIterations = 10; // Limite de sécurité
    
    while (!isComplete && iterations < maxIterations) {
      iterations++;
      
      // Étape de raisonnement: demander au LLM quoi faire
      const reasoning = await this.llmInterface.getReasoning(context);
      
      // Vérifier si le raisonnement indique que la tâche est terminée
      if (reasoning.isComplete && reasoning.response) {
        // Enregistrer la réponse finale dans la mémoire
        await this.memorySystem.addAgentMessage(reasoning.response);
        return reasoning.response;
      }
      
      // Étape d'action: exécuter l'action recommandée par le LLM
      if (reasoning.action) {
        // Vérifier si l'outil existe
        if (this.toolRegistry.hasTool(reasoning.action.tool)) {
          // Exécuter l'action via le gestionnaire d'outils
          const observation = await this.executeAction(reasoning.action);
          
          // Ajouter l'observation au contexte
          await this.memorySystem.addObservation(
            reasoning.action.tool,
            reasoning.action.parameters,
            observation
          );
        } else {
          // Outil non trouvé, ajouter une erreur au contexte
          await this.memorySystem.addObservation(
            reasoning.action.tool,
            reasoning.action.parameters,
            {
              status: 'error',
              result: null,
              error: `Outil "${reasoning.action.tool}" non disponible`
            }
          );
        }
      }
    }
    
    // Si on atteint le nombre maximum d'itérations sans réponse finale
    return "Je n'ai pas pu compléter cette tâche dans le nombre d'étapes alloué. Veuillez reformuler ou simplifier votre demande.";
  }

  /**
   * Exécute une action en utilisant le registre d'outils
   * @param action Action à exécuter
   * @returns Observation résultant de l'action
   */
  private async executeAction(action: Action): Promise<Observation> {
    try {
      // Vérifier si l'action nécessite un sandbox
      const requiresSandbox = this.toolRegistry.requiresSandbox(action.tool);
      
      if (requiresSandbox) {
        // Exécuter dans le sandbox
        return await this.sandboxManager.executeInSandbox(
          action.tool,
          action.parameters,
          (tool, params) => this.toolRegistry.executeTool(tool, params)
        );
      } else {
        // Exécuter directement
        const result = await this.toolRegistry.executeTool(
          action.tool,
          action.parameters
        );
        
        return {
          status: 'success',
          result
        };
      }
    } catch (error) {
      return {
        status: 'error',
        result: null,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// Exporter les types et classes
export { DevAIAgent as Agent };
