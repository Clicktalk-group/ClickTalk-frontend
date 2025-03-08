# ClickTalk - Frontend

![ClickTalk Logo](./src/assets/logo.png)

> Une application React de chat IA enrichie d'outils collaboratifs adaptée aux équipes techniques.

## 🚀 Fonctionnalités

- 💬 **Chat IA**: Conversations dynamiques avec rendu Markdown
- 🔐 **Authentification**: Système complet (Connexion, Inscription, Déconnexion)
- 🌓 **Thème sombre/clair**: Interface personnalisable selon vos préférences
- 📱 **Responsive**: Utilisation optimale sur tous vos appareils
- 📂 **Projets**: Organisation structurée de vos conversations (en cours)

## 🛠️ Stack Technique

- **Frontend**: React, TypeScript, SASS
- **Gestion d'état**: Context API
- **Routing**: React Router v6
- **Authentification**: JWT
- **Styles**: SCSS Modules + Variables
- **Tests**: Jest + React Testing Library

## 🏁 Démarrage rapide

1. **Cloner le projet**
   ```bash
   git clone https://github.com/your-username/clicktalk-frontend.git
   cd clicktalk-frontend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm start
   # ou
   yarn start
   ```

4. **Ouvrir le navigateur**
   L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📁 Structure du projet

```
src/
├── assets/           # Images, logos, etc.
├── components/       # Composants réutilisables
│   ├── common/       # Composants de base (Button, Input, etc.)
│   ├── layouts/      # Composants de mise en page
│   └── ... 
├── contexts/         # Contextes React pour la gestion d'état
│   ├── auth/         # Contexte d'authentification 
│   └── ... 
├── hooks/            # Hooks personnalisés
├── pages/            # Composants de page
├── services/         # Services pour l'API, etc.
├── styles/           # Styles globaux, variables, mixins
├── types/            # Types TypeScript
└── utils/            # Fonctions utilitaires
```

## 🧩 Composants principaux

### 🏠 Layout

- **MainLayout**: Structure principale avec Header, Sidebar et zone de contenu
- **Sidebar**: Navigation et gestion des conversations/projets

### 💬 Chat

- **ChatContainer**: Gestion des conversations et messages
- **MessageBubble**: Affichage des messages avec support Markdown
- **ChatInput**: Saisie et envoi de messages

### 🔐 Auth

- **Login/Register**: Formulaires d'authentification
- **AuthContext**: Gestion des états d'authentification et tokens

## 🎨 Système de design

ClickTalk utilise un système de design cohérent avec:

- **Variables SCSS**: Couleurs, espaces, tailles de police
- **Thèmes**: Support intégré des thèmes clair/sombre
- **Composants de base**: Boutons, entrées, cartes stylisés uniformément
- **Responsive**: Mixins pour une adaptation fluide à différents appareils

## 📝 API

L'application communique avec une API REST sur:
```
BASE_URL = 'https://api.clicktalk.com/v1'
```

Points d'accès principaux:
- `/auth`: Authentification
- `/conversation`: Gestion des conversations
- `/messages`: Envoi/réception de messages
- `/project`: Gestion des projets

## 🧪 Tests

Lancer les tests:
```bash
npm test
# ou
yarn test
```

## 🔧 Scripts disponibles

- `npm start`: Lancer le serveur de développement
- `npm build`: Créer une version de production
- `npm test`: Exécuter les tests
- `npm lint`: Vérifier le code avec ESLint
- `npm format`: Formater le code avec Prettier

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/fonctionnalite-incroyable`)
3. Committez vos changements (`git commit -m 'feat: ajout d'une fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/fonctionnalite-incroyable`)
5. Ouvrez une Pull Request

## 📝 License

MIT © [ClickTalk Team]

---

<p align="center">Made with ☕ and ❤️ by the ClickTalk Team</p>