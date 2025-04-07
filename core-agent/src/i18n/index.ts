/**
 * Module de gestion du support multilingue pour le Core Agent
 * 
 * Ce module gère la localisation et l'internationalisation de l'agent DevAI,
 * permettant une expérience utilisateur dans différentes langues.
 */

/**
 * Configuration du support multilingue
 */
export interface I18nConfig {
  /** Langue par défaut */
  defaultLanguage: string;
  /** Langues supportées */
  supportedLanguages: string[];
  /** Chemin du répertoire des fichiers de traduction */
  translationsPath?: string;
  /** Traductions intégrées (si pas de fichiers externes) */
  embeddedTranslations?: Record<string, Record<string, string>>;
}

/**
 * Interface pour les traductions
 */
export interface Translations {
  /** Obtient une traduction par clé */
  get(key: string, params?: Record<string, string | number>): string;
  /** Obtient la langue actuelle */
  getCurrentLanguage(): string;
  /** Change la langue actuelle */
  setLanguage(language: string): void;
  /** Vérifie si une langue est supportée */
  isLanguageSupported(language: string): boolean;
  /** Obtient toutes les langues supportées */
  getSupportedLanguages(): string[];
}

/**
 * Classe principale pour le support multilingue
 */
export class I18nSystem implements Translations {
  private config: I18nConfig;
  private currentLanguage: string;
  private translations: Record<string, Record<string, string>> = {};
  
  /**
   * Constructeur du système multilingue
   * @param config Configuration du support multilingue
   */
  constructor(config: I18nConfig) {
    this.config = {
      ...config,
      // Valeurs par défaut si non spécifiées dans config
      defaultLanguage: config.defaultLanguage || 'fr',
      supportedLanguages: config.supportedLanguages || ['fr', 'en']
    };
    
    this.currentLanguage = this.config.defaultLanguage;
    
    // Initialiser les traductions
    this.initializeTranslations();
  }
  
  /**
   * Initialise les traductions
   */
  private initializeTranslations(): void {
    // Si des traductions intégrées sont fournies, les utiliser
    if (this.config.embeddedTranslations) {
      this.translations = this.config.embeddedTranslations;
    } else {
      // Sinon, charger les traductions par défaut
      this.translations = this.getDefaultTranslations();
      
      // Si un chemin de traductions est fourni, charger les traductions externes
      if (this.config.translationsPath) {
        this.loadExternalTranslations();
      }
    }
  }
  
  /**
   * Charge les traductions externes
   */
  private loadExternalTranslations(): void {
    // TODO: Implémenter le chargement des traductions externes
    // Cette méthode sera implémentée avec le système de fichiers réel
    console.log(`Chargement des traductions depuis ${this.config.translationsPath}`);
  }
  
