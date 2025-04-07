import * as React from 'react';

// Interface pour les propriétés du composant Toolbar
interface ToolbarProps {
  onClearChat: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  language: string;
}

// Composant pour la barre d'outils
export const Toolbar: React.FC<ToolbarProps> = ({
  onClearChat,
  onOpenSettings,
  theme,
  onThemeChange,
  language
}) => {
  // Fonction pour basculer le thème
  const toggleTheme = () => {
    onThemeChange(theme === 'light' ? 'dark' : 'light');
  };
  
  // Textes en fonction de la langue
  const clearText = language === 'fr' ? 'Effacer la conversation' : 'Clear conversation';
  const settingsText = language === 'fr' ? 'Paramètres' : 'Settings';
  const themeText = language === 'fr' 
    ? (theme === 'light' ? 'Thème sombre' : 'Thème clair')
    : (theme === 'light' ? 'Dark theme' : 'Light theme');
  
  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-background">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold ml-2">DevAI</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onClearChat}
          className="p-2 rounded-md hover:bg-secondary/20 text-foreground"
          title={clearText}
          aria-label={clearText}
        >
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
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-secondary/20 text-foreground"
          title={themeText}
          aria-label={themeText}
        >
          {theme === 'light' ? (
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
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          ) : (
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
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="M4.93 4.93l1.41 1.41"></path>
              <path d="M17.66 17.66l1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="M6.34 17.66l-1.41 1.41"></path>
              <path d="M19.07 4.93l-1.41 1.41"></path>
            </svg>
          )}
        </button>
        
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md hover:bg-secondary/20 text-foreground"
          title={settingsText}
          aria-label={settingsText}
        >
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>
  );
};
