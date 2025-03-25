# ClickTalk - Frontend

![ClickTalk Logo](./src/assets/logo.png)

> Une application React de chat IA enrichie d'outils collaboratifs adaptée aux équipes techniques.

## 🚀 Fonctionnalités

- 💬 **Chat IA**: Conversations dynamiques avec rendu Markdown et streaming en direct
- 🔐 **Authentification**: Système complet sécurisé avec vérification des tokens
- 🌓 **Thème sombre/clair**: Interface entièrement personnalisable
- 📱 **Responsive**: Expérience optimisée sur tous vos appareils
- 📂 **Projets**: Gestion complète avec instructions personnalisées
- ⚡ **Performance**: Optimisations avancées pour une expérience fluide

## 🛠️ Stack Technique

- **Frontend**: React, TypeScript, SASS
- **Gestion d'état**: Context API
- **Routing**: React Router v6
- **Authentification**: JWT avec vérification d'expiration
- **Styles**: SCSS Modules + Variables
- **Formatage**: React-Markdown
- **Optimisation**: Code splitting, mémoïsation, virtualisation
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
│   ├── chat/         # Composants liés au chat
│   ├── project/      # Composants de gestion de projets
│   └── ... 
├── contexts/         # Contextes React pour la gestion d'état
│   ├── auth/         # Contexte d'authentification 
│   ├── theme/        # Gestion du thème
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
- **Sidebar**: Navigation avancée avec gestion des conversations/projets
- **Header**: Navigation, menu utilisateur et réglages rapides

### 💬 Chat

- **ChatContainer**: Gestion des conversations et messages avec streaming
- **MessageBubble**: Affichage des messages avec support Markdown et copie
- **ChatInput**: Saisie et envoi de messages avec validation
- **InstructionsPreview**: Affichage des instructions personnalisées par projet

### 🔐 Auth

- **Login/Register**: Formulaires d'authentification avec validation
- **AuthContext**: Gestion des états d'authentification et vérification des tokens
- **ProtectedRoute**: Sécurisation des routes avec redirection intelligente

### ⚙️ Settings & Préférences

- **Settings**: Gestion des préférences utilisateur
- **ThemeToggle**: Basculement entre thèmes clair/sombre
- **AccountSettings**: Gestion du compte (déconnexion, suppression)

### 📂 Projets

- **ProjectList**: Affichage et gestion des projets
- **ProjectForm**: Création et modification de projets
- **ProjectInstructions**: Édition des instructions spécifiques au projet

## 🎨 Système de design

ClickTalk utilise un système de design cohérent avec:

- **Variables SCSS**: Couleurs, espaces, tailles de police
- **Thèmes**: Support intégré des thèmes clair/sombre avec persistance
- **Composants de base**: Boutons, entrées, cartes stylisés uniformément
- **Responsive**: Mixins pour une adaptation fluide à différents appareils
- **Animations**: Transitions et animations optimisées pour l'UX

## 📝 API

L'application communique avec une API REST sur:
```
BASE_URL = 'https://api.clicktalk.com/v1'
```

Points d'accès principaux:
- `/auth`: Authentification (login, register, verify)
- `/conversation`: Gestion des conversations
- `/messages`: Envoi/réception de messages (streaming support)
- `/project`: Gestion des projets avec instructions personnalisées
- `/user`: Gestion utilisateur et préférences

## 🚀 Optimisations de performance

- **Code Splitting**: Chargement à la demande des composants
- **Mémoïsation**: Utilisation de React.memo, useCallback et useMemo
- **Virtualisation**: Gestion efficace des listes longues
- **Service Worker**: Support offline et chargement accéléré
- **Optimisation d'images**: Utilisation du format WebP (-30% taille)

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

## 👥 Contributeurs

- CND - Web Is Yours

## 📝 License

MIT © [ClickTalk Team]

---

<p align="center">Made with ☕ and ❤️ by the ClickTalk Team</p>