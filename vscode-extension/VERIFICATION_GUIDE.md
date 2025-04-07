# Guide de vérification des corrections de l'extension DevAI

Ce guide vous aidera à vérifier que les corrections apportées à l'extension DevAI fonctionnent correctement, en particulier les commandes qui ne fonctionnaient pas auparavant.

## Problèmes corrigés

1. **Incohérence des identifiants de commandes** : Les commandes définies dans `package.json` ne correspondaient pas à celles enregistrées dans le code, ce qui rendait les commandes inutilisables.

2. **Commandes manquantes** : Les commandes `devai.start` et `devai.openPanel` étaient définies dans `package.json` mais n'étaient pas enregistrées dans le code.

## Comment vérifier les corrections

### Préparation

1. Désinstallez toute version précédente de l'extension DevAI :
   - Ouvrez VS Code
   - Accédez à l'onglet Extensions (Ctrl+Shift+X)
   - Trouvez l'extension DevAI
   - Cliquez sur l'icône d'engrenage et sélectionnez "Désinstaller"
   - Redémarrez VS Code

2. Installez la nouvelle version corrigée :
   - Ouvrez VS Code
   - Accédez à l'onglet Extensions (Ctrl+Shift+X)
   - Cliquez sur les trois points (...) en haut du panneau Extensions
   - Sélectionnez "Installer à partir d'un VSIX..."
   - Naviguez jusqu'au fichier `devai-vscode-extension-1.0.0.vsix` corrigé et sélectionnez-le
   - Redémarrez VS Code

### Test 1 : Vérification de la commande "Démarrer l'assistant"

1. Ouvrez VS Code
2. Ouvrez la palette de commandes (Ctrl+Shift+P ou Cmd+Shift+P sur macOS)
3. Tapez "DevAI: Démarrer l'assistant" et appuyez sur Entrée
4. Vérifiez que :
   - La commande est reconnue (apparaît dans la liste)
   - L'interface de l'assistant s'ouvre correctement

### Test 2 : Vérification du raccourci clavier

1. Appuyez sur Ctrl+Shift+A (ou Cmd+Shift+A sur macOS)
2. Vérifiez que l'interface de l'assistant s'ouvre correctement

### Test 3 : Vérification des commandes d'analyse de code

1. Ouvrez un fichier de code dans VS Code
2. Sélectionnez une portion de code
3. Clic droit sur la sélection et vérifiez que les options suivantes sont disponibles et fonctionnent :
   - "DevAI: Analyser le code sélectionné"
   - "DevAI: Expliquer le code sélectionné"
   - "DevAI: Optimiser le code sélectionné"

### Test 4 : Vérification des raccourcis d'analyse de code

1. Sélectionnez une portion de code
2. Essayez les raccourcis suivants :
   - Ctrl+Shift+1 (ou Cmd+Shift+1 sur macOS) pour analyser le code
   - Ctrl+Shift+2 (ou Cmd+Shift+2 sur macOS) pour expliquer le code
   - Ctrl+Shift+3 (ou Cmd+Shift+3 sur macOS) pour optimiser le code

### Test 5 : Vérification des commandes de la barre de titre

1. Ouvrez un fichier de code
2. Vérifiez que les commandes suivantes sont disponibles dans la barre de titre et fonctionnent :
   - "DevAI: Corriger les bugs dans le fichier actuel"
   - "DevAI: Générer des tests unitaires"
   - "DevAI: Générer de la documentation"

## Que faire si les problèmes persistent

Si certaines commandes ne fonctionnent toujours pas après l'installation de la version corrigée, veuillez fournir les informations suivantes :

1. Le message d'erreur exact que vous recevez
2. La commande ou le raccourci que vous avez essayé d'utiliser
3. Les étapes précises pour reproduire le problème
4. Le contenu de la console de développement de VS Code (Aide > Activer les outils de développement)

## Notes techniques sur les corrections

Les corrections apportées concernent principalement le fichier `commandManager.ts` où les commandes sont enregistrées. Nous avons :

1. Ajouté l'enregistrement des commandes `devai.start` et `devai.openPanel` qui étaient définies dans `package.json` mais manquantes dans le code
2. Conservé la commande `devai.openChatView` comme alias pour la compatibilité interne
3. Corrigé la commande `devai.documentCode` pour qu'elle corresponde à `devai.generateDocumentation` définie dans `package.json`

Ces modifications permettent à toutes les commandes définies dans `package.json` d'être correctement reconnues et exécutées par VS Code.
