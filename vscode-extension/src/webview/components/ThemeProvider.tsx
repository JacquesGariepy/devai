import * as React from 'react';
import { ReactNode } from 'react';

// Interface pour les propriétés du composant ThemeProvider
interface ThemeProviderProps {
  theme: 'light' | 'dark';
  children: ReactNode;
}

// Composant pour fournir le thème à l'application
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme, 
  children 
}) => {
  // Effet pour appliquer le thème au document
  React.useEffect(() => {
    // Appliquer la classe de thème au document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Définir l'attribut data-theme pour les styles CSS
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return (
    <div className={`theme-${theme}`}>
      {children}
    </div>
  );
};
