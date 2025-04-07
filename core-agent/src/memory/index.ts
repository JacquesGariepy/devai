/**
 * Module de gestion de la mémoire pour le Core Agent
 * 
 * Ce module gère la mémoire conversationnelle, la base de connaissances vectorielle
 * et la contextualisation du workspace pour l'agent DevAI.
 */

/**
 * Configuration du système de mémoire
 */
export interface MemoryConfig {
  /** Taille maximale de l'historique de conversation */
  maxConversationHistory?: number;
  /** Chemin du répertoire pour la persistance */
  persistencePath?: string;
  /** Activer la base de connaissances vectorielle */
  enableVectorStore?: boolean;
  /** Configuration de la base de connaissances vectorielle */
  vectorStoreConfig?: {
    /** Dimensions des vecteurs */
    dimensions?: number;
    /** Méthode de similarité */
    similarityMethod?: 'cosine' | 'euclidean' | 'dot';
  };
  /** Activer la contextualisation du workspace */
  enableWorkspaceContext?: boolean;
}

/**
 * Types de messages dans la conversation
 */
export enum MessageType {
  USER = 'user',
  AGENT = 'agent',
  SYSTEM = 'system',
  OBSERVATION = 'observation'
}

/**
 * Interface pour un message dans la conversation
 */
export interface Message {
  /** Type de message */
  type: MessageType;
  /** Contenu du message */
  content: string;
  /** Horodatage */
  timestamp: number;
  /** Métadonnées supplémentaires */
  metadata?: Record<string, any>;
}

/**
 * Interface pour une observation d'outil
 */
export interface ToolObservation {
  /** Nom de l'outil utilisé */
  tool: string;
  /** Paramètres utilisés */
  parameters: Record<string, any>;
  /** Résultat de l'exécution */
  result: any;
  /** Statut de l'exécution */
  status: 'success' | 'error' | 'partial';
  /** Message d'erreur éventuel */
  error?: string;
  /** Horodatage */
  timestamp: number;
}

/**
 * Interface pour un élément de la base de connaissances vectorielle
 */
export interface VectorStoreEntry {
  /** Identifiant unique */
  id: string;
  /** Contenu textuel */
  content: string;
  /** Vecteur d'embedding */
  vector: number[];
  /** Métadonnées (chemin de fichier, type, etc.) */
  metadata: Record<string, any>;
}

/**
 * Interface pour le contexte du workspace
 */
export interface WorkspaceContext {
  /** Nom du projet */
  projectName?: string;
  /** Type de projet (Node.js, Python, etc.) */
  projectType?: string;
  /** Structure de fichiers simplifiée */
  fileStructure?: any;
  /** Fichiers importants (package.json, etc.) */
  keyFiles?: Record<string, string>;
  /** Frameworks détectés */
  detectedFrameworks?: string[];
  /** Dépendances principales */
  mainDependencies?: Record<string, string>;
}

/**
 * Classe principale pour le système de mémoire
 */
export class MemorySystem {
  private config: MemoryConfig;
  private conversationHistory: Message[] = [];
  private toolObservations: ToolObservation[] = [];
  private vectorStore: Map<string, VectorStoreEntry> = new Map();
  private workspaceContext: WorkspaceContext = {};
  
  /**
   * Constructeur du système de mémoire
   * @param config Configuration du système de mémoire
   */
  constructor(config?: MemoryConfig) {
    this.config = {
      maxConversationHistory: 100,
      enableVectorStore: true,
      enableWorkspaceContext: true,
      ...config
    };
    
    // Initialiser la persistance si un chemin est fourni
    if (this.config.persistencePath) {
      this.initializePersistence();
    }
  }
  
  /**
   * Initialise la persistance de la mémoire
   */
  private initializePersistence(): void {
    // TODO: Implémenter la persistance avec le système de fichiers
    console.log(`Initialisation de la persistance dans ${this.config.persistencePath}`);
    
    try {
      // Charger les données persistantes si elles existent
      this.loadPersistedData();
    } catch (error) {
      console.error('Erreur lors du chargement des données persistantes:', error);
    }
  }
  
  /**
   * Charge les données persistantes
   */
  private loadPersistedData(): void {
    // TODO: Implémenter le chargement des données persistantes
    // Cette méthode sera implémentée avec le système de fichiers réel
  }
  
  /**
   * Persiste les données actuelles
   */
  private persistData(): void {
    // TODO: Implémenter la persistance des données actuelles
    // Cette méthode sera implémentée avec le système de fichiers réel
  }
  
  /**
   * Ajoute un message utilisateur à l'historique
   * @param content Contenu du message
   * @returns Message ajouté
   */
  public async addUserMessage(content: string): Promise<Message> {
    const message: Message = {
      type: MessageType.USER,
      content,
      timestamp: Date.now()
    };
    
    this.conversationHistory.push(message);
    this.trimConversationHistory();
    
    if (this.config.persistencePath) {
      this.persistData();
    }
    
    return message;
  }
  
