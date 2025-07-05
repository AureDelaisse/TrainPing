# Guide d'installation

## 🎯 Prérequis

### Connaissances recommandées
- Bases du terminal/ligne de commande
- Notions de Git (optionnel mais recommandé)
- Aucune expérience en programmation requise !

### Outils à installer

#### 1. Node.js (obligatoire)
Node.js est l'environnement qui fait tourner le serveur backend.

**Windows :**
1. Aller sur [nodejs.org](https://nodejs.org)
2. Télécharger la version **LTS** (recommandée)
3. Lancer l'installateur et suivre les étapes
4. Redémarrer l'ordinateur

**macOS :**
```bash
# Avec Homebrew (recommandé)
brew install node

# Ou télécharger depuis nodejs.org
```

**Linux (Ubuntu/Debian) :**
```bash
# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

#### 2. Git (optionnel)
Pour cloner le projet et gérer les versions.

**Windows :** [git-scm.com](https://git-scm.com/download/win)  
**macOS :** `brew install git`  
**Linux :** `sudo apt install git`

#### 3. Éditeur de code (recommandé)
- **VS Code** : [code.visualstudio.com](https://code.visualstudio.com)
- **WebStorm** : [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm)

## 📥 Installation du projet

### Checklist complète

- [ ] **Cloner le repository**
- [ ] **Installer les dépendances backend**
- [ ] **Configurer la base de données**
- [ ] **Installer les dépendances frontend**
- [ ] **Tester le démarrage**

### Étape 1 : Récupérer le code

#### Option A : Avec Git (recommandé)
```bash
# Cloner le repository
git clone https://github.com/votre-username/tennis-table-app.git

# Aller dans le dossier
cd tennis-table-app

# Vérifier la structure
ls -la
```

#### Option B : Téléchargement ZIP
1. Télécharger le ZIP depuis GitHub
2. Extraire dans un dossier de votre choix
3. Ouvrir un terminal dans ce dossier

### Étape 2 : Configuration backend

```bash
# Aller dans le dossier serveur
cd server

# Installer les dépendances
npm install

# Cela peut prendre quelques minutes...
# Vous devriez voir quelque chose comme :
# ✓ Dependencies installed successfully
```

#### Créer le fichier de configuration
```bash
# Créer le fichier .env
touch .env

# Ou sur Windows
echo. > .env
```

Éditer le fichier `.env` avec ces valeurs :
```bash
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL="file:./dev.db"

# Future auth (optionnel)
JWT_SECRET="votre-secret-super-secret"
```

#### Initialiser la base de données
```bash
# Créer la base de données
npx prisma db push

# Remplir avec des données de test
npx prisma db seed

# Vous devriez voir :
# ✓ Database initialized
# ✓ Seed data inserted
```

#### Tester le backend
```bash
# Démarrer le serveur de développement
npm run dev

# Vous devriez voir :
# 🚀 Serveur démarré sur http://localhost:3000
# 📊 Health check: http://localhost:3000/health
```

**Test rapide :** Ouvrir [http://localhost:3000/health](http://localhost:3000/health) dans votre navigateur. Vous devriez voir :
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 5.123
}
```

### Étape 3 : Configuration frontend

**Dans un nouveau terminal** (garder le serveur backend qui tourne) :

```bash
# Aller dans le dossier client (depuis la racine du projet)
cd client

# Installer les dépendances
npm install

# Cela prend généralement 2-3 minutes
```

#### Tester le frontend
```bash
# Démarrer l'application Vue.js
npm run dev

# Vous devriez voir :
# VITE v5.0.0  ready in 500 ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**Test complet :** Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur. Vous devriez voir l'application TrainPing !

## 🏃‍♂️ Démarrage rapide quotidien

Une fois l'installation terminée, voici la routine pour démarrer l'application :

### Script automatique (recommandé)

Créer un fichier `start.sh` (Linux/macOS) ou `start.bat` (Windows) :

**start.sh :**
```bash
#!/bin/bash
echo "🚀 Démarrage de TrainPing..."

# Démarrer le backend en arrière-plan
cd server && npm run dev &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

# Démarrer le frontend
cd ../client && npm run dev

# Quand on arrête le frontend, arrêter aussi le backend
kill $BACKEND_PID
```

**start.bat :**
```batch
@echo off
echo 🚀 Démarrage de TrainPing...

start "Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "cd client && npm run dev"
```

### Démarrage manuel

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

## 🔧 Configuration avancée

### Variables d'environnement

#### Backend (.env)
```bash
# Développement
NODE_ENV=development
PORT=3000

# Base de données
DATABASE_URL="file:./dev.db"

# Logs
LOG_LEVEL=debug

# CORS (si frontend sur un autre port)
CORS_ORIGIN="http://localhost:5173"

# Future fonctionnalités
JWT_SECRET="changez-moi-en-production"
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=5242880  # 5MB
```

#### Frontend (.env)
```bash
# API Backend
VITE_API_URL=http://localhost:3000/api

# Environnement
VITE_ENV=development

# Debug
VITE_DEBUG=true

# Analytics (optionnel)
VITE_ANALYTICS_ID=""
```

### Extensions VS Code recommandées

Si vous utilisez VS Code, installer ces extensions :

```json
{
  "recommendations": [
    "vue.volar",              // Support Vue.js 3
    "bradlc.vscode-tailwindcss", // Autocomplete Tailwind
    "ms-vscode.vscode-json",     // Support JSON
    "esbenp.prettier-vscode",    // Formatage de code
    "ms-vscode.vscode-eslint",   // Linting JavaScript
    "prisma.prisma"              // Support Prisma
  ]
}
```

### Configuration Git

Si vous voulez contribuer au projet :

```bash
# Configuration globale Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Dans le projet
git remote add origin https://github.com/votre-username/tennis-table-app.git

# Créer une branche pour vos modifications
git checkout -b feature/ma-nouvelle-fonctionnalite
```

## 🐛 Résolution de problèmes

### Problèmes courants

#### ❌ "npm: command not found"
**Cause :** Node.js pas installé ou pas dans le PATH  
**Solution :**
1. Réinstaller Node.js depuis [nodejs.org](https://nodejs.org)
2. Redémarrer le terminal
3. Vérifier : `node --version`

#### ❌ "Error: Cannot find module"
**Cause :** Dépendances pas installées  
**Solution :**
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install
```

#### ❌ "Port 3000 already in use"
**Cause :** Un autre processus utilise le port  
**Solution :**
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 PID

# Ou changer de port
PORT=3001 npm run dev
```

#### ❌ "Database connection failed"
**Cause :** Base de données pas initialisée  
**Solution :**
```bash
cd server

# Réinitialiser la base
rm -f prisma/dev.db
npx prisma db push
npx prisma db seed
```

#### ❌ "CORS error" dans le navigateur
**Cause :** Frontend et backend sur ports différents  
**Solution :** Vérifier que le backend autorise le port du frontend dans la config CORS.

### Vérification de l'installation

Script de test complet :

```bash
#!/bin/bash

echo "🔍 Vérification de l'installation TrainPing..."

# Vérifier Node.js
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js non installé"
    exit 1
fi

# Vérifier npm
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm non installé"
    exit 1
fi

# Vérifier structure projet
if [ -d "server" ] && [ -d "client" ]; then
    echo "✅ Structure du projet OK"
else
    echo "❌ Structure du projet incorrecte"
    exit 1
fi

# Vérifier dépendances backend
if [ -f "server/package.json" ]; then
    echo "✅ Package.json backend trouvé"
    cd server
    if [ -d "node_modules" ]; then
        echo "✅ Dépendances backend installées"
    else
        echo "⚠️  Dépendances backend manquantes, installation..."
        npm install
    fi
    cd ..
fi

# Vérifier dépendances frontend
if [ -f "client/package.json" ]; then
    echo "✅ Package.json frontend trouvé"
    cd client
    if [ -d "node_modules" ]; then
        echo "✅ Dépendances frontend installées"
    else
        echo "⚠️  Dépendances frontend manquantes, installation..."
        npm install
    fi
    cd ..
fi

echo "🎉 Installation vérifiée avec succès !"
```

### Logs et debugging

#### Activer les logs détaillés

**Backend :**
```bash
# Dans server/.env
LOG_LEVEL=debug
DEBUG=*

# Puis redémarrer
npm run dev
```

**Frontend :**
```bash
# Dans client/.env
VITE_DEBUG=true

# Ouvrir les outils développeur du navigateur (F12)
```

#### Fichiers de log
Les logs sont affichés dans le terminal, mais vous pouvez les rediriger :

```bash
# Sauvegarder les logs backend
npm run dev > backend.log 2>&1

# Sauvegarder les logs frontend
npm run dev > frontend.log 2>&1
```

## 🎓 Prochaines étapes

Une fois l'installation terminée :

1. **Explorer l'interface** : Naviguez dans l'application
2. **Lire la documentation** : [[03-Frontend/Introduction-Vue3|Introduction Vue.js]]
3. **Comprendre l'architecture** : [[01-Architecture/Vue-Ensemble|Vue d'ensemble]]
4. **Modifier du code** : Essayez de changer la couleur d'un bouton
5. **Créer votre premier exercice** : Utilisez l'éditeur canvas

## 📚 Ressources utiles

- [Documentation Node.js](https://nodejs.org/docs/)
- [Guide npm](https://docs.npmjs.com/)
- [Documentation Vue.js](https://vuejs.org/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Besoin d'aide ?

- **Documentation** : Lisez les autres pages de cette doc
- **Issues GitHub** : Reportez les bugs
- **Forums** : Stack Overflow, Reddit r/webdev
- **Chat** : Discord de la communauté Vue.js

---

> 💡 **Astuce** : Bookmarquez cette page ! Vous en aurez besoin pour configurer l'environnement sur de nouvelles machines.

#installation #setup #guide #nodejs #vue #development