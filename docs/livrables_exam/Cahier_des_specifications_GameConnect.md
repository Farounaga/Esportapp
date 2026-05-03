# Cahier des specifications - GameConnect

## Description generale

GameConnect est une application web composee d'un frontend React, d'une API FastAPI et d'une base MySQL. Elle propose une experience complete autour du profil e-sport et de la mise en relation.

## Exigences fonctionnelles

| ID | Exigence | Priorite |
| --- | --- | --- |
| F01 | Un visiteur peut creer un compte. | Haute |
| F02 | Un utilisateur peut se connecter avec email et mot de passe. | Haute |
| F03 | Un utilisateur peut consulter et modifier son profil. | Haute |
| F04 | Un utilisateur peut ajouter, modifier ou supprimer ses jeux. | Haute |
| F05 | Le systeme propose des matchs compatibles. | Haute |
| F06 | Un utilisateur peut accepter ou refuser un match. | Haute |
| F07 | Un utilisateur peut envoyer des messages a un match accepte. | Moyenne |
| F08 | Un utilisateur peut consulter ses notifications. | Moyenne |
| F09 | Un utilisateur peut rechercher des jeux et joueurs. | Moyenne |
| F10 | Un utilisateur peut consulter des statistiques. | Moyenne |

## Exigences non fonctionnelles

| ID | Exigence | Solution retenue |
| --- | --- | --- |
| NF01 | Securiser les mots de passe. | Hash bcrypt. |
| NF02 | Proteger les routes privees. | JWT Bearer. |
| NF03 | Valider les donnees. | Modeles Pydantic. |
| NF04 | Persister les donnees. | MySQL 8. |
| NF05 | Faciliter le deploiement. | Docker Compose. |
| NF06 | Documenter l'API. | Swagger automatique FastAPI. |

## Regles metier principales

- L'email et le pseudo sont uniques.
- Le mot de passe doit respecter une longueur minimale et contenir lettre et chiffre.
- Un utilisateur ne peut pas ajouter deux fois le meme jeu.
- Un profil prive ne doit pas apparaitre dans les suggestions de matching.
- Un match entre deux joueurs est unique.
- La messagerie est reservee aux matchs acceptes.
- La suppression d'un message est logique avec `deleted_at`.

## Critere de validation

Le projet est considere valide si :

- l'application demarre en local ou via Docker ;
- l'inscription et la connexion fonctionnent ;
- un utilisateur peut completer son profil et ajouter des jeux ;
- le matching retourne une liste ou un message explicite ;
- les routes protegees refusent les requetes sans JWT ;
- la documentation permet de reinstaller le projet.
