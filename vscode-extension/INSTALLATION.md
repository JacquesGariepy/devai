# Guide d'installation de l'extension DevAI pour VS Code

Ce guide vous explique comment installer et configurer l'extension DevAI pour Visual Studio Code.

## Prérequis

Avant d'installer l'extension DevAI, assurez-vous que votre environnement répond aux exigences suivantes :

1. **Visual Studio Code** : Version 1.80.0 ou supérieure
2. **Node.js** : Version 16.x ou supérieure (recommandé)
3. **Docker** : Nécessaire pour le sandboxing (fonctionnalité de sécurité)
4. **Connexion Internet** : Requise pour communiquer avec les API des modèles de langage

## Installation de l'extension

### Méthode 1 : Installation depuis le fichier VSIX

1. Téléchargez le fichier VSIX de l'extension DevAI (`devai-vscode-extension-1.0.0.vsix`)
2. Ouvrez Visual Studio Code
3. Accédez à l'onglet Extensions (Ctrl+Shift+X ou Cmd+Shift+X sur macOS)
4. Cliquez sur les trois points (...) en haut du panneau Extensions
5. Sélectionnez "Installer à partir d'un VSIX..."
6. Naviguez jusqu'au fichier VSIX téléchargé et sélectionnez-le
7. Redémarrez VS Code lorsque vous y êtes invité

### Méthode 2 : Installation via la ligne de commande

Si vous préférez utiliser la ligne de commande, vous pouvez installer l'extension avec la commande suivante :

```bash
code --install-extension chemin/vers/devai-vscode-extension-1.0.0.vsix
```

## Configuration initiale

Après l'installation, vous devez configurer l'extension pour l'utiliser avec votre fournisseur de modèle de langage préféré :

1. Ouvrez les paramètres de VS Code (Fichier > Préférences > Paramètres ou Ctrl+,)
2. Recherchez "DevAI" dans la barre de recherche des paramètres
3. Configurez les paramètres suivants :

### Configuration du modèle de langage

- **Provider** : Choisissez votre fournisseur de modèle de langage (OpenAI, Anthropic ou Ollama)
- **Modèle** : Sélectionnez le modèle à utiliser (par exemple, gpt-4 pour OpenAI)
- **Clé API** : Entrez votre clé API pour le fournisseur choisi
- **Point de terminaison** : Pour Ollama, spécifiez l'URL du serveur local (par défaut : http://localhost:11434)

### Configuration de la sécurité

- **Confirmation automatique** : Choisissez si vous souhaitez confirmer automatiquement les actions à risque modéré ou élevé
- **Image Docker** : Spécifiez l'image Docker à utiliser pour le sandboxing (par défaut : ubuntu:22.04)
- **Limites de ressources** : Définissez les limites de mémoire et de CPU pour le sandboxing

### Configuration de l'interface utilisateur

- **Thème** : Choisissez entre le thème système, clair ou sombre
- **Langue** : Sélectionnez la langue de l'interface (auto, fr, en, es, de)

## Vérification de l'installation

Pour vérifier que l'extension est correctement installée et configurée :

1. Ouvrez la palette de commandes (Ctrl+Shift+P ou Cmd+Shift+P sur macOS)
2. Tapez "DevAI: Démarrer l'assistant" et appuyez sur Entrée
3. Le panneau DevAI devrait s'ouvrir dans la barre d'activité de VS Code

## Résolution des problèmes courants

### L'extension ne s'active pas

- Vérifiez que vous avez redémarré VS Code après l'installation
- Assurez-vous que votre version de VS Code est compatible (1.80.0 ou supérieure)

### Erreurs de connexion au modèle de langage

- Vérifiez que votre clé API est correcte et valide
- Assurez-vous que votre connexion Internet fonctionne correctement
- Pour Ollama, vérifiez que le serveur local est en cours d'exécution

### Problèmes avec le sandboxing Docker

- Vérifiez que Docker est installé et en cours d'exécution
- Assurez-vous que votre utilisateur a les permissions nécessaires pour exécuter Docker
- Vérifiez que l'image Docker spécifiée est disponible ou peut être téléchargée

## Support et ressources supplémentaires

- **Documentation avancée** : Consultez le fichier `docs/ADVANCED_USAGE.md` pour des fonctionnalités avancées
- **Documentation technique** : Référez-vous à `docs/TECHNICAL.md` pour comprendre l'architecture
- **Signalement de bugs** : Utilisez le dépôt GitHub pour signaler des problèmes
- **Contributions** : Consultez `CONTRIBUTING.md` si vous souhaitez contribuer au projet
