# Tennis Table Training App

Application web de gestion d'entraînements pour le tennis de table.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ ([télécharger ici](https://nodejs.org))
- Git (optionnel, pour cloner le repo)
- npm (inclus avec Node.js)

### Installation rapide

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd tennis-table-app
```

2. **Installer les dépendances backend**
```bash
cd server
npm install
```

3. **Configurer la base de données SQLite**
```bash
npx prisma db push
npm run db:seed
```

4. **Installer les dépendances frontend**
```bash
cd ../client
npm install
```

5. **Démarrer l'application (2 terminaux)**

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```

L'application sera accessible à :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000

👉 **[Guide d'installation détaillé](./docs/05-Guides/Installation.md)** avec résolution de problèmes

## 📋 Fonctionnalités

- ✅ Création d'exercices avec éditeur visuel
- ✅ Gestion des sessions d'entraînement
- ✅ Mode entraînement avec timer
- ✅ API REST complète
- ✅ Base de données PostgreSQL avec Prisma
- 🚧 Frontend Vue.js (en cours)

## 🛠 Stack technique

- **Backend**: Node.js, Express, Prisma
- **Frontend**: Vue 3, Vite, Tailwind CSS, Konva.js
- **Base de données**: PostgreSQL
- **State Management**: Pinia

## 📁 Structure du projet

```
tennis-table-app/
├── client/          # Frontend Vue.js
├── server/          # Backend Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   └── prisma/
└── docker-compose.yml
```

## 🔧 Commandes utiles

### Backend
```bash
cd server
npm run dev          # Démarrer en mode développement
npm run db:studio    # Ouvrir Prisma Studio
npm run db:push      # Appliquer le schéma
npm run db:seed      # Peupler la base de données
```

### Frontend
```bash
cd client
npm run dev          # Démarrer en mode développement
npm run build        # Build pour production
```

## 📚 API Endpoints

- `GET /api/exercises` - Liste des exercices
- `POST /api/exercises` - Créer un exercice
- `GET /api/sessions` - Liste des sessions
- `POST /api/sessions` - Créer une session
- `POST /api/training/start/:sessionId` - Démarrer un entraînement
- `GET /api/stats` - Statistiques générales

## 🎯 Prochaines étapes

1. Terminer l'interface Vue.js
2. Implémenter l'éditeur visuel avec Konva.js
3. Ajouter l'authentification
4. Déploiement en production