
# 🚀 API FastAPI - Plateforme d'E-Sport Social

API REST complète pour la plateforme sociale gaming avec authentification JWT, matching de joueurs et messagerie.

## ✨ Fonctionnalités

* 🔐 **Authentification JWT** sécurisée
* 👤 **Gestion des profils** utilisateurs
* 🎮 **Catalogue de jeux** et profils gaming
* 🤝 **Système de matching** intelligent
* 💬 **Messagerie** entre utilisateurs matchés
* 📊 **Documentation API** interactive (Swagger/ReDoc)

## 📋 Prérequis

* Python 3.8+
* MySQL 5.7+ ou MariaDB
* pip (gestionnaire de paquets Python)

## ⚡ Installation Rapide

### 1. Cloner et configurer

```bash
# Aller dans le dossier API
cd API

# Créer un environnement virtuel (recommandé)
python -m venv venv

# Activer l'environnement virtuel
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 2. Configuration de l'environnement

Créer un fichier `.env` dans le dossier `/API` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=esport_social
JWT_SECRET=your-secret-key-change-this
```

### 3. Base de données

```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS esport_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Importer le schéma (présent dans /API)
mysql -u root -p esport_social < database.sql

# (Optionnel) Ajouter des données de test
mysql -u root -p esport_social < test_data.sql
```

### 4. Lancer l'API

```bash
# Méthode 1: Lancer FastAPI directement
python app/main.py 

# Méthode 2: Avec uvicorn (plus recommandé)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 
```

L'API sera accessible sur : **[http://localhost:8000](http://localhost:8000)**

## 📚 Documentation

### Documentation Interactive

* **Swagger UI** : [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc** : [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Endpoints Principaux

#### 🔐 Authentification

| Méthode | Endpoint    | Description             |
| ------- | ----------- | ----------------------- |
| POST    | `/register` | Créer un nouveau compte |
| POST    | `/login`    | Se connecter            |

#### 👤 Profils

| Méthode | Endpoint   | Description              | Auth |
| ------- | ---------- | ------------------------ | ---- |
| GET     | `/profile` | Obtenir son profil       | ✅    |
| PUT     | `/profile` | Mettre à jour son profil | ✅    |

#### 🎮 Jeux

| Méthode | Endpoint           | Description         | Auth |
| ------- | ------------------ | ------------------- | ---- |
| GET     | `/games`           | Liste tous les jeux | ❌    |
| GET     | `/user/games`      | Mes jeux            | ✅    |
| POST    | `/user/games`      | Ajouter un jeu      | ✅    |
| DELETE  | `/user/games/{id}` | Retirer un jeu      | ✅    |

#### 🤝 Matching

| Méthode | Endpoint               | Description        | Auth |
| ------- | ---------------------- | ------------------ | ---- |
| POST    | `/matches`             | Trouver des matchs | ✅    |
| GET     | `/matches`             | Mes matchs         | ✅    |
| POST    | `/matches/{id}/accept` | Accepter un match  | ✅    |
| POST    | `/matches/{id}/reject` | Rejeter un match   | ✅    |

#### 💬 Messages

| Méthode | Endpoint              | Description                  | Auth |
| ------- | --------------------- | ---------------------------- | ---- |
| GET     | `/messages`           | Conversations                | ✅    |
| GET     | `/messages/{user_id}` | Messages avec un utilisateur | ✅    |
| POST    | `/messages`           | Envoyer un message           | ✅    |

## 🧪 Tests avec cURL

### Créer un compte

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "profile": {
      "region": "Europe",
      "skill_level": "intermediate"
    }
  }'
```

### Se connecter

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Obtenir son profil (avec token)

```bash
curl -X GET http://localhost:8000/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Développement

### Structure du projet

```
API/
│   .env
│   deploy_secure.sh
│   generate_hash.py
│   README.md
│   requirements.txt
│   run.py
│   security_check.py
│   database.sql
│   test_data.sql
│
├── app
│   │   config.py
│   │   database.py
│   │   main.py              # Point d'entrée réel
│   │   __init__.py
│   │
│   ├── middleware
│   │   └── activity.py
│   │
│   ├── models
│   │   ├── game.py
│   │   ├── match.py
│   │   ├── message.py
│   │   └── user.py
│   │
│   ├── routes
│   │   ├── auth.py
│   │   ├── games.py
│   │   ├── matching.py
│   │   ├── messages.py
│   │   └── profile.py
│   │
│   ├── services
│   │   ├── activity_monitor.py
│   │   └── auth.py
│   │
│   └── schemas              # (À créer si pas encore présent)
│       ├── user.py
│       ├── game.py
│       ├── match.py
│       └── message.py
│
│
├── tests
│   └── test_api.py
│
└── venv                     # Environnement virtuel
```

### Modèles Pydantic

L'API utilise Pydantic pour la validation des données :

* `UserRegister` : Inscription
* `UserLogin` : Connexion
* `UserProfile` : Profil utilisateur
* `UserGame` : Jeu d'un utilisateur
* `Message` : Message entre utilisateurs

## 🛡️ Sécurité

* Mots de passe hachés avec **bcrypt**
* Tokens JWT avec expiration de 7 jours
* Validation des données avec Pydantic
* CORS configuré pour le frontend

## 🐛 Dépannage

### Erreur MySQL

```
MySQLdb.OperationalError: (2003, "Can't connect to MySQL server")
```

**Solution :**

* Vérifier que MySQL est démarré
* Vérifier les identifiants `.env`
* Vérifier le port (3306)

### Module manquant

```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution :**

```bash
pip install -r requirements.txt
```

### Token invalide

* Vérifier `JWT_SECRET`
* Envoyer correctement le header :

  ```
  Authorization: Bearer TOKEN
  ```

## 🚀 Production

1. Modifier `JWT_SECRET`
2. Utiliser gunicorn :

```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

3. Ajouter un reverse proxy (nginx)
4. Activer HTTPS
5. Limiter les CORS

## 📝 Licence

Projet éducatif - E-Sport Social Platform