# 01 - Contexte et cahier des charges

## Presentation du projet

GameConnect est une application web destinee aux joueurs de jeux video competitifs ou casual. L'objectif est de faciliter la mise en relation entre joueurs compatibles selon leurs jeux, leur niveau, leur region, leur fuseau horaire et leurs objectifs de jeu.

Le projet repond a un besoin frequent dans l'e-sport amateur : trouver rapidement des coequipiers fiables, communiquer avec eux et suivre son profil de joueur dans une interface centralisee.

## Problematique

Un joueur peut avoir des difficultes a trouver des partenaires adaptes a son niveau et a ses disponibilites. Les solutions existantes sont souvent dispersees entre Discord, forums, plateformes de jeu et reseaux sociaux. GameConnect centralise les informations importantes et propose un matching structure.

## Objectifs fonctionnels

- Permettre a un utilisateur de creer un compte et de se connecter.
- Permettre a un utilisateur de completer son profil de joueur.
- Permettre a un utilisateur d'ajouter des jeux a son profil avec son niveau, son rang et son temps de jeu.
- Proposer des joueurs compatibles grace a un score de matching.
- Permettre d'accepter ou de refuser une mise en relation.
- Autoriser la messagerie seulement entre joueurs ayant un match accepte.
- Afficher des statistiques globales et des classements.
- Gerer les notifications utilisateur.

## Objectifs non fonctionnels

- Securiser l'authentification par JWT et hachage bcrypt des mots de passe.
- Valider les donnees cote API avec Pydantic.
- Utiliser une base de donnees relationnelle normalisee.
- Proposer une interface web responsive.
- Faciliter le deploiement avec Docker Compose.
- Maintenir une architecture separee entre frontend, API et base de donnees.

## Acteurs

| Acteur | Role |
| --- | --- |
| Visiteur | Consulte l'accueil, s'inscrit ou se connecte. |
| Joueur connecte | Gere son profil, ses jeux, ses matchs, messages et notifications. |
| Systeme | Calcule les scores, applique les regles de securite, enregistre l'activite. |
| Administrateur technique | Installe, configure, teste et deploie l'application. |

## User stories principales

| ID | User story | Priorite | Critere d'acceptation |
| --- | --- | --- | --- |
| US01 | En tant que visiteur, je veux creer un compte afin d'utiliser la plateforme. | Haute | L'email et le pseudo sont uniques, le mot de passe est valide, un token est retourne. |
| US02 | En tant qu'utilisateur, je veux me connecter afin d'acceder a mon espace personnel. | Haute | La connexion retourne un JWT si les identifiants sont corrects. |
| US03 | En tant que joueur, je veux modifier mon profil afin de presenter mon niveau et mes preferences. | Haute | Les champs sont valides et sauvegardes en base. |
| US04 | En tant que joueur, je veux ajouter mes jeux afin d'ameliorer le matching. | Haute | Un meme jeu ne peut pas etre ajoute deux fois au meme profil. |
| US05 | En tant que joueur, je veux obtenir des suggestions de coequipiers afin de jouer avec des personnes compatibles. | Haute | Le systeme retourne des profils avec un score de compatibilite. |
| US06 | En tant que joueur, je veux accepter ou refuser un match afin de controler mes relations. | Haute | Le statut du match passe a accepted ou rejected. |
| US07 | En tant que joueur, je veux envoyer des messages afin d'organiser des parties. | Moyenne | La messagerie est accessible seulement si le match est accepte. |
| US08 | En tant que joueur, je veux consulter mes notifications afin de suivre les evenements importants. | Moyenne | Les notifications peuvent etre listees, marquees comme lues ou supprimees. |
| US09 | En tant que joueur, je veux rechercher des jeux et joueurs afin de decouvrir la communaute. | Moyenne | Les resultats sont filtres par criteres. |
| US10 | En tant qu'administrateur technique, je veux deployer l'application simplement afin de la rendre disponible. | Haute | Les services db, api et frontend demarrent avec Docker Compose. |

## Backlog synthetique

| Fonctionnalite | Etat dans le projet |
| --- | --- |
| Authentification JWT | Realisee |
| Profil utilisateur | Realisee |
| Catalogue de jeux | Realisee |
| Jeux favoris et niveaux | Realisee |
| Matching pondere | Realisee |
| Messagerie entre matchs acceptes | Realisee |
| Notifications | Realisee |
| Statistiques et recherche | Realisee |
| Deploiement Docker | Realise |
| Tests frontend Jest | Presents |
| Tests API automatises | Presents sous forme de script |
| Interface forum | Commencee cote frontend |

## Contraintes

- L'application doit pouvoir fonctionner en local pendant le developpement.
- Les donnees doivent etre persistantes dans MySQL.
- Les secrets ne doivent pas etre stockes en dur en production.
- Les appels API doivent etre compatibles avec le frontend React.
- Le projet doit rester comprehensible et presentable dans un cadre BTS SIO SLAM.
