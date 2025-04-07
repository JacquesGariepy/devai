# DevAI - Assistant de développement IA avancé pour VS Code

![DevAI Logo](resources/icon.png)

## Description

DevAI est un assistant de développement IA avancé pour VS Code qui combine la puissance des grands modèles de langage (LLM) avec des outils de développement spécifiques pour vous aider à coder plus efficacement. Grâce à son architecture ReAct (Reasoning and Acting) et son intégration profonde avec VS Code, DevAI peut comprendre votre code, répondre à vos questions, générer du code, corriger des bugs, et bien plus encore.

## Fonctionnalités principales

- **Interface conversationnelle intuitive** : Discutez avec DevAI comme avec un collègue développeur
- **Analyse de code intelligente** : Obtenez des explications détaillées sur n'importe quel code
- **Correction automatique de bugs** : Identifiez et corrigez les problèmes dans votre code
- **Génération de tests unitaires** : Créez automatiquement des tests pour votre code
- **Documentation automatique** : Générez de la documentation complète pour vos projets
- **Optimisation de code** : Améliorez les performances et la lisibilité de votre code
- **Support multilingue** : Interface disponible en français, anglais, espagnol et allemand
- **Sécurité avancée** : Sandboxing Docker pour l'exécution sécurisée des commandes

## Installation

1. Ouvrez VS Code
2. Accédez à l'onglet Extensions (Ctrl+Shift+X)
3. Recherchez "DevAI"
4. Cliquez sur "Installer"

Ou installez directement via la ligne de commande :
```
code --install-extension devai.vscode-extension
```

## Configuration

Après l'installation, vous devez configurer DevAI avec votre fournisseur LLM préféré :

1. Ouvrez les paramètres VS Code (Ctrl+,)
2. Recherchez "DevAI"
3. Configurez les paramètres suivants :
   - `devai.llm.provider` : Choisissez votre fournisseur (openai, anthropic, ollama)
   - `devai.llm.model` : Spécifiez le modèle à utiliser
   - `devai.llm.apiKey` : Entrez votre clé API (pour OpenAI et Anthropic)
   - `devai.llm.endpoint` : Spécifiez un point de terminaison personnalisé (pour Ollama)

### Configuration Docker (Optionnelle mais recommandée)

Pour utiliser la fonctionnalité de sandboxing Docker :

1. Installez Docker sur votre machine : [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
2. Assurez-vous que Docker est en cours d'exécution
3. DevAI détectera automatiquement Docker et l'utilisera pour l'exécution sécurisée des commandes

## Utilisation

### Démarrer DevAI

- Cliquez sur l'icône DevAI dans la barre d'activité
- Ou utilisez le raccourci clavier `Ctrl+Shift+A` (`Cmd+Shift+A` sur macOS)

### Commandes principales

DevAI offre plusieurs commandes accessibles via la palette de commandes (Ctrl+Shift+P) :

- `DevAI: Démarrer l'assistant` - Initialise l'assistant DevAI
- `DevAI: Ouvrir le panneau` - Ouvre le panneau de conversation
- `DevAI: Analyser le code sélectionné` - Analyse le code sélectionné
- `DevAI: Corriger les bugs dans le fichier actuel` - Identifie et corrige les bugs
- `DevAI: Générer des tests unitaires` - Génère des tests pour le fichier actuel
- `DevAI: Expliquer le code sélectionné` - Explique le code sélectionné
- `DevAI: Optimiser le code sélectionné` - Optimise le code sélectionné
- `DevAI: Générer de la documentation` - Génère de la documentation pour le fichier actuel

### Raccourcis clavier

- `Ctrl+Shift+A` (`Cmd+Shift+A` sur macOS) - Ouvrir le panneau DevAI
- `Ctrl+Shift+1` (`Cmd+Shift+1` sur macOS) - Analyser le code sélectionné
- `Ctrl+Shift+2` (`Cmd+Shift+2` sur macOS) - Expliquer le code sélectionné
- `Ctrl+Shift+3` (`Cmd+Shift+3` sur macOS) - Optimiser le code sélectionné

## Exemples d'utilisation

### Analyse de code

1. Sélectionnez un bloc de code dans votre éditeur
2. Utilisez le raccourci `Ctrl+Shift+1` ou cliquez avec le bouton droit et sélectionnez "DevAI: Analyser le code sélectionné"
3. DevAI analysera le code et fournira des informations détaillées sur sa structure, sa fonctionnalité et ses potentiels problèmes

### Correction de bugs

1. Ouvrez un fichier contenant des bugs
2. Cliquez sur l'icône DevAI dans la barre de titre de l'éditeur ou utilisez la commande "DevAI: Corriger les bugs dans le fichier actuel"
3. DevAI identifiera les bugs et proposera des corrections

### Génération de tests

1. Ouvrez un fichier pour lequel vous souhaitez générer des tests
2. Utilisez la commande "DevAI: Générer des tests unitaires"
3. DevAI analysera le code et générera des tests unitaires appropriés

## Sécurité et confidentialité

DevAI prend la sécurité et la confidentialité au sérieux :

- **Respect du Workspace Trust** : Les opérations sensibles ne sont autorisées que dans les workspaces de confiance
- **Confirmations utilisateur** : Les actions potentiellement dangereuses nécessitent une confirmation explicite
- **Sandboxing Docker** : L'exécution des commandes est isolée dans des conteneurs Docker
- **Confidentialité des données** : Conformité RGPD/GDPR, les données sont traitées selon les politiques de confidentialité du fournisseur LLM choisi

## Support multilingue

DevAI prend en charge les langues suivantes :

- Français
- Anglais
- Espagnol
- Allemand

La langue par défaut est déterminée automatiquement en fonction des paramètres de VS Code, mais peut être modifiée dans les paramètres.

## Compatibilité

- VS Code 1.80.0 ou supérieur
- Windows, macOS et Linux
- Docker (recommandé pour le sandboxing)

## Dépannage

### DevAI ne démarre pas

- Vérifiez que vous avez configuré correctement votre fournisseur LLM et votre clé API
- Assurez-vous que votre connexion Internet est active
- Consultez les journaux VS Code pour plus d'informations

### Les commandes Docker échouent

- Vérifiez que Docker est installé et en cours d'exécution
- Assurez-vous que votre utilisateur a les permissions nécessaires pour exécuter Docker

## Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md) pour plus d'informations.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Remerciements

- L'équipe VS Code pour leur excellent éditeur
- Les fournisseurs de modèles LLM (OpenAI, Anthropic, etc.) pour leurs puissants modèles
- La communauté open source pour leurs nombreuses contributions

---

Développé avec ❤️ par l'équipe DevAI
