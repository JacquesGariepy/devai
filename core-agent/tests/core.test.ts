/**
 * Tests unitaires simplifiés pour le Core Agent
 * 
 * Ce fichier contient des tests unitaires de base pour vérifier
 * le fonctionnement minimal du Core Agent.
 */

import { ReactSystem } from '../src/agent/react';
import { MemorySystem } from '../src/memory';
import { ToolRegistry } from '../src/tools';
import { SandboxManager } from '../src/sandbox';
import { LLMInterface } from '../src/llm';

// Mocks pour les dépendances
jest.mock('../src/memory');
jest.mock('../src/tools');
jest.mock('../src/sandbox');
jest.mock('../src/llm');

describe('ReactSystem', () => {
  let reactSystem: ReactSystem;
  let mockMemorySystem: jest.Mocked<MemorySystem>;
  let mockToolRegistry: jest.Mocked<ToolRegistry>;
  let mockSandboxManager: jest.Mocked<SandboxManager>;
  let mockLLMInterface: jest.Mocked<LLMInterface>;
  
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer des mocks pour les dépendances
    mockMemorySystem = new MemorySystem({}) as jest.Mocked<MemorySystem>;
    mockToolRegistry = new ToolRegistry() as jest.Mocked<ToolRegistry>;
    mockSandboxManager = new SandboxManager({}) as jest.Mocked<SandboxManager>;
    mockLLMInterface = new LLMInterface({}) as jest.Mocked<LLMInterface>;
    
    // Configurer le mock pour addAgentMessage
    mockMemorySystem.addAgentMessage = jest.fn().mockResolvedValue(undefined);
    
    // Créer une instance du système ReAct
    reactSystem = new ReactSystem({
      llmConfig: {},
      toolRegistry: mockToolRegistry,
      memorySystem: mockMemorySystem,
      sandboxManager: mockSandboxManager,
      defaultLanguage: 'fr'
    });
  });
  
  test('devrait traiter une requête simple', async () => {
    // Appeler la méthode processRequest
    const response = await reactSystem.processRequest('Test request');
    
    // Vérifier que la méthode addAgentMessage a été appelée
    expect(mockMemorySystem.addAgentMessage).toHaveBeenCalled();
    
    // Vérifier que la réponse est une chaîne de caractères
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});
