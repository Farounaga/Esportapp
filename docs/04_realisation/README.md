# 04 - Realisation

## Environnement de developpement

| Element | Version / outil |
| --- | --- |
| OS de developpement | Windows, PowerShell |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Frontend | Node.js 18+, React 18, Vite |
| Base de donnees | MySQL 8 |
| Conteneurisation | Docker, Docker Compose |
| Gestion de versions | Git, GitHub |

## Depot Git

- Depot principal : `https://github.com/Farounaga/Esportapp.git`
- Depot upstream equipe : `https://github.com/R1Sobriquet/Esportapp.git`
- Branche observee lors de la redaction : `main`

## Structure du projet

```text
Esportapp/
  API/                    Backend FastAPI
    app/
      routes/             Endpoints REST
      services/           Logique metier
      models/             Schemas Pydantic
      middleware/         Suivi d'activite
    tests/                Script de test API
    requirements.txt      Dependances Python
    Dockerfile            Image backend
  frontend/               Application React
    src/
      pages/              Ecrans principaux
      components/         Composants reutilisables
      services/           Clients Axios
      contexts/           Auth, theme, toasts
      __tests__/          Tests Jest
    Dockerfile            Build + Nginx
  deploy/
    docker/
      mysql-init/         Schema SQL d'initialisation Docker
      vm/                 Compose separe par VM
  localsetup/
    database.sql          Script SQL local
  docker-compose.yml      Lancement full stack
  docs/                   Dossier de documentation BTS
```

## Installation locale sans Docker

### Backend

```bash
cd API
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

Variables principales dans `API/.env` :

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=mot_de_passe
DB_NAME=esport_social
JWT_SECRET=secret_long_et_unique
CORS_ORIGINS=http://localhost:5173
```

### Base de donnees

```bash
mysql -u root -p < localsetup/database.sql
```

Pour le deploiement Docker, le schema est initialise depuis :

```text
deploy/docker/mysql-init/00_schema.sql
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

URL de developpement :

- Frontend : `http://localhost:5173`
- API : `http://localhost:8000`
- Swagger : `http://localhost:8000/docs`

## Lancement avec Docker Compose

Depuis la racine du projet :

```bash
docker compose up -d --build
```

Services lances :

| Service | Role | Port par defaut |
| --- | --- | --- |
| `db` | MySQL 8 avec volume persistant | 3306 |
| `api` | FastAPI | 8000 |
| `frontend` | React servi par Nginx | 8080 |

Arret :

```bash
docker compose down
```

Arret avec suppression du volume de base :

```bash
docker compose down -v
```

## Endpoints API principaux

| Domaine | Endpoints |
| --- | --- |
| Authentification | `POST /register`, `POST /login` |
| Profil | `GET /profile`, `PUT /profile`, `GET /user/activity-stats` |
| Jeux | `GET /games`, `GET /user/games`, `POST /user/games`, `PUT /user/games/{game_id}`, `DELETE /user/games/{game_id}` |
| Matching | `POST /matches`, `GET /matches`, `POST /matches/{match_id}/accept`, `POST /matches/{match_id}/reject` |
| Messages | `GET /messages`, `GET /messages/{other_user_id}`, `POST /messages`, `DELETE /messages/{message_id}` |
| Notifications | `GET /notifications`, `GET /notifications/unread-count`, `POST /notifications/{id}/read`, `POST /notifications/read-all`, `DELETE /notifications/{id}` |
| Recherche | `GET /search/players`, `GET /search/games`, `GET /search/suggestions` |
| Statistiques | `GET /stats/platform`, `GET /stats/popular-players`, `GET /stats/recently-active`, `GET /stats/top-matchers`, `GET /stats/games-ranking`, `GET /stats/user/{user_id}` |

## Scripts et fichiers importants

| Fichier | Utilite |
| --- | --- |
| `API/app/main.py` | Point d'entree FastAPI. |
| `API/app/config.py` | Gestion des variables d'environnement et secrets. |
| `API/app/database.py` | Connexion MySQL et context manager. |
| `API/app/services/auth.py` | JWT et bcrypt. |
| `API/app/services/matching.py` | Calcul du score de compatibilite. |
| `frontend/src/services/config.js` | Client Axios et injection du token. |
| `docker-compose.yml` | Orchestration db/api/frontend. |
| `deploy/docker/mysql-init/00_schema.sql` | Schema SQL de deploiement. |
