# Documentation complète de l'extension DevAI pour VS Code

Ce document regroupe toutes les informations nécessaires pour installer, configurer, tester et utiliser l'extension DevAI pour Visual Studio Code.

## Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [Tests](#tests)
6. [Architecture technique](#architecture-technique)
7. [Résolution des problèmes](#résolution-des-problèmes)
8. [Contribution](#contribution)

## Introduction

DevAI est une extension VS Code qui intègre un assistant de développement IA avancé directement dans votre environnement de développement. L'extension utilise des modèles de langage de pointe (OpenAI, Anthropic, Ollama) pour vous aider à coder plus efficacement, analyser votre code, générer de la documentation, et bien plus encore.

### Fonctionnalités principales

- **Assistant de développement IA** : Posez des questions, demandez des explications ou de l'aide pour votre code
- **Analyse de code** : Obtenez des analyses détaillées de votre code sélectionné
- **Génération de documentation** : Générez automatiquement de la documentation pour vos fonctions et classes
- **Correction de bugs** : Identifiez et corrigez les bugs dans votre code
- **Génération de tests** : Créez des tests unitaires pour votre code
- **Optimisation de code** : Améliorez les performances et la lisibilité de votre code
- **Support multilingue** : Interface disponible en français, anglais, espagnol et allemand
- **Sécurité avancée** : Sandboxing Docker pour l'exécution sécurisée des commandes

## Installation

Pour installer l'extension DevAI, veuillez consulter le [Guide d'installation](INSTALLATION.md) qui détaille les prérequis, les méthodes d'installation et la configuration initiale.

### Prérequis résumés

- Visual Studio Code 1.80.0 ou supérieur
- Node.js 16.x ou supérieur
- Docker (pour le sandboxing)
- Connexion Internet

### Installation rapide

```bash
code --install-extension devai-vscode-extension-1.0.0.vsix
```

## Configuration

L'extension DevAI offre de nombreuses options de configuration pour s'adapter à vos besoins.

### Configuration du modèle de langage

- **Provider** : OpenAI, Anthropic ou Ollama
- **Modèle** : GPT-4, Claude, etc.
- **Clé API** : Votre clé API pour le service choisi
- **Point de terminaison** : URL personnalisée pour Ollama

### Configuration de la sécurité

- **Confirmation automatique** : Pour les actions à risque modéré ou élevé
- **Image Docker** : Pour le sandboxing
- **Limites de ressources** : Mémoire et CPU pour le sandboxing

### Configuration de l'interface

- **Thème** : Système, clair ou sombre
- **Langue** : Auto, français, anglais, espagnol ou allemand

Pour plus de détails, consultez la section Configuration dans le [Guide d'installation](INSTALLATION.md).

## Utilisation

### Commandes principales

- **DevAI: Démarrer l'assistant** (Ctrl+Shift+A) : Ouvre le panneau DevAI
- **DevAI: Analyser le code sélectionné** (Ctrl+Shift+1) : Analyse le code sélectionné
- **DevAI: Expliquer le code sélectionné** (Ctrl+Shift+2) : Explique le code sélectionné
- **DevAI: Optimiser le code sélectionné** (Ctrl+Shift+3) : Optimise le code sélectionné
- **DevAI: Corriger les bugs** : Identifie et corrige les bugs dans le fichier actuel
- **DevAI: Générer des tests unitaires** : Génère des tests pour le fichier actuel
- **DevAI: Générer de la documentation** : Génère de la documentation pour le fichier actuel

### Interface de chat

L'interface de chat vous permet d'interagir directement avec l'assistant DevAI. Vous pouvez :

1. Poser des questions sur le développement, les langages de programmation, les frameworks, etc.
2. Demander de l'aide pour résoudre des problèmes spécifiques
3. Faire analyser des portions de code
4. Demander la génération de code pour des tâches spécifiques
5. Obtenir des explications sur des concepts ou des erreurs

### Contexte de workspace

L'assistant DevAI comprend le contexte de votre workspace, ce qui lui permet de :

1. Faire référence à des fichiers existants
2. Comprendre la structure de votre projet
3. Proposer des solutions adaptées à votre environnement
4. Exécuter des commandes dans un environnement sandbox sécurisé

Pour des informations plus détaillées sur l'utilisation avancée, consultez le document [ADVANCED_USAGE.md](docs/ADVANCED_USAGE.md).

## Tests

Pour vérifier que l'extension fonctionne correctement, suivez les scénarios de test décrits dans le [Guide de test](TESTING.md). Ce guide couvre :

1. Vérification de l'activation de l'extension
2. Test de conversation simple
3. Test d'analyse de code
4. Test de génération de documentation
5. Test d'exécution de commandes dans le sandbox
6. Test de manipulation de fichiers
7. Test de support multilingue
8. Test des raccourcis clavier
9. Test de la mémoire conversationnelle
10. Test de l'historique des conversations

## Architecture technique

L'extension DevAI est composée de deux projets principaux :

1. **Core Agent** : Moteur principal qui gère l'interaction avec les modèles de langage, le système ReAct, et les outils
2. **Extension VS Code** : Interface utilisateur et intégration avec VS Code

### Core Agent

Le Core Agent est responsable de :

- L'interface avec différents fournisseurs de modèles de langage (OpenAI, Anthropic, Ollama)
- L'implémentation du système ReAct avec Langchain.js
- La gestion des outils (fichiers, terminal, analyse de code)
- La mémoire conversationnelle et la base de connaissances vectorielle
- Le sandboxing Docker pour l'exécution sécurisée des commandes
- Le support multilingue

### Extension VS Code

L'extension VS Code gère :

- L'interface utilisateur (Webview React)
- L'intégration avec l'API VS Code
- La gestion des commandes et des raccourcis
- La configuration et les préférences
- La sécurité et les confirmations utilisateur

Pour plus de détails techniques, consultez le document [TECHNICAL.md](docs/TECHNICAL.md).

## Résolution des problèmes

### Problèmes courants

#### L'extension ne s'active pas

- Vérifiez que vous avez redémarré VS Code après l'installation
- Assurez-vous que votre version de VS Code est compatible (1.80.0 ou supérieure)

#### Erreurs de connexion au modèle de langage

- Vérifiez que votre clé API est correcte et valide
- Assurez-vous que votre connexion Internet fonctionne correctement
- Pour Ollama, vérifiez que le serveur local est en cours d'exécution

#### Problèmes avec le sandboxing Docker

- Vérifiez que Docker est installé et en cours d'exécution
- Assurez-vous que votre utilisateur a les permissions nécessaires pour exécuter Docker
- Vérifiez que l'image Docker spécifiée est disponible ou peut être téléchargée

### Journaux de débogage

Pour accéder aux journaux de débogage :

1. Ouvrez la palette de commandes (Ctrl+Shift+P)
2. Tapez "Developer: Open Webview Developer Tools"
3. Consultez la console pour les messages d'erreur

### Signalement de bugs

Si vous rencontrez des problèmes, veuillez les signaler en incluant :

1. Une description détaillée du problème
2. Les étapes pour reproduire le problème
3. Le comportement attendu vs. le comportement observé
4. Les journaux d'erreur
5. Votre environnement (OS, version de VS Code, configuration)

## Contribution

Si vous souhaitez contribuer au développement de l'extension DevAI, consultez le document [CONTRIBUTING.md](CONTRIBUTING.md) qui détaille :

1. Comment configurer l'environnement de développement
2. Les conventions de code à suivre
3. Le processus de soumission de pull requests
4. Les tests à effectuer avant de soumettre du code

---

© 2025 DevAI Team. Tous droits réservés.
