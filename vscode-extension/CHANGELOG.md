# Changelog

Tous les changements notables apportés à l'extension DevAI seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-04-06

### Ajouté
- Interface conversationnelle complète avec support Markdown et coloration syntaxique
- Système ReAct avancé avec Langchain.js pour le raisonnement et l'action
- Support multi-providers LLM (OpenAI, Anthropic, Ollama)
- Registre d'outils complet (fichiers, terminal, analyse de code)
- Système de mémoire avancé avec base de connaissances vectorielle
- Sandboxing Docker pour l'exécution sécurisée des commandes
- Support multilingue (français, anglais, espagnol, allemand)
- Interface utilisateur riche avec React et TailwindCSS
- Système de sécurité avancé avec confirmations utilisateur
- Respect du Workspace Trust de VS Code
- Suite complète de tests (unitaires, intégration, end-to-end)

### Sécurité
- Implémentation du sandboxing Docker obligatoire
- Système de confirmation utilisateur pour les actions sensibles
- Respect du Workspace Trust de VS Code
- Isolation des exécutions de commandes
- Conformité RGPD/GDPR pour la confidentialité des données
