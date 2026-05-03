# Stack technique - GameConnect

## Vue d'ensemble

L'application est separee en trois services :

- frontend React ;
- API FastAPI ;
- base de donnees MySQL.

## Frontend

| Technologie | Role |
| --- | --- |
| React 18 | Construction de l'interface utilisateur. |
| Vite | Serveur de developpement et outil de build. |
| React Router | Navigation entre les pages. |
| Axios | Appels HTTP vers l'API. |
| Tailwind CSS | Mise en forme rapide et responsive. |
| Jest / Testing Library | Tests frontend. |

## Backend

| Technologie | Role |
| --- | --- |
| Python | Langage backend. |
| FastAPI | Framework API REST. |
| Pydantic | Validation des donnees. |
| Uvicorn | Serveur ASGI. |
| PyJWT | Creation et verification des tokens JWT. |
| bcrypt | Hachage des mots de passe. |
| mysqlclient | Connexion a MySQL. |

## Base de donnees

| Element | Description |
| --- | --- |
| MySQL 8 | SGBDR relationnel. |
| `localsetup/database.sql` | Script local de creation de base. |
| `deploy/docker/mysql-init/00_schema.sql` | Script Docker d'initialisation. |
| Index SQL | Optimisation des recherches et relations. |
| Contraintes FK | Integrite referentielle. |

## Deploiement

| Service Docker | Description |
| --- | --- |
| `db` | MySQL avec volume persistant. |
| `api` | Backend FastAPI expose sur le port 8000. |
| `frontend` | Build React servi par Nginx sur le port 8080. |

Commande principale :

```bash
docker compose up -d --build
```

## Justification

Cette stack est adaptee a un projet BTS SIO SLAM car elle montre :

- une architecture web moderne ;
- une API REST securisee ;
- une base relationnelle exploitable pour MCD/MLD ;
- un deploiement reproductible ;
- une separation claire entre presentation, metier et donnees.
