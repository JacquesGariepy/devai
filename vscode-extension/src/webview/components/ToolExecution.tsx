import * as React from 'react';
import { ToolExecutionData } from './ChatApp';

// Interface pour les propriétés du composant ToolExecution
interface ToolExecutionProps {
  data: ToolExecutionData;
  language: string;
}

// Composant pour afficher l'exécution d'un outil
export const ToolExecution: React.FC<ToolExecutionProps> = ({
  data,
  language
}) => {
  // État pour l'affichage des détails
  const [showDetails, setShowDetails] = React.useState<boolean>(false);
  
  // Calculer la durée d'exécution
  const duration = data.endTime 
    ? Math.round((data.endTime.getTime() - data.startTime.getTime()) / 1000)
    : null;
  
  // Textes en fonction de la langue
  const executingText = language === 'fr' ? 'Exécution en cours' : 'Executing';
  const successText = language === 'fr' ? 'Exécution réussie' : 'Execution successful';
  const errorText = language === 'fr' ? 'Erreur d\'exécution' : 'Execution failed';
  const durationText = language === 'fr' ? 'Durée' : 'Duration';
  const secondsText = language === 'fr' ? 'secondes' : 'seconds';
  const detailsText = language === 'fr' ? 'Détails' : 'Details';
  const hideText = language === 'fr' ? 'Masquer' : 'Hide';
  
  // Déterminer la couleur en fonction du statut
  const statusColor = data.status === 'running' 
    ? 'text-blue-500 dark:text-blue-400' 
    : data.status === 'success'
      ? 'text-green-500 dark:text-green-400'
      : 'text-red-500 dark:text-red-400';
  
  // Déterminer l'icône en fonction du statut
  const StatusIcon = () => {
    if (data.status === 'running') {
      return (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      );
    } else if (data.status === 'success') {
      return (
        <svg 
          className="h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    } else {
      return (
        <svg 
          className="h-4 w-4 mr-2"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      );
    }
  };
  
  // Déterminer le texte du statut
  const statusText = data.status === 'running' 
    ? executingText 
    : data.status === 'success'
      ? successText
      : errorText;
  
  return (
    <div className="mt-3 p-3 rounded-md bg-background/50 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex items-center ${statusColor}`}>
            <StatusIcon />
            <span className="font-medium">{data.toolName}</span>
          </div>
          <span className="mx-2 text-muted-foreground">-</span>
          <span className="text-sm text-muted-foreground">{statusText}</span>
        </div>
        
        {duration !== null && (
          <div className="text-xs text-muted-foreground">
            {durationText}: {duration} {secondsText}
          </div>
        )}
      </div>
      
      {data.details && (
        <div className="mt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-primary hover:underline focus:outline-none"
          >
            {showDetails ? hideText : detailsText}
          </button>
          
          {showDetails && (
            <div className="mt-2 p-2 rounded bg-background/80 border border-border text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                {typeof data.details === 'string' 
                  ? data.details 
                  : JSON.stringify(data.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
