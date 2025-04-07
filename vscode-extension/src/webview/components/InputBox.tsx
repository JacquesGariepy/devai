import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

// Interface pour les propriétés du composant InputBox
interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
  isThinking: boolean;
  language: string;
}

// Composant pour la boîte de saisie
export const InputBox: React.FC<InputBoxProps> = ({ 
  value, 
  onChange, 
  onSend, 
  isThinking,
  language
}) => {
  // Référence à la zone de texte
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // État pour la hauteur automatique
  const [textareaHeight, setTextareaHeight] = useState<number>(56);
  
  // Effet pour le focus initial
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Effet pour ajuster la hauteur de la zone de texte
  useEffect(() => {
    if (textareaRef.current) {
      // Réinitialiser la hauteur
      textareaRef.current.style.height = 'auto';
      
      // Calculer la nouvelle hauteur
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(56, scrollHeight), 200);
      
      // Appliquer la nouvelle hauteur
      textareaRef.current.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
    }
  }, [value]);
  
  // Fonction pour gérer l'envoi du message
  const handleSend = () => {
    if (!isThinking && value.trim()) {
      onSend(value);
    }
  };
  
  // Fonction pour gérer l'appui sur les touches
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Envoyer le message avec Entrée (sans Maj)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Texte du placeholder en fonction de la langue
  const placeholderText = language === 'fr'
    ? 'Posez une question ou demandez de l\'aide...'
    : 'Ask a question or request help...';
  
  // Texte du bouton en fonction de la langue
  const buttonText = language === 'fr' ? 'Envoyer' : 'Send';
  
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        disabled={isThinking}
        className="w-full p-3 pr-12 rounded-lg border border-border bg-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ height: `${textareaHeight}px` }}
      />
      
      <button
        onClick={handleSend}
        disabled={isThinking || !value.trim()}
        className="absolute right-2 bottom-2 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={buttonText}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 2L11 13"></path>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
        </svg>
      </button>
    </div>
  );
};
