import * as React from 'react';
import { useState, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { ChatMessage, ToolExecutionData } from './ChatApp';
import { ToolExecution } from './ToolExecution';

// Configuration de marked pour la coloration syntaxique
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// Interface pour les propriétés du composant Message
interface MessageProps {
  message: ChatMessage;
  language: string;
}

// Composant pour afficher un message
export const Message: React.FC<MessageProps> = ({ message, language }) => {
  // État pour le contenu HTML rendu
  const [renderedContent, setRenderedContent] = useState<string>('');
  
  // Effet pour le rendu du contenu Markdown
  useEffect(() => {
    // Fonction pour rendre le contenu Markdown
    const renderMarkdown = async () => {
      try {
        // Rendre le contenu Markdown en HTML
        const html = await marked(message.content);
        setRenderedContent(html);
      } catch (error) {
        console.error('Erreur lors du rendu Markdown:', error);
        setRenderedContent(message.content);
      }
    };
    
    renderMarkdown();
  }, [message.content]);
  
  // Déterminer la classe CSS en fonction du rôle
  const messageClass = message.role === 'user' 
    ? 'bg-primary/10 border-primary/20' 
    : 'bg-secondary/10 border-secondary/20';
  
  // Formater l'horodatage
  const formattedTime = message.timestamp 
    ? new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(message.timestamp))
    : '';
  
  return (
    <div className={`rounded-lg p-4 border ${messageClass}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-semibold">
          {message.role === 'user' 
            ? (language === 'fr' ? 'Vous' : 'You') 
            : 'DevAI'}
        </div>
        <div className="text-xs text-muted-foreground">
          {formattedTime}
        </div>
      </div>
      
      <div 
        className="prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
      
      {message.toolExecution && (
        <ToolExecution 
          data={message.toolExecution} 
          language={language}
        />
      )}
    </div>
  );
};
