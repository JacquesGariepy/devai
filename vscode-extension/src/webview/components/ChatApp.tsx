import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Message } from './Message';
import { InputBox } from './InputBox';
import { Toolbar } from './Toolbar';
import { ThemeProvider } from './ThemeProvider';
import { ToolExecution } from './ToolExecution';
import { Suggestions } from './Suggestions';

// Interface pour un message
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  id?: string;
  toolExecution?: ToolExecutionData;
}

// Interface pour les données d'exécution d'outil
export interface ToolExecutionData {
  toolName: string;
  status: 'running' | 'success' | 'error';
  startTime: Date;
  endTime?: Date;
  details?: any;
}

// Interface pour les données de suggestion
export interface SuggestionData {
  text: string;
  type: 'command' | 'context' | 'history';
  description?: string;
  icon?: string;
}

// Interface pour les propriétés du composant ChatApp
interface ChatAppProps {
  // Propriétés optionnelles pour les tests ou l'extension
}

// Composant principal de l'application de chat
export const ChatApp: React.FC<ChatAppProps> = (props) => {
  // État pour les messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // État pour l'indicateur de réflexion
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  // État pour le thème
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // État pour la langue
  const [language, setLanguage] = useState<string>('fr');
  
  // État pour les suggestions
  const [suggestions, setSuggestions] = useState<SuggestionData[]>([]);
  
  // État pour le texte d'entrée
  const [inputText, setInputText] = useState<string>('');
  
  // Référence au conteneur de messages pour le défilement
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Référence à l'API VS Code
  const vscode = acquireVsCodeApi();
  
  // Effet pour le défilement automatique
  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);
  
  // Effet pour l'initialisation
  useEffect(() => {
    // Demander le thème actuel
    vscode.postMessage({
      command: 'getTheme'
    });
    
    // Demander la langue actuelle
    vscode.postMessage({
      command: 'getLanguage'
    });
    
    // Écouter les messages de l'extension
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  
  // Fonction pour gérer les messages de l'extension
  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    
    switch (message.type) {
      case 'addMessage':
        addMessage(message.message);
        break;
      case 'setThinking':
        setIsThinking(message.thinking);
        break;
      case 'clearChat':
        setMessages([]);
        break;
      case 'setTheme':
        setTheme(message.theme);
        break;
      case 'setLanguage':
        setLanguage(message.language);
        break;
      case 'setSuggestions':
        setSuggestions(message.suggestions);
        break;
    }
  };
  
  // Fonction pour ajouter un message
  const addMessage = (message: ChatMessage) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        ...message,
        timestamp: message.timestamp || new Date(),
        id: message.id || `msg-${Date.now()}`
      }
    ]);
  };
  
  // Fonction pour envoyer un message
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Ajouter le message utilisateur
    addMessage({
      role: 'user',
      content: text
    });
    
    // Envoyer le message à l'extension
    vscode.postMessage({
      command: 'sendMessage',
      text: text
    });
    
    // Effacer le texte d'entrée
    setInputText('');
    
    // Effacer les suggestions
    setSuggestions([]);
  };
  
  // Fonction pour effacer le chat
  const clearChat = () => {
    vscode.postMessage({
      command: 'clearChat'
    });
  };
  
  // Fonction pour ouvrir les paramètres
  const openSettings = () => {
    vscode.postMessage({
      command: 'openSettings'
    });
  };
  
  // Fonction pour le défilement automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Fonction pour gérer les changements de texte d'entrée
  const handleInputChange = (text: string) => {
    setInputText(text);
    
    // Générer des suggestions basées sur le texte
    if (text.trim()) {
      // Simuler des suggestions (à remplacer par une vraie implémentation)
      const newSuggestions: SuggestionData[] = [
        {
          text: `/analyze ${text}`,
          type: 'command',
          description: 'Analyser le code',
          icon: 'code'
        },
        {
          text: `/explain ${text}`,
          type: 'command',
          description: 'Expliquer le code',
          icon: 'book'
        },
        {
          text: text,
          type: 'context',
          description: 'Basé sur le contexte actuel',
          icon: 'lightbulb'
        }
      ];
      
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  // Fonction pour sélectionner une suggestion
  const selectSuggestion = (suggestion: SuggestionData) => {
    setInputText(suggestion.text);
    setSuggestions([]);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col h-full bg-background text-foreground">
        <Toolbar 
          onClearChat={clearChat} 
          onOpenSettings={openSettings} 
          theme={theme} 
          onThemeChange={setTheme}
          language={language}
        />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message} 
              language={language}
            />
          ))}
          
          {isThinking && (
            <div className="flex items-center text-muted-foreground">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="ml-2">
                {language === 'fr' ? 'DevAI réfléchit...' : 'DevAI is thinking...'}
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t border-border">
          {suggestions.length > 0 && (
            <Suggestions 
              suggestions={suggestions} 
              onSelect={selectSuggestion} 
            />
          )}
          
          <InputBox 
            value={inputText}
            onChange={handleInputChange}
            onSend={sendMessage}
            isThinking={isThinking}
            language={language}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

// Fonction pour acquérir l'API VS Code
declare function acquireVsCodeApi(): any;
