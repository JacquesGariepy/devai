# Guide de contribution à DevAI

Merci de votre intérêt pour contribuer à DevAI ! Ce guide vous aidera à comprendre comment participer au développement de l'extension.

## Table des matières

1. [Code de conduite](#code-de-conduite)
2. [Comment commencer](#comment-commencer)
3. [Structure du projet](#structure-du-projet)
4. [Processus de développement](#processus-de-développement)
5. [Soumettre des modifications](#soumettre-des-modifications)
6. [Standards de code](#standards-de-code)
7. [Tests](#tests)
8. [Documentation](#documentation)
9. [Gestion des versions](#gestion-des-versions)

## Code de conduite

Ce projet et tous ses participants sont régis par notre [Code de conduite](CODE_OF_CONDUCT.md). En participant, vous êtes censé respecter ce code.

## Comment commencer

### Prérequis

- Node.js (v16 ou supérieur)
- npm (v8 ou supérieur)
- VS Code (v1.80.0 ou supérieur)
- Docker (pour le développement du sandboxing)

### Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/devai/vscode-extension.git
   cd vscode-extension
   ```

2. Installez les dépendances :
   ```bash
   # Installer les dépendances du Core Agent
   cd core-agent
   npm install
   cd ..

   # Installer les dépendances de l'extension VS Code
   cd vscode-extension
   npm install
   ```

3. Ouvrez le projet dans VS Code :
   ```bash
   code .
   ```

4. Compilez le projet :
   ```bash
   # Compiler le Core Agent
   cd core-agent
   npm run compile
   cd ..

   # Compiler l'extension VS Code
   cd vscode-extension
   npm run compile
   ```

5. Lancez l'extension en mode développement :
   - Appuyez sur F5 dans VS Code
   - Ou exécutez la tâche "Launch Extension" dans le menu "Run and Debug"

## Structure du projet

Le projet est divisé en deux parties principales :

### Core Agent

```
core-agent/
├── src/
│   ├── agent/       # Logique de l'agent
│   ├── llm/         # Interface avec les modèles LLM
│   ├── tools/       # Outils disponibles pour l'agent
│   ├── memory/      # Système de mémoire
│   ├── sandbox/     # Sandboxing Docker
│   └── i18n/        # Internationalisation
├── tests/           # Tests unitaires et d'intégration
└── package.json     # Configuration du package
```

### Extension VS Code

```
vscode-extension/
├── src/
│   ├── extension.ts           # Point d'entrée de l'extension
│   ├── services/              # Services pour l'extension
│   ├── webview/               # Interface utilisateur React
│   ├── integration/           # Intégration avec le Core Agent
│   ├── vscode/                # Intégration avec VS Code
│   └── security/              # Système de sécurité
├── resources/                 # Ressources statiques
├── docs/                      # Documentation
├── tests/                     # Tests unitaires, d'intégration et E2E
└── package.json               # Configuration de l'extension
```

## Processus de développement

### Branches

- `main` : Branche principale, contient le code stable
- `develop` : Branche de développement, contient les fonctionnalités en cours
- `feature/xxx` : Branches de fonctionnalités
- `bugfix/xxx` : Branches de correction de bugs
- `release/x.y.z` : Branches de préparation de release

### Workflow

1. Créez une branche à partir de `develop` pour votre fonctionnalité ou correction
2. Développez et testez votre code
3. Soumettez une Pull Request vers `develop`
4. Après revue et approbation, votre code sera fusionné

## Soumettre des modifications

### Pull Requests

1. Assurez-vous que votre code respecte les standards de code
2. Assurez-vous que tous les tests passent
3. Mettez à jour la documentation si nécessaire
4. Créez une Pull Request avec une description claire de vos modifications
5. Référencez les issues concernées dans votre PR

### Issues

- Utilisez les templates d'issues pour signaler des bugs ou proposer des fonctionnalités
- Soyez précis et fournissez autant d'informations que possible
- Pour les bugs, incluez les étapes pour reproduire, le comportement attendu et le comportement observé

## Standards de code

### Style de code

- Utilisez TypeScript pour tout le code
- Suivez les règles ESLint configurées dans le projet
- Utilisez des noms de variables et de fonctions descriptifs
- Commentez votre code lorsque nécessaire

### Conventions de nommage

- Utilisez le camelCase pour les variables et fonctions
- Utilisez le PascalCase pour les classes et interfaces
- Utilisez le UPPER_CASE pour les constantes
- Préfixez les interfaces avec `I` (ex: `IConfig`)
- Préfixez les types avec `T` (ex: `TResponse`)

## Tests

### Types de tests

- **Tests unitaires** : Testent des composants individuels
- **Tests d'intégration** : Testent l'interaction entre composants
- **Tests E2E** : Testent l'extension complète dans VS Code

### Exécution des tests

```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

### Couverture de code

- Visez une couverture de code d'au moins 80%
- Tous les composants critiques doivent avoir une couverture de 100%

## Documentation

### Types de documentation

- **README.md** : Documentation principale du projet
- **ADVANCED_USAGE.md** : Guide d'utilisation avancé
- **TECHNICAL.md** : Documentation technique
- **CONTRIBUTING.md** : Guide de contribution (ce document)
- **JSDoc** : Documentation du code

### Standards de documentation

- Utilisez Markdown pour toute la documentation
- Documentez toutes les fonctions et classes publiques avec JSDoc
- Mettez à jour la documentation lorsque vous modifiez le code

## Gestion des versions

Nous suivons [Semantic Versioning](https://semver.org/) :

- **MAJOR** : Changements incompatibles avec les versions précédentes
- **MINOR** : Ajout de fonctionnalités rétrocompatibles
- **PATCH** : Corrections de bugs rétrocompatibles

### Processus de release

1. Créez une branche `release/x.y.z` à partir de `develop`
2. Mettez à jour la version dans `package.json`
3. Mettez à jour le `CHANGELOG.md`
4. Soumettez une PR vers `main`
5. Après fusion, créez un tag pour la version
6. Fusionnez `main` vers `develop`

---

Merci de contribuer à DevAI ! Si vous avez des questions, n'hésitez pas à ouvrir une issue ou à contacter l'équipe de développement.
