# Documentation Technique de DevAI

Cette documentation technique détaille l'architecture, les composants et les flux de données de l'extension DevAI pour VS Code.

## Table des matières

1. [Architecture globale](#architecture-globale)
2. [Core Agent](#core-agent)
3. [Extension VS Code](#extension-vs-code)
4. [Système de sécurité](#système-de-sécurité)
5. [Intégration LLM](#intégration-llm)
6. [Système ReAct](#système-react)
7. [Système de mémoire](#système-de-mémoire)
8. [Interface utilisateur](#interface-utilisateur)
9. [Internationalisation](#internationalisation)
10. [Tests et qualité](#tests-et-qualité)

## Architecture globale

DevAI est composé de deux projets principaux :

1. **Core Agent** : Moteur d'intelligence artificielle indépendant de l'IDE
2. **Extension VS Code** : Interface utilisateur et intégration avec VS Code

Cette séparation permet une meilleure modularité et la possibilité d'intégrer le Core Agent avec d'autres environnements de développement à l'avenir.

### Diagramme d'architecture

```
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│        Extension VS Code        │      │            Core Agent           │
│                                 │      │                                 │
│  ┌─────────────┐ ┌───────────┐  │      │  ┌─────────────┐ ┌───────────┐  │
│  │   WebView   │ │  Services │  │      │  │ LLM Provider│ │   Tools   │  │
│  │  Interface  │ │  VS Code  │  │      │  │  Interface  │ │  Registry │  │
│  └──────┬──────┘ └─────┬─────┘  │      │  └──────┬──────┘ └─────┬─────┘  │
│         │              │        │      │         │              │        │
│  ┌──────┴──────────────┴─────┐  │      │  ┌──────┴──────────────┴─────┐  │
│  │      Integration Layer     │◄─┼──────┼─►│        ReAct Engine       │  │
│  └──────────────┬─────────────┘  │      │  └──────────────┬────────────┘  │
│                 │                │      │                 │               │
│  ┌──────────────┴─────────────┐  │      │  ┌──────────────┴────────────┐  │
│  │      Security Manager      │  │      │  │      Memory Manager       │  │
│  └─────────────────────────────┘  │      │  └─────────────────────────────┘  │
└─────────────────────────────────┘      └─────────────────────────────────┘
```

### Flux de données

1. L'utilisateur interagit avec l'interface WebView
2. Les requêtes sont transmises à l'Integration Layer
3. L'Integration Layer communique avec le Core Agent
4. Le Core Agent traite la requête via le ReAct Engine
5. Le ReAct Engine utilise le LLM Provider pour générer des réponses
6. Le ReAct Engine utilise le Tools Registry pour exécuter des actions
7. Les résultats sont renvoyés à l'Integration Layer
8. L'Integration Layer met à jour l'interface WebView

## Core Agent

Le Core Agent est le moteur d'intelligence artificielle de DevAI, responsable du traitement des requêtes utilisateur et de l'exécution des actions.

### Composants principaux

#### LLM Provider

Interface unifiée pour différents fournisseurs de modèles de langage :

```typescript
export interface LLMProviderConfig {
  provider: 'openai' | 'anthropic' | 'ollama';
  model: string;
  apiKey?: string;
  endpoint?: string;
}

export interface LLMResponse {
  text: string;
  toolCalls?: ToolCall[];
}

export class LLMProvider {
  constructor(config: LLMProviderConfig) {
    // Initialisation du provider
  }

  async generateResponse(prompt: string, options?: any): Promise<LLMResponse> {
    // Génération de réponse via le provider sélectionné
  }
}
```

#### Tools Registry

Registre des outils disponibles pour le Core Agent :

```typescript
export interface ToolConfig {
  enabledTools: string[];
}

export interface ToolCall {
  tool: string;
  params: any;
}

export type ToolHandler = (params: any) => Promise<any>;

export class ToolRegistry {
  constructor(config: ToolConfig) {
    // Initialisation du registre d'outils
  }

  registerTool(name: string, handler: ToolHandler): void {
    // Enregistrement d'un outil
  }

  getTool(name: string): ToolHandler | undefined {
    // Récupération d'un outil
  }

  isToolEnabled(category: string): boolean {
    // Vérification si une catégorie d'outils est activée
  }
}
```

#### ReAct Engine

Moteur de raisonnement et d'action basé sur Langchain.js :

```typescript
export interface ReActConfig {
  maxIterations: number;
  timeout: number;
}

export class ReActEngine {
  constructor(
    private llmProvider: LLMProvider,
    private toolRegistry: ToolRegistry,
    private config: ReActConfig
  ) {
    // Initialisation du moteur ReAct
  }

  async processRequest(request: string, context?: any): Promise<any> {
    // Traitement de la requête avec le cycle ReAct
  }
}
```

#### Memory Manager

Gestionnaire de mémoire pour l'historique des conversations et la base de connaissances :

```typescript
export interface MemoryConfig {
  conversationHistorySize: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class MemoryManager {
  constructor(config: MemoryConfig) {
    // Initialisation du gestionnaire de mémoire
  }

  addMessage(message: Message): void {
    // Ajout d'un message à l'historique
  }

  getConversationHistory(): Message[] {
    // Récupération de l'historique des conversations
  }

  clearConversationHistory(): void {
    // Effacement de l'historique des conversations
  }
}
```

## Extension VS Code

L'extension VS Code est responsable de l'interface utilisateur et de l'intégration avec l'IDE.

### Composants principaux

#### WebView Interface

Interface utilisateur basée sur React et TailwindCSS :

```typescript
export class ViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private extensionUri: vscode.Uri,
    private webViewCommunication: WebViewCommunication
  ) {
    // Initialisation du fournisseur de vue
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    // Résolution de la vue WebView
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Génération du HTML pour la WebView
  }
}
```

#### VS Code Services

Services pour interagir avec VS Code :

```typescript
export class ConfigurationService {
  constructor() {
    // Initialisation du service de configuration
  }

  getLLMConfig(): LLMProviderConfig {
    // Récupération de la configuration LLM
  }

  getUIConfig(): UIConfig {
    // Récupération de la configuration UI
  }

  getSecurityConfig(): SecurityConfig {
    // Récupération de la configuration de sécurité
  }
}

export class WorkspaceService {
  getActiveFile(): vscode.TextDocument | undefined {
    // Récupération du fichier actif
  }

  getSelectedText(): string | undefined {
    // Récupération du texte sélectionné
  }

  replaceSelectedText(text: string): Promise<boolean> {
    // Remplacement du texte sélectionné
  }
}
```

#### Integration Layer

Couche d'intégration entre l'extension VS Code et le Core Agent :

```typescript
export class CoreAgentIntegration {
  constructor(
    private coreAgentService: CoreAgentService,
    private configService: ConfigurationService,
    private workspaceService: WorkspaceService,
    private terminalService: TerminalService,
    private fileSystemService: FileSystemService,
    private i18nService: I18nService
  ) {
    // Initialisation de l'intégration
  }

  async initialize(): Promise<void> {
    // Initialisation du Core Agent
  }

  async processRequest(request: string): Promise<any> {
    // Traitement d'une requête utilisateur
  }

  async executeCommand(command: string, params: any): Promise<any> {
    // Exécution d'une commande spécifique
  }
}
```

#### Security Manager

Gestionnaire de sécurité pour l'extension :

```typescript
export enum SecurityLevel {
  SAFE = 'safe',
  MODERATE = 'moderate',
  HIGH = 'high'
}

export interface SecurityAction {
  type: string;
  level: SecurityLevel;
  details?: any;
}

export class SecurityManager {
  constructor(
    private i18nService: I18nService,
    private configService: ConfigurationService
  ) {
    // Initialisation du gestionnaire de sécurité
  }

  isWorkspaceTrusted(): boolean {
    // Vérification si le workspace est de confiance
  }

  async isActionAllowed(action: SecurityAction): Promise<boolean> {
    // Vérification si une action est autorisée
  }
}
```

## Système de sécurité

DevAI implémente plusieurs niveaux de sécurité pour protéger l'utilisateur et son environnement.

### Niveaux de sécurité

- **SAFE** : Actions sans risque (lecture de fichiers, analyse de code)
- **MODERATE** : Actions avec risque modéré (modification de fichiers)
- **HIGH** : Actions avec risque élevé (exécution de commandes)

### Sandboxing Docker

L'exécution des commandes est isolée dans des conteneurs Docker :

```typescript
export interface DockerSandboxOptions {
  command: string;
  workingDir?: string;
  extraMounts?: string[];
  resourceLimits?: {
    memory?: number;
    cpu?: number;
  };
  timeout?: number;
}

export class DockerSandboxManager {
  constructor(
    private terminalService: TerminalService,
    private i18nService: I18nService,
    private configService: ConfigurationService
  ) {
    // Initialisation du gestionnaire de sandboxing Docker
  }

  async isDockerAvailable(): Promise<boolean> {
    // Vérification si Docker est disponible
  }

  async executeInDocker(options: DockerSandboxOptions): Promise<any> {
    // Exécution d'une commande dans Docker
  }
}
```

### Respect du Workspace Trust

DevAI respecte le système de Workspace Trust de VS Code :

```typescript
if (!vscode.workspace.isTrusted) {
  // Pour les actions à risque modéré ou élevé, refuser si le workspace n'est pas de confiance
  if (action.level !== SecurityLevel.SAFE) {
    await this.showWorkspaceNotTrustedWarning();
    return false;
  }
}
```

## Intégration LLM

DevAI prend en charge plusieurs fournisseurs de modèles de langage.

### OpenAI

```typescript
export default class OpenAIProvider implements BaseLLMProvider {
  constructor(private config: {
    model: string;
    apiKey: string;
  }) {
    // Initialisation du provider OpenAI
  }

  async generateResponse(prompt: string, options?: any): Promise<LLMResponse> {
    // Génération de réponse via l'API OpenAI
  }
}
```

### Anthropic

```typescript
export default class AnthropicProvider implements BaseLLMProvider {
  constructor(private config: {
    model: string;
    apiKey: string;
  }) {
    // Initialisation du provider Anthropic
  }

  async generateResponse(prompt: string, options?: any): Promise<LLMResponse> {
    // Génération de réponse via l'API Anthropic
  }
}
```

### Ollama

```typescript
export default class OllamaProvider implements BaseLLMProvider {
  constructor(private config: {
    model: string;
    endpoint: string;
  }) {
    // Initialisation du provider Ollama
  }

  async generateResponse(prompt: string, options?: any): Promise<LLMResponse> {
    // Génération de réponse via l'API Ollama
  }
}
```

## Système ReAct

Le système ReAct (Reasoning and Acting) est basé sur Langchain.js et implémente un cycle de raisonnement et d'action.

### Cycle ReAct

1. **Observation** : Collecter des informations sur l'état actuel
2. **Raisonnement** : Analyser les informations et décider de la prochaine action
3. **Action** : Exécuter l'action décidée
4. **Répéter** : Continuer le cycle jusqu'à résolution de la requête

### Implémentation

```typescript
async processRequest(request: string, context?: any): Promise<any> {
  // Initialiser l'état
  const state = {
    request,
    context: context || {},
    iterations: 0,
    complete: false,
    result: null
  };

  // Cycle ReAct
  while (!state.complete && state.iterations < this.config.maxIterations) {
    // Observation
    const observation = this.collectObservation(state);

    // Raisonnement
    const reasoning = await this.llmProvider.generateResponse(
      this.buildPrompt(state, observation)
    );

    // Action
    if (reasoning.toolCalls && reasoning.toolCalls.length > 0) {
      for (const toolCall of reasoning.toolCalls) {
        const tool = this.toolRegistry.getTool(toolCall.tool);
        if (tool) {
          const result = await tool(toolCall.params);
          state.context[toolCall.tool] = result;
        }
      }
    } else {
      // Pas d'action, considérer comme terminé
      state.complete = true;
      state.result = reasoning.text;
    }

    // Incrémenter le compteur d'itérations
    state.iterations++;
  }

  return {
    text: state.result,
    iterations: state.iterations,
    complete: state.complete
  };
}
```

## Système de mémoire

DevAI utilise un système de mémoire pour stocker l'historique des conversations et une base de connaissances vectorielle.

### Mémoire conversationnelle

```typescript
export class ConversationalMemory {
  private messages: Message[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    if (this.messages.length > this.maxSize) {
      this.messages.shift();
    }
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }
}
```

### Base de connaissances vectorielle

```typescript
export class VectorKnowledgeBase {
  private vectors: Map<string, number[]> = new Map();
  private content: Map<string, string> = new Map();

  async addDocument(id: string, content: string): Promise<void> {
    // Convertir le contenu en vecteur
    const vector = await this.textToVector(content);
    this.vectors.set(id, vector);
    this.content.set(id, content);
  }

  async search(query: string, limit: number = 5): Promise<string[]> {
    // Convertir la requête en vecteur
    const queryVector = await this.textToVector(query);
    
    // Calculer les similarités
    const similarities: [string, number][] = [];
    for (const [id, vector] of this.vectors.entries()) {
      const similarity = this.cosineSimilarity(queryVector, vector);
      similarities.push([id, similarity]);
    }
    
    // Trier par similarité décroissante
    similarities.sort((a, b) => b[1] - a[1]);
    
    // Retourner les documents les plus similaires
    return similarities
      .slice(0, limit)
      .map(([id]) => this.content.get(id) || '');
  }

  private async textToVector(text: string): Promise<number[]> {
    // Conversion du texte en vecteur (implémentation spécifique)
    return [];
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    // Calcul de la similarité cosinus
    return 0;
  }
}
```

## Interface utilisateur

L'interface utilisateur de DevAI est basée sur React et TailwindCSS.

### Composants principaux

#### ChatApp

```typescript
export const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    // Envoyer un message à l'extension
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <InputBox
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isProcessing}
      />
    </div>
  );
};
```

#### Message

```typescript
export const Message: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}>
      <div className="message-content">
        <ReactMarkdown
          children={message.content}
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              // Rendu des blocs de code avec coloration syntaxique
            }
          }}
        />
      </div>
    </div>
  );
};
```

#### InputBox

```typescript
export const InputBox: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}> = ({ value, onChange, onSend, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-container">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Posez une question ou demandez de l'aide..."
        rows={1}
        className="input-textarea"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="send-button"
      >
        <SendIcon />
      </button>
    </div>
  );
};
```

## Internationalisation

DevAI prend en charge plusieurs langues grâce à un système d'internationalisation.

### Service d'internationalisation

```typescript
export class I18nService {
  private language: string;
  private translations: Record<string, Record<string, string>> = {
    fr: {
      // Traductions françaises
    },
    en: {
      // Traductions anglaises
    },
    es: {
      // Traductions espagnoles
    },
    de: {
      // Traductions allemandes
    }
  };

  constructor(language: string) {
    this.language = language;
  }

  setLanguage(language: string): void {
    this.language = language;
  }

  translate(key: string, params?: Record<string, any>): string {
    // Récupérer la traduction
    const translation = this.translations[this.language]?.[key] || key;
    
    // Remplacer les paramètres
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(`{${param}}`, String(value)),
        translation
      );
    }
    
    return translation;
  }
}
```

## Tests et qualité

DevAI est testé à plusieurs niveaux pour assurer sa qualité et sa fiabilité.

### Tests unitaires

```typescript
describe('Core Agent', () => {
  let coreAgent: DevAICore;
  
  beforeEach(() => {
    // Initialisation pour les tests
  });
  
  test('devrait initialiser correctement', async () => {
    // Test d'initialisation
  });
  
  test('devrait traiter une requête simple', async () => {
    // Test de traitement de requête
  });
});
```

### Tests d'intégration

```typescript
describe('Intégration Core Agent - Extension VS Code', () => {
  let coreAgentIntegration: CoreAgentIntegration;
  
  beforeEach(() => {
    // Initialisation pour les tests
  });
  
  test('devrait initialiser le Core Agent', async () => {
    // Test d'initialisation
  });
  
  test('devrait traiter une requête', async () => {
    // Test de traitement de requête
  });
});
```

### Tests end-to-end

```typescript
suite('Extension DevAI E2E Tests', () => {
  test('L\'extension devrait s\'activer correctement', async () => {
    // Test d'activation
  });
  
  test('Devrait ouvrir le panneau DevAI', async () => {
    // Test d'ouverture du panneau
  });
});
```

---

Cette documentation technique est destinée aux développeurs qui souhaitent comprendre l'architecture et le fonctionnement interne de DevAI. Pour plus d'informations sur l'utilisation de l'extension, consultez le [README](../README.md) et le [Guide d'utilisation avancé](ADVANCED_USAGE.md).
