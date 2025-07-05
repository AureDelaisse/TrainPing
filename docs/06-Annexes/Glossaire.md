# Glossaire des termes

## 🎯 Termes généraux développement web

### A

**API (Application Programming Interface)**
Interface qui permet à deux applications de communiquer entre elles. Dans notre cas, l'API REST permet au frontend Vue.js de communiquer avec le backend Node.js.

**Asynchrone**
Code qui ne bloque pas l'exécution. Permet d'effectuer plusieurs tâches en parallèle sans attendre qu'une tâche se termine pour commencer la suivante.

### C

**CORS (Cross-Origin Resource Sharing)**
Mécanisme de sécurité qui permet à une page web de faire des requêtes vers un autre domaine que celui qui la sert. Nécessaire quand frontend et backend sont sur des ports différents.

**CRUD**
Create, Read, Update, Delete - Les quatre opérations de base sur les données.

**CSS (Cascading Style Sheets)**
Langage pour styliser les pages web (couleurs, mise en page, animations).

### F

**Frontend**
Partie client d'une application web, ce que voit et utilise l'utilisateur final. Dans notre cas : Vue.js + Tailwind CSS.

**Framework**
Ensemble d'outils et de conventions qui facilitent le développement. Vue.js est un framework frontend, Express.js est un framework backend.

### J

**JSON (JavaScript Object Notation)**
Format de données léger et lisible utilisé pour échanger des informations entre le frontend et le backend.

### R

**REST (Representational State Transfer)**
Style d'architecture pour les APIs web. Utilise les méthodes HTTP (GET, POST, PUT, DELETE) pour manipuler les ressources.

**Responsive**
Design qui s'adapte automatiquement à différentes tailles d'écran (mobile, tablette, desktop).

### S

**SPA (Single Page Application)**
Application web qui charge une seule page HTML et met à jour le contenu dynamiquement via JavaScript, sans rechargement complet de la page.

## 🗄️ Termes base de données

### M

**Modèle**
Représentation d'une entité de données avec ses propriétés et relations. Exemple : le modèle Exercise avec title, description, duration...

**Migration**
Script qui modifie la structure de la base de données (ajout de table, modification de colonne, etc.).

### O

**ORM (Object-Relational Mapping)**
Outil qui traduit entre la base de données relationnelle et les objets du code. Prisma est notre ORM.

### P

**Prisma**
ORM moderne pour Node.js qui génère un client type-safe pour accéder à la base de données.

### R

**Relation**
Lien entre deux tables de base de données. Par exemple, une Session a plusieurs Exercises (relation one-to-many).

### S

**Schéma**
Structure qui définit les tables, colonnes et relations de la base de données. Défini dans `prisma/schema.prisma`.

**Seed**
Données initiales insérées dans la base de données pour le développement ou les tests.

**SQLite**
Base de données légère stockée dans un fichier, parfaite pour le développement.

## 🎨 Termes frontend (Vue.js)

### C

**Composant**
Bloc de code Vue.js réutilisable qui encapsule HTML, CSS et JavaScript. Exemple : `ExerciseCard.vue`.

**Computed**
Propriété calculée qui se met à jour automatiquement quand ses dépendances changent.

**Composition API**
API moderne de Vue 3 qui permet d'organiser la logique des composants de manière plus flexible.

### D

**Directive**
Instructions spéciales dans le template Vue. Exemples : `v-if`, `v-for`, `v-model`.

### P

**Props**
Données passées d'un composant parent vers un composant enfant.

**Pinia**
Bibliothèque de gestion d'état globale pour Vue.js 3, remplace Vuex.

### R

**Réactivité**
Système de Vue.js qui met automatiquement à jour l'interface quand les données changent.

**ref()**
Fonction Vue 3 qui rend une valeur réactive. Utiliser `.value` pour accéder/modifier la valeur en JavaScript.

**reactive()**
Fonction Vue 3 qui rend un objet réactif. Accès direct aux propriétés.

**Router**
Système de navigation entre les pages d'une SPA sans rechargement.

### S

**Store**
Conteneur global pour l'état de l'application (données partagées entre composants).

**Script Setup**
Syntaxe moderne de Vue 3 qui simplifie l'écriture des composants.

### T

**Template**
Partie HTML du composant Vue avec syntaxe étendue (interpolation, directives).

**Tailwind CSS**
Framework CSS utility-first qui utilise des classes prédéfinies plutôt que du CSS custom.

### W

**Watcher**
Fonction qui observe les changements d'une donnée réactive et exécute du code en conséquence.

## 🚀 Termes backend (Node.js)

### E

**Express.js**
Framework web minimaliste pour Node.js qui facilite la création d'APIs et serveurs web.

**Endpoint**
URL spécifique d'une API qui répond à une requête HTTP. Exemple : `GET /api/exercises`.

### M

**Middleware**
Fonction qui s'exécute entre la réception d'une requête et l'envoi de la réponse. Utilisé pour l'authentification, logging, CORS...