  /**
   * Obtient les traductions par défaut
   * @returns Traductions par défaut
   */
  private getDefaultTranslations(): Record<string, Record<string, string>> {
    return {
      'fr': {
        // Messages généraux
        'welcome': 'Bienvenue dans DevAI, votre assistant de développement IA.',
        'error.general': 'Une erreur est survenue: {message}',
        'success': 'Opération réussie.',
        'loading': 'Chargement en cours...',
        'processing': 'Traitement en cours...',
        'completed': 'Traitement terminé.',
        
        // Messages liés aux outils
        'tool.readFile.success': 'Fichier {path} lu avec succès.',
        'tool.readFile.error': 'Erreur lors de la lecture du fichier {path}: {message}',
        'tool.writeFile.success': 'Fichier {path} écrit avec succès.',
        'tool.writeFile.error': 'Erreur lors de l\'écriture du fichier {path}: {message}',
        'tool.applyPatch.success': 'Patch appliqué au fichier {path} avec succès.',
        'tool.applyPatch.error': 'Erreur lors de l\'application du patch au fichier {path}: {message}',
        'tool.runInTerminal.success': 'Commande exécutée avec succès.',
        'tool.runInTerminal.error': 'Erreur lors de l\'exécution de la commande: {message}',
        'tool.findFile.success': '{count} fichiers trouvés.',
        'tool.findFile.error': 'Erreur lors de la recherche de fichiers: {message}',
        
        // Messages liés à l'agent
        'agent.thinking': 'Je réfléchis...',
        'agent.executing': 'J\'exécute {action}...',
        'agent.observing': 'J\'observe le résultat...',
        'agent.planning': 'Je planifie les prochaines étapes...',
        'agent.complete': 'J\'ai terminé la tâche.',
        'agent.error': 'Je n\'ai pas pu compléter la tâche: {message}',
        'agent.backtracking': 'Je tente une approche alternative...',
        
        // Messages liés au LLM
        'llm.connecting': 'Connexion au modèle {model}...',
        'llm.error': 'Erreur de communication avec le modèle: {message}',
        'llm.timeout': 'Délai d\'attente dépassé pour la réponse du modèle.',
        'llm.rateLimit': 'Limite de taux atteinte pour l\'API. Veuillez réessayer plus tard.',
        
        // Messages liés à la mémoire
        'memory.saved': 'Information enregistrée dans la mémoire.',
        'memory.retrieved': 'Information récupérée de la mémoire.',
        'memory.notFound': 'Information non trouvée dans la mémoire.',
        'memory.contextUpdated': 'Contexte du workspace mis à jour.',
        
        // Messages liés au sandbox
        'sandbox.starting': 'Démarrage de l\'environnement sandbox...',
        'sandbox.executing': 'Exécution dans l\'environnement sandbox...',
        'sandbox.completed': 'Exécution dans le sandbox terminée.',
        'sandbox.error': 'Erreur dans l\'environnement sandbox: {message}',
        
        // Descriptions d'outils pour les prompts
        'tool.description.readFile': 'Lit le contenu d\'un fichier.',
        'tool.description.writeFile': 'Écrit ou écrase un fichier.',
        'tool.description.applyPatch': 'Applique un diff/patch à un fichier.',
        'tool.description.runInTerminal': 'Exécute une commande dans le terminal.',
        'tool.description.findFile': 'Recherche des fichiers par nom/pattern.',
        'tool.description.getCodeContext': 'Récupère le contexte de code actuel.',
        'tool.description.analyzeCode': 'Analyse statique du code.',
        'tool.description.detectBugs': 'Détecte les bugs et vulnérabilités.',
        'tool.description.generateTests': 'Génère des tests unitaires.',
        'tool.description.analyzeDependencies': 'Analyse les dépendances du projet.',
        'tool.description.generateDocumentation': 'Génère de la documentation.',
        
        // Prompts système pour les différents LLM
        'prompt.system.openai': `Vous êtes DevAI, un agent développeur IA autonome intégré à VS Code.
Votre objectif est d'aider les développeurs à comprendre et modifier leur code.
Vous avez accès à des outils pour lire et modifier des fichiers, exécuter des commandes, et analyser du code.

Lorsqu'on vous pose une question ou demande une tâche, vous devez:
1. Analyser la demande et déterminer les actions nécessaires
2. Décomposer les tâches complexes en sous-tâches gérables
3. Utiliser les outils à votre disposition pour accomplir chaque sous-tâche
4. Suivre une approche méthodique et rigoureuse
5. Fournir une réponse claire et concise

Pour chaque étape de raisonnement, vous devez:
- Réfléchir à l'approche à adopter
- Choisir l'outil approprié à utiliser
- Observer le résultat et planifier l'étape suivante
- En cas d'échec, essayer une approche alternative (backtracking)

Lorsque vous avez terminé la tâche, indiquez clairement que vous avez fini et fournissez un résumé de ce que vous avez fait.

Vous êtes particulièrement efficace pour:
- Comprendre et expliquer du code existant
- Corriger des bugs et résoudre des problèmes
- Implémenter de nouvelles fonctionnalités
- Refactoriser et optimiser du code
- Générer des tests unitaires
- Analyser les dépendances et la structure d'un projet

Utilisez toujours les outils disponibles plutôt que de deviner ou d'imaginer le contenu des fichiers ou le résultat des commandes.`,

        'prompt.system.anthropic': `Vous êtes DevAI, un agent développeur IA autonome intégré à VS Code.
Votre objectif est d'aider les développeurs à comprendre et modifier leur code.

<instructions>
Lorsqu'on vous pose une question ou demande une tâche, vous devez:
1. Analyser la demande et déterminer les actions nécessaires
2. Décomposer les tâches complexes en sous-tâches gérables
3. Utiliser les outils à votre disposition pour accomplir chaque sous-tâche
4. Suivre une approche méthodique et rigoureuse
5. Fournir une réponse claire et concise

Pour chaque étape de raisonnement, vous devez:
- Réfléchir à l'approche à adopter
- Choisir l'outil approprié à utiliser
- Observer le résultat et planifier l'étape suivante
- En cas d'échec, essayer une approche alternative (backtracking)

Lorsque vous avez terminé la tâche, indiquez clairement que vous avez fini et fournissez un résumé de ce que vous avez fait.

Vous êtes particulièrement efficace pour:
- Comprendre et expliquer du code existant
- Corriger des bugs et résoudre des problèmes
- Implémenter de nouvelles fonctionnalités
- Refactoriser et optimiser du code
- Générer des tests unitaires
- Analyser les dépendances et la structure d'un projet

Utilisez toujours les outils disponibles plutôt que de deviner ou d'imaginer le contenu des fichiers ou le résultat des commandes.
</instructions>`,

        'prompt.system.generic': `Vous êtes DevAI, un agent développeur IA autonome intégré à VS Code.
Votre objectif est d'aider les développeurs à comprendre et modifier leur code.
Vous avez accès à des outils pour lire et modifier des fichiers, exécuter des commandes, et analyser du code.

Lorsqu'on vous pose une question ou demande une tâche, vous devez:
1. Analyser la demande et déterminer les actions nécessaires
2. Décomposer les tâches complexes en sous-tâches gérables
3. Utiliser les outils à votre disposition pour accomplir chaque sous-tâche
4. Suivre une approche méthodique et rigoureuse
5. Fournir une réponse claire et concise

Pour chaque étape de raisonnement, vous devez:
- Réfléchir à l'approche à adopter
- Choisir l'outil approprié à utiliser
- Observer le résultat et planifier l'étape suivante
- En cas d'échec, essayer une approche alternative (backtracking)

Lorsque vous avez terminé la tâche, indiquez clairement que vous avez fini et fournissez un résumé de ce que vous avez fait.

Utilisez toujours les outils disponibles plutôt que de deviner ou d'imaginer le contenu des fichiers ou le résultat des commandes.`
      },
      
      'en': {
        // General messages
        'welcome': 'Welcome to DevAI, your AI development assistant.',
        'error.general': 'An error occurred: {message}',
        'success': 'Operation successful.',
        'loading': 'Loading...',
        'processing': 'Processing...',
        'completed': 'Processing completed.',
        
        // Tool-related messages
        'tool.readFile.success': 'File {path} read successfully.',
        'tool.readFile.error': 'Error reading file {path}: {message}',
        'tool.writeFile.success': 'File {path} written successfully.',
        'tool.writeFile.error': 'Error writing file {path}: {message}',
        'tool.applyPatch.success': 'Patch applied to file {path} successfully.',
        'tool.applyPatch.error': 'Error applying patch to file {path}: {message}',
        'tool.runInTerminal.success': 'Command executed successfully.',
        'tool.runInTerminal.error': 'Error executing command: {message}',
        'tool.findFile.success': '{count} files found.',
        'tool.findFile.error': 'Error finding files: {message}',
        
        // Agent-related messages
        'agent.thinking': 'I\'m thinking...',
        'agent.executing': 'I\'m executing {action}...',
        'agent.observing': 'I\'m observing the result...',
        'agent.planning': 'I\'m planning the next steps...',
        'agent.complete': 'I\'ve completed the task.',
        'agent.error': 'I couldn\'t complete the task: {message}',
        'agent.backtracking': 'I\'m trying an alternative approach...',
        
        // LLM-related messages
        'llm.connecting': 'Connecting to model {model}...',
        'llm.error': 'Error communicating with the model: {message}',
        'llm.timeout': 'Timeout waiting for model response.',
        'llm.rateLimit': 'Rate limit reached for the API. Please try again later.',
        
        // Memory-related messages
        'memory.saved': 'Information saved to memory.',
        'memory.retrieved': 'Information retrieved from memory.',
        'memory.notFound': 'Information not found in memory.',
        'memory.contextUpdated': 'Workspace context updated.',
        
        // Sandbox-related messages
        'sandbox.starting': 'Starting sandbox environment...',
        'sandbox.executing': 'Executing in sandbox environment...',
        'sandbox.completed': 'Execution in sandbox completed.',
        'sandbox.error': 'Error in sandbox environment: {message}',
        
        // Tool descriptions for prompts
        'tool.description.readFile': 'Reads the content of a file.',
        'tool.description.writeFile': 'Writes or overwrites a file.',
        'tool.description.applyPatch': 'Applies a diff/patch to a file.',
        'tool.description.runInTerminal': 'Executes a command in the terminal.',
        'tool.description.findFile': 'Searches for files by name/pattern.',
        'tool.description.getCodeContext': 'Gets the current code context.',
        'tool.description.analyzeCode': 'Performs static code analysis.',
        'tool.description.detectBugs': 'Detects bugs and vulnerabilities.',
        'tool.description.generateTests': 'Generates unit tests.',
        'tool.description.analyzeDependencies': 'Analyzes project dependencies.',
        'tool.description.generateDocumentation': 'Generates documentation.',
        
        // System prompts for different LLMs
        'prompt.system.openai': `You are DevAI, an autonomous AI developer agent integrated into VS Code.
Your goal is to help developers understand and modify their code.
You have access to tools to read and modify files, execute commands, and analyze code.

When asked a question or given a task, you must:
1. Analyze the request and determine the necessary actions
2. Break down complex tasks into manageable subtasks
3. Use the tools at your disposal to accomplish each subtask
4. Follow a methodical and rigorous approach
5. Provide a clear and concise response

For each reasoning step, you must:
- Think about the approach to adopt
- Choose the appropriate tool to use
- Observe the result and plan the next step
- In case of failure, try an alternative approach (backtracking)

When you have completed the task, clearly indicate that you have finished and provide a summary of what you have done.

You are particularly effective at:
- Understanding and explaining existing code
- Fixing bugs and solving problems
- Implementing new features
- Refactoring and optimizing code
- Generating unit tests
- Analyzing dependencies and project structure

Always use the available tools rather than guessing or imagining the content of files or the result of commands.`,

        'prompt.system.anthropic': `You are DevAI, an autonomous AI developer agent integrated into VS Code.
Your goal is to help developers understand and modify their code.

<instructions>
When asked a question or given a task, you must:
1. Analyze the request and determine the necessary actions
2. Break down complex tasks into manageable subtasks
3. Use the tools at your disposal to accomplish each subtask
4. Follow a methodical and rigorous approach
5. Provide a clear and concise response

For each reasoning step, you must:
- Think about the approach to adopt
- Choose the appropriate tool to use
- Observe the result and plan the next step
- In case of failure, try an alternative approach (backtracking)

When you have completed the task, clearly indicate that you have finished and provide a summary of what you have done.

You are particularly effective at:
- Understanding and explaining existing code
- Fixing bugs and solving problems
- Implementing new features
- Refactoring and optimizing code
- Generating unit tests
- Analyzing dependencies and project structure

Always use the available tools rather than guessing or imagining the content of files or the result of commands.
</instructions>`,

        'prompt.system.generic': `You are DevAI, an autonomous AI developer agent integrated into VS Code.
Your goal is to help developers understand and modify their code.
You have access to tools to read and modify files, execute commands, and analyze code.

When asked a question or given a task, you must:
1. Analyze the request and determine the necessary actions
2. Break down complex tasks into manageable subtasks
3. Use the tools at your disposal to accomplish each subtask
4. Follow a methodical and rigorous approach
5. Provide a clear and concise response

For each reasoning step, you must:
- Think about the approach to adopt
- Choose the appropriate tool to use
- Observe the result and plan the next step
- In case of failure, try an alternative approach (backtracking)

When you have completed the task, clearly indicate that you have finished and provide a summary of what you have done.

Always use the available tools rather than guessing or imagining the content of files or the result of commands.`
      },
      
      // Ajout du support pour l'espagnol
      'es': {
        // Mensajes generales
        'welcome': 'Bienvenido a DevAI, tu asistente de desarrollo con IA.',
        'error.general': 'Se ha producido un error: {message}',
        'success': 'Operación exitosa.',
        'loading': 'Cargando...',
        'processing': 'Procesando...',
        'completed': 'Procesamiento completado.',
        
        // Mensajes relacionados con herramientas
        'tool.readFile.success': 'Archivo {path} leído con éxito.',
        'tool.readFile.error': 'Error al leer el archivo {path}: {message}',
        'tool.writeFile.success': 'Archivo {path} escrito con éxito.',
        'tool.writeFile.error': 'Error al escribir el archivo {path}: {message}',
        'tool.applyPatch.success': 'Parche aplicado al archivo {path} con éxito.',
        'tool.applyPatch.error': 'Error al aplicar el parche al archivo {path}: {message}',
        'tool.runInTerminal.success': 'Comando ejecutado con éxito.',
        'tool.runInTerminal.error': 'Error al ejecutar el comando: {message}',
        'tool.findFile.success': '{count} archivos encontrados.',
        'tool.findFile.error': 'Error al buscar archivos: {message}',
        
        // Mensajes relacionados con el agente
        'agent.thinking': 'Estoy pensando...',
        'agent.executing': 'Estoy ejecutando {action}...',
        'agent.observing': 'Estoy observando el resultado...',
        'agent.planning': 'Estoy planificando los siguientes pasos...',
        'agent.complete': 'He completado la tarea.',
        'agent.error': 'No pude completar la tarea: {message}',
        'agent.backtracking': 'Estoy probando un enfoque alternativo...',
        
        // Mensajes relacionados con LLM
        'llm.connecting': 'Conectando con el modelo {model}...',
        'llm.error': 'Error al comunicarse con el modelo: {message}',
        'llm.timeout': 'Tiempo de espera agotado para la respuesta del modelo.',
        'llm.rateLimit': 'Límite de tasa alcanzado para la API. Por favor, inténtelo más tarde.',
        
        // Mensajes relacionados con la memoria
        'memory.saved': 'Información guardada en la memoria.',
        'memory.retrieved': 'Información recuperada de la memoria.',
        'memory.notFound': 'Información no encontrada en la memoria.',
        'memory.contextUpdated': 'Contexto del espacio de trabajo actualizado.',
        
        // Mensajes relacionados con el sandbox
        'sandbox.starting': 'Iniciando entorno sandbox...',
        'sandbox.executing': 'Ejecutando en entorno sandbox...',
        'sandbox.completed': 'Ejecución en sandbox completada.',
        'sandbox.error': 'Error en el entorno sandbox: {message}',
        
        // Descripciones de herramientas para prompts
        'tool.description.readFile': 'Lee el contenido de un archivo.',
        'tool.description.writeFile': 'Escribe o sobrescribe un archivo.',
        'tool.description.applyPatch': 'Aplica un diff/parche a un archivo.',
        'tool.description.runInTerminal': 'Ejecuta un comando en la terminal.',
        'tool.description.findFile': 'Busca archivos por nombre/patrón.',
        'tool.description.getCodeContext': 'Obtiene el contexto de código actual.',
        'tool.description.analyzeCode': 'Realiza análisis estático de código.',
        'tool.description.detectBugs': 'Detecta errores y vulnerabilidades.',
        'tool.description.generateTests': 'Genera pruebas unitarias.',
        'tool.description.analyzeDependencies': 'Analiza las dependencias del proyecto.',
        'tool.description.generateDocumentation': 'Genera documentación.',
        
        // Prompts de sistema para diferentes LLMs
        'prompt.system.openai': `Eres DevAI, un agente desarrollador de IA autónomo integrado en VS Code.
Tu objetivo es ayudar a los desarrolladores a entender y modificar su código.
Tienes acceso a herramientas para leer y modificar archivos, ejecutar comandos y analizar código.

Cuando te hacen una pregunta o te dan una tarea, debes:
1. Analizar la solicitud y determinar las acciones necesarias
2. Desglosar tareas complejas en subtareas manejables
3. Utilizar las herramientas a tu disposición para realizar cada subtarea
4. Seguir un enfoque metódico y riguroso
5. Proporcionar una respuesta clara y concisa

Para cada paso de razonamiento, debes:
- Pensar en el enfoque a adoptar
- Elegir la herramienta apropiada para usar
- Observar el resultado y planificar el siguiente paso
- En caso de fallo, probar un enfoque alternativo (backtracking)

Cuando hayas completado la tarea, indica claramente que has terminado y proporciona un resumen de lo que has hecho.

Eres particularmente eficaz en:
- Entender y explicar código existente
- Corregir errores y resolver problemas
- Implementar nuevas funcionalidades
- Refactorizar y optimizar código
- Generar pruebas unitarias
- Analizar dependencias y estructura de proyectos

Utiliza siempre las herramientas disponibles en lugar de adivinar o imaginar el contenido de los archivos o el resultado de los comandos.`,

        'prompt.system.anthropic': `Eres DevAI, un agente desarrollador de IA autónomo integrado en VS Code.
Tu objetivo es ayudar a los desarrolladores a entender y modificar su código.

<instructions>
Cuando te hacen una pregunta o te dan una tarea, debes:
1. Analizar la solicitud y determinar las acciones necesarias
2. Desglosar tareas complejas en subtareas manejables
3. Utilizar las herramientas a tu disposición para realizar cada subtarea
4. Seguir un enfoque metódico y riguroso
5. Proporcionar una respuesta clara y concisa

Para cada paso de razonamiento, debes:
- Pensar en el enfoque a adoptar
- Elegir la herramienta apropiada para usar
- Observar el resultado y planificar el siguiente paso
- En caso de fallo, probar un enfoque alternativo (backtracking)

Cuando hayas completado la tarea, indica claramente que has terminado y proporciona un resumen de lo que has hecho.

Eres particularmente eficaz en:
- Entender y explicar código existente
- Corregir errores y resolver problemas
- Implementar nuevas funcionalidades
- Refactorizar y optimizar código
- Generar pruebas unitarias
- Analizar dependencias y estructura de proyectos

Utiliza siempre las herramientas disponibles en lugar de adivinar o imaginar el contenido de los archivos o el resultado de los comandos.
</instructions>`,

        'prompt.system.generic': `Eres DevAI, un agente desarrollador de IA autónomo integrado en VS Code.
Tu objetivo es ayudar a los desarrolladores a entender y modificar su código.
Tienes acceso a herramientas para leer y modificar archivos, ejecutar comandos y analizar código.

Cuando te hacen una pregunta o te dan una tarea, debes:
1. Analizar la solicitud y determinar las acciones necesarias
2. Desglosar tareas complejas en subtareas manejables
3. Utilizar las herramientas a tu disposición para realizar cada subtarea
4. Seguir un enfoque metódico y riguroso
5. Proporcionar una respuesta clara y concisa

Para cada paso de razonamiento, debes:
- Pensar en el enfoque a adoptar
- Elegir la herramienta apropiada para usar
- Observar el resultado y planificar el siguiente paso
- En caso de fallo, probar un enfoque alternativo (backtracking)

Cuando hayas completado la tarea, indica claramente que has terminado y proporciona un resumen de lo que has hecho.

Utiliza siempre las herramientas disponibles en lugar de adivinar o imaginar el contenido de los archivos o el resultado de los comandos.`
      },
      
      // Ajout du support pour l'allemand
      'de': {
        // Allgemeine Nachrichten
        'welcome': 'Willkommen bei DevAI, Ihrem KI-Entwicklungsassistenten.',
        'error.general': 'Ein Fehler ist aufgetreten: {message}',
        'success': 'Operation erfolgreich.',
        'loading': 'Wird geladen...',
        'processing': 'Wird verarbeitet...',
        'completed': 'Verarbeitung abgeschlossen.',
        
        // Werkzeugbezogene Nachrichten
        'tool.readFile.success': 'Datei {path} erfolgreich gelesen.',
        'tool.readFile.error': 'Fehler beim Lesen der Datei {path}: {message}',
        'tool.writeFile.success': 'Datei {path} erfolgreich geschrieben.',
        'tool.writeFile.error': 'Fehler beim Schreiben der Datei {path}: {message}',
        'tool.applyPatch.success': 'Patch erfolgreich auf Datei {path} angewendet.',
        'tool.applyPatch.error': 'Fehler beim Anwenden des Patches auf Datei {path}: {message}',
        'tool.runInTerminal.success': 'Befehl erfolgreich ausgeführt.',
        'tool.runInTerminal.error': 'Fehler bei der Ausführung des Befehls: {message}',
        'tool.findFile.success': '{count} Dateien gefunden.',
        'tool.findFile.error': 'Fehler beim Suchen von Dateien: {message}',
        
        // Agentenbezogene Nachrichten
        'agent.thinking': 'Ich denke nach...',
        'agent.executing': 'Ich führe {action} aus...',
        'agent.observing': 'Ich beobachte das Ergebnis...',
        'agent.planning': 'Ich plane die nächsten Schritte...',
        'agent.complete': 'Ich habe die Aufgabe abgeschlossen.',
        'agent.error': 'Ich konnte die Aufgabe nicht abschließen: {message}',
        'agent.backtracking': 'Ich versuche einen alternativen Ansatz...',
        
        // LLM-bezogene Nachrichten
        'llm.connecting': 'Verbindung zum Modell {model} wird hergestellt...',
        'llm.error': 'Fehler bei der Kommunikation mit dem Modell: {message}',
        'llm.timeout': 'Zeitüberschreitung beim Warten auf die Modellantwort.',
        'llm.rateLimit': 'Ratenlimit für die API erreicht. Bitte versuchen Sie es später erneut.',
        
        // Speicherbezogene Nachrichten
        'memory.saved': 'Informationen im Speicher gespeichert.',
        'memory.retrieved': 'Informationen aus dem Speicher abgerufen.',
        'memory.notFound': 'Informationen nicht im Speicher gefunden.',
        'memory.contextUpdated': 'Workspace-Kontext aktualisiert.',
        
        // Sandbox-bezogene Nachrichten
        'sandbox.starting': 'Sandbox-Umgebung wird gestartet...',
        'sandbox.executing': 'Ausführung in Sandbox-Umgebung...',
        'sandbox.completed': 'Ausführung in Sandbox abgeschlossen.',
        'sandbox.error': 'Fehler in der Sandbox-Umgebung: {message}',
        
        // Werkzeugbeschreibungen für Prompts
        'tool.description.readFile': 'Liest den Inhalt einer Datei.',
        'tool.description.writeFile': 'Schreibt oder überschreibt eine Datei.',
        'tool.description.applyPatch': 'Wendet einen Diff/Patch auf eine Datei an.',
        'tool.description.runInTerminal': 'Führt einen Befehl im Terminal aus.',
        'tool.description.findFile': 'Sucht nach Dateien nach Name/Muster.',
        'tool.description.getCodeContext': 'Ruft den aktuellen Code-Kontext ab.',
        'tool.description.analyzeCode': 'Führt statische Code-Analyse durch.',
        'tool.description.detectBugs': 'Erkennt Fehler und Sicherheitslücken.',
        'tool.description.generateTests': 'Generiert Unit-Tests.',
        'tool.description.analyzeDependencies': 'Analysiert Projektabhängigkeiten.',
        'tool.description.generateDocumentation': 'Generiert Dokumentation.',
        
        // System-Prompts für verschiedene LLMs
        'prompt.system.openai': `Du bist DevAI, ein autonomer KI-Entwickleragent, der in VS Code integriert ist.
Dein Ziel ist es, Entwicklern zu helfen, ihren Code zu verstehen und zu modifizieren.
Du hast Zugriff auf Werkzeuge zum Lesen und Ändern von Dateien, Ausführen von Befehlen und Analysieren von Code.

Wenn du eine Frage gestellt oder eine Aufgabe erteilt bekommst, musst du:
1. Die Anfrage analysieren und die notwendigen Aktionen bestimmen
2. Komplexe Aufgaben in überschaubare Teilaufgaben aufteilen
3. Die dir zur Verfügung stehenden Werkzeuge nutzen, um jede Teilaufgabe zu erledigen
4. Einen methodischen und rigorosen Ansatz verfolgen
5. Eine klare und präzise Antwort geben

Für jeden Denkschritt musst du:
- Über den zu wählenden Ansatz nachdenken
- Das geeignete Werkzeug auswählen
- Das Ergebnis beobachten und den nächsten Schritt planen
- Im Falle eines Fehlschlags einen alternativen Ansatz versuchen (Backtracking)

Wenn du die Aufgabe abgeschlossen hast, gib deutlich an, dass du fertig bist, und fasse zusammen, was du getan hast.

Du bist besonders effektiv bei:
- Verstehen und Erklären von bestehendem Code
- Beheben von Fehlern und Lösen von Problemen
- Implementieren neuer Funktionen
- Refaktorisieren und Optimieren von Code
- Generieren von Unit-Tests
- Analysieren von Abhängigkeiten und Projektstruktur

Verwende immer die verfügbaren Werkzeuge, anstatt den Inhalt von Dateien oder das Ergebnis von Befehlen zu erraten oder zu imaginieren.`,

        'prompt.system.anthropic': `Du bist DevAI, ein autonomer KI-Entwickleragent, der in VS Code integriert ist.
Dein Ziel ist es, Entwicklern zu helfen, ihren Code zu verstehen und zu modifizieren.

<instructions>
Wenn du eine Frage gestellt oder eine Aufgabe erteilt bekommst, musst du:
1. Die Anfrage analysieren und die notwendigen Aktionen bestimmen
2. Komplexe Aufgaben in überschaubare Teilaufgaben aufteilen
3. Die dir zur Verfügung stehenden Werkzeuge nutzen, um jede Teilaufgabe zu erledigen
4. Einen methodischen und rigorosen Ansatz verfolgen
5. Eine klare und präzise Antwort geben

Für jeden Denkschritt musst du:
- Über den zu wählenden Ansatz nachdenken
- Das geeignete Werkzeug auswählen
- Das Ergebnis beobachten und den nächsten Schritt planen
- Im Falle eines Fehlschlags einen alternativen Ansatz versuchen (Backtracking)

Wenn du die Aufgabe abgeschlossen hast, gib deutlich an, dass du fertig bist, und fasse zusammen, was du getan hast.

Du bist besonders effektiv bei:
- Verstehen und Erklären von bestehendem Code
- Beheben von Fehlern und Lösen von Problemen
- Implementieren neuer Funktionen
- Refaktorisieren und Optimieren von Code
- Generieren von Unit-Tests
- Analysieren von Abhängigkeiten und Projektstruktur

Verwende immer die verfügbaren Werkzeuge, anstatt den Inhalt von Dateien oder das Ergebnis von Befehlen zu erraten oder zu imaginieren.
</instructions>`,

        'prompt.system.generic': `Du bist DevAI, ein autonomer KI-Entwickleragent, der in VS Code integriert ist.
Dein Ziel ist es, Entwicklern zu helfen, ihren Code zu verstehen und zu modifizieren.
Du hast Zugriff auf Werkzeuge zum Lesen und Ändern von Dateien, Ausführen von Befehlen und Analysieren von Code.

Wenn du eine Frage gestellt oder eine Aufgabe erteilt bekommst, musst du:
1. Die Anfrage analysieren und die notwendigen Aktionen bestimmen
2. Komplexe Aufgaben in überschaubare Teilaufgaben aufteilen
3. Die dir zur Verfügung stehenden Werkzeuge nutzen, um jede Teilaufgabe zu erledigen
4. Einen methodischen und rigorosen Ansatz verfolgen
5. Eine klare und präzise Antwort geben

Für jeden Denkschritt musst du:
- Über den zu wählenden Ansatz nachdenken
- Das geeignete Werkzeug auswählen
- Das Ergebnis beobachten und den nächsten Schritt planen
- Im Falle eines Fehlschlags einen alternativen Ansatz versuchen (Backtracking)

Wenn du die Aufgabe abgeschlossen hast, gib deutlich an, dass du fertig bist, und fasse zusammen, was du getan hast.

Verwende immer die verfügbaren Werkzeuge, anstatt den Inhalt von Dateien oder das Ergebnis von Befehlen zu erraten oder zu imaginieren.`
      }
    };
  }
  
