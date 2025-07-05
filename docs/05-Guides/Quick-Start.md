# Guide de Démarrage Rapide - TrainPing

## 🎯 Pour les pressés !

Si vous connaissez déjà le développement web et voulez juste faire tourner le projet rapidement :

### ⚡ Installation Express (5 minutes)

```bash
# 1. Cloner et entrer dans le projet
git clone [URL_DU_REPO]
cd tennis-table-app

# 2. Backend - Installation et démarrage
cd server
npm install
npx prisma db push
npm run db:seed
npm run dev &

# 3. Frontend - Installation et démarrage  
cd ../client
npm install
npm run dev
```

**C'est tout !** Ouvrez http://localhost:5173

### 📋 Commandes Essentielles

#### Développement quotidien
```bash
# Démarrer backend (terminal 1)
cd server && npm run dev

# Démarrer frontend (terminal 2)  
cd client && npm run dev

# Build pour production
cd client && npm run build
```

#### Base de données
```bash
cd server

# Voir la DB dans le navigateur
npx prisma studio

# Reset complet de la DB
npx prisma db push --force-reset
npm run db:seed

# Migrations
npx prisma db push
```

#### Debugging
```bash
# Logs backend détaillés
cd server && DEBUG=* npm run dev

# Vérifier santé de l'API
curl http://localhost:3000/health

# Build et test frontend
cd client && npm run build && npm run preview
```

## 🏗️ Structure du Projet

```
tennis-table-app/
├── client/              # Frontend Vue.js
│   ├── src/
│   │   ├── views/       # Pages principales
│   │   ├── components/  # Composants réutilisables
│   │   └── stores/      # État global (Pinia)
│   └── package.json
├── server/              # Backend Express
│   ├── src/
│   │   ├── controllers/ # Logique métier
│   │   ├── routes/      # Routes API
│   │   └── middleware/  # Middlewares
│   ├── prisma/          # Schéma et migrations DB
│   └── package.json
└── docs/               # Documentation
```

## 🎨 Stack Technique

| Composant | Technologie | Port |
|-----------|-------------|------|
| **Frontend** | Vue 3 + Vite + Tailwind CSS | 5173 |
| **Backend** | Node.js + Express + Prisma | 3000 |
| **Base de données** | SQLite (dev) | - |
| **État global** | Pinia | - |
| **Canvas** | Konva.js (ancien), SVG (nouveau) | - |

## 🚀 Fonctionnalités Principales

### ✅ Implémenté
- ✅ **Création d'exercices par type** (nouvelle approche simplifiée)
- ✅ **Patterns de régularité** avec aperçu visuel
- ✅ **Gestion des sessions** d'entraînement
- ✅ **API REST complète** avec validation
- ✅ **Interface moderne** responsive

### 🔄 Types d'exercices disponibles
1. **Régularité** ✅ - Schémas répétitifs avec 4 patterns
2. **Régularité + Jeu libre** 🚧 - En développement
3. **Incertitude** 🚧 - En développement
4. **Situation de match** 🚧 - En développement

## 🛠️ Développement

### Workflow recommandé

1. **Backend d'abord** : Modifiez les models, routes, controllers
2. **Test API** : Utilisez Prisma Studio ou curl
3. **Frontend ensuite** : Créez/modifiez les composants Vue
4. **Test intégration** : Vérifiez le fonctionnement complet

### Modifications courantes

#### Ajouter un nouveau champ à un exercice
```bash
# 1. Modifier le schéma Prisma
nano server/prisma/schema.prisma

# 2. Appliquer les changements
cd server && npx prisma db push

# 3. Modifier le controller
nano server/src/controllers/exerciseController.js

# 4. Modifier l'interface Vue
nano client/src/components/exercises/RegularityForm.vue
```

#### Créer un nouveau type d'exercice
```bash
# 1. Créer le composant formulaire
nano client/src/components/exercises/MonNouveauTypeForm.vue

# 2. Créer l'aperçu visuel
nano client/src/components/exercises/MonNouveauTypePreview.vue

# 3. Ajouter à la page principale
nano client/src/views/ExerciseEditorView.vue
```

### Variables d'environnement

#### server/.env
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
LOG_LEVEL=debug
```

#### client/.env (optionnel)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_DEBUG=true
```

## 🐛 Problèmes Courants

### "Port already in use"
```bash
# Trouver le processus
lsof -i :3000  # ou :5173
kill -9 [PID]

# Ou changer de port
PORT=3001 npm run dev
```

### "Module not found"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Base de données corrompue
```bash
cd server
rm -f prisma/dev.db
npx prisma db push
npm run db:seed
```

### Build frontend échoue
```bash
cd client
rm -rf node_modules dist
npm install
npm run build
```

## 📱 URLs Utiles

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000/api
- **Health check** : http://localhost:3000/health
- **Prisma Studio** : http://localhost:5555 (après `npx prisma studio`)

## 🎯 Prochaines Étapes

1. **Explorer le code** : Commencez par `client/src/views/ExerciseEditorView.vue`
2. **Tester la création d'exercice** : Type "Régularité" → Pattern "Diagonal"
3. **Lire la doc** : [Guide complet des fonctionnalités](../04-Features/Exercise-Creation-By-Type.md)
4. **Modifier quelque chose** : Changez une couleur pour vous familiariser
5. **Contribuer** : Implémentez un nouveau type d'exercice !

## 📚 Documentation Complète

- 📖 **[Installation détaillée](./Installation.md)** - Guide pas-à-pas
- 🏗️ **[Architecture](../01-Architecture/Vue-Ensemble.md)** - Vue d'ensemble technique
- 🎨 **[Frontend Vue.js](../03-Frontend/Vue-Ecosystem-Deep-Dive.md)** - Guide complet Vue
- ⚙️ **[Backend Express](../02-Backend/Express-Deep-Dive.md)** - Guide complet API
- ✨ **[Nouvelles fonctionnalités](../04-Features/Exercise-Creation-By-Type.md)** - Système par types

---

**Bon développement !** 🚀

#quickstart #development #vue #express #nodejs #tennis-table