**Module**
Fichier JavaScript qui exporte des fonctions/classes réutilisables. Système de modules ES6 ou CommonJS.

### N

**Node.js**
Environnement d'exécution JavaScript côté serveur, basé sur le moteur V8 de Chrome.

**npm (Node Package Manager)**
Gestionnaire de paquets pour Node.js, permet d'installer des bibliothèques tierces.

### P

**Package.json**
Fichier de configuration d'un projet Node.js qui liste les dépendances et scripts.

**Promise**
Objet JavaScript représentant le résultat futur d'une opération asynchrone.

### R

**Route**
Définition d'un endpoint avec sa méthode HTTP et sa fonction de traitement.

**Request (req)**
Objet contenant les informations de la requête HTTP (URL, paramètres, body...).

**Response (res)**
Objet pour envoyer la réponse HTTP (status, données, headers...).

## 🎨 Termes Canvas (Konva.js)

### K

**Konva.js**
Bibliothèque JavaScript pour créer des applications canvas 2D interactives et performantes.

### L

**Layer**
Calque dans Konva qui groupe des éléments graphiques. Permet d'organiser et optimiser le rendu.

### S

**Stage**
Conteneur principal Konva qui représente l'ensemble du canvas.

**Shape**
Forme géométrique dans Konva (rectangle, cercle, ligne...).

## ⚾ Termes tennis de table

### E

**Effet**
Rotation donnée à la balle : lifté (topspin), coupé (backspin), latéral (sidespin).

**Exercice**
Séquence de coups définissant un entraînement spécifique avec objectifs pédagogiques.

### P

**Phase d'entraînement**
Étape dans la progression : échauffement, régularité, incertitude, situation de match.

### S

**Session**
Séance d'entraînement complète composée de plusieurs exercices.

**Smash**
Coup d'attaque puissant joué en force, généralement près de la table.

### T

**Trajectoire**
Chemin suivi par la balle, représenté visuellement dans notre éditeur canvas.

**Topspin**
Coup lifté où la balle tourne vers l'avant, lui donnant une trajectoire courbe vers le bas.

## 🛠️ Termes outils développement

### D

**Debug**
Processus de recherche et correction des erreurs dans le code.

**DevTools**
Outils de développement intégrés aux navigateurs (F12) pour inspecter, déboguer et optimiser.

### G

**Git**
Système de contrôle de version qui permet de suivre les modifications du code et collaborer.

**GitHub**
Plateforme web pour héberger des repositories Git et collaborer sur des projets.

### H

**Hot Reload**
Rechargement automatique de l'application lors de modifications du code, sans perdre l'état.

### L

**Linting**
Analyse statique du code pour détecter les erreurs et faire respecter les conventions.

### V

**Vite**
Outil de build moderne et rapide pour les applications frontend, utilisé avec Vue 3.

**VS Code**
Éditeur de code populaire et gratuit de Microsoft, avec excellent support Vue.js.

## 🔗 Acronymes courants

- **API** : Application Programming Interface
- **CORS** : Cross-Origin Resource Sharing  
- **CSS** : Cascading Style Sheets
- **CRUD** : Create, Read, Update, Delete
- **DOM** : Document Object Model
- **HTML** : HyperText Markup Language
- **HTTP** : HyperText Transfer Protocol
- **JSON** : JavaScript Object Notation
- **MVP** : Minimum Viable Product
- **npm** : Node Package Manager
- **ORM** : Object-Relational Mapping
- **REST** : Representational State Transfer
- **SPA** : Single Page Application
- **SQL** : Structured Query Language
- **UI** : User Interface
- **UX** : User Experience
- **WSL** : Windows Subsystem for Linux

## 📝 Conventions de nommage

### Frontend
- **Composants** : PascalCase (`ExerciseCard.vue`)
- **Variables** : camelCase (`exerciseList`)
- **CSS Classes** : kebab-case (`exercise-card`)
- **Props** : camelCase (`showDetails`)

### Backend
- **Fichiers** : camelCase (`exerciseController.js`)
- **Fonctions** : camelCase (`getAllExercises`)
- **Constants** : UPPER_SNAKE_CASE (`PORT`, `DATABASE_URL`)
- **Routes** : kebab-case (`/api/exercises`)

### Base de données
- **Tables** : PascalCase (`Exercise`, `Session`)
- **Colonnes** : camelCase (`createdAt`, `updatedAt`)
- **Enums** : UPPER_SNAKE_CASE (`WARM_UP`, `BEGINNER`)

## 🎓 Pour aller plus loin

- **MDN Web Docs** : Documentation de référence web
- **Vue.js Guide** : Documentation officielle Vue
- **Node.js Docs** : Documentation officielle Node
- **Prisma Docs** : Guide complet Prisma
- **Tailwind Docs** : Classes et composants CSS

#glossaire #termes #définitions #développement #web #vue #node #javascript