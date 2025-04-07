# Guide de test de l'extension DevAI pour VS Code

Ce guide vous aidera à tester les fonctionnalités de l'extension DevAI après son installation pour vous assurer que tout fonctionne correctement.

## Préparation de l'environnement de test

Avant de commencer les tests, assurez-vous que :

1. L'extension DevAI est correctement installée (voir `INSTALLATION.md`)
2. Vous avez configuré les paramètres de l'extension (clé API, modèle, etc.)
3. Docker est en cours d'exécution (pour les tests de sandboxing)
4. Vous avez un projet ouvert dans VS Code pour tester les fonctionnalités contextuelles

## Scénarios de test

### Test 1 : Vérification de l'activation de l'extension

**Objectif** : Vérifier que l'extension s'active correctement.

**Étapes** :
1. Ouvrez VS Code
2. Ouvrez la palette de commandes (Ctrl+Shift+P ou Cmd+Shift+P sur macOS)
3. Tapez "DevAI: Démarrer l'assistant" et appuyez sur Entrée

**Résultat attendu** :
- Le panneau DevAI s'ouvre dans la barre d'activité
- L'interface de chat s'affiche correctement avec les styles CSS appliqués
- Aucune erreur n'apparaît dans la console de développement (Aide > Activer les outils de développement)

### Test 2 : Test de conversation simple

**Objectif** : Vérifier que l'assistant peut répondre à des questions simples.

**Étapes** :
1. Dans le panneau DevAI, tapez une question simple comme "Qu'est-ce que TypeScript ?"
2. Appuyez sur Entrée ou cliquez sur le bouton d'envoi

**Résultat attendu** :
- L'assistant traite la demande (indicateur de chargement visible)
- Une réponse pertinente sur TypeScript s'affiche
- Le formatage Markdown est correctement rendu (titres, listes, code, etc.)

### Test 3 : Test d'analyse de code

**Objectif** : Vérifier la fonctionnalité d'analyse de code.

**Étapes** :
1. Ouvrez un fichier de code dans VS Code (par exemple, un fichier JavaScript ou TypeScript)
2. Sélectionnez une portion de code
3. Clic droit sur la sélection et choisissez "DevAI: Analyser le code sélectionné"

**Résultat attendu** :
- Le panneau DevAI s'ouvre s'il n'est pas déjà ouvert
- Le code sélectionné est envoyé à l'assistant
- L'assistant fournit une analyse pertinente du code

### Test 4 : Test de génération de documentation

**Objectif** : Vérifier la fonctionnalité de génération de documentation.

**Étapes** :
1. Ouvrez un fichier de code contenant des fonctions ou classes
2. Cliquez sur l'icône DevAI dans la barre de titre de l'éditeur
3. Sélectionnez "Générer de la documentation"

**Résultat attendu** :
- L'assistant analyse le code du fichier
- Une documentation est générée (commentaires JSDoc, etc.)
- La documentation est correctement formatée et pertinente

### Test 5 : Test d'exécution de commandes dans le sandbox

**Objectif** : Vérifier que le sandboxing Docker fonctionne correctement.

**Étapes** :
1. Dans le panneau DevAI, demandez à l'assistant d'exécuter une commande simple comme "Peux-tu me montrer le contenu du répertoire courant ?"
2. Confirmez l'exécution de la commande si une confirmation est demandée

**Résultat attendu** :
- L'assistant demande confirmation avant d'exécuter la commande (selon vos paramètres)
- La commande est exécutée dans un environnement Docker isolé
- Le résultat de la commande est affiché dans la conversation

### Test 6 : Test de manipulation de fichiers

**Objectif** : Vérifier que l'assistant peut manipuler des fichiers dans le workspace.

**Étapes** :
1. Demandez à l'assistant de créer un nouveau fichier, par exemple : "Crée un fichier hello.js qui affiche 'Hello World' dans la console"
2. Confirmez l'action si une confirmation est demandée

**Résultat attendu** :
- L'assistant demande confirmation avant de créer le fichier (selon vos paramètres)
- Le fichier est créé avec le contenu approprié
- L'assistant confirme la création du fichier

### Test 7 : Test de support multilingue

**Objectif** : Vérifier que l'assistant fonctionne dans différentes langues.

**Étapes** :
1. Changez la langue de l'interface dans les paramètres (devai.ui.language)
2. Redémarrez l'extension
3. Posez une question dans la langue sélectionnée

**Résultat attendu** :
- L'interface utilisateur s'affiche dans la langue sélectionnée
- L'assistant répond dans la même langue

### Test 8 : Test des raccourcis clavier

**Objectif** : Vérifier que les raccourcis clavier fonctionnent correctement.

**Étapes** :
1. Utilisez le raccourci Ctrl+Shift+A (ou Cmd+Shift+A sur macOS) pour ouvrir le panneau DevAI
2. Sélectionnez du code et utilisez Ctrl+Shift+1 (ou Cmd+Shift+1 sur macOS) pour l'analyser

**Résultat attendu** :
- Les raccourcis déclenchent les actions correspondantes
- Les fonctionnalités s'exécutent correctement

## Vérification des fonctionnalités avancées

### Test 9 : Test de la mémoire conversationnelle

**Objectif** : Vérifier que l'assistant se souvient du contexte de la conversation.

**Étapes** :
1. Engagez une conversation avec plusieurs échanges sur un sujet spécifique
2. Faites référence à des informations mentionnées précédemment

**Résultat attendu** :
- L'assistant se souvient du contexte et répond de manière cohérente
- Les références aux informations précédentes sont comprises

### Test 10 : Test de l'historique des conversations

**Objectif** : Vérifier que l'historique des conversations est sauvegardé.

**Étapes** :
1. Fermez VS Code après avoir eu une conversation avec l'assistant
2. Rouvrez VS Code et le panneau DevAI
3. Vérifiez si l'historique des conversations précédentes est accessible

**Résultat attendu** :
- Les conversations précédentes sont accessibles dans l'historique
- Vous pouvez reprendre une conversation précédente

## Rapport de bugs

Si vous rencontrez des problèmes lors des tests, veuillez les signaler en incluant :

1. Une description détaillée du problème
2. Les étapes pour reproduire le problème
3. Le comportement attendu vs. le comportement observé
4. Les journaux d'erreur (disponibles dans la console de développement)
5. Votre environnement (OS, version de VS Code, configuration)

## Conclusion

Ce guide de test vous a permis de vérifier les principales fonctionnalités de l'extension DevAI. Si tous les tests sont réussis, l'extension est correctement installée et configurée. Vous pouvez maintenant commencer à utiliser DevAI pour améliorer votre productivité de développement !