  /**
   * Ajoute un message agent à l'historique
   * @param content Contenu du message
   * @returns Message ajouté
   */
  public async addAgentMessage(content: string): Promise<Message> {
    const message: Message = {
      type: MessageType.AGENT,
      content,
      timestamp: Date.now()
    };
    
    this.conversationHistory.push(message);
    this.trimConversationHistory();
    
    if (this.config.persistencePath) {
      this.persistData();
    }
    
    return message;
  }
  
  /**
   * Ajoute un message système à l'historique
   * @param content Contenu du message
   * @returns Message ajouté
   */
  public async addSystemMessage(content: string): Promise<Message> {
    const message: Message = {
      type: MessageType.SYSTEM,
      content,
      timestamp: Date.now()
    };
    
    this.conversationHistory.push(message);
    this.trimConversationHistory();
    
    if (this.config.persistencePath) {
      this.persistData();
    }
    
    return message;
  }
  
  /**
   * Ajoute une observation d'outil à l'historique
   * @param tool Nom de l'outil
   * @param parameters Paramètres de l'outil
   * @param observation Résultat de l'observation
   * @returns Observation ajoutée
   */
  public async addObservation(
    tool: string,
    parameters: Record<string, any>,
    observation: { status: 'success' | 'error' | 'partial', result: any, error?: string }
  ): Promise<ToolObservation> {
    const toolObservation: ToolObservation = {
      tool,
      parameters,
      result: observation.result,
      status: observation.status,
      error: observation.error,
      timestamp: Date.now()
    };
    
    this.toolObservations.push(toolObservation);
    
    // Ajouter également comme message dans l'historique
    const content = this.formatObservationAsMessage(toolObservation);
    await this.addSystemMessage(content);
    
    if (this.config.persistencePath) {
      this.persistData();
    }
    
    return toolObservation;
  }
  
  /**
   * Formate une observation d'outil comme un message
   * @param observation Observation d'outil
   * @returns Message formaté
   */
  private formatObservationAsMessage(observation: ToolObservation): string {
    const { tool, parameters, result, status, error } = observation;
    
    let message = `Outil: ${tool}\nParamètres: ${JSON.stringify(parameters, null, 2)}\nStatut: ${status}`;
    
    if (status === 'success') {
      message += `\nRésultat: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`;
    } else if (status === 'error' && error) {
      message += `\nErreur: ${error}`;
    }
    
    return message;
  }
  
  /**
   * Limite la taille de l'historique de conversation
   */
  private trimConversationHistory(): void {
    if (this.conversationHistory.length > this.config.maxConversationHistory!) {
      const excess = this.conversationHistory.length - this.config.maxConversationHistory!;
      this.conversationHistory = this.conversationHistory.slice(excess);
    }
  }
  
  /**
   * Obtient l'historique de conversation
   * @param limit Nombre maximum de messages à retourner
   * @returns Historique de conversation
   */
  public getConversationHistory(limit?: number): Message[] {
    if (limit && limit > 0) {
      return this.conversationHistory.slice(-limit);
    }
    return [...this.conversationHistory];
  }
  
  /**
   * Obtient les observations d'outils récentes
   * @param limit Nombre maximum d'observations à retourner
   * @returns Observations d'outils
   */
  public getToolObservations(limit?: number): ToolObservation[] {
    if (limit && limit > 0) {
      return this.toolObservations.slice(-limit);
    }
    return [...this.toolObservations];
  }
  
  /**
   * Ajoute une entrée à la base de connaissances vectorielle
   * @param entry Entrée à ajouter
   */
  public async addToVectorStore(entry: Omit<VectorStoreEntry, 'vector'>): Promise<void> {
    if (!this.config.enableVectorStore) {
      return;
    }
    
    // TODO: Calculer le vecteur d'embedding avec un modèle d'embedding
    // Pour l'instant, utiliser un vecteur aléatoire comme placeholder
    const dimensions = this.config.vectorStoreConfig?.dimensions || 384;
    const vector = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
    
    const fullEntry: VectorStoreEntry = {
      ...entry,
      vector
    };
    
    this.vectorStore.set(entry.id, fullEntry);
    
    if (this.config.persistencePath) {
      this.persistData();
    }
  }
  
