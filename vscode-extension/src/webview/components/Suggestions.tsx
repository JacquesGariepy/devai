import * as React from 'react';
import { SuggestionData } from './ChatApp';

// Interface pour les propriétés du composant Suggestions
interface SuggestionsProps {
  suggestions: SuggestionData[];
  onSelect: (suggestion: SuggestionData) => void;
}

// Composant pour afficher les suggestions
export const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  onSelect
}) => {
  // Si aucune suggestion, ne rien afficher
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-2 max-h-48 overflow-y-auto rounded-md border border-border bg-background shadow-md">
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-secondary/20 focus:bg-secondary/20 focus:outline-none transition-colors"
            >
              <div className="flex items-center">
                {suggestion.icon && (
                  <div className="mr-2 text-muted-foreground">
                    <SuggestionIcon icon={suggestion.icon} />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium truncate">{suggestion.text}</div>
                  {suggestion.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.description}
                    </div>
                  )}
                </div>
                <div className="ml-2 text-xs px-1.5 py-0.5 rounded bg-secondary/30 text-secondary-foreground">
                  {suggestion.type === 'command' ? 'cmd' : suggestion.type === 'context' ? 'ctx' : 'hist'}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Composant pour afficher l'icône de suggestion
const SuggestionIcon: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'code':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      );
    case 'book':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      );
    case 'lightbulb':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
        </svg>
      );
    case 'history':
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"></path>
          <path d="M12 7v5l3 3"></path>
        </svg>
      );
    default:
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      );
  }
};
