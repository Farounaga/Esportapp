# Dossier de documentation - GameConnect

Projet : GameConnect, plateforme sociale e-sport permettant a des joueurs de creer un profil, declarer leurs jeux, trouver des coequipiers compatibles, accepter ou refuser des matchs et echanger par messagerie.

Contexte BTS SIO SLAM : cette documentation est structuree pour un dossier d'examen. Elle met en avant l'analyse du besoin, la conception applicative, la realisation technique, les tests, le deploiement et le bilan du projet.

## Sommaire

| Section | Contenu attendu | Fichier |
| --- | --- | --- |
| 01 | Cahier des charges, expression des besoins, backlog | [01_contexte](01_contexte/README.md) |
| 02 | Cas d'utilisation, regles metier, choix techniques | [02_analyse](02_analyse/README.md) |
| 03 | MCD, MLD, classes, sequences, maquettes, architecture | [03_conception](03_conception/README.md) |
| 04 | Environnement de developpement, Git, BDD et scripts | [04_realisation](04_realisation/README.md) |
| 05 | Plan de tests, tests unitaires, rapport de tests | [05_tests](05_tests/README.md) |
| 06 | Documentation technique et utilisateur | [06_documentation](06_documentation/README.md) |
| 07 | Bilan et axes d'amelioration | [07_bilan](07_bilan/README.md) |

Un second classement, plus proche du dossier exemple fourni sur Google Drive, est disponible ici : [livrables_exam](livrables_exam/README.md). Il reprend les noms de livrables classiques : note de cadrage, cahier des specifications, plan agile, stack technique, suivi Trello et explication MCD/MLD.

## Competences BTS SIO SLAM mobilisees

- Analyser les objectifs et les modalites d'organisation d'un projet applicatif.
- Concevoir et developper une solution applicative web.
- Realiser et exploiter une base de donnees relationnelle.
- Mettre en place des tests et corriger les anomalies.
- Deployer une application multi-services.
- Rediger une documentation technique et utilisateur exploitable.

## Technologies principales

- Frontend : React 18, Vite, React Router, Axios, Tailwind CSS.
- Backend : Python, FastAPI, Pydantic, Uvicorn.
- Base de donnees : MySQL 8, scripts SQL versionnes.
- Securite : JWT, bcrypt, validation Pydantic, CORS configure.
- Deploiement : Docker Compose, Nginx pour le frontend, healthchecks.