  /**
   * Recherche des entrées similaires dans la base de connaissances vectorielle
   * @param query Requête de recherche
   * @param limit Nombre maximum de résultats
   * @returns Entrées similaires
   */
  public async searchVectorStore(query: string, limit: number = 5): Promise<VectorStoreEntry[]> {
    if (!this.config.enableVectorStore || this.vectorStore.size === 0) {
      return [];
    }
    
    // TODO: Calculer le vecteur d'embedding de la requête
    // Pour l'instant, utiliser un vecteur aléatoire comme placeholder
    const dimensions = this.config.vectorStoreConfig?.dimensions || 384;
    const queryVector = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
    
    // Calculer la similarité avec toutes les entrées
    const entries = Array.from(this.vectorStore.values());
    const similarities = entries.map(entry => ({
      entry,
      similarity: this.calculateSimilarity(queryVector, entry.vector)
    }));
    
    // Trier par similarité décroissante et limiter le nombre de résultats
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, limit).map(item => item.entry);
  }
  
  /**
   * Calcule la similarité entre deux vecteurs
   * @param vec1 Premier vecteur
   * @param vec2 Deuxième vecteur
   * @returns Score de similarité
   */
  private calculateSimilarity(vec1: number[], vec2: number[]): number {
    const method = this.config.vectorStoreConfig?.similarityMethod || 'cosine';
    
    switch (method) {
      case 'cosine':
        return this.cosineSimilarity(vec1, vec2);
      case 'euclidean':
        return this.euclideanSimilarity(vec1, vec2);
      case 'dot':
        return this.dotProduct(vec1, vec2);
      default:
        return this.cosineSimilarity(vec1, vec2);
    }
  }
  
  /**
   * Calcule la similarité cosinus entre deux vecteurs
   * @param vec1 Premier vecteur
   * @param vec2 Deuxième vecteur
   * @returns Similarité cosinus
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = this.dotProduct(vec1, vec2);
    const magnitude1 = Math.sqrt(this.dotProduct(vec1, vec1));
    const magnitude2 = Math.sqrt(this.dotProduct(vec2, vec2));
    
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
    
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  /**
   * Calcule la similarité euclidienne entre deux vecteurs
   * @param vec1 Premier vecteur
   * @param vec2 Deuxième vecteur
   * @returns Similarité euclidienne
   */
  private euclideanSimilarity(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }
    
    // Convertir la distance en similarité (1 / (1 + distance))
    return 1 / (1 + Math.sqrt(sum));
  }
  
  /**
   * Calcule le produit scalaire entre deux vecteurs
   * @param vec1 Premier vecteur
   * @param vec2 Deuxième vecteur
   * @returns Produit scalaire
   */
  private dotProduct(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += vec1[i] * vec2[i];
    }
    return sum;
  }
  
  /**
   * Définit le contexte du workspace
   * @param context Contexte du workspace
   */
  public setWorkspaceContext(context: WorkspaceContext): void {
    this.workspaceContext = context;
    
    if (this.config.persistencePath) {
      this.persistData();
    }
  }
  
  /**
   * Met à jour le contexte du workspace
   * @param partialContext Contexte partiel à mettre à jour
   */
  public updateWorkspaceContext(partialContext: Partial<WorkspaceContext>): void {
    this.workspaceContext = {
      ...this.workspaceContext,
      ...partialContext
    };
    
    if (this.config.persistencePath) {
      this.persistData();
    }
  }
  
  /**
   * Obtient le contexte du workspace
   * @returns Contexte du workspace
   */
  public getWorkspaceContext(): WorkspaceContext {
    return { ...this.workspaceContext };
  }
  
  /**
   * Obtient le contexte actuel complet pour le LLM
   * @returns Contexte actuel
   */
  public async getCurrentContext(): Promise<any> {
    // Récupérer l'historique de conversation récent
    const recentHistory = this.getConversationHistory(20);
    
    // Récupérer les observations d'outils récentes
    const recentObservations = this.getToolObservations(10);
    
    // Contexte du workspace
    const workspaceContext = this.getWorkspaceContext();
    
    // Rechercher des informations pertinentes dans la base de connaissances
    let relevantKnowledge: VectorStoreEntry[] = [];
    
    if (this.config.enableVectorStore && recentHistory.length > 0) {
      // Utiliser le dernier message utilisateur comme requête
      const lastUserMessage = recentHistory
        .filter(msg => msg.type === MessageType.USER)
        .pop();
      
      if (lastUserMessage) {
        relevantKnowledge = await this.searchVectorStore(lastUserMessage.content, 3);
      }
    }
    
    // Construire le contexte complet
    return {
      conversation: recentHistory,
      observations: recentObservations,
      workspace: workspaceContext,
      relevantKnowledge: relevantKnowledge.map(entry => ({
        content: entry.content,
        metadata: entry.metadata
      }))
    };
  }
  
  /**
   * Réinitialise la mémoire
   */
  public reset(): void {
    this.conversationHistory = [];
    this.toolObservations = [];
    this.vectorStore = new Map();
    this.workspaceContext = {};
    
    if (this.config.persistencePath) {
      this.persistData();
    }
  }
}

// Exporter uniquement la classe MemorySystem
