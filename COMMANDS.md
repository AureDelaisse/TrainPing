# Référence Rapide des Commandes - TrainPing

## 🚀 Démarrage Quotidien

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

**URLs** : Frontend → http://localhost:5173 | API → http://localhost:3000

## 📦 Installation (première fois)

```bash
# 1. Cloner et entrer
git clone [URL] && cd tennis-table-app

# 2. Backend
cd server && npm install && npx prisma db push && npm run db:seed

# 3. Frontend
cd ../client && npm install
```

## 🗄️ Base de Données

```bash
cd server

# Voir la DB (interface web)
npx prisma studio

# Reset complet
npx prisma db push --force-reset && npm run db:seed

# Juste re-peupler
npm run db:seed
```

## 🔧 Développement

```bash
# Build frontend
cd client && npm run build

# Vérifier santé API
curl http://localhost:3000/health

# Logs détaillés backend
cd server && DEBUG=* npm run dev

# Test build frontend
cd client && npm run build && npm run preview
```

## 🐛 Dépannage

```bash
# Port occupé → tuer processus
lsof -i :3000 && kill -9 [PID]

# Modules corrompus → réinstaller
rm -rf node_modules package-lock.json && npm install

# DB corrompue → reset
cd server && rm -f prisma/dev.db && npx prisma db push && npm run db:seed
```

## 📂 Structure

```
tennis-table-app/
├── client/              # Vue.js frontend (port 5173)
├── server/              # Express backend (port 3000)  
├── docs/                # Documentation
└── README.md           # Guide d'installation
```

## 🎯 Liens Utiles

- **[Installation complète](./docs/05-Guides/Installation.md)** - Guide détaillé
- **[Démarrage rapide](./docs/05-Guides/Quick-Start.md)** - Pour développeurs
- **[Nouvelles fonctionnalités](./docs/04-Features/Exercise-Creation-By-Type.md)** - Système par types
- **[Documentation complète](./docs/)** - Toute la doc

**Bookmark cette page !** 📌