  /**
   * Obtient une traduction par clé
   * @param key Clé de traduction
   * @param params Paramètres de remplacement
   * @returns Traduction
   */
  public get(key: string, params?: Record<string, string | number>): string {
    // Vérifier si la langue actuelle est supportée
    if (!this.translations[this.currentLanguage]) {
      console.warn(`Langue ${this.currentLanguage} non supportée, utilisation de la langue par défaut ${this.config.defaultLanguage}`);
      this.currentLanguage = this.config.defaultLanguage;
    }
    
    // Récupérer la traduction
    let translation = this.translations[this.currentLanguage][key];
    
    // Si la traduction n'existe pas dans la langue actuelle, essayer la langue par défaut
    if (!translation && this.currentLanguage !== this.config.defaultLanguage) {
      translation = this.translations[this.config.defaultLanguage][key];
    }
    
    // Si la traduction n'existe toujours pas, retourner la clé
    if (!translation) {
      console.warn(`Traduction non trouvée pour la clé ${key}`);
      return key;
    }
    
    // Remplacer les paramètres
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      }
    }
    
    return translation;
  }
  
  /**
   * Obtient la langue actuelle
   * @returns Langue actuelle
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }
  
  /**
   * Change la langue actuelle
   * @param language Nouvelle langue
   */
  public setLanguage(language: string): void {
    if (this.isLanguageSupported(language)) {
      this.currentLanguage = language;
    } else {
      console.warn(`Langue ${language} non supportée, utilisation de la langue par défaut ${this.config.defaultLanguage}`);
      this.currentLanguage = this.config.defaultLanguage;
    }
  }
  
  /**
   * Vérifie si une langue est supportée
   * @param language Langue à vérifier
   * @returns true si la langue est supportée, false sinon
   */
  public isLanguageSupported(language: string): boolean {
    return this.config.supportedLanguages.includes(language);
  }
  
  /**
   * Obtient toutes les langues supportées
   * @returns Langues supportées
   */
  public getSupportedLanguages(): string[] {
    return [...this.config.supportedLanguages];
  }
  
  /**
   * Ajoute une nouvelle langue
   * @param language Code de la langue
   * @param translations Traductions
   */
  public addLanguage(language: string, translations: Record<string, string>): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    
    // Fusionner les traductions
    this.translations[language] = {
      ...this.translations[language],
      ...translations
    };
    
    // Ajouter la langue à la liste des langues supportées si elle n'y est pas déjà
    if (!this.config.supportedLanguages.includes(language)) {
      this.config.supportedLanguages.push(language);
    }
  }
  
  /**
   * Ajoute ou met à jour une traduction
   * @param language Code de la langue
   * @param key Clé de traduction
   * @param value Valeur de traduction
   */
  public setTranslation(language: string, key: string, value: string): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    
    this.translations[language][key] = value;
    
    // Ajouter la langue à la liste des langues supportées si elle n'y est pas déjà
    if (!this.config.supportedLanguages.includes(language)) {
      this.config.supportedLanguages.push(language);
    }
  }
  
  /**
   * Obtient le prompt système pour un provider LLM dans la langue actuelle
   * @param provider Provider LLM
   * @returns Prompt système
   */
  public getSystemPrompt(provider: string): string {
    const key = `prompt.system.${provider.toLowerCase()}`;
    
    // Essayer d'obtenir le prompt spécifique au provider
    let prompt = this.get(key);
    
    // Si le prompt n'existe pas pour ce provider, utiliser le prompt générique
    if (prompt === key) {
      prompt = this.get('prompt.system.generic');
    }
    
    return prompt;
  }
  
  /**
   * Obtient la description d'un outil dans la langue actuelle
   * @param toolName Nom de l'outil
   * @returns Description de l'outil
   */
  public getToolDescription(toolName: string): string {
    return this.get(`tool.description.${toolName}`);
  }
}

// Exporter uniquement la classe I18nSystem
