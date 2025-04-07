# Guide d'utilisation avancé de DevAI

Ce guide détaille les fonctionnalités avancées de l'extension DevAI et explique comment en tirer le meilleur parti pour votre développement quotidien.

## Table des matières

1. [Configuration avancée](#configuration-avancée)
2. [Utilisation des commandes avancées](#utilisation-des-commandes-avancées)
3. [Techniques de prompt efficaces](#techniques-de-prompt-efficaces)
4. [Intégration avec Docker](#intégration-avec-docker)
5. [Personnalisation de l'interface](#personnalisation-de-linterface)
6. [Utilisation multilingue](#utilisation-multilingue)
7. [Optimisation des performances](#optimisation-des-performances)
8. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Configuration avancée

### Configuration des modèles LLM

DevAI prend en charge plusieurs fournisseurs de modèles LLM, chacun avec ses propres caractéristiques :

#### OpenAI

```json
{
  "devai.llm.provider": "openai",
  "devai.llm.model": "gpt-4",
  "devai.llm.apiKey": "votre-clé-api"
}
```

Modèles disponibles :
- `gpt-4` - Recommandé pour les tâches complexes
- `gpt-4-turbo` - Plus rapide, idéal pour les tâches quotidiennes
- `gpt-3.5-turbo` - Plus économique, pour les tâches simples

#### Anthropic

```json
{
  "devai.llm.provider": "anthropic",
  "devai.llm.model": "claude-3-opus",
  "devai.llm.apiKey": "votre-clé-api"
}
```

Modèles disponibles :
- `claude-3-opus` - Haute qualité, idéal pour l'analyse de code complexe
- `claude-3-sonnet` - Bon équilibre entre performance et coût
- `claude-3-haiku` - Plus rapide, pour les tâches simples

#### Ollama (modèles locaux)

```json
{
  "devai.llm.provider": "ollama",
  "devai.llm.model": "llama3",
  "devai.llm.endpoint": "http://localhost:11434"
}
```

Modèles recommandés :
- `llama3` - Modèle polyvalent de haute qualité
- `codellama` - Spécialisé pour le code
- `mistral` - Bon équilibre entre performance et ressources requises

### Configuration du sandboxing Docker

Pour une sécurité optimale, configurez les paramètres Docker :

```json
{
  "devai.sandbox.image": "ubuntu:22.04",
  "devai.sandbox.defaultMemoryLimit": 1024,
  "devai.sandbox.defaultCpuLimit": 2,
  "devai.sandbox.defaultTimeout": 60
}
```

### Configuration de la sécurité

Ajustez les niveaux de confirmation selon vos besoins :

```json
{
  "devai.security.autoConfirmModerate": true,
  "devai.security.autoConfirmHigh": false
}
```

## Utilisation des commandes avancées

### Analyse de code contextuelle

Pour obtenir une analyse qui prend en compte le contexte du projet entier :

1. Sélectionnez le code à analyser
2. Utilisez la commande `DevAI: Analyser le code sélectionné`
3. Dans le chat, ajoutez du contexte : "Analyse ce code dans le contexte du pattern Repository utilisé dans ce projet"

### Génération de tests avancée

Pour générer des tests plus spécifiques :

1. Ouvrez le fichier source
2. Utilisez la commande `DevAI: Générer des tests unitaires`
3. Spécifiez des paramètres supplémentaires dans le chat :
   - "Utilise Jest avec une couverture de 100%"
   - "Inclus des tests pour les cas d'erreur"
   - "Utilise des mocks pour les dépendances externes"

### Optimisation de code ciblée

Pour optimiser votre code avec des objectifs spécifiques :

1. Sélectionnez le code à optimiser
2. Utilisez la commande `DevAI: Optimiser le code sélectionné`
3. Spécifiez l'objectif :
   - "Optimise pour la performance"
   - "Optimise pour la lisibilité"
   - "Optimise pour la mémoire"
   - "Refactore en utilisant le pattern Observer"

## Techniques de prompt efficaces

Pour obtenir les meilleurs résultats avec DevAI, suivez ces conseils :

### Structure de prompt efficace

```
[CONTEXTE] Brève description du projet et de son architecture
[TÂCHE] Description claire de ce que vous voulez accomplir
[CONTRAINTES] Limitations ou exigences spécifiques
[FORMAT] Format de sortie souhaité
```

Exemple :
```
[CONTEXTE] Application React avec TypeScript utilisant Redux pour la gestion d'état
[TÂCHE] Crée un composant de formulaire de connexion avec validation
[CONTRAINTES] Doit utiliser Formik et Yup, être accessible et responsive
[FORMAT] Composant TypeScript avec styles CSS-in-JS
```

### Itération progressive

Pour les tâches complexes, procédez par étapes :

1. Demandez d'abord une structure ou un plan
2. Validez ou ajustez cette structure
3. Demandez l'implémentation détaillée
4. Affinez les détails spécifiques

## Intégration avec Docker

### Configuration avancée de Docker

Pour des besoins spécifiques, vous pouvez personnaliser l'image Docker :

1. Créez un Dockerfile personnalisé :
```dockerfile
FROM ubuntu:22.04

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    nodejs \
    npm \
    git

# Installer les packages Python couramment utilisés
RUN pip3 install pytest numpy pandas matplotlib

# Définir le répertoire de travail
WORKDIR /workspace
```

2. Construisez l'image :
```bash
docker build -t devai-custom .
```

3. Configurez DevAI pour utiliser cette image :
```json
{
  "devai.sandbox.image": "devai-custom"
}
```

## Personnalisation de l'interface

### Thèmes personnalisés

DevAI s'adapte automatiquement au thème de VS Code, mais vous pouvez forcer un thème spécifique :

```json
{
  "devai.ui.theme": "dark"  // ou "light" ou "system"
}
```

### Raccourcis clavier personnalisés

Vous pouvez personnaliser les raccourcis clavier dans les paramètres de VS Code :

1. Ouvrez les raccourcis clavier (Ctrl+K Ctrl+S)
2. Recherchez "DevAI"
3. Modifiez les raccourcis selon vos préférences

## Utilisation multilingue

### Changement de langue

Pour changer la langue de l'interface :

```json
{
  "devai.ui.language": "fr"  // ou "en", "es", "de"
}
```

### Communication multilingue

DevAI comprend et répond dans la langue que vous utilisez pour communiquer. Vous pouvez :

- Poser des questions en français et recevoir des réponses en français
- Demander explicitement une réponse dans une autre langue : "Explique ce code et réponds en anglais"
- Générer de la documentation dans plusieurs langues : "Génère la documentation en français et en anglais"

## Optimisation des performances

### Réduction de la latence

Pour améliorer les temps de réponse :

1. Utilisez des modèles plus légers pour les tâches simples
2. Pour Ollama, exécutez-le sur la même machine que VS Code
3. Limitez la taille du contexte dans vos requêtes

### Gestion de la mémoire

Si vous rencontrez des problèmes de mémoire avec Docker :

```json
{
  "devai.sandbox.defaultMemoryLimit": 512  // Réduire la limite de mémoire
}
```

## Résolution des problèmes courants

### Problèmes de connexion API

Si vous rencontrez des erreurs de connexion avec les API LLM :

1. Vérifiez votre clé API
2. Assurez-vous que votre connexion Internet est stable
3. Vérifiez les quotas et limites de votre compte API

### Problèmes de Docker

Si Docker ne fonctionne pas correctement :

1. Vérifiez que Docker est en cours d'exécution : `docker ps`
2. Vérifiez les permissions : assurez-vous que votre utilisateur est dans le groupe docker
3. Redémarrez le service Docker : `sudo systemctl restart docker`

### Problèmes de performance

Si l'extension est lente :

1. Utilisez un modèle plus léger
2. Réduisez la taille des requêtes
3. Fermez les autres extensions gourmandes en ressources
4. Augmentez la mémoire allouée à VS Code

---

Pour plus d'informations ou d'assistance, consultez notre [documentation technique](TECHNICAL.md) ou [contactez notre support](mailto:support@devai.com).
