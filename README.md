# 🎮 GameConnect - Plateforme sociale de gaming e-sport

<div align="center">

![Logo GameConnect](https://media.istockphoto.com/id/1560833158/fr/photo/contr%C3%B4leur-de-jeu-avec-clavier-%C3%A9clair%C3%A9-violet-au-milieu-de-divers-appareils-sans-fil.jpg?s=1024x1024\&w=is\&k=20\&c=CnoqqQkITt9i0rfHQDaR-x9078NzTnPn9zlgBqWt3wc=)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python)](https://python.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Licence-MIT-green.svg?style=flat-square)](LICENSE)

**Connecte-toi • Joue • Conquiers**

*La plateforme ultime pour les gamers : trouve des coéquipiers, crée ta communauté et dominez ensemble la compétition.*

[🚀 Démo en ligne](#demo) • [📖 Documentation](#documentation) • [🐛 Signaler un bug](../../issues) • [💡 Suggérer une fonctionnalité](../../issues)

</div>

---

## 🌟 **Fonctionnalités**

### 🔐 **Gestion des utilisateurs**

* **Authentification sécurisée** — Système de connexion basé sur JWT avec chiffrement des mots de passe
* **Profils riches** — Profils détaillés avec statistiques, préférences et liens sociaux
* **Contrôle de la vie privée** — Réglages précis de visibilité des profils

### 🎮 **Intégration des jeux**

* **Support multi-jeux** — Prise en charge des jeux populaires (FPS, MOBA, Battle Royale, etc.)
* **Suivi des compétences** — Statistiques, rangs et temps de jeu par titre
* **Bibliothèque de jeux** — Organise et présente ton identité de gamer

### 🤝 **Système de mise en relation intelligent**

* **Appariement basé sur l'IA** — Algorithme avancé prenant en compte :

  * Jeux en commun et niveaux de compétence
  * Préférences et disponibilités
  * Localisation géographique et fuseau horaire
  * Préférences de communication
* **Score de compatibilité** — Pourcentage de correspondance avec explications détaillées
* **Notifications** — Alertes pour nouveaux matchs et messages

### 💬 **Espace de communication**

* **Messagerie directe** — Chat sécurisé entre joueurs associés
* **Forums communautaires** — Discussions spécifiques à chaque jeu et sujets généraux

### 📊 **Statistiques & analyses**

* **Statistiques de jeu** — Suivi et visualisation détaillés
* **Indicateurs de performance** — Suivi de ta progression au fil du temps
* **Tendances communautaires** — Découvre les jeux et joueurs les plus populaires

---

## 🏗️ **Architecture technique**

### **Backend**

* **FastAPI 0.104+** — Framework Python asynchrone hautes performances
* **Python 3.10+** — Code typé avec Pydantic v2
* **Uvicorn** — Serveur ASGI ultra-rapide
* **MySQL 8.0** — Base de données relationnelle robuste
* **PyJWT** — Authentification JWT sécurisée
* **bcrypt** — Hachage sécurisé des mots de passe

### **Frontend**

* **React 18.2** — Version moderne avec hooks et fonctionnalités concurrentes
* **Vite 5** — Outil de build ultra rapide
* **Tailwind CSS 3.4** — Framework CSS utilitaire pour un développement rapide
* **Axios** — Client HTTP basé sur les promesses pour les appels API
* **Lucide React** — Icônes modernes et cohérentes

### **Base de données**

* **Conception normalisée** — Relations optimisées entre tables
* **Indexation efficace** — Requêtes rapides et performantes
* **Intégrité des données** — Contraintes et validations complètes

---

## 🚀 **Démarrage rapide**

### **Prérequis**

* Python 3.10 ou supérieur
* pip (gestionnaire de paquets Python)
* MySQL 8.0 ou supérieur
* Node.js 18.0 ou supérieur
* Git

### **Installation**

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/yourusername/gameconnect.git
   cd gameconnect
   ```

2. **Configuration du backend**

   ```bash
   cd API

   # Créer et activer un environnement virtuel
   python -m venv venv
   source venv/bin/activate   # Linux/Mac
   # venv\Scripts\activate    # Windows

   # Installer les dépendances Python
   pip install -r requirements.txt

   # Créer le fichier .env
   cp .env.example .env
   # Modifier .env avec vos identifiants MySQL

   # Créer la base de données
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS esport_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p esport_social < ../localsetup/database.sql

   # Lancer l'API
   uvicorn app.main:app --reload --port 8000
   ```

3. **Configuration du frontend**

   ```bash
   cd frontend
   npm install

   # Lancer le serveur de développement
   npm run dev
   ```

4. **Accès à l'application**

   * Frontend : [http://localhost:5173](http://localhost:5173)
   * Backend API : [http://localhost:8000](http://localhost:8000)
   * Documentation interactive (Swagger) : [http://localhost:8000/docs](http://localhost:8000/docs)
   * Documentation alternative (ReDoc) : [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🔧 **Configuration**

### **Variables d'environnement**

Créer un fichier `.env` dans le dossier `API` :

```env
# Configuration base de données
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=your_password
DB_NAME=esport_social

# Sécurité
JWT_SECRET=ta_clef_secrète_ultra_sécurisée
```

### **Structure de la base**

* `users` — Comptes et authentification
* `user_profiles` — Informations et préférences utilisateur
* `games` — Catalogue et métadonnées des jeux
* `matches` — Système de mise en relation
* `messages` — Communication entre utilisateurs
* `forum_*` — Discussion communautaire

---

## 📚 **Documentation API**

### **Authentification**

```http
POST /register    # Inscription utilisateur
POST /login       # Connexion utilisateur
```

### **Gestion des profils**

```http
GET  /profile     # Récupérer le profil utilisateur
PUT  /profile     # Mettre à jour le profil utilisateur
```

### **Gestion des jeux**

```http
GET    /games              # Obtenir tous les jeux disponibles
GET    /user/games         # Obtenir les jeux d'un utilisateur
POST   /user/games         # Ajouter un jeu au profil
DELETE /user/games/{id}    # Supprimer un jeu du profil
```

### **Système de matchmaking**

```http
POST /matches               # Trouver de nouveaux matchs
GET  /matches               # Obtenir les matchs d'un utilisateur
POST /matches/{id}/accept   # Accepter un match
POST /matches/{id}/reject   # Rejeter un match
```

### **Messagerie**

```http
GET  /messages          # Liste des conversations
GET  /messages/{userId} # Messages avec un utilisateur spécifique
POST /messages          # Envoyer un message
```

### **Statistiques**

```http
GET /stats/platform          # Statistiques globales de la plateforme
GET /stats/user/{id}         # Statistiques d'un utilisateur
GET /stats/popular-players   # Joueurs les plus populaires
```

### **Recherche**

```http
GET /search/players      # Rechercher des joueurs
GET /search/games        # Rechercher des jeux
GET /search/suggestions  # Suggestions de recherche
```

### **Notifications**

```http
GET  /notifications             # Obtenir les notifications
POST /notifications/{id}/read   # Marquer une notification comme lue
POST /notifications/read-all    # Marquer toutes les notifications comme lues
```

---

## 🛣️ **Feuille de route**

### **Phase 1 : Fonctionnalités de base** ✅

* [x] Authentification JWT et gestion des profils
* [x] Bibliothèque de jeux avec suivi des compétences
* [x] Système de matchmaking intelligent
* [x] Messagerie directe
* [x] Forums communautaires
* [x] Statistiques et recherche avancée
* [x] Notifications

### **Phase 2 : Améliorations** 🚧

* [ ] Notifications en temps réel (WebSocket)
* [ ] Interface mobile responsive améliorée
* [ ] Intégration API tierces (Steam, Twitch)
* [ ] Tableau de bord analytique avancé

---

## 🤝 **Contribution**

Tu veux aider au projet ? Voici comment :

1. **Fork le dépôt**
2. **Crée ta branche** (`git checkout -b feature/NouvelleFonctionnalité`)
3. **Commit tes changements** (`git commit -m 'Ajout : Nouvelle fonctionnalité'`)
4. **Push la branche** (`git push origin feature/NouvelleFonctionnalité`)
5. **Ouvre une Pull Request**

### **Bonnes pratiques**

* Respecter PEP 8 (Python) et les conventions FastAPI
* Utiliser ESLint & Prettier (JS/React)
* Rédiger des messages de commit clairs
* Ajouter des tests pour les nouvelles fonctionnalités
* Mettre à jour la documentation si nécessaire

### **Code de conduite**

Ce projet suit le [Code de Conduite Contributor Covenant](CODE_OF_CONDUCT.md).

---

## 🧪 **Tests**

### **Backend**

```bash
cd API
source venv/bin/activate
python -m pytest tests/
```

### **Frontend**

```bash
cd frontend
npm test
# Avec couverture de code
npm run test:coverage
```

---

## 📊 **Performance**

* **Temps de réponse API** : < 100 ms
* **Requêtes SQL** : optimisées
* **Taille du bundle frontend** : < 500 KB gzip
* **Score Lighthouse** : 95+

---

## 🔒 **Sécurité**

* **Mots de passe** : hachage bcrypt + salt
* **JWT** : authentification sécurisée
* **Prévention SQLi** : requêtes préparées
* **Protection XSS** : nettoyage des entrées + CSP
* **CORS** : politiques strictes

---

## 📱 **Navigateurs pris en charge**

| Navigateur | Version |
| ---------- | ------- |
| Chrome     | 88+     |
| Firefox    | 85+     |
| Safari     | 14+     |
| Edge       | 88+     |

---

## 📄 **Licence**

Ce projet est sous licence **MIT** — voir le fichier [LICENSE](LICENSE).

---

## 🙏 **Remerciements**

* [FastAPI](https://fastapi.tiangolo.com/) — Framework backend utilisé
* [React](https://reactjs.org/) — Framework web utilisé
* [Tailwind CSS](https://tailwindcss.com/) — Pour un design moderne et responsive
* [Lucide](https://lucide.dev/) — Pour ses icônes élégantes
* [JWT](https://jwt.io/) — Pour l'authentification sécurisée
* La **communauté gaming** pour son inspiration et ses retours

---

## 📞 **Support**

* **Signaler un bug** : [GitHub Issues](../../issues)
* **Suggérer une fonctionnalité** : [GitHub Issues](../../issues)

---

<div align="center">

**⭐ Mets une étoile si ce projet t'a été utile !**

**Créé par des gamers, pour les gamers** 🎮

</div